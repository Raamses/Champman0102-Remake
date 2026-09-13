// @paths lib/game-data
/**
 * CM-T07: full import-pipeline integration test.
 *
 * Real vanilla .dat files (staged locally, never committed — copyright) ->
 * archive-path normalization -> dat-parser -> the CM-011 in-memory SoA
 * `GameDataset` -> IndexedDB end-of-turn persistence round-trip (decisions
 * doc #1). Exercises the whole chain other suites only cover piecewise:
 * `dat-parser/__tests__/real-data.test.ts` verifies the parser alone,
 * `game-data/__tests__/dataset.test.ts` verifies the SoA tables against
 * synthetic fixtures, `persistence/__tests__/db.test.ts` verifies IndexedDB
 * against arbitrary payloads. This suite is the one place all four stages
 * run back-to-back against the real 2001 retail database.
 *
 * Files are looked up through `resolveArchiveFiles` from a deliberately
 * nested, mixed-case synthetic archive listing (test-program meta-review
 * #9's BYOD blind spot) rather than a hardcoded flat filename join, so
 * archive-path normalization is exercised as the pipeline's actual front
 * door, not just in isolation.
 *
 * Skips itself (rather than failing) when the fixture directory isn't
 * present, same guard as the other real-data suites.
 */
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseIndexDat, parseClubDat, parseNatClubDat, parseNationDat, parseNamesDat, parseStaffDat } from '../../dat-parser/parser';
import { resolveArchiveFiles, REQUIRED_DAT_FILES, type ArchiveEntry } from '../../dat-parser/archivePaths';
import { buildGameDataset, type GameDataset } from '../dataset';
import { findClubRowById } from '../clubTable';
import { getStaffRow, resolveStaffRowName, type StaffRow } from '../staffTable';
import { findPlayerRowById, ATTRIBUTE_FIELDS, type PlayerRow } from '../playerTable';
import { DB_NAME, closeSaveDatabase, putSaveRecordsTransactionally, getSaveRecord } from '../../persistence/db';

const DATA_DIR = '/home/ramamos/cm0102-game-data';
const HAS_REAL_DATA = existsSync(DATA_DIR);

