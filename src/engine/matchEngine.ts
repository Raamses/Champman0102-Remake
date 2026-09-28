// @paths lib/engine
import { RNG } from './rng';
import {
  MatchConfig,
  DEFAULT_MATCH_CONFIG,
  TeamState,
  MatchEvent,
  MatchResult,
  PlayerState,
  ChanceType,
  MatchEventType,
} from './types';
import {
  calculateTacticAttackFactor,
  calculateTacticDefensePressure,
  calculateStaminaIntensity,
} from '../lib/tactics/modifiers';
import { getFormation, type Tactic } from '../lib/tactics/types';
import { applySetPieceResolution } from '../lib/tactics/setpieces';
import { substituteAI } from '../lib/tactics/substitutions';

/**
 * Match Engine v2 — Calibrated
 * 
 * Fixes from Gemini audit:
 * - D6: CP rate 0.133/min (not 14/min), threshold 0.85 (not 8.0 or 20)
 * - D6: Conversion ~12% base, clamped to [0,1] (not unbounded)
 * - D12: Seeded PRNG (Mulberry32, not Math.random)
 * - D3: Home bonus +15% (not +10%)
 * - D16: Supports 133k staff / 110k players
 */
export class MatchEngine {
  private rng: RNG;
  private config: MatchConfig;
  private events: MatchEvent[] = [];
  private homeCP: number = 0;
  private awayCP: number = 0;

  constructor(config: Partial<MatchConfig> = {}) {
    this.config = { ...DEFAULT_MATCH_CONFIG, ...config };
    this.rng = new RNG(this.config.seed);
  }

  /**
   * Simulate a full match between two teams
   */
  simulate(homeTeam: TeamState, awayTeam: TeamState): MatchResult {
    this.events = [];
    
    // Reset team stats
    homeTeam.goals = 0;
    homeTeam.shots = 0;
    homeTeam.shotsOnTarget = 0;
    awayTeam.goals = 0;
    awayTeam.shots = 0;
    awayTeam.shotsOnTarget = 0;

    // Simulate each minute
    for (let minute = 1; minute <= this.config.maxMinutes; minute++) {
      this.simulateMinute(minute, homeTeam, awayTeam);
    }

    return {
      homeTeam,
      awayTeam,
      events: this.events,
      seed: this.config.seed,
    };
  }

  /**
   * Simulate a single minute
   */
  private simulateMinute(minute: number, home: TeamState, away: TeamState) {
    // Home team chance creation
    this.processMinuteForTeam(minute, home, away, 'home');
    
    // Away team chance creation
    this.processMinuteForTeam(minute, away, home, 'away');

    // Context-aware AI substitutions (after minute 55 when bench players exist)
    this.processSubstitutions(minute, home, away.goals, 'home');
    this.processSubstitutions(minute, away, home.goals, 'away');

    // Update stamina for all players
    this.updateStamina(home);
    this.updateStamina(away);
  }

  /**
   * Process one minute for one team
   */
  private processMinuteForTeam(minute: number, team: TeamState, opponent: TeamState, side: 'home' | 'away') {
    // Calculate chance points for this minute and accumulate
    const cp = this.calculateChancePoints(team, opponent);
    
    // Accumulate CP
    if (side === 'home') {
      this.homeCP += cp;
      if (this.homeCP >= this.config.chanceThreshold) {
        this.homeCP -= this.config.chanceThreshold;
        this.resolveChance(minute, team, opponent, side);
      }
    } else {
      this.awayCP += cp;
      if (this.awayCP >= this.config.chanceThreshold) {
        this.awayCP -= this.config.chanceThreshold;
        this.resolveChance(minute, team, opponent, side);
      }
    }
  }

