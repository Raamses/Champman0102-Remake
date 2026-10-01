import { test, expect } from './fixtures';

const SECTIONS = [
  { id: 'database', label: 'Database' },
  { id: 'match', label: 'Match' },
  { id: 'squad', label: 'Squad' },
  { id: 'tactics', label: 'Tactics' },
  { id: 'transfers', label: 'Transfers' },
  { id: 'league', label: 'League' },
];

test('navigation switches the header and content between all sections', async ({ page }) => {
  await page.goto('/');

  // Navigation controls live in the desktop-only sidebar (`hidden md:flex`).
  // On mobile profiles (390x844) there is no nav surface yet — CM-061 — so
  // the journey is only asserted where the controls exist (CM-T13 device matrix).
  const sidebarVisible = page.viewportSize()!.width >= 768;
  test.skip(!sidebarVisible, 'no navigation controls on mobile profiles (CM-061)');

  for (const { id, label } of SECTIONS) {
    await page.getByRole('button', { name: label }).click();
    await expect(page.getByRole('heading', { name: label })).toBeVisible();
    // CM-013: the database tab ships its real view (BYOD import empty state
    // on a fresh profile); every later-phase tab keeps the placeholder.
    // CM-018: the match tab ships its real MatchDay view (empty-database prompt).
    if (id === 'database') {
      await expect(page.getByText('No database loaded')).toBeVisible();
    } else if (id === 'match') {
      await expect(page.getByText(/No database loaded|Loading database/)).toBeVisible();
    } else {
      await expect(page.getByText(`${id} — coming in a later phase`)).toBeVisible();
    }
  }
});

test('the active section is highlighted in the sidebar', async ({ page }) => {
  await page.goto('/');

  const sidebarVisible = page.viewportSize()!.width >= 768;
  test.skip(!sidebarVisible, 'no navigation controls on mobile profiles (CM-061)');

  await page.getByRole('button', { name: 'Tactics' }).click();
  await expect(page.getByRole('button', { name: 'Tactics' })).toHaveClass(/text-brand-primary/);
  await expect(page.getByRole('button', { name: 'Squad' })).not.toHaveClass(/text-brand-primary/);
});