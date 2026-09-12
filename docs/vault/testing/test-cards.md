# Test Program — Working Cards (CM-T series)

Companion to [test-strategy.md](test-strategy.md). Same card flow as everything else: branch → PR → Claude review → squash merge. Builder ≠ tester wherever feasible.

## Wave 1 — start NOW (no feature dependencies)
| Card | Scope | Assignee | Acceptance |
|---|---|---|---|
| **CM-T01** | Playwright infrastructure: @playwright/test + config with chromium/firefox/webkit projects, app-shell smoke test (loads, renders, zero console errors), npm scripts + audio autoplay flag & haptic mock harness | Pi (claude -p) | `npx playwright test` green on all 3 browsers |
| **CM-T02** | E2E shell journeys: routes render, navigation, responsive smoke (desktop + 390px), console-error policy | Pi | journeys green in CI matrix |
| **CM-T09** | Fuzz corpus: malformed .dat (truncation, byte-flip, oversize, wrong order, empty) — parser fails gracefully, no hangs | Hermes | fuzz suite green + corpus in repo |
| **CM-T11** | Performance budgets as failing tests: 30MB staff.dat parse < 5s, full import < 30s, 10k matches CPU-calibrated benchmark; heap ≤ 120MB | Pi | budgets enforced in CI |
| **CM-T12** | CI wiring: GitHub Actions — L1+L2+build+tsc per PR, L3a fast-smoke gate per PR; full matrix nightly | Pi | Actions green on next PR |

## With features in flight
| Card | Scope | Assignee | Deps |
|---|---|---|---|
| **CM-T05** | Engine hardening (cross-assignment — Pi adversarially tests Hermes's CM-014): determinism proofs, edge cases (0-0, red cards, extra time, penalties), stamina curves, chance-model distribution sanity over 10k sims; enforce fixed-point integer math (no floats) for determinism | Pi | CM-014 |
| **CM-T06** | Transfer AI + competitions suites (mirrors CM-033/036 intent) | Pi | CM-014 (+CM-030 series) |
| **CM-T07** | Integration — import pipeline: staged vanilla .dat → parser → SoA data layer → IndexedDB persistence (CM-011 scope per the locked decisions doc; vitest portion gates PRs post-CM-011, browser-context portion via CM-T08B runner at phase gates): 10,580 clubs, Arsenal id 676, name-index integrity, attribute ranges, CP1252 diacritics & archive-path normalization | Pi | CM-011 |
| **CM-T03** | E2E data-import journey: BYOD upload → import → DB viewer shows clubs/squads/attributes | Pi | CM-012/013 |
| **CM-T04** | E2E match journey: team select → tactics → play → live commentary → result → persistence | Hermes | CM-014–018 |
| **CM-T08A** | Save migrations in vitest (pure logic) | Pi | CM-020 |
| **CM-T08B** | Real OPFS save/load + locking in a browser context — multi-tab lock contention (NoModificationAllowedError), Safari 7-day eviction, mid-save abort/crash recovery, COOP/COEP header verification, quota exhaustion, private-mode fallback, corrupt saves | Pi | CM-020 |
| **CM-T10** | E2E career + quick sim + PWA offline smoke | Hermes | CM-020/060/062 |
| **CM-T13** | Device matrix report: full Playwright matrix + mobile viewport, findings filed as cards | Hermes | after T01 |
| **CM-T15** | Cross-platform (x86/ARM64) & cross-engine (V8/JSC/SpiderMonkey) determinism proof suite | Pi | CM-014, CM-T05 |
| **CM-T16** | Web Worker RPC protocol, transferable memory & lifecycle suite | Pi | CM-011, CM-014 |
| **CM-T17** | Competition Rule Engine pre-falsification suite (English pyramid fixture mapping) | Pi | CM-011, CM-T07 |
| **CM-T14** | Canonical synthetic .dat generator for PRs + encrypted CI fixture vault (real fixtures never enter CI) | Pi | None |

## Meta
- **CM-T00 (this program + strategy doc) is the design step.** Reviewer: Claude. Adversarial meta-review of the test plan itself: Gemini 3.8 Flash (holes in the strategy, missed risk surfaces).
- **Sequencing:** T01 → T02 → T09/T11/T12 immediately; T05 after CM-014; T07 after CM-011/012; T03/T04/T08/T10/T13 follow their features.
- **Supersession:** CM-T05 supersedes plan-v2's CM-019; CM-T06 supersedes CM-033/CM-036 — the CM-T series is the single test-authority series, no duplicate effort.
- **Actual builders (current reality):** the Pi's claude -p builds most feature cards; Hermes builds select cards (CM-002 done, CM-014 in flight). Tester = the other builder: Hermes tests Pi-built features (T03/T04/T10), Pi tests Hermes-built features (T05/T06) — per the Gemini meta-review register. This supersedes plan-v2's assignee labels for execution — plan-v3 will re-state ownership (so CM-T06 testing the CM-030 series is cross-assigned: Hermes tests, the Pi builds).
- **Distribution:** Pi = infra, pipeline integrations, engine hardening, CI, perf budgets, synthetic fixtures, transfer/competition suites. Hermes = E2E journeys, fuzz corpus, device matrix. Claude reviews every PR.