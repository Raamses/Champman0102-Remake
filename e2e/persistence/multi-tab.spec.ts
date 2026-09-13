import { test, expect } from '@playwright/test';
import { PERSISTENCE_MODULE, resetSaveDatabase } from './helpers';

/**
 * CM-T08B multi-tab / tab-contention coverage. There is no OPFS exclusive-lock
 * model here (decisions-2026-09-11.md walked that back) — IndexedDB queues
 * overlapping transactions on the same store instead of throwing
 * NoModificationAllowedError, so the relevant risk is a lost-update race in
 * `rotateAutosave`'s read-then-write pattern (db.ts's own comment admits this
 * is only safe because "there is only ever one writer in practice" — two tabs
 * breaks that assumption), not a thrown locking error.
 */
test.describe('multi-tab contention', () => {
  test('two tabs writing distinct manual-save slots concurrently both persist cleanly', async ({ context, page }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    const page2 = await context.newPage();
    await page2.goto('/');

    await Promise.all([
      page.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        await manager.writeManualSave('tab-a', { tab: 'a' });
      }, PERSISTENCE_MODULE),
      page2.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        await manager.writeManualSave('tab-b', { tab: 'b' });
      }, PERSISTENCE_MODULE),
    ]);

    const all = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      return manager.listSaves();
    }, PERSISTENCE_MODULE);

    expect(all.map((r: { slot: string }) => r.slot).sort()).toEqual(['manual-tab-a', 'manual-tab-b']);
  });

  test('concurrent autosave writes from two tabs never corrupt the store — current always ends up as one of the two writes', async ({
    context,
    page,
  }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    const page2 = await context.newPage();
    await page2.goto('/');

    await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      await manager.writeAutosave({ turn: 0 });
    }, PERSISTENCE_MODULE);

    await Promise.all([
      page.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        await manager.writeAutosave({ turn: 1, tab: 'a' });
      }, PERSISTENCE_MODULE),
      page2.evaluate(async (modPath) => {
        const mod = await import(/* @vite-ignore */ modPath);
        const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
        await manager.writeAutosave({ turn: 1, tab: 'b' });
      }, PERSISTENCE_MODULE),
    ]);

    const state = await page.evaluate(async (modPath) => {
      const mod = await import(/* @vite-ignore */ modPath);
      const manager = mod.createSaveManager({ currentSchemaVersion: 1, migrations: new Map() });
      return {
        current: await manager.loadSave(mod.AUTOSAVE_CURRENT_SLOT),
        previous: await manager.loadSave(mod.AUTOSAVE_PREVIOUS_SLOT),
      };
    }, PERSISTENCE_MODULE);

    // The store is never left unreadable/torn: current is a fully-formed record
    // from one of the two racing writers.
    expect(state.current).not.toBeNull();
    expect(['a', 'b']).toContain((state.current!.payload as { tab: string }).tab);
    // Known race (not an IndexedDB bug, a rotateAutosave design limit outside
    // single-writer use): rotateAutosave reads "current" and writes the
    // current+previous pair in two separate steps (db.ts:119-127). If both
    // tabs read "current" (turn 0) before either commits, the losing tab's
    // turn-1 write is silently dropped from history — `previous` ends up as
    // turn 0 instead of the loser's write. If instead the reads are serialized
    // by IndexedDB's transaction queue, the second writer sees the first
    // writer's turn-1 as "current" and `previous` becomes turn 1. Both are
    // safe (well-formed, readable) but only the latter preserves both writes,
    // so assert the invariant rather than one specific interleaving.
    expect(state.previous).not.toBeNull();
    expect([0, 1]).toContain((state.previous!.payload as { turn: number }).turn);
  });
});
