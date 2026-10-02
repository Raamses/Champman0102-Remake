// CM-022a golden/characterization tests — the executable reconciliation spec.
//
// Pins CURRENT production behavior: engine src/engine/matchEngine.ts driving the
// production renderer src/lib/commentary (the path src/store/matchStore uses).
// The dead second implementation src/engine/commentary.ts is never imported.
//
// This file intentionally pins suspicious behavior AS-IS — never "fix" here.
//
// DIVERGENCE LEDGER (binding for split PRs B-E): an intentional behavior change
// flips exactly ONE pinned assertion and is listed in that PR's description —
// see docs/vault/cards/cm-022a-golden-tests.md. Any other changed assertion is
// a regression or an undisclosed change.
//
// PINNED-BEHAVIOR (potential bug — address in split PR D/E): the constructor
// overrides baseConversionRate to 0.12/0.9 ≈ 0.1333 when unspecified — the
// effective default differs from DEFAULT_MATCH_CONFIG.baseConversionRate (0.13).
// PINNED-BEHAVIOR (potential bug — address in split PR D/E): the set-piece taker
// is ranked on corners/freeKicks only (the setPieces attribute is unused) over
// an on-pitch pool that includes the goalkeeper.

import { describe, expect, it } from 'vitest';
import {
  countBy, pinEvents, pinLines, renderPinned, runMatch,
  type PinnedEvent, type PinnedLine,
} from './golden.helpers';

// --- Pinned event streams (canonical fixture, default config) ---

