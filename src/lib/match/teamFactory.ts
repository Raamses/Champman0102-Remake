// @paths lib/match
/**
 * CM-018 team factory: GameDataset (SoA) -> engine TeamState.
 *
 * Bridge between the CM-011 dataset world (CM2 attribute/position structs,
 * staff-linked players) and the CM-014 match engine's simplified PlayerState.
 * Also exposes the club list for the MatchDay selection screen.
 *
 * Squad convention:
 * players[0..10] = the starting XI, the rest is the bench.
 */
import type { GameDataset } from '../game-data';
import { CLUB_SQUAD_SIZE, findClubRowById, type ClubRow } from '../game-data/clubTable';
import { resolveSquad } from '../game-data/squad';
import type { CM2PlayerAttributes, CM2PlayerPositions } from '../dat-parser/parser';
import type { PlayerAttributes, PlayerState, TeamState, Tactic } from '../../engine/types';

export type MatchPosition = 'GK' | 'DEF' | 'MID' | 'ATT';

/** Engine attrs the parser does not carry; synthesized from the known-average. */
const ENGINE_ONLY: Array<keyof PlayerAttributes> = [
  'composure', 'concentration', 'creativity', 'determination', 'eccentricity',
  'firstTouch', 'influence', 'intelligence', 'longThrows', 'rushingOut',
  'setPieces', 'sportsmanship',
];

/** Direct 1:1 carries (parser field == engine field). */
const DIRECT: Array<[keyof PlayerAttributes, keyof CM2PlayerAttributes]> = [
  ['acceleration', 'acceleration'], ['aggression', 'aggression'], ['agility', 'agility'],
  ['anticipation', 'anticipation'], ['balance', 'balance'], ['bravery', 'bravery'],
  ['consistency', 'consistency'], ['corners', 'corners'], ['crossing', 'crossing'],
  ['decisions', 'decisions'], ['dirtiness', 'dirtiness'], ['dribbling', 'dribbling'],
  ['finishing', 'finishing'], ['flair', 'flair'], ['freeKicks', 'freeKicks'],
  ['handling', 'handling'], ['heading', 'heading'], ['importantMatches', 'importantMatches'],
  ['injuryProneness', 'injuryProneness'], ['jumping', 'jumping'], ['leadership', 'leadership'],
  ['leftFoot', 'leftFoot'], ['longShots', 'longShots'], ['marking', 'marking'],
  ['naturalFitness', 'naturalFitness'], ['oneOnOnes', 'oneOnOnes'], ['pace', 'pace'],
  ['passing', 'passing'], ['positioning', 'positioning'], ['reflexes', 'reflexes'],
  ['rightFoot', 'rightFoot'], ['stamina', 'stamina'], ['strength', 'strength'],
  ['tackling', 'tackling'], ['teamwork', 'teamwork'], ['technique', 'technique'],
  ['versatility', 'versatility'], ['vision', 'vision'], ['workRate', 'workRate'],
];

/** Same concept, different binary field name. */
const ALIASES: Array<[keyof PlayerAttributes, keyof CM2PlayerAttributes]> = [
  ['penaltyTaking', 'penalties'],
  ['throwing', 'throwIns'],
  ['offTheBall', 'movement'],
  ['shooting', 'finishing'],
];

const clamp20 = (v: number): number => Math.max(1, Math.min(20, Math.round(v)));

export function mapAttributes(src: CM2PlayerAttributes): PlayerAttributes {
  const attrs: Record<string, number> = {};
  let sum = 0;
  let count = 0;
  for (const [engineKey, srcKey] of [...DIRECT, ...ALIASES]) {
    const v = clamp20(src[srcKey]);
    attrs[engineKey as string] = v;
    sum += v;
    count++;
  }
  const avg = Math.round(sum / count);
  for (const key of ENGINE_ONLY) {
    attrs[key as string] = clamp20(avg);
  }
  return attrs as unknown as PlayerAttributes;
}

/** Highest-rated parser position bucket -> engine position group. */
export function mapPosition(p: CM2PlayerPositions): MatchPosition {
  const cands: Array<[MatchPosition, number]> = [
    ['GK', p.goalkeeper],
    ['DEF', Math.max(p.defender, p.sweeper, p.wingBack)],
    ['MID', Math.max(p.defensiveMidfielder, p.midfielder, p.attackingMidfielder)],
    ['ATT', p.attacker],
  ];
  cands.sort((a, b) => b[1] - a[1]);
  return cands[0][0];
}

