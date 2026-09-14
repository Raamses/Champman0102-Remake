// @paths lib/tactics
import type { Tactic } from './types';
import { getFormation, FORMATION_WEIGHTS } from './types';

/**
 * Full multi-plane tactic attack factor combining ALL five dimensions.
 * Each dimension independently scales chance creation output.
 */
export function calculateTacticAttackFactor(tactic: Tactic): number {
  const mentalityMod = tactic.mentality === 'attacking' ? 1.3 :
                       tactic.mentality === 'defensive' ? 0.85 : 1.0;
  const tempoMod = tactic.tempo === 'fast' ? 1.15 :
                   tactic.tempo === 'slow' ? 0.9 : 1.0;
  const widthMod = tactic.width === 'wide' ? 1.1 :
                   tactic.width === 'narrow' ? 0.95 : 1.0;
  const passingMod = tactic.passing === 'long' ? 1.2 :
                     tactic.passing === 'short' ? 0.9 : 1.0;
  const pressingMod = tactic.pressing === 'high' ? 1.1 :
                      tactic.pressing === 'low' ? 0.9 : 1.0;

  // Combined attack factor — all five tactic dimensions
  // (formation influence is applied separately in calculateChancePoints)
  return mentalityMod * tempoMod * widthMod * passingMod * pressingMod;
}

/**
 * Defensive pressure applied by opponent's tactic against our team.
 * Returns a reduction factor on our chance creation probability.
 * E.g., return 0.85 means opponent reduces our chances by 15%.
 */
export function calculateTacticDefensePressure(opponentTactic: Tactic): number {
  const defensiveMentalityReduction = opponentTactic.mentality === 'defensive' ? 0.85 :
                                       opponentTactic.mentality === 'attacking' ? 1.05 : 1.0;
  const highPressReduction = opponentTactic.pressing === 'high' ? 0.90 : 1.0;

  // Opponent formation: extra-defensive shapes reduce us more
  const form = getFormation(opponentTactic.formation);
  const formationDefense = form.defenceMult < 0.9 ? 0.95 : 1.0;

  // Stack defensively: each factor independent
  return defensiveMentalityReduction * highPressReduction * formationDefense;
}

/**
 * Stamina intensity multiplier combining tempo and pressing multiplicatively.
 * Used in updateStamina() to scale player stamina decay.
 */
export function calculateStaminaIntensity(
  tempo: Tactic['tempo'],
  pressing: Tactic['pressing'],
  mentality: Tactic['mentality']
): number {
  const tempoMult = tempo === 'fast' ? 1.3 : 1.0;
  const pressingMult = pressing === 'high' ? 1.25 : 1.0;
  const mentalityExtra = mentality === 'attacking' ? 1.1 : 1.0;

  return tempoMult * pressingMult * mentalityExtra;
}
