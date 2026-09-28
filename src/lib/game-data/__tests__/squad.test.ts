// @paths lib/game-data
// CM-013 unit tests: club -> squad -> player resolution on a synthetic
// mini-dataset (the browser wiring itself is covered by the e2e suite).
import { describe, it, expect } from 'vitest';
import type { CM2Club, CM2Name, CM2Nation, CM2Player, CM2Staff } from '../../dat-parser/parser';
import { POSITION_FIELDS, ATTRIBUTE_FIELDS } from '../playerTable';
import { buildGameDataset, type GameDataSource } from '../dataset';
import { resolveSquad, browseClubs, formatMoney, clubLabel } from '../squad';

function nameEntry(id: number, name: string): CM2Name {
  return { id, name, nation: -1, count: 1 };
}

function player(id: number, over: Partial<CM2Player> = {}): CM2Player {
  return {
    id,
    squadNumber: id % 99,
    currentAbility: 100 + id,
    potentialAbility: 150 + id,
    positions: Object.fromEntries(POSITION_FIELDS.map((f) => [f, 10])) as CM2Player['positions'],
    attributes: Object.fromEntries(ATTRIBUTE_FIELDS.map((f) => [f, 12])) as CM2Player['attributes'],
    ...over,
  };
}

function staff(id: number, over: Partial<CM2Staff> = {}): CM2Staff {
  return {
    id,
    firstName: 0,
    secondName: 0,
    commonName: -1,
    nation: 0,
    intApps: 0,
    intGoals: 0,
    clubJob: -1,
    player: -1,
    ...over,
  };
}

function club(id: number, over: Partial<CM2Club> = {}): CM2Club {
  return {
    id,
    name: `Club ${id}`,
    shortName: `C${id}`,
    nation: 0,
    division: 1,
    lastDivision: 1,
    lastPosition: 1,
    cash: 5_000_000,
    stadium: -1,
    reputation: 80,
    manager: -1,
    assistantManager: -1,
    squad: Array(50).fill(-1),
    ...over,
  };
}

const source: GameDataSource = {
  clubs: [
    club(676, {
      name: 'Arsenal',
      shortName: 'Ars',
      manager: 2,
      squad: [1, 3, -1, 99 /* dangling */],
    }),
    club(1, { name: 'Århus FC', squad: Array(50).fill(-1) }),
  ],
  natClubs: [],
  nations: [{ id: 0, name: 'England', shortName: 'Eng', threeLetterName: 'ENG', nationality: 'English', continent: 0, numberClubs: 1, numberStaff: 2, reputation: 100 } as unknown as CM2Nation],
  firstNames: [nameEntry(0, 'Dennis'), nameEntry(1, 'Lee')],
  secondNames: [nameEntry(0, 'Bergkamp'), nameEntry(1, 'Dixon')],
  commonNames: [nameEntry(0, 'Dennis Bergkamp')],
  staff: [
    staff(1, { firstName: 0, secondName: 0, commonName: 0, clubJob: 676, player: 10 }),
    staff(2, { firstName: 1, secondName: 1, commonName: -1, clubJob: 676, player: -1 }),
    staff(3, { firstName: 1, secondName: 1, commonName: -1, clubJob: 676, player: 11 }),
    staff(4, { clubJob: 1 }),
  ],
  players: [player(10), player(11, { squadNumber: 7 })],
};

const dataset = buildGameDataset(source);

describe('CM-013 squad resolution', () => {
  it('resolves club -> squad slots through staff -> player links', () => {
    const squad = resolveSquad(dataset, 676);
    expect(squad.map((entry) => entry.name)).toEqual(['Dennis Bergkamp', 'Lee Dixon']);
    expect(squad.map((entry) => entry.playerRow?.id)).toEqual([10, 11]);
    expect(squad.map((entry) => entry.slot)).toEqual([0, 1]);
  });

  it('keeps non-player staff visible but unlinked, and skips empty + dangling slots', () => {
    const squad = resolveSquad(dataset, 676);
    // staff #4 is a real row but never registered in this club's squad;
    // dangling staff id 99 (no row) is dropped by resolveSquad.
    expect(squad).toHaveLength(2);
    expect(squad.every((entry) => entry.playerRow)).toBe(true);

    const nobody = resolveSquad(dataset, 1);
    expect(nobody).toEqual([]);
    expect(resolveSquad(dataset, 404)).toEqual([]);
  });

  it('browseClubs searches names case-insensitively and sorts by name', () => {
    expect(browseClubs(dataset, 'ars').items.map((item) => item.row.name)).toEqual(['Arsenal']);
    const all = browseClubs(dataset, '');
    expect(all.items.map((item) => clubLabel(dataset, item.row.id)).sort()).toEqual(['Arsenal', 'Århus FC']);
    expect(all.capped).toBe(false);
    expect(browseClubs(dataset, 'zzz').items).toEqual([]);
  });

  it('formats cash and labels clubs', () => {
    expect(formatMoney(5_000_000)).toBe('£5.0M');
    expect(formatMoney(850_000)).toBe('£850k');
    expect(formatMoney(-250_000)).toBe('-£250k');
    expect(clubLabel(dataset, 676)).toBe('Arsenal');
    expect(clubLabel(dataset, 404)).toBe('#404');
  });
});
