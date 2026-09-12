// @paths lib/dat-parser/fuzz
/**
 * CM-T09: fuzz suite — malformed .dat must fail gracefully.
 *
 * Contract under test (per CM-T09 card):
 *   For every corruption mode × seed, calling a parser entry point on the
 *   corrupted buffer must either:
 *     - throw a DatParseError (typed, with file context), or
 *     - return a result without throwing,
 *   and must NEVER: throw a foreign error (RangeError/TypeError/…),
 *   hang (vitest per-test timeout), or read out of bounds.
 *
 * Truncation semantics by format shape (documented, not hidden):
 *   - index.dat: 8-byte header + fixed 67-byte entries → header/entry
 *     truncation is detectable → typed DatParseError.
 *   - club.dat / nat_club.dat / nation.dat / *.dat names: flat struct
 *     arrays with NO count header → a truncated file yields floor(len/size)
 *     records ("tolerant short read"). Local truncation detection is
 *     impossible at parser level; record-count cross-checks against
 *     index.dat are the import-pipeline's job (CM-T07). The fuzz contract
 *     for these is: no foreign errors, no OOB, no hangs.
 *
 * Runs on synthetic fixtures only — no real corpus required, green in CI.
 * Real-corpus validation lives in fuzz.real-data.test.ts (skips without
 * CM0102_DATA_DIR).
 */
import { describe, it, expect } from 'vitest';
import { buildMatrix, corruptBuffer, ALL_MODES, type CorruptionCase } from './generate';
import {
  parseIndexDat,
  parseClubDat,
  parseNatClubDat,
  parseNationDat,
  parseNamesDat,
  DatParseError,
} from '../parser';

const SEEDS = [1, 2, 3, 4, 5];

// Real struct sizes (parser.ts constants).
const INDEX_HEADER = 8;
const TINDEX_SIZE = 67; // byte[51] name + i32 fileType + i32 count + i32 offset + i32 version
const TCLUB_SIZE = 581;
const TNATION_SIZE = 290;
const TNAME_SIZE = 60;

/** index.dat-shaped: 8-byte zero header + N × 67-byte TIndex entries. */
function syntheticIndex(count: number): ArrayBuffer {
  const buf = new ArrayBuffer(INDEX_HEADER + count * TINDEX_SIZE);
  const v = new DataView(buf);
  for (let i = 0; i < count; i++) {
    const off = INDEX_HEADER + i * TINDEX_SIZE;
    const name = `seg${i}.dat`;
    for (let j = 0; j < name.length; j++) v.setUint8(off + j, name.charCodeAt(j));
    v.setInt32(off + 51, 6 + i, true); // fileType
    v.setInt32(off + 55, 10, true); // count
    v.setInt32(off + 59, INDEX_HEADER + count * TINDEX_SIZE, true); // offset
    v.setInt32(off + 63, 1, true); // version
  }
  return buf;
}

/** Flat struct-array buffer (club/nation/names shape — no count header). */
function syntheticFlat(count: number, structSize: number): ArrayBuffer {
  const buf = new ArrayBuffer(count * structSize);
  const v = new DataView(buf);
  for (let i = 0; i < count; i++) {
    // Plausible id + a name byte so records are non-degenerate pre-corruption.
    v.setInt32(i * structSize, 1000 + i, true);
    v.setUint8(i * structSize + 4, 0x41); // 'A'
  }
  return buf;
}

function runCase(fn: () => unknown, c: CorruptionCase): 'ok' | 'typed' {
  try {
    fn();
    return 'ok';
  } catch (e) {
    if (e instanceof DatParseError) return 'typed';
    // Diagnostic: record what escaped so the failure is actionable.
    throw new Error(
      `NON-TYPED ERROR escaped parser on mode=${c.mode} seed=${c.seed}: ` +
        `${(e as Error)?.name}: ${(e as Error)?.message}`
    );
  }
}

describe('CM-T09 fuzz: synthetic corruption matrix', () => {
  it('generator is deterministic — same seed reproduces byte-identical buffers', () => {
    const base = syntheticFlat(5, TCLUB_SIZE);
    for (const mode of ALL_MODES) {
      const a = corruptBuffer(base, { mode, seed: 42, structSize: TCLUB_SIZE });
      const b = corruptBuffer(base, { mode, seed: 42, structSize: TCLUB_SIZE });
      expect(Buffer.from(new Uint8Array(a))).toEqual(Buffer.from(new Uint8Array(b)));
    }
  });

  it('index.dat: empty file → DatParseError (typed), not RangeError', () => {
    expect(() => parseIndexDat(new ArrayBuffer(0))).toThrow(DatParseError);
  });

  it('index.dat: 1-byte truncation → DatParseError, never RangeError', () => {
    expect(() =>
      parseIndexDat(corruptBuffer(syntheticIndex(5), { mode: 'truncate-1', seed: 1 }))
    ).toThrow(DatParseError);
  });

  it('flat parsers: empty file → empty array, no throw (tolerant short read)', () => {
    expect(parseClubDat(new ArrayBuffer(0))).toEqual([]);
    expect(parseNationDat(new ArrayBuffer(0))).toEqual([]);
    expect(parseNamesDat(new ArrayBuffer(0))).toEqual([]);
  });

  describe('matrix: parseIndexDat', () => {
    const base = syntheticIndex(5);
    const matrix = buildMatrix(SEEDS, TINDEX_SIZE);

    for (const c of matrix) {
      it(`${c.mode} seed=${c.seed} → typed-or-clean, no foreign error`, () => {
        const buf = corruptBuffer(base, c);
        const outcome = runCase(() => parseIndexDat(buf), c);
        expect(['ok', 'typed']).toContain(outcome);
      });
    }
  });

  describe('matrix: parseClubDat / parseNatClubDat (TClub, 581B)', () => {
    const base = syntheticFlat(5, TCLUB_SIZE);
    const matrix = buildMatrix(SEEDS, TCLUB_SIZE);

    for (const c of matrix) {
      it(`club ${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(base, c);
        expect(['ok', 'typed']).toContain(runCase(() => parseClubDat(buf), c));
      });
      it(`nat_club ${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(base, c);
        expect(['ok', 'typed']).toContain(runCase(() => parseNatClubDat(buf), c));
      });
    }
  });

  describe('matrix: parseNationDat (TNation, 290B)', () => {
    const base = syntheticFlat(5, TNATION_SIZE);
    const matrix = buildMatrix(SEEDS, TNATION_SIZE);

    for (const c of matrix) {
      it(`nation ${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(base, c);
        expect(['ok', 'typed']).toContain(runCase(() => parseNationDat(buf), c));
      });
    }
  });

  describe('matrix: parseNamesDat (TName, 60B)', () => {
    const base = syntheticFlat(5, TNAME_SIZE);
    const matrix = buildMatrix(SEEDS, TNAME_SIZE);

    for (const c of matrix) {
      it(`names ${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(base, c);
        expect(['ok', 'typed']).toContain(runCase(() => parseNamesDat(buf), c));
      });
    }
  });
});