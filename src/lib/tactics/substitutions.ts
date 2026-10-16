// @paths lib/tactics
import type { PlayerState, TeamState } from '../../engine/types';

/**
 * Basic substitution AI — returns indices of the player to bring on and
 * the tired player to replace, or null if no substitution is warranted.
 *
 * CM-017: players sent off or substituted out have onPitch = false.
 */
export function substituteAI(
  team: Pick<TeamState, 'players' | 'goals'>,
  opponentGoals: number,
  minute: number
): { subInIdx: number; subOutIdx: number } | null {
  // Only substitute after minute 55 (early enough to matter)
  if (minute < 55) return null;

  const isOnPitch = (p: PlayerState) => p.onPitch ?? true;

  const tired = team.players
    .map((p, idx) => ({ p, idx }))
    .filter(x => x.p.stamina < 25 && !x.p.isInjured && !x.p.redCard && x.p.minutesPlayed > 50 && isOnPitch(x.p));

  if (tired.length === 0) return null;
  tired.sort((a, b) => a.p.stamina - b.p.stamina);

  // Bench = players who have not been on the pitch yet
  const bench = team.players
    .map((p, idx) => ({ p, idx }))
    .filter(x => x.p.minutesPlayed < 10 && !x.p.isInjured && !x.p.redCard && !isOnPitch(x.p));

  if (bench.length === 0) return null;

  for (const subOut of tired) {
    if (subOut.p.position === 'GK') {
      const subIn = bench.find(b => b.p.position === 'GK');
      if (subIn) return { subInIdx: subIn.idx, subOutIdx: subOut.idx };
    } else {
      const validBench = bench.filter(b => b.p.position !== 'GK');
      if (validBench.length === 0) continue;
      const preferred = team.goals < opponentGoals ? 'ATT' : team.goals > opponentGoals ? 'DEF' : null;
      const subIn = (preferred ? validBench.find(b => b.p.position === preferred) : undefined) ?? validBench[0];
      return { subInIdx: subIn.idx, subOutIdx: subOut.idx };
    }
  }
  return null;
}
