// @paths lib/persistence
/**
 * End-of-turn save manager (decisions doc #1): transactional full-state
 * writes to IndexedDB, autosave slot rotation (previous turn preserved) plus
 * manual save slots, versioned envelope + migration on load.
 *
 * Generic over the payload type and migration chain — the concrete game
 * state shape and its schema history land with the save-relevant gameplay
 * cards (CM-020 and later); this is the reusable persistence mechanism they
 * build on.
 */
import {
  AUTOSAVE_CURRENT_SLOT,
  AUTOSAVE_PREVIOUS_SLOT,
  deleteSaveRecord,
  getAllSaveRecords,
  getSaveRecord,
  putSaveRecordsTransactionally,
  rotateAutosave,
  type SaveRecord,
} from './db';
import { migrateEnvelope, type MigrationChain, type SaveEnvelope } from './envelope';

export interface SaveManagerConfig {
  currentSchemaVersion: number;
  migrations: MigrationChain;
}

export interface SaveManager<TPayload> {
  writeAutosave(payload: TPayload, label?: string): Promise<void>;
  writeManualSave(slotId: string, payload: TPayload, label?: string): Promise<void>;
  loadSave(slot: string): Promise<SaveEnvelope<TPayload> | null>;
  listSaves(): Promise<SaveRecord<TPayload>[]>;
  deleteManualSave(slotId: string): Promise<void>;
}

export const MANUAL_SLOT_PREFIX = 'manual-';

export function manualSlotId(slotId: string): string {
  return `${MANUAL_SLOT_PREFIX}${slotId}`;
}

export function createSaveManager<TPayload>(config: SaveManagerConfig): SaveManager<TPayload> {
  const { currentSchemaVersion, migrations } = config;

  function toRecord(kind: SaveRecord['kind'], label: string, payload: TPayload): Omit<SaveRecord<TPayload>, 'slot'> {
    return {
      kind,
      label,
      createdAt: Date.now(),
      schemaVersion: currentSchemaVersion,
      payload,
    };
  }

  return {
    async writeAutosave(payload, label = 'Autosave') {
      await rotateAutosave(toRecord('autosave', label, payload));
    },

    async writeManualSave(slotId, payload, label) {
      const record: SaveRecord<TPayload> = {
        slot: manualSlotId(slotId),
        ...toRecord('manual', label ?? slotId, payload),
      };
      await putSaveRecordsTransactionally([record as SaveRecord]);
    },

    async loadSave(slot) {
      const record = await getSaveRecord<TPayload>(slot);
      if (!record) return null;
      return migrateEnvelope<TPayload>(
        { schemaVersion: record.schemaVersion, payload: record.payload },
        migrations,
        currentSchemaVersion
      );
    },

    async listSaves() {
      const all = (await getAllSaveRecords()) as SaveRecord<TPayload>[];
      return all.sort((a, b) => b.createdAt - a.createdAt);
    },

    async deleteManualSave(slotId) {
      await deleteSaveRecord(manualSlotId(slotId));
    },
  };
}

export { AUTOSAVE_CURRENT_SLOT, AUTOSAVE_PREVIOUS_SLOT };
