// @paths lib/commentary
import { RNG, seedFromString } from '../../engine/rng';
import type { MatchEvent } from '../../engine/types';
import { CHANCE_TYPE_LABELS, SET_PIECE_LABELS, STRINGS, type StringKey } from './strings';
import type {
  ChanceType,
  CommentaryContext,
  CommentaryLang,
  CommentaryLine,
  CommentaryOptions,
  SetPieceKind,
} from './types';

export type { ChanceType, CommentaryContext, CommentaryLine, CommentaryLang, CommentaryOptions, SetPieceKind } from './types';
export { CHANCE_TYPE_LABELS, STRINGS } from './strings';
export { BASELINE_MEAN_MULTIPLIER, CONVERSION_MULTIPLIER, classifyChance, meanMultiplier } from './chanceTypes';

/** Optional additive fields CM-017 attaches to engine events (back-compat) */
export interface EventExtras {
  chanceType?: ChanceType;
  setPiece?: SetPieceKind;
  subInId?: number;
  subOutId?: number;
  secondYellow?: boolean;
  recovered?: boolean;
  keeperId?: number;
}

export function extrasFor(e: MatchEvent): EventExtras {
  return e as MatchEvent & EventExtras;
}

/** Fill {slots} in a template; unknown slots stay as-is. */
function fill(template: string, slots: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => slots[k] ?? m);
}

/** Outcome key for chance-derived events; falls back to the plain key. */
function outcomeKey(e: MatchEvent, extras: EventExtras): StringKey {
  if (e.type === 'goal' || e.type === 'save' || e.type === 'miss') {
    if (extras.setPiece) return `setpiece.${e.type}` as StringKey;
    if (extras.chanceType) return `${e.type}.${extras.chanceType}` as StringKey;
    return e.type;
  }
  if (e.type === 'chance' && extras.chanceType) return `chance.${extras.chanceType}` as StringKey;
  if (e.type === 'yellow' && extras.secondYellow) return 'second-yellow';
  if (e.type === 'injury' && extras.recovered) return 'injury.recovers';
  return e.type as StringKey;
}

/**
 * CommentaryService — MatchEvent stream -> seeded, deterministic commentary.
 *
 * Determinism contract: same (seed, event stream, context, lang) => the exact
 * same lines. Variety draws come from a DEDICATED feature RNG derived from the
 * commentary seed (seedFromString(`cm017:${seed}:${lang}`)), never from the
 * engine's outcome RNG — commentary text cannot perturb match results, and
 * engine RNG call-order changes can never break commentary golden fixtures.
 *
 * Every MatchEvent type renders (generic fallback for anything unmapped), so
 * no event is ever dropped.
 */
export function renderCommentary(
  events: MatchEvent[],
  ctx: CommentaryContext,
  opts: CommentaryOptions,
): CommentaryLine[] {
  const lang: CommentaryLang = opts.lang ?? 'en';
  const table = STRINGS[lang];
  const rng = new RNG(seedFromString(`cm017:${opts.seed}:${lang}`));
  const lines: CommentaryLine[] = [];
  let homeGoals = 0;
  let awayGoals = 0;

  const name = (id?: number) => (id !== undefined ? ctx.players.get(id) ?? `Player ${id}` : '');
  const teamName = (side: MatchEvent['team']) => (side === 'home' ? ctx.homeTeam : ctx.awayTeam);

  lines.push(makeLine(rng, table, 'kickoff', 'chance', 'home', {
    home: ctx.homeTeam, away: ctx.awayTeam, homeGoals: '0', awayGoals: '0',
  }, 0));

  for (const e of events) {
    const extras = extrasFor(e);
    const team = e.team;
    const key = outcomeKey(e, extras);

    if (e.type === 'goal') {
      if (team === 'home') homeGoals++; else awayGoals++;
      if (e.assistId !== undefined) {
        lines.push(makeLine(rng, table, 'assist', 'assist', team,
          { player: name(e.assistId), team: teamName(team) }, e.minute));
      }
    }

    const slots: Record<string, string> = {
      player: name(e.playerId),
      playerIn: name(extras.subInId),
      playerOut: name(extras.subOutId),
      keeper: name(extras.keeperId),
      team: teamName(team),
      opponent: team === 'home' ? ctx.awayTeam : ctx.homeTeam,
      minute: String(e.minute),
      home: ctx.homeTeam,
      away: ctx.awayTeam,
      homeGoals: String(homeGoals),
      awayGoals: String(awayGoals),
      chanceType: extras.chanceType ? CHANCE_TYPE_LABELS[lang][extras.chanceType] : '',
      setPiece: extras.setPiece ? SET_PIECE_LABELS[lang][extras.setPiece] : '',
      formation: team === 'home' ? ctx.homeFormation : ctx.awayFormation,
    };

    lines.push(makeLine(rng, table, key, e.type, team, slots, e.minute, extras));
  }

  lines.push(makeLine(rng, table, 'full-time', 'chance', 'home', {
    home: ctx.homeTeam, away: ctx.awayTeam,
    homeGoals: String(homeGoals), awayGoals: String(awayGoals),
  }, 90));

  return lines;
}

/** Seeded variety pick: exactly one RNG draw per line keeps variants stable. */
function makeLine(
  rng: RNG,
  table: Record<StringKey, string[]>,
  key: StringKey,
  type: MatchEvent['type'],
  team: MatchEvent['team'],
  slots: Record<string, string>,
  minute: number,
  extras?: EventExtras,
): CommentaryLine {
  const variants = table[key] ?? table['chance'];
  const idx = variants.length > 1 ? Math.floor(rng.next() * variants.length) % variants.length : 0;
  return {
    minute,
    key,
    text: fill(variants[idx] ?? key, slots),
    type,
    team,
    chanceType: extras?.chanceType,
    setPiece: extras?.setPiece,
  };
}
