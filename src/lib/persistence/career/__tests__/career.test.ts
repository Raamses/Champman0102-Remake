// @paths lib/persistence
import { describe, it, expect, afterEach } from 'vitest';
import { DB_NAME, closeSaveDatabase, putSaveRecordsTransactionally, getSaveRecord, type SaveRecord } from '../../db';
import { 
  AUTOSAVE_CURRENT_SLOT, 
  AUTOSAVE_PREVIOUS_SLOT,
  loadCareerSlot,
  saveCareerAutosave,
  saveCareerManual,
  listCareerSaves,
  deleteCareerManual,
  buildAutosaveRecovery,
  importCareerFromFile,
} from '../careerSaves';
import { 
  newCareerState, 
  validateCareerState, 
  matchRecordId, 
  CAREER_SCHEMA_VERSION, 
  type CareerStateV1,
  type CareerState
} from '../schema';
import { createEnvelope, migrateEnvelope } from '../../envelope';
import { careerMigrations } from '../migrations';
import { SaveCorruptionError } from '../../errors';
import { serializeSaveFile } from '../../exportImport';

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

function makeV1Payload(): CareerStateV1 {
  return {
    career: { seasonNumber: 2, clubId: 676, managerName: 'Ram', turn: 3 },
    squad: { clubId: 676, playerIds: [1, 2, 3] },
    finances: { balance: -5, transferBudget: 12, wageBudget: 4 },
    matchHistory: [
      { seasonNumber: 2, week: 5, homeClubId: 676, awayClubId: 1, homeGoals: 2, awayGoals: 1, playedAt: 123 } as any
    ]
  };
}

