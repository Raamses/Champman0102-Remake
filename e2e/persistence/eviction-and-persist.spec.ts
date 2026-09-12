import { test, expect } from '@playwright/test';
import { PERSISTENCE_MODULE, resetSaveDatabase } from './helpers';

/**
 * Safari-style eviction (H14 in decisions-2026-09-11.md #1): iOS Safari evicts
 * IndexedDB after ~7 days of inactivity. A real 7-day wait isn't reproducible in
 * a test run, so this covers the two things that actually make CM-011 resilient
 * to it: the `navigator.storage.persist()` best-effort request, and behaving
 * correctly when the browser has already evicted the database out from under
 * the app (simulated here by deleting it out of band, mid-session).
 */
test.describe('Safari-style eviction and persistence requests', () => {
  test('isStoragePersisted resolves to a boolean against the real API', async ({ page }) => {
    await page.goto('/');
    const persisted = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      return mod.isStoragePersisted();
    }, PERSISTENCE_MODULE);

    expect(typeof persisted).toBe('boolean');
  });

  test('requestPersistentStorage resolves to a boolean against the real API', async ({ page, browserName }) => {
    // Headless Firefox hangs indefinitely on navigator.storage.persist() —
    // there's no automated way to answer the permission heuristic it waits
    // on, unlike Chromium/WebKit which auto-resolve in headless automation.
    // A test-environment limitation, not a product bug.
    test.skip(browserName === 'firefox', 'navigator.storage.persist() hangs under headless Firefox automation');

    await page.goto('/');
    const requested = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      return mod.requestPersistentStorage();
    }, PERSISTENCE_MODULE);

    expect(typeof requested).toBe('boolean');
  });

  test('persist helpers degrade to false instead of throwing when navigator.storage is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window.navigator, 'storage', { value: undefined, configurable: true });
    });
    await page.goto('/');

    const result = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      return {
        requested: await mod.requestPersistentStorage(),
        persisted: await mod.isStoragePersisted(),
      };
    }, PERSISTENCE_MODULE);

    expect(result).toEqual({ requested: false, persisted: false });
  });

  test('after simulated eviction (database gone), loadSave resolves to null instead of throwing', async ({ page }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      await manager.writeAutosave({ turn: 1 });
    }, PERSISTENCE_MODULE);

    // Stand-in for the browser silently wiping the origin's storage after its
    // inactivity window: the app didn't do this, the browser did, out of band.
    await resetSaveDatabase(page);

    const loaded = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      return manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT);
    }, PERSISTENCE_MODULE);

    expect(loaded).toBeNull();
  });

  test('export-save-to-file escape hatch (H14 mitigation) does not depend on IndexedDB and works after eviction', async ({
    page,
  }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      mod.exportSaveToFile({ schemaVersion: 1, payload: { turn: 42 } }, 'Escape hatch save');
    }, PERSISTENCE_MODULE);
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('Escape hatch save.json');
  });
});
