import { test, expect } from '@playwright/test';
import { PERSISTENCE_MODULE, resetSaveDatabase } from './helpers';

/**
 * Mid-save abort/crash recovery. IndexedDB transactions are atomic by spec, so
 * the property under test is that CM-011 never assumes otherwise and that a
 * crash at any point around a write leaves the store in one of only two valid
 * states: the write never applied, or it fully applied — never a torn record.
 */
test.describe('mid-save abort / crash recovery', () => {
  test('crash before the rotation transaction starts leaves the prior autosave fully intact', async ({ page, context }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      await manager.writeAutosave({ turn: 1 });
    }, PERSISTENCE_MODULE);

    // Read the pre-rotation "current" the way rotateAutosave does (db.ts:120),
    // then crash before the follow-up commit (db.ts:126) ever runs.
    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      await mod.getSaveRecord(mod.AUTOSAVE_CURRENT_SLOT);
    }, PERSISTENCE_MODULE);

    await page.close(); // the "crash"

    const page2 = await context.newPage();
    await page2.goto('/');
    const state = await page2.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      return {
        current: await manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT),
        previous: await manager.loadSave(mod.AUTOSAVE_PREVIOUS_SLOT),
      };
    }, PERSISTENCE_MODULE);

    expect(state.current).toEqual({ schemaVersion: 1, payload: { turn: 1 } });
    expect(state.previous).toBeNull();
  });

  test('killing the page while an autosave write is in flight never leaves a torn record', async ({ browser }) => {
    for (let attempt = 0; attempt < 5; attempt++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto('/');
      await resetSaveDatabase(page);

      await page.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        await manager.writeAutosave({ turn: 1 });
      }, PERSISTENCE_MODULE);

      // Fire the next write without awaiting it, then kill the page immediately —
      // the in-flight write may land anywhere from "not yet started" to "fully
      // committed" by the time the page dies.
      await page.evaluate((modPath) => {
        void (async () => {
          const mod = await import(/* @vite-ignore */ modPath);
          const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
          await manager.writeAutosave({ turn: 2 });
        })();
      }, PERSISTENCE_MODULE);
      await page.close();

      const page2 = await context.newPage();
      await page2.goto('/');
      const state = await page2.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        return manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT);
      }, PERSISTENCE_MODULE);

      // Envelope integrity: always a well-formed v1 envelope with turn 1 or 2,
      // never a partial/corrupt object, regardless of exactly when the crash landed.
      expect(state).not.toBeNull();
      expect(state!.schemaVersion).toBe(1);
      expect([1, 2]).toContain((state!.payload as { turn: number }).turn);

      await context.close();
    }
  });
});
