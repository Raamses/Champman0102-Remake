// @paths lib/commentary
import type { MatchEvent } from '../../engine/types';

/** Chance types surfaced by CM-017 (activates the dead CM-016b blend fields) */
export type ChanceType = 'cross' | 'through-ball' | 'header' | 'long-shot' | 'one-on-one';

/** Set-piece kinds (mirrors lib/tactics/setpieces.ts) */
export type SetPieceKind = 'corner' | 'freeKick' | 'throwIn';

/** Commentary output line — one per rendered event, none dropped */
export interface CommentaryLine {
  minute: number;
  /** i18n string key that produced this line */
  key: string;
  /** Rendered text in the requested language */
  text: string;
  type: MatchEvent['type'];
  team: MatchEvent['team'];
  /** Chance classification when the event is chance-derived */
  chanceType?: ChanceType;
  /** Set-piece kind when applicable */
  setPiece?: SetPieceKind;
}

/** Snapshot context the renderer needs to fill templates */
export interface CommentaryContext {
  homeTeam: string;
  awayTeam: string;
  /** Player id -> display name (both squads) */
  players: Map<number, string>;
  homeFormation: string;
  awayFormation: string;
}

/** Language of the rendered strings */
export type CommentaryLang = 'en' | 'he';

/** Options: independent seed => commentary variety is deterministic per seed
 *  and decoupled from the engine's RNG consumption order. */
export interface CommentaryOptions {
  seed: number;
  lang?: CommentaryLang;
}
