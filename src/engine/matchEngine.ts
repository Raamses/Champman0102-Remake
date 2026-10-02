// @paths lib/engine
import { RNG, seedFromString } from './rng';
import {
  MatchConfig,
  DEFAULT_MATCH_CONFIG,
  TeamState,
  MatchEvent,
  MatchResult,
  PlayerState,
  MatchEventType,
} from './types';
import {
  calculateTacticAttackFactor,
  calculateTacticDefensePressure,
  calculateStaminaIntensity,
} from '../lib/tactics/modifiers';
import { substituteAI } from '../lib/tactics/substitutions';
import { applySetPieceResolution } from '../lib/tactics/setpieces';
import { classifyChance } from '../lib/commentary/chanceTypes';
import type { ChanceType, SetPieceKind } from '../lib/commentary/types';
import { getFormation, type Tactic } from '../lib/tactics/types';

/** Additive, back-compatible event extras attached by CM-017 */
export interface MatchEventExtras {
  chanceType?: ChanceType;
  setPiece?: SetPieceKind;
  subInId?: number;
  subOutId?: number;
  secondYellow?: boolean;
  recovered?: boolean;
  keeperId?: number;
}

/**
 * Match Engine v3 — CM-017 chance types + full event stream
 *
 * CM-017 additions (ALL consume the dedicated feature RNG `varRng`, never
 * the outcome RNG `rng` — CM-014/016 seeded sequences stay byte-identical):
 * - Chance-type classification (cross / through-ball / header / long-shot /
 *   one-on-one) ACTIVATING the three dead CM-016b blend fields
 *   (crossFactor, throughBallBias, headerBias), renormalized against the
 *   4-4-2 baseline mix so conversion quality is redistributed, not inflated.
 * - Emission of the remaining MatchEvent types: assist, yellow, red,
 *   injury, sub (wired via lib/tactics/substitutions.ts), chance.
 * - Set-piece hooks using lib/tactics/setpieces.ts (corners / free kicks).
 */
export class MatchEngine {
  private rng: RNG;
  /** Feature stream: commentary-grade flavor events + chance typing. */
  private varRng: RNG;
  private config: MatchConfig;
  private events: MatchEvent[] = [];
  private homeCP: number = 0;
  private awayCP: number = 0;
  private subCount: Map<number, number> = new Map();
  /** CM-018 live-mode minute cursor + team references. */
  private minute: number = 0;
  private liveTeams: { home: TeamState; away: TeamState } | null = null;

  constructor(config: Partial<MatchConfig> = {}) {
    this.config = { ...DEFAULT_MATCH_CONFIG, ...config };
    if (config.baseConversionRate === undefined) {
      // Derived from target 0.12 base conversion divided by 0.9 (attackStrength weights sum)
      this.config.baseConversionRate = 0.12 / 0.9;
    }
    this.rng = new RNG(this.config.seed);
    // Feature stream derived from the same match seed, independent stream.
    this.varRng = new RNG(seedFromString(`cm017:${this.config.seed}`));
  }

  /**
   * Simulate a full match between two teams
   */
  simulate(homeTeam: TeamState, awayTeam: TeamState): MatchResult {
    this.startMatch(homeTeam, awayTeam);
    while (!this.isFinished) this.stepMinute();
    return this.result();
  }

