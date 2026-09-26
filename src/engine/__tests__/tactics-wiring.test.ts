// @paths lib/engine
import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../matchEngine';
import {
  calculateTacticAttackFactor,
  calculateTacticDefensePressure,
  calculateStaminaIntensity,
} from '../../lib/tactics/modifiers';
import { getFormation, FORMATION_WEIGHTS } from '../../lib/tactics/types';
import { applySetPieceResolution } from '../../lib/tactics/setpieces';
import { substituteAI } from '../../lib/tactics/substitutions';
import { TeamState, PlayerState, PlayerAttributes, Tactic } from '../types';

const BASE_TACTIC: Tactic = {
  formation: '4-4-2',
  mentality: 'balanced',
  tempo: 'normal',
  pressing: 'normal',
  width: 'normal',
  passing: 'mixed',
};

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

function createPlayer(id: number, name: string, position: 'GK' | 'DEF' | 'MID' | 'ATT', attrs?: Partial<PlayerAttributes>): PlayerState {
  return { id, name, position, attributes: { ...createDefaultAttributes(), ...attrs }, stamina: 100, isInjured: false, yellowCards: 0, redCard: false, minutesPlayed: 0 };
}

function createTeam(id: number, name: string, isHome: boolean, tactic?: Partial<Tactic>): TeamState {
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
    ],
    tactic: { ...BASE_TACTIC, ...tactic },
    goals: 0, shots: 0, shotsOnTarget: 0, possession: 50, morale: 100,
  };
}

/** Average home goals over paired seeds — same seed sequence for both configs. */
function avgHomeGoals(homeTactic?: Partial<Tactic>, awayTactic?: Partial<Tactic>, sims = 200): number {
  let goals = 0;
  for (let seed = 1; seed <= sims; seed++) {
    const engine = new MatchEngine({ seed });
    const home = createTeam(1, 'Home', true, homeTactic);
    const away = createTeam(2, 'Away', false, awayTactic);
    const r = engine.simulate(home, away);
    goals += r.homeTeam.goals;
  }
  return goals / sims;
}

const avgStamina = (t: TeamState): number =>
  t.players.reduce((s, p) => s + p.stamina, 0) / t.players.length;

describe('CM-016: tactics wired to match engine', () => {
  it('mentality changes chance output (attacking > balanced > defensive)', () => {
    const attacking = avgHomeGoals({ mentality: 'attacking' });
    const balanced = avgHomeGoals({ mentality: 'balanced' });
    const defensive = avgHomeGoals({ mentality: 'defensive' });
    expect(attacking).toBeGreaterThan(balanced);
    expect(balanced).toBeGreaterThan(defensive);
  });

  it('tempo fast > slow for chance creation', () => {
    const fast = avgHomeGoals({ tempo: 'fast' });
    const slow = avgHomeGoals({ tempo: 'slow' });
    expect(fast).toBeGreaterThan(slow);
  });

  it('pressing high > low for own chance creation', () => {
    const high = avgHomeGoals({ pressing: 'high' });
    const low = avgHomeGoals({ pressing: 'low' });
    expect(high).toBeGreaterThan(low);
  });

  it('passing long > short for chance creation', () => {
    const long = avgHomeGoals({ passing: 'long' });
    const short = avgHomeGoals({ passing: 'short' });
    expect(long).toBeGreaterThan(short);
  });

  it('width wide > narrow for chance creation', () => {
    const wide = avgHomeGoals({ width: 'wide' });
    const narrow = avgHomeGoals({ width: 'narrow' });
    expect(wide).toBeGreaterThan(narrow);
  });

  it('formation shapes output: 4-3-3 produces more than 5-4-1', () => {
    const attackingShape = avgHomeGoals({ formation: '4-3-3' });
    const defensiveShape = avgHomeGoals({ formation: '5-4-1' });
    expect(attackingShape).toBeGreaterThan(defensiveShape);
  });

  it('formation identity honored: 3-4-3 (attackMult 1.2) outscores balanced 4-4-2', () => {
    const threeFourThree = avgHomeGoals({ formation: '3-4-3' });
    const balanced = avgHomeGoals({ formation: '4-4-2' });
    expect(threeFourThree).toBeGreaterThan(balanced);
  });

  it('opponent tactics reduce our output (defensive + high press + 5-4-1 vs attacking + 4-3-3)', () => {
    const vsBlocked = avgHomeGoals({ mentality: 'attacking' }, { mentality: 'defensive', pressing: 'high', formation: '5-4-1' });
    const vsOpen = avgHomeGoals({ mentality: 'attacking' }, { mentality: 'attacking', formation: '4-3-3' });
    expect(vsBlocked).toBeLessThan(vsOpen);
  });

  it('stamina intensity combines tempo × pressing × mentality multiplicatively', () => {
    expect(calculateStaminaIntensity('fast', 'high', 'attacking')).toBeCloseTo(1.3 * 1.25 * 1.1, 10);
    expect(calculateStaminaIntensity('normal', 'normal', 'balanced')).toBe(1.0);
    expect(calculateStaminaIntensity('slow', 'low', 'defensive')).toBe(1.0);
  });

  it('fast + high pressing team ends the match with less stamina than balanced + normal', () => {
    const engineI = new MatchEngine({ seed: 7 });
    const intense = createTeam(1, 'Intense', true, { tempo: 'fast', pressing: 'high', mentality: 'attacking' });
    engineI.simulate(intense, createTeam(3, 'OppA', false));

    const engineC = new MatchEngine({ seed: 7 });
    const calm = createTeam(1, 'Calm', true, { tempo: 'normal', pressing: 'normal', mentality: 'balanced' });
    engineC.simulate(calm, createTeam(3, 'OppB', false));

    expect(avgStamina(intense)).toBeLessThan(avgStamina(calm));
  });
});

