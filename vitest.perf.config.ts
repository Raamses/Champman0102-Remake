import { defineConfig } from 'vitest/config';

// CM-T11: dedicated config for the L4 performance-budget suite. Kept out of
// the default `npm test` run (see vitest.config.ts's exclude) since perf
// budgets are a phase-gate/nightly concern, not a per-PR L1 gate — see
// docs/vault/testing/test-strategy.md.
//
// `--expose-gc` lets the heap-ceiling test force a collection before
// measuring instead of reading a noisy raw heapUsed delta.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/__tests__/perf-budgets.test.ts'],
    exclude: ['**/node_modules/**'],
    testTimeout: 30_000,
    execArgv: ['--expose-gc'],
  },
});
