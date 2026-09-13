import { test, expect } from '@playwright/test';
import { PERSISTENCE_MODULE, resetSaveDatabase } from './helpers';

/**
 * Quota exhaustion. Uses the Chromium-only CDP `Storage.overrideQuotaForOrigin`
 * to reliably force a real QuotaExceededError rather than trying to actually
 * fill an origin's storage (unreliable and slow across browsers). This spec is
 * chromium-only for that reason — it still runs on the per-PR fast-smoke gate
 * (chromium), just not in the nightly firefox/webkit legs.
 */
test.describe('quota exhaustion', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'CDP Storage.overrideQuotaForOrigin is Chromium-only');

  test('a write that exceeds the origin quota rejects with QuotaExceededError and leaves prior saves untouched', async ({
    page,
    context,
  }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    const client = await context.newCDPSession(page);
    const origin = new URL(page.url()).origin;
    // The quota override only takes effect for IndexedDB connections opened
    // after it's set, so it must be set before *any* open — including the
    // "prior save" write below — not just before the write that's meant to fail.
    await client.send('Storage.overrideQuotaForOrigin', { origin, quotaSize: 262144 });

    try {
      await page.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        await manager.writeAutosave({ turn: 1 });
      }, PERSISTENCE_MODULE);

      const outcome = await page.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        try {
          await manager.writeAutosave({ turn: 2, blob: 'x'.repeat(20_000_000) });
          return { ok: true };
        } catch (err) {
          return { ok: false, name: (err as DOMException)?.name, message: String((err as Error)?.message ?? err) };
        }
      }, PERSISTENCE_MODULE);

      expect(outcome.ok).toBe(false);
      expect(outcome.name).toBe('QuotaExceededError');

      // The failed rotation must not have partially applied — turn 1 stays as
      // "current" (db.ts's single readwrite transaction is all-or-nothing).
      const current = await page.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        return manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT);
      }, PERSISTENCE_MODULE);
      expect(current).toEqual({ schemaVersion: 1, payload: { turn: 1 } });
    } finally {
      await client.send('Storage.overrideQuotaForOrigin', { origin });
    }
  });

  test('export-save-to-file escape hatch keeps working once IndexedDB writes start failing on quota', async ({
    page,
    context,
  }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    const client = await context.newCDPSession(page);
    const origin = new URL(page.url()).origin;
    await client.send('Storage.overrideQuotaForOrigin', { origin, quotaSize: 262144 });

    try {
      const downloadPromise = page.waitForEvent('download');
      await page.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        mod.exportSaveToFile({ schemaVersion: 1, payload: { turn: 9 } }, 'Quota fallback save');
      }, PERSISTENCE_MODULE);
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('Quota fallback save.json');
    } finally {
      await client.send('Storage.overrideQuotaForOrigin', { origin });
    }
  });
});