const EVENTS_41: PinnedEvent[] = [
  { minute: 2, type: 'foul', team: 'home', playerId: 3, playerName: 'Home FC D2' },
  { minute: 3, type: 'foul', team: 'away', playerId: 11, playerName: 'Away FC A3' },
  { minute: 3, type: 'yellow', team: 'home', playerId: 4 },
  // PINNED-BEHAVIOR (potential bug — address in split PR D/E): recovered=false
  // leaves isInjured=false ("stays on, flagged in commentary only" — the flag
  // semantics look inverted); recovered=true keeps isInjured=true.
  { minute: 3, type: 'injury', team: 'away', playerId: 10, recovered: false },
  { minute: 6, type: 'foul', team: 'away', playerId: 2, playerName: 'Away FC D1' },
  { minute: 8, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 8, type: 'offside', team: 'away', playerId: 10, playerName: 'Away FC A2' },
  { minute: 10, type: 'foul', team: 'away', playerId: 10, playerName: 'Away FC A2' },
  { minute: 11, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 12, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 12, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 13, type: 'chance', team: 'away', playerId: 10, chanceType: 'one-on-one' },
  { minute: 13, type: 'miss', team: 'away', playerId: 10, chanceType: 'one-on-one' },
  { minute: 13, type: 'yellow', team: 'home', playerId: 8 },
  // PINNED-BEHAVIOR: red cards are second-yellow only (no straight reds); the
  // sent-off player leaves the pitch (onPitch=false) and every later pinned
  // event reflects the 10-man team.
  { minute: 15, type: 'red', team: 'home', playerId: 4, secondYellow: true },
  // PINNED-BEHAVIOR: keeperId is the real opposing keeper here (this penalty
  // predates the min-77 substitution).
  { minute: 17, type: 'penalty', team: 'home', playerId: 6, keeperId: 1, playerName: 'Home FC M1' },
  { minute: 17, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 21, type: 'yellow', team: 'away', playerId: 5 },
  { minute: 23, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 23, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 25, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 26, type: 'chance', team: 'away', playerId: 11, chanceType: 'header' },
  { minute: 26, type: 'miss', team: 'away', playerId: 11, chanceType: 'header' },
  { minute: 26, type: 'foul', team: 'home', playerId: 3, playerName: 'Home FC D2' },
  { minute: 27, type: 'foul', team: 'away', playerId: 11, playerName: 'Away FC A3' },
  { minute: 34, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 34, type: 'miss', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 35, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 35, type: 'goal', team: 'away', playerId: 1, setPiece: 'corner', keeperId: 1, playerName: 'Away FC GK' },
  { minute: 39, type: 'chance', team: 'away', playerId: 11, chanceType: 'one-on-one' },
  { minute: 39, type: 'save', team: 'away', playerId: 11, chanceType: 'one-on-one', keeperId: 1 },
  { minute: 42, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 45, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 45, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 47, type: 'foul', team: 'away', playerId: 7, playerName: 'Away FC M2' },
  { minute: 52, type: 'chance', team: 'away', playerId: 10, chanceType: 'long-shot' },
  { minute: 52, type: 'save', team: 'away', playerId: 10, chanceType: 'long-shot', keeperId: 1 },
  { minute: 52, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 55, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 56, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 56, type: 'miss', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 58, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 60, type: 'foul', team: 'home', playerId: 5, playerName: 'Home FC D4' },
  { minute: 64, type: 'chance', team: 'away', playerId: 11, chanceType: 'through-ball' },
  { minute: 64, type: 'save', team: 'away', playerId: 11, chanceType: 'through-ball', keeperId: 1 },
  { minute: 67, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 67, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 74, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 77, type: 'chance', team: 'away', playerId: 9, chanceType: 'one-on-one' },
  { minute: 77, type: 'save', team: 'away', playerId: 9, chanceType: 'one-on-one', keeperId: 1 },
  { minute: 77, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  // PINNED-BEHAVIOR (potential bug — address in split PR D/E): updateStamina has
  // no RNG, so with the uniform fixture every match subs at minutes 77/77/78/78/
  // 79/79 and the FIRST sub removes the GOALKEEPER (stable sort picks index 0)
  // with no keeper replacement. From min 77 the team has no on-pitch GK, so
  // penalty/own-goal resolution falls back to the first on-pitch outfield
  // player as "keeper". sub-event playerId = the INCOMING player (R4 flip);
  // subInId/subOutId/name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 12, subInId: 12, subOutId: 1, playerName: 'Home FC S1', subInName: 'Home FC S1', subOutName: 'Home FC GK' },
  { minute: 77, type: 'sub', team: 'away', playerId: 12, subInId: 12, subOutId: 1, playerName: 'Away FC S1', subInName: 'Away FC S1', subOutName: 'Away FC GK' },
  { minute: 78, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 78, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 13, subInId: 13, subOutId: 2, playerName: 'Home FC S2', subInName: 'Home FC S2', subOutName: 'Home FC D1' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 13, subInId: 13, subOutId: 2, playerName: 'Away FC S2', subInName: 'Away FC S2', subOutName: 'Away FC D1' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 14, subInId: 14, subOutId: 3, playerName: 'Home FC S3', subInName: 'Home FC S3', subOutName: 'Home FC D2' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 14, subInId: 14, subOutId: 3, playerName: 'Away FC S3', subInName: 'Away FC S3', subOutName: 'Away FC D2' },
  { minute: 81, type: 'corner', team: 'away', playerId: 12, setPiece: 'corner', playerName: 'Away FC S1' },
  { minute: 81, type: 'miss', team: 'away', playerId: 12, setPiece: 'corner', keeperId: 12, playerName: 'Away FC S1' },
  { minute: 85, type: 'foul', team: 'home', playerId: 14, playerName: 'Home FC S3' },
  { minute: 86, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 87, type: 'foul', team: 'away', playerId: 6, playerName: 'Away FC M1' },
  { minute: 89, type: 'chance', team: 'home', playerId: 9, chanceType: 'cross' },
  { minute: 89, type: 'goal', team: 'home', playerId: 9, assistId: 7, chanceType: 'cross' },
  { minute: 89, type: 'freeKick', team: 'home', playerId: 12, setPiece: 'freeKick', playerName: 'Home FC S1' },
  { minute: 89, type: 'miss', team: 'home', playerId: 12, setPiece: 'freeKick', keeperId: 12, playerName: 'Home FC S1' },
  { minute: 90, type: 'chance', team: 'away', playerId: 11, chanceType: 'through-ball' },
  { minute: 90, type: 'save', team: 'away', playerId: 11, chanceType: 'through-ball', keeperId: 12 },
];

const EVENTS_149: PinnedEvent[] = [
  { minute: 2, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 2, type: 'miss', team: 'away', playerId: 1, setPiece: 'corner', keeperId: 1, playerName: 'Away FC GK' },
  { minute: 3, type: 'freeKick', team: 'away', playerId: 1, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 6, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 7, type: 'freeKick', team: 'away', playerId: 1, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 8, type: 'yellow', team: 'away', playerId: 11 },
  { minute: 12, type: 'chance', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 12, type: 'miss', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 13, type: 'chance', team: 'away', playerId: 11, chanceType: 'header' },
  { minute: 13, type: 'miss', team: 'away', playerId: 11, chanceType: 'header' },
  { minute: 13, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 13, type: 'freeKick', team: 'away', playerId: 1, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 16, type: 'offside', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 17, type: 'foul', team: 'home', playerId: 6, playerName: 'Home FC M1' },
  { minute: 20, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 20, type: 'foul', team: 'home', playerId: 5, playerName: 'Home FC D4' },
  { minute: 23, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 23, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 23, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 23, type: 'foul', team: 'home', playerId: 2, playerName: 'Home FC D1' },
  { minute: 25, type: 'foul', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 26, type: 'chance', team: 'away', playerId: 10, chanceType: 'cross' },
  { minute: 26, type: 'miss', team: 'away', playerId: 10, chanceType: 'cross' },
  { minute: 27, type: 'foul', team: 'away', playerId: 2, playerName: 'Away FC D1' },
  { minute: 33, type: 'foul', team: 'away', playerId: 1, playerName: 'Away FC GK' },
  { minute: 34, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 34, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 38, type: 'yellow', team: 'away', playerId: 10 },
  { minute: 39, type: 'chance', team: 'away', playerId: 10, chanceType: 'cross' },
  { minute: 39, type: 'save', team: 'away', playerId: 10, chanceType: 'cross', keeperId: 1 },
  { minute: 40, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 40, type: 'foul', team: 'home', playerId: 4, playerName: 'Home FC D3' },
  { minute: 45, type: 'chance', team: 'home', playerId: 10, chanceType: 'header' },
  { minute: 45, type: 'save', team: 'home', playerId: 10, chanceType: 'header', keeperId: 1 },
  { minute: 45, type: 'offside', team: 'away', playerId: 11, playerName: 'Away FC A3' },
  { minute: 50, type: 'freeKick', team: 'away', playerId: 1, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 52, type: 'chance', team: 'away', playerId: 10, chanceType: 'through-ball' },
  { minute: 52, type: 'miss', team: 'away', playerId: 10, chanceType: 'through-ball' },
  { minute: 53, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 56, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 56, type: 'save', team: 'home', playerId: 9, chanceType: 'header', keeperId: 1 },
  { minute: 58, type: 'injury', team: 'away', playerId: 4, recovered: false },
  { minute: 64, type: 'chance', team: 'away', playerId: 11, chanceType: 'cross' },
  { minute: 64, type: 'miss', team: 'away', playerId: 11, chanceType: 'cross' },
  { minute: 65, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 65, type: 'goal', team: 'home', playerId: 1, setPiece: 'freeKick', keeperId: 1, playerName: 'Home FC GK' },
  { minute: 66, type: 'yellow', team: 'home', playerId: 11 },
  { minute: 67, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 67, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 71, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 71, type: 'yellow', team: 'home', playerId: 7 },
  { minute: 71, type: 'injury', team: 'away', playerId: 4, recovered: true },
  // PINNED-BEHAVIOR: keeperId is the real opposing keeper here (pre-sub).
  { minute: 72, type: 'penalty', team: 'home', playerId: 6, keeperId: 1, playerName: 'Home FC M1' },
  { minute: 74, type: 'foul', team: 'home', playerId: 4, playerName: 'Home FC D3' },
  { minute: 75, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 75, type: 'miss', team: 'home', playerId: 1, setPiece: 'corner', keeperId: 1, playerName: 'Home FC GK' },
  { minute: 77, type: 'chance', team: 'away', playerId: 9, chanceType: 'cross' },
  { minute: 77, type: 'miss', team: 'away', playerId: 9, chanceType: 'cross' },
  // PINNED-BEHAVIOR (potential bug — address in split PR D/E): updateStamina has
  // no RNG, so with the uniform fixture every match subs at minutes 77/77/78/78/
  // 79/79 and the FIRST sub removes the GOALKEEPER (stable sort picks index 0)
  // with no keeper replacement. From min 77 the team has no on-pitch GK, so
  // penalty/own-goal resolution falls back to the first on-pitch outfield
  // player as "keeper". sub-event playerId = the INCOMING player (R4 flip);
  // subInId/subOutId/name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 12, subInId: 12, subOutId: 1, playerName: 'Home FC S1', subInName: 'Home FC S1', subOutName: 'Home FC GK' },
  { minute: 77, type: 'sub', team: 'away', playerId: 14, subInId: 14, subOutId: 1, playerName: 'Away FC S3', subInName: 'Away FC S3', subOutName: 'Away FC GK' },
  { minute: 78, type: 'chance', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 78, type: 'save', team: 'home', playerId: 10, chanceType: 'cross', keeperId: 14 },
  { minute: 78, type: 'corner', team: 'away', playerId: 14, setPiece: 'corner', playerName: 'Away FC S3' },
  { minute: 78, type: 'freeKick', team: 'away', playerId: 14, setPiece: 'freeKick', playerName: 'Away FC S3' },
  { minute: 78, type: 'save', team: 'away', playerId: 14, setPiece: 'freeKick', keeperId: 12, playerName: 'Away FC S3' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 13, subInId: 13, subOutId: 2, playerName: 'Home FC S2', subInName: 'Home FC S2', subOutName: 'Home FC D1' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 12, subInId: 12, subOutId: 2, playerName: 'Away FC S1', subInName: 'Away FC S1', subOutName: 'Away FC D1' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 14, subInId: 14, subOutId: 3, playerName: 'Home FC S3', subInName: 'Home FC S3', subOutName: 'Home FC D2' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 13, subInId: 13, subOutId: 3, playerName: 'Away FC S2', subInName: 'Away FC S2', subOutName: 'Away FC D2' },
  { minute: 84, type: 'offside', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 86, type: 'foul', team: 'away', playerId: 5, playerName: 'Away FC D4' },
  { minute: 89, type: 'chance', team: 'home', playerId: 11, chanceType: 'header' },
  { minute: 89, type: 'save', team: 'home', playerId: 11, chanceType: 'header', keeperId: 14 },
  { minute: 90, type: 'chance', team: 'away', playerId: 10, chanceType: 'header' },
  { minute: 90, type: 'miss', team: 'away', playerId: 10, chanceType: 'header' },
  // PINNED-BEHAVIOR (potential bug — address in split PR D/E): the taker is a
  // substitute and the "keeper" (keeperId=14) is the outfield fallback — the
  // real GK was substituted at min 77 with no replacement.
  { minute: 90, type: 'missedPenalty', team: 'home', playerId: 13, keeperId: 14, playerName: 'Home FC S2' },
];

const EVENTS_686: PinnedEvent[] = [
  { minute: 1, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 1, type: 'offside', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 3, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  // PINNED-BEHAVIOR: all six injuries in this stream have recovered=true
  // (isInjured stays true — see the injury-flag note in the seed-41 stream).
  { minute: 3, type: 'injury', team: 'away', playerId: 7, recovered: true },
  { minute: 6, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 9, type: 'freeKick', team: 'away', playerId: 1, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 12, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 12, type: 'save', team: 'home', playerId: 11, chanceType: 'cross', keeperId: 1 },
  { minute: 12, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 13, type: 'chance', team: 'away', playerId: 11, chanceType: 'header' },
  { minute: 13, type: 'miss', team: 'away', playerId: 11, chanceType: 'header' },
  { minute: 15, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 15, type: 'freeKick', team: 'away', playerId: 1, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 15, type: 'offside', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 18, type: 'injury', team: 'home', playerId: 5, recovered: true },
  { minute: 19, type: 'foul', team: 'home', playerId: 8, playerName: 'Home FC M3' },
  { minute: 23, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 23, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 23, type: 'offside', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 26, type: 'chance', team: 'away', playerId: 10, chanceType: 'one-on-one' },
  { minute: 26, type: 'miss', team: 'away', playerId: 10, chanceType: 'one-on-one' },
  { minute: 27, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 27, type: 'foul', team: 'home', playerId: 7, playerName: 'Home FC M2' },
  { minute: 30, type: 'foul', team: 'away', playerId: 3, playerName: 'Away FC D2' },
  { minute: 34, type: 'chance', team: 'home', playerId: 11, chanceType: 'through-ball' },
  { minute: 34, type: 'save', team: 'home', playerId: 11, chanceType: 'through-ball', keeperId: 1 },
  { minute: 34, type: 'foul', team: 'home', playerId: 7, playerName: 'Home FC M2' },
  { minute: 38, type: 'foul', team: 'home', playerId: 3, playerName: 'Home FC D2' },
  { minute: 39, type: 'chance', team: 'away', playerId: 9, chanceType: 'long-shot' },
  { minute: 39, type: 'save', team: 'away', playerId: 9, chanceType: 'long-shot', keeperId: 1 },
  { minute: 39, type: 'injury', team: 'home', playerId: 10, recovered: true },
  { minute: 43, type: 'foul', team: 'away', playerId: 7, playerName: 'Away FC M2' },
  { minute: 45, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 45, type: 'miss', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  // PINNED-BEHAVIOR: keeperId is the real opposing keeper here (pre-sub).
  { minute: 48, type: 'penalty', team: 'away', playerId: 6, keeperId: 1, playerName: 'Away FC M1' },
  { minute: 52, type: 'chance', team: 'away', playerId: 11, chanceType: 'header' },
  { minute: 52, type: 'miss', team: 'away', playerId: 11, chanceType: 'header' },
  { minute: 54, type: 'injury', team: 'home', playerId: 9, recovered: true },
  { minute: 56, type: 'chance', team: 'home', playerId: 9, chanceType: 'cross' },
  { minute: 56, type: 'save', team: 'home', playerId: 9, chanceType: 'cross', keeperId: 1 },
  { minute: 56, type: 'foul', team: 'away', playerId: 7, playerName: 'Away FC M2' },
  { minute: 58, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 64, type: 'chance', team: 'away', playerId: 10, chanceType: 'through-ball' },
  { minute: 64, type: 'miss', team: 'away', playerId: 10, chanceType: 'through-ball' },
  { minute: 65, type: 'foul', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 67, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 67, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 68, type: 'corner', team: 'away', playerId: 1, setPiece: 'corner', playerName: 'Away FC GK' },
  // PINNED-BEHAVIOR: ownGoal — team/playerId describe the victim side;
  // creditTeam carries the beneficiary (the renderer reconciles the
  // scoreline from creditTeam).
  { minute: 69, type: 'ownGoal', team: 'away', playerId: 5, creditTeam: 'home', playerName: 'Away FC D4' },
  { minute: 70, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 70, type: 'goal', team: 'home', playerId: 1, setPiece: 'freeKick', keeperId: 1, playerName: 'Home FC GK' },
  { minute: 72, type: 'foul', team: 'home', playerId: 4, playerName: 'Home FC D3' },
  { minute: 72, type: 'yellow', team: 'home', playerId: 5 },
  { minute: 75, type: 'freeKick', team: 'away', playerId: 1, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 76, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 76, type: 'foul', team: 'away', playerId: 11, playerName: 'Away FC A3' },
  { minute: 77, type: 'chance', team: 'away', playerId: 10, chanceType: 'through-ball' },
  { minute: 77, type: 'miss', team: 'away', playerId: 10, chanceType: 'through-ball' },
  { minute: 77, type: 'injury', team: 'home', playerId: 6, recovered: true },
  // PINNED-BEHAVIOR (potential bug — address in split PR D/E): updateStamina has
  // no RNG, so with the uniform fixture every match subs at minutes 77/77/78/78/
  // 79/79 and the FIRST sub removes the GOALKEEPER (stable sort picks index 0)
  // with no keeper replacement. From min 77 the team has no on-pitch GK, so
  // penalty/own-goal resolution falls back to the first on-pitch outfield
  // player as "keeper". sub-event playerId = the INCOMING player (R4 flip);
  // subInId/subOutId/name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 12, subInId: 12, subOutId: 1, playerName: 'Home FC S1', subInName: 'Home FC S1', subOutName: 'Home FC GK' },
  { minute: 77, type: 'sub', team: 'away', playerId: 14, subInId: 14, subOutId: 1, playerName: 'Away FC S3', subInName: 'Away FC S3', subOutName: 'Away FC GK' },
  { minute: 78, type: 'chance', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 78, type: 'save', team: 'home', playerId: 9, chanceType: 'through-ball', keeperId: 14 },
  { minute: 78, type: 'freeKick', team: 'home', playerId: 12, setPiece: 'freeKick', playerName: 'Home FC S1' },
  { minute: 78, type: 'miss', team: 'home', playerId: 12, setPiece: 'freeKick', keeperId: 14, playerName: 'Home FC S1' },
  { minute: 78, type: 'injury', team: 'away', playerId: 10, recovered: true },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 13, subInId: 13, subOutId: 2, playerName: 'Home FC S2', subInName: 'Home FC S2', subOutName: 'Home FC D1' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 12, subInId: 12, subOutId: 2, playerName: 'Away FC S1', subInName: 'Away FC S1', subOutName: 'Away FC D1' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 14, subInId: 14, subOutId: 3, playerName: 'Home FC S3', subInName: 'Home FC S3', subOutName: 'Home FC D2' },
  // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 13, subInId: 13, subOutId: 3, playerName: 'Away FC S2', subInName: 'Away FC S2', subOutName: 'Away FC D2' },
  { minute: 80, type: 'foul', team: 'home', playerId: 6, playerName: 'Home FC M1' },
  { minute: 84, type: 'yellow', team: 'home', playerId: 12 },
  { minute: 87, type: 'yellow', team: 'away', playerId: 6 },
  { minute: 89, type: 'chance', team: 'home', playerId: 11, chanceType: 'through-ball' },
  { minute: 89, type: 'save', team: 'home', playerId: 11, chanceType: 'through-ball', keeperId: 14 },
  { minute: 90, type: 'chance', team: 'away', playerId: 14, chanceType: 'header' },
  { minute: 90, type: 'miss', team: 'away', playerId: 14, chanceType: 'header' },
];

// --- Pinned rendered-line routing (production renderer, en) ---

const RENDERED_41: PinnedLine[] = [
  { minute: 0, key: 'kickoff', type: 'chance', team: 'home' },
  { minute: 2, key: 'foul', type: 'foul', team: 'home' },
  { minute: 3, key: 'foul', type: 'foul', team: 'away' },
  { minute: 3, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 3, key: 'injury', type: 'injury', team: 'away' },
  { minute: 6, key: 'foul', type: 'foul', team: 'away' },
  { minute: 8, key: 'corner', type: 'corner', team: 'home' },
  { minute: 8, key: 'offside', type: 'offside', team: 'away' },
  { minute: 10, key: 'foul', type: 'foul', team: 'away' },
  { minute: 11, key: 'corner', type: 'corner', team: 'home' },
  { minute: 12, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 12, key: 'miss.cross', type: 'miss', team: 'home' },
  { minute: 13, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 13, key: 'miss.one-on-one', type: 'miss', team: 'away' },
  { minute: 13, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 15, key: 'second-yellow', type: 'red', team: 'home' },
  { minute: 17, key: 'penalty', type: 'penalty', team: 'home' },
  { minute: 17, key: 'foul', type: 'foul', team: 'home' },
  { minute: 21, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 23, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 23, key: 'miss.cross', type: 'miss', team: 'home' },
  { minute: 25, key: 'corner', type: 'corner', team: 'away' },
  { minute: 26, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 26, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 26, key: 'foul', type: 'foul', team: 'home' },
  { minute: 27, key: 'foul', type: 'foul', team: 'away' },
  { minute: 34, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 34, key: 'miss.one-on-one', type: 'miss', team: 'home' },
  { minute: 35, key: 'corner', type: 'corner', team: 'away' },
  { minute: 35, key: 'setpiece.goal', type: 'goal', team: 'away' },
  { minute: 39, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 39, key: 'save.one-on-one', type: 'save', team: 'away' },
  { minute: 42, key: 'foul', type: 'foul', team: 'home' },
  { minute: 45, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 45, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 47, key: 'foul', type: 'foul', team: 'away' },
  { minute: 52, key: 'chance.long-shot', type: 'chance', team: 'away' },
  { minute: 52, key: 'save.long-shot', type: 'save', team: 'away' },
  { minute: 52, key: 'corner', type: 'corner', team: 'home' },
  { minute: 55, key: 'corner', type: 'corner', team: 'home' },
  { minute: 56, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 56, key: 'miss.one-on-one', type: 'miss', team: 'home' },
  { minute: 58, key: 'corner', type: 'corner', team: 'home' },
  { minute: 60, key: 'foul', type: 'foul', team: 'home' },
  { minute: 64, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 64, key: 'save.through-ball', type: 'save', team: 'away' },
  { minute: 67, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 67, key: 'miss.header', type: 'miss', team: 'home' },
  { minute: 74, key: 'corner', type: 'corner', team: 'home' },
  { minute: 77, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 77, key: 'save.one-on-one', type: 'save', team: 'away' },
  { minute: 77, key: 'corner', type: 'corner', team: 'away' },
  { minute: 77, key: 'sub', type: 'sub', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'away' },
  { minute: 78, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 78, key: 'miss.header', type: 'miss', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'away' },
  { minute: 79, key: 'sub', type: 'sub', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'away' },
  { minute: 81, key: 'corner', type: 'corner', team: 'away' },
  { minute: 81, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 85, key: 'foul', type: 'foul', team: 'home' },
  { minute: 86, key: 'foul', type: 'foul', team: 'home' },
  { minute: 87, key: 'foul', type: 'foul', team: 'away' },
  { minute: 89, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 89, key: 'assist', type: 'assist', team: 'home' },
  { minute: 89, key: 'goal.cross', type: 'goal', team: 'home' },
  { minute: 89, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 89, key: 'setpiece.miss', type: 'miss', team: 'home' },
  { minute: 90, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 90, key: 'save.through-ball', type: 'save', team: 'away' },
  { minute: 90, key: 'full-time', type: 'chance', team: 'home' },
];

const RENDERED_149: PinnedLine[] = [
  { minute: 0, key: 'kickoff', type: 'chance', team: 'home' },
  { minute: 2, key: 'corner', type: 'corner', team: 'away' },
  { minute: 2, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 3, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 6, key: 'corner', type: 'corner', team: 'away' },
  { minute: 7, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 8, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 12, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 12, key: 'miss.cross', type: 'miss', team: 'home' },
  { minute: 13, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 13, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 13, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 13, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 16, key: 'offside', type: 'offside', team: 'home' },
  { minute: 17, key: 'foul', type: 'foul', team: 'home' },
  { minute: 20, key: 'corner', type: 'corner', team: 'away' },
  { minute: 20, key: 'foul', type: 'foul', team: 'home' },
  { minute: 23, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 23, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 23, key: 'corner', type: 'corner', team: 'home' },
  { minute: 23, key: 'foul', type: 'foul', team: 'home' },
  { minute: 25, key: 'foul', type: 'foul', team: 'home' },
  { minute: 26, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 26, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 27, key: 'foul', type: 'foul', team: 'away' },
  { minute: 33, key: 'foul', type: 'foul', team: 'away' },
  { minute: 34, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 34, key: 'miss.header', type: 'miss', team: 'home' },
  { minute: 38, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 39, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 39, key: 'save.cross', type: 'save', team: 'away' },
  { minute: 40, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 40, key: 'foul', type: 'foul', team: 'home' },
  { minute: 45, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 45, key: 'save.header', type: 'save', team: 'home' },
  { minute: 45, key: 'offside', type: 'offside', team: 'away' },
  { minute: 50, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 52, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 52, key: 'miss.through-ball', type: 'miss', team: 'away' },
  { minute: 53, key: 'corner', type: 'corner', team: 'home' },
  { minute: 56, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 56, key: 'save.header', type: 'save', team: 'home' },
  { minute: 58, key: 'injury', type: 'injury', team: 'away' },
  { minute: 64, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 64, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 65, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 65, key: 'setpiece.goal', type: 'goal', team: 'home' },
  { minute: 66, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 67, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 67, key: 'miss.cross', type: 'miss', team: 'home' },
  { minute: 71, key: 'corner', type: 'corner', team: 'away' },
  { minute: 71, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 71, key: 'injury.recovers', type: 'injury', team: 'away' },
  { minute: 72, key: 'penalty', type: 'penalty', team: 'home' },
  { minute: 74, key: 'foul', type: 'foul', team: 'home' },
  { minute: 75, key: 'corner', type: 'corner', team: 'home' },
  { minute: 75, key: 'setpiece.miss', type: 'miss', team: 'home' },
  { minute: 77, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 77, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 77, key: 'sub', type: 'sub', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'away' },
  { minute: 78, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 78, key: 'save.cross', type: 'save', team: 'home' },
  { minute: 78, key: 'corner', type: 'corner', team: 'away' },
  { minute: 78, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 78, key: 'setpiece.save', type: 'save', team: 'away' },
  { minute: 78, key: 'sub', type: 'sub', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'away' },
  { minute: 79, key: 'sub', type: 'sub', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'away' },
  { minute: 84, key: 'offside', type: 'offside', team: 'home' },
  { minute: 86, key: 'foul', type: 'foul', team: 'away' },
  { minute: 89, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 89, key: 'save.header', type: 'save', team: 'home' },
  { minute: 90, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 90, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 90, key: 'missedPenalty', type: 'missedPenalty', team: 'home' },
  { minute: 90, key: 'full-time', type: 'chance', team: 'home' },
];

const RENDERED_686: PinnedLine[] = [
  { minute: 0, key: 'kickoff', type: 'chance', team: 'home' },
  { minute: 1, key: 'corner', type: 'corner', team: 'home' },
  { minute: 1, key: 'offside', type: 'offside', team: 'home' },
  { minute: 3, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 3, key: 'injury.recovers', type: 'injury', team: 'away' },
  { minute: 6, key: 'corner', type: 'corner', team: 'away' },
  { minute: 9, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 12, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 12, key: 'save.cross', type: 'save', team: 'home' },
  { minute: 12, key: 'corner', type: 'corner', team: 'home' },
  { minute: 13, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 13, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 15, key: 'corner', type: 'corner', team: 'home' },
  { minute: 15, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 15, key: 'offside', type: 'offside', team: 'home' },
  { minute: 18, key: 'injury.recovers', type: 'injury', team: 'home' },
  { minute: 19, key: 'foul', type: 'foul', team: 'home' },
  { minute: 23, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 23, key: 'miss.cross', type: 'miss', team: 'home' },
  { minute: 23, key: 'offside', type: 'offside', team: 'home' },
  { minute: 26, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 26, key: 'miss.one-on-one', type: 'miss', team: 'away' },
  { minute: 27, key: 'corner', type: 'corner', team: 'home' },
  { minute: 27, key: 'foul', type: 'foul', team: 'home' },
  { minute: 30, key: 'foul', type: 'foul', team: 'away' },
  { minute: 34, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 34, key: 'save.through-ball', type: 'save', team: 'home' },
  { minute: 34, key: 'foul', type: 'foul', team: 'home' },
  { minute: 38, key: 'foul', type: 'foul', team: 'home' },
  { minute: 39, key: 'chance.long-shot', type: 'chance', team: 'away' },
  { minute: 39, key: 'save.long-shot', type: 'save', team: 'away' },
  { minute: 39, key: 'injury.recovers', type: 'injury', team: 'home' },
  { minute: 43, key: 'foul', type: 'foul', team: 'away' },
  { minute: 45, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 45, key: 'miss.one-on-one', type: 'miss', team: 'home' },
  { minute: 48, key: 'penalty', type: 'penalty', team: 'away' },
  { minute: 52, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 52, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 54, key: 'injury.recovers', type: 'injury', team: 'home' },
  { minute: 56, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 56, key: 'save.cross', type: 'save', team: 'home' },
  { minute: 56, key: 'foul', type: 'foul', team: 'away' },
  { minute: 58, key: 'corner', type: 'corner', team: 'home' },
  { minute: 64, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 64, key: 'miss.through-ball', type: 'miss', team: 'away' },
  { minute: 65, key: 'foul', type: 'foul', team: 'home' },
  { minute: 67, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 67, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 68, key: 'corner', type: 'corner', team: 'away' },
  { minute: 69, key: 'ownGoal', type: 'ownGoal', team: 'away' },
  { minute: 70, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 70, key: 'setpiece.goal', type: 'goal', team: 'home' },
  { minute: 72, key: 'foul', type: 'foul', team: 'home' },
  { minute: 72, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 75, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 76, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 76, key: 'foul', type: 'foul', team: 'away' },
  { minute: 77, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 77, key: 'miss.through-ball', type: 'miss', team: 'away' },
  { minute: 77, key: 'injury.recovers', type: 'injury', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'away' },
  { minute: 78, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 78, key: 'save.through-ball', type: 'save', team: 'home' },
  { minute: 78, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 78, key: 'setpiece.miss', type: 'miss', team: 'home' },
  { minute: 78, key: 'injury.recovers', type: 'injury', team: 'away' },
  { minute: 78, key: 'sub', type: 'sub', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'away' },
  { minute: 79, key: 'sub', type: 'sub', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'away' },
  { minute: 80, key: 'foul', type: 'foul', team: 'home' },
  { minute: 84, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 87, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 89, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 89, key: 'save.through-ball', type: 'save', team: 'home' },
  { minute: 90, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 90, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 90, key: 'full-time', type: 'chance', team: 'home' },
];

describe('CM-022a golden — pinned match streams (default config)', () => {
  it('seed 41: 70-event stream — early second-yellow red (min 15) + 10-man ripple, penalty vs real keeper (min 17), set-piece goal from corner (min 35), open-play assist (min 89), non-recovered injury (min 3); final 2-1', () => {
    const { home, away, result } = runMatch(41);
    expect(pinEvents(result.events)).toEqual(EVENTS_41);
    expect([home.goals, away.goals]).toEqual([2, 1]);
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): possession in
    // result() is the share of the LEFTOVER CP accumulators (after chance
    // thresholds are subtracted), not total chance points — with the uniform
    // fixture it is seed-independent (always 70/30 here).
    expect([home.possession, away.possession]).toEqual([70, 30]);
  });

  it('seed 149: 76-event stream — converted penalty (min 72) AND missed penalty by a sub (min 90) with the outfield fallback "keeper", set-piece goal from free kick (min 65), set-piece save (min 78), recovered + non-recovered injuries; final 2-0', () => {
    const { home, away, result } = runMatch(149);
    expect(pinEvents(result.events)).toEqual(EVENTS_149);
    expect([home.goals, away.goals]).toEqual([2, 0]);
    // PINNED-BEHAVIOR: possession = leftover-CP share (see seed-41 note).
    expect([home.possession, away.possession]).toEqual([70, 30]);
  });

  it('seed 686: 77-event stream — own goal with creditTeam (min 69), converted penalty (min 48), six injuries all recovered, set-piece goal (min 70); final 2-1', () => {
    const { home, away, result } = runMatch(686);
    expect(pinEvents(result.events)).toEqual(EVENTS_686);
    expect([home.goals, away.goals]).toEqual([2, 1]);
    // PINNED-BEHAVIOR: possession = leftover-CP share (see seed-41 note).
    expect([home.possession, away.possession]).toEqual([70, 30]);
  });
});

describe('CM-022a golden — renderer seam (production renderer, en)', () => {
  it('seed 41: every event renders — exact key routing, no generic fallback, scoreline reconciles (73 lines)', () => {
    const { home, away, result } = runMatch(41);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(73); // 70 events + kickoff + full-time + 1 synthesized assist line
    expect(pinLines(lines)).toEqual(RENDERED_41);
    for (const line of lines) {
      expect(line.text).not.toMatch(/\{\w+\}/);
      expect(line.text).not.toContain('Unknown');
    }
    const fullTime = lines.find(l => l.key === 'full-time');
    expect(fullTime?.text).toBe('Full-time: Home FC 2-1 Away FC.');
  });

  it('seed 149: every event renders — exact key routing incl. missedPenalty + setpiece.save, no generic fallback (78 lines)', () => {
    const { home, away, result } = runMatch(149);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(78); // 76 events + kickoff + full-time, no assist lines
    expect(pinLines(lines)).toEqual(RENDERED_149);
    for (const line of lines) {
      expect(line.text).not.toMatch(/\{\w+\}/);
      expect(line.text).not.toContain('Unknown');
    }
    const fullTime = lines.find(l => l.key === 'full-time');
    expect(fullTime?.text).toBe('Full-time: Home FC 2-0 Away FC.');
  });

  it('seed 686: every event renders — exact key routing incl. ownGoal + injury.recovers, no generic fallback (79 lines)', () => {
    const { home, away, result } = runMatch(686);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(79); // 77 events + kickoff + full-time, no assist lines
    expect(pinLines(lines)).toEqual(RENDERED_686);
    for (const line of lines) {
      expect(line.text).not.toMatch(/\{\w+\}/);
      expect(line.text).not.toContain('Unknown');
    }
    const fullTime = lines.find(l => l.key === 'full-time');
    expect(fullTime?.text).toBe('Full-time: Home FC 2-1 Away FC.');
  });
});

describe('CM-022a golden — determinism', () => {
  it('same seed + fresh teams run twice → deep-equal full streams and scorelines (seeds 41, 149, 686)', () => {
    for (const seed of [41, 149, 686]) {
      const a = runMatch(seed);
      const b = runMatch(seed);
      expect(a.result.events).toEqual(b.result.events);
      expect([a.home.goals, a.away.goals]).toEqual([b.home.goals, b.away.goals]);
      expect([a.home.possession, a.away.possession]).toEqual([b.home.possession, b.away.possession]);
    }
  });
});

describe('CM-022a golden — pinned-seed inventory', () => {
  it('the three pinned streams cover every engine event type and extras family (sweep 0..999 recorded in the card)', () => {
    // Mandatory categories: corner / freeKick / penalty / red / sub (task spec).
    expect(countBy(EVENTS_41, 'corner')).toBeGreaterThan(0);
    expect(countBy(EVENTS_41, 'freeKick')).toBeGreaterThan(0);
    expect(countBy(EVENTS_41, 'penalty')).toBeGreaterThan(0);
    expect(countBy(EVENTS_41, 'red')).toBeGreaterThan(0);
    expect(countBy(EVENTS_41, 'sub')).toBeGreaterThan(0);
    // Rare categories deliberately covered: missedPenalty (149), ownGoal (686).
    expect(countBy(EVENTS_149, 'missedPenalty')).toBeGreaterThan(0);
    expect(countBy(EVENTS_686, 'ownGoal')).toBeGreaterThan(0);
    // Extras families across the union.
    const all = [...EVENTS_41, ...EVENTS_149, ...EVENTS_686];
    expect(all.some(e => e.chanceType !== undefined)).toBe(true);
    expect(all.some(e => e.type === 'goal' && e.setPiece !== undefined)).toBe(true);
    expect(all.some(e => e.type === 'save' && e.setPiece !== undefined)).toBe(true);
    expect(all.some(e => e.type === 'miss' && e.setPiece !== undefined)).toBe(true);
    expect(all.some(e => e.keeperId !== undefined)).toBe(true);
    expect(all.some(e => e.subInId !== undefined && e.subOutId !== undefined)).toBe(true);
    expect(all.some(e => e.secondYellow === true)).toBe(true);
    expect(all.some(e => e.recovered === true)).toBe(true);
    expect(all.some(e => e.recovered === false)).toBe(true);
    expect(all.some(e => e.creditTeam !== undefined)).toBe(true);
    expect(all.some(e => e.type === 'goal' && e.assistId !== undefined)).toBe(true);
    // Every engine-emitted event type appears across the union.
    for (const t of ['goal', 'yellow', 'red', 'injury', 'sub', 'chance', 'save', 'miss', 'corner', 'freeKick', 'penalty', 'missedPenalty', 'ownGoal', 'offside', 'foul'] as const) {
      expect(countBy(all, t)).toBeGreaterThan(0);
    }
  });
});
