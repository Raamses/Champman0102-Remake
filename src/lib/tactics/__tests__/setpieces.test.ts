// CM-022e — the keeper-term intent proof (closes PR #34 round-4 [MAJOR][R4]).
//
// The R4 reconcile flipped the set-piece keeper term from `+ keeperStrength`
// to `-(keeperStrength - AVERAGE_KEEPER_STRENGTH)` (src/lib/tactics/setpieces.ts:42)
// — a calibration-relevant change that shipped with NO discriminating test: the
// PR-#34 R4 major. The formula survived the CM-022c fold (e8e821c) and is pinned
// by the golden suite (src/engine/__tests__/golden.match.test.ts, 48-cell unit
// grid). This file IS the missing test. With every other input fixed, sweeping
// the keeper below/at/above AVERAGE_KEEPER_STRENGTH must show:
//
//   1. MONOTONIC DIRECTION — a stronger keeper strictly lowers the conversion
//      probability (the measured save→miss flip point of the roll IS
//      effectiveRoll, the goal+save probability under a uniform roll).
//   2. EXACTLY ZERO AT AVERAGE — at AVERAGE_KEEPER_STRENGTH the keeper term
//      contributes exactly 0: the measured threshold equals the no-keeper-term
//      value (baseConversion − defensePenalty), and the deviation magnitude on
//      both sides matches the deviation-from-average form.
//
// Fixtures mirror the golden grid exactly (createAttributes all-10 baseline,
// the grid's specialist takers, its four average defenders, its strong/average/
// weak keepers) so these pins cross-validate that grid. ZERO production changes:
// a failure here means the formula moved, not this test. See
// docs/vault/cards/cm-022e-keeper-proof.md for the calibration decision.

import { describe, expect, it } from 'vitest';
import { applySetPieceResolution } from '../setpieces';
import type { PlayerAttributes } from '../../../engine/types';
// Reused from the golden grid's helpers so this proof and the pinned grid share
// ONE attribute baseline (createAttributes = all 10).
import { createAttributes } from '../../../engine/__tests__/golden.helpers';

const CORNER_SPECIALIST = createAttributes({ heading: 20, strength: 20, acceleration: 20 });
const FREEKICK_SPECIALIST = createAttributes({ freeKicks: 20, technique: 20, finishing: 20 });
const AVERAGE_TAKER = createAttributes(); // corner AND freeKick base = 10/20 = 0.5
// The golden grid's defenders: four average players → avgDefense 10 → penalty 0.25.
const DEFENDERS = [createAttributes(), createAttributes(), createAttributes(), createAttributes()];

// Base conversion for both specialist takers is (20·0.5 + 20·0.3 + 20·0.2)/20 = 1.0;
// the defense penalty is 10/40 = 0.25; the no-keeper-term threshold is therefore 0.75.
const BASE_CONVERSION = 1.0;
const DEFENSE_PENALTY = 0.25;

const keeper = (handling: number, reflexes: number, oneOnOnes: number): PlayerAttributes =>
  createAttributes({ handling, reflexes, oneOnOnes });

const KEEPERS = {
  weak: keeper(4, 5, 6), // sum 15 → keeperStrength 15/60 = 0.25 (the grid's weak keeper)
  average: createAttributes(), // sum 30 → keeperStrength 30/60 = AVERAGE_KEEPER_STRENGTH
  strong: keeper(18, 17, 16), // sum 51 → keeperStrength 51/60 ≈ 0.85 (the grid's strong keeper)
};

// Below/at/above-average sweep: handling+reflexes+oneOnOnes sums 15 → 51.
// Only the sum enters the term (proven by the split-invariance case below).
const SWEEP: PlayerAttributes[] = [
  keeper(4, 5, 6), // 15
  keeper(6, 7, 7), // 20
  keeper(8, 8, 9), // 25
  createAttributes(), // 30 (average)
  keeper(12, 11, 12), // 35
  keeper(13, 14, 13), // 40
  keeper(15, 15, 15), // 45
  keeper(18, 17, 16), // 51 (the grid's strong keeper)
];

const TYPES = ['corner', 'freeKick'] as const;
const takerFor = (type: (typeof TYPES)[number]) =>
  type === 'corner' ? CORNER_SPECIALIST : FREEKICK_SPECIALIST;

function resolveAt(
  taker: PlayerAttributes,
  k: PlayerAttributes,
  roll: number,
  type: (typeof TYPES)[number],
): string {
  return applySetPieceResolution(taker, DEFENDERS, k, { next: () => roll }, type);
}

/**
 * Measure effectiveRoll from the outside: the outcome flips save→miss exactly at
 * roll === effectiveRoll (goal band [0, 0.6·er), save band [0.6·er, er), miss
 * beyond). Bisection on that boundary converges to double precision — er = 1.0
 * (never miss) and er = 0 (always miss) both measure their exact value.
 */