  /**
   * CM-018 live mode: initialize a match for minute-by-minute stepping.
   * Identical reset logic to the old simulate() preamble, so the RNG
   * consumption order (outcome `rng` + feature `varRng` + CP accumulators)
   * is untouched: stepping N minutes equals simulate() byte-for-byte.
   * Mid-match tactic mutations (home.tactic / away.tactic) apply from the
   * next stepMinute() because every minute re-reads team.tactic.
   */
  startMatch(homeTeam: TeamState, awayTeam: TeamState): void {
    this.minute = 0;
    this.events = [];
    this.homeCP = 0;
    this.awayCP = 0;
    this.subCount = new Map();

    // Reset team stats
    homeTeam.goals = 0;
    homeTeam.shots = 0;
    homeTeam.shotsOnTarget = 0;
    awayTeam.goals = 0;
    awayTeam.shots = 0;
    awayTeam.shotsOnTarget = 0;

    // CM-022d: idempotent pitch init. Assign unconditionally by slot — the
    // first 11 slots start on the pitch, the rest on the bench — so re-running
    // startMatch on a used squad resets exactly as a virgin init would. The
    // old `p.onPitch ?? (i < 11)` only initialized a virgin squad: any player
    // whose onPitch was already set (subbed-off starters, red-carded players,
    // subbed-in bench players) kept their end-of-match value forever, freezing
    // the closing roster into every later startMatch on the same squad —
    // while startMatch otherwise resets everything it owns and claims to
    // support reuse (CM-018 live mode). Single-run behavior is unchanged:
    // no caller ever supplied a pre-set onPitch that differs from the slot
    // default (bench slots carried onPitch:false, starter slots undefined),
    // so for every existing call the two forms assign identical values.
    // Not owned by initPitch (documented in CM-022d): startMatch still does
    // NOT reset stamina/minutesPlayed/yellowCards/redCard/isInjured — those
    // ride stale on a re-run and a full squad reset is deferred to its own PR.
    const initPitch = (team: TeamState) => {
      team.players.forEach((p, i) => {
        p.onPitch = i < 11;
      });
    };
    initPitch(homeTeam);
    initPitch(awayTeam);

    this.liveTeams = { home: homeTeam, away: awayTeam };
  }

  /** Current minute cursor (0 = pre-kickoff, maxMinutes = full time). */
  get currentMinute(): number {
    return this.minute;
  }

  /** True when the match has played all its minutes. */
  get isFinished(): boolean {
    return this.minute >= this.config.maxMinutes;
  }

  /**
   * Advance exactly one minute. Returns that minute's slice of the event
   * stream plus the running scoreline. Throws when called before
   * startMatch(); no-ops (empty events) once finished.
   */
  stepMinute(): { minute: number; events: MatchEvent[]; homeGoals: number; awayGoals: number } {
    if (!this.liveTeams) throw new Error('stepMinute() called before startMatch()');
    if (this.isFinished) {
      return { minute: this.minute, events: [], homeGoals: this.liveTeams.home.goals, awayGoals: this.liveTeams.away.goals };
    }
    const before = this.events.length;
    this.minute++;
    this.simulateMinute(this.minute, this.liveTeams.home, this.liveTeams.away);
    return {
      minute: this.minute,
      events: this.events.slice(before),
      homeGoals: this.liveTeams.home.goals,
      awayGoals: this.liveTeams.away.goals,
    };
  }

