# CM-022e — Keeper-term intent proof: the discriminating test + calibration documentation

## The finding this closes

**PR #34 round 4, `[MAJOR][R4]`:** the R4 reconcile flipped the set-piece keeper term from
`+ keeperStrength` to `-(keeperStrength - AVERAGE_KEEPER_STRENGTH)` at
`src/lib/tactics/setpieces.ts:42` — a calibration-relevant change that shipped with **no
discriminating test** and was not disclosed in the PR description. That major was the last
unreviewed change-set of the PR-#34 churn; the 2026-10-02 counsel
(`plans/COUNSEL-PR34-CM022.md`) split the remediation into PRs A–E, with **PR E = this
card's PR**: prove the keeper term's intent and document the calibration decision.

The formula survived the CM-022c fold (`e8e821c`) and is pinned by the golden suite
(`src/engine/__tests__/golden.match.test.ts` — the 48-cell unit grid and the whole-stream
literals were generated from it). Directionally it is right; the R4 objection was **untested
+ undisclosed**. This PR closes both halves: the test exists, the decision is documented here.

## The formula and its intent

```ts
const keeperStrength = (keeperAttr.handling + keeperAttr.reflexes + keeperAttr.oneOnOnes) / 60;
const AVERAGE_KEEPER_STRENGTH = 30 / 60; // = 0.5

const effectiveRoll = Math.max(0, Math.min(1,
  baseConversion - defensePenalty - (keeperStrength - AVERAGE_KEEPER_STRENGTH)));
```

`effectiveRoll` is the conversion budget a set piece competes against a uniform roll:
`roll < effectiveRoll * 0.6` → goal, `roll < effectiveRoll` → save, else miss. The keeper term
is **deviation-from-average**:

- a **stronger-than-average** keeper subtracts from the budget → lower set-piece conversion;
- a **weaker-than-average** keeper adds to it → higher set-piece conversion;
- an **average** keeper (handling + reflexes + oneOnOnes = 30) contributes **exactly 0**.

## Why this form is correct as designed

1. **Direction.** The pre-R4 form (`+ keeperStrength` inside `effectiveRoll`) was a genuine
   sign bug: a *stronger* keeper *increased* conversion. The deviation form is monotone the
   right way — proven per-step by the new test's measured-threshold sweep.
2. **Mean-centering.** Subtracting an *absolute* `keeperStrength` would drag every set piece
   by the keeper's full quality, shifting the whole calibration whenever league keeper quality
   shifts. Deviation-from-average anchors the term at the engine's own all-10 baseline
   (30/60 = 0.5): an average keeper leaves the base calibration untouched, which is also
   exactly what the golden fixtures (all-10 keepers) pin.
3. **Bounded, symmetric influence.** The term spans ±(30/60) on a 0–1 budget scale and is
   symmetric around the average — a +10 keeper sum swing changes the budget by the same
   magnitude as a −10 swing. The existing `Math.max(0, Math.min(1, …))` clamp bounds the
   extremes (the all-10 taker vs a strong keeper clamps to 0; a specialist taker vs a weak
   keeper saturates at 1.0).

**Calibration decision: keep the formula.** No recalibration ships here; the decision is to
ratify the R4 flip as the designed intent, now tested and documented. `throwIn` shares the
same keeper-term code path (only its `baseConversion` inputs differ) but is deliberately
outside the golden grid's pinned scope (corner/freeKick), matching the grid's scope.

## The test that proves it

`src/lib/tactics/__tests__/setpieces.test.ts` — fixtures mirror the golden 48-cell grid
exactly (the grid's specialist takers, its four average defenders, its strong/average/weak
keepers, `createAttributes` all-10 baseline reused from `golden.helpers.ts`):

1. **Monotonic direction** — the save→miss flip point of the roll (`effectiveRoll`, i.e. the
   goal+save probability) is measured by bisection from the outside and must **strictly
   decrease at every step** of an 8-keeper sweep (attribute sums 15 → 51), for both corner and
   freeKick.
2. **Exactly 0 at AVERAGE** — the measured threshold at the average keeper equals the
   no-keeper-term value (base 1.0 − defense 0.25 = **0.75**), and the deviation magnitude is
   pinned on both sides: strong (sum 51) → **0.40**, weak (sum 15) → **1.0** (the upper clamp).
   A regression to the pre-R4 `+ keeperStrength` form measures **1.0** here (clamped from 1.25)
   instead of 0.75; an uncentered `- keeperStrength` form measures **0.25** — both regressions
   fail this pin.
3. **Split invariance** — only the attribute *sum* enters the term: three sum-30 keepers with
   wildly different splits (10/10/10, 20/5/5, 4/12/14) resolve identically across a dense
   0–1 roll sweep, both takers, both set-piece types.
4. **Outcome-level direction at the grid's canonical rolls** (0.05/0.35/0.65/0.95, both
   takers) — the attack outcome never improves against a stronger keeper, and strictly
   worsens in aggregate (goal > save > miss favorability).

Discriminating power was verified by mutation: reverting the term to the pre-R4 form fails
tests 1, 2 and 4 (3 of 4; the split-invariance invariant correctly survives any sum-based
form), and fails 5 golden tests — so the new test and the pinned grid cross-validate each
other.

## Golden-suite relationship

The golden suite already **reflects the flipped formula** — it was regenerated after the
fold and pins this exact behavior. This PR adds a test and changes **zero** behavior, so the
expected golden result is **green, unmodified, zero flips** — verified: `647 passed | 2
skipped` (643 baseline + 4 new). The `PINNED-BEHAVIOR` comments in
`golden.match.test.ts` that anticipated "PR E's recalibration" were updated (comments only,
zero assertions) to record that PR E kept and proved the formula instead.

The `cm-022a-golden-tests.md` card's line "the fine-grained targets PR E's keeper-term
recalibration flips 1:1" anticipated a recalibration that did not happen — superseded by
this decision. Any **future** recalibration of the keeper term still flips those 48 cells
1:1 and must carry a divergence ledger entry per the review protocol
(`orchestrator/vault/review-protocol.md`, rules 1 and 6).