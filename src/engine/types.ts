// @paths lib/engine
import { RNG } from './rng';

/** Match phases */
export type MatchPhase = 'first-half' | 'half-time' | 'second-half' | 'full-time';

/** Chance outcome types */
export type ChanceOutcome = 'goal' | 'save' | 'miss' | 'blocked';

/** Match event types */
export type MatchEventType = 'goal' | 'assist' | 'yellow' | 'red' | 'injury' | 'sub' | 'chance' | 'save' | 'miss';

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
  shooting: number;
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
  description: string;
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
}

/** Default config calibrated to produce realistic football scores */
export const DEFAULT_MATCH_CONFIG: MatchConfig = {
  seed: 42,
  homeAdvantagePercent: 15, // D3 fix: +15% not +10%
  chanceThreshold: 1.0, // D6 fix: normalized
  baseChanceRate: 0.133, // ~12 chances per match
  baseConversionRate: 0.12, // ~11% conversion (real football)
  maxMinutes: 90,
};
