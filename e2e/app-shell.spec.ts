import { test, expect } from './fixtures';

test('app shell loads and renders the main UI with zero console errors', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Database' })).toBeVisible();

  // The sidebar is `hidden md:flex` — device-profile aware (CM-T13):
  // desktop profiles show it, mobile profiles (390x844) hide it until
  // CM-061 builds the mobile nav. The header always shows the section name.
  const sidebarVisible = page.viewportSize()!.width >= 768;
  if (sidebarVisible) {
    await expect(page.getByRole('button', { name: 'Squad' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tactics' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transfers' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'League' })).toBeVisible();
  }
});