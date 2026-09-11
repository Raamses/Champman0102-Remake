// @paths lib/dat-parser
/**
 * CM-006: parser verification against the real CM01/02 retail database.
 *
 * Reads the actual 2001 retail ISO's vanilla `.dat` files (staged outside
 * the repo — game data is not committed, it's not ours to redistribute) and
 * checks known 2001-02 facts: Arsenal exists, their real squad/staff appear
 * in staff.dat with resolvable names and plausible attributes, and overall
 * record counts are sane for a full world database.
 *
 * Skips itself (rather than failing) when the fixture directory isn't
 * present, so the suite still passes on machines without the staged data.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  parseIndexDat,
  parseClubDat,
  parseNatClubDat,
  parseNationDat,
  parseNamesDat,
  parseStaffDat,
  resolveStaffName,
  type DatIndexEntry,
  type CM2Club,
  type CM2Name,
  type CM2Staff,
  type CM2Player,
} from '../parser';

const DATA_DIR = '/home/ramamos/cm0102-game-data';
const HAS_REAL_DATA = existsSync(DATA_DIR);

function loadBuffer(fileName: string): ArrayBuffer {
  const buf = readFileSync(join(DATA_DIR, fileName));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

describe.runIf(HAS_REAL_DATA)('parser verified against real CM01/02 retail data', () => {
  let indexEntries: DatIndexEntry[];
  let clubs: CM2Club[];
  let natClubs: CM2Club[];
  let firstNames: CM2Name[];
  let secondNames: CM2Name[];
  let commonNames: CM2Name[];
  let arsenal: CM2Club | undefined;
  let arsenalStaff: CM2Staff[];
  let arsenalSquadNames: string[];
  let players: Map<number, CM2Player>;

  beforeAll(() => {
    indexEntries = parseIndexDat(loadBuffer('index.dat'));
    clubs = parseClubDat(loadBuffer('club.dat'));
    natClubs = parseNatClubDat(loadBuffer('nat_club.dat'));
    firstNames = parseNamesDat(loadBuffer('first_names.dat'));
    secondNames = parseNamesDat(loadBuffer('second_names.dat'));
    commonNames = parseNamesDat(loadBuffer('common_names.dat'));

    const staffBundle = parseStaffDat(loadBuffer('staff.dat'), indexEntries);
    players = staffBundle.players;
    arsenal = clubs.find((c) => c.shortName === 'Arsenal');

    arsenalStaff = staffBundle.staff.filter((s) => arsenal && s.clubJob === arsenal.id);
    arsenalSquadNames = arsenalStaff
      .map((s) => resolveStaffName(s, firstNames, secondNames, commonNames))
      .filter((name): name is string => name !== null);
  });

  it('parses index.dat into the expected directory of segments', () => {
    expect(indexEntries.length).toBeGreaterThan(0);
    const clubEntry = indexEntries.find((e) => e.name === 'club.dat');
    expect(clubEntry?.count).toBe(10580);
    const staffEntry = indexEntries.find((e) => e.name === 'staff.dat' && e.fileType === 6);
    expect(staffEntry).toBeDefined();
    expect(staffEntry!.count).toBeGreaterThan(0);
  });

  it('parses a plausible number of clubs (full world database)', () => {
    // The real retail database covers every playable nation's league
    // pyramid, not just the ~450 top-flight English/European clubs assumed
    // pre-verification — 10,580 clubs total.
    expect(clubs.length).toBeGreaterThan(450);
    expect(clubs.length).toBe(10580);
  });

  it('parses national teams from nat_club.dat', () => {
    expect(natClubs.length).toBeGreaterThan(50);
    expect(natClubs.some((c) => c.name === 'England')).toBe(true);
  });

  it('finds Arsenal in club.dat', () => {
    expect(arsenal).toBeDefined();
    expect(arsenal!.name).toBe('Arsenal');
  });

  it("finds Arsenal's real 2001-02 first-team players in staff.dat", () => {
    const expectedPlayers = [
      'Thierry Henry',
      'Patrick Vieira',
      'Dennis Bergkamp',
      'Robert Pires',
      'David Seaman',
      'Sol Campbell',
      'Tony Adams',
      'Fredrik Ljungberg',
    ];

    for (const name of expectedPlayers) {
      expect(arsenalSquadNames).toContain(name);
    }
  });

  it("finds Arsenal's manager (Arsène Wenger) among the club's staff", () => {
    expect(arsenalSquadNames).toContain('Arsène Wenger');
  });

  it('resolves a sane number of total staff/players for Arsenal', () => {
    // First team + reserves/youth + backroom staff, but not the whole database.
    expect(arsenalSquadNames.length).toBeGreaterThan(20);
    expect(arsenalSquadNames.length).toBeLessThan(200);
  });

  it("keeps Dennis Bergkamp's player attributes within valid ranges", () => {
    const bergkampStaff = arsenalStaff.find(
      (s) => resolveStaffName(s, firstNames, secondNames, commonNames) === 'Dennis Bergkamp'
    );

    expect(bergkampStaff).toBeDefined();
    expect(bergkampStaff!.player).toBeGreaterThanOrEqual(0);

    const bergkamp = players.get(bergkampStaff!.player);
    expect(bergkamp).toBeDefined();
    expect(bergkamp!.squadNumber).toBe(10);
    expect(bergkamp!.currentAbility).toBeGreaterThan(0);
    expect(bergkamp!.currentAbility).toBeLessThanOrEqual(200);
    expect(bergkamp!.potentialAbility).toBeGreaterThan(0);
    expect(bergkamp!.potentialAbility).toBeLessThanOrEqual(200);

    // Known creative attacking-midfielder profile: rated highly centrally
    // and in an advanced playmaking role, not as a out-and-out defender.
    expect(bergkamp!.positions.attackingMidfielder).toBeGreaterThanOrEqual(15);
    expect(bergkamp!.positions.central).toBeGreaterThanOrEqual(15);

    for (const value of Object.values(bergkamp!.attributes)) {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(20);
    }
  });

  it('parses nation.dat with plausible counts', () => {
    const nations = parseNationDat(loadBuffer('nation.dat'));
    expect(nations.length).toBeGreaterThan(150);
    expect(nations.some((n) => n.name === 'England')).toBe(true);
  });
});

describe.skipIf(HAS_REAL_DATA)('parser verified against real CM01/02 retail data', () => {
  it.skip(`skipped — staged game data not found at ${DATA_DIR}`, () => {});
});
