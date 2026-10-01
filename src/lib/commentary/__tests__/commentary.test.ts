// @paths lib/commentary
import { describe, it, expect } from 'vitest';
import { renderCommentary, type EventExtras } from '../commentary';
import type { CommentaryContext } from '../types';
import type { MatchEvent, MatchEventType } from '../../../engine/types';

const ctx: CommentaryContext = {
  homeTeam: 'Arsenal',
  awayTeam: 'Chelsea',
  players: new Map<number, string>([
    [1, 'Thierry Henry'],
    [2, 'Patrick Vieira'],
    [3, 'Petr Cech'],
    [4, 'Marcel Desailly'],
    [5, 'Sylvain Wiltord'],
    [6, 'Frank Lampard'],
  ]),
  homeFormation: '4-4-2',
  awayFormation: '4-4-2',
};

type EventWithExtras = MatchEvent & EventExtras;

function ev(minute: number, type: MatchEventType, team: 'home' | 'away', extra: Partial<EventWithExtras> = {}): EventWithExtras {
  return { minute, type, team, playerId: 1, keeperId: 3, description: `raw ${type}`, ...extra } as EventWithExtras;
}

/** One event of every MatchEventType. Base shape provides keeperId 3 to mimic the real engine-emitted shape. */
const ALL_EVENTS: MatchEvent[] = [
  ev(12, 'chance', 'home', { chanceType: 'cross' }),
  ev(13, 'goal', 'home', { chanceType: 'header' }),
  ev(13, 'goal', 'away', { chanceType: 'one-on-one', assistId: 6 }),
  ev(27, 'save', 'home', { chanceType: 'long-shot' }),
  ev(31, 'miss', 'away', { chanceType: 'through-ball' }),
  ev(40, 'corner', 'home', { setPiece: 'corner' }),
  ev(41, 'goal', 'home', { setPiece: 'corner' }),
  ev(45, 'yellow', 'away', { playerId: 4 }),
  ev(58, 'red', 'away', { playerId: 4, secondYellow: true }),
  ev(60, 'injury', 'home', { playerId: 2, recovered: true }),
  ev(61, 'injury', 'away', { playerId: 6, recovered: false }),
  ev(70, 'sub', 'away', { playerId: 4, subInId: 5, subOutId: 4 }),
  ev(85, 'freeKick', 'home', { setPiece: 'freeKick' }),
  ev(86, 'penalty', 'home', { playerId: 1 }),
  ev(87, 'missedPenalty', 'away', { playerId: 6 }),
  ev(88, 'ownGoal', 'away', { playerId: 4, creditTeam: 'home' }),
  ev(89, 'offside', 'home', { playerId: 5 }),
  ev(90, 'foul', 'away', { playerId: 6 }),
];

const EXTRA_LINES = ALL_EVENTS.filter((e) => e.assistId !== undefined).length;

describe('renderCommentary (CM-017)', () => {
  it('renders every event — no event dropped (kickoff + full-time added)', () => {
    const lines = renderCommentary(ALL_EVENTS, ctx, { seed: 7 });
    // one line per event, plus an assist line per assisted goal, plus bookends
    expect(lines.length).toBe(ALL_EVENTS.length + EXTRA_LINES + 2);
    expect(lines[0].key).toBe('kickoff');
    expect(lines[lines.length - 1].key).toBe('full-time');
    for (const line of lines) {
      expect(line.text.trim().length).toBeGreaterThan(0);
      // no raw template slots left unfilled
      expect(line.text).not.toMatch(/\{[a-zA-Z]+\}/);
    }
    const renderedTypes = new Set(lines.map((l) => l.type));
    for (const t of ['goal', 'assist', 'yellow', 'red', 'injury', 'sub', 'chance', 'save', 'miss', 'corner', 'freeKick', 'penalty', 'missedPenalty', 'ownGoal', 'offside', 'foul'] as MatchEventType[]) {
      expect(renderedTypes).toContain(t);
    }
  });

  it('routes chance-type and set-piece keys (no generic fallback)', () => {
    const lines = renderCommentary(ALL_EVENTS, ctx, { seed: 7 });
    const keys = lines.map((l) => l.key);
    expect(keys).toContain('goal.header');
    expect(keys).toContain('goal.one-on-one');
    expect(keys).toContain('save.long-shot');
    expect(keys).toContain('miss.through-ball');
    expect(keys).toContain('corner'); // delivery line
    expect(keys).toContain('setpiece.goal'); // converted corner
    expect(keys).toContain('freeKick'); // delivery line
    expect(keys).toContain('second-yellow');
    expect(keys).toContain('injury.recovers');
    expect(keys).toContain('sub');
    expect(keys).toContain('assist');
    expect(keys).toContain('penalty');
    expect(keys).toContain('missedPenalty');
    expect(keys).toContain('ownGoal');
    expect(keys).toContain('offside');
    expect(keys).toContain('foul');
  });

  it('is deterministic: same seed => byte-identical lines', () => {
    const a = renderCommentary(ALL_EVENTS, ctx, { seed: 7 });
    const b = renderCommentary(ALL_EVENTS, ctx, { seed: 7 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('renders Hebrew (i18n) distinctly and non-empty', () => {
    const en = renderCommentary(ALL_EVENTS, ctx, { seed: 7, lang: 'en' });
    const he = renderCommentary(ALL_EVENTS, ctx, { seed: 7, lang: 'he' });
    expect(he.length).toBe(en.length);
    const heTexts = he.map((l) => l.text).join('|');
    const enTexts = en.map((l) => l.text).join('|');
    expect(heTexts.length).toBeGreaterThan(0);
    expect(heTexts).not.toBe(enTexts);
  });

  it('falls back gracefully for unknown keys (never throws, never empty)', () => {
    const weird = [ev(5, 'chance', 'home')]; // no chanceType, no setPiece
    const lines = renderCommentary(weird, ctx, { seed: 3 });
    expect(lines.length).toBe(weird.length + 2);
    expect(lines[1].text.trim().length).toBeGreaterThan(0);
  });

  it('tracks the running score in bookend lines', () => {
    const lines = renderCommentary(ALL_EVENTS, ctx, { seed: 7 });
    const ft = lines[lines.length - 1];
    // home goals in ALL_EVENTS: minutes 13 (header), 41 (corner), 86 (penalty) and 88 (ownGoal) = 4; away: 1
    expect(ft.text).toContain('4');
    expect(ft.text).toContain('1');
  });
});