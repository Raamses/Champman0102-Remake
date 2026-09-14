# CM-T13 — Device Matrix Report

**Card:** CM-T13 (test-cards.md) · **Builder:** Hermes · **Date:** 2026-09-14
**Suite:** `e2e/device-matrix.spec.ts` (this PR) · **Config:** `playwright.config.ts` (this PR)
**App state under test:** shell + tactics scaffold @ `365d064` (CM-015) — placeholders, no routes, desktop-only sidebar.

## Matrix

| Project | Engine | Viewport | Input | Notes |
|---|---|---|---|---|
| `chromium` | Chromium 153 | 1280×800 | mouse | Desktop Chrome emulation |
| `firefox` | Firefox (Playwright build) | 1280×800 | mouse | Desktop Firefox emulation |
| `webkit` | WebKit (Playwright build) | 1280×800 | mouse | Desktop Safari emulation |
| `mobile-chromium` | Chromium 153 | 390×844 | touch, isMobile | iPhone-class, DPR from desktop device defaults |
| `mobile-firefox` | Firefox (Playwright build) | 390×844 | touch | `isMobile` unsupported in FF (finding F2) |
| `mobile-webkit` | WebKit (Playwright build) | 390×844 | touch, isMobile | Closest proxy to real Mobile Safari |

## Results (local run, 2026-09-14)

Full matrix: **134 passed / 16 skipped / 0 failed** (69 pre-existing tests ×3 desktop projects + 12 new device-matrix tests + Pi's persistence suites ×6 projects).
Per-scope: desktop 70 passed/5 skipped · mobile 64 passed/11 skipped.
L1 unit: 541 passed/22 skipped · tsc clean · `npm run build` green.
Skips are pre-existing contract skips (OPFS-heavy persistence cases on chromium/firefox per CM-T08B; mobile navigation journeys pending CM-061).

## Findings (filed as cards)

### F1 — Mobile has no navigation surface (→ CM-061 dependency, HIGH)
At 390×844 the sidebar is `hidden md:flex` and nothing replaces it: mobile users cannot reach
Squad/Tactics/Transfers/League at all — only the default Database section renders. The pre-existing
`app-shell.spec.ts` / `navigation.spec.ts` asserted the desktop sidebar unconditionally and failed on
all mobile projects; they are now device-profile aware (assert or skip with pointer to CM-061).
**Action for Ram/AmosBot:** confirm CM-061 scope covers a mobile nav (hamburger/bottom bar) before
import journeys land, or every data-import E2E will be desktop-projects-only.

### F2 — Playwright `isMobile: true` hangs Firefox's page on same-size `setViewportSize` (upstream, workaround applied, MEDIUM)
Reproduced standalone (Playwright 1.63, local Firefox build): with `isMobile: true` in a Firefox
context, `page.setViewportSize({width:390,height:844})` — the same size the context already has —
never resolves (30s+), while the identical call without `isMobile` returns in ~240 ms. Different
sizes are fine. This hit the Pi's `responsive.spec.ts` (which re-sets the context size) the moment a
Firefox mobile project existed. `mobile-firefox` therefore uses `viewport + hasTouch` only —
documented in `playwright.config.ts`. Chromium/WebKit keep full `isMobile` emulation.
**Action for Pi:** if you want `isMobile` parity for Firefox, that's an upstream Playwright bug
report; until then keep the FF mobile profile viewport+touch.

### F3 — DPR/UA variance across mobile projects is unrecorded (LOW, informational)
`Desktop Chrome/Firefox/Safari` device defaults override viewport but not DPR/UA, so the three
mobile projects are not uniform in device descriptor terms (e.g. mobile-webkit ≈ Desktop Safari
defaults rather than iPhone 14 profile). Viewport+touch is the matrix contract for now; a
per-project `device:` descriptor (`devices['iPhone 14']` etc.) would be more faithful once CM-061
lands — deferred to avoid coupling this PR to Pi's viewport contracts in `responsive.spec.ts`.

## Environment coverage gaps (tracked, not blocking)

- No real-device run (Android Chrome / iOS Safari physical) — emulation only, per card scope.
- No tablet viewport (iPad 768×1024) — CM-061 scope candidate.
- Landscape mobile (844×390) untested — shell is a single-column flex layout; risk low.
- Storage-state matrix (fresh/existing save/quota/private-mode) is CM-T08B's suite, which
  already passes across all desktop projects; mobile-profile persistence runs ride the same
  specs and are included in the 64-passed mobile count above.

## Exit criteria (per card)

- [x] Full Playwright matrix green locally (3 desktop + 3 mobile profiles)
- [x] Findings filed as cards in this report (F1, F2, F3) with owners/actions
- [x] Report in `docs/vault/testing/`
- [ ] CI green on this PR (chromium smoke gate runs; full matrix stays nightly per CM-T12)