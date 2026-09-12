// @paths lib/persistence
/**
 * Versioned save envelope (decisions doc #1, "Save versioning"). Every save
 * written to IndexedDB is wrapped as `{schemaVersion, payload}`, migrated
 * forward through an ordered chain of TS functions on load.
 */

export interface SaveEnvelope<TPayload = unknown> {
  schemaVersion: number;
  payload: TPayload;
}

/** A migration takes the payload at version N and returns it at version N+1. */
export type Migration = (payload: unknown) => unknown;

/**
 * Keyed by the schema version a migration migrates *from* (e.g. the entry
 * at key `1` migrates a v1 payload to v2). A map — rather than an
 * array read by position — so inserting or reordering entries can't
 * silently shift which version every later migration thinks it's
 * migrating from.
 */
export type MigrationChain = Map<number, Migration>;

export function createEnvelope<TPayload>(schemaVersion: number, payload: TPayload): SaveEnvelope<TPayload> {
  return { schemaVersion, payload };
}

/**
 * Runs migrations in order starting from `envelope.schemaVersion` until
 * `targetVersion` is reached, looking up each step by its `fromVersion` key.
 */
export function migrateEnvelope<TPayload = unknown>(
  envelope: SaveEnvelope,
  migrations: MigrationChain,
  targetVersion: number
): SaveEnvelope<TPayload> {
  let { schemaVersion, payload } = envelope;

  if (schemaVersion > targetVersion) {
    throw new Error(
      `Save schema version ${schemaVersion} is newer than the app's supported version ${targetVersion}`
    );
  }

  while (schemaVersion < targetVersion) {
    const migrate = migrations.get(schemaVersion);
    if (!migrate) {
      throw new Error(`Missing migration from schema version ${schemaVersion} to ${schemaVersion + 1}`);
    }
    payload = migrate(payload);
    schemaVersion += 1;
  }

  return { schemaVersion, payload: payload as TPayload };
}
