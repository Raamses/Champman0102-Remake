// CM-022a golden fixture — the canonical pinning fixture for the reconciliation spec.
// DO NOT CHANGE: every pinned assertion in golden.match.test.ts is defined against
// exactly this squad shape + default config; any change here flips the whole spec.
// See docs/vault/cards/cm-022a-golden-tests.md.
import { MatchEngine, type MatchEventExtras } from '../matchEngine';
import type { MatchEvent, MatchResult, PlayerAttributes, PlayerState, TeamState } from '../types';
import { renderCommentary } from '../../lib/commentary/commentary';
import type { ChanceType, CommentaryLine, SetPieceKind } from '../../lib/commentary/types';

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

/** Project rendered lines onto the pinned routing fields. */
export function pinLines(lines: CommentaryLine[]): PinnedLine[] {
  return lines.map(l => ({ minute: l.minute, key: l.key, type: l.type, team: l.team }));
}

/** Count pinned events of a given type. */
export function countBy(events: PinnedEvent[], type: MatchEvent['type']): number {
  return events.filter(e => e.type === type).length;
}

/** Canonical "average team" attributes — every rating 10. */
function createDefaultAttributes(): PlayerAttributes {
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
  };
}

function createPlayer(id: number, name: string, position: 'GK' | 'DEF' | 'MID' | 'ATT'): PlayerState {
  return {
    id, name, position,
    attributes: createDefaultAttributes(),
    stamina: 100, isInjured: false, yellowCards: 0, redCard: false, minutesPlayed: 0,
  };
}

/** Canonical squad: 11 starters + 3 bench (onPitch: false), 4-4-2 balanced. */
export function createGoldenTeam(id: number, name: string, isHome: boolean): TeamState {
  return {
    id, name, isHome,
    players: [
      createPlayer(1, `${name} GK`, 'GK'),
      createPlayer(2, `${name} D1`, 'DEF'), createPlayer(3, `${name} D2`, 'DEF'),
      createPlayer(4, `${name} D3`, 'DEF'), createPlayer(5, `${name} D4`, 'DEF'),
      createPlayer(6, `${name} M1`, 'MID'), createPlayer(7, `${name} M2`, 'MID'),
      createPlayer(8, `${name} M3`, 'MID'),
      createPlayer(9, `${name} A1`, 'ATT'), createPlayer(10, `${name} A2`, 'ATT'),
      createPlayer(11, `${name} A3`, 'ATT'),
      { ...createPlayer(12, `${name} S1`, 'DEF'), onPitch: false },
      { ...createPlayer(13, `${name} S2`, 'MID'), onPitch: false },
      { ...createPlayer(14, `${name} S3`, 'ATT'), onPitch: false },
    ],
    tactic: { formation: '4-4-2', mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' },
    goals: 0, shots: 0, shotsOnTarget: 0, possession: 50, morale: 100,
  };
}

/** Run a full default-config match with the canonical fixture. Fresh teams + engine each call. */
export function runMatch(seed: number): { home: TeamState; away: TeamState; result: MatchResult } {
  const engine = new MatchEngine({ seed });
  const home = createGoldenTeam(1, 'Home FC', true);
  const away = createGoldenTeam(2, 'Away FC', false);
  return { home, away, result: engine.simulate(home, away) };
}

/** Render an event stream through the PRODUCTION renderer (src/lib/commentary), en. */
export function renderPinned(result: MatchResult, home: TeamState, away: TeamState): CommentaryLine[] {
  const ctx = {
    players: new Map([...home.players, ...away.players].map(p => [p.id, p.name])),
    homeTeam: home.name, awayTeam: away.name,
    homeFormation: home.tactic.formation, awayFormation: away.tactic.formation,
  };
  return renderCommentary(result.events, ctx, { seed: result.seed, lang: 'en' });
}
