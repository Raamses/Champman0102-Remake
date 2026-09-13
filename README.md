# Championship Manager 01/02 Remake

A browser-based remake of Championship Manager 01/02. Reads original `.dat`
save/database files (BYOD — bring your own data) and simulates matches with a
chance-creation match engine. See [`docs/vault/plan-v2.md`](docs/vault/plan-v2.md)
for the full plan.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (CSS-first config via `@theme` in `src/index.css`)
- Vitest for unit tests

## Run locally

```
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run test` — run the test suite
- `npm run lint` — type-check only (`tsc --noEmit`)
