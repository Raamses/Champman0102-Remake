# ChampMan 01/02 Remake — Test Strategy (Special Forces Manual)

**Status:** Active · **Version:** 1.0 (2026-09-11) · **Cards:** see [test-cards.md](test-cards.md)
**Applies to:** every phase. No card above "trivial docs" merges without green suites.

## Mission
Zero-surprise releases: the game parses real 2001 data, simulates deterministic matches, and saves careers that load back — proven continuously by machines, attacked by special forces.

## Test layers

| Layer | Tooling | Scope | Gate |
|---|---|---|---|
| **L1 Unit** | vitest | parser record types, playerSetup merge, engine branches, transfer AI, competitions, save migrations | every PR |
| **L2 Integration** | vitest + real fixtures | staged vanilla .dat → parser → SQLite-WASM import; OPFS save/load round-trip; worker protocol | PRs touching the pipeline |
| **L3 E2E** | Playwright — chromium/firefox/webkit | user journeys: shell → import → browse → squad → tactics → match → commentary → save/load → quick sim | phase gates + nightly |
| **L4 Adversarial (SF)** | custom fuzz + budgets | malformed .dat corpus; OPFS chaos (quota, private mode); **determinism proofs** (same seed → byte-identical report); perf budgets (30MB staff.dat parse < 5s, full import < 30s, 10k seeded matches < 60s); zero-console-error policy | phase gates |

## Doctrine (SF rules)
1. **Builder ≠ tester.** The adversarial/edge suite for a feature is authored by a *different* builder than the feature (cross-assignment in the card list).
2. **Determinism is a feature.** Same seed + same tactics → identical match report. Any diff = bug.
3. **Real data is the fixture.** The vanilla 2001 set (`~/cm0102-game-data/`) is canonical; synthetic fixtures only for edge cases.
4. **Every bug fix ships with a regression test** that fails without the fix.
5. **Zero console errors** in E2E runs; new warnings reviewed per release.
6. **PR gate:** green L1+L2 + build + tsc, then Claude reviewer APPROVE. L3/L4 at phase gates. PRs touching `src/engine/` additionally run the L4 determinism suite.

## Environments
- Browsers: chromium, firefox, webkit (Playwright projects)
- Viewports: desktop 1280×800, mobile 390×844 (CM-061 hardens)
- Storage states: fresh OPFS · existing save vN (migration) · quota-exceeded · private-mode fallback
- Fixtures: vanilla 2001 set + fuzz corpus (CM-T09)

## CI
GitHub Actions (CM-T12): per PR → L1+L2+build+tsc; nightly → L3 full matrix + L4. Merge gate: L1+L2 green + Claude APPROVE.

## Ownership
- **Pi (claude -p):** T01, T02, T07, T08, T09, T11, T12, T05 — infrastructure, pipeline integrations, fuzz, perf, CI, adversarial engine suite
- **Hermes:** T04, T06, T10, T13 — E2E journeys, transfer/competition suites, device matrix
- **Claude reviewer:** every PR (merge gate)
- **Gemini 3.8 Flash:** adversarial meta-review of THIS strategy — find the holes in the test plan itself