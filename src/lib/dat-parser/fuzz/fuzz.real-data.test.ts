// @paths lib/dat-parser/fuzz
/**
 * CM-T09: real-corpus fuzz validation.
 *
 * Runs the full corruption matrix against the actual vanilla .dat files
 * (staged outside the repo) and asserts the same graceful-failure contract
 * as the synthetic suite: every corrupted variant either parses cleanly or
 * throws DatParseError — never a foreign RangeError/TypeError, never a hang.
 *
 * Skips itself when CM0102_DATA_DIR (or ~/cm0102-game-data) isn't present, so
 * CI without the corpus stays green. NOTE: all readFileSync calls live inside
 * beforeAll/it bodies — describe.skipIf still executes the describe callback
 * at collection time, so file reads at collection scope would ENOENT on CI
 * (learned the hard way; don't move them back out).
 *
 * On the Mac, run with: CM0102_DATA_DIR=~/cm0102-game-data npx vitest run src/lib/dat-parser/fuzz
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { buildMatrix, corruptBuffer, type CorruptionCase } from './generate';
import {
  parseIndexDat,
  parseClubDat,
  parseNatClubDat,
  parseNationDat,
  parseNamesDat,
  parseStaffDat,
  DatParseError,
  type DatIndexEntry,
} from '../parser';

const DATA_DIR = process.env.CM0102_DATA_DIR || join(homedir(), 'cm0102-game-data');
const HAS_REAL_DATA = existsSync(DATA_DIR);

const SEEDS = [1, 2, 3, 4, 5];
const TINDEX_SIZE = 67;
const TCLUB_SIZE = 581;
const TNATION_SIZE = 290;
const TNAME_SIZE = 60;

function loadBuffer(fileName: string): ArrayBuffer {
  const buf = readFileSync(join(DATA_DIR, fileName));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function runCase(fn: () => unknown, c: CorruptionCase, file: string): 'ok' | 'typed' {
  try {
    fn();
    return 'ok';
  } catch (e) {
    if (e instanceof DatParseError) return 'typed';
    throw new Error(
      `NON-TYPED ERROR escaped ${file} on mode=${c.mode} seed=${c.seed}: ` +
        `${(e as Error)?.name}: ${(e as Error)?.message}`
    );
  }
}

describe.skipIf(!HAS_REAL_DATA)('CM-T09 fuzz: real vanilla corpus', () => {
  // Buffers loaded in beforeAll only (never at collection scope — see header).
  let bases: Record<string, ArrayBuffer>;
  let indexEntries: DatIndexEntry[];

  // Matrices are pure metadata (mode × seed) — safe at collection scope.
  const mIndex = buildMatrix(SEEDS, TINDEX_SIZE);
  const mClub = buildMatrix(SEEDS, TCLUB_SIZE);
  const mNation = buildMatrix(SEEDS, TNATION_SIZE);
  const mName = buildMatrix(SEEDS, TNAME_SIZE);

  beforeAll(() => {
    bases = {
      'index.dat': loadBuffer('index.dat'),
      'club.dat': loadBuffer('club.dat'),
      'nat_club.dat': loadBuffer('nat_club.dat'),
      'nation.dat': loadBuffer('nation.dat'),
      'first_names.dat': loadBuffer('first_names.dat'),
      'staff.dat': loadBuffer('staff.dat'),
    };
    indexEntries = parseIndexDat(bases['index.dat']);
  });

  it('corpus baseline parses cleanly before corruption', () => {
    const clubs = parseClubDat(bases['club.dat']);
    const nations = parseNationDat(bases['nation.dat']);
    const names = parseNamesDat(bases['first_names.dat']);
    const staffBundle = parseStaffDat(bases['staff.dat'], indexEntries);
    expect(clubs.length).toBeGreaterThan(100);
    expect(nations.length).toBeGreaterThan(10);
    expect(names.length).toBeGreaterThan(100);
    expect(staffBundle.staff.length).toBeGreaterThan(1000);
    // Real index.dat leftover check: 1482 bytes = 8 + 22 × 67 exactly.
    expect((bases['index.dat'].byteLength - 8) % TINDEX_SIZE).toBe(0);
  });

  describe('index.dat matrix', () => {
    for (const c of mIndex) {
      it(`${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(bases['index.dat'], c);
        expect(['ok', 'typed']).toContain(runCase(() => parseIndexDat(buf), c, 'index.dat'));
      });
    }
  });

  describe('club.dat matrix', () => {
    for (const c of mClub) {
      it(`${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(bases['club.dat'], c);
        expect(['ok', 'typed']).toContain(runCase(() => parseClubDat(buf), c, 'club.dat'));
      });
    }
  });

  describe('nat_club.dat matrix', () => {
    for (const c of mClub) {
      it(`${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(bases['nat_club.dat'], c);
        expect(['ok', 'typed']).toContain(runCase(() => parseNatClubDat(buf), c, 'nat_club.dat'));
      });
    }
  });

  describe('nation.dat matrix', () => {
    for (const c of mNation) {
      it(`${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(bases['nation.dat'], c);
        expect(['ok', 'typed']).toContain(runCase(() => parseNationDat(buf), c, 'nation.dat'));
      });
    }
  });

  describe('first_names.dat matrix (TName shape)', () => {
    for (const c of mName) {
      it(`${c.mode} seed=${c.seed} → typed-or-clean`, () => {
        const buf = corruptBuffer(bases['first_names.dat'], c);
        expect(['ok', 'typed']).toContain(runCase(() => parseNamesDat(buf), c, 'first_names.dat'));
      });
    }
  });

  describe('staff.dat via index entries (uncorrupted: index-driven segments hold)', () => {
    it('staff segments parse from real index offsets without foreign errors', () => {
      const bundle = parseStaffDat(bases['staff.dat'], indexEntries);
      expect(bundle.staff.length).toBeGreaterThan(1000);
      expect(bundle.players.size).toBeGreaterThan(1000);
    });
  });
});