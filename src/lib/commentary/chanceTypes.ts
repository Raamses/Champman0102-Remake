// @paths lib/commentary
import { RNG } from '../../engine/rng';
import type { Tactic, PlayerState } from '../../engine/types';
import { getFormation, type FormationWeights } from '../tactics/types';
import type { ChanceType } from './types';

/**
 * CM-017 chance-type modeling.
 *
 * ACTIVATES the three CM-016b blend fields that were left dead
 * (crossFactor, throughBallBias, headerBias — CM-016b's CP blend only reads
 * midfieldMult/attackMult; defenceMult lives in DefensePressure).
 *
 * Every chance is classified into exactly one type BEFORE the conversion
 * roll. The type shifts conversion via CONVERSION_MULTIPLIER, and the
 * per-formation mix is renormalized against the 4-4-2 baseline mix so the
 * CM-016 calibrated base conversion (~12%) stays the anchor for the
 * most-neutral shape: activating the types is a REDISTRIBUTION of conversion
 * quality across chance types, not goal inflation.
 */

/** Per-type conversion multipliers (crosses are wasteful; one-on-ones are not) */
export const CONVERSION_MULTIPLIER: Record<ChanceType, number> = {
  'cross': 0.85,
  'through-ball': 1.2,
  'header': 0.8,
  'long-shot': 0.65,
  'one-on-one': 1.4,
};

/** Baseline type weights: the 4-4-2 anchor mix (all tactic/attr modifiers neutral) */
export const BASE_TYPE_WEIGHTS: Record<ChanceType, number> = {
  'cross': 1.0,
  'through-ball': 0.9,
  'header': 1.1,
  'long-shot': 0.5,
  'one-on-one': 1.0,
};

/** Tactic nudges on the type mix (activating width/passing dimensions) */
const WIDTH_CROSS_BOOST: Record<Tactic['width'], number> = { narrow: 0.9, normal: 1.0, wide: 1.15 };
const PASSING_THROUGH_BOOST: Record<Tactic['passing'], number> = { short: 0.95, mixed: 1.0, long: 1.1 };
const PASSING_LONG_SHOT_BOOST: Record<Tactic['passing'], number> = { short: 0.95, mixed: 1.0, long: 1.1 };

/** Chance-type classification context for one resolved chance */
export interface ChanceTypeInput {
  formation: string;
  tactic: Tactic;
  attacker: PlayerState;
  /** True when the chance follows a set-piece delivery (cross-like) */
  fromSetPiece?: boolean;
}

export interface ClassifiedChance {
  type: ChanceType;
  /** Conversion multiplier AFTER renormalization (weighted mean stays at baseline) */
  conversionMultiplier: number;
}

function typeWeights(formation: string, tactic: Tactic, attacker: PlayerState): Record<ChanceType, number> {
  const f: FormationWeights = getFormation(formation);
  // Attacker-driven nudge (deterministic, attribute-driven, no RNG): one-on-one
  // instinct (oneOnOnes) and off-the-ball movement sharpen one-on-ones; heading
  // sharpens headers; longShots sharpen long shots. 1-20 scale -> 0.5..1.5 band.
  const attrBand = (v: number) => 0.5 + v / 20; // 10 -> 1.0

  return {
    'cross': f.crossFactor * WIDTH_CROSS_BOOST[tactic.width],
    'through-ball': f.throughBallBias * PASSING_THROUGH_BOOST[tactic.passing],
    'header': f.headerBias * (0.7 + 0.3 * attrBand(attacker.attributes.heading)),
    'long-shot': 0.5 * PASSING_LONG_SHOT_BOOST[tactic.passing] * attrBand(attacker.attributes.longShots),
    'one-on-one': 1.0 * attrBand(attacker.attributes.oneOnOnes) * attrBand(attacker.attributes.offTheBall) / 1.0,
  };
}

/** Weighted mean of conversion multipliers under a weight mix */
export function meanMultiplier(weights: Record<ChanceType, number>): number {
  let total = 0;
  let weighted = 0;
  for (const k of Object.keys(BASE_TYPE_WEIGHTS) as ChanceType[]) {
    const w = Math.max(0, weights[k]);
    total += w;
    weighted += w * CONVERSION_MULTIPLIER[k];
  }
  return total > 0 ? weighted / total : 1;
}

/** The baseline (4-4-2, neutral tactic, 10-rated attrs) mean multiplier — the anchor */
export const BASELINE_MEAN_MULTIPLIER = meanMultiplier(BASE_TYPE_WEIGHTS);

/**
 * Classify one chance into its type. Uses ONLY the feature RNG stream
 * (never the engine's outcome RNG) so CM-014/016 seeded sequences are
 * untouched.
 */
export function classifyChance(
  formation: string,
  tactic: Tactic,
  attacker: PlayerState,
  featureRng: RNG,
): ClassifiedChance {
  const weights = typeWeights(formation, tactic, attacker);
  const total = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0);

  // Weighted pick: one feature-RNG draw determines the type.
  const roll = featureRng.next() * total;
  let acc = 0;
  let picked: ChanceType = 'one-on-one';
  for (const k of Object.keys(weights) as ChanceType[]) {
    acc += weights[k];
    if (roll < acc) {
      picked = k;
      break;
    }
  }

  // Renormalize against the 4-4-2 baseline mean: redistribution, not inflation.
  const mixMean = meanMultiplier(weights);
  const conversionMultiplier = CONVERSION_MULTIPLIER[picked] / (mixMean / BASELINE_MEAN_MULTIPLIER);

  return { type: picked, conversionMultiplier };
}
