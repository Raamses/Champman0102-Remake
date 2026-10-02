// @paths lib/engine
/**
 * CM-017 engine additions (chance types, set pieces, discipline, subs) and
 * the CM-018 live-stepping API. Complements matchEngine.test.ts (CM-014/016
 * calibration contracts) — this file owns the CM-017/CM-018 contracts.
 */
import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../matchEngine';
import { TeamState, PlayerState, PlayerAttributes } from '../types';
import { classifyChance, BASE_TYPE_WEIGHTS, meanMultiplier } from '../../lib/commentary/chanceTypes';
import { RNG } from '../rng';

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

type Pos = PlayerState['position'];

function createPlayer(id: number, name: string, position: Pos, attrs?: Partial<PlayerAttributes>): PlayerState {
  return { id, name, position, attributes: { ...createDefaultAttributes(), ...attrs }, stamina: 100, isInjured: false, yellowCards: 0, redCard: false, minutesPlayed: 0 };
}

interface TeamOpts {
  formation?: TeamState['tactic']['formation'];
  bench?: boolean;
  naturalFitness?: number;
}

function createTeam(id: number, name: string, isHome: boolean, opts: TeamOpts = {}): TeamState {
  const nf = opts.naturalFitness;
  const players: PlayerState[] = [
    createPlayer(id * 100 + 1, `${name} GK`, 'GK', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 2, `${name} D1`, 'DEF', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 3, `${name} D2`, 'DEF', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 4, `${name} D3`, 'DEF', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 5, `${name} D4`, 'DEF', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 6, `${name} M1`, 'MID', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 7, `${name} M2`, 'MID', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 8, `${name} M3`, 'MID', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 9, `${name} A1`, 'ATT', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 10, `${name} A2`, 'ATT', nf !== undefined ? { naturalFitness: nf } : undefined),
    createPlayer(id * 100 + 11, `${name} A3`, 'ATT', nf !== undefined ? { naturalFitness: nf } : undefined),
  ];
  if (opts.bench) {
    players.push(createPlayer(id * 100 + 12, `${name} B1`, 'MID', nf !== undefined ? { naturalFitness: 20 } : undefined));
    players.push(createPlayer(id * 100 + 13, `${name} B2`, 'ATT', nf !== undefined ? { naturalFitness: 20 } : undefined));
  }
  return {
    id, name, isHome,
    players,
    tactic: {
      formation: opts.formation ?? '4-4-2',
      mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed',
    },
    goals: 0, shots: 0, shotsOnTarget: 0, possession: 50, morale: 100,
  };
}

describe('CM-017: chance types', () => {
  it('baseline mix mean multiplier stays at the ~1.0 anchor (redistribution, not inflation)', () => {
    // 4-4-2 anchor mix: weighted conversion multiplier must stay ~1.0 so
    // activating chance types redistributes quality, not goal volume.
    expect(meanMultiplier(BASE_TYPE_WEIGHTS)).toBeCloseTo(1.008, 2);
  });

  it('3-4-3 generates a higher cross share than 4-4-2 (formation identity via chance types)', () => {
    const rng = new RNG(4242);
    const player = createPlayer(1, 'X', 'ATT');
    const share = (formation: string) => {
      let crosses = 0;
      const N = 4000;
      const tactic = { formation, mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' } as TeamState['tactic'];
      for (let i = 0; i < N; i++) {
        if (classifyChance(formation, tactic, player, rng).type === 'cross') crosses++;
      }
      return crosses / N;
    };
    const cross442 = share('4-4-2');
    const cross343 = share('3-4-3');
    expect(cross343).toBeGreaterThan(cross442);
    expect(cross343 / (cross442 || 1)).toBeGreaterThan(1.05);
  });

  it('3-4-3 outscores 4-4-2 at equal player ratings (identity, symmetric home advantage)', () => {
    let goals343 = 0;
    let goals442 = 0;
    for (let seed = 0; seed < 120; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'A', true, { formation: '3-4-3' });
      const away = createTeam(2, 'B', false, { formation: '4-4-2' });
      home.isHome = true;
      away.isHome = true; // cancel home advantage: formation-only comparison
      const r = engine.simulate(home, away);
      goals343 += r.homeTeam.goals;
      goals442 += r.awayTeam.goals;
    }
    expect(goals343).toBeGreaterThan(goals442);
  });
});

