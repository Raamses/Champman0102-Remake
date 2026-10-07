// @paths lib/commentary
import { assertNever } from '../assertNever';
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

export type { CommentaryContext, CommentaryLine, CommentaryOptions } from './types';

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

function extrasFor(e: MatchEvent): EventExtras {
  return e as MatchEvent & EventExtras;
}

/** Fill {slots} in a template; unknown or empty slots stay as-is. */
function fill(template: string, slots: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => slots[k] ?? m);
}

function getChanceTypeLabel(lang: CommentaryLang, ct: ChanceType): string {
  switch (ct) {
    case 'cross':
    case 'through-ball':
    case 'header':
    case 'long-shot':
    case 'one-on-one':
      return CHANCE_TYPE_LABELS[lang][ct];
    default:
      return assertNever(ct);
  }
}

function getSetPieceLabel(lang: CommentaryLang, sp: SetPieceKind): string {
  switch (sp) {
    case 'corner':
    case 'freeKick':
    case 'throwIn':
      return SET_PIECE_LABELS[lang][sp];
    default:
      return assertNever(sp);
  }
}

/** Outcome key for chance-derived events; falls back to the plain key. */
function outcomeKey(e: MatchEvent, extras: EventExtras): StringKey {
  switch (e.type) {
    case 'goal':
    case 'save':
    case 'miss':
      if (extras.setPiece) return `setpiece.${e.type}` as StringKey;
      if (extras.chanceType) return `${e.type}.${extras.chanceType}` as StringKey;
      return e.type;
    case 'chance':
      if (extras.setPiece) return `setpiece.${extras.setPiece}` as StringKey;
      if (extras.chanceType) return `chance.${extras.chanceType}` as StringKey;
      return e.type;
    case 'red':
    case 'yellow':
      if (extras.secondYellow) return 'second-yellow';
      return e.type;
    case 'injury':
      if (extras.recovered) return 'injury.recovers';
      return e.type;
    case 'assist':
    case 'sub':
    case 'corner':
    case 'freeKick':
    case 'penalty':
    case 'missedPenalty':
    case 'ownGoal':
    case 'offside':
    case 'foul':
      return e.type;
    default:
      return assertNever(e.type);
  }
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

    if (e.type === 'goal' || e.type === 'penalty' || e.type === 'ownGoal') {
      const scoringTeam = e.creditTeam ?? team;
      if (scoringTeam === 'home') homeGoals++; else awayGoals++;
      if (e.type === 'goal' && e.assistId !== undefined) {
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
      chanceType: extras.chanceType ? getChanceTypeLabel(lang, extras.chanceType) : '',
      setPiece: extras.setPiece ? getSetPieceLabel(lang, extras.setPiece) : '',
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
  let variants = table[key];
  if (!variants && type === 'chance') variants = table['chance'];
  if (!variants) throw new Error(`Missing commentary template for key: ${key}`);
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
