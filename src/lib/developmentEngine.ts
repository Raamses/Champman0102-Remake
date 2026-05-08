import { Player } from '../types';

/**
 * DEVELOPMENT ENGINE
 * Logic for dynamic potential shifts in players.
 * 
 * Factors:
 * 1. Performance: Average match rating > 7.5 boosts potential growth.
 * 2. Age: 
 *    - 16-21: Rapid growth potential, max potential can shift upwards.
 *    - 22-28: Peak years, potential remains stable.
 *    - 29+: Natural decline starts, potential and rating drop.
 * 3. Injuries/Condition: Poor condition (< 80%) risks permanent potential drops.
 */

export const calculatePlayerDevelopment = (player: Player, matchRating: number): Partial<Player> => {
  const result: Partial<Player> = {};
  let newPotential = player.potential;
  let newRating = player.rating;

  // AGE-BASED MULTIPLIERS
  const ageFactor = player.age <= 21 ? 1.5 : player.age <= 28 ? 1.0 : 0.5;

  // 1. PERFORMANCE IMPACT
  if (matchRating >= 8.0) {
    // Exceptional performance - Composure boost
    const composureBonus = player.stats.composure / 100;
    const growth = (0.2 + (0.1 * composureBonus)) * ageFactor;
    newPotential = Math.min(player.maxPotential, player.potential + growth);
    
    // Rating catch-up
    if (newPotential > newRating) {
      newRating = Math.min(newPotential, newRating + (0.1 * ageFactor));
    }
    result.developmentTrend = 'rising';
  } else if (matchRating <= 5.5) {
    // Poor performance
    newPotential = Math.max(player.rating, player.potential - 0.1);
    result.developmentTrend = 'declining';
  }

  // 2. AGING DECLINE (Start after 29)
  if (player.age >= 29) {
    const decline = (player.age - 28) * 0.05;
    newRating = Math.max(40, newRating - decline);
    newPotential = Math.max(newRating, newPotential - decline);
    result.developmentTrend = 'declining';
  }

  // 3. CONDITION IMPACT - Stamina reduces breakdown risk
  if (player.condition < 80) {
    const breakdownRisk = 0.05 * (1 - (player.stats.stamina / 100));
    if (Math.random() < breakdownRisk) { 
      newPotential = Math.max(player.rating, newPotential - 0.5);
    }
  }

  // 4. POTENTIAL LIMITS
  // Small chance for "late bloomers" or "wonderkids" to increase their Max Potential
  if (player.age <= 23 && matchRating >= 8.5 && Math.random() > 0.98) {
    result.maxPotential = player.maxPotential + 1;
  }

  return {
    ...result,
    potential: Number(newPotential.toFixed(2)),
    rating: Number(newRating.toFixed(2))
  };
};
