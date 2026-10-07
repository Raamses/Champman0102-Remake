// @paths lib/engine
import { RNG } from './rng';

/** Match event types (includes CM-017 additions) */
export type MatchEventType =
  | 'goal'
  | 'assist'
  | 'yellow'
  | 'red'
  | 'injury'
  | 'sub'
  | 'chance'
  | 'save'
  | 'miss'
  | 'corner'
  | 'freeKick'
  | 'penalty'
  | 'missedPenalty'
  | 'ownGoal'
  | 'offside'
  | 'foul';

/** Chance types modeled in CM-017 activating formation fields */
type ChanceType = 'cross' | 'through-ball' | 'header' | 'long-shot' | 'one-on-one';

/** Player attributes (1-20 scale, from binary struct names) */
export interface PlayerAttributes {
  acceleration: number;
  aggression: number;
  agility: number;
  anticipation: number;
  balance: number;
  bravery: number;
  consistency: number;
  composure: number;
  concentration: number;
  creativity: number;
  corners: number;
  crossing: number;
  decisions: number;
  determination: number;
  dirtiness: number;
  dribbling: number;
  eccentricity: number;
  finishing: number;
  firstTouch: number;
  flair: number;
  freeKicks: number;
  handling: number;
  heading: number;
  importantMatches: number;
  influence: number;
  injuryProneness: number;
  intelligence: number;
  jumping: number;
  leadership: number;
  leftFoot: number;
  longShots: number;
  longThrows: number;
  marking: number;
  naturalFitness: number;
  offTheBall: number;
  oneOnOnes: number;
  pace: number;
  passing: number;
  penaltyTaking: number;
  positioning: number;
  reflexes: number;
  rightFoot: number;
  rushingOut: number;
  setPieces: number;
  shooting?: number;
  sportsmanship: number;
  stamina: number;
  strength: number;
  tackling: number;
  teamwork: number;
  technique: number;
  throwing: number;
  versatility: number;
  vision: number;
  workRate: number;
}

/** Simplified player state for match engine */
export interface PlayerState {
  id: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'ATT';
  attributes: PlayerAttributes;
  stamina: number; // 0-100
  isInjured: boolean;
  yellowCards: number;
  redCard: boolean;
  minutesPlayed: number;
  /** CM-017: false for bench/subbed-off players; undefined or true = on the pitch */
  onPitch?: boolean;
}

/** Tactic settings */
export interface Tactic {
  formation: '4-4-2' | '4-3-3' | '3-5-2' | '4-5-1' | '5-3-2' | '3-4-3' | '5-4-1';
  mentality: 'attacking' | 'balanced' | 'defensive';
  tempo: 'slow' | 'normal' | 'fast';
  pressing: 'low' | 'normal' | 'high';
  width: 'narrow' | 'normal' | 'wide';
  passing: 'short' | 'mixed' | 'long';
}

/** Team state during match */
export interface TeamState {
  id: number;
  name: string;
  players: PlayerState[];
  tactic: Tactic;
  isHome: boolean;
  goals: number;
  shots: number;
  shotsOnTarget: number;
  possession: number; // 0-100
  morale: number; // 0-100
}

/** A match event */
export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  team: 'home' | 'away';
  playerId?: number;
  assistId?: number;
  chanceType?: ChanceType;
  subInId?: number;
  subOutId?: number;
  playerName?: string;
  assistName?: string;
  subInName?: string;
  subOutName?: string;
  description?: string;
  creditTeam?: 'home' | 'away';
}

/** Match result */
export interface MatchResult {
  homeTeam: TeamState;
  awayTeam: TeamState;
  events: MatchEvent[];
  seed: number;
}

/** Configuration for the match engine */
export interface MatchConfig {
  seed: number;
  homeAdvantagePercent: number;
  chanceThreshold: number; // CP needed to create a chance
  baseChanceRate: number; // CP per minute for average team
  baseConversionRate: number; // Base probability of goal from chance
  maxMinutes: number;
  /** CM-017 occurrence-event rates (per team per minute) — placeholder constants pending CM-R03 calibration */
  penaltyRate: number;
  ownGoalRate: number;
  offsideRate: number;
  foulRate: number;
  setPieceCornerRate: number;
  setPieceFreeKickRate: number;
  /** Typical penalty conversion — placeholder pending CM-R03 calibration */
  penaltyConversion: number;
}

/** Default config calibrated to produce realistic football scores */
export const DEFAULT_MATCH_CONFIG: MatchConfig = {
  seed: 42,
  homeAdvantagePercent: 15,
  chanceThreshold: 0.85, // Slightly lower for ~14 chances/match
  baseChanceRate: 0.133,
  baseConversionRate: 0.13, // recalibrated in CM-016: restores CM-014's effective conversion under the attribute-weighted model
  maxMinutes: 90,
  // CM-017 occurrence rates (per team per minute) — placeholders pending CM-R03 calibration
  penaltyRate: 0.0006, // ~0.11 penalties per match across both teams
  ownGoalRate: 0.00017, // ~0.03 own goals per match
  offsideRate: 0.012, // ~2.2 offsides per match
  foulRate: 0.045, // ~8 fouls per match
  setPieceCornerRate: 0.045, // ~4 corners per team per match
  setPieceFreeKickRate: 0.022, // ~2 free kicks per team per match
  penaltyConversion: 0.78, // typical penalty conversion — placeholder pending CM-R03 calibration
};
