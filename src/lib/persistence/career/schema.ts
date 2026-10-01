/**
 * Concrete career save schema (decisions doc #1, CM-020).
 */
import { SaveCorruptionError } from '../errors';

export const CAREER_SCHEMA_VERSION = 2;

export interface SeasonState {
  seasonNumber: number;
  clubId: number;
  managerName: string;
  turn: number;
}

export interface SquadState {
  clubId: number;
  playerIds: number[];
}

export interface FinancesLite {
  balance: number;
  transferBudget: number;
  wageBudget: number;
}

export interface MatchRecord {
  id: string;
  seasonNumber: number;
  week: number;
  homeClubId: number;
  awayClubId: number;
  homeGoals: number;
  awayGoals: number;
  playedAt: number;
}

export interface CareerStateV1 {
  career: SeasonState;
  squad: SquadState;
  finances: FinancesLite;
  matchHistory: MatchRecord[];
}

export type CareerState = CareerStateV1 & {
  careerId: string;
  lastPlayedAt: number;
};

export function matchRecordId(record: Omit<MatchRecord, 'id'>): string {
  return `match-${record.seasonNumber}-${record.week}-${record.homeClubId}-${record.awayClubId}`;
}

export function newCareerState(clubId: number, managerName: string): CareerState {
  return {
    career: { seasonNumber: 1, clubId, managerName, turn: 0 },
    squad: { clubId, playerIds: [] },
    finances: { balance: 0, transferBudget: 0, wageBudget: 0 },
    matchHistory: [],
    careerId: crypto.randomUUID ? crypto.randomUUID() : `career-${Math.random().toString(36).slice(2)}`,
    lastPlayedAt: Date.now(),
  };
}

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}

function isNumber(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val);
}

function isString(val: unknown): val is string {
  return typeof val === 'string';
}

function isNumberArray(val: unknown): val is number[] {
  return Array.isArray(val) && val.every(isNumber);
}

export function validateCareerStateV1(value: unknown): CareerStateV1 {
  if (!isObject(value)) {
    throw new SaveCorruptionError('Career state must be an object', 'payload-shape');
  }

  const { career, squad, finances, matchHistory } = value;

  if (!isObject(career) || !isNumber(career.seasonNumber) || !isNumber(career.clubId) || !isString(career.managerName) || !isNumber(career.turn)) {
    throw new SaveCorruptionError('Invalid career object', 'payload-shape');
  }

  if (!isObject(squad) || !isNumber(squad.clubId) || !isNumberArray(squad.playerIds)) {
    throw new SaveCorruptionError('Invalid squad object', 'payload-shape');
  }

  if (!isObject(finances) || !isNumber(finances.balance) || !isNumber(finances.transferBudget) || !isNumber(finances.wageBudget)) {
    throw new SaveCorruptionError('Invalid finances object', 'payload-shape');
  }

  if (!Array.isArray(matchHistory)) {
    throw new SaveCorruptionError('Invalid matchHistory array', 'payload-shape');
  }

  for (const match of matchHistory) {
    if (!isObject(match) || !isNumber(match.seasonNumber) || !isNumber(match.week) || !isNumber(match.homeClubId) || !isNumber(match.awayClubId) || !isNumber(match.homeGoals) || !isNumber(match.awayGoals) || !isNumber(match.playedAt)) {
      throw new SaveCorruptionError('Invalid match object in matchHistory', 'payload-shape');
    }
  }

  return value as unknown as CareerStateV1;
}

export function validateCareerState(value: unknown): CareerState {
  const v1 = validateCareerStateV1(value);
  const { careerId, lastPlayedAt } = value as unknown as {
    careerId?: unknown;
    lastPlayedAt?: unknown;
  };

  if (!isString(careerId)) {
    throw new SaveCorruptionError('Invalid careerId', 'payload-shape');
  }

  if (!isNumber(lastPlayedAt)) {
    throw new SaveCorruptionError('Invalid lastPlayedAt', 'payload-shape');
  }

  for (const match of v1.matchHistory) {
    if (!isString(match.id)) {
      throw new SaveCorruptionError('Invalid match object in matchHistory, missing id', 'payload-shape');
    }
  }

  return value as CareerState;
}
