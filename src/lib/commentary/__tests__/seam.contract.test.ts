import { describe, it, expect } from 'vitest';
import { renderCommentary } from '../commentary';
import { MatchEventType, MatchEvent } from '../../../engine/types';
import { type MatchEventExtras } from '../../../engine/matchEngine';
import { runMatch, runAsymMatch, buildRenderContext } from '../../../engine/__tests__/golden.helpers';

// 'assist' is renderer-synthesized from goal extras (assistId); not a native engine event type
const ENGINE_EVENT_TYPES: MatchEventType[] = [
  'goal', 'yellow', 'red', 'injury', 'sub', 'chance',
  'save', 'miss', 'corner', 'freeKick', 'penalty', 'missedPenalty',
  'ownGoal', 'offside', 'foul'
];

const _exhaustivenessCheck: Record<MatchEventType, true> = {
  goal: true, assist: true, yellow: true, red: true, injury: true, sub: true,
  chance: true, save: true, miss: true, corner: true, freeKick: true,
  penalty: true, missedPenalty: true, ownGoal: true, offside: true, foul: true
};

describe('Engine to Commentary Seam Contract', () => {
  it('covers all event types and does not fallback silently', () => {
    const typesSeen = new Set<string>();
    let hasAssistId = false;
    let hasAssistLine = false;
    
    // Simulate multiple matches with extreme configs to force all events
    for (let seed = 1; seed <= 1000; seed++) {
      const { home, away, result } = seed % 2 === 0 ? runMatch(seed) : runAsymMatch(seed);

      const ctx = buildRenderContext(home, away);

      const lines = renderCommentary(result.events, ctx, { seed, lang: 'en' });
      
      let renderedHome = 0;
      let renderedAway = 0;
      for (const line of lines) {
        expect(line.text).not.toMatch(/\{\w+\}/);
        expect(line.text).not.toContain('Unknown');
        expect(line.text).not.toMatch(/\s!/);
        if (line.key === 'full-time') {
          const match = line.text.match(/(\d+)-(\d+)/);
          if (match) {
            renderedHome = parseInt(match[1]);
            renderedAway = parseInt(match[2]);
          }
        }
        if (line.type === 'assist' || line.key === 'assist') {
          hasAssistLine = true;
        }
        if (line.type !== 'chance') {
          expect(line.text).not.toContain('carves out a chance');
        }
      }
      expect(renderedHome).toBe(result.homeTeam.goals);
      expect(renderedAway).toBe(result.awayTeam.goals);

      (result.events as (MatchEvent & MatchEventExtras)[]).forEach(e => {
        typesSeen.add(e.type);
        if (e.type === 'goal' && 'assistId' in e) {
          hasAssistId = true;
        }
      });
    }
    
    const missingTypes = ENGINE_EVENT_TYPES.filter(type => !typesSeen.has(type));
    expect(missingTypes).toEqual([]);
    expect(hasAssistId).toBe(true);
    expect(hasAssistLine).toBe(true);
  }, 30_000);
});
