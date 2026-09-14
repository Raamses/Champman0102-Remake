// @paths lib/tactics

export { type Tactic, getFormation, FORMATION_WEIGHTS, type FormationWeights } from './types';
export { calculateTacticAttackFactor, calculateTacticDefensePressure, calculateStaminaIntensity } from './modifiers';
export { applySetPieceResolution } from './setpieces';
export { substituteAI } from './substitutions';
