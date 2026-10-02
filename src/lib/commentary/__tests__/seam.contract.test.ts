import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../../../engine/matchEngine';
import { renderCommentary } from '../commentary';
import { MatchEventType, TeamState, PlayerState, PlayerAttributes } from '../../../engine/types';

function createDefaultAttributes(): PlayerAttributes {
  return {
    acceleration: 10, aggression: 20, agility: 10, anticipation: 10, balance: 10,
    bravery: 10, consistency: 10, composure: 10, concentration: 10, creativity: 10,
    corners: 10, crossing: 10, decisions: 10, determination: 10, dirtiness: 20,
    dribbling: 10, eccentricity: 10, finishing: 10, firstTouch: 10, flair: 10,
    freeKicks: 10, handling: 10, heading: 10, importantMatches: 10, influence: 10,
    injuryProneness: 20, intelligence: 10, jumping: 10, leadership: 10, leftFoot: 10,
    longShots: 10, longThrows: 10, marking: 10, naturalFitness: 10, offTheBall: 10,
    oneOnOnes: 10, pace: 10, passing: 10, penaltyTaking: 10, positioning: 10,
    reflexes: 10, rightFoot: 10, rushingOut: 10, setPieces: 10, shooting: 10,
    sportsmanship: 10, stamina: 10, strength: 10, tackling: 10, teamwork: 10,
    technique: 10, throwing: 10, versatility: 10, vision: 10, workRate: 10,
  };
}

function createPlayer(id: number, name: string, position: 'GK' | 'DEF' | 'MID' | 'ATT', attrs?: Partial<PlayerAttributes>): PlayerState {
  return { id, name, position, attributes: { ...createDefaultAttributes(), ...attrs }, stamina: 60, isInjured: false, yellowCards: 0, redCard: false, minutesPlayed: 0 };
}

function createTeam(id: number, name: string, isHome: boolean): TeamState {
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
    for (let seed = 1; seed <= 80; seed++) {
      const engine = new MatchEngine({
        seed,
        penaltyRate: 0.1,
        ownGoalRate: 0.1,
        offsideRate: 0.1,
        foulRate: 0.1,
        setPieceCornerRate: 0.1,
        setPieceFreeKickRate: 0.1,
        baseChanceRate: 1,
        chanceThreshold: 0.5,
      });
      const home = createTeam(1, 'Home FC', true);
      const away = createTeam(2, 'Away FC', false);
      const result = engine.simulate(home, away);

      const ctx = {
        players: new Map([...home.players, ...away.players].map(p => [p.id, p.name])),
        homeTeam: home.name,
        awayTeam: away.name,
        homeFormation: home.tactic.formation,
        awayFormation: away.tactic.formation,
      };

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

      result.events.forEach(e => {
        typesSeen.add(e.type);
        if (e.type === 'goal' && (e as any).assistId) {
          hasAssistId = true;
        }
      });
    }
    
    const missingTypes = ENGINE_EVENT_TYPES.filter(type => !typesSeen.has(type));
    expect(missingTypes).toEqual([]);
    expect(hasAssistId).toBe(true);
    expect(hasAssistLine).toBe(true);
  });
});
