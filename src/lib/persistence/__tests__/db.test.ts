// @paths lib/persistence
import { describe, it, expect, afterEach } from 'vitest';
import {
  AUTOSAVE_CURRENT_SLOT,
  AUTOSAVE_PREVIOUS_SLOT,
  DB_NAME,
  closeSaveDatabase,
  deleteSaveRecord,
  getAllSaveRecords,
  getSaveRecord,
  putSaveRecordsTransactionally,
  rotateAutosave,
  type SaveRecord,
} from '../db';

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

function manualRecord(overrides: Partial<SaveRecord> = {}): SaveRecord {
  return {
    slot: 'manual-slot-1',
    kind: 'manual',
    label: 'Before the derby',
    createdAt: 1,
    schemaVersion: 1,
    payload: { season: 2001 },
    ...overrides,
  };
}

describe('putSaveRecordsTransactionally / getSaveRecord', () => {
  it('writes and reads a record back by slot', async () => {
    await putSaveRecordsTransactionally([manualRecord()]);
    const record = await getSaveRecord('manual-slot-1');
    expect(record).toEqual(manualRecord());
  });

  it('returns undefined for a slot that was never written', async () => {
    const record = await getSaveRecord('nope');
    expect(record).toBeUndefined();
  });

  it('lists all saved records', async () => {
    await putSaveRecordsTransactionally([manualRecord({ slot: 'a' }), manualRecord({ slot: 'b' })]);
    const all = await getAllSaveRecords();
    expect(all.map((r) => r.slot).sort()).toEqual(['a', 'b']);
  });

  it('deletes a record by slot', async () => {
    await putSaveRecordsTransactionally([manualRecord()]);
    await deleteSaveRecord('manual-slot-1');
    expect(await getSaveRecord('manual-slot-1')).toBeUndefined();
  });
});

describe('rotateAutosave', () => {
  it('writes the first autosave straight to the current slot with no previous', async () => {
    await rotateAutosave({ kind: 'autosave', label: 'Turn 1', createdAt: 1, schemaVersion: 1, payload: { turn: 1 } });

    expect(await getSaveRecord(AUTOSAVE_CURRENT_SLOT)).toMatchObject({ payload: { turn: 1 } });
    expect(await getSaveRecord(AUTOSAVE_PREVIOUS_SLOT)).toBeUndefined();
  });

  it('rotates the current autosave into the previous slot on the next write', async () => {
    await rotateAutosave({ kind: 'autosave', label: 'Turn 1', createdAt: 1, schemaVersion: 1, payload: { turn: 1 } });
    await rotateAutosave({ kind: 'autosave', label: 'Turn 2', createdAt: 2, schemaVersion: 1, payload: { turn: 2 } });

    expect(await getSaveRecord(AUTOSAVE_CURRENT_SLOT)).toMatchObject({ payload: { turn: 2 } });
    expect(await getSaveRecord(AUTOSAVE_PREVIOUS_SLOT)).toMatchObject({ payload: { turn: 1 } });
  });

  it('keeps only one turn of history — the oldest previous is dropped on the third write', async () => {
    await rotateAutosave({ kind: 'autosave', label: 'Turn 1', createdAt: 1, schemaVersion: 1, payload: { turn: 1 } });
    await rotateAutosave({ kind: 'autosave', label: 'Turn 2', createdAt: 2, schemaVersion: 1, payload: { turn: 2 } });
    await rotateAutosave({ kind: 'autosave', label: 'Turn 3', createdAt: 3, schemaVersion: 1, payload: { turn: 3 } });

    expect(await getSaveRecord(AUTOSAVE_CURRENT_SLOT)).toMatchObject({ payload: { turn: 3 } });
    expect(await getSaveRecord(AUTOSAVE_PREVIOUS_SLOT)).toMatchObject({ payload: { turn: 2 } });
  });

  it('does not disturb manual saves', async () => {
    await putSaveRecordsTransactionally([manualRecord()]);
    await rotateAutosave({ kind: 'autosave', label: 'Turn 1', createdAt: 1, schemaVersion: 1, payload: { turn: 1 } });

    expect(await getSaveRecord('manual-slot-1')).toEqual(manualRecord());
  });
});
