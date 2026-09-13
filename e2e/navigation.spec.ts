import { test, expect } from './fixtures';

const SECTIONS = [
  { id: 'database', label: 'Database' },
  { id: 'squad', label: 'Squad' },
  { id: 'tactics', label: 'Tactics' },
  { id: 'transfers', label: 'Transfers' },
  { id: 'league', label: 'League' },
];

test('navigation switches the header and content between all sections', async ({ page }) => {
  await page.goto('/');

  for (const { id, label } of SECTIONS) {
    await page.getByRole('button', { name: label }).click();
    await expect(page.getByRole('heading', { name: label })).toBeVisible();
    await expect(page.getByText(`${id} — coming in a later phase`)).toBeVisible();
  }
});

test('the active section is highlighted in the sidebar', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Tactics' }).click();
  await expect(page.getByRole('button', { name: 'Tactics' })).toHaveClass(/text-brand-primary/);
  await expect(page.getByRole('button', { name: 'Squad' })).not.toHaveClass(/text-brand-primary/);
});
