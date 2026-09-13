// @paths lib/dat-parser
/**
 * CM-T11: performance budgets as FAILING tests (L4 adversarial — see
 * docs/vault/testing/test-strategy.md). These are budgets, not benchmarks:
 * they must fail loudly the day the parser or engine regresses.
 *
 * Real .dat files are the copyrighted retail 2001 database — never
 * committed to the repo. Reads are staged outside it at DATA_DIR; the
 * suite skips itself (rather than failing) when that directory is absent,
 * same guard as real-data.test.ts.
 *
 * Run in isolation via `npm run test:perf` (vitest.perf.config.ts), which
 * also passes `--expose-gc` so the heap-ceiling assertion can force a
 * collection before/after measuring instead of reading noisy raw deltas.
 * This suite is excluded from the default `npm test` run (see
 * vitest.config.ts) — it belongs to the L4/phase-gate tier, not every PR.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseIndexDat, parseStaffDat, type DatIndexEntry } from '../parser';

const DATA_DIR = '/home/ramamos/cm0102-game-data';
const HAS_REAL_DATA = existsSync(DATA_DIR);

function loadBuffer(fileName: string): ArrayBuffer {
  const buf = readFileSync(join(DATA_DIR, fileName));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function forceGc(): void {
  // Only present when the process was launched with --expose-gc
  // (vitest.perf.config.ts sets this); degrade gracefully otherwise.
  const gc = (globalThis as { gc?: () => void }).gc;
  if (typeof gc === 'function') gc();
}

// ─── Budget 1+2: real 30MB staff.dat parse — time + heap ───

const PARSE_TIME_BUDGET_MS = 5_000;
const PARSE_HEAP_BUDGET_BYTES = 120 * 1024 * 1024;

describe.runIf(HAS_REAL_DATA)('CM-T11: staff.dat parse budgets', () => {
  let indexEntries: DatIndexEntry[];
  let staffBuffer: ArrayBuffer;

  beforeAll(() => {
    // staff.dat needs index.dat's segment directory to know where the
    // staff/non-player/player records live; only the staff.dat parse
    // itself is timed/measured below, this setup is untimed.
    indexEntries = parseIndexDat(loadBuffer('index.dat'));
    staffBuffer = loadBuffer('staff.dat');
  });

  it(`staff.dat is the expected real fixture (~30MB)`, () => {
    const size = statSync(join(DATA_DIR, 'staff.dat')).size;
    expect(size).toBe(30_150_534);
  });

  it(`parses the real 30MB staff.dat in under ${PARSE_TIME_BUDGET_MS}ms`, () => {
    const start = performance.now();
    const bundle = parseStaffDat(staffBuffer, indexEntries);
    const elapsedMs = performance.now() - start;

    expect(bundle.staff.length).toBeGreaterThan(0);
    expect(elapsedMs).toBeLessThan(PARSE_TIME_BUDGET_MS);
    // eslint-disable-next-line no-console
    console.log(`[perf] staff.dat parse: ${elapsedMs.toFixed(1)}ms (budget ${PARSE_TIME_BUDGET_MS}ms)`);
  });

  it(`keeps heap growth from the staff.dat parse under ${PARSE_HEAP_BUDGET_BYTES / (1024 * 1024)}MB`, () => {
    forceGc();
    const before = process.memoryUsage().heapUsed;

    const bundle = parseStaffDat(staffBuffer, indexEntries);
    // Keep a reference so the parsed result can't be collected before we
    // measure — we want the resident cost of the retained structures.
    const retained = bundle.staff.length + bundle.players.size;

    const afterRaw = process.memoryUsage().heapUsed;
    forceGc();
    const afterGc = process.memoryUsage().heapUsed;

    const growthRaw = afterRaw - before;
    const growthRetained = afterGc - before;

    expect(retained).toBeGreaterThan(0);
    // eslint-disable-next-line no-console
    console.log(
      `[perf] staff.dat parse heap growth: ${(growthRaw / (1024 * 1024)).toFixed(1)}MB raw, ` +
        `${(growthRetained / (1024 * 1024)).toFixed(1)}MB retained after GC ` +
        `(budget ${PARSE_HEAP_BUDGET_BYTES / (1024 * 1024)}MB)`
    );
    expect(growthRetained).toBeLessThanOrEqual(PARSE_HEAP_BUDGET_BYTES);
  });
});

describe.skipIf(HAS_REAL_DATA)('CM-T11: staff.dat parse budgets', () => {
  it.skip(`skipped — staged game data not found at ${DATA_DIR}`, () => {});
});

// ─── Budget 3: 10k seeded mini-match sims, CPU-calibrated ───
//
// There is no match engine yet (CM-014 is still in flight) — CM-T11 is a
// Wave-1 card with no feature dependency, so this budget can't exercise the
// real engine. Instead it locks in a synthetic, seeded "mini-match" workload
// that stands in for the engine's expected per-match cost profile (a fixed
// number of per-minute event rolls with attribute-weighted arithmetic), so
// the budget-and-calibration machinery exists before CM-014 lands. When the
// real engine ships, CM-T05 (engine hardening, cross-assigned) should retire
// this synthetic sim and re-point the budget at real matches.
//
// A hardcoded millisecond budget would be meaningless across machines (CI
// runners, laptops, etc. vary by 3-5x in raw throughput). Instead:
//   1. Measure a fixed arithmetic baseline loop (BASELINE_OPS iterations of
//      plain float math) on THIS machine.
//   2. Express the 10k-sim budget as a multiple of that baseline time
//      (SIM_BUDGET_MULTIPLIER), calibrated so a "reasonable" mini-match
//      engine (see cost model below) fits with headroom on a mid-range
//      dev machine.
// A regression that blows the multiplier is real; a slower CI runner just
// shifts both numbers together.

const BASELINE_OPS = 20_000_000;

function measureArithmeticBaselineMs(): number {
  const start = performance.now();
  let acc = 0;
  for (let i = 0; i < BASELINE_OPS; i++) {
    acc += Math.sqrt(i * 1.0000001) % 7;
  }
  if (acc === Number.POSITIVE_INFINITY) throw new Error('unreachable — keeps acc live');
  return performance.now() - start;
}

// mulberry32 — small, fast, seeded PRNG (deterministic across runs/platforms,
// unlike Math.random). Good enough for a synthetic workload; not a
// cryptographic or statistical claim.
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface MiniMatchResult {
  homeGoals: number;
  awayGoals: number;
}

/**
 * Synthetic per-match cost model: 90 simulated minutes, each rolling a
 * handful of attribute-weighted events for both sides. Deterministic given
 * `seed` — matches CM-T11's "seeded" requirement and the strategy doc's
 * determinism doctrine (same seed -> same result).
 */