describe('career save format (CM-020)', () => {
  it('newCareerState builds a valid v2 career state', () => {
    const c = newCareerState(676, 'Ram');
    expect(c.career).toEqual({ seasonNumber: 1, clubId: 676, managerName: 'Ram', turn: 0 });
    expect(c.matchHistory).toEqual([]);
    expect(c.finances).toEqual({ balance: 0, transferBudget: 0, wageBudget: 0 });
    expect(typeof c.careerId).toBe('string');
    expect(c.careerId.length).toBeGreaterThan(0);
    expect(typeof c.lastPlayedAt).toBe('number');
    expect(validateCareerState(c)).toBe(c);
  });

  it('validateCareerState accepts extra forward-compat fields', () => {
    expect(() => validateCareerState({ ...newCareerState(1, 'X'), someFutureField: true })).not.toThrow();
  });

  it('validateCareerState rejects malformed payloads with the typed payload-shape error', () => {
    const base = newCareerState(1, 'X');
    const cases = [
      null,
      'nope',
      42,
      {},
      { career: null, squad: null, finances: null, matchHistory: [] },
      { ...base, career: { ...base.career, managerName: 5 } },
      { ...base, career: { ...base.career, turn: NaN } },
      { ...base, squad: { ...base.squad, playerIds: 'not-an-array' } },
      { ...base, finances: { ...base.finances, balance: Infinity } },
      { ...base, matchHistory: [{ week: 'no' }] }
    ];

    for (const payload of cases) {
      try {
        validateCareerState(payload);
        expect.fail('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(SaveCorruptionError);
        expect((err as SaveCorruptionError).code).toBe('payload-shape');
      }
    }
  });

  it('migrateEnvelope runs the v1->v2 career migration and records it as tested (CM-T08A)', () => {
    const v1payload = makeV1Payload();
    const out = migrateEnvelope<CareerState>(createEnvelope(1, v1payload), careerMigrations, CAREER_SCHEMA_VERSION);
    
    expect(out.schemaVersion).toBe(2);
    expect(typeof out.payload.careerId).toBe('string');
    expect(out.payload.careerId.length).toBeGreaterThan(0);
    expect(out.payload.lastPlayedAt).toBe(0);
    expect(out.payload.matchHistory[0].id).toBe(matchRecordId(v1payload.matchHistory[0] as any));
    
    expect(out.payload.career).toEqual(v1payload.career);
    expect(out.payload.squad).toEqual(v1payload.squad);
    expect(out.payload.finances).toEqual(v1payload.finances);
    
    expect(() => validateCareerState(out.payload)).not.toThrow();
  });

  it('matchRecordId is deterministic and collision-free for distinct fixtures', () => {
    const fixtureA = { seasonNumber: 2, week: 5, homeClubId: 676, awayClubId: 1, homeGoals: 2, awayGoals: 1, playedAt: 123 };
    expect(matchRecordId(fixtureA as any)).toBe(matchRecordId({ ...fixtureA } as any));
    expect(matchRecordId({ ...fixtureA, week: 6 } as any)).not.toBe(matchRecordId(fixtureA as any));
  });

  it('a v1 career save written by an old build loads migrated at the current schema version', async () => {
    const v1payload = makeV1Payload();
    await putSaveRecordsTransactionally([{ 
      slot: AUTOSAVE_CURRENT_SLOT, 
      kind: 'autosave', 
      label: 'v1 legacy', 
      createdAt: 4242, 
      schemaVersion: 1, 
      payload: v1payload 
    }]);

    const loaded = await loadCareerSlot(AUTOSAVE_CURRENT_SLOT);
    expect(loaded).not.toBeNull();
    expect(loaded!.envelope.schemaVersion).toBe(2);
    expect(loaded!.record.label).toBe('v1 legacy');
    expect(loaded!.record.createdAt).toBe(4242);
    expect(loaded!.envelope.payload.careerId.length).toBeGreaterThan(0);
  });

  it('autosave rotation keeps the previous turn recoverable', async () => {
    const careerA = newCareerState(676, 'Ram');
    const careerB = { ...careerA, career: { ...careerA.career, turn: 1 } };
    
    await saveCareerAutosave(careerA);
    await saveCareerAutosave(careerB);

    const current = await loadCareerSlot(AUTOSAVE_CURRENT_SLOT);
    const prev = await loadCareerSlot(AUTOSAVE_PREVIOUS_SLOT);
    
    expect(current!.envelope.payload.career.turn).toBe(1);
    expect(prev!.envelope.payload.career.turn).toBe(0);
  });

  it('manual save slots list and delete without touching autosaves', async () => {
    const careerA = newCareerState(676, 'Ram');
    await saveCareerManual('week-3', careerA, 'Week 3');
    await saveCareerAutosave(careerA);

    let saves = await listCareerSaves();
    let manual = saves.find(s => s.slot === 'manual-week-3');
    expect(manual).toBeDefined();
    expect(manual!.label).toBe('Week 3');
    expect(manual!.kind).toBe('manual');

    await deleteCareerManual('week-3');
    
    saves = await listCareerSaves();
    expect(saves.find(s => s.slot === 'manual-week-3')).toBeUndefined();
    expect(saves.find(s => s.slot === AUTOSAVE_CURRENT_SLOT)).toBeDefined();
  });

  it('buildAutosaveRecovery reports empty on a fresh database', async () => {
    const recovery = await buildAutosaveRecovery();
    expect(recovery.status).toBe('empty');
  });

  it('buildAutosaveRecovery falls back to the previous autosave when the current one is corrupt', async () => {
    const careerA = newCareerState(676, 'Ram');
    const careerB = { ...careerA, career: { ...careerA.career, turn: 1 } };
    
    await saveCareerAutosave(careerA);
    await saveCareerAutosave(careerB);

    const rec = await getSaveRecord(AUTOSAVE_CURRENT_SLOT);
    await putSaveRecordsTransactionally([{ ...rec!, schemaVersion: NaN }]);

    const recovery = await buildAutosaveRecovery();
    expect(recovery.status).toBe('corrupt');
    if (recovery.status === 'corrupt') {
      expect(recovery.currentError).toBeInstanceOf(SaveCorruptionError);
      expect(recovery.currentError.code).toBe('schema-not-numeric');
      expect(recovery.previous).not.toBeNull();
      expect(recovery.previous!.career.career.turn).toBe(0);
    }
  });

  it('a future-version save fails with the schema-too-new error', async () => {
    const careerA = newCareerState(676, 'Ram');
    await saveCareerAutosave(careerA);

    const rec = await getSaveRecord(AUTOSAVE_CURRENT_SLOT);
    await putSaveRecordsTransactionally([{ ...rec!, schemaVersion: 999, payload: { garbage: true } }]);

    const recovery = await buildAutosaveRecovery();
    expect(recovery.status).toBe('corrupt');
    if (recovery.status === 'corrupt') {
      expect(recovery.currentError.code).toBe('schema-too-new');
      expect(recovery.currentError.message).toContain('newer than the app');
    }
  });

  it('a schemaVersion that is not a finite integer fails safely (regression for the documented CM-011 NaN gap)', async () => {
    const careerA = newCareerState(676, 'Ram');
    await saveCareerAutosave(careerA);

    const rec = await getSaveRecord(AUTOSAVE_CURRENT_SLOT);
    await putSaveRecordsTransactionally([{ ...rec!, schemaVersion: NaN }]);

    expect.assertions(2);
    try {
      await loadCareerSlot(AUTOSAVE_CURRENT_SLOT);
    } catch (err) {
      expect((err as SaveCorruptionError).code).toBe('schema-not-numeric');
      expect((err as SaveCorruptionError).message).toContain('not a valid schema version');
    }
  });

  it('export/import round-trips a career file', async () => {
    const careerA = newCareerState(676, 'Ram');
    const json = serializeSaveFile(createEnvelope(CAREER_SCHEMA_VERSION, careerA), 'Test Export');
    const file = new File([json], 'save.json', { type: 'application/json' });
    
    const restored = await importCareerFromFile(file);
    expect(restored.career.clubId).toBe(676);
    expect(restored.careerId).toBe(careerA.careerId);
  });

  it('import migrates a v1 file', async () => {
    const v1payload = makeV1Payload();
    const json = serializeSaveFile(createEnvelope(1, v1payload), 'v1 export');
    const file = new File([json], 'save.json', { type: 'application/json' });
    
    const restored = await importCareerFromFile(file);
    expect(restored.careerId.length).toBeGreaterThan(0);
    expect(() => validateCareerState(restored)).not.toThrow();
  });

  it('importing a corrupt file fails with a typed or plain error rather than loading garbage', async () => {
    const fileNotJson = new File(['not-json'], 'save.json', { type: 'application/json' });
    await expect(importCareerFromFile(fileNotJson)).rejects.toThrow();

    const fileMissingSchema = new File([JSON.stringify({ envelope: { payload: {} } })], 'save.json', { type: 'application/json' });
    await expect(importCareerFromFile(fileMissingSchema)).rejects.toThrow();
  });
});

// CM-020 review-round additions (ask-agy verdict fixes).
describe('review-round fixes', () => {
  it('repairCurrentAutosave heals the corrupt current slot so the next launch is clean', async () => {
    const { repairCurrentAutosave } = await import('../careerSaves');
    const careerA = newCareerState(676, 'Ram');
    const careerB = { ...careerA, career: { ...careerA.career, turn: 1 } };
    await saveCareerAutosave(careerA);
    await saveCareerAutosave(careerB);

    const rec = await getSaveRecord(AUTOSAVE_CURRENT_SLOT);
    if (!rec) throw new Error('autosave must exist');
    await putSaveRecordsTransactionally([{ ...rec, schemaVersion: NaN } satisfies SaveRecord]);
    expect((await buildAutosaveRecovery()).status).toBe('corrupt');

    const recovery = await buildAutosaveRecovery();
    if (recovery.status !== 'corrupt' || !recovery.previous) throw new Error('expected corrupt with a previous fallback');
    await repairCurrentAutosave(recovery.previous.career);

    const healed = await loadCareerSlot(AUTOSAVE_CURRENT_SLOT);
    expect(healed?.envelope.schemaVersion).toBe(CAREER_SCHEMA_VERSION);
    expect(healed?.envelope.payload.career.turn).toBe(0);
    expect((await buildAutosaveRecovery()).status).toBe('ok');
  });

  it('derives the v1->v2 careerId deterministically from the save content', async () => {
    const { migrateEnvelope, createEnvelope } = await import('../../envelope');
    const { careerMigrations } = await import('../migrations');
    const v1Payload = {
      career: { seasonNumber: 1, clubId: 676, managerName: 'Ram', turn: 0 },
      squad: { clubId: 676, playerIds: [1, 2, 3] },
      finances: { balance: 0, transferBudget: 0, wageBudget: 0 },
      matchHistory: [
        { seasonNumber: 1, week: 1, homeClubId: 676, awayClubId: 1, homeGoals: 2, awayGoals: 1, playedAt: 123 },
      ],
    };

    const first = migrateEnvelope({ schemaVersion: 1, payload: v1Payload }, careerMigrations, 2);
    const second = migrateEnvelope({ schemaVersion: 1, payload: v1Payload }, careerMigrations, 2);

    expect(String((first.payload as { careerId: string }).careerId)).toMatch(/^career-[0-9a-f]{8}$/);
    expect((first.payload as { careerId: string }).careerId).toBe((second.payload as { careerId: string }).careerId);
  });
});
