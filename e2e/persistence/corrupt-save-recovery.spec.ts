import { test, expect } from '@playwright/test';
import { PERSISTENCE_MODULE, resetSaveDatabase } from './helpers';

/**
 * Corrupt-save handling. `migrateEnvelope` (envelope.ts) throws when a save's
 * schemaVersion is numerically newer than the app supports — the recommended
 * recovery for a call site is to catch that and fall back to the
 * previous-turn autosave, which rotateAutosave always preserves one turn of.
 */
test.describe('corrupt-save handling', () => {
  test('a save newer than the app supports fails safely, and the previous-turn autosave remains a valid fallback', async ({
    page,
  }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      await manager.writeAutosave({ turn: 1 }); // will become "previous"
      await manager.writeAutosave({ turn: 2 }); // will become "current", then get corrupted
    }, PERSISTENCE_MODULE);

    // Corrupt the "current" slot directly at the storage layer — standing in
    // for disk-level corruption or a save written by a future build this one
    // has never heard of.
    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const current = await mod.getSaveRecord(mod.AUTOSAVE_CURRENT_SLOT);
      await mod.putSaveRecordsTransactionally([{ ...current, schemaVersion: 999, payload: { garbage: true } }]);
    }, PERSISTENCE_MODULE);

    const outcome = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      try {
        await manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT);
        return { currentThrew: false as const };
      } catch (err) {
        const fallback = await manager.loadSave(mod.AUTOSAVE_PREVIOUS_SLOT);
        return { currentThrew: true as const, message: String(err), fallback };
      }
    }, PERSISTENCE_MODULE);

    expect(outcome.currentThrew).toBe(true);
    expect(outcome.message).toContain('newer than the app');
    expect(outcome.fallback).toEqual({ schemaVersion: 1, payload: { turn: 1 } });
  });

  // CM-020 hardened migrateEnvelope: a non-finite/non-numeric schemaVersion now fails safely with the typed SaveCorruptionError instead of passing through unmigrated (regression follow-up on the gap documented when this test was written).
  test('a non-numeric schemaVersion (e.g. NaN, from truncated/garbage bytes) fails safely with a typed error', async ({
    page,
  }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      await manager.writeAutosave({ turn: 1 });
    }, PERSISTENCE_MODULE);

    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const current = await mod.getSaveRecord(mod.AUTOSAVE_CURRENT_SLOT);
      await mod.putSaveRecordsTransactionally([{ ...current, schemaVersion: NaN }]);
    }, PERSISTENCE_MODULE);

    const result = await page.evaluate(async (modPath) => {
      const mod = await import(modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      try {
        await manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT);
        return { threw: false };
      } catch (err) {
        return { threw: true as const, message: String(err), name: err instanceof Error ? err.name : '' };
      }
    }, PERSISTENCE_MODULE);

    expect(result.threw).toBe(true);
    expect(result.name).toBe('SaveCorruptionError');
    expect(result.message).toContain('not a valid schema version');
  });
});