function measuredEffectiveRoll(
  taker: PlayerAttributes,
  k: PlayerAttributes,
  type: (typeof TYPES)[number],
): number {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (resolveAt(taker, k, mid, type) === 'miss') hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

const FAVOR: Record<string, number> = { goal: 2, save: 1, miss: 0 };
const GRID_ROLLS = [0.05, 0.35, 0.65, 0.95]; // the golden grid's canonical rolls

describe('CM-022e — set-piece keeper term: intent proof (PR #34 R4 [MAJOR] closure)', () => {
  it('monotonic direction: the measured conversion threshold strictly decreases at every keeper-strength step (corner + freeKick)', () => {
    for (const type of TYPES) {
      const taker = takerFor(type);
      const measured = SWEEP.map((k) => measuredEffectiveRoll(taker, k, type));
      // Every step strictly down: stronger keeper → strictly lower conversion probability.
      for (let i = 1; i < measured.length; i++) {
        expect(measured[i]).toBeLessThan(measured[i - 1]);
      }
      // The golden grid's keeper trio is strictly ordered too.
      expect(measuredEffectiveRoll(taker, KEEPERS.strong, type)).toBeLessThan(
        measuredEffectiveRoll(taker, KEEPERS.average, type),
      );
      expect(measuredEffectiveRoll(taker, KEEPERS.average, type)).toBeLessThan(
        measuredEffectiveRoll(taker, KEEPERS.weak, type),
      );
    }
  });

  it('at AVERAGE_KEEPER_STRENGTH the keeper term contributes exactly 0 — and the deviation magnitude is pinned on both sides', () => {
    for (const type of TYPES) {
      const taker = takerFor(type);
      // Exactly 0 at average: the measured threshold equals the no-keeper-term
      // value (base 1.0 − defense 0.25 = 0.75). A regression to the pre-R4
      // `+ keeperStrength` form measures 1.0 here (clamped from 1.25) instead
      // of 0.75; an uncentered `- keeperStrength` form measures 0.25 — both
      // fail this pin.
      expect(measuredEffectiveRoll(taker, KEEPERS.average, type)).toBeCloseTo(
        BASE_CONVERSION - DEFENSE_PENALTY,
        12,
      );
      // Deviation-from-average magnitude: term = −(S/60 − 0.5).
      // Strong (S = 51): 0.75 − (0.85 − 0.5) = 0.40.
      expect(measuredEffectiveRoll(taker, KEEPERS.strong, type)).toBeCloseTo(0.4, 12);
      // Weak (S = 15): 0.75 − (0.25 − 0.5) = 1.0 (the Math.min clamp boundary).
      expect(measuredEffectiveRoll(taker, KEEPERS.weak, type)).toBeCloseTo(1.0, 12);
    }
  });

  it('the keeper term reads only the strength deviation: average keepers with wildly different attribute splits resolve identically', () => {
    const avgSplits = [createAttributes(), keeper(20, 5, 5), keeper(4, 12, 14)]; // all sum 30
    const rolls = Array.from({ length: 41 }, (_, i) => i / 40); // 0 … 1 step 0.025
    for (const type of TYPES) {
      for (const taker of [takerFor(type), AVERAGE_TAKER]) {
        for (const split of avgSplits.slice(1)) {
          const outcomes = rolls.map((r) => resolveAt(taker, split, r, type));
          const baseline = rolls.map((r) => resolveAt(taker, avgSplits[0], r, type));
          expect(outcomes).toEqual(baseline);
        }
      }
    }
  });

  it('outcome-level direction at the golden grid rolls: the attack outcome never improves as the keeper strengthens (and strictly worsens)', () => {
    for (const type of TYPES) {
      for (const taker of [takerFor(type), AVERAGE_TAKER]) {
        for (const r of GRID_ROLLS) {
          expect(FAVOR[resolveAt(taker, KEEPERS.weak, r, type)]).toBeGreaterThanOrEqual(
            FAVOR[resolveAt(taker, KEEPERS.average, r, type)],
          );
          expect(FAVOR[resolveAt(taker, KEEPERS.average, r, type)]).toBeGreaterThanOrEqual(
            FAVOR[resolveAt(taker, KEEPERS.strong, r, type)],
          );
        }
        const favor = (k: PlayerAttributes) =>
          GRID_ROLLS.reduce((sum, r) => sum + FAVOR[resolveAt(taker, k, r, type)], 0);
        // Aggregate: strictly lower conversion favorability against a stronger keeper.
        expect(favor(KEEPERS.weak)).toBeGreaterThan(favor(KEEPERS.average));
        expect(favor(KEEPERS.average)).toBeGreaterThan(favor(KEEPERS.strong));
      }
    }
  });
});