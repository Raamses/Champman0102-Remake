import { test as base, expect } from '@playwright/test';

/**
 * Shared fixture enforcing the zero-console-error policy (test-strategy.md doctrine #5):
 * every test built on this `test` fails if the page logs a console error or throws
 * an uncaught page error, without each spec having to wire up its own listeners.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await use(page);

    expect(consoleErrors, `console errors: ${JSON.stringify(consoleErrors)}`).toEqual([]);
    expect(pageErrors, `page errors: ${JSON.stringify(pageErrors)}`).toEqual([]);
  },
});

export { expect };