function simulateMiniMatch(seed: number): MiniMatchResult {
  const rand = mulberry32(seed);
  let homeGoals = 0;
  let awayGoals = 0;

  for (let minute = 0; minute < 90; minute++) {
    for (let event = 0; event < 4; event++) {
      const homeAttack = 40 + rand() * 60;
      const awayDefence = 40 + rand() * 60;
      const chance = (homeAttack - awayDefence * 0.8 + rand() * 30) / 100;
      if (chance > 0.92) homeGoals++;

      const awayAttack = 40 + rand() * 60;
      const homeDefence = 40 + rand() * 60;
      const awayChance = (awayAttack - homeDefence * 0.8 + rand() * 30) / 100;
      if (awayChance > 0.92) awayGoals++;
    }
  }

  return { homeGoals, awayGoals };
}

const SIM_COUNT = 10_000;
const SIM_BUDGET_MULTIPLIER = 8; // see calibration note above the describe block

describe('CM-T11: mini-match sim budget (CPU-calibrated)', () => {
  it('calibrates against a fixed arithmetic baseline, then runs 10k seeded sims within budget', () => {
    const baselineMs = measureArithmeticBaselineMs();
    const budgetMs = baselineMs * SIM_BUDGET_MULTIPLIER;

    const start = performance.now();
    let totalGoals = 0;
    for (let seed = 0; seed < SIM_COUNT; seed++) {
      const result = simulateMiniMatch(seed);
      totalGoals += result.homeGoals + result.awayGoals;
    }
    const elapsedMs = performance.now() - start;

    // Sanity: the sim actually produces goals (not a no-op loop) and is
    // deterministic for a given seed.
    expect(totalGoals).toBeGreaterThan(0);
    expect(simulateMiniMatch(42)).toEqual(simulateMiniMatch(42));

    // eslint-disable-next-line no-console
    console.log(
      `[perf] arithmetic baseline (${BASELINE_OPS.toLocaleString()} ops): ${baselineMs.toFixed(1)}ms\n` +
        `[perf] ${SIM_COUNT.toLocaleString()} seeded mini-match sims: ${elapsedMs.toFixed(1)}ms ` +
        `(budget ${budgetMs.toFixed(1)}ms = ${SIM_BUDGET_MULTIPLIER}x baseline)`
    );

    expect(elapsedMs).toBeLessThan(budgetMs);
  });
});
