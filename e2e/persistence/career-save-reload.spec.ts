import { test, expect } from '@playwright/test';
import { PERSISTENCE_MODULE, resetSaveDatabase } from './helpers';

/**
 * CM-020 drives the career module in the browser like corrupt-save-recovery.spec.ts does.
 */
test.describe('career save/load (CM-020)', () => {
  test('a saved career survives a page reload', async ({ page }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    const career = await page.evaluate(async (modPath) => {
      const mod = await import(modPath);
      const c = mod.newCareerState(676, 'Ram');
      await mod.saveCareerAutosave(c);
      return { turn: c.career.turn, careerId: c.careerId };
    }, PERSISTENCE_MODULE);

    await page.reload();

    const restored = await page.evaluate(async (modPath) => {
      const mod = await import(modPath);
      const recovery = await mod.buildAutosaveRecovery();
      return {
        status: recovery.status,
        career: (recovery as any).career ?? null,
        recordSchemaVersion: (recovery as any).record?.schemaVersion ?? null,
        managerName: (recovery as any).career?.career?.managerName ?? null
      };
    }, PERSISTENCE_MODULE);

    expect(restored.status).toBe('ok');
    expect(restored.managerName).toBe('Ram');
    expect(restored.recordSchemaVersion).toBe(2);
    expect(restored.career?.careerId).toBe(career.careerId);
  });

  test('a corrupt current autosave surfaces a typed error and recovery falls back to the previous turn', async ({ page }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    await page.evaluate(async (modPath) => {
      const mod = await import(modPath);
      const c = mod.newCareerState(676, 'Ram');
      await mod.saveCareerAutosave({ ...c, career: { ...c.career, turn: 0 } });
      await mod.saveCareerAutosave({ ...c, career: { ...c.career, turn: 1 } });
    }, PERSISTENCE_MODULE);

    await page.evaluate(async (modPath) => {
      const mod = await import(modPath);
      const rec = await mod.getSaveRecord(mod.AUTOSAVE_CURRENT_SLOT);
      await mod.putSaveRecordsTransactionally([{ ...rec, schemaVersion: NaN }]);
    }, PERSISTENCE_MODULE);

    const outcome = await page.evaluate(async (modPath) => {
      const mod = await import(modPath);
      const recovery = await mod.buildAutosaveRecovery();
      return {
        status: recovery.status,
        name: (recovery as any).currentError?.name,
        code: (recovery as any).currentError?.code,
        previousTurn: (recovery as any).previous?.career?.career?.turn
      };
    }, PERSISTENCE_MODULE);

    expect(outcome.status).toBe('corrupt');
    expect(outcome.name).toBe('SaveCorruptionError');
    expect(outcome.previousTurn).toBe(0);
  });

  test('a v1 career save loads migrated at the current schema version after reload', async ({ page }) => {
    await page.goto('/');
    await resetSaveDatabase(page);

    await page.evaluate(async (modPath) => {
      const mod = await import(modPath);
      await mod.putSaveRecordsTransactionally([{
        slot: mod.AUTOSAVE_CURRENT_SLOT,
        kind: 'autosave',
        label: 'v1 legacy',
        createdAt: 4242,
        schemaVersion: 1,
        payload: {
          career: { seasonNumber: 2, clubId: 676, managerName: 'Ram', turn: 3 },
          squad: { clubId: 676, playerIds: [1, 2, 3] },
          finances: { balance: -5, transferBudget: 12, wageBudget: 4 },
          matchHistory: [{ seasonNumber: 2, week: 5, homeClubId: 676, awayClubId: 1, homeGoals: 2, awayGoals: 1, playedAt: 123 }]
        }
      }]);
    }, PERSISTENCE_MODULE);

    await page.reload();

    const restored = await page.evaluate(async (modPath) => {
      const mod = await import(modPath);
      const recovery = await mod.buildAutosaveRecovery();
      return {
        status: recovery.status,
        careerId: (recovery as any).career?.careerId,
        matchId: (recovery as any).career?.matchHistory?.[0]?.id,
        schemaVersion: (recovery as any).record?.schemaVersion,
        turn: (recovery as any).career?.career?.turn
      };
    }, PERSISTENCE_MODULE);

    expect(restored.status).toBe('ok');
    expect(typeof restored.careerId).toBe('string');
    expect(restored.careerId).not.toBe('');
    expect(typeof restored.matchId).toBe('string');
    expect(restored.matchId).not.toBe('');
    expect(restored.schemaVersion).toBe(2);
    expect(restored.turn).toBe(3);
  });
});