  /**
   * Calculate chance points per minute (calibrated, tactics fully wired)
   * Average team: ~0.133 CP/min → ~12 CP/match → ~14 chances/match
   * Uses ALL five tactic dimensions: mentality, tempo, pressing, passing, width.
   */
  private calculateChancePoints(team: TeamState, opponent: TeamState): number {
    const midfielders = team.players.filter(p => p.position === 'MID');
    const attackers = team.players.filter(p => p.position === 'ATT');
    const avgMidfield = this.avgAttribute(midfielders, ['creativity', 'passing', 'offTheBall', 'intelligence']);
    const avgAttack = this.avgAttribute(attackers, ['finishing', 'technique', 'offTheBall', 'pace']);

    // Base CP from player quality (normalized to 0-1 range)
    // Weight midfielders slightly more for chance creation (they dominate possession phase)
    const base = ((avgMidfield * 0.7 + avgAttack * 0.3) / 20.0) * this.config.baseChanceRate;

    // Full multi-plane tactic attack factor (all 5 dimensions + formation influence)
    const attackFactor = calculateTacticAttackFactor(team.tactic);

    // Home advantage (+15%)
    const homeBonus = team.isHome ? (1 + this.config.homeAdvantagePercent / 100) : 1.0;

    // Formation influence on chance volume:
    // Blend midfield and attack multipliers. Midfield (0.4) provides creation,
    // while attack (0.6) drives final-third volume.
    // (Activates CM-016b blend, superseding aggregate crossFactor*throughBallBias)
    const form = getFormation(team.tactic.formation);
    const formationAdjustment = form.midfieldMult * 0.4 + form.attackMult * 0.6;

    // Opponent tactical pressure (defensive mentality + high pressing reduce our CP)
    const oppDefencePressure = calculateTacticDefensePressure(opponent.tactic);

    return base * attackFactor * homeBonus * formationAdjustment * oppDefencePressure;
  }

