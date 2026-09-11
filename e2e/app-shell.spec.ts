import { test, expect } from '@playwright/test';

test('app shell loads and renders the main UI with zero console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Database' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Squad' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tactics' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Transfers' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'League' })).toBeVisible();

  expect(consoleErrors, `console errors: ${JSON.stringify(consoleErrors)}`).toEqual([]);
  expect(pageErrors, `page errors: ${JSON.stringify(pageErrors)}`).toEqual([]);
});
