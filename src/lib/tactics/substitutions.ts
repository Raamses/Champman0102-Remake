// @paths lib/tactics
import type { PlayerState, TeamState } from '../../engine/types';

/**
 * Basic substitution AI — returns indices of the player to bring on and
 * the tired player to replace, or null if no substitution is warranted.
 */
export function substituteAI(
  team: Pick<TeamState, 'players' | 'goals'>,
  opponentGoals: number,
  minute: number
): { subInIdx: number; subOutIdx: number } | null {
  // Only substitute after minute 55 (early enough to matter)
  if (minute < 55) return null;

  const tired = team.players
    .map((p, idx) => ({ p, idx }))
    .filter(x => x.p.stamina < 25 && !x.p.isInjured && x.p.minutesPlayed > 50);

  if (tired.length === 0) return null;
  tired.sort((a, b) => a.p.stamina - b.p.stamina);

  // Bench = players who have not been on the pitch yet
  const bench = team.players
    .map((p, idx) => ({ p, idx }))
    .filter(x => x.p.minutesPlayed < 10);

  if (bench.length === 0) return null;

  const subOut = tired[0];

  // Context-aware selection:
  // trailing → attacker, leading → defender, level → first available
  const preferred = team.goals < opponentGoals ? 'ATT' : team.goals > opponentGoals ? 'DEF' : null;
  const subIn = (preferred ? bench.find(b => b.p.position === preferred) : undefined) ?? bench[0];

  return { subInIdx: subIn.idx, subOutIdx: subOut.idx };
}