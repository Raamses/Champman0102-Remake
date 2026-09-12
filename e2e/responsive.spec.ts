import { test, expect } from './fixtures';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const { name, width, height } of VIEWPORTS) {
  test(`renders the shell at ${name} viewport (${width}x${height}) with no horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Database' })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
}

test('desktop viewport shows the sidebar navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Squad' })).toBeVisible();
});

test('mobile viewport hides the desktop sidebar without breaking the shell', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  // The sidebar nav is desktop-only (`hidden md:flex`) — no mobile nav exists yet,
  // this documents current shell behavior rather than an unbuilt mobile menu.
  await expect(page.getByRole('button', { name: 'Squad' })).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Database' })).toBeVisible();
});
