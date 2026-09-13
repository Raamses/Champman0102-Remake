// @paths lib/game-data
import { describe, it, expect } from 'vitest';
import type { CM2Club, CM2Name, CM2Nation, CM2Player, CM2Staff } from '../../dat-parser/parser';
import {
  buildClubTable,
  getClubRow,
  findClubRowById,
  CLUB_SQUAD_SIZE,
} from '../clubTable';
import { buildNationTable, getNationRow, findNationRowById } from '../nationTable';
import { buildNameTable } from '../nameTable';
import { buildStaffTable, getStaffRow, findStaffRowById, resolveStaffRowName } from '../staffTable';
import {
  buildPlayerTable,
  getPlayerRow,
  findPlayerRowById,
  POSITION_FIELDS,
  ATTRIBUTE_FIELDS,
  POSITION_COUNT,
  ATTRIBUTE_COUNT,
} from '../playerTable';
import { buildGameDataset, estimateGameDatasetBytes } from '../dataset';

function makeClub(overrides: Partial<CM2Club> = {}): CM2Club {
  return {
    id: 1,
    name: 'Arsenal',
    shortName: 'Arsenal',
    nation: 1,
    division: 1,
    lastDivision: 1,
    lastPosition: 2,
    cash: 5_000_000,
    stadium: 1,
    reputation: 18000,
    manager: 100,
    assistantManager: 101,
    squad: [100, 101, 102],
    ...overrides,
  };
}

function makeNation(overrides: Partial<CM2Nation> = {}): CM2Nation {
  return {
    id: 1,
    name: 'England',
    shortName: 'Eng',
    threeLetterName: 'ENG',
    nationality: 'English',
    continent: 1,
    numberClubs: 500,
    numberStaff: 20000,
    reputation: 190,
    ...overrides,
  };
}

function makeStaff(overrides: Partial<CM2Staff> = {}): CM2Staff {
  return {
    id: 100,
    firstName: 0,
    secondName: 0,
    commonName: -1,
    nation: 1,
    intApps: 10,
    intGoals: 2,
    clubJob: 1,
    player: 500,
    ...overrides,
  };
}

function makePlayer(overrides: Partial<CM2Player> = {}): CM2Player {
  const positions = Object.fromEntries(POSITION_FIELDS.map((f, i) => [f, i])) as unknown as CM2Player['positions'];
  const attributes = Object.fromEntries(
    ATTRIBUTE_FIELDS.map((f, i) => [f, i + 1])
  ) as unknown as CM2Player['attributes'];
  return {
    id: 500,
    squadNumber: 10,
    currentAbility: 150,
    potentialAbility: 180,
    positions,
    attributes,
    ...overrides,
  };
}

describe('clubTable', () => {
  it('round-trips a club record through the SoA table', () => {
    const table = buildClubTable([makeClub()]);
    expect(table.length).toBe(1);
    expect(table.squad.length).toBe(CLUB_SQUAD_SIZE);

    const row = getClubRow(table, 0);
    expect(row.name).toBe('Arsenal');
    expect(row.cash).toBe(5_000_000);
    expect(row.squad.slice(0, 3)).toEqual([100, 101, 102]);
    // Unfilled squad slots pack to -1, not undefined.
    expect(row.squad[3]).toBe(-1);
  });

  it('resolves rows by club id via idToIndex', () => {
    const table = buildClubTable([makeClub({ id: 42, name: 'Everton' })]);
    expect(findClubRowById(table, 42)?.name).toBe('Everton');
    expect(findClubRowById(table, 999)).toBeNull();
  });
});

describe('nationTable', () => {
  it('round-trips and resolves by id', () => {
    const table = buildNationTable([makeNation()]);
    expect(getNationRow(table, 0).name).toBe('England');
    expect(findNationRowById(table, 1)?.threeLetterName).toBe('ENG');
    expect(findNationRowById(table, 2)).toBeNull();
  });
});

describe('nameTable + staffTable', () => {
  const firstNames = buildNameTable([{ name: 'Thierry', id: 0, nation: 1, count: 1 } as CM2Name]);
  const secondNames = buildNameTable([{ name: 'Henry', id: 0, nation: 1, count: 1 } as CM2Name]);
  const commonNames = buildNameTable([]);

  it('resolves a staff member display name from first+second name tables', () => {
    const table = buildStaffTable([makeStaff({ firstName: 0, secondName: 0, commonName: -1 })]);
    const row = getStaffRow(table, 0);
    expect(resolveStaffRowName(row, firstNames, secondNames, commonNames)).toBe('Thierry Henry');
  });

  it('prefers the common name when present', () => {
    const withCommon = buildNameTable([{ name: 'Titi', id: 0, nation: 1, count: 1 } as CM2Name]);
    const table = buildStaffTable([makeStaff({ commonName: 0 })]);
    const row = getStaffRow(table, 0);
    expect(resolveStaffRowName(row, firstNames, secondNames, withCommon)).toBe('Titi');
  });

  it('resolves staff rows by id', () => {
    const table = buildStaffTable([makeStaff({ id: 7 })]);
    expect(findStaffRowById(table, 7)?.player).toBe(500);
    expect(findStaffRowById(table, 8)).toBeNull();
  });
});

describe('playerTable', () => {
  it('has the full CM01/02 position and attribute field counts', () => {
    expect(POSITION_COUNT).toBe(12);
    expect(ATTRIBUTE_COUNT).toBe(42);
  });

  it('round-trips positions and attributes through flattened Int8Array columns', () => {
    const table = buildPlayerTable([makePlayer()]);
    const row = getPlayerRow(table, 0);

    expect(row.currentAbility).toBe(150);
    expect(row.potentialAbility).toBe(180);
    POSITION_FIELDS.forEach((field, i) => expect(row.positions[field]).toBe(i));
    ATTRIBUTE_FIELDS.forEach((field, i) => expect(row.attributes[field]).toBe(i + 1));
  });

  it('accepts a Map keyed by player id (parseStaffDat output shape)', () => {
    const map = new Map<number, CM2Player>([[500, makePlayer()]]);
    const table = buildPlayerTable(map);
    expect(findPlayerRowById(table, 500)?.squadNumber).toBe(10);
    expect(findPlayerRowById(table, 999)).toBeNull();
  });
});

describe('buildGameDataset', () => {
  it('assembles all tables from raw parser output', () => {
    const dataset = buildGameDataset({
      clubs: [makeClub()],
      natClubs: [],
      nations: [makeNation()],
      firstNames: [],
      secondNames: [],
      commonNames: [],
      staff: [makeStaff()],
      players: [makePlayer()],
    });

    expect(dataset.clubs.length).toBe(1);
    expect(dataset.nations.length).toBe(1);
    expect(dataset.staff.length).toBe(1);
    expect(dataset.players.length).toBe(1);
  });

  it('estimates a positive, plausible byte size', () => {
    const dataset = buildGameDataset({
      clubs: [makeClub(), makeClub({ id: 2, name: 'Everton' })],
      natClubs: [],
      nations: [makeNation()],
      firstNames: [],
      secondNames: [],
      commonNames: [],
      staff: [makeStaff()],
      players: [makePlayer()],
    });

    const bytes = estimateGameDatasetBytes(dataset);
    expect(bytes).toBeGreaterThan(0);
    // Sanity ceiling for this tiny fixture set — not a real-data benchmark
    // (that's CM-R03's job against the full retail database).
    expect(bytes).toBeLessThan(50_000);
  });
});
