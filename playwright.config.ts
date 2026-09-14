import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx vite --port=4173 --strictPort --host=127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // CM-T13 device matrix: mobile 390x844 (iPhone 14/15 class) on each engine.
    // isMobile is intentionally omitted on Firefox — Playwright does not support
    // it there, and same-size setViewportSize under isMobile:true hangs the FF
    // page (CM-T13 finding #2). Mobile profile = viewport + touch.
    {
      name: 'mobile-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    {
      name: 'mobile-firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 390, height: 844 }, hasTouch: true },
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
});
