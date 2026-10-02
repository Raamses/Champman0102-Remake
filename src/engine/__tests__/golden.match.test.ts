// CM-022a golden/characterization tests — the executable reconciliation spec.
//
// Pins CURRENT production behavior: engine src/engine/matchEngine.ts driving the
// production renderer src/lib/commentary (the path src/store/matchStore uses).
// The dead second implementation src/engine/commentary.ts is never imported.
//
// This file intentionally pins suspicious behavior AS-IS — never "fix" here.
//
// DIVERGENCE LEDGER (binding for split PRs B-E): every intentional behavior
// change is disclosed in that PR's description with exactly one ledger entry.
// Fine-grained unit pins (the set-piece grid below) flip 1:1 for targeted
// calibration changes (e.g. PR E's keeper term). Whole-stream literals are
// regenerated ONLY with a cited command plus an event-level summary of what
// changed and why; PR C (mechanical reconciliation) must leave every pinned
// assertion byte-identical. See docs/vault/cards/cm-022a-golden-tests.md.
//
// PINNED-BEHAVIOR (potential bug — address in split PR D/E): the constructor
// overrides baseConversionRate to 0.12/0.9 ≈ 0.1333 when unspecified — the
// effective default differs from DEFAULT_MATCH_CONFIG.baseConversionRate (0.13).
// PINNED-BEHAVIOR (potential bug — address in split PR D/E): the set-piece taker
// is ranked on corners/freeKicks only (the setPieces attribute is unused) over an
// on-pitch pool that includes the goalkeeper.

import { describe, expect, it } from 'vitest';
import {
  buildRenderContext, countBy, createAttributes, pinEvents, pinLines, pinState,
  renderPinned, runAsymMatch, runMatch,
  type PinnedEvent, type PinnedLine,
} from './golden.helpers';
import { STRINGS } from '../../lib/commentary/strings';
import { applySetPieceResolution } from '../../lib/tactics/setpieces';

// --- Pinned event streams (canonical fixtures, default config) ---

const EVENTS_41: PinnedEvent[] = [
  { minute: 2, type: 'foul', team: 'home', playerId: 3, playerName: 'Home FC D2' },
  { minute: 3, type: 'foul', team: 'away', playerId: 111, playerName: 'Away FC A3' },
  { minute: 3, type: 'yellow', team: 'home', playerId: 4 },
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): recovered=false
    // leaves isInjured=false ("stays on, flagged in commentary only" — the flag
    // semantics look inverted); recovered=true keeps isInjured=true.
  { minute: 3, type: 'injury', team: 'away', playerId: 110, recovered: false },
  { minute: 6, type: 'foul', team: 'away', playerId: 102, playerName: 'Away FC D1' },
  { minute: 8, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 8, type: 'offside', team: 'away', playerId: 110, playerName: 'Away FC A2' },
  { minute: 10, type: 'foul', team: 'away', playerId: 110, playerName: 'Away FC A2' },
  { minute: 11, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 12, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 12, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 13, type: 'chance', team: 'away', playerId: 110, chanceType: 'one-on-one' },
  { minute: 13, type: 'miss', team: 'away', playerId: 110, chanceType: 'one-on-one' },
  { minute: 13, type: 'yellow', team: 'home', playerId: 8 },
    // PINNED-BEHAVIOR: red cards are second-yellow only (no straight reds); the
    // sent-off player leaves the pitch (onPitch=false) and every later pinned
    // event reflects the 10-man team.
  { minute: 15, type: 'red', team: 'home', playerId: 4, secondYellow: true },
    // PINNED-BEHAVIOR: keeperId is the real opposing keeper here (this penalty
    // predates the min-77 substitution).
  { minute: 17, type: 'penalty', team: 'home', playerId: 6, keeperId: 101, playerName: 'Home FC M1' },
  { minute: 17, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 21, type: 'yellow', team: 'away', playerId: 105 },
  { minute: 23, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 23, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 25, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 26, type: 'chance', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 26, type: 'miss', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 26, type: 'foul', team: 'home', playerId: 3, playerName: 'Home FC D2' },
  { minute: 27, type: 'foul', team: 'away', playerId: 111, playerName: 'Away FC A3' },
  { minute: 34, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 34, type: 'miss', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 35, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 35, type: 'goal', team: 'away', playerId: 101, setPiece: 'corner', keeperId: 1, playerName: 'Away FC GK' },
  { minute: 39, type: 'chance', team: 'away', playerId: 111, chanceType: 'one-on-one' },
  { minute: 39, type: 'save', team: 'away', playerId: 111, chanceType: 'one-on-one', keeperId: 1 },
  { minute: 42, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 45, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 45, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 47, type: 'foul', team: 'away', playerId: 107, playerName: 'Away FC M2' },
  { minute: 52, type: 'chance', team: 'away', playerId: 110, chanceType: 'long-shot' },
  { minute: 52, type: 'save', team: 'away', playerId: 110, chanceType: 'long-shot', keeperId: 1 },
  { minute: 52, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 55, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 56, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 56, type: 'miss', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 58, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 60, type: 'foul', team: 'home', playerId: 5, playerName: 'Home FC D4' },
  { minute: 64, type: 'chance', team: 'away', playerId: 111, chanceType: 'through-ball' },
  { minute: 64, type: 'save', team: 'away', playerId: 111, chanceType: 'through-ball', keeperId: 1 },
  { minute: 67, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 67, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 74, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 77, type: 'chance', team: 'away', playerId: 109, chanceType: 'one-on-one' },
  { minute: 77, type: 'save', team: 'away', playerId: 109, chanceType: 'one-on-one', keeperId: 1 },
  { minute: 77, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): updateStamina has
    // no RNG, so with the uniform fixture every match subs at minutes 77/77/78/78/
    // 79/79 and the FIRST sub removes the GOALKEEPER (stable sort picks index 0)
    // with no keeper replacement. From min 77 the team has no on-pitch GK, so
    // penalty/own-goal resolution falls back to the first on-pitch outfield
    // player as "keeper". sub-event playerId = the INCOMING player (R4 flip);
    // subInId/subOutId/name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 12, subInId: 12, subOutId: 1, playerName: 'Home FC S1', subInName: 'Home FC S1', subOutName: 'Home FC GK' },
  { minute: 77, type: 'sub', team: 'away', playerId: 112, subInId: 112, subOutId: 101, playerName: 'Away FC S1', subInName: 'Away FC S1', subOutName: 'Away FC GK' },
  { minute: 78, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 78, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 13, subInId: 13, subOutId: 2, playerName: 'Home FC S2', subInName: 'Home FC S2', subOutName: 'Home FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 113, subInId: 113, subOutId: 102, playerName: 'Away FC S2', subInName: 'Away FC S2', subOutName: 'Away FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 14, subInId: 14, subOutId: 3, playerName: 'Home FC S3', subInName: 'Home FC S3', subOutName: 'Home FC D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 114, subInId: 114, subOutId: 103, playerName: 'Away FC S3', subInName: 'Away FC S3', subOutName: 'Away FC D2' },
  { minute: 81, type: 'corner', team: 'away', playerId: 112, setPiece: 'corner', playerName: 'Away FC S1' },
  { minute: 81, type: 'miss', team: 'away', playerId: 112, setPiece: 'corner', keeperId: 12, playerName: 'Away FC S1' },
  { minute: 85, type: 'foul', team: 'home', playerId: 14, playerName: 'Home FC S3' },
  { minute: 86, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 87, type: 'foul', team: 'away', playerId: 106, playerName: 'Away FC M1' },
  { minute: 89, type: 'chance', team: 'home', playerId: 9, chanceType: 'cross' },
  { minute: 89, type: 'goal', team: 'home', playerId: 9, assistId: 7, chanceType: 'cross' },
  { minute: 89, type: 'freeKick', team: 'home', playerId: 12, setPiece: 'freeKick', playerName: 'Home FC S1' },
  { minute: 89, type: 'miss', team: 'home', playerId: 12, setPiece: 'freeKick', keeperId: 112, playerName: 'Home FC S1' },
  { minute: 90, type: 'chance', team: 'away', playerId: 111, chanceType: 'through-ball' },
  { minute: 90, type: 'save', team: 'away', playerId: 111, chanceType: 'through-ball', keeperId: 12 },
];

