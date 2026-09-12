import { test, expect } from './fixtures';

test('app shell loads and renders the main UI with zero console errors', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Database' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Squad' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tactics' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Transfers' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'League' })).toBeVisible();
});
