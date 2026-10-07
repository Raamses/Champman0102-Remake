// CM-022a golden fixtures — the canonical pinning fixtures for the reconciliation spec.
// DO NOT CHANGE: every pinned assertion in golden.match.test.ts is defined against
// exactly these squad shapes + default config; any change here flips the whole spec.
// See docs/vault/cards/cm-022a-golden-tests.md.
//
// Two fixtures:
// 1. UNIFORM (createGoldenTeam): every attribute 10 — pins default-config behavior
//    and the uniform-attribute quirks (GK-first substitution, stable-sort ties).
// 2. ASYMMETRIC (createAsymTeam): differentiated keepers + set-piece specialists +
//    finishers/defenders — discriminates the keeper-calibration term and the
//    attribute-ranked set-piece taker selection that split PRs C/E will touch
//    (round-1 review finding R1-01: the uniform fixture nulls both).
// Player ids are DISJOINT between the squads (home 1-14, away 101-114), matching
// production's globally-unique staffId invariant so the renderer's player map has
// no collisions (round-1 review finding R1-02).
import { MatchEngine, type MatchEventExtras } from '../matchEngine';
import type { MatchEvent, MatchResult, PlayerAttributes, PlayerState, TeamState } from '../types';
import { renderCommentary } from '../../lib/commentary/commentary';
import type { ChanceType, CommentaryContext, CommentaryLine, SetPieceKind } from '../../lib/commentary/types';

/** The pinned projection of an engine event: structural fields + all extras. */
export interface PinnedEvent {
  minute: number;
  type: MatchEvent['type'];
  team: MatchEvent['team'];
  playerId?: number;
  assistId?: number;
  chanceType?: ChanceType;
  setPiece?: SetPieceKind;
  keeperId?: number;
  subInId?: number;
  subOutId?: number;
  secondYellow?: boolean;
  recovered?: boolean;
  creditTeam?: 'home' | 'away';
  playerName?: string;
  subInName?: string;
  subOutName?: string;
}

/** The pinned projection of a rendered commentary line (routing, not wording). */
export interface PinnedLine {
  minute: number;
  key: string;
  type: MatchEvent['type'];
  team: MatchEvent['team'];
}

/** Pinned post-match squad state — asserts the state quirks directly (R1-05). */
export interface PinnedState {
  sentOff: number[]; // ids with redCard at full time
  injured: number[]; // ids with isInjured at full time
  onPitch: number[]; // ids still on the pitch at full time
}

/** Project raw engine events onto the pinned field set (absent extras stripped). */
export function pinEvents(events: MatchEvent[]): PinnedEvent[] {
  return (events as (MatchEvent & MatchEventExtras)[]).map(e => {
    const p: PinnedEvent = { minute: e.minute, type: e.type, team: e.team };
    if (e.playerId !== undefined) p.playerId = e.playerId;
    if (e.assistId !== undefined) p.assistId = e.assistId;
    if (e.chanceType !== undefined) p.chanceType = e.chanceType;
    if (e.setPiece !== undefined) p.setPiece = e.setPiece;
    if (e.keeperId !== undefined) p.keeperId = e.keeperId;
    if (e.subInId !== undefined) p.subInId = e.subInId;
    if (e.subOutId !== undefined) p.subOutId = e.subOutId;
    if (e.secondYellow !== undefined) p.secondYellow = e.secondYellow;
    if (e.recovered !== undefined) p.recovered = e.recovered;
    if (e.creditTeam !== undefined) p.creditTeam = e.creditTeam;
    if (e.playerName !== undefined) p.playerName = e.playerName;
    if (e.subInName !== undefined) p.subInName = e.subInName;
    if (e.subOutName !== undefined) p.subOutName = e.subOutName;
    return p;
  });
}

/** Project a squad's post-match state onto the pinned field set (sorted id arrays). */
export function pinState(team: TeamState): PinnedState {
  const ids = (ps: PlayerState[]) => ps.map(p => p.id).sort((a, b) => a - b);
  return {
    sentOff: ids(team.players.filter(p => p.redCard)),
    injured: ids(team.players.filter(p => p.isInjured)),
    onPitch: ids(team.players.filter(p => p.onPitch !== false)),
  };
}

/** Project rendered lines onto the pinned routing fields. */
export function pinLines(lines: CommentaryLine[]): PinnedLine[] {
  return lines.map(l => ({ minute: l.minute, key: l.key, type: l.type, team: l.team }));
}

