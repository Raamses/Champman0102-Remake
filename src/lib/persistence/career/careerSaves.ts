/**
 * Career save manager (decisions doc #1, CM-020).
 */
import { createSaveManager, AUTOSAVE_CURRENT_SLOT, AUTOSAVE_PREVIOUS_SLOT } from '../saveManager';
import { type SaveEnvelope, migrateEnvelope, createEnvelope } from '../envelope';
import { exportSaveToFile, importSaveFromFile } from '../exportImport';
import { deleteSaveRecord, getSaveRecord, putSaveRecordsTransactionally, type SaveRecord } from '../db';
export { AUTOSAVE_CURRENT_SLOT, AUTOSAVE_PREVIOUS_SLOT, getSaveRecord, type SaveRecord };
import { CAREER_SCHEMA_VERSION, validateCareerState, type CareerState } from './schema';
import { careerMigrations } from './migrations';
import { SaveCorruptionError } from '../errors';

const careerSavesManager = createSaveManager<CareerState>({
  currentSchemaVersion: CAREER_SCHEMA_VERSION,
  migrations: careerMigrations,
});

export async function loadCareerSlot(slot: string): Promise<{ envelope: SaveEnvelope<CareerState>; record: SaveRecord<CareerState> } | null> {
  const record = await getSaveRecord<unknown>(slot);
  if (!record) return null;
  const migratedEnvelope = migrateEnvelope<CareerState>(
    { schemaVersion: record.schemaVersion, payload: record.payload },
    careerMigrations,
    CAREER_SCHEMA_VERSION
  );
  validateCareerState(migratedEnvelope.payload);
  return { envelope: migratedEnvelope, record: record as unknown as SaveRecord<CareerState> };
}

export async function saveCareerAutosave(career: CareerState, label?: string) {
  const updated = { ...career, lastPlayedAt: Date.now() };
  await careerSavesManager.writeAutosave(updated, label);
}

export async function saveCareerManual(slotId: string, career: CareerState, label?: string) {
  await careerSavesManager.writeManualSave(slotId, career, label);
}

export async function listCareerSaves() {
  return careerSavesManager.listSaves();
}

export async function deleteCareerManual(slotId: string) {
  await careerSavesManager.deleteManualSave(slotId);
}

export async function buildAutosaveRecovery(): Promise<
  | { status: 'empty' }
  | { status: 'ok'; career: CareerState; record: SaveRecord<CareerState> }
  | { status: 'corrupt'; currentError: SaveCorruptionError; previous: { career: CareerState; record: SaveRecord<CareerState> } | null; previousError: SaveCorruptionError | null }
> {
  let currentErr: SaveCorruptionError;
  try {
    const current = await loadCareerSlot(AUTOSAVE_CURRENT_SLOT);
    if (!current) return { status: 'empty' };
    return { status: 'ok', career: current.envelope.payload, record: current.record };
  } catch (err) {
    if (err instanceof SaveCorruptionError) {
      currentErr = err;
    } else {
      throw err;
    }
  }

  let prevErr: SaveCorruptionError | null = null;
  let previous: { career: CareerState; record: SaveRecord<CareerState> } | null = null;
  try {
    const prev = await loadCareerSlot(AUTOSAVE_PREVIOUS_SLOT);
    if (prev) {
      previous = { career: prev.envelope.payload, record: prev.record };
    }
  } catch (err) {
    if (err instanceof SaveCorruptionError) {
      prevErr = err;
    } else {
      throw err;
    }
  }

  return {
    status: 'corrupt',
    currentError: currentErr,
    previous,
    previousError: prevErr,
  };
}

export function exportCareerToFile(career: CareerState, label: string): void {
  const envelope = createEnvelope(CAREER_SCHEMA_VERSION, career);
  exportSaveToFile(envelope, label);
}

export async function importCareerFromFile(file: File): Promise<CareerState> {
  const exported = await importSaveFromFile<unknown>(file);
  const migrated = migrateEnvelope<CareerState>(
    exported.envelope,
    careerMigrations,
    CAREER_SCHEMA_VERSION
  );
  validateCareerState(migrated.payload);
  return migrated.payload;
}

export async function purgeAutosaves(): Promise<void> {
  await deleteSaveRecord(AUTOSAVE_CURRENT_SLOT);
  await deleteSaveRecord(AUTOSAVE_PREVIOUS_SLOT);
}

/**
 * Heals a corrupt current autosave during recovery (CM-020 recovery prompt,
 * review finding: loading the previous turn must also fix the disk, or the
 * next launch hits the same corruption). Overwrites the corrupt current slot
 * with the migrated previous-turn career as a fresh v2 record in one
 * transactional put; the original previous slot is left untouched.
 */
export async function repairCurrentAutosave(career: CareerState): Promise<void> {
  const record: SaveRecord<CareerState> = {
    slot: AUTOSAVE_CURRENT_SLOT,
    kind: 'autosave',
    label: 'Repaired from previous autosave',
    createdAt: Date.now(),
    schemaVersion: CAREER_SCHEMA_VERSION,
    payload: { ...career, lastPlayedAt: Date.now() },
  };
  await putSaveRecordsTransactionally([record as SaveRecord]);
}
