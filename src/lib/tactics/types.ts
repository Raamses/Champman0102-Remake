// @paths lib/tactics

/** Tactic settings matching src/engine/types.ts Tactic */
export interface Tactic {
  formation: '4-4-2' | '4-3-3' | '3-5-2' | '4-5-1' | '5-3-2' | '3-4-3' | '5-4-1';
  mentality: 'attacking' | 'balanced' | 'defensive';
  tempo: 'slow' | 'normal' | 'fast';
  pressing: 'low' | 'normal' | 'high';
  width: 'narrow' | 'normal' | 'wide';
  passing: 'short' | 'mixed' | 'long';
}

/**
 * Formation defines relative contributions by position group.
 * Used by: calculateChancePoints (midfieldMult/attackMult blend),
 * calculateTacticDefensePressure (defenceMult).
 * crossFactor/throughBallBias/headerBias are reserved for chance-type
 * modeling (crosses vs through-balls vs headers) landing in CM-017.
 */
export interface FormationWeights {
  /** Multiplier for midfielders' chance contribution */
  midfieldMult: number;
  /** Multiplier for attackers' chance contribution */
  attackMult: number;
  /** Multiplier for defenders' defensive pressure contribution */
  defenceMult: number;
  /** Cross-frequency factor (wide formations generate more crosses) */
  crossFactor: number;
  /** Through-ball bias (narrow formations favor central through-balls) */
  throughBallBias: number;
  /** Header frequency (formations with more target men get more headers) */
  headerBias: number;
}

export const FORMATION_WEIGHTS: Record<string, FormationWeights> = {
  '4-4-2':     { midfieldMult: 1.0,  attackMult: 1.0,  defenceMult: 1.0, crossFactor: 1.0, throughBallBias: 0.9,  headerBias: 1.1 },
  '4-3-3':     { midfieldMult: 0.85, attackMult: 1.15, defenceMult: 0.9, crossFactor: 1.15, throughBallBias: 0.85, headerBias: 1.0 },
  '3-5-2':     { midfieldMult: 1.2,  attackMult: 0.95, defenceMult: 0.7, crossFactor: 1.0, throughBallBias: 1.1,  headerBias: 0.9 },
  '4-5-1':     { midfieldMult: 1.15, attackMult: 0.8,  defenceMult: 0.85, crossFactor: 0.9, throughBallBias: 1.0,  headerBias: 0.7 },
  '5-3-2':     { midfieldMult: 0.9,  attackMult: 0.95, defenceMult: 1.15, crossFactor: 0.85, throughBallBias: 0.95, headerBias: 0.9 },
  '3-4-3':     { midfieldMult: 0.9,  attackMult: 1.2,  defenceMult: 0.75, crossFactor: 1.2, throughBallBias: 0.8,  headerBias: 1.1 },
  '5-4-1':     { midfieldMult: 0.95, attackMult: 0.7,  defenceMult: 1.2, crossFactor: 0.7, throughBallBias: 0.7,  headerBias: 0.6 },
};

export function getFormation(formation: string): FormationWeights {
  return FORMATION_WEIGHTS[formation] || FORMATION_WEIGHTS['4-4-2'];
}