/** Count pinned events of a given type. */
export function countBy(events: PinnedEvent[], type: MatchEvent['type']): number {
  return events.filter(e => e.type === type).length;
}

/** Attributes baseline: every rating 10, overridable per player. */
export function createAttributes(over: Partial<PlayerAttributes> = {}): PlayerAttributes {
  return {
    acceleration: 10, aggression: 10, agility: 10, anticipation: 10, balance: 10,
    bravery: 10, consistency: 10, composure: 10, concentration: 10, creativity: 10,
    corners: 10, crossing: 10, decisions: 10, determination: 10, dirtiness: 10,
    dribbling: 10, eccentricity: 10, finishing: 10, firstTouch: 10, flair: 10,
    freeKicks: 10, handling: 10, heading: 10, importantMatches: 10, influence: 10,
    injuryProneness: 10, intelligence: 10, jumping: 10, leadership: 10, leftFoot: 10,
    longShots: 10, longThrows: 10, marking: 10, naturalFitness: 10, offTheBall: 10,
    oneOnOnes: 10, pace: 10, passing: 10, penaltyTaking: 10, positioning: 10,
    reflexes: 10, rightFoot: 10, rushingOut: 10, setPieces: 10, shooting: 10,
    sportsmanship: 10, stamina: 10, strength: 10, tackling: 10, teamwork: 10,
    technique: 10, throwing: 10, versatility: 10, vision: 10, workRate: 10,
    ...over,
  };
}

function mkPlayer(id: number, name: string, position: 'GK' | 'DEF' | 'MID' | 'ATT', attrs: Partial<PlayerAttributes> = {}): PlayerState {
  return { id, name, position, attributes: createAttributes(attrs), stamina: 100, isInjured: false, yellowCards: 0, redCard: false, minutesPlayed: 0 };
}

/** UNIFORM "average team" squad: 11 starters + 3 bench, 4-4-2 balanced, every rating 10.
 *  Ids: home 1-14, away 101-114 (disjoint — R1-02). */
