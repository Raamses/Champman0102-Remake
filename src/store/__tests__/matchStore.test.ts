// @paths store
/**
 * CM-018 matchStore tests: full UI-level match lifecycle against a synthetic
 * dataset — prepare -> kick off -> live ticking -> half-time -> full-time ->
 * post-match summary persisted via the CM-011 IndexedDB layer.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import '../../test/setup-indexeddb';
import type { CM2Club, CM2Name, CM2Nation, CM2Player, CM2Staff } from '../../lib/dat-parser/parser';
import { POSITION_FIELDS, ATTRIBUTE_FIELDS } from '../../lib/game-data/playerTable';
import { buildGameDataset, type GameDataSource } from '../../lib/game-data';
import { useMatchStore } from '../matchStore';
import { manualSlotId } from '../../lib/persistence/saveManager';
import { getSaveRecord } from '../../lib/persistence/db';

function nameEntry(id: number, name: string): CM2Name {
  return { id, name, nation: -1, count: 1 };
}

type Role = 'GK' | 'DEF' | 'MID' | 'ATT';
const ROLE_FIELD: Record<Role, string> = { GK: 'goalkeeper', DEF: 'defender', MID: 'midfielder', ATT: 'attacker' };

function player(id: number, role: Role, over: Partial<CM2Player> = {}): CM2Player {
  return {
    id,
    squadNumber: id % 99,
    currentAbility: 100 + id,
    potentialAbility: 150 + id,
    positions: Object.fromEntries(
      POSITION_FIELDS.map((f) => [f, f === ROLE_FIELD[role] ? 18 : 10])
    ) as unknown as CM2Player['positions'],
    attributes: Object.fromEntries(ATTRIBUTE_FIELDS.map((f) => [f, 12])) as unknown as CM2Player['attributes'],
    ...over,
  };
}

/** Starting XI shape: GK + 4 DEF + 4 MID + 2 ATT, then 3 bench (DEF, MID, ATT). */
const XI_ROLES: Role[] = ['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'ATT', 'ATT'];
const BENCH_ROLES: Role[] = ['DEF', 'MID', 'ATT'];
const SQUAD_ROLES: Role[] = [...XI_ROLES, ...BENCH_ROLES];

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

function makeClubFixture(clubId: number, staffBase: number, playerBase: number) {
  const clubRow = club(clubId, {
    name: clubId === HOME_ID ? 'Highbury FC' : 'Stamford United',
    shortName: clubId === HOME_ID ? 'HFC' : 'SU',
    squad: [...SQUAD_ROLES.map((_, i) => staffBase + i), ...Array(50 - SQUAD_ROLES.length).fill(-1)],
  });
  const staffRows: CM2Staff[] = SQUAD_ROLES.map((_, i) =>
    staff(staffBase + i, { player: playerBase + i, clubJob: clubId, firstName: 0, secondName: 0 })
  );
  const playerRows: CM2Player[] = SQUAD_ROLES.map((role, i) => player(playerBase + i, role, { id: playerBase + i }));
  return { clubRow, staffRows, playerRows: playerRows };
}

const HOME_ID = 101;
const AWAY_ID = 102;

function buildFixture(): GameDataSource {
  const home = makeClubFixture(HOME_ID, 1000, 5000);
  const away = makeClubFixture(AWAY_ID, 2000, 6000);
  return {
    clubs: [home.clubRow, away.clubRow],
    natClubs: [],
    nations: [{ id: 0, name: 'England' } as unknown as CM2Nation],
    firstNames: [nameEntry(0, 'Alan')],
    secondNames: [nameEntry(0, 'Shearer')],
    commonNames: [],
    staff: [...home.staffRows, ...away.staffRows],
    players: [...home.playerRows, ...away.playerRows],
  };
}

const dataset = buildGameDataset(buildFixture());

describe('matchStore (CM-018)', () => {
  beforeEach(() => {
    useMatchStore.getState().reset();
    useMatchStore.getState().setSpeed('fast');
  });

  it('plays a full match through the store: live phases, feed, and full-time persistence', async () => {
    useMatchStore.getState().prepare(dataset, HOME_ID, AWAY_ID, 42);
    let s = useMatchStore.getState();
    expect(s.error).toBeNull();
    expect(s.phase).toBe('pre');
    expect(s.homeName).toBe('Highbury FC');
    expect(s.homeStamina).toHaveLength(11);

    useMatchStore.getState().kickOff();
    s = useMatchStore.getState();
    expect(s.phase).toBe('live');

    // Tick to half-time.
    for (let i = 0; i < 45; i++) {
      useMatchStore.getState().tick();
      if (useMatchStore.getState().phase === 'half-time') break;
    }
    s = useMatchStore.getState();
    expect(s.phase).toBe('half-time');
    expect(s.minute).toBe(45);
    // Engine paused at half-time: tick must not advance.
    const atHT = s.minute;
    useMatchStore.getState().tick();
    expect(useMatchStore.getState().minute).toBe(atHT);

    // Second half to full time.
    useMatchStore.getState().resumeSecondHalf();
    expect(useMatchStore.getState().phase).toBe('live');
    for (let i = 0; i < 45; i++) {
      useMatchStore.getState().tick();
      if (useMatchStore.getState().phase === 'full-time') break;
    }
    s = useMatchStore.getState();
    expect(s.phase).toBe('full-time');
    expect(s.minute).toBe(90);
    expect(s.feed.length).toBeGreaterThan(10);
    expect(s.feed[0].text).toContain('Full time');
    expect(s.persistedSlot).toMatch(/^postmatch-42-101-102$/);

    // CM-011: the summary is a real save record in IndexedDB.
    const record = await getSaveRecord(manualSlotId('postmatch-42-101-102'));
    expect(record).toBeDefined();
    const summary = record!.payload as unknown as {
      seed: number; score: { home: number; away: number }; fixture: { homeName: string };
      events: unknown[];
    };
    expect(summary.seed).toBe(42);
    expect(summary.fixture.homeName).toBe('Highbury FC');
    expect(summary.score.home).toBe(s.homeGoals);
    expect(summary.score.away).toBe(s.awayGoals);
    expect(summary.events.length).toBeGreaterThan(0);
  }, 20000);

  it('mid-match tactic changes are accepted and recorded (applied next minute)', () => {
    useMatchStore.getState().prepare(dataset, HOME_ID, AWAY_ID, 7);
    useMatchStore.getState().kickOff();
    useMatchStore.getState().tick();
    const feedBefore = useMatchStore.getState().feed.length;
    useMatchStore.getState().setTactic('home', { mentality: 'attacking', pressing: 'high' });
    const s = useMatchStore.getState();
    expect(s.homeTactic.mentality).toBe('attacking');
    expect(s.homeTactic.pressing).toBe('high');
    expect(s.feed[0].kind).toBe('system');
    expect(s.feed[0].text).toContain('from next minute');
    expect(s.feed.length).toBe(feedBefore + 1);
  });

  it('rejects an unknown club with a readable error', () => {
    useMatchStore.getState().prepare(dataset, 999, AWAY_ID, 1);
    expect(useMatchStore.getState().error).toContain('not found');
  });
});