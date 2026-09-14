import { test, expect } from '@playwright/test';

/**
 * CM-T13 — Device matrix (test-cards.md).
 *
 * Runs the shell journey across the full Playwright matrix with per-device
 * context profiles, and records structured per-device findings the report is
 * built from (docs/vault/testing/device-matrix-report.md).
 *
 * Device set (test-strategy.md environments):
 *   chromium / firefox / webkit desktop (1280x800) — pinned by playwright.config.ts projects
 *   chromium / firefox / webkit mobile (390x844, DPR 3, touch) — `mobile` project extension
 *
 * The shell currently renders a desktop-only sidebar (`hidden md:flex`) and has
 * no routes — this spec asserts today's contract so the device matrix report
 * records it as observed behavior, not aspiration. CM-061 (responsive/mobile
 * shell hardening) supersedes it when it lands.
 */

const SECTIONS = ['Database', 'Squad', 'Tactics', 'Transfers', 'League'] as const;

test.describe('CM-T13 device matrix', () => {
  test('shell renders, navigates all sections, and stays overflow-free at this device profile', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await page.goto('/');

    // Shell renders the default section.
    await expect(page.getByRole('heading', { name: 'Database' })).toBeVisible();

    // Sidebar visibility is a device-profile property: desktop shows it,
    // mobile hides it (hidden md:flex — no mobile nav yet, CM-061).
    const isMobileProfile = page.viewportSize()!.width < 768;
    if (isMobileProfile) {
      await expect(page.getByRole('button', { name: 'Squad' })).toBeHidden();
    } else {
      await expect(page.getByRole('button', { name: 'Squad' })).toBeVisible();
    }

    // Full navigation journey (desktop exercises the sidebar; mobile exercises
    // the shell's default section only, since there is no mobile nav surface).
    if (!isMobileProfile) {
      for (const label of SECTIONS) {
        await page.getByRole('button', { name: label }).click();
        await expect(page.getByRole('heading', { name: label })).toBeVisible();
        await expect(page.getByText(`${label.toLowerCase()} — coming in a later phase`)).toBeVisible();
      }
      // Return to the default section so every device ends in the same state.
      await page.getByRole('button', { name: 'Database' }).click();
      await expect(page.getByRole('heading', { name: 'Database' })).toBeVisible();
    }

    // Layout sanity at the device profile: no horizontal overflow, content visible.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);

    // Zero-console-error policy (doctrine #5) at every device profile.
    expect(consoleErrors, `console errors: ${JSON.stringify(consoleErrors)}`).toEqual([]);
    expect(pageErrors, `page errors: ${JSON.stringify(pageErrors)}`).toEqual([]);
  });

  test('shell is interactable with the device input profile (click vs touch)', async ({ page }) => {
    await page.goto('/');

    const hasTouch = page.viewportSize()!.width < 768;
    const heading = page.getByRole('heading', { name: 'Database' });

    if (hasTouch) {
      // Mobile profile: verify the shell survives a tap-style interaction and
      // the touch input profile does not corrupt layout.
      await page.touchscreen.tap(195, 400);
      await expect(heading).toBeVisible();
    } else {
      // Desktop profile: regular click path (covered fully by the nav journey).
      await expect(heading).toBeVisible();
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });
});