export function createGoldenTeam(id: number, name: string, isHome: boolean): TeamState {
  const b = isHome ? 0 : 100;
  const p = (n: number, slot: string, pos: 'GK' | 'DEF' | 'MID' | 'ATT', bench = false): PlayerState =>
    bench ? { ...mkPlayer(b + n, `${name} ${slot}`, pos), onPitch: false } : mkPlayer(b + n, `${name} ${slot}`, pos);
  return {
    id, name, isHome,
    players: [
      p(1, 'GK', 'GK'),
      p(2, 'D1', 'DEF'), p(3, 'D2', 'DEF'), p(4, 'D3', 'DEF'), p(5, 'D4', 'DEF'),
      p(6, 'M1', 'MID'), p(7, 'M2', 'MID'), p(8, 'M3', 'MID'),
      p(9, 'A1', 'ATT'), p(10, 'A2', 'ATT'), p(11, 'A3', 'ATT'),
      p(12, 'S1', 'DEF', true), p(13, 'S2', 'MID', true), p(14, 'S3', 'ATT', true),
    ],
    tactic: { formation: '4-4-2', mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' },
    goals: 0, shots: 0, shotsOnTarget: 0, possession: 50, morale: 100,
  };
}

/** ASYMMETRIC squad (R1-01): differentiates what PRs C/E will touch.
 *  Home United (ids 1-14): strong keeper (handling 18/reflexes 17/oneOnOnes 16),
 *    corner specialist M1 (corners 20, freeKicks 3, setPieces 8),
 *    setPieces-specialist M2
 *    (setPieces 20, corners 5, freeKicks 5 — NEVER the taker: the engine ranks
 *    only corners/freeKicks), strong finishers (finishing 18/technique 14, composure 14, offTheBall 14),
 *    strong defenders (marking 15/tackling 15/positioning 15).
 *  Away Rovers (ids 101-114): weak keeper (handling 4/reflexes 5/oneOnOnes 6),
 *    freeKick specialist M1 (freeKicks 20, corners 3, technique 16), corner
 *    specialist M2 (corners 18, freeKicks 4), weak finishers (finishing 6, technique 8),
 *    weak defenders (marking 6/tackling 6/positioning 6).
 *  Everything else 10 — stamina decay and thus sub timing stay identical to the
 *  uniform fixture. */
function createAsymTeam(home: boolean): TeamState {
  const name = home ? 'Home United' : 'Away Rovers';
  const b = home ? 0 : 100;
  const p = (n: number, slot: string, pos: 'GK' | 'DEF' | 'MID' | 'ATT', attrs: Partial<PlayerAttributes> = {}, bench = false): PlayerState =>
    bench ? { ...mkPlayer(b + n, `${name} ${slot}`, pos, attrs), onPitch: false } : mkPlayer(b + n, `${name} ${slot}`, pos, attrs);
  const players: PlayerState[] = home ? [
    p(1, 'GK', 'GK', { handling: 18, reflexes: 17, oneOnOnes: 16 }),
    p(2, 'D1', 'DEF', { marking: 15, tackling: 15, positioning: 15 }),
    p(3, 'D2', 'DEF', { marking: 15, tackling: 15, positioning: 15 }),
    p(4, 'D3', 'DEF', { marking: 15, tackling: 15, positioning: 15 }),
    p(5, 'D4', 'DEF', { marking: 15, tackling: 15, positioning: 15 }),
    p(6, 'M1', 'MID', { corners: 20, freeKicks: 3, setPieces: 8 }),
    p(7, 'M2', 'MID', { setPieces: 20, corners: 5, freeKicks: 5 }),
    p(8, 'M3', 'MID'),
    p(9, 'A1', 'ATT', { finishing: 18, technique: 14, composure: 14, offTheBall: 14 }),
    p(10, 'A2', 'ATT', { finishing: 18, technique: 14, composure: 14, offTheBall: 14 }),
    p(11, 'A3', 'ATT', { finishing: 18, technique: 14, composure: 14, offTheBall: 14 }),
    p(12, 'S1', 'DEF', {}, true), p(13, 'S2', 'MID', {}, true), p(14, 'S3', 'ATT', {}, true),
  ] : [
    p(1, 'GK', 'GK', { handling: 4, reflexes: 5, oneOnOnes: 6 }),
    p(2, 'D1', 'DEF', { marking: 6, tackling: 6, positioning: 6 }),
    p(3, 'D2', 'DEF', { marking: 6, tackling: 6, positioning: 6 }),
    p(4, 'D3', 'DEF', { marking: 6, tackling: 6, positioning: 6 }),
    p(5, 'D4', 'DEF', { marking: 6, tackling: 6, positioning: 6 }),
    p(6, 'M1', 'MID', { freeKicks: 20, corners: 3, technique: 16 }),
    p(7, 'M2', 'MID', { corners: 18, freeKicks: 4 }),
    p(8, 'M3', 'MID'),
    p(9, 'A1', 'ATT', { finishing: 6, technique: 8 }),
    p(10, 'A2', 'ATT', { finishing: 6, technique: 8 }),
    p(11, 'A3', 'ATT', { finishing: 6, technique: 8 }),
    p(12, 'S1', 'DEF', {}, true), p(13, 'S2', 'MID', {}, true), p(14, 'S3', 'ATT', {}, true),
  ];
  return {
    id: home ? 1 : 2, name, isHome: home, players,
    tactic: { formation: '4-4-2', mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' },
    goals: 0, shots: 0, shotsOnTarget: 0, possession: 50, morale: 100,
  };
}

/** Run a full default-config match with the UNIFORM fixture. Fresh teams + engine each call. */
export function runMatch(seed: number): { home: TeamState; away: TeamState; result: MatchResult } {
  const engine = new MatchEngine({ seed });
  const home = createGoldenTeam(1, 'Home FC', true);
  const away = createGoldenTeam(2, 'Away FC', false);
  return { home, away, result: engine.simulate(home, away) };
}

/** Run a full default-config match with the ASYMMETRIC fixture. */
export function runAsymMatch(seed: number): { home: TeamState; away: TeamState; result: MatchResult } {
  const engine = new MatchEngine({ seed });
  const home = createAsymTeam(true);
  const away = createAsymTeam(false);
  return { home, away, result: engine.simulate(home, away) };
}

/** Renderer context — the production-shaped player map (disjoint ids, no collisions). */
export function buildRenderContext(home: TeamState, away: TeamState): CommentaryContext {
  return {
    players: new Map([...home.players, ...away.players].map(p => [p.id, p.name])),
    homeTeam: home.name, awayTeam: away.name,
    homeFormation: home.tactic.formation, awayFormation: away.tactic.formation,
  };
}

/** Render an event stream through the PRODUCTION renderer (src/lib/commentary), en. */
export function renderPinned(result: MatchResult, home: TeamState, away: TeamState): CommentaryLine[] {
  return renderCommentary(result.events, buildRenderContext(home, away), { seed: result.seed, lang: 'en' });
}