/** Formation string "4-4-2" -> outfield slot counts [DEF, MID, ATT]. */
export function formationSlots(formation: Tactic['formation']): [number, number, number] {
  const parts = formation.split('-');
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

export interface MatchTeamBuild {
  team: TeamState;
  squadSize: number;
  warnings: string[];
}

/**
 * Build a TeamState for one club. Best-CA players fill the formation slots;
 * shortages are patched from the strongest leftovers (with a warning).
 * Throws when the squad has no goalkeeper at all (engine keeper lookups
 * require one) or fewer than 11 squad members.
 */
export function buildMatchTeam(
  dataset: GameDataset,
  clubId: number,
  isHome: boolean,
  formation: Tactic['formation'],
  tactic: Omit<Tactic, 'formation'>,
): MatchTeamBuild {
  const club = findClub(dataset, clubId);
  if (!club) throw new Error(`Club ${clubId} not found in dataset`);
  const warnings: string[] = [];

  const squad = resolveSquad(dataset, clubId)
    .filter((e) => e.playerRow !== null && e.name !== null)
    .map((e) => ({
      id: e.staffId,
      name: e.name as string,
      ca: e.playerRow!.currentAbility,
      positions: e.playerRow!.positions,
      attributes: e.playerRow!.attributes,
    }));

  if (squad.length < 11) {
    throw new Error(`${club.name}: squad too small (${squad.length}) — need at least 11 players`);
  }

  type Mapped = { id: number; name: string; ca: number; pos: MatchPosition; attributes: PlayerAttributes };
  const mapped = squad.map((m) => ({ ...m, pos: mapPosition(m.positions), attributes: mapAttributes(m.attributes) }));

  const buckets: Record<MatchPosition, Mapped[]> = { GK: [], DEF: [], MID: [], ATT: [] };
  for (const m of mapped) buckets[m.pos].push(m);
  const byCA = (a: Mapped, b: Mapped) => b.ca - a.ca;
  (Object.keys(buckets) as MatchPosition[]).forEach((k) => buckets[k].sort(byCA));

  const [dCount, mCount, aCount] = formationSlots(formation);
  const want: Array<[MatchPosition, number]> = [['GK', 1], ['DEF', dCount], ['MID', mCount], ['ATT', aCount]];

  const xi: Mapped[] = [];
  for (const [pos, n] of want) {
    const take = Math.min(n, buckets[pos].length);
    xi.push(...buckets[pos].splice(0, take));
  }
  // Patch shortages from the deepest remaining buckets (excluding GK).
  while (xi.length < 11) {
    const pool = (Object.keys(buckets) as MatchPosition[])
      .filter((p) => p !== 'GK')
      .flatMap((p) => buckets[p])
      .sort(byCA);
    if (pool.length === 0) break;
    const pick = pool[0];
    buckets[pick.pos] = buckets[pick.pos].filter((m) => m.id !== pick.id);
    xi.push(pick);
  }
  if (xi.length < 11) throw new Error(`${club.name}: could not field a starting XI`);

  // Bench: strongest leftovers (up to 7), engine subs swap them into XI slots.
  const bench = (Object.keys(buckets) as MatchPosition[]).flatMap((p) => buckets[p]).sort(byCA).slice(0, 7);
  if (bench.length === 0) warnings.push(`${club.name}: no bench players — substitutions disabled`);

  const toPlayer = (m: Mapped): PlayerState => ({
    id: m.id,
    name: m.name,
    position: m.pos,
    attributes: m.attributes,
    stamina: 100,
    isInjured: false,
    yellowCards: 0,
    redCard: false,
    minutesPlayed: 0,
  });

  const team: TeamState = {
    id: club.id,
    name: club.name,
    players: [...xi, ...bench].map(toPlayer),
    tactic: { formation, ...tactic },
    isHome,
    goals: 0,
    shots: 0,
    shotsOnTarget: 0,
    possession: 50,
    morale: 70,
  };
  return { team, squadSize: mapped.length, warnings };
}

/** Every club with a resolvable squad, for the selection dropdowns. */
export function listClubOptions(dataset: GameDataset): Array<{ id: number; name: string; squadSize: number }> {
  const table = dataset.clubs;
  const out: Array<{ id: number; name: string; squadSize: number }> = [];
  for (let i = 0; i < table.length; i++) {
    const row = getClubRowSafe(dataset, i);
    if (!row || !row.name) continue;
    let squadSize = 0;
    for (const staffId of row.squad) if (staffId >= 0) squadSize++;
    if (squadSize >= 11) out.push({ id: row.id, name: row.name, squadSize });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

function getClubRowSafe(dataset: GameDataset, index: number): ClubRow | null {
  const table = dataset.clubs;
  if (index < 0 || index >= table.length) return null;
  return {
    index,
    id: table.id[index],
    name: table.name[index],
    shortName: table.shortName[index],
    nation: table.nation[index],
    division: table.division[index],
    lastDivision: table.lastDivision[index],
    lastPosition: table.lastPosition[index],
    cash: table.cash[index],
    stadium: table.stadium[index],
    reputation: table.reputation[index],
    manager: table.manager[index],
    assistantManager: table.assistantManager[index],
    squad: Array.from(table.squad.subarray(index * CLUB_SQUAD_SIZE, index * CLUB_SQUAD_SIZE + CLUB_SQUAD_SIZE)),
  };
}

function findClub(dataset: GameDataset, clubId: number): ClubRow | null {
  const idx = dataset.clubs.idToIndex.get(clubId);
  if (idx === undefined) return null;
  return getClubRowSafe(dataset, idx);
}