// @paths lib/persistence
import { describe, it, expect, afterEach } from 'vitest';
import { DB_NAME, closeSaveDatabase } from '../db';
import { AUTOSAVE_CURRENT_SLOT, AUTOSAVE_PREVIOUS_SLOT, createSaveManager, manualSlotId } from '../saveManager';
import type { MigrationChain } from '../envelope';

function deleteDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

afterEach(async () => {
  await closeSaveDatabase();
  await deleteDatabase();
});

interface CareerSaveV1 {
  managerName: string;
  clubId: number;
}

describe('createSaveManager', () => {
  it('writes and loads an autosave at the current schema version', async () => {
    const manager = createSaveManager<CareerSaveV1>({ currentSchemaVersion: 1, migrations: new Map() });
    await manager.writeAutosave({ managerName: 'Ram', clubId: 1 });

    const loaded = await manager.loadSave(AUTOSAVE_CURRENT_SLOT);
    expect(loaded).toEqual({ schemaVersion: 1, payload: { managerName: 'Ram', clubId: 1 } });
  });

  it('rotates autosaves so the previous turn stays recoverable', async () => {
    const manager = createSaveManager<CareerSaveV1>({ currentSchemaVersion: 1, migrations: new Map() });
    await manager.writeAutosave({ managerName: 'Ram', clubId: 1 });
    await manager.writeAutosave({ managerName: 'Ram', clubId: 2 });

    expect((await manager.loadSave(AUTOSAVE_CURRENT_SLOT))?.payload.clubId).toBe(2);
    expect((await manager.loadSave(AUTOSAVE_PREVIOUS_SLOT))?.payload.clubId).toBe(1);
  });

  it('writes manual saves under distinct slots and lists them alongside autosaves', async () => {
    const manager = createSaveManager<CareerSaveV1>({ currentSchemaVersion: 1, migrations: new Map() });
    await manager.writeAutosave({ managerName: 'Ram', clubId: 1 });
    await manager.writeManualSave('before-final', { managerName: 'Ram', clubId: 1 }, 'Before the final');

    const all = await manager.listSaves();
    expect(all.map((r) => r.slot).sort()).toEqual([AUTOSAVE_CURRENT_SLOT, manualSlotId('before-final')].sort());

    const manual = all.find((r) => r.slot === manualSlotId('before-final'));
    expect(manual?.kind).toBe('manual');
    expect(manual?.label).toBe('Before the final');
  });

  it('deletes a manual save without touching autosaves', async () => {
    const manager = createSaveManager<CareerSaveV1>({ currentSchemaVersion: 1, migrations: new Map() });
    await manager.writeAutosave({ managerName: 'Ram', clubId: 1 });
    await manager.writeManualSave('slot-a', { managerName: 'Ram', clubId: 1 });

    await manager.deleteManualSave('slot-a');

    expect(await manager.loadSave(manualSlotId('slot-a'))).toBeNull();
    expect(await manager.loadSave(AUTOSAVE_CURRENT_SLOT)).not.toBeNull();
  });

  it('returns null loading a slot that was never written', async () => {
    const manager = createSaveManager<CareerSaveV1>({ currentSchemaVersion: 1, migrations: new Map() });
    expect(await manager.loadSave('manual-never-written')).toBeNull();
  });

  it('migrates an older save forward on load', async () => {
    interface CareerSaveV2 extends CareerSaveV1 {
      difficulty: 'normal' | 'hard';
    }

    const migrations: MigrationChain = new Map([
      [1, (payload) => ({ ...(payload as CareerSaveV1), difficulty: 'normal' })],
    ]);

    const v1Manager = createSaveManager<CareerSaveV1>({ currentSchemaVersion: 1, migrations: new Map() });
    await v1Manager.writeManualSave('legacy', { managerName: 'Ram', clubId: 1 });

    const v2Manager = createSaveManager<CareerSaveV2>({ currentSchemaVersion: 2, migrations });
    const loaded = await v2Manager.loadSave(manualSlotId('legacy'));

    expect(loaded).toEqual({
      schemaVersion: 2,
      payload: { managerName: 'Ram', clubId: 1, difficulty: 'normal' },
    });
  });
});