describe('CM-017: discipline, injuries, substitutions', () => {
  it('emits bookings and sendings-off (feature stream, engine events)', () => {
    let sawYellow = false;
    let sawRed = false;
    for (let seed = 0; seed < 60 && (!sawYellow || !sawRed); seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true, { naturalFitness: 5 });
      const away = createTeam(2, 'Away', false, { naturalFitness: 5 });
      const r = engine.simulate(home, away);
      if (r.events.some((e) => e.type === 'yellow')) sawYellow = true;
      if (r.events.some((e) => e.type === 'red')) sawRed = true;
    }
    expect(sawYellow).toBe(true);
    expect(sawRed).toBe(true);
  });

  it('wires substitutions: a faded starter with bench options gets replaced', () => {
    let sawSub = false;
    for (let seed = 0; seed < 40 && !sawSub; seed++) {
      const engine = new MatchEngine({ seed });
      // naturalFitness 5 => ~2 stamina/minute => starter is spent well before 55'
      const home = createTeam(1, 'Home', true, { bench: true, naturalFitness: 5 });
      const away = createTeam(2, 'Away', false, { bench: true, naturalFitness: 5 });
      const r = engine.simulate(home, away);
      const subs = r.events.filter((e) => e.type === 'sub');
      if (subs.length > 0) sawSub = true;
    }
    expect(sawSub).toBe(true);
  });

  it('caps substitutions at 3 per team', () => {
    for (let seed = 0; seed < 40; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true, { bench: true, naturalFitness: 5 });
      const away = createTeam(2, 'Away', false, { bench: true, naturalFitness: 5 });
      const r = engine.simulate(home, away);
      const homeSubs = r.events.filter((e) => e.type === 'sub' && e.team === 'home').length;
      expect(homeSubs).toBeLessThanOrEqual(3);
    }
  });

  it('injured bench player is never brought on by a substitution', () => {
    let sawSub = false;
    for (let seed = 0; seed < 40; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true, { bench: true, naturalFitness: 5 });
      const away = createTeam(2, 'Away', false, { bench: true, naturalFitness: 5 });
      home.players.forEach((p, i) => { if (i >= 11) p.isInjured = true; });
      const r = engine.simulate(home, away);
      if (r.events.some((e) => e.type === 'sub' && e.team === 'home')) {
        sawSub = true;
      }
    }
    expect(sawSub).toBe(false);
  });
});

describe('CM-017: set pieces', () => {
  it('emits delivery events with setPiece extras, and outcome events have keeperId', () => {
    let sawDelivery = false;
    let sawOutcome = false;
    for (let seed = 0; seed < 40; seed++) {
      const engine = new MatchEngine({ seed });
      const home = createTeam(1, 'Home', true);
      const away = createTeam(2, 'Away', false);
      const r = engine.simulate(home, away);
      for (const e of r.events as any[]) {
        if (e.type === 'corner' || e.type === 'freeKick') {
          sawDelivery = true;
          expect(e.setPiece).toBe(e.type);
        }
        if (e.setPiece && (e.type === 'save' || e.type === 'goal' || e.type === 'miss')) {
          sawOutcome = true;
          if (e.type === 'save') {
            expect(e.keeperId).toBeDefined();
          }
        }
      }
    }
    expect(sawDelivery).toBe(true);
    expect(sawOutcome).toBe(true);
  });
});

describe('CM-018: live stepping API', () => {
  it('stepping minute-by-minute is byte-identical to full simulate()', () => {
    for (const seed of [1, 42, 777, 20260928]) {
      const e1 = new MatchEngine({ seed });
      const h1 = createTeam(1, 'Home', true, { bench: true });
      const a1 = createTeam(2, 'Away', false, { bench: true });
      const batch = e1.simulate(h1, a1);

      const e2 = new MatchEngine({ seed });
      const h2 = createTeam(1, 'Home', true, { bench: true });
      const a2 = createTeam(2, 'Away', false, { bench: true });
      e2.startMatch(h2, a2);
      while (!e2.isFinished) e2.stepMinute();
      const stepped = e2.result();

      expect(stepped.homeTeam.goals).toBe(batch.homeTeam.goals);
      expect(stepped.awayTeam.goals).toBe(batch.awayTeam.goals);
      expect(stepped.homeTeam.possession).toBe(batch.homeTeam.possession);
      expect(JSON.stringify(stepped.events)).toBe(JSON.stringify(batch.events));
    }
  });

  it('stepMinute yields per-minute event slices and a running scoreline', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home', true);
    const away = createTeam(2, 'Away', false);
    engine.startMatch(home, away);
    expect(engine.currentMinute).toBe(0);
    expect(() => engine.stepMinute()).not.toThrow();
    expect(engine.currentMinute).toBe(1);
    const all: unknown[] = [];
    while (!engine.isFinished) {
      const step = engine.stepMinute();
      all.push(...step.events);
    }
    expect(engine.currentMinute).toBe(90);
    expect(all.length).toBeGreaterThan(0);
    expect(engine.result().events.length).toBe(all.length);
    // finished matches step no-op
    const after = engine.stepMinute();
    expect(after.events).toHaveLength(0);
  });

  it('mid-match tactic changes apply from the NEXT minute (mentality signal)', () => {
    // Two engines, same seed, identical first half; then one flips mentality.
    // The attacking side must produce measurably MORE second-half shots.
    const secondHalfShots = (mentality: 'attacking' | 'defensive') => {
      let total = 0;
      for (let seed = 0; seed < 60; seed++) {
        const engine = new MatchEngine({ seed });
        const home = createTeam(1, 'Home', true);
        const away = createTeam(2, 'Away', false);
        engine.startMatch(home, away);
        while (engine.currentMinute < 45) engine.stepMinute();
        const shotsAtHT = home.shots + away.shots;
        home.tactic.mentality = mentality; // applies from minute 46 onward
        while (!engine.isFinished) engine.stepMinute();
        total += home.shots + away.shots - shotsAtHT;
      }
      return total;
    };
    const attack = secondHalfShots('attacking');
    const defend = secondHalfShots('defensive');
    expect(attack).toBeGreaterThan(defend);
  });
});