  /** Snapshot the result so far (also the final result when isFinished). */
  result(): MatchResult {
    if (!this.liveTeams) throw new Error('result() called before startMatch()');
    // Derived possession: share of accumulated chance points (approximation
    // of territorial dominance; 50/50 when neither side created anything).
    const totalCP = this.homeCP + this.awayCP;
    if (totalCP > 0) {
      this.liveTeams.home.possession = Math.round((this.homeCP / totalCP) * 100);
      this.liveTeams.away.possession = 100 - this.liveTeams.home.possession;
    }
    return {
      homeTeam: this.liveTeams.home,
      awayTeam: this.liveTeams.away,
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

    // CM-017: set-piece hooks (lib/tactics/setpieces.ts) wired into the minute loop
    this.processSetPieces(minute, home, away);

    // CM-017: remaining spec-mandated event types (penalty / ownGoal / offside / foul)
    this.processOccurrenceEvents(minute, home, away, 'home', 'away');
    this.processOccurrenceEvents(minute, away, home, 'away', 'home');

    // Discipline / injury / substitutions — feature-RNG / state driven
    this.simulateDiscipline(minute, home);
    this.simulateDiscipline(minute, away);
    this.simulateInjury(minute, home);
    this.simulateInjury(minute, away);
    this.simulateSubstitution(minute, home, away.goals);
    this.simulateSubstitution(minute, away, home.goals);

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
    // Blend midfield and attack multipliers. Midfield (0.25) provides the creation platform,
    // while attack (0.75) drives final-third volume and finishing presence.
    // This honors formation identity (e.g. 3-4-3 with attackMult 1.2 outscore 4-4-2).
    const form = getFormation(team.tactic.formation);
    const formationAdjustment = form.midfieldMult * 0.25 + form.attackMult * 0.75;

    // Opponent tactical pressure (defensive mentality + high pressing reduce our CP)
    const oppDefensePressure = calculateTacticDefensePressure(opponent.tactic);

    return base * attackFactor * homeBonus * formationAdjustment * oppDefensePressure;
  }

  /**
   * Resolve a chance — classify the chance type (CM-017), then determine
   * the outcome with full attribute weighting.
   *
   * Type classification + emission consume ONLY the feature RNG stream;
   * the conversion roll stays on the outcome RNG in the exact CM-014/016
   * position, so existing seeded sequences remain reproducible.
   */
  private resolveChance(
    minute: number,
    team: TeamState,
    opponent: TeamState,
    side: 'home' | 'away'
  ) {
    const attackers = team.players.filter(p => p.position === 'ATT' && p.onPitch !== false);
    const defenders = opponent.players.filter(
      p => (p.position === 'DEF' || p.position === 'MID') && p.onPitch !== false
    );
    const keeper = opponent.players.find(p => p.position === 'GK' && p.onPitch !== false) ||
                   opponent.players.find(p => p.onPitch !== false);

    if (attackers.length === 0 || !keeper) return;

    // Pick a random attacker
    const attacker = attackers[this.rng.int(0, attackers.length - 1)];

    // CM-017: classify the chance type (feature RNG; activates the dead fields)
    const cls = classifyChance(team.tactic.formation, team.tactic, attacker, this.varRng);

    // Creation commentary: the chance event (type emitted before its outcome).
    this.events.push({
      minute,
      type: 'chance',
      team: side,
      playerId: attacker.id,
      description: `${attacker.name} creates a ${cls.type} chance`,
      chanceType: cls.type,
    } as MatchEvent & MatchEventExtras);

    // Attacker strength: weighted combination of shooting, technique, composure, offTheBall.
    // The weights (0.35 + 0.20 + 0.20 + 0.15) sum to 0.9, reserving 0.1 for implicit
    // tactical luck / unmodeled factors. baseConversionRate = 0.12 / 0.9 ≈ 0.1333 scales
    // this so that baseline attribute ratings (10) convert at the calibrated 12% rate.
    // Use ?? semantics to preserve legitimate 0 ratings instead of treating them as missing.
    const shooting = attacker.attributes.finishing ?? attacker.attributes.shooting ?? 0;
    const attackStrength =
      (shooting * 0.35 +
       attacker.attributes.technique * 0.2 +
       attacker.attributes.composure * 0.2 +
       attacker.attributes.offTheBall * 0.15) /
      10;

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
    let rawProb = this.config.baseConversionRate * (attackStrength / denom);

    // Opponent defensive tactics further reduce conversion
    const oppDefense = calculateTacticDefensePressure(opponent.tactic);
    rawProb *= oppDefense;

    // Stamina effect: tired players shoot less accurately
    if (attacker.stamina < 50) {
      rawProb *= 0.85; // 15% reduction when fatigued
    }

    // CM-017 chance-type conversion shift (renormalized — see chanceTypes.ts)
    rawProb *= cls.conversionMultiplier;

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
        description: `⚽ GOAL! ${attacker.name} scores for ${team.name}!`,
        chanceType: cls.type,
      } as MatchEvent & MatchEventExtras);

