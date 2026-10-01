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
  return { minute, type, team, playerId: 1, description: `raw ${type}`, ...extra } as EventWithExtras;
}

/** One event of every MatchEventType, exercising every extras branch. */
const ALL_EVENTS: MatchEvent[] = [
  ev(12, 'chance', 'home', { chanceType: 'cross' }),
  ev(13, 'goal', 'home', { chanceType: 'header' }),
  ev(13, 'goal', 'away', { chanceType: 'one-on-one', assistId: 6 }),
  ev(27, 'save', 'home', { chanceType: 'long-shot', keeperId: 3 }),
  ev(31, 'miss', 'away', { chanceType: 'through-ball' }),
  ev(40, 'chance', 'home', { setPiece: 'corner' }),
  ev(41, 'goal', 'home', { setPiece: 'corner' }),
  ev(45, 'yellow', 'away', { playerId: 4 }),
  ev(58, 'red', 'away', { playerId: 4, secondYellow: true }),
  ev(60, 'injury', 'home', { playerId: 2, recovered: true }),
  ev(61, 'injury', 'away', { playerId: 6, recovered: false }),
  ev(70, 'sub', 'away', { playerId: 4, subInId: 5, subOutId: 4 }),
  ev(85, 'chance', 'home', { setPiece: 'freeKick' }),
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
    for (const t of ['goal', 'assist', 'yellow', 'red', 'injury', 'sub', 'chance', 'save', 'miss'] as MatchEventType[]) {
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
    expect(keys).toContain('setpiece.corner'); // delivery line
    expect(keys).toContain('setpiece.goal'); // converted corner
    expect(keys).toContain('setpiece.freeKick'); // delivery line
    expect(keys).toContain('second-yellow');
    expect(keys).toContain('injury.recovers');
    expect(keys).toContain('sub');
    expect(keys).toContain('assist');
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
    // home goals in ALL_EVENTS: minutes 13 (header) and 41 (corner) = 2; away: 1
    expect(ft.text).toContain('2');
    expect(ft.text).toContain('1');
  });
});