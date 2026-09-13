import { test, expect } from '@playwright/test';
import { PERSISTENCE_MODULE } from './helpers';

/**
 * Private-mode fallback. Modern Chromium/Firefox private windows still support
 * IndexedDB, but older Safari private browsing removed `window.indexedDB`
 * entirely — the durable stand-in for that class of environment is simulating
 * IndexedDB's total absence, not a specific browser's private-mode quirks.
 */
test.describe('private-mode-style fallback (IndexedDB unavailable)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true });
    });
  });

  test('writeAutosave rejects with a catchable error instead of crashing the page', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/');

    const outcome = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      try {
        await manager.writeAutosave({ turn: 1 });
        return { threw: false };
      } catch (err) {
        return { threw: true, message: String(err) };
      }
    }, PERSISTENCE_MODULE);

    expect(outcome.threw).toBe(true);
    expect(pageErrors).toEqual([]);
  });

  test('loadSave rejects gracefully rather than throwing an uncaught error', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/');

    const outcome = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      try {
        await manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT);
        return { threw: false };
      } catch (err) {
        return { threw: true, message: String(err) };
      }
    }, PERSISTENCE_MODULE);

    expect(outcome.threw).toBe(true);
    expect(pageErrors).toEqual([]);
  });

  test('export-save-to-file escape hatch still works with no IndexedDB at all', async ({ page }) => {
    await page.goto('/');

    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      mod.exportSaveToFile({ schemaVersion: 1, payload: { turn: 7 } }, 'No IDB save');
    }, PERSISTENCE_MODULE);
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('No IDB save.json');
  });
});
