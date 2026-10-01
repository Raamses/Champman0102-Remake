/**
 * Career migrations (decisions doc #1, CM-020, reviewed CM-020-fix).
 * v1 = initial career schema;
 * v2 adds stable careerId, lastPlayedAt (0 = unknown; UI falls back to the
 * record's createdAt) and stable per-match ids.
 */
import { validateCareerStateV1, matchRecordId } from './schema';
import type { MigrationChain } from '../envelope';

/**
 * FNV-1a 32-bit over a stable string form of the payload. v1->v2 derives the
 * careerId from the save's own content instead of a random uuid, so
 * re-migrating the same v1 record always yields the same identity (a random
 * id would change on every load until the save is rewritten at v2).
 */
function fnv1a32(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export const careerMigrations: MigrationChain = new Map([
  [1, (payload) => {
    const v1 = validateCareerStateV1(payload);
    const identityJson = JSON.stringify([v1.career, v1.squad, v1.finances, v1.matchHistory]);
    return {
      ...v1,
      careerId: `career-${fnv1a32(identityJson)}`,
      lastPlayedAt: 0,
      matchHistory: v1.matchHistory.map((m) => ({
        ...m,
        id: m.id ?? matchRecordId(m)
      })),
    };
  }]
]);
