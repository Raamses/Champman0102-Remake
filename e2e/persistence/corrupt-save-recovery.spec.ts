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

  // Known gap (not fixed here — CM-011 is the reusable mechanism; concrete
  // payload/version validation for real save data is CM-020+ scope per
  // saveManager.ts's own header comment). migrateEnvelope's version check
  // (`schemaVersion > targetVersion`) is a numeric comparison: a NaN or
  // non-numeric schemaVersion compares false in both directions, so it skips
  // both the "too new" guard and the migration loop and silently passes
  // through unmigrated instead of failing safely. Documented here as a
  // regression trip-wire and flagged in the PR description for a follow-up
  // card, rather than silently left uncovered.
  test('KNOWN GAP: a non-numeric schemaVersion (e.g. NaN, from truncated/garbage bytes) is not detected and passes through unmigrated', async ({
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
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      const loaded = await manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT);
      return { isNaNVersion: Number.isNaN(loaded?.schemaVersion), payload: loaded?.payload };
    }, PERSISTENCE_MODULE);

    expect(result.isNaNVersion).toBe(true);
    expect(result.payload).toEqual({ turn: 1 });
  });
});
