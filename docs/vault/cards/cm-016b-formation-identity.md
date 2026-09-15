# CM-016b: Formation identity + review-fix completion

**Parent:** CM-016 (merged #28). **Source:** wip/cm-016-review-fixes branch + Claude REQUEST-CHANGES round 1.

## Scope
1. Formation weighting uses midfieldMult/attackMult (0.4/0.6 blend) — DONE on wip branch; the 3-4-3 identity test still FAILS (0.765 < 0.82): 3-4-3 undershoots 4-4-2 despite attackMult 1.2. Root cause: the test roster is fixed (3 MID + 3 ATT) regardless of formation — the identity signal is too weak at the roster level.
2. Decide: (a) formation-aware rosters in the test helper, or (b) stronger blend, or (c) fold formation into chance-TYPE distribution (CM-017 commentary models crosses/through-balls — natural home).
3. Re-derive baseConversionRate from normalized weights (DONE on wip: 0.12 kept, weights sum to 1.0).

## Acceptance
- 3-4-3 outscores 4-4-2 at equal player ratings (identity honored)
- All 5 dimensions + formation monotonic in tests
- Existing calibration properties hold (realistic goals band, home advantage)

## Assignee: Pi builder. Depends: CM-016 (merged). Feeds CM-017.