const EVENTS_149: PinnedEvent[] = [
  { minute: 2, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 2, type: 'miss', team: 'away', playerId: 101, setPiece: 'corner', keeperId: 1, playerName: 'Away FC GK' },
  { minute: 3, type: 'freeKick', team: 'away', playerId: 101, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 6, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 7, type: 'freeKick', team: 'away', playerId: 101, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 8, type: 'yellow', team: 'away', playerId: 111 },
  { minute: 12, type: 'chance', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 12, type: 'miss', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 13, type: 'chance', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 13, type: 'miss', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 13, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 13, type: 'freeKick', team: 'away', playerId: 101, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 16, type: 'offside', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 17, type: 'foul', team: 'home', playerId: 6, playerName: 'Home FC M1' },
  { minute: 20, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 20, type: 'foul', team: 'home', playerId: 5, playerName: 'Home FC D4' },
  { minute: 23, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 23, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 23, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 23, type: 'foul', team: 'home', playerId: 2, playerName: 'Home FC D1' },
  { minute: 25, type: 'foul', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 26, type: 'chance', team: 'away', playerId: 110, chanceType: 'cross' },
  { minute: 26, type: 'miss', team: 'away', playerId: 110, chanceType: 'cross' },
  { minute: 27, type: 'foul', team: 'away', playerId: 102, playerName: 'Away FC D1' },
  { minute: 33, type: 'foul', team: 'away', playerId: 101, playerName: 'Away FC GK' },
  { minute: 34, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 34, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 38, type: 'yellow', team: 'away', playerId: 110 },
  { minute: 39, type: 'chance', team: 'away', playerId: 110, chanceType: 'cross' },
  { minute: 39, type: 'save', team: 'away', playerId: 110, chanceType: 'cross', keeperId: 1 },
  { minute: 40, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 40, type: 'foul', team: 'home', playerId: 4, playerName: 'Home FC D3' },
  { minute: 45, type: 'chance', team: 'home', playerId: 10, chanceType: 'header' },
  { minute: 45, type: 'save', team: 'home', playerId: 10, chanceType: 'header', keeperId: 101 },
  { minute: 45, type: 'offside', team: 'away', playerId: 111, playerName: 'Away FC A3' },
  { minute: 50, type: 'freeKick', team: 'away', playerId: 101, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 52, type: 'chance', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 52, type: 'miss', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 53, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 56, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 56, type: 'save', team: 'home', playerId: 9, chanceType: 'header', keeperId: 101 },
  { minute: 58, type: 'injury', team: 'away', playerId: 104, recovered: false },
  { minute: 64, type: 'chance', team: 'away', playerId: 111, chanceType: 'cross' },
  { minute: 64, type: 'miss', team: 'away', playerId: 111, chanceType: 'cross' },
  { minute: 65, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 65, type: 'goal', team: 'home', playerId: 1, setPiece: 'freeKick', keeperId: 101, playerName: 'Home FC GK' },
  { minute: 66, type: 'yellow', team: 'home', playerId: 11 },
  { minute: 67, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 67, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 71, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 71, type: 'yellow', team: 'home', playerId: 7 },
  { minute: 71, type: 'injury', team: 'away', playerId: 104, recovered: true },
    // PINNED-BEHAVIOR: keeperId is the real opposing keeper here (pre-sub).
  { minute: 72, type: 'penalty', team: 'home', playerId: 6, keeperId: 101, playerName: 'Home FC M1' },
  { minute: 74, type: 'foul', team: 'home', playerId: 4, playerName: 'Home FC D3' },
  { minute: 75, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 75, type: 'miss', team: 'home', playerId: 1, setPiece: 'corner', keeperId: 101, playerName: 'Home FC GK' },
  { minute: 77, type: 'chance', team: 'away', playerId: 109, chanceType: 'cross' },
  { minute: 77, type: 'miss', team: 'away', playerId: 109, chanceType: 'cross' },
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): updateStamina has
    // no RNG, so with the uniform fixture every match subs at minutes 77/77/78/78/
    // 79/79 and the FIRST sub removes the GOALKEEPER (stable sort picks index 0)
    // with no keeper replacement. From min 77 the team has no on-pitch GK, so
    // penalty/own-goal resolution falls back to the first on-pitch outfield
    // player as "keeper". sub-event playerId = the INCOMING player (R4 flip);
    // subInId/subOutId/name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 12, subInId: 12, subOutId: 1, playerName: 'Home FC S1', subInName: 'Home FC S1', subOutName: 'Home FC GK' },
  { minute: 77, type: 'sub', team: 'away', playerId: 114, subInId: 114, subOutId: 101, playerName: 'Away FC S3', subInName: 'Away FC S3', subOutName: 'Away FC GK' },
  { minute: 78, type: 'chance', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 78, type: 'save', team: 'home', playerId: 10, chanceType: 'cross', keeperId: 114 },
  { minute: 78, type: 'corner', team: 'away', playerId: 114, setPiece: 'corner', playerName: 'Away FC S3' },
  { minute: 78, type: 'freeKick', team: 'away', playerId: 114, setPiece: 'freeKick', playerName: 'Away FC S3' },
  { minute: 78, type: 'save', team: 'away', playerId: 114, setPiece: 'freeKick', keeperId: 12, playerName: 'Away FC S3' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 13, subInId: 13, subOutId: 2, playerName: 'Home FC S2', subInName: 'Home FC S2', subOutName: 'Home FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 112, subInId: 112, subOutId: 102, playerName: 'Away FC S1', subInName: 'Away FC S1', subOutName: 'Away FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 14, subInId: 14, subOutId: 3, playerName: 'Home FC S3', subInName: 'Home FC S3', subOutName: 'Home FC D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 113, subInId: 113, subOutId: 103, playerName: 'Away FC S2', subInName: 'Away FC S2', subOutName: 'Away FC D2' },
  { minute: 84, type: 'offside', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 86, type: 'foul', team: 'away', playerId: 105, playerName: 'Away FC D4' },
  { minute: 89, type: 'chance', team: 'home', playerId: 11, chanceType: 'header' },
  { minute: 89, type: 'save', team: 'home', playerId: 11, chanceType: 'header', keeperId: 114 },
  { minute: 90, type: 'chance', team: 'away', playerId: 110, chanceType: 'header' },
  { minute: 90, type: 'miss', team: 'away', playerId: 110, chanceType: 'header' },
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): the taker is a
    // substitute and the "keeper" (keeperId=14) is the outfield fallback — the
    // real GK was substituted at min 77 with no replacement.
  { minute: 90, type: 'missedPenalty', team: 'home', playerId: 13, keeperId: 114, playerName: 'Home FC S2' },
];