  /**
   * Resolve a chance — determine outcome with full attribute weighting.
   * Uses shooter attributes weighted against defender pressure + keeper skill.
   * Opponent defensive tactics also reduce conversion probability.
   * CM-017: Activates crossFactor, throughBallBias, and headerBias via chance-type modeling.
   */
  private resolveChance(
    minute: number,
    team: TeamState,
    opponent: TeamState,
    side: 'home' | 'away'
  ) {
    const attackers = team.players.filter(p => p.position === 'ATT');
    const defenders = opponent.players.filter(
      p => p.position === 'DEF' || p.position === 'MID'
    );
    const keeper = opponent.players.find(p => p.position === 'GK');

    if (attackers.length === 0 || !keeper) return;

    // Pick a random attacker
    const attacker = attackers[this.rng.int(0, attackers.length - 1)];
    const form = getFormation(team.tactic.formation);

    // Chance-type modeling (cross / through-ball / header / long-shot / one-on-one)
    // ACTIVATES all three formation fields: crossFactor, throughBallBias, headerBias
    const crossWeight = 0.25 * form.crossFactor;
    const throughBallWeight = 0.20 * form.throughBallBias;
    const headerWeight = 0.15 * form.headerBias;
    const longShotWeight = 0.20;
    const oneOnOneWeight = 0.20 * form.attackMult;

    const totalWeight = crossWeight + throughBallWeight + headerWeight + longShotWeight + oneOnOneWeight;
    const rollType = this.rng.next() * totalWeight;

    let chanceType: ChanceType;
    if (rollType < crossWeight) {
      chanceType = 'cross';
    } else if (rollType < crossWeight + throughBallWeight) {
      chanceType = 'through-ball';
    } else if (rollType < crossWeight + throughBallWeight + headerWeight) {
      chanceType = 'header';
    } else if (rollType < crossWeight + throughBallWeight + headerWeight + longShotWeight) {
      chanceType = 'long-shot';
    } else {
      chanceType = 'one-on-one';
    }

    let attackStrength: number;
    let typeMultiplier = 1.0;

    if (chanceType === 'header') {
      const heading = attacker.attributes.heading ?? 10;
      const jumping = attacker.attributes.jumping ?? 10;
      const strength = attacker.attributes.strength ?? 10;
      const finishing = attacker.attributes.finishing ?? 10;
      attackStrength = (heading * 0.4 + jumping * 0.2 + strength * 0.2 + finishing * 0.2) / 10;
      typeMultiplier = 1.05 * form.headerBias;
    } else if (chanceType === 'cross') {
      const finishing = attacker.attributes.finishing ?? 10;
      const anticipation = attacker.attributes.anticipation ?? 10;
      const technique = attacker.attributes.technique ?? 10;
      const heading = attacker.attributes.heading ?? 10;
      attackStrength = (finishing * 0.4 + anticipation * 0.2 + technique * 0.2 + heading * 0.2) / 10;
      typeMultiplier = 1.10 * (form.crossFactor * 0.5 + form.attackMult * 0.5);
    } else if (chanceType === 'through-ball') {
      const finishing = attacker.attributes.finishing ?? 10;
      const pace = attacker.attributes.pace ?? 10;
      const offTheBall = attacker.attributes.offTheBall ?? 10;
      const composure = attacker.attributes.composure ?? 10;
      attackStrength = (finishing * 0.4 + pace * 0.2 + offTheBall * 0.2 + composure * 0.2) / 10;
      typeMultiplier = 1.15;
    } else if (chanceType === 'one-on-one') {
      const finishing = attacker.attributes.finishing ?? 10;
      const composure = attacker.attributes.composure ?? 10;
      const dribbling = attacker.attributes.dribbling ?? 10;
      attackStrength = (finishing * 0.4 + composure * 0.3 + dribbling * 0.3) / 10;
      typeMultiplier = 1.35;
    } else { // long-shot
      const longShots = attacker.attributes.longShots ?? 10;
      const technique = attacker.attributes.technique ?? 10;
      const shooting = attacker.attributes.shooting ?? attacker.attributes.finishing ?? 10;
      attackStrength = (longShots * 0.5 + technique * 0.3 + shooting * 0.2) / 10;
      typeMultiplier = 0.70;
    }

    // Defender pressure
    const defenseStrength =
      defenders.length > 0
        ? this.avgAttribute(
            defenders,
            ['positioning', 'tackling', 'marking'] as (keyof PlayerState['attributes'])[]
          ) / 10
        : 0;

    // Keeper skill
    const keeperStrength =
      (keeper.attributes.handling * 0.35 +
       keeper.attributes.reflexes * 0.35 +
       keeper.attributes.oneOnOnes * 0.3) /
      10;

    // Conversion roll: attacker vs (defender + keeper)
    const denom = Math.max(0.5, defenseStrength * 0.5 + keeperStrength * 0.5);
    let rawProb = this.config.baseConversionRate * (attackStrength / denom) * typeMultiplier;

    // Opponent defensive tactics further reduce conversion
    const oppDefence = calculateTacticDefensePressure(opponent.tactic);
    rawProb *= oppDefence;

    // Stamina effect: tired players shoot less accurately
    if (attacker.stamina < 50) {
      rawProb *= 0.85; // 15% reduction when fatigued
    }

    const goalProb = Math.min(1, Math.max(0, rawProb));
    const roll = this.rng.next();

    if (roll < goalProb) {
      // GOAL!
      team.goals++;
      team.shots++;
      team.shotsOnTarget++;
      this.events.push({
        minute,
        type: 'goal',
        team: side,
        playerId: attacker.id,
        playerName: attacker.name,
        chanceType,
        description: `⚽ GOAL! ${attacker.name} scores for ${team.name}!`,
      });
    } else if (roll < goalProb + 0.3) {
      // Saved
      team.shots++;
      team.shotsOnTarget++;
      this.events.push({
        minute,
        type: 'save',
        team: side,
        playerId: attacker.id,
        playerName: attacker.name,
        chanceType,
        description: `🧤 Save by ${keeper.name}`,
      });
    } else {
      // Miss
      team.shots++;
      this.events.push({
        minute,
        type: 'miss',
        team: side,
        playerId: attacker.id,
        playerName: attacker.name,
        chanceType,
        description: `Miss by ${attacker.name}`,
      });
    }
  }

