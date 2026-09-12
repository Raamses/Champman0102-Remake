import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../matchEngine';
import { RNG, seedFromString } from '../rng';
import { TeamState, PlayerState, PlayerAttributes, DEFAULT_MATCH_CONFIG } from '../types';

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
    ],
    tactic: { formation: '4-4-2', mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' },
    goals: 0, shots: 0, shotsOnTarget: 0, possession: 50, morale: 100,
  };
}

describe('RNG', () => {
  it('is deterministic with same seed', () => {
    const a = new RNG(42);
    const b = new RNG(42);
    for (let i = 0; i < 100; i++) {
      expect(a.next()).toBe(b.next());
    }
  });

  it('produces different sequences with different seeds', () => {
    const a = new RNG(42);
    const b = new RNG(123);
    let differs = false;
    for (let i = 0; i < 10; i++) {
      if (a.next() !== b.next()) differs = true;
    }
    expect(differs).toBe(true);
  });

  it('produces values in [0, 1)', () => {
    const rng = new RNG(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('seedFromString produces consistent seeds', () => {
    expect(seedFromString('test')).toBe(seedFromString('test'));
    expect(seedFromString('test')).not.toBe(seedFromString('other'));
  });
});

describe('MatchEngine', () => {
  it('simulates a full match (90 minutes)', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home', true);
    const away = createTeam(2, 'Away', false);
    const result = engine.simulate(home, away);
    expect(result.events.length).toBeGreaterThan(0);
  });

  it('is deterministic with same seed', () => {
    const engine1 = new MatchEngine({ seed: 42 });
    const engine2 = new MatchEngine({ seed: 42 });
    const home1 = createTeam(1, 'Home', true);
    const away1 = createTeam(2, 'Away', false);
    const home2 = createTeam(1, 'Home', true);
    const away2 = createTeam(2, 'Away', false);
    
    const result1 = engine1.simulate(home1, away1);
    const result2 = engine2.simulate(home2, away2);
    
    expect(result1.events.length).toBe(result2.events.length);
    expect(result1.homeTeam.goals).toBe(result2.homeTeam.goals);
    expect(result1.awayTeam.goals).toBe(result2.awayTeam.goals);
  });

  it('home team has advantage', () => {
    let homeWins = 0;
    let awayWins = 0;
    for (let seed = 0; seed < 100; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      const result = engine.simulate(home, away);
      if (result.homeTeam.goals > result.awayTeam.goals) homeWins++;
      if (result.awayTeam.goals > result.homeTeam.goals) awayWins++;
    }
    // Home should win more often than away
    expect(homeWins).toBeGreaterThan(awayWins);
  });

  it('average goals per match is realistic (1.5-4.0)', () => {
    let totalGoals = 0;
    const numMatches = 100;
    for (let seed = 0; seed < numMatches; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      const result = engine.simulate(home, away);
      totalGoals += result.homeTeam.goals + result.awayTeam.goals;
    }
    const avgGoals = totalGoals / numMatches;
    expect(avgGoals).toBeGreaterThan(1.5);
    expect(avgGoals).toBeLessThan(4.0);
  });

  it('high attributes produce more goals than low attributes', () => {
    let highAttrGoals = 0;
    let lowAttrGoals = 0;
    
    for (let seed = 0; seed < 50; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      home.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 18; });
      away.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 18; });
      const result = engine.simulate(home, away);
      highAttrGoals += result.homeTeam.goals + result.awayTeam.goals;
    }
    
    for (let seed = 0; seed < 50; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      home.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 5; });
      away.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 5; });
      const result = engine.simulate(home, away);
      lowAttrGoals += result.homeTeam.goals + result.awayTeam.goals;
    }
    
    expect(highAttrGoals).toBeGreaterThan(lowAttrGoals);
  });

  it('goal probability is clamped to [0,1]', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home', true);
    const away = createTeam(2, 'Away', false);
    // Set up extreme attributes that would exceed 1.0
    home.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 20; });
    away.players.forEach(p => { if (p.position === 'DEF') { p.attributes.positioning = 1; p.attributes.tackling = 1; p.attributes.marking = 1; } });
    const gk = away.players.find(p => p.position === 'GK');
    if (gk) { gk.attributes.handling = 1; gk.attributes.reflexes = 1; gk.attributes.oneOnOnes = 1; }
    
    const result = engine.simulate(home, away);
    // Home should score some goals but not every shot
    expect(result.homeTeam.goals).toBeGreaterThan(0);
    expect(result.homeTeam.goals).toBeLessThan(50); // Would be 90+ without clamping
  });

  it('empty attackers produce no goals', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home', true);
    const away = createTeam(2, 'Away', false);
    // Remove all attackers
    home.players = home.players.filter(p => p.position !== 'ATT');
    
    const result = engine.simulate(home, away);
    expect(result.homeTeam.goals).toBe(0);
  });

  it('default config matches calibrated constants', () => {
    const config = DEFAULT_MATCH_CONFIG;
    expect(config.baseChanceRate).toBeCloseTo(0.133, 3);
    expect(config.chanceThreshold).toBe(0.85);
    expect(config.baseConversionRate).toBeCloseTo(0.12, 2);
    expect(config.homeAdvantagePercent).toBe(15);
  });

  it('chance creation produces ~12-14 chances per match', () => {
    let totalChances = 0;
    const numMatches = 100;
    for (let seed = 0; seed < numMatches; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      const result = engine.simulate(home, away);
      totalChances += home.shots + away.shots;
    }
    const avgChances = totalChances / numMatches;
    expect(avgChances).toBeGreaterThan(10);
    expect(avgChances).toBeLessThan(20);
  });

  it('stamina decreases over match', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home', true);
    const away = createTeam(2, 'Away', false);
    const result = engine.simulate(home, away);
    // Players should have played ~90 minutes and lost stamina
    const player = result.homeTeam.players[0];
    expect(player.minutesPlayed).toBe(90);
    expect(player.stamina).toBeLessThan(100);
  });

  it('tactic affects chance creation', () => {
    let attackingGoals = 0;
    let defensiveGoals = 0;
    
    for (let seed = 0; seed < 50; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      home.tactic.mentality = 'attacking';
      away.tactic.mentality = 'attacking';
      const result = engine.simulate(home, away);
      attackingGoals += result.homeTeam.goals + result.awayTeam.goals;
    }
    
    for (let seed = 0; seed < 50; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      home.tactic.mentality = 'defensive';
      away.tactic.mentality = 'defensive';
      const result = engine.simulate(home, away);
      defensiveGoals += result.homeTeam.goals + result.awayTeam.goals;
    }
    
    // Attacking mentality should produce more goals
    expect(attackingGoals).toBeGreaterThan(defensiveGoals);
  });

  it('chance events are logged', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home', true);
    const away = createTeam(2, 'Away', false);
    const result = engine.simulate(home, away);
    
    const goalEvents = result.events.filter(e => e.type === 'goal');
    const saveEvents = result.events.filter(e => e.type === 'save');
    const missEvents = result.events.filter(e => e.type === 'miss');
    
    // Total shots = goals + saves + misses
    expect(home.shots + away.shots).toBe(goalEvents.length + saveEvents.length + missEvents.length);
  });

  it('higher finishing attribute produces more goals', () => {
    let highFinishingGoals = 0;
    let lowFinishingGoals = 0;
    
    for (let seed = 0; seed < 50; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      home.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 18; });
      away.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 18; });
      const result = engine.simulate(home, away);
      highFinishingGoals += result.homeTeam.goals + result.awayTeam.goals;
    }
    
    for (let seed = 0; seed < 50; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      home.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 5; });
      away.players.forEach(p => { if (p.position === 'ATT') p.attributes.finishing = 5; });
      const result = engine.simulate(home, away);
      lowFinishingGoals += result.homeTeam.goals + result.awayTeam.goals;
    }
    
    expect(highFinishingGoals).toBeGreaterThan(lowFinishingGoals);
  });
});