      // CM-017: assist attribution (~72%), from MID/ATT excluding the scorer
      if (this.varRng.next() < 0.72) {
        const providers = team.players.filter(
          p => (p.position === 'MID' || p.position === 'ATT') && p.onPitch !== false && p.id !== attacker.id
        );
        if (providers.length > 0) {
          const provider = providers[this.varRng.int(0, providers.length - 1)];
          (this.events[this.events.length - 1] as MatchEvent & MatchEventExtras).assistId = provider.id;
        }
      }
    } else if (roll < goalProb + 0.3) {
      // Saved
      team.shots++;
      team.shotsOnTarget++;
      this.events.push({
        minute,
        type: 'save',
        team: side,
        playerId: attacker.id,
        description: `🧤 Save by ${keeper.name}`,
        chanceType: cls.type,
        keeperId: keeper.id,
      } as MatchEvent & MatchEventExtras);
    } else {
      // Miss
      team.shots++;
      this.events.push({
        minute,
        type: 'miss',
        team: side,
        playerId: attacker.id,
        description: `Miss by ${attacker.name}`,
        chanceType: cls.type,
      } as MatchEvent & MatchEventExtras);
    }
  }

  /**
   * CM-017: wire the set-piece hooks (lib/tactics/setpieces.ts) into the
   * minute loop. Rates are per team per minute.
   */
  private processSetPieces(minute: number, home: TeamState, away: TeamState) {
    if (this.varRng.chance(this.config.setPieceCornerRate)) {
      this.simulateSetPiece(home, away, 'home', 'corner', minute);
    }
    if (this.varRng.chance(this.config.setPieceCornerRate)) {
      this.simulateSetPiece(away, home, 'away', 'corner', minute);
    }
    if (this.varRng.chance(this.config.setPieceFreeKickRate)) {
      this.simulateSetPiece(home, away, 'home', 'freeKick', minute);
    }
    if (this.varRng.chance(this.config.setPieceFreeKickRate)) {
      this.simulateSetPiece(away, home, 'away', 'freeKick', minute);
    }
  }

  /**
   * CM-017: emit the remaining spec-mandated event types — penalty /
   * missedPenalty / ownGoal / offside / foul. open-play chances require on-pitch attackers (resolveChance early-returns); penalties/own goals/offsides/fouls fire regardless of the attacking side's composition; a penalty cannot be awarded when the opposing side has NO on-pitch player.
   */
  private processOccurrenceEvents(minute: number, team: TeamState, opponent: TeamState, side: 'home' | 'away', oppSide: 'home' | 'away') {
    const onPitch = team.players.filter(p => p.onPitch !== false);
    if (onPitch.length === 0) return;

    const opponentKeeper = opponent.players.find(p => p.position === 'GK' && p.onPitch !== false) || opponent.players.find(p => p.onPitch !== false);

    // Penalty awarded to `team`
    if (this.varRng.chance(this.config.penaltyRate)) {
      if (!opponentKeeper) return; // this is an opposition-existence guard, NOT the removed attacker-composition gate
      const takers = onPitch.filter(p => p.position === 'MID' || p.position === 'ATT');
      const taker =
        [...takers].sort((a, b) => b.attributes.penaltyTaking - a.attributes.penaltyTaking)[0] ?? onPitch[0];
      team.shots++;
      if (this.varRng.next() < this.config.penaltyConversion) {
        team.goals++;
        team.shotsOnTarget++;
        this.events.push({
          minute,
          type: 'penalty',
          team: side,
          playerId: taker.id,
          playerName: taker.name,
          description: `🎯 ${taker.name} converts the penalty for ${team.name}!`,
          keeperId: opponentKeeper.id,
        } as MatchEvent & MatchEventExtras);
      } else if (this.varRng.chance(0.5)) {
        team.shotsOnTarget++;
        this.events.push({
          minute,
          type: 'missedPenalty',
          team: side,
          playerId: taker.id,
          playerName: taker.name,
          description: `😖 ${taker.name}'s penalty is saved!`,
          keeperId: opponentKeeper.id,
        } as MatchEvent & MatchEventExtras);
      } else {
        this.events.push({
          minute,
          type: 'missedPenalty',
          team: side,
          playerId: taker.id,
          playerName: taker.name,
          description: `😖 ${taker.name} sends the penalty wide!`,
          keeperId: opponentKeeper.id,
        } as MatchEvent & MatchEventExtras);
      }
    }

    // Own goal: a defender turns it into his own net (benefits the opponent)
    if (this.varRng.chance(this.config.ownGoalRate)) {
      const victims = onPitch.filter(p => p.position === 'DEF');
      const victim = victims.length > 0 ? victims[this.varRng.int(0, victims.length - 1)] : onPitch[0];
      opponent.goals++;
      this.events.push({
        minute,
        type: 'ownGoal',
        team: side,
        playerId: victim.id,
        playerName: victim.name,
        description: `😵 Own goal! ${victim.name} turns it into his own net for ${opponent.name}.`,
        creditTeam: oppSide,
      });
    }

    // Offside against `team`'s attack
    if (this.varRng.chance(this.config.offsideRate)) {
      const strikers = onPitch.filter(p => p.position === 'ATT');
      const player = strikers.length > 0 ? strikers[this.varRng.int(0, strikers.length - 1)] : onPitch[0];
      this.events.push({
        minute,
        type: 'offside',
        team: side,
        playerId: player.id,
        playerName: player.name,
        description: `🚩 Flag up — ${player.name} strayed offside.`,
      });
    }

    // Foul by `team` (uniform over on-pitch players)
    if (this.varRng.chance(this.config.foulRate)) {
      const offender = onPitch[this.varRng.int(0, onPitch.length - 1)];
      this.events.push({
        minute,
        type: 'foul',
        team: side,
        playerId: offender.id,
        playerName: offender.name,
        description: `Foul by ${offender.name}.`,
      });
    }
  }

  /**
   * Simulate a set piece (corner, free kick) using applySetPieceResolution from lib/tactics/setpieces.ts
   */
  private simulateSetPiece(
    team: TeamState,
    opponent: TeamState,
    side: 'home' | 'away',
    type: 'corner' | 'freeKick',
    minute: number
  ): MatchEvent | void {
    const onPitch = team.players.filter(p => p.onPitch !== false);
    if (onPitch.length === 0) return;
    const takers = [...onPitch].sort((a, b) => {
      const attr = type === 'corner' ? 'corners' : 'freeKicks';
      return (b.attributes[attr] || 0) - (a.attributes[attr] || 0);
    });
    const taker = takers[0] || onPitch[0];

    const defenders = opponent.players.filter(p => p.position !== 'GK' && p.onPitch !== false);
    const keeper = opponent.players.find(p => p.position === 'GK' && p.onPitch !== false) || opponent.players.find(p => p.onPitch !== false);
    if (!keeper) return;
    const defenderAttrs = defenders.map(d => d.attributes);

    const deliveryEvent = {
      minute,
      type,
      team: side,
      playerId: taker.id,
      playerName: taker.name,
      description: `${type === 'corner' ? '🚩 Corner' : '🎯 Free kick'} for ${team.name}`,
      setPiece: type
    } as MatchEvent & MatchEventExtras;
    this.events.push(deliveryEvent);

    const convertsToShot = type === 'corner' ? this.varRng.next() < 0.13 : this.varRng.next() < 0.22;
    if (!convertsToShot) return deliveryEvent;

    const outcome = applySetPieceResolution(
      taker.attributes,
      defenderAttrs,
      keeper.attributes,
      this.varRng,
      type
    );

    let eventType: MatchEventType;
    let description: string;

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

    const event = {
      minute,
      type: eventType,
      team: side,
      playerId: taker.id,
      playerName: taker.name,
      description,
      setPiece: type,
      keeperId: keeper.id,
    } as MatchEvent & MatchEventExtras;
    this.events.push(event);
    return event;
  }

  /**
   * CM-017 discipline emitters — bookings and sendings-off. Events are
   * informational for the commentary feed (MVP: no squad-strength ripple,
   * deterministic feature-RNG only).
   */
  private simulateDiscipline(minute: number, team: TeamState) {
    for (const p of team.players) {
      if (p.onPitch === false) continue;
      if (p.redCard) continue; // already off
      const rate = 0.0022 * (p.attributes.aggression / 10) * (p.attributes.dirtiness / 10);
      if (!this.varRng.chance(rate)) continue;
      if (p.yellowCards >= 1 && this.varRng.chance(0.25)) {
        p.redCard = true;
        p.yellowCards++;
        p.onPitch = false;
        this.events.push({
          minute,
          type: 'red',
          team: team.isHome ? 'home' : 'away',
          playerId: p.id,
          description: `🟥 Second yellow — ${p.name} is sent off!`,
          secondYellow: true,
        } as MatchEvent & MatchEventExtras);
      } else {
        p.yellowCards++;
        this.events.push({
          minute,
          type: 'yellow',
          team: team.isHome ? 'home' : 'away',
          playerId: p.id,
          description: `🟨 ${p.name} is booked.`,
        } as MatchEvent & MatchEventExtras);
      }
    }
  }

  /** CM-017 injury events (informational in MVP; recovery in ~70%). */
  private simulateInjury(minute: number, team: TeamState) {
    for (const p of team.players) {
      if (p.onPitch === false) continue;
      if (p.isInjured) continue;
      const rate = 0.0008 * (p.attributes.injuryProneness / 10);
      if (!this.varRng.chance(rate)) continue;
      p.isInjured = true;
      const recovered = this.varRng.chance(0.7);
      this.events.push({
        minute,
        type: 'injury',
        team: team.isHome ? 'home' : 'away',
        playerId: p.id,
        description: recovered ? `🚑 ${p.name} shakes it off and plays on.` : `🚑 ${p.name} is down and needs treatment.`,
        recovered,
      } as MatchEvent & MatchEventExtras);
      if (!recovered) p.isInjured = false; // MVP: stays on, flagged in commentary only
    }
  }

  /** CM-017: wire lib/tactics/substitutions.ts into the engine. */
  private simulateSubstitution(minute: number, team: TeamState, opponentGoals: number) {
    const used = this.subCount.get(team.id) ?? 0;
    if (used >= 3) return;
    const swap = substituteAI(team, opponentGoals, minute);
    if (!swap) return;
    const incoming = team.players[swap.subInIdx];
    const outgoing = team.players[swap.subOutIdx];
    this.subCount.set(team.id, used + 1);

    // Swap shirts: the incoming player takes the outgoing slot's state.
    const inPlayer = { ...incoming, stamina: Math.min(100, incoming.stamina + 40), minutesPlayed: outgoing.minutesPlayed };
    const outPlayer = { ...outgoing, minutesPlayed: outgoing.minutesPlayed };
    team.players[swap.subOutIdx] = {
      ...outPlayer,
      id: incoming.id,
      name: incoming.name,
      position: incoming.position,
      attributes: incoming.attributes,
      stamina: Math.min(100, incoming.stamina + 40),
      isInjured: false,
      yellowCards: 0,
      redCard: false,
      minutesPlayed: 0,
      onPitch: true,
    };
    team.players[swap.subInIdx] = {
      ...outgoing,
      id: outgoing.id,
      minutesPlayed: outgoing.minutesPlayed,
      onPitch: false,
    };
    void outPlayer;

    this.events.push({
      minute,
      type: 'sub',
      team: team.isHome ? 'home' : 'away',
      playerId: incoming.id,
      description: `🔄 ${team.name}: ${incoming.name} replaces ${outgoing.name}.`,
      subInId: incoming.id,
      subOutId: outgoing.id,
      playerName: incoming.name,
      subInName: incoming.name,
      subOutName: outgoing.name,
    } as MatchEvent & MatchEventExtras);
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
      if (player.onPitch === false) continue; // CM-017: bench/subbed-off players don't accumulate pitch minutes
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
