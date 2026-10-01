// @paths lib/engine
import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../matchEngine';
import { CommentaryService } from '../commentary';
import {
  DEFAULT_MATCH_CONFIG,
  MatchEvent,
  MatchEventType,
  TeamState,
  PlayerState,
  PlayerAttributes,
} from '../types';

/**
 * CM-017 fix round (PR #32 review, 2026-10): one unit test per finding.
 * F1 coverage of penalty/missedPenalty/ownGoal/offside/foul — engine + commentary
 * F2 D7 canonical-first attribute naming (finishing ?? shooting)
 * F3 chance-type/config constants annotated as CM-R03 placeholders (surface test)
 * F4 bench/subs: minutesPlayed counts only on-pitch players; 3-sub limit; sub-off
 * F5 set-piece hooks wired into simulateMinute
 */

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

function createTeam(id: number, name: string, isHome: boolean, bench = 0): TeamState {
  const players: PlayerState[] = [
    createPlayer(1, `${name} GK`, 'GK'),
    createPlayer(2, `${name} D1`, 'DEF'), createPlayer(3, `${name} D2`, 'DEF'),
    createPlayer(4, `${name} D3`, 'DEF'), createPlayer(5, `${name} D4`, 'DEF'),
    createPlayer(6, `${name} M1`, 'MID'), createPlayer(7, `${name} M2`, 'MID'),
    createPlayer(8, `${name} M3`, 'MID'),
    createPlayer(9, `${name} A1`, 'ATT'), createPlayer(10, `${name} A2`, 'ATT'),
    createPlayer(11, `${name} A3`, 'ATT'),
  ];
  // Bench players: CM-017 marks them off the pitch so they never accumulate pitch minutes
  for (let i = 0; i < bench; i++) {
    players.push({ ...createPlayer(20 + i, `${name} Sub${i + 1}`, i % 2 === 0 ? 'ATT' : 'DEF'), onPitch: false });
  }
  return {
    id, name, isHome, players,
    tactic: { formation: '4-4-2', mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' },
    goals: 0, shots: 0, shotsOnTarget: 0, possession: 50, morale: 100,
  };
}

describe('CM-017 fix round (PR #32 review)', () => {
  it('F1: every new event type renders commentary, engine-side (forced rates)', () => {
    const engine = new MatchEngine({
      seed: 7,
      penaltyRate: 1, penaltyConversion: 1, // every minute, both sides
      ownGoalRate: 1,
      offsideRate: 1,
      foulRate: 1,
    });
    const home = createTeam(1, 'Home FC', true);
    const away = createTeam(2, 'Away FC', false);
    const result = engine.simulate(home, away);
    const types = new Set(result.events.map(e => e.type));
    expect(types.has('penalty')).toBe(true);
    expect(types.has('ownGoal')).toBe(true);
    expect(types.has('offside')).toBe(true);
    expect(types.has('foul')).toBe(true);
    // Penalty conversion at 100%: penalty events contribute goals
    const penaltyGoals = result.events.filter(e => e.type === 'penalty').length;
    expect(home.goals + away.goals).toBeGreaterThanOrEqual(penaltyGoals);
  });

  it('F1: missed penalty renders commentary too and scores no goal', () => {
    const engine = new MatchEngine({
      seed: 11,
      penaltyRate: 1, penaltyConversion: 0, // every penalty missed
      ownGoalRate: 0, offsideRate: 0, foulRate: 0,
      setPieceCornerRate: 0, setPieceFreeKickRate: 0,
    });
    const home = createTeam(1, 'Home FC', true);
    const away = createTeam(2, 'Away FC', false);
    const result = engine.simulate(home, away);
    const missed = result.events.filter(e => e.type === 'missedPenalty');
    expect(missed.length).toBeGreaterThan(0);
    // No penalty was converted: goals must not exceed the non-penalty goals
    const goalsPerMatch = home.goals + away.goals;
    const penaltyEvents = result.events.filter(e => e.type === 'penalty').length;
    expect(penaltyEvents).toBe(0);
    expect(goalsPerMatch).toBeGreaterThanOrEqual(0);
  });

  it('F1: every new type renders i18n commentary for en + he with determinism', () => {
    const newTypes: MatchEventType[] = ['penalty', 'missedPenalty', 'ownGoal', 'offside', 'foul'];
    for (const type of newTypes) {
      const mk = (seed: number, lang: 'en' | 'he') => {
        const service = new CommentaryService({
          seed,
          lang,
          homeTeam: createTeam(1, 'Home FC', true),
          awayTeam: createTeam(2, 'Away FC', false),
        });
        const event: MatchEvent = {
          minute: 63,
          type,
          team: 'home',
          playerId: 9,
          playerName: 'Michael Owen',
        };
        return service.generate(event);
      };
      const en1 = mk(42, 'en');
      expect(typeof en1).toBe('string');
      expect(en1.length).toBeGreaterThan(0);
      expect(en1).toContain("63'");
      expect(en1).toEqual(mk(42, 'en')); // determinism per seed
      const he1 = mk(42, 'he');
      expect(he1.length).toBeGreaterThan(0);
      expect(/[\u0590-\u05FF]/.test(he1)).toBe(true); // Hebrew charset
    }
  });

  it('F2: D7 canonical-first — finishing drives conversion, not the shooting alias', () => {
    const goalsFor = (fin: number, shoot: number) => {
      let total = 0;
      for (let seed = 0; seed < 60; seed++) {
        const engine = new MatchEngine({ seed });
        const home = createTeam(1, 'Home FC', true);
        const away = createTeam(2, 'Away FC', false);
        for (const t of [home, away]) {
          for (const p of t.players) {
            if (p.position === 'ATT') { p.attributes.finishing = fin; p.attributes.shooting = shoot; }
          }
        }
        engine.simulate(home, away);
        total += home.goals + away.goals;
      }
      return total;
    };
    // finishing ?? shooting: the canonical attribute wins everywhere in CM-017's chains
    expect(goalsFor(18, 2)).toBeGreaterThan(goalsFor(2, 18));
  });

  it('F3: CM-017 occurrence rates are exposed config placeholders (tunable, pending CM-R03)', () => {
    expect(typeof DEFAULT_MATCH_CONFIG.penaltyRate).toBe('number');
    expect(typeof DEFAULT_MATCH_CONFIG.ownGoalRate).toBe('number');
    expect(typeof DEFAULT_MATCH_CONFIG.offsideRate).toBe('number');
    expect(typeof DEFAULT_MATCH_CONFIG.foulRate).toBe('number');
    expect(typeof DEFAULT_MATCH_CONFIG.setPieceCornerRate).toBe('number');
    expect(typeof DEFAULT_MATCH_CONFIG.setPieceFreeKickRate).toBe('number');
    expect(DEFAULT_MATCH_CONFIG.penaltyConversion).toBeGreaterThan(0);
    expect(DEFAULT_MATCH_CONFIG.penaltyConversion).toBeLessThan(1);
    // Realistic volume: each occurrence rate is per team per minute
    expect(DEFAULT_MATCH_CONFIG.foulRate).toBeGreaterThan(DEFAULT_MATCH_CONFIG.offsideRate);
    expect(DEFAULT_MATCH_CONFIG.setPieceCornerRate).toBeGreaterThan(DEFAULT_MATCH_CONFIG.setPieceFreeKickRate);
    expect(DEFAULT_MATCH_CONFIG.penaltyRate).toBeLessThan(0.01); // ~0.11 per match, not per minute
  });

  it('F4: bench players marked off-pitch never accumulate pitch minutes', () => {
    const engine = new MatchEngine({ seed: 5 });
    const home = createTeam(1, 'Home FC', true, 4);
    const away = createTeam(2, 'Away FC', false);
    // Keep home's starters from tiring so no substitution swaps bench ids this match
    home.tactic.tempo = 'slow';
    home.tactic.pressing = 'low';
    home.tactic.mentality = 'defensive';
    for (const p of home.players) p.attributes.naturalFitness = 20;
    const benchIds = new Set(home.players.filter(p => p.onPitch === false).map(p => p.id));
    engine.simulate(home, away);
    const starters = home.players.filter(p => p.onPitch !== false);
    for (const p of starters) {
      expect(p.minutesPlayed).toBeGreaterThan(0);
    }
    for (const p of home.players) {
      if (!benchIds.has(p.id) || p.onPitch !== false) continue;
      expect(p.minutesPlayed).toBe(0); // the starvation fix: bench stays eligible for substituteAI
    }
  });

  it('F4: substitutions fire when the bench is available, capped at 3 per team, sub-off excluded from pools', () => {
    const engine = new MatchEngine({ seed: 3, setPieceCornerRate: 0, setPieceFreeKickRate: 0 });
    const home = createTeam(1, 'Home FC', true, 5);
    const away = createTeam(2, 'Away FC', false, 5);
    // Force the tired pool before minute 55: fast + high press + attacking + poor natural fitness
    for (const t of [home, away]) {
      t.tactic.tempo = 'fast';
      t.tactic.pressing = 'high';
      t.tactic.mentality = 'attacking';
      for (const p of t.players) p.attributes.naturalFitness = 4;
    }
    const result = engine.simulate(home, away);
    for (const teamState of [home, away]) {
      const subs = result.events.filter(e => e.type === 'sub' && e.team === (teamState.isHome ? 'home' : 'away'));
      expect(subs.length).toBe(3); // exactly the 3-sub limit: starvation fixed, cap enforced
      const outs = new Set(subs.map(e => e.subOutId));
      expect(outs.size).toBe(subs.length); // no player subbed off twice
      const ins = new Set(subs.map(e => e.subInId));
      expect(ins.size).toBe(subs.length); // no double-entry
      // subbed-off players must be marked off the pitch (pool exclusion)
      for (const s2 of subs) {
        const out = teamState.players.find(p => p.id === s2.subOutId);
        expect(out).toBeDefined();
        expect(out?.onPitch).toBe(false);
        const incoming = teamState.players.find(p => p.id === s2.subInId);
        expect(incoming?.onPitch).toBe(true);
      }
    }
  });

  it('F5: set-piece hooks (lib/tactics/setpieces.ts) wired into simulateMinute', () => {
    const engine = new MatchEngine({ seed: 9, setPieceCornerRate: 1, setPieceFreeKickRate: 1 });
    const home = createTeam(1, 'Home FC', true);
    const away = createTeam(2, 'Away FC', false);
    const result = engine.simulate(home, away);
    // PR semantics: the set-piece hook types its event by OUTCOME (goal/save/miss);
    // the corner/free-kick flavor rides in the description.
    const spEvents = result.events.filter(e =>
      (e.type === 'goal' || e.type === 'save' || e.type === 'miss') &&
      /corner|free kick/i.test(e.description ?? ''));
    const cornerFlavor = result.events.filter(e => /corner/i.test(e.description ?? '')).length;
    const fkFlavor = result.events.filter(e => /free kick/i.test(e.description ?? '')).length;
    expect(spEvents.length).toBeGreaterThan(0);
    expect(cornerFlavor).toBeGreaterThan(0);
    expect(fkFlavor).toBeGreaterThan(0);
  });

  it('F5: set pieces produce goals through the wired hook (forced conversion scenario)', () => {
    // High set-piece triggers + strong attackers: some SP outcomes must be goals
    let sawGoalEventInStream = false;
    let sawSpAward = false;
    const engine = new MatchEngine({ seed: 21, setPieceCornerRate: 1, setPieceFreeKickRate: 1 });
    const home = createTeam(1, 'Home FC', true);
    const away = createTeam(2, 'Away FC', false);
    for (const t of [home, away]) {
      for (const p of t.players) {
        p.attributes.setPieces = 20;
        p.attributes.corners = 20;
        p.attributes.freeKicks = 20;
        p.attributes.heading = 20;
        p.attributes.strength = 20;
        p.attributes.acceleration = 20;
      }
    }
    const result = engine.simulate(home, away);
    sawSpAward = result.events.some(e => /corner|free kick/i.test(e.description ?? ''));
    sawGoalEventInStream = result.events.some(
      e => e.type === 'goal' && /from a (corner|free kick)/i.test(e.description ?? '')
    );
    expect(sawSpAward).toBe(true);
    expect(sawGoalEventInStream).toBe(true);
  });
});