describe('CM-016: modifiers + utilities', () => {
  it('attack factor scales each of the five dimensions', () => {
    const base = calculateTacticAttackFactor(BASE_TACTIC);
    expect(calculateTacticAttackFactor({ ...BASE_TACTIC, mentality: 'attacking' })).toBeGreaterThan(base);
    expect(calculateTacticAttackFactor({ ...BASE_TACTIC, mentality: 'defensive' })).toBeLessThan(base);
    expect(calculateTacticAttackFactor({ ...BASE_TACTIC, tempo: 'fast' })).toBeGreaterThan(base);
    expect(calculateTacticAttackFactor({ ...BASE_TACTIC, pressing: 'high' })).toBeGreaterThan(base);
    expect(calculateTacticAttackFactor({ ...BASE_TACTIC, passing: 'long' })).toBeGreaterThan(base);
    expect(calculateTacticAttackFactor({ ...BASE_TACTIC, width: 'wide' })).toBeGreaterThan(base);
  });

  it('defense pressure from defensive + high-pressing opponent is strongest', () => {
    const blocked = calculateTacticDefensePressure({ ...BASE_TACTIC, mentality: 'defensive', pressing: 'high' });
    const open = calculateTacticDefensePressure({ ...BASE_TACTIC, mentality: 'attacking', pressing: 'low' });
    expect(blocked).toBeLessThan(open);
    expect(blocked).toBeLessThan(1);
  });

  it('formation weights table covers every supported formation', () => {
    for (const f of ['4-4-2', '4-3-3', '3-5-2', '4-5-1', '5-3-2', '3-4-3', '5-4-1'] as const) {
      expect(FORMATION_WEIGHTS[f]).toBeDefined();
      expect(getFormation(f)).toBe(FORMATION_WEIGHTS[f]);
    }
    expect(getFormation('4-2-4-2')).toBe(FORMATION_WEIGHTS['4-4-2']); // fallback
  });

  it('set piece resolution: strong taker scores, weak taker misses', () => {
    const strong = createPlayer(1, 'FK Specialist', 'MID', { freeKicks: 19, technique: 19, shooting: 19 }).attributes;
    const weak = createPlayer(2, 'Weak', 'MID', { freeKicks: 1, technique: 1, shooting: 1 }).attributes;
    const badDef = [createPlayer(2, 'D', 'DEF', { marking: 1, tackling: 1 }).attributes];
    const goodDef = [createPlayer(2, 'D', 'DEF', { marking: 20, tackling: 20 }).attributes];
    const badKeeper = createPlayer(3, 'K', 'GK', { handling: 1, reflexes: 1, oneOnOnes: 1 }).attributes;
    const goodKeeper = createPlayer(3, 'K', 'GK', { handling: 20, reflexes: 20, oneOnOnes: 20 }).attributes;

    expect(applySetPieceResolution(strong, badDef, badKeeper, { next: () => 0.01 }, 'freeKick')).toBe('goal');
    expect(applySetPieceResolution(weak, goodDef, goodKeeper, { next: () => 0.9 }, 'freeKick')).toBe('miss');
  });

  it('substituteAI: tired player replaced from bench, trailing prefers attacker', () => {
    const team = createTeam(1, 'T', true);
    for (const p of team.players) p.minutesPlayed = 60; // everyone on the pitch has played
    team.players[9].stamina = 20; // A2 (ATT) is exhausted
    const benchATT = createPlayer(12, 'Fresh ATT', 'ATT');
    const benchDEF = createPlayer(13, 'Fresh DEF', 'DEF');
    const state = { players: [...team.players, benchATT, benchDEF], goals: 0 };

    const sub = substituteAI(state, 1, 70); // trailing 0-1 → prefer attacker
    expect(sub).not.toBeNull();
    expect(sub!.subOutIdx).toBe(9);
    expect(sub!.subInIdx).toBe(11);

    expect(substituteAI(state, 0, 30)).toBeNull(); // too early
    expect(substituteAI({ players: createTeam(1, 'X', true).players, goals: 0 }, 0, 70)).toBeNull(); // no bench
  });

  it('same seed + same tactics → identical scoreline (determinism with tactics)', () => {
    const run = () => {
      const engine = new MatchEngine({ seed: 99 });
      const home = createTeam(1, 'Home', true, { mentality: 'attacking', tempo: 'fast' });
      const away = createTeam(2, 'Away', false, { formation: '5-4-1', mentality: 'defensive' });
      const r = engine.simulate(home, away);
      return `${r.homeTeam.goals}-${r.awayTeam.goals}`;
    };
    expect(run()).toBe(run());
  });
});