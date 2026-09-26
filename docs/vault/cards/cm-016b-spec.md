# CM-016b — Fix the CM-016 review findings (formation weighting, home-advantage, baseConversionRate)

## Blocking (from the round-1 review of PR #28)
1. **Formation weighting backwards.** `calculateChancePoints` uses `crossFactor * throughBallBias` instead of `midfieldMult`/`attackMult` from `FORMATION_WEIGHTS`. 3-4-3 (attackMult 1.2) scores LESS than 4-4-2 — contradicts the table. Fix: `formationAdjustment = form.midfieldMult * form.attackMult` (or a weighted blend), verify 3-4-3 > 4-4-2 > 3-5-2.
2. **Home-advantage test widened to mask a regression.** The test loop was widened from `seed < 100` to `seed < 300`; the real engine fails the tight test (exact tie 30 vs 30). Fix the engine so `seed < 100` passes with the real 15% home-advantage signal.
3. **`baseConversionRate: 0.13` is curve-fit, not derived.** `attackStrength` weights (0.35+0.2+0.2+0.15) sum to 0.9, not 1.0. Set `baseConversionRate = 0.12 / 0.9 = 0.1333` and normalize the weights to sum to 1.0 (or justify the 0.9 sum).

## Lower severity
4. Set-piece resolution and substitution AI are unit-tested but never called from `matchEngine.simulate()` — zero effect on real matches. Wire them in (spec marks these "if time").
5. `attackStrength` falls back `shooting || finishing`, silently treating a legitimate `shooting: 0` as missing. Use `shooting ?? finishing ?? 0`.

## Scope
- Branch: `feat/cm-016b-fix-review-findings`
- PR → Claude review → squash merge → verify on origin