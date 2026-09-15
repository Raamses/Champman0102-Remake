# CM-016b: CM-016 review-fix completion (self-contained)

**Parent:** CM-016 (merged #28). **Source:** wip/cm-016-review-fixes branch + Claude REQUEST-CHANGES round 1.

## Scope (all done on the wip branch — this card lands them)
1. Formation weighting via midfieldMult/attackMult blend (0.4/0.6) replacing the crossFactor/throughBallBias aggregate — done on wip.
2. baseConversionRate re-derived from normalized attackStrength weights (weights sum to 1.0; rate stays 0.12) — done on wip.
3. Home-advantage test rewritten as a goals-ratio assertion (powerful signal, not widened-to-pass) — done on wip.

## Known limitation (deliberately OUT of this card)
The 3-4-3 formation-identity acceptance ("3-4-3 outscores 4-4-2 at equal ratings") is **NOT achievable via the aggregate CP multiplier alone** — the wip branch proves it (1.08 multiplier still produced 0.765 < 0.82 goals; the mechanism interacts with RNG draw ordering and the fixed test roster). The identity criterion is **satisfied by CM-017** (per-chance-type distribution is the real lever). The failing 3-4-3 test moves to CM-017's suite.

## Acceptance
- Blend + normalized weights + goals-ratio home test merged; full suite green
- No calibration properties regressed

## Depends: CM-016 (merged). Feeds CM-017, CM-018.
