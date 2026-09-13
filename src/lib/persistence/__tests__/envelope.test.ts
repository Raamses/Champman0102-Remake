// @paths lib/persistence
import { describe, it, expect } from 'vitest';
import { createEnvelope, migrateEnvelope, type Migration, type MigrationChain } from '../envelope';

describe('envelope', () => {
  it('creates an envelope at the given schema version', () => {
    const envelope = createEnvelope(1, { managerName: 'Ram' });
    expect(envelope).toEqual({ schemaVersion: 1, payload: { managerName: 'Ram' } });
  });

  it('returns the envelope unchanged when already at the target version', () => {
    const envelope = createEnvelope(2, { a: 1 });
    const result = migrateEnvelope(envelope, new Map(), 2);
    expect(result).toEqual(envelope);
  });

  it('runs migrations in order up to the target version', () => {
    const migrations: MigrationChain = new Map<number, Migration>([
      [1, (payload) => ({ ...(payload as object), addedInV2: true })],
      [2, (payload) => ({ ...(payload as object), addedInV3: true })],
    ]);

    const result = migrateEnvelope(createEnvelope(1, { managerName: 'Ram' }), migrations, 3);

    expect(result).toEqual({
      schemaVersion: 3,
      payload: { managerName: 'Ram', addedInV2: true, addedInV3: true },
    });
  });

  it('applies only the remaining migrations when starting mid-chain', () => {
    const migrations: MigrationChain = new Map<number, Migration>([
      [
        1,
        () => {
          throw new Error('should not run — save is already past v1->v2');
        },
      ],
      [2, (payload) => ({ ...(payload as object), addedInV3: true })],
    ]);

    const result = migrateEnvelope(createEnvelope(2, { managerName: 'Ram' }), migrations, 3);

    expect(result).toEqual({ schemaVersion: 3, payload: { managerName: 'Ram', addedInV3: true } });
  });

  it('is insensitive to insertion order in the migration map', () => {
    const migrations: MigrationChain = new Map<number, Migration>([
      [2, (payload) => ({ ...(payload as object), addedInV3: true })],
      [1, (payload) => ({ ...(payload as object), addedInV2: true })],
    ]);

    const result = migrateEnvelope(createEnvelope(1, { managerName: 'Ram' }), migrations, 3);

    expect(result).toEqual({
      schemaVersion: 3,
      payload: { managerName: 'Ram', addedInV2: true, addedInV3: true },
    });
  });

  it('throws when a save is newer than the app supports', () => {
    expect(() => migrateEnvelope(createEnvelope(5, {}), new Map(), 3)).toThrow(/newer/);
  });

  it('throws when a required migration is missing from the chain', () => {
    expect(() => migrateEnvelope(createEnvelope(1, {}), new Map(), 3)).toThrow(/Missing migration/);
  });
});