  /**
   * Evaluate context-aware substitutions (lib/tactics/substitutions.ts)
   */
  private processSubstitutions(
    minute: number,
    team: TeamState,
    opponentGoals: number,
    side: 'home' | 'away'
  ) {
    const sub = substituteAI(team, opponentGoals, minute);
    if (!sub) return;

    const subIn = team.players[sub.subInIdx];
    const subOut = team.players[sub.subOutIdx];
    if (!subIn || !subOut) return;

    subIn.minutesPlayed = 0;
    subIn.stamina = 85;

    this.events.push({
      minute,
      type: 'sub',
      team: side,
      playerId: subIn.id,
      subInId: subIn.id,
      subOutId: subOut.id,
      playerName: subIn.name,
      subInName: subIn.name,
      subOutName: subOut.name,
      description: `🔄 Substitution for ${team.name}: ${subIn.name} on for ${subOut.name}`,
    });
  }

  /**
   * Simulate a set piece (corner, free kick) using applySetPieceResolution from lib/tactics/setpieces.ts
   */
  public simulateSetPiece(
    team: TeamState,
    opponent: TeamState,
    side: 'home' | 'away',
    type: 'corner' | 'freeKick',
    minute: number
  ): MatchEvent {
    const attackers = team.players.filter(p => p.position === 'ATT' || p.position === 'MID');
    const defenders = opponent.players.filter(p => p.position === 'DEF');
    const keeper = opponent.players.find(p => p.position === 'GK') || opponent.players[0];

    const taker = attackers[this.rng.int(0, attackers.length - 1)] || team.players[0];
    const defenderAttrs = defenders.map(d => d.attributes);

    const outcome = applySetPieceResolution(
      taker.attributes,
      defenderAttrs,
      keeper.attributes,
      this.rng,
      type
    );

    let eventType: MatchEventType = type;
    let description = `${type === 'corner' ? '🚩 Corner' : '🎯 Free kick'} for ${team.name}`;

    if (outcome === 'goal') {
      team.goals++;
      team.shots++;
      team.shotsOnTarget++;
      eventType = 'goal';
      description = `⚽ GOAL! ${taker.name} scores from a ${type === 'corner' ? 'corner' : 'free kick'}!`;
    } else if (outcome === 'save') {
      team.shots++;
      team.shotsOnTarget++;
      eventType = 'save';
      description = `🧤 ${keeper.name} saves the ${type} attempt from ${taker.name}`;
    } else {
      team.shots++;
      eventType = 'miss';
      description = `${taker.name} sends the ${type} off target`;
    }

    const event: MatchEvent = {
      minute,
      type: eventType,
      team: side,
      playerId: taker.id,
      playerName: taker.name,
      description,
    };
    this.events.push(event);
    return event;
  }

  /**
   * Stamina decay per minute — tempo and pressing combine multiplicatively.
   * Ultra-attacking adds extra cost. Natural fitness scales resistance.
   */
  private updateStamina(team: TeamState) {
    const intensity = calculateStaminaIntensity(
      team.tactic.tempo,
      team.tactic.pressing,
      team.tactic.mentality
    );

    for (const player of team.players) {
      const fitnessFactor = 20 / Math.max(1, player.attributes.naturalFitness);
      const decay = 0.5 * intensity * fitnessFactor;
      player.stamina = Math.max(0, player.stamina - decay);
      player.minutesPlayed++;
    }
  }

  /**
   * Get average of specified attributes for a list of players
   */
  private avgAttribute(
    players: PlayerState[],
    attrs: (keyof PlayerState['attributes'])[]
  ): number {
    if (players.length === 0) return 0;
    let sum = 0;
    let count = 0;
    for (const p of players) {
      for (const attr of attrs) {
        sum += (p.attributes[attr] as number) || 0;
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  }
}
