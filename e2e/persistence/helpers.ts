import type { Page } from '@playwright/test';

/**
 * CM-011 ships the persistence layer as a standalone library with no UI/game-loop
 * wiring yet (that lands with CM-020+), so these specs drive it directly in the
 * browser via a dynamic import of the source module, rather than through the app's
 * UI. Vite's dev server (which `playwright.config.ts`'s webServer runs) serves and
 * transpiles this path on the fly, so this exercises the real IndexedDB
 * implementation of whichever browser project the test runs under.
 */
export const PERSISTENCE_MODULE = '/src/lib/persistence/index.ts';

/** Closes any cached connection and deletes the save database, so each test starts clean. */
export async function resetSaveDatabase(page: Page): Promise<void> {
  await page.evaluate(async (modPath) => {
    const mod = await import(/* @vite-ignore */ modPath);
    await mod.closeSaveDatabase();
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase(mod.DB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      req.onblocked = () => resolve();
    });
  }, PERSISTENCE_MODULE);
}
