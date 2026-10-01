/**
 * Career migrations (decisions doc #1, CM-020).
 * v1 = initial career schema;
 * v2 adds stable careerId, lastPlayedAt (0 = unknown; UI falls back to the record's createdAt) and stable per-match ids.
 */
import { validateCareerStateV1, matchRecordId } from './schema';
import type { MigrationChain } from '../envelope';

export const careerMigrations: MigrationChain = new Map([
  [1, (payload) => {
    const v1 = validateCareerStateV1(payload);
    return {
      ...v1,
      careerId: crypto.randomUUID ? crypto.randomUUID() : `career-${Math.random().toString(36).slice(2)}`,
      lastPlayedAt: 0,
      matchHistory: v1.matchHistory.map((m) => ({
        ...m,
        id: m.id ?? matchRecordId(m)
      })),
    };
  }]
]);