const EVENTS_686: PinnedEvent[] = [
  { minute: 1, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 1, type: 'offside', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 3, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
    // PINNED-BEHAVIOR: all six injuries in this stream have recovered=true
    // (isInjured stays true — see the injury-flag note in the seed-41 stream).
  { minute: 3, type: 'injury', team: 'away', playerId: 107, recovered: true },
  { minute: 6, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
  { minute: 9, type: 'freeKick', team: 'away', playerId: 101, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 12, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 12, type: 'save', team: 'home', playerId: 11, chanceType: 'cross', keeperId: 101 },
  { minute: 12, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 13, type: 'chance', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 13, type: 'miss', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 15, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 15, type: 'freeKick', team: 'away', playerId: 101, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 15, type: 'offside', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 18, type: 'injury', team: 'home', playerId: 5, recovered: true },
  { minute: 19, type: 'foul', team: 'home', playerId: 8, playerName: 'Home FC M3' },
  { minute: 23, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 23, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 23, type: 'offside', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 26, type: 'chance', team: 'away', playerId: 110, chanceType: 'one-on-one' },
  { minute: 26, type: 'miss', team: 'away', playerId: 110, chanceType: 'one-on-one' },
  { minute: 27, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 27, type: 'foul', team: 'home', playerId: 7, playerName: 'Home FC M2' },
  { minute: 30, type: 'foul', team: 'away', playerId: 103, playerName: 'Away FC D2' },
  { minute: 34, type: 'chance', team: 'home', playerId: 11, chanceType: 'through-ball' },
  { minute: 34, type: 'save', team: 'home', playerId: 11, chanceType: 'through-ball', keeperId: 101 },
  { minute: 34, type: 'foul', team: 'home', playerId: 7, playerName: 'Home FC M2' },
  { minute: 38, type: 'foul', team: 'home', playerId: 3, playerName: 'Home FC D2' },
  { minute: 39, type: 'chance', team: 'away', playerId: 109, chanceType: 'long-shot' },
  { minute: 39, type: 'save', team: 'away', playerId: 109, chanceType: 'long-shot', keeperId: 1 },
  { minute: 39, type: 'injury', team: 'home', playerId: 10, recovered: true },
  { minute: 43, type: 'foul', team: 'away', playerId: 107, playerName: 'Away FC M2' },
  { minute: 45, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 45, type: 'miss', team: 'home', playerId: 9, chanceType: 'one-on-one' },
    // PINNED-BEHAVIOR: keeperId is the real opposing keeper here (pre-sub).
  { minute: 48, type: 'penalty', team: 'away', playerId: 106, keeperId: 1, playerName: 'Away FC M1' },
  { minute: 52, type: 'chance', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 52, type: 'miss', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 54, type: 'injury', team: 'home', playerId: 9, recovered: true },
  { minute: 56, type: 'chance', team: 'home', playerId: 9, chanceType: 'cross' },
  { minute: 56, type: 'save', team: 'home', playerId: 9, chanceType: 'cross', keeperId: 101 },
  { minute: 56, type: 'foul', team: 'away', playerId: 107, playerName: 'Away FC M2' },
  { minute: 58, type: 'corner', team: 'home', playerId: 1, setPiece: 'corner', playerName: 'Home FC GK' },
  { minute: 64, type: 'chance', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 64, type: 'miss', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 65, type: 'foul', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 67, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 67, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 68, type: 'corner', team: 'away', playerId: 101, setPiece: 'corner', playerName: 'Away FC GK' },
    // PINNED-BEHAVIOR: ownGoal — team/playerId describe the victim side;
    // creditTeam carries the beneficiary (the renderer reconciles the
    // scoreline from creditTeam).
  { minute: 69, type: 'ownGoal', team: 'away', playerId: 105, creditTeam: 'home', playerName: 'Away FC D4' },
  { minute: 70, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 70, type: 'goal', team: 'home', playerId: 1, setPiece: 'freeKick', keeperId: 101, playerName: 'Home FC GK' },
  { minute: 72, type: 'foul', team: 'home', playerId: 4, playerName: 'Home FC D3' },
  { minute: 72, type: 'yellow', team: 'home', playerId: 5 },
  { minute: 75, type: 'freeKick', team: 'away', playerId: 101, setPiece: 'freeKick', playerName: 'Away FC GK' },
  { minute: 76, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home FC GK' },
  { minute: 76, type: 'foul', team: 'away', playerId: 111, playerName: 'Away FC A3' },
  { minute: 77, type: 'chance', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 77, type: 'miss', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 77, type: 'injury', team: 'home', playerId: 6, recovered: true },
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): updateStamina has
    // no RNG, so with the uniform fixture every match subs at minutes 77/77/78/78/
    // 79/79 and the FIRST sub removes the GOALKEEPER (stable sort picks index 0)
    // with no keeper replacement. From min 77 the team has no on-pitch GK, so
    // penalty/own-goal resolution falls back to the first on-pitch outfield
    // player as "keeper". sub-event playerId = the INCOMING player (R4 flip);
    // subInId/subOutId/name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 12, subInId: 12, subOutId: 1, playerName: 'Home FC S1', subInName: 'Home FC S1', subOutName: 'Home FC GK' },
  { minute: 77, type: 'sub', team: 'away', playerId: 114, subInId: 114, subOutId: 101, playerName: 'Away FC S3', subInName: 'Away FC S3', subOutName: 'Away FC GK' },
  { minute: 78, type: 'chance', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 78, type: 'save', team: 'home', playerId: 9, chanceType: 'through-ball', keeperId: 114 },
  { minute: 78, type: 'freeKick', team: 'home', playerId: 12, setPiece: 'freeKick', playerName: 'Home FC S1' },
  { minute: 78, type: 'miss', team: 'home', playerId: 12, setPiece: 'freeKick', keeperId: 114, playerName: 'Home FC S1' },
  { minute: 78, type: 'injury', team: 'away', playerId: 110, recovered: true },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 13, subInId: 13, subOutId: 2, playerName: 'Home FC S2', subInName: 'Home FC S2', subOutName: 'Home FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 112, subInId: 112, subOutId: 102, playerName: 'Away FC S1', subInName: 'Away FC S1', subOutName: 'Away FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 14, subInId: 14, subOutId: 3, playerName: 'Home FC S3', subInName: 'Home FC S3', subOutName: 'Home FC D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 113, subInId: 113, subOutId: 103, playerName: 'Away FC S2', subInName: 'Away FC S2', subOutName: 'Away FC D2' },
  { minute: 80, type: 'foul', team: 'home', playerId: 6, playerName: 'Home FC M1' },
  { minute: 84, type: 'yellow', team: 'home', playerId: 12 },
  { minute: 87, type: 'yellow', team: 'away', playerId: 106 },
  { minute: 89, type: 'chance', team: 'home', playerId: 11, chanceType: 'through-ball' },
  { minute: 89, type: 'save', team: 'home', playerId: 11, chanceType: 'through-ball', keeperId: 114 },
  { minute: 90, type: 'chance', team: 'away', playerId: 114, chanceType: 'header' },
  { minute: 90, type: 'miss', team: 'away', playerId: 114, chanceType: 'header' },
];

// ASYMMETRIC fixture (R1-01): differentiated keepers + set-piece specialists.
const EVENTS_10: PinnedEvent[] = [
  { minute: 1, type: 'yellow', team: 'home', playerId: 4 },
  { minute: 2, type: 'foul', team: 'away', playerId: 102, playerName: 'Away Rovers D1' },
  { minute: 3, type: 'injury', team: 'home', playerId: 10, recovered: true },
  { minute: 4, type: 'freeKick', team: 'away', playerId: 106, setPiece: 'freeKick', playerName: 'Away Rovers M1' },
  { minute: 6, type: 'foul', team: 'away', playerId: 108, playerName: 'Away Rovers M3' },
  { minute: 11, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 11, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 14, type: 'chance', team: 'away', playerId: 111, chanceType: 'cross' },
  { minute: 14, type: 'miss', team: 'away', playerId: 111, chanceType: 'cross' },
  { minute: 15, type: 'foul', team: 'home', playerId: 9, playerName: 'Home United A1' },
    // PINNED-BEHAVIOR: home free-kick taker is the GOALKEEPER — the non-specialists
    // all tie at freeKicks 10 and the stable sort picks index 0 (the GK).
  { minute: 16, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home United GK' },
  { minute: 17, type: 'corner', team: 'home', playerId: 6, setPiece: 'corner', playerName: 'Home United M1' },
  { minute: 21, type: 'chance', team: 'home', playerId: 10, chanceType: 'one-on-one' },
  { minute: 21, type: 'save', team: 'home', playerId: 10, chanceType: 'one-on-one', keeperId: 101 },
  { minute: 22, type: 'corner', team: 'home', playerId: 6, setPiece: 'corner', playerName: 'Home United M1' },
    // PINNED-BEHAVIOR: value-ranked taker — Away Rovers M2 (corners 18) wins the
    // corner ranking; the engine ignores the setPieces attribute entirely.
  { minute: 24, type: 'corner', team: 'away', playerId: 107, setPiece: 'corner', playerName: 'Away Rovers M2' },
  { minute: 25, type: 'corner', team: 'home', playerId: 6, setPiece: 'corner', playerName: 'Home United M1' },
    // PINNED-BEHAVIOR: value-ranked taker — Home United M1 (corners 20) takes
    // the corner; setPieces-specialist M2 (id 7, setPieces 20) is never picked.
  { minute: 25, type: 'goal', team: 'home', playerId: 6, setPiece: 'corner', keeperId: 101, playerName: 'Home United M1' },
  { minute: 27, type: 'chance', team: 'away', playerId: 109, chanceType: 'cross' },
  { minute: 27, type: 'save', team: 'away', playerId: 109, chanceType: 'cross', keeperId: 1 },
  { minute: 30, type: 'corner', team: 'away', playerId: 107, setPiece: 'corner', playerName: 'Away Rovers M2' },
  { minute: 31, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 31, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 34, type: 'yellow', team: 'away', playerId: 104 },
  { minute: 36, type: 'foul', team: 'home', playerId: 6, playerName: 'Home United M1' },
  { minute: 36, type: 'offside', team: 'away', playerId: 110, playerName: 'Away Rovers A2' },
  { minute: 40, type: 'chance', team: 'away', playerId: 111, chanceType: 'through-ball' },
  { minute: 40, type: 'save', team: 'away', playerId: 111, chanceType: 'through-ball', keeperId: 1 },
  { minute: 41, type: 'chance', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 41, type: 'save', team: 'home', playerId: 10, chanceType: 'cross', keeperId: 101 },
  { minute: 47, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home United GK' },
  { minute: 51, type: 'chance', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 51, type: 'miss', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 53, type: 'chance', team: 'away', playerId: 109, chanceType: 'one-on-one' },
  { minute: 53, type: 'miss', team: 'away', playerId: 109, chanceType: 'one-on-one' },
  { minute: 55, type: 'foul', team: 'home', playerId: 3, playerName: 'Home United D2' },
  { minute: 58, type: 'foul', team: 'away', playerId: 108, playerName: 'Away Rovers M3' },
  { minute: 60, type: 'injury', team: 'away', playerId: 111, recovered: true },
  { minute: 61, type: 'freeKick', team: 'home', playerId: 1, setPiece: 'freeKick', playerName: 'Home United GK' },
    // PINNED-BEHAVIOR: the GK scores the free kick against the weak keeper
    // (keeperStrength 0.25 < AVERAGE 0.5 adds to effectiveRoll) — the exact
    // keeper term split PR E will recalibrate (see the unit grid).
  { minute: 61, type: 'goal', team: 'home', playerId: 1, setPiece: 'freeKick', keeperId: 101, playerName: 'Home United GK' },
  { minute: 62, type: 'chance', team: 'home', playerId: 11, chanceType: 'long-shot' },
  { minute: 62, type: 'goal', team: 'home', playerId: 11, chanceType: 'long-shot' },
  { minute: 67, type: 'chance', team: 'away', playerId: 110, chanceType: 'cross' },
  { minute: 67, type: 'miss', team: 'away', playerId: 110, chanceType: 'cross' },
  { minute: 69, type: 'corner', team: 'home', playerId: 6, setPiece: 'corner', playerName: 'Home United M1' },
    // PINNED-BEHAVIOR: set-piece save vs the weak away keeper (keeperId 101) —
    // the keeper-term discriminator for PR E.
  { minute: 69, type: 'save', team: 'home', playerId: 6, setPiece: 'corner', keeperId: 101, playerName: 'Home United M1' },
  { minute: 69, type: 'foul', team: 'home', playerId: 11, playerName: 'Home United A3' },
  { minute: 72, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 72, type: 'save', team: 'home', playerId: 10, chanceType: 'through-ball', keeperId: 101 },
  { minute: 73, type: 'yellow', team: 'away', playerId: 109 },
  { minute: 74, type: 'foul', team: 'away', playerId: 108, playerName: 'Away Rovers M3' },
  { minute: 76, type: 'corner', team: 'away', playerId: 107, setPiece: 'corner', playerName: 'Away Rovers M2' },
  { minute: 77, type: 'offside', team: 'home', playerId: 9, playerName: 'Home United A1' },
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): updateStamina has
    // no RNG, so with the uniform fixture every match subs at minutes 77/77/78/78/
    // 79/79 and the FIRST sub removes the GOALKEEPER (stable sort picks index 0)
    // with no keeper replacement. From min 77 the team has no on-pitch GK, so
    // penalty/own-goal resolution falls back to the first on-pitch outfield
    // player as "keeper". sub-event playerId = the INCOMING player (R4 flip);
    // subInId/subOutId/name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 12, subInId: 12, subOutId: 1, playerName: 'Home United S1', subInName: 'Home United S1', subOutName: 'Home United GK' },
  { minute: 77, type: 'sub', team: 'away', playerId: 114, subInId: 114, subOutId: 101, playerName: 'Away Rovers S3', subInName: 'Away Rovers S3', subOutName: 'Away Rovers GK' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 13, subInId: 13, subOutId: 2, playerName: 'Home United S2', subInName: 'Home United S2', subOutName: 'Home United D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 112, subInId: 112, subOutId: 102, playerName: 'Away Rovers S1', subInName: 'Away Rovers S1', subOutName: 'Away Rovers D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 14, subInId: 14, subOutId: 3, playerName: 'Home United S3', subInName: 'Home United S3', subOutName: 'Home United D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 113, subInId: 113, subOutId: 103, playerName: 'Away Rovers S2', subInName: 'Away Rovers S2', subOutName: 'Away Rovers D2' },
  { minute: 80, type: 'chance', team: 'away', playerId: 109, chanceType: 'one-on-one' },
  { minute: 80, type: 'save', team: 'away', playerId: 109, chanceType: 'one-on-one', keeperId: 12 },
  { minute: 82, type: 'chance', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 82, type: 'miss', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 84, type: 'corner', team: 'home', playerId: 6, setPiece: 'corner', playerName: 'Home United M1' },
  { minute: 85, type: 'corner', team: 'away', playerId: 107, setPiece: 'corner', playerName: 'Away Rovers M2' },
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): after the min-77
    // GK substitution there is no on-pitch keeper — the "keeper" (keeperId 12)
    // is the first on-pitch outfield fallback.
  { minute: 85, type: 'miss', team: 'away', playerId: 107, setPiece: 'corner', keeperId: 12, playerName: 'Away Rovers M2' },
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

const RENDERED_10: PinnedLine[] = [
  { minute: 0, key: 'kickoff', type: 'chance', team: 'home' },
  { minute: 1, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 2, key: 'foul', type: 'foul', team: 'away' },
  { minute: 3, key: 'injury.recovers', type: 'injury', team: 'home' },
  { minute: 4, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 6, key: 'foul', type: 'foul', team: 'away' },
  { minute: 11, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 11, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 14, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 14, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 15, key: 'foul', type: 'foul', team: 'home' },
  { minute: 16, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 17, key: 'corner', type: 'corner', team: 'home' },
  { minute: 21, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 21, key: 'save.one-on-one', type: 'save', team: 'home' },
  { minute: 22, key: 'corner', type: 'corner', team: 'home' },
  { minute: 24, key: 'corner', type: 'corner', team: 'away' },
  { minute: 25, key: 'corner', type: 'corner', team: 'home' },
  { minute: 25, key: 'setpiece.goal', type: 'goal', team: 'home' },
  { minute: 27, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 27, key: 'save.cross', type: 'save', team: 'away' },
  { minute: 30, key: 'corner', type: 'corner', team: 'away' },
  { minute: 31, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 31, key: 'miss.header', type: 'miss', team: 'home' },
  { minute: 34, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 36, key: 'foul', type: 'foul', team: 'home' },
  { minute: 36, key: 'offside', type: 'offside', team: 'away' },
  { minute: 40, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 40, key: 'save.through-ball', type: 'save', team: 'away' },
  { minute: 41, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 41, key: 'save.cross', type: 'save', team: 'home' },
  { minute: 47, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 51, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 51, key: 'miss.cross', type: 'miss', team: 'home' },
  { minute: 53, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 53, key: 'miss.one-on-one', type: 'miss', team: 'away' },
  { minute: 55, key: 'foul', type: 'foul', team: 'home' },
  { minute: 58, key: 'foul', type: 'foul', team: 'away' },
  { minute: 60, key: 'injury.recovers', type: 'injury', team: 'away' },
  { minute: 61, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 61, key: 'setpiece.goal', type: 'goal', team: 'home' },
  { minute: 62, key: 'chance.long-shot', type: 'chance', team: 'home' },
  { minute: 62, key: 'goal.long-shot', type: 'goal', team: 'home' },
  { minute: 67, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 67, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 69, key: 'corner', type: 'corner', team: 'home' },
  { minute: 69, key: 'setpiece.save', type: 'save', team: 'home' },
  { minute: 69, key: 'foul', type: 'foul', team: 'home' },
  { minute: 72, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 72, key: 'save.through-ball', type: 'save', team: 'home' },
  { minute: 73, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 74, key: 'foul', type: 'foul', team: 'away' },
  { minute: 76, key: 'corner', type: 'corner', team: 'away' },
  { minute: 77, key: 'offside', type: 'offside', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'away' },
  { minute: 78, key: 'sub', type: 'sub', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'away' },
  { minute: 79, key: 'sub', type: 'sub', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'away' },
  { minute: 80, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 80, key: 'save.one-on-one', type: 'save', team: 'away' },
  { minute: 82, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 82, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 84, key: 'corner', type: 'corner', team: 'home' },
  { minute: 85, key: 'corner', type: 'corner', team: 'away' },
  { minute: 85, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 90, key: 'full-time', type: 'chance', team: 'home' },
];

// --- Set-piece resolution unit pins (cascade-free, R1-01) ---
// Fixed taker/defender/keeper attribute sets; a stub RNG returns the pinned roll.

const GRID_AVG = createAttributes();
const GRID_CORNER_SPECIALIST = createAttributes({ heading: 20, strength: 20, acceleration: 20 });
const GRID_FREEKICK_SPECIALIST = createAttributes({ freeKicks: 20, technique: 20, finishing: 20 });
const GRID_KEEPERS = {
  strong: createAttributes({ handling: 18, reflexes: 17, oneOnOnes: 16 }),
  average: GRID_AVG,
  weak: createAttributes({ handling: 4, reflexes: 5, oneOnOnes: 6 }),
};
const GRID_DEFENDERS = [GRID_AVG, GRID_AVG, GRID_AVG, GRID_AVG];

interface GridCell {
  type: 'corner' | 'freeKick';
  taker: 'specialist' | 'average';
  keeper: 'strong' | 'average' | 'weak';
  roll: number;
  outcome: string;
}

const GRID: GridCell[] = [
  { type: 'corner', taker: 'specialist', keeper: 'strong', roll: 0.05, outcome: 'goal' },
  { type: 'corner', taker: 'average', keeper: 'strong', roll: 0.05, outcome: 'miss' },
  { type: 'corner', taker: 'specialist', keeper: 'strong', roll: 0.35, outcome: 'save' },
  { type: 'corner', taker: 'average', keeper: 'strong', roll: 0.35, outcome: 'miss' },
  { type: 'corner', taker: 'specialist', keeper: 'strong', roll: 0.65, outcome: 'miss' },
  { type: 'corner', taker: 'average', keeper: 'strong', roll: 0.65, outcome: 'miss' },
  { type: 'corner', taker: 'specialist', keeper: 'strong', roll: 0.95, outcome: 'miss' },
  { type: 'corner', taker: 'average', keeper: 'strong', roll: 0.95, outcome: 'miss' },
  { type: 'corner', taker: 'specialist', keeper: 'average', roll: 0.05, outcome: 'goal' },
  { type: 'corner', taker: 'average', keeper: 'average', roll: 0.05, outcome: 'goal' },
  { type: 'corner', taker: 'specialist', keeper: 'average', roll: 0.35, outcome: 'goal' },
  { type: 'corner', taker: 'average', keeper: 'average', roll: 0.35, outcome: 'miss' },
  { type: 'corner', taker: 'specialist', keeper: 'average', roll: 0.65, outcome: 'save' },
  { type: 'corner', taker: 'average', keeper: 'average', roll: 0.65, outcome: 'miss' },
  { type: 'corner', taker: 'specialist', keeper: 'average', roll: 0.95, outcome: 'miss' },
  { type: 'corner', taker: 'average', keeper: 'average', roll: 0.95, outcome: 'miss' },
  { type: 'corner', taker: 'specialist', keeper: 'weak', roll: 0.05, outcome: 'goal' },
  { type: 'corner', taker: 'average', keeper: 'weak', roll: 0.05, outcome: 'goal' },
  { type: 'corner', taker: 'specialist', keeper: 'weak', roll: 0.35, outcome: 'goal' },
  { type: 'corner', taker: 'average', keeper: 'weak', roll: 0.35, outcome: 'save' },
  { type: 'corner', taker: 'specialist', keeper: 'weak', roll: 0.65, outcome: 'save' },
  { type: 'corner', taker: 'average', keeper: 'weak', roll: 0.65, outcome: 'miss' },
  { type: 'corner', taker: 'specialist', keeper: 'weak', roll: 0.95, outcome: 'save' },
  { type: 'corner', taker: 'average', keeper: 'weak', roll: 0.95, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'strong', roll: 0.05, outcome: 'goal' },
  { type: 'freeKick', taker: 'average', keeper: 'strong', roll: 0.05, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'strong', roll: 0.35, outcome: 'save' },
  { type: 'freeKick', taker: 'average', keeper: 'strong', roll: 0.35, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'strong', roll: 0.65, outcome: 'miss' },
  { type: 'freeKick', taker: 'average', keeper: 'strong', roll: 0.65, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'strong', roll: 0.95, outcome: 'miss' },
  { type: 'freeKick', taker: 'average', keeper: 'strong', roll: 0.95, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'average', roll: 0.05, outcome: 'goal' },
  { type: 'freeKick', taker: 'average', keeper: 'average', roll: 0.05, outcome: 'goal' },
  { type: 'freeKick', taker: 'specialist', keeper: 'average', roll: 0.35, outcome: 'goal' },
  { type: 'freeKick', taker: 'average', keeper: 'average', roll: 0.35, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'average', roll: 0.65, outcome: 'save' },
  { type: 'freeKick', taker: 'average', keeper: 'average', roll: 0.65, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'average', roll: 0.95, outcome: 'miss' },
  { type: 'freeKick', taker: 'average', keeper: 'average', roll: 0.95, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'weak', roll: 0.05, outcome: 'goal' },
  { type: 'freeKick', taker: 'average', keeper: 'weak', roll: 0.05, outcome: 'goal' },
  { type: 'freeKick', taker: 'specialist', keeper: 'weak', roll: 0.35, outcome: 'goal' },
  { type: 'freeKick', taker: 'average', keeper: 'weak', roll: 0.35, outcome: 'save' },
  { type: 'freeKick', taker: 'specialist', keeper: 'weak', roll: 0.65, outcome: 'save' },
  { type: 'freeKick', taker: 'average', keeper: 'weak', roll: 0.65, outcome: 'miss' },
  { type: 'freeKick', taker: 'specialist', keeper: 'weak', roll: 0.95, outcome: 'save' },
  { type: 'freeKick', taker: 'average', keeper: 'weak', roll: 0.95, outcome: 'miss' },
];

describe('CM-022a golden — pinned match streams (default config, uniform fixture)', () => {
  it('seed 41: 70-event stream — early second-yellow red (min 15) + 10-man ripple, penalty vs real keeper (min 17), set-piece goal from corner (min 35), open-play assist (min 89), non-recovered injury (min 3); final 2-1', () => {
    const { home, away, result } = runMatch(41);
    expect(pinEvents(result.events)).toEqual(EVENTS_41);
    expect([home.goals, away.goals]).toEqual([2, 1]);
    // PINNED-BEHAVIOR (potential bug — address in split PR D/E): possession in
    // result() is the share of the LEFTOVER CP accumulators (after chance
    // thresholds are subtracted), not total chance points — with the uniform
    // fixture it is seed-independent (always 70/30 here).
    expect([home.possession, away.possession]).toEqual([70, 30]);
    // Post-match state pinned directly (R1-05): sent-off #4, no injury flags,
    // 10-man home roster (GK + D1 + D2 subbed off, bench on).
    expect(pinState(home)).toEqual({ sentOff: [4], injured: [], onPitch: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
    expect(pinState(away)).toEqual({ sentOff: [], injured: [], onPitch: [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] });
  });

  it('seed 149: 76-event stream — converted penalty (min 72) AND missed penalty by a sub (min 90) with the outfield fallback "keeper", set-piece goal from free kick (min 65), set-piece save (min 78), recovered + non-recovered injuries; final 2-0', () => {
    const { home, away, result } = runMatch(149);
    expect(pinEvents(result.events)).toEqual(EVENTS_149);
    expect([home.goals, away.goals]).toEqual([2, 0]);
    // PINNED-BEHAVIOR: possession = leftover-CP share (see seed-41 note).
    expect([home.possession, away.possession]).toEqual([70, 30]);
    // Post-match state (R1-05): away D3 (104) carries isInjured=true from the
    // RECOVERED min-71 injury — the inverted injury-flag quirk (recovered keeps
    // the flag; non-recovered clears it).
    expect(pinState(home)).toEqual({ sentOff: [], injured: [], onPitch: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
    expect(pinState(away)).toEqual({ sentOff: [], injured: [104], onPitch: [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] });
  });

  it('seed 686: 77-event stream — own goal with creditTeam (min 69), converted penalty (min 48), six injuries all recovered, set-piece goal (min 70); final 2-1', () => {
    const { home, away, result } = runMatch(686);
    expect(pinEvents(result.events)).toEqual(EVENTS_686);
    expect([home.goals, away.goals]).toEqual([2, 1]);
    // PINNED-BEHAVIOR: possession = leftover-CP share (see seed-41 note).
    expect([home.possession, away.possession]).toEqual([70, 30]);
    // Post-match state (R1-05): all six recovered injuries leave isInjured=true
    // on both squads (the inverted injury-flag quirk).
    expect(pinState(home)).toEqual({ sentOff: [], injured: [5, 6, 9, 10], onPitch: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
    expect(pinState(away)).toEqual({ sentOff: [], injured: [107, 110], onPitch: [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] });
  });
});

describe('CM-022a golden — pinned asymmetric match (differentiated keepers + set-piece specialists, R1-01)', () => {
  it('seed 10 (asym fixture): 66-event stream — value-ranked set-piece takers (corner specialist M1 id 6 / away corner specialist id 107 / freeKick specialist id 106; setPieces 20 on id 7 never taken), keeper-term outcomes vs both keepers incl. the GK scoring a free kick (min 61), GK-first sub at 77; final 3-0', () => {
    const { home, away, result } = runAsymMatch(10);
    expect(pinEvents(result.events)).toEqual(EVENTS_10);
    expect([home.goals, away.goals]).toEqual([3, 0]);
    expect([home.possession, away.possession]).toEqual([51, 49]);
    // Post-match state (R1-05): both squads' recovered injuries keep the flag.
    expect(pinState(home)).toEqual({ sentOff: [], injured: [10], onPitch: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
    expect(pinState(away)).toEqual({ sentOff: [], injured: [111], onPitch: [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] });
  });
});

describe('CM-022a golden — renderer seam (production renderer, en)', () => {
  // Shared seam checks: exact routing, template presence, text sentinels,
  // per-event player identity (R1-02/03/04).
  const checkSeam = (pinned: PinnedEvent[], rendered: PinnedLine[], lines: ReturnType<typeof renderPinned>, ctx: ReturnType<typeof buildRenderContext>) => {
    expect(pinLines(lines)).toEqual(rendered);
    // R1-04: every pinned key resolves to a real template — a deleted entry
    // cannot silently fall back to the generic 'chance' template.
    for (const k of new Set(rendered.map(l => l.key))) {
      expect(STRINGS.en[k as keyof typeof STRINGS.en]).toBeDefined();
    }
    for (const line of lines) {
      expect(line.text).not.toMatch(/\{\w+\}/);
      expect(line.text).not.toMatch(/Player \d+/); // the real unresolved-name sentinel
      expect(line.text).not.toMatch(/\s{2,}|^\s|\s[.,!?]/); // malformed empty-slot text
    }
    expect(lines[0].key).toBe('kickoff');
    expect(lines[lines.length - 1].key).toBe('full-time');
    // R1-02: walk the lines in lockstep with the events — every event's line
    // names the correct player (disjoint ids prove the side is right).
    let cursor = 1;
    for (const e of pinned) {
      if (e.type === 'goal' && e.assistId !== undefined) {
        const assist = lines[cursor++];
        expect(assist.key).toBe('assist');
        expect(assist.minute).toBe(e.minute);
        expect(assist.text).toContain(ctx.players.get(e.assistId)!);
      }
      const line = lines[cursor++];
      expect(line.minute).toBe(e.minute);
      if (e.type === 'sub') {
        expect(line.text).toContain(ctx.players.get(e.subInId!)!);
        expect(line.text).toContain(ctx.players.get(e.subOutId!)!);
      } else if (e.type === 'save') {
        // save templates carry {keeper} but not always {player} (e.g. save.long-shot,
        // setpiece.save) — the keeper is the identity pinned for save lines.
        if (e.keeperId !== undefined) {
          expect(line.text).toContain(ctx.players.get(e.keeperId)!);
        }
      } else if (e.playerId !== undefined) {
        expect(line.text).toContain(ctx.players.get(e.playerId)!);
      }
    }
    expect(cursor).toBe(lines.length - 1);
  };

  it('seed 41: every event renders — exact routing, identities, scoreline reconciles (73 lines)', () => {
    const { home, away, result } = runMatch(41);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(73); // 70 events + kickoff + full-time + 1 assist line
    checkSeam(EVENTS_41, RENDERED_41, lines, buildRenderContext(home, away));
    expect(lines.find(l => l.key === 'full-time')?.text).toBe('Full-time: Home FC 2-1 Away FC.');
  });

  it('seed 149: every event renders — exact routing incl. missedPenalty + setpiece.save (78 lines)', () => {
    const { home, away, result } = runMatch(149);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(78); // 76 events + kickoff + full-time, no assist lines
    checkSeam(EVENTS_149, RENDERED_149, lines, buildRenderContext(home, away));
    expect(lines.find(l => l.key === 'full-time')?.text).toBe('Full-time: Home FC 2-0 Away FC.');
  });

  it('seed 686: every event renders — exact routing incl. ownGoal + injury.recovers (79 lines)', () => {
    const { home, away, result } = runMatch(686);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(79); // 77 events + kickoff + full-time, no assist lines
    checkSeam(EVENTS_686, RENDERED_686, lines, buildRenderContext(home, away));
    expect(lines.find(l => l.key === 'full-time')?.text).toBe('Full-time: Home FC 2-1 Away FC.');
  });

  it('seed 10 (asym): every event renders — exact routing, no assist lines (68 lines)', () => {
    const { home, away, result } = runAsymMatch(10);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(68); // 66 events + kickoff + full-time, no assist lines
    checkSeam(EVENTS_10, RENDERED_10, lines, buildRenderContext(home, away));
    expect(lines.find(l => l.key === 'full-time')?.text).toBe('Full-time: Home United 3-0 Away Rovers.');
  });
});

describe('CM-022a golden — set-piece resolution unit pins (cascade-free)', () => {
  it('applySetPieceResolution grid: taker × keeper strong/average/weak × corner/freeKick × fixed rolls (PR E flips exactly these)', () => {
    // PINNED-BEHAVIOR: the keeper term is -(keeperStrength - AVERAGE_KEEPER_STRENGTH):
    // a BELOW-average keeper INCREASES conversion, an above-average keeper reduces it.
    // PR E's recalibration must flip these cells and cite them in its divergence ledger.
    for (const cell of GRID) {
      const taker = cell.taker === 'specialist'
        ? (cell.type === 'corner' ? GRID_CORNER_SPECIALIST : GRID_FREEKICK_SPECIALIST)
        : GRID_AVG;
      const rng = { next: () => cell.roll };
      expect(applySetPieceResolution(taker, GRID_DEFENDERS, GRID_KEEPERS[cell.keeper], rng, cell.type)).toBe(cell.outcome);
    }
  });
});

describe('CM-022a golden — determinism', () => {
  it('same seed + fresh teams run twice → deep-equal full streams and scorelines (seeds 41, 149, 686 uniform + 10 asym)', () => {
    for (const seed of [41, 149, 686]) {
      const a = runMatch(seed);
      const b = runMatch(seed);
      expect(a.result.events).toEqual(b.result.events);
      expect([a.home.goals, a.away.goals]).toEqual([b.home.goals, b.away.goals]);
      expect([a.home.possession, a.away.possession]).toEqual([b.home.possession, b.away.possession]);
    }
    const a = runAsymMatch(10);
    const b = runAsymMatch(10);
    expect(a.result.events).toEqual(b.result.events);
    expect([a.home.goals, a.away.goals]).toEqual([b.home.goals, b.away.goals]);
  });
});

describe('CM-022a golden — pinned-seed inventory', () => {
  it('the pinned seeds cover every engine event type and extras family — derived from LIVE engine runs (R1-07)', () => {
    const live = {
      41: pinEvents(runMatch(41).result.events),
      149: pinEvents(runMatch(149).result.events),
      686: pinEvents(runMatch(686).result.events),
      10: pinEvents(runAsymMatch(10).result.events),
    };
    // Mandatory categories: corner / freeKick / penalty / red / sub (task spec).
    expect(countBy(live[41], 'corner')).toBeGreaterThan(0);
    expect(countBy(live[41], 'freeKick')).toBeGreaterThan(0);
    expect(countBy(live[41], 'penalty')).toBeGreaterThan(0);
    expect(countBy(live[41], 'red')).toBeGreaterThan(0);
    expect(countBy(live[41], 'sub')).toBeGreaterThan(0);
    // Rare categories deliberately covered: missedPenalty (149), ownGoal (686).
    expect(countBy(live[149], 'missedPenalty')).toBeGreaterThan(0);
    expect(countBy(live[686], 'ownGoal')).toBeGreaterThan(0);
    // Extras families across the union.
    const all = [...live[41], ...live[149], ...live[686], ...live[10]];
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
    // Asymmetric discriminators (R1-01): value-ranked takers; setPieces 20 never taken.
    expect(live[10].some(e => e.type === 'corner' && e.team === 'home' && e.playerId === 6)).toBe(true);
    expect(live[10].some(e => e.type === 'corner' && e.team === 'away' && e.playerId === 107)).toBe(true);
    expect(live[10].some(e => e.type === 'freeKick' && e.team === 'away' && e.playerId === 106)).toBe(true);
    expect(live[10].every(e => (e.type !== 'corner' && e.type !== 'freeKick') || e.playerId !== 7)).toBe(true);
  });
});
