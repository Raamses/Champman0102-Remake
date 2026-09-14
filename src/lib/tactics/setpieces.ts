// @paths lib/tactics
import type { PlayerAttributes } from '../../engine/types';

interface RandomProvider {
  next(): number;
}

/**
 * Resolve a set piece outcome based on attacking/defending player attributes.
 * Returns outcome: 'goal' | 'save' | 'miss'.
 */
export function applySetPieceResolution(
  attackerAttr: PlayerAttributes,
  defenderAttr: PlayerAttributes[],
  keeperAttr: PlayerAttributes,
  rng: RandomProvider,
  setPieceType: 'corner' | 'freeKick' | 'throwIn'
): string {
  let baseConversion: number;

  if (setPieceType === 'freeKick') {
    baseConversion = (attackerAttr.freeKicks * 0.5 + attackerAttr.technique * 0.3 + attackerAttr.shooting * 0.2);
  } else if (setPieceType === 'corner') {
    baseConversion = (attackerAttr.heading * 0.5 + attackerAttr.strength * 0.3 + attackerAttr.acceleration * 0.2);
  } else {
    baseConversion = (attackerAttr.corners * 0.3 + attackerAttr.crossing * 0.4 + attackerAttr.passing * 0.3);
  }

  // Normalize to 0-1 scale (attributes are 1-20)
  baseConversion /= 20;

  // Defender pressure: average of nearby defenders' marking and tackling
  const avgDefense = defenderAttr.length > 0
    ? defenderAttr.reduce((sum, d) => sum + d.marking + d.tackling, 0) / (defenderAttr.length * 2)
    : 0;
  const defensePenalty = avgDefense / 40;

  // Keeper: handling + reflexes + oneOnOnes
  const keeperStrength = (keeperAttr.handling + keeperAttr.reflexes + keeperAttr.oneOnOnes) / 60;

  const effectiveRoll = Math.max(0, Math.min(1, baseConversion - defensePenalty + keeperStrength));
  const roll = rng.next();

  if (roll < effectiveRoll * 0.6) return 'goal';
  if (roll < effectiveRoll) return 'save';
  return 'miss';
}