function loadBuffer(fileName: string): ArrayBuffer {
  const buf = readFileSync(join(DATA_DIR, fileName));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function deleteDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

function staffRowsForClub(dataset: GameDataset, clubId: number): StaffRow[] {
  const rows: StaffRow[] = [];
  for (let i = 0; i < dataset.staff.length; i++) {
    if (dataset.staff.clubJob[i] === clubId) rows.push(getStaffRow(dataset.staff, i));
  }
  return rows;
}

function resolveNames(dataset: GameDataset, rows: StaffRow[]): string[] {
  return rows
    .map((row) => resolveStaffRowName(row, dataset.firstNames, dataset.secondNames, dataset.commonNames))
    .filter((name): name is string => name !== null);
}

describe.runIf(HAS_REAL_DATA)('CM-T07: import pipeline integration (real data -> SoA -> IndexedDB)', () => {
  let dataset: GameDataset;
  let bergkampPlayerId: number;

  afterEach(async () => {
    await closeSaveDatabase();
    await deleteDatabase();
  });

  beforeAll(() => {
    // A deliberately messy stand-in for a real BYOD archive: nested under
    // extra directories, mixed casing, and an unrelated file thrown in —
    // resolveArchiveFiles (not a DATA_DIR-relative join) is what locates
    // each required file.
    const archiveEntries: ArchiveEntry<ArrayBuffer>[] = [
      { path: 'cm0102/Data/INDEX.DAT', file: loadBuffer('index.dat') },
      { path: 'cm0102/Data/Club.dat', file: loadBuffer('club.dat') },
      { path: 'cm0102/Data/nat_club.DAT', file: loadBuffer('nat_club.dat') },
      { path: 'cm0102/Data/NATION.dat', file: loadBuffer('nation.dat') },
      { path: 'cm0102/Data/subdir/STAFF.dat', file: loadBuffer('staff.dat') },
      { path: 'cm0102/Data/first_names.DAT', file: loadBuffer('first_names.dat') },
      { path: 'cm0102/Data/Second_Names.dat', file: loadBuffer('second_names.dat') },
      { path: 'cm0102/Data/COMMON_NAMES.dat', file: loadBuffer('common_names.dat') },
      { path: 'cm0102/readme.txt', file: new ArrayBuffer(0) },
    ];

    const { files, missing } = resolveArchiveFiles(archiveEntries);
    // player_setup.cfg is loaded as text elsewhere (CM-005) — not part of
    // this ArrayBuffer-keyed archive listing, so it's the one expected gap.
    expect(missing).toEqual(['player_setup.cfg']);
    for (const required of REQUIRED_DAT_FILES) {
      if (required === 'player_setup.cfg') continue;
      expect(files[required]).toBeDefined();
    }

    const indexEntries = parseIndexDat(files['index.dat']!);
    const clubs = parseClubDat(files['club.dat']!);
    const natClubs = parseNatClubDat(files['nat_club.dat']!);
    const nations = parseNationDat(files['nation.dat']!);
    const firstNames = parseNamesDat(files['first_names.dat']!);
    const secondNames = parseNamesDat(files['second_names.dat']!);
    const commonNames = parseNamesDat(files['common_names.dat']!);
    const { staff, players } = parseStaffDat(files['staff.dat']!, indexEntries);

    dataset = buildGameDataset({ clubs, natClubs, nations, firstNames, secondNames, commonNames, staff, players });

    const arsenal = findClubRowById(dataset.clubs, 676)!;
    const bergkampRow = staffRowsForClub(dataset, arsenal.id).find(
      (row) => resolveStaffRowName(row, dataset.firstNames, dataset.secondNames, dataset.commonNames) === 'Dennis Bergkamp'
    );
    bergkampPlayerId = bergkampRow!.player;
  });

  it('builds the full SoA dataset with the real 10,580-club world database', () => {
    expect(dataset.clubs.length).toBe(10580);
    expect(dataset.staff.length).toBeGreaterThan(0);
    expect(dataset.players.length).toBeGreaterThan(0);
  });

  it('finds Arsenal at club id 676 via the SoA idToIndex lookup', () => {
    const arsenal = findClubRowById(dataset.clubs, 676);
    expect(arsenal).not.toBeNull();
    expect(arsenal!.name).toBe('Arsenal');
    expect(arsenal!.shortName).toBe('Arsenal');
  });

  it("resolves Arsenal's real 2001-02 squad and manager through the SoA name-index", () => {
    const arsenal = findClubRowById(dataset.clubs, 676)!;
    const names = resolveNames(dataset, staffRowsForClub(dataset, arsenal.id));

    expect(names).toContain('Thierry Henry');
    expect(names).toContain('Dennis Bergkamp');
    expect(names).toContain('Patrick Vieira');
    // CP1252 diacritic in a real staff record, resolved through the SoA
    // first/second-name tables end to end.
    expect(names).toContain('Arsène Wenger');
  });

  it('decodes CP1252 names across the whole real name-index with no leftover C1 control characters', () => {
    // A byte in 0x80-0x9F decodes to a C1 control character under a naive
    // Latin-1 mapping instead of its true CP1252 letter (e.g. 0x9E is 'ž',
    // not U+009E) — scanning the full real name tables (not just one known
    // record) proves the fix holds across the whole retail dataset.
    const hasControlChar = (name: string) => /[\u0080-\u009f]/.test(name);
    for (const table of [dataset.firstNames, dataset.secondNames, dataset.commonNames]) {
      for (const name of table.name) {
        expect(hasControlChar(name)).toBe(false);
      }
    }
  });

  it('keeps every real player attribute and ability within the CM01/02 valid range', () => {
    // The full world database includes blank/reserve-slot player records
    // alongside real ones: ~26% have currentAbility 0 and ~4% carry a -1/-2
    // sentinel potentialAbility (checked against the real fixture directly),
    // so 0 and the sentinels are valid here — this test is a corruption
    // guard (no attribute/ability escapes the format's actual range), not a
    // "every player is a fully-rated pro" assertion (that's the Bergkamp
    // check below).
    let sampled = 0;
    for (let i = 0; i < dataset.players.length; i += 37) {
      const base = i * ATTRIBUTE_FIELDS.length;
      for (let f = 0; f < ATTRIBUTE_FIELDS.length; f++) {
        const value = dataset.players.attributes[base + f];
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(20);
      }
      expect(dataset.players.currentAbility[i]).toBeGreaterThanOrEqual(0);
      expect(dataset.players.currentAbility[i]).toBeLessThanOrEqual(200);
      expect(dataset.players.potentialAbility[i]).toBeGreaterThanOrEqual(-2);
      expect(dataset.players.potentialAbility[i]).toBeLessThanOrEqual(200);
      sampled++;
    }
    expect(sampled).toBeGreaterThan(1000);
  });

  it("keeps Dennis Bergkamp's real attribute profile sane through the SoA player table", () => {
    const bergkamp = findPlayerRowById(dataset.players, bergkampPlayerId);
    expect(bergkamp).not.toBeNull();
    expect(bergkamp!.squadNumber).toBe(10);
    expect(bergkamp!.positions.attackingMidfielder).toBeGreaterThanOrEqual(15);
    expect(bergkamp!.positions.central).toBeGreaterThanOrEqual(15);
    for (const field of ATTRIBUTE_FIELDS) {
      expect(bergkamp!.attributes[field]).toBeGreaterThanOrEqual(1);
      expect(bergkamp!.attributes[field]).toBeLessThanOrEqual(20);
    }
  });

  it(
    'round-trips the full real-data SoA dataset through IndexedDB end-of-turn persistence',
    async () => {
      await putSaveRecordsTransactionally([
        {
          slot: 'cm-t07-import-pipeline',
          kind: 'manual',
          label: 'CM-T07 import pipeline dataset',
          createdAt: Date.now(),
          schemaVersion: 1,
          payload: dataset,
        },
      ]);

      const record = await getSaveRecord<GameDataset>('cm-t07-import-pipeline');
      expect(record).toBeDefined();
      const restored = record!.payload;

      // Struct-of-arrays columns must survive the IndexedDB structured-clone
      // round trip as TypedArrays/Maps, not degrade to plain arrays/objects.
      expect(restored.clubs.id).toBeInstanceOf(Int32Array);
      expect(restored.clubs.idToIndex).toBeInstanceOf(Map);
      expect(restored.players.attributes).toBeInstanceOf(Int8Array);

      expect(restored.clubs.length).toBe(10580);
      const arsenal = findClubRowById(restored.clubs, 676);
      expect(arsenal?.name).toBe('Arsenal');

      const names = resolveNames(restored, staffRowsForClub(restored, arsenal!.id));
      expect(names).toContain('Dennis Bergkamp');
      expect(names).toContain('Arsène Wenger');

      const bergkamp = findPlayerRowById(restored.players, bergkampPlayerId) as PlayerRow;
      expect(bergkamp.squadNumber).toBe(10);
      expect(bergkamp.attributes.finishing).toBe(
        findPlayerRowById(dataset.players, bergkampPlayerId)!.attributes.finishing
      );
    },
    20_000
  );
});

describe.skipIf(HAS_REAL_DATA)('CM-T07: import pipeline integration (real data -> SoA -> IndexedDB)', () => {
  it.skip(`skipped — staged game data not found at ${DATA_DIR}`, () => {});
});
