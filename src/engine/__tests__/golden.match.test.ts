// CM-022a golden/characterization tests — the executable reconciliation spec.
//
// Pins CURRENT production behavior: engine src/engine/matchEngine.ts driving the
// production renderer src/lib/commentary (the path src/store/matchStore uses).
// The dead second implementation src/engine/commentary.ts was never imported
// here and was deleted in CM-022b.
//
// This file intentionally pins suspicious behavior AS-IS — never "fix" here.
// (CM-025 exception: the four disclosed quirks were fixed on their own card; their
// pins were regenerated from live runs and ledgered in the card note. Everything
// else stays pinned as-is.)
//
// DIVERGENCE LEDGER (binding for split PRs B-E): every intentional behavior
// change is disclosed in that PR's description with exactly one ledger entry.
// Fine-grained unit pins (the set-piece grid below) flip 1:1 for targeted
// calibration changes. (CM-022e, the keeper-term PR, kept the formula and proved
// it — src/lib/tactics/__tests__/setpieces.test.ts — zero grid flips.) Whole-stream literals are
// regenerated ONLY with a cited command plus an event-level summary of what
// changed and why; PR C (mechanical reconciliation) must leave every pinned
// assertion byte-identical. See docs/vault/cards/cm-022a-golden-tests.md.
//
// PINNED-BEHAVIOR (potential bug — address in split PR D/E): the constructor
// overrides baseConversionRate to 0.12/0.9 ≈ 0.1333 when unspecified — the
// effective default differs from DEFAULT_MATCH_CONFIG.baseConversionRate (0.13).
// CM-025 FIXED the four disclosed quirks (their pins were regenerated from live
// runs; the pin-by-pin ledger is in the card note):
// 1. set-piece taker = best setPieces among the on-pitch non-GK pool (lowest-id
//    tie-break; selectSetPieceTaker in src/lib/tactics/setpieces.ts),
// 2. a keeper is replaced only by a bench GK — otherwise the keeper keeps the
//    shirt (no outfield fallback),
// 3. isInjured = true while injured, false once recovered,
// 4. sub-event playerId/playerName = the OUTGOING player (incoming in subInId).

import { describe, expect, it } from 'vitest';
import {
  buildRenderContext, countBy, createAttributes, pinEvents, pinLines, pinState,
  renderPinned, runAsymMatch, runMatch,
  type PinnedEvent, type PinnedLine,
} from './golden.helpers';
import { STRINGS } from '../../lib/commentary/strings';
import { applySetPieceResolution } from '../../lib/tactics/setpieces';

// --- Pinned event streams (canonical fixtures, default config) ---

const EVENTS_1080: PinnedEvent[] = [
  { minute: 3, type: 'offside', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 3, type: 'yellow', team: 'away', playerId: 104 },
  { minute: 4, type: 'offside', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 7, type: 'penalty', team: 'home', playerId: 6, keeperId: 101, playerName: 'Home FC M1' },
  { minute: 8, type: 'foul', team: 'home', playerId: 4, playerName: 'Home FC D3' },
  { minute: 12, type: 'chance', team: 'home', playerId: 11, chanceType: 'through-ball' },
  { minute: 12, type: 'miss', team: 'home', playerId: 11, chanceType: 'through-ball' },
  { minute: 13, type: 'chance', team: 'away', playerId: 110, chanceType: 'header' },
  { minute: 13, type: 'miss', team: 'away', playerId: 110, chanceType: 'header' },
  { minute: 17, type: 'offside', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 22, type: 'foul', team: 'away', playerId: 103, playerName: 'Away FC D2' },
  { minute: 23, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 23, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 23, type: 'foul', team: 'home', playerId: 7, playerName: 'Home FC M2' },
    // PINNED-BEHAVIOR (CM-025): set-piece takers = the best setPieces among the
    // on-pitch non-GK players — every uniform attribute ties at 10, so the
    // lowest-id tie-break rules (home ids 2/5, away ids 102); the old
    // GK-in-pool pins are gone.
  { minute: 24, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 26, type: 'chance', team: 'away', playerId: 111, chanceType: 'long-shot' },
  { minute: 26, type: 'miss', team: 'away', playerId: 111, chanceType: 'long-shot' },
  { minute: 27, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
    // PINNED-BEHAVIOR (CM-025): isInjured stays true while the player is injured
    // (recovered=false) and clears once recovered — non-recovered players are
    // skipped by the injury re-check and by the rotation AI (flagged and on;
    // see pinState below).
  { minute: 28, type: 'injury', team: 'away', playerId: 104, recovered: false },
  { minute: 34, type: 'chance', team: 'home', playerId: 10, chanceType: 'long-shot' },
  { minute: 34, type: 'save', team: 'home', playerId: 10, chanceType: 'long-shot', keeperId: 101 },
  { minute: 37, type: 'injury', team: 'away', playerId: 103, recovered: false },
  { minute: 38, type: 'foul', team: 'home', playerId: 2, playerName: 'Home FC D1' },
  { minute: 39, type: 'chance', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 39, type: 'miss', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 40, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away FC D1' },
  { minute: 41, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 41, type: 'yellow', team: 'away', playerId: 105 },
  { minute: 44, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 44, type: 'yellow', team: 'away', playerId: 108 },
  { minute: 45, type: 'chance', team: 'home', playerId: 9, chanceType: 'long-shot' },
  { minute: 45, type: 'save', team: 'home', playerId: 9, chanceType: 'long-shot', keeperId: 101 },
  { minute: 48, type: 'offside', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 50, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 51, type: 'freeKick', team: 'home', playerId: 2, setPiece: 'freeKick', playerName: 'Home FC D1' },
  { minute: 52, type: 'chance', team: 'away', playerId: 111, chanceType: 'through-ball' },
  { minute: 52, type: 'save', team: 'away', playerId: 111, chanceType: 'through-ball', keeperId: 1 },
  { minute: 52, type: 'yellow', team: 'home', playerId: 10 },
  { minute: 54, type: 'foul', team: 'home', playerId: 2, playerName: 'Home FC D1' },
  { minute: 55, type: 'injury', team: 'home', playerId: 5, recovered: true },
  { minute: 56, type: 'chance', team: 'home', playerId: 11, chanceType: 'one-on-one' },
  { minute: 56, type: 'miss', team: 'home', playerId: 11, chanceType: 'one-on-one' },
  { minute: 62, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
    // PINNED-BEHAVIOR: red cards are second-yellow only (no straight reds); the
    // sent-off player leaves the pitch (onPitch=false) and every later pinned
    // event reflects the 10-man team.
  { minute: 62, type: 'red', team: 'home', playerId: 10, secondYellow: true },
  { minute: 63, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 64, type: 'chance', team: 'away', playerId: 111, chanceType: 'one-on-one' },
  { minute: 64, type: 'miss', team: 'away', playerId: 111, chanceType: 'one-on-one' },
  { minute: 65, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 67, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 67, type: 'save', team: 'home', playerId: 9, chanceType: 'one-on-one', keeperId: 101 },
  { minute: 67, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 70, type: 'red', team: 'away', playerId: 105, secondYellow: true },
  { minute: 73, type: 'offside', team: 'away', playerId: 109, playerName: 'Away FC A1' },
  { minute: 77, type: 'chance', team: 'away', playerId: 109, chanceType: 'one-on-one' },
  { minute: 77, type: 'save', team: 'away', playerId: 109, chanceType: 'one-on-one', keeperId: 1 },
  { minute: 77, type: 'foul', team: 'away', playerId: 107, playerName: 'Away FC M2' },
    // PINNED-BEHAVIOR (CM-025): updateStamina has no RNG, so subs still land at
    // minutes 77/77/78/78/79/79 — but a keeper is replaced only by a bench GK, and
    // this fixture has none: the keeper keeps the shirt, and the tired outfield
    // chain (D1, then D2, then D3) rotates in S1/S2/S3. sub-event playerId = the
    // OUTGOING player (CM-025); subInId/subOutId and the name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 2, subInId: 12, subOutId: 2, playerName: 'Home FC D1', subInName: 'Home FC S1', subOutName: 'Home FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 77, type: 'sub', team: 'away', playerId: 102, subInId: 114, subOutId: 102, playerName: 'Away FC D1', subInName: 'Away FC S3', subOutName: 'Away FC D1' },
  { minute: 78, type: 'chance', team: 'home', playerId: 11, chanceType: 'long-shot' },
  { minute: 78, type: 'miss', team: 'home', playerId: 11, chanceType: 'long-shot' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 3, subInId: 13, subOutId: 3, playerName: 'Home FC D2', subInName: 'Home FC S2', subOutName: 'Home FC D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 106, subInId: 112, subOutId: 106, playerName: 'Away FC M1', subInName: 'Away FC S1', subOutName: 'Away FC M1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 4, subInId: 14, subOutId: 4, playerName: 'Home FC D3', subInName: 'Home FC S3', subOutName: 'Home FC D3' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 107, subInId: 113, subOutId: 107, playerName: 'Away FC M2', subInName: 'Away FC S2', subOutName: 'Away FC M2' },
  { minute: 82, type: 'corner', team: 'home', playerId: 5, setPiece: 'corner', playerName: 'Home FC D4' },
  { minute: 84, type: 'yellow', team: 'home', playerId: 5 },
  { minute: 87, type: 'freeKick', team: 'home', playerId: 5, setPiece: 'freeKick', playerName: 'Home FC D4' },
  { minute: 89, type: 'chance', team: 'home', playerId: 14, chanceType: 'through-ball' },
  { minute: 89, type: 'miss', team: 'home', playerId: 14, chanceType: 'through-ball' },
  { minute: 90, type: 'chance', team: 'away', playerId: 109, chanceType: 'cross' },
  { minute: 90, type: 'goal', team: 'away', playerId: 109, chanceType: 'cross' },
];

const EVENTS_12: PinnedEvent[] = [
    // PINNED-BEHAVIOR (CM-025): set-piece takers = the best setPieces among the
    // on-pitch non-GK players — every uniform attribute ties at 10, so the
    // lowest-id tie-break rules (home ids 2/5, away ids 102/105); the old
    // GK-in-pool pins are gone.
  { minute: 1, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 2, type: 'foul', team: 'home', playerId: 2, playerName: 'Home FC D1' },
  { minute: 4, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away FC D1' },
  { minute: 4, type: 'yellow', team: 'home', playerId: 5 },
  { minute: 7, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 12, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 12, type: 'goal', team: 'home', playerId: 9, assistId: 8, chanceType: 'header' },
  { minute: 13, type: 'chance', team: 'away', playerId: 110, chanceType: 'one-on-one' },
  { minute: 13, type: 'miss', team: 'away', playerId: 110, chanceType: 'one-on-one' },
  { minute: 13, type: 'yellow', team: 'away', playerId: 109 },
  { minute: 19, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away FC D1' },
  { minute: 19, type: 'miss', team: 'away', playerId: 102, setPiece: 'freeKick', keeperId: 1, playerName: 'Away FC D1' },
  { minute: 23, type: 'chance', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 23, type: 'goal', team: 'home', playerId: 9, assistId: 11, chanceType: 'through-ball' },
  { minute: 26, type: 'chance', team: 'away', playerId: 111, chanceType: 'long-shot' },
  { minute: 26, type: 'miss', team: 'away', playerId: 111, chanceType: 'long-shot' },
  { minute: 29, type: 'foul', team: 'away', playerId: 102, playerName: 'Away FC D1' },
  { minute: 30, type: 'foul', team: 'away', playerId: 108, playerName: 'Away FC M3' },
  { minute: 32, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away FC D1' },
  { minute: 34, type: 'chance', team: 'home', playerId: 10, chanceType: 'header' },
  { minute: 34, type: 'miss', team: 'home', playerId: 10, chanceType: 'header' },
  { minute: 36, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 36, type: 'offside', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 37, type: 'yellow', team: 'away', playerId: 111 },
  { minute: 39, type: 'chance', team: 'away', playerId: 109, chanceType: 'cross' },
  { minute: 39, type: 'miss', team: 'away', playerId: 109, chanceType: 'cross' },
  { minute: 45, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 45, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 47, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 51, type: 'foul', team: 'away', playerId: 103, playerName: 'Away FC D2' },
  { minute: 52, type: 'chance', team: 'away', playerId: 111, chanceType: 'long-shot' },
  { minute: 52, type: 'miss', team: 'away', playerId: 111, chanceType: 'long-shot' },
  { minute: 53, type: 'missedPenalty', team: 'away', playerId: 106, keeperId: 1, playerName: 'Away FC M1' },
  { minute: 54, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 54, type: 'foul', team: 'away', playerId: 103, playerName: 'Away FC D2' },
  { minute: 56, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 56, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 58, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 58, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 60, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 60, type: 'foul', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 64, type: 'chance', team: 'away', playerId: 111, chanceType: 'through-ball' },
  { minute: 64, type: 'save', team: 'away', playerId: 111, chanceType: 'through-ball', keeperId: 1 },
  { minute: 65, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
    // PINNED-BEHAVIOR (CM-025): this stream's injuries recover — the flag clears
    // for each (the old inverted pin kept recovered players flagged).
  { minute: 65, type: 'injury', team: 'away', playerId: 107, recovered: true },
  { minute: 66, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away FC D1' },
  { minute: 66, type: 'miss', team: 'away', playerId: 102, setPiece: 'freeKick', keeperId: 1, playerName: 'Away FC D1' },
  { minute: 67, type: 'chance', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 67, type: 'miss', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 69, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 70, type: 'yellow', team: 'away', playerId: 111 },
  { minute: 72, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 74, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 75, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 75, type: 'foul', team: 'away', playerId: 109, playerName: 'Away FC A1' },
  { minute: 77, type: 'chance', team: 'away', playerId: 110, chanceType: 'one-on-one' },
  { minute: 77, type: 'save', team: 'away', playerId: 110, chanceType: 'one-on-one', keeperId: 1 },
  { minute: 77, type: 'yellow', team: 'away', playerId: 104 },
    // PINNED-BEHAVIOR (CM-025): updateStamina has no RNG, so subs still land at
    // minutes 77/77/78/78/79/79 — but a keeper is replaced only by a bench GK, and
    // this fixture has none: the keeper keeps the shirt, and the tired outfield
    // chain (D1, then D2, then D3) rotates in S1/S2/S3. sub-event playerId = the
    // OUTGOING player (CM-025); subInId/subOutId and the name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 2, subInId: 12, subOutId: 2, playerName: 'Home FC D1', subInName: 'Home FC S1', subOutName: 'Home FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 77, type: 'sub', team: 'away', playerId: 102, subInId: 114, subOutId: 102, playerName: 'Away FC D1', subInName: 'Away FC S3', subOutName: 'Away FC D1' },
  { minute: 78, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 78, type: 'goal', team: 'home', playerId: 9, assistId: 11, chanceType: 'one-on-one' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 3, subInId: 13, subOutId: 3, playerName: 'Home FC D2', subInName: 'Home FC S2', subOutName: 'Home FC D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 103, subInId: 112, subOutId: 103, playerName: 'Away FC D2', subInName: 'Away FC S1', subOutName: 'Away FC D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 4, subInId: 14, subOutId: 4, playerName: 'Home FC D3', subInName: 'Home FC S3', subOutName: 'Home FC D3' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 104, subInId: 113, subOutId: 104, playerName: 'Away FC D3', subInName: 'Away FC S2', subOutName: 'Away FC D3' },
  { minute: 82, type: 'foul', team: 'home', playerId: 8, playerName: 'Home FC M3' },
  { minute: 84, type: 'corner', team: 'away', playerId: 105, setPiece: 'corner', playerName: 'Away FC D4' },
  { minute: 84, type: 'miss', team: 'away', playerId: 105, setPiece: 'corner', keeperId: 1, playerName: 'Away FC D4' },
  { minute: 86, type: 'foul', team: 'away', playerId: 112, playerName: 'Away FC S1' },
  { minute: 86, type: 'yellow', team: 'home', playerId: 1 },
  { minute: 89, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 89, type: 'goal', team: 'home', playerId: 9, assistId: 7, chanceType: 'one-on-one' },
  { minute: 90, type: 'chance', team: 'away', playerId: 109, chanceType: 'long-shot' },
  { minute: 90, type: 'save', team: 'away', playerId: 109, chanceType: 'long-shot', keeperId: 1 },
  { minute: 90, type: 'corner', team: 'home', playerId: 5, setPiece: 'corner', playerName: 'Home FC D4' },
];

const EVENTS_169: PinnedEvent[] = [
  { minute: 1, type: 'offside', team: 'home', playerId: 11, playerName: 'Home FC A3' },
    // PINNED-BEHAVIOR (CM-025): set-piece takers = the best setPieces among the
    // on-pitch non-GK players — every uniform attribute ties at 10, so the
    // lowest-id tie-break rules (home ids 2/4, away ids 102/103/105); the old
    // GK-in-pool pins are gone.
  { minute: 6, type: 'freeKick', team: 'home', playerId: 2, setPiece: 'freeKick', playerName: 'Home FC D1' },
  { minute: 7, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 7, type: 'miss', team: 'away', playerId: 102, setPiece: 'corner', keeperId: 1, playerName: 'Away FC D1' },
  { minute: 7, type: 'foul', team: 'away', playerId: 111, playerName: 'Away FC A3' },
  { minute: 12, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 12, type: 'goal', team: 'home', playerId: 9, assistId: 7, chanceType: 'one-on-one' },
  { minute: 13, type: 'chance', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 13, type: 'goal', team: 'away', playerId: 110, assistId: 106, chanceType: 'through-ball' },
  { minute: 13, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 13, type: 'yellow', team: 'home', playerId: 6 },
    // PINNED-BEHAVIOR (CM-025): this stream's injuries recover — the flag clears
    // for each (the old inverted pin kept recovered players flagged).
  { minute: 18, type: 'injury', team: 'home', playerId: 4, recovered: true },
  { minute: 19, type: 'offside', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 22, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away FC D1' },
  { minute: 23, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 23, type: 'save', team: 'home', playerId: 11, chanceType: 'cross', keeperId: 101 },
  { minute: 23, type: 'foul', team: 'home', playerId: 11, playerName: 'Home FC A3' },
  { minute: 24, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 26, type: 'chance', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 26, type: 'save', team: 'away', playerId: 110, chanceType: 'through-ball', keeperId: 1 },
  { minute: 27, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away FC D1' },
  { minute: 27, type: 'miss', team: 'away', playerId: 102, setPiece: 'freeKick', keeperId: 1, playerName: 'Away FC D1' },
  { minute: 27, type: 'foul', team: 'away', playerId: 108, playerName: 'Away FC M3' },
  { minute: 28, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 28, type: 'yellow', team: 'away', playerId: 102 },
  { minute: 32, type: 'foul', team: 'home', playerId: 9, playerName: 'Home FC A1' },
  { minute: 33, type: 'freeKick', team: 'home', playerId: 2, setPiece: 'freeKick', playerName: 'Home FC D1' },
  { minute: 33, type: 'goal', team: 'home', playerId: 2, setPiece: 'freeKick', keeperId: 101, playerName: 'Home FC D1' },
  { minute: 34, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 34, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 36, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 38, type: 'freeKick', team: 'home', playerId: 2, setPiece: 'freeKick', playerName: 'Home FC D1' },
  { minute: 39, type: 'chance', team: 'away', playerId: 109, chanceType: 'one-on-one' },
  { minute: 39, type: 'goal', team: 'away', playerId: 109, assistId: 107, chanceType: 'one-on-one' },
  { minute: 39, type: 'foul', team: 'home', playerId: 10, playerName: 'Home FC A2' },
  { minute: 42, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 45, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 45, type: 'save', team: 'home', playerId: 9, chanceType: 'header', keeperId: 101 },
  { minute: 48, type: 'offside', team: 'away', playerId: 110, playerName: 'Away FC A2' },
  { minute: 50, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
  { minute: 50, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away FC D1' },
  { minute: 50, type: 'miss', team: 'away', playerId: 102, setPiece: 'freeKick', keeperId: 1, playerName: 'Away FC D1' },
  { minute: 52, type: 'chance', team: 'away', playerId: 111, chanceType: 'cross' },
  { minute: 52, type: 'miss', team: 'away', playerId: 111, chanceType: 'cross' },
  { minute: 56, type: 'chance', team: 'home', playerId: 9, chanceType: 'cross' },
  { minute: 56, type: 'miss', team: 'home', playerId: 9, chanceType: 'cross' },
  { minute: 56, type: 'offside', team: 'away', playerId: 111, playerName: 'Away FC A3' },
  { minute: 63, type: 'injury', team: 'away', playerId: 109, recovered: true },
  { minute: 64, type: 'chance', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 64, type: 'save', team: 'away', playerId: 110, chanceType: 'through-ball', keeperId: 1 },
  { minute: 67, type: 'chance', team: 'home', playerId: 11, chanceType: 'header' },
  { minute: 67, type: 'miss', team: 'home', playerId: 11, chanceType: 'header' },
  { minute: 71, type: 'corner', team: 'home', playerId: 2, setPiece: 'corner', playerName: 'Home FC D1' },
    // PINNED-BEHAVIOR: ownGoal — team/playerId describe the victim side;
    // creditTeam carries the beneficiary (the renderer reconciles the
    // scoreline from creditTeam).
  { minute: 71, type: 'ownGoal', team: 'home', playerId: 3, creditTeam: 'away', playerName: 'Home FC D2' },
  { minute: 73, type: 'yellow', team: 'away', playerId: 108 },
  { minute: 77, type: 'chance', team: 'away', playerId: 111, chanceType: 'cross' },
  { minute: 77, type: 'miss', team: 'away', playerId: 111, chanceType: 'cross' },
  { minute: 77, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away FC D1' },
  { minute: 77, type: 'save', team: 'away', playerId: 102, setPiece: 'corner', keeperId: 1, playerName: 'Away FC D1' },
    // PINNED-BEHAVIOR (CM-025): updateStamina has no RNG, so subs still land at
    // minutes 77/77/78/78/79/79 — but a keeper is replaced only by a bench GK, and
    // this fixture has none: the keeper keeps the shirt, and the tired outfield
    // chain (D1, then D2, then D3) rotates in S1/S2/S3. sub-event playerId = the
    // OUTGOING player (CM-025); subInId/subOutId and the name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 2, subInId: 14, subOutId: 2, playerName: 'Home FC D1', subInName: 'Home FC S3', subOutName: 'Home FC D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 77, type: 'sub', team: 'away', playerId: 102, subInId: 112, subOutId: 102, playerName: 'Away FC D1', subInName: 'Away FC S1', subOutName: 'Away FC D1' },
  { minute: 78, type: 'chance', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 78, type: 'miss', team: 'home', playerId: 11, chanceType: 'cross' },
  { minute: 78, type: 'corner', team: 'away', playerId: 103, setPiece: 'corner', playerName: 'Away FC D2' },
  { minute: 78, type: 'miss', team: 'away', playerId: 103, setPiece: 'corner', keeperId: 1, playerName: 'Away FC D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 3, subInId: 12, subOutId: 3, playerName: 'Home FC D2', subInName: 'Home FC S1', subOutName: 'Home FC D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 103, subInId: 113, subOutId: 103, playerName: 'Away FC D2', subInName: 'Away FC S2', subOutName: 'Away FC D2' },
  { minute: 79, type: 'freeKick', team: 'home', playerId: 4, setPiece: 'freeKick', playerName: 'Home FC D3' },
  { minute: 79, type: 'miss', team: 'home', playerId: 4, setPiece: 'freeKick', keeperId: 101, playerName: 'Home FC D3' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 4, subInId: 13, subOutId: 4, playerName: 'Home FC D3', subInName: 'Home FC S2', subOutName: 'Home FC D3' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 104, subInId: 114, subOutId: 104, playerName: 'Away FC D3', subInName: 'Away FC S3', subOutName: 'Away FC D3' },
  { minute: 82, type: 'freeKick', team: 'away', playerId: 105, setPiece: 'freeKick', playerName: 'Away FC D4' },
  { minute: 82, type: 'miss', team: 'away', playerId: 105, setPiece: 'freeKick', keeperId: 1, playerName: 'Away FC D4' },
  { minute: 83, type: 'foul', team: 'away', playerId: 108, playerName: 'Away FC M3' },
  { minute: 87, type: 'foul', team: 'away', playerId: 111, playerName: 'Away FC A3' },
  { minute: 88, type: 'corner', team: 'away', playerId: 105, setPiece: 'corner', playerName: 'Away FC D4' },
  { minute: 89, type: 'chance', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 89, type: 'miss', team: 'home', playerId: 9, chanceType: 'one-on-one' },
  { minute: 90, type: 'chance', team: 'away', playerId: 110, chanceType: 'header' },
  { minute: 90, type: 'save', team: 'away', playerId: 110, chanceType: 'header', keeperId: 1 },
];

// ASYMMETRIC fixture (R1-01): differentiated keepers + set-piece specialists.
const EVENTS_10: PinnedEvent[] = [
  { minute: 1, type: 'yellow', team: 'home', playerId: 4 },
  { minute: 2, type: 'foul', team: 'away', playerId: 102, playerName: 'Away Rovers D1' },
    // PINNED-BEHAVIOR (CM-025): this stream's injuries recover — the flag clears
    // for each (the old inverted pin kept recovered players flagged).
  { minute: 3, type: 'injury', team: 'home', playerId: 10, recovered: true },
    // PINNED-BEHAVIOR (CM-025): the taker is the best setPieces among the on-pitch
    // non-GK players — every away Rovers setPieces ties at 10, so the lowest-id
    // tie-break takes over (D1, id 102; after the min-77 rotation, 105).
  { minute: 4, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away Rovers D1' },
  { minute: 11, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 11, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 11, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away Rovers D1' },
  { minute: 13, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away Rovers D1' },
  { minute: 14, type: 'chance', team: 'away', playerId: 111, chanceType: 'header' },
  { minute: 14, type: 'miss', team: 'away', playerId: 111, chanceType: 'header' },
    // PINNED-BEHAVIOR (CM-025): the setPieces-20 specialist (M2, id 7) is the home
    // taker for every home set piece — the old corners/freeKicks-only ranking
    // that ignored setPieces entirely is gone.
  { minute: 20, type: 'corner', team: 'home', playerId: 7, setPiece: 'corner', playerName: 'Home United M2' },
  { minute: 21, type: 'chance', team: 'home', playerId: 10, chanceType: 'long-shot' },
  { minute: 21, type: 'save', team: 'home', playerId: 10, chanceType: 'long-shot', keeperId: 101 },
  { minute: 21, type: 'foul', team: 'away', playerId: 107, playerName: 'Away Rovers M2' },
  { minute: 23, type: 'corner', team: 'home', playerId: 7, setPiece: 'corner', playerName: 'Home United M2' },
  { minute: 25, type: 'corner', team: 'home', playerId: 7, setPiece: 'corner', playerName: 'Home United M2' },
  { minute: 25, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away Rovers D1' },
  { minute: 27, type: 'chance', team: 'away', playerId: 109, chanceType: 'header' },
  { minute: 27, type: 'save', team: 'away', playerId: 109, chanceType: 'header', keeperId: 1 },
  { minute: 30, type: 'yellow', team: 'home', playerId: 8 },
  { minute: 31, type: 'chance', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 31, type: 'miss', team: 'home', playerId: 9, chanceType: 'through-ball' },
  { minute: 32, type: 'corner', team: 'home', playerId: 7, setPiece: 'corner', playerName: 'Home United M2' },
  { minute: 32, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away Rovers D1' },
  { minute: 37, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away Rovers D1' },
  { minute: 39, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away Rovers D1' },
  { minute: 40, type: 'chance', team: 'away', playerId: 111, chanceType: 'one-on-one' },
  { minute: 40, type: 'save', team: 'away', playerId: 111, chanceType: 'one-on-one', keeperId: 1 },
  { minute: 40, type: 'freeKick', team: 'away', playerId: 102, setPiece: 'freeKick', playerName: 'Away Rovers D1' },
  { minute: 40, type: 'miss', team: 'away', playerId: 102, setPiece: 'freeKick', keeperId: 1, playerName: 'Away Rovers D1' },
  { minute: 41, type: 'chance', team: 'home', playerId: 10, chanceType: 'cross' },
  { minute: 41, type: 'save', team: 'home', playerId: 10, chanceType: 'cross', keeperId: 101 },
  { minute: 44, type: 'foul', team: 'away', playerId: 102, playerName: 'Away Rovers D1' },
  { minute: 46, type: 'foul', team: 'home', playerId: 3, playerName: 'Home United D2' },
  { minute: 46, type: 'foul', team: 'away', playerId: 105, playerName: 'Away Rovers D4' },
  { minute: 51, type: 'chance', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 51, type: 'miss', team: 'home', playerId: 10, chanceType: 'through-ball' },
  { minute: 53, type: 'chance', team: 'away', playerId: 109, chanceType: 'cross' },
  { minute: 53, type: 'miss', team: 'away', playerId: 109, chanceType: 'cross' },
  { minute: 59, type: 'corner', team: 'home', playerId: 7, setPiece: 'corner', playerName: 'Home United M2' },
  { minute: 59, type: 'injury', team: 'away', playerId: 107, recovered: true },
  { minute: 59, type: 'injury', team: 'away', playerId: 110, recovered: true },
  { minute: 62, type: 'chance', team: 'home', playerId: 11, chanceType: 'header' },
  { minute: 62, type: 'goal', team: 'home', playerId: 11, assistId: 10, chanceType: 'header' },
  { minute: 64, type: 'foul', team: 'home', playerId: 4, playerName: 'Home United D3' },
  { minute: 65, type: 'offside', team: 'away', playerId: 111, playerName: 'Away Rovers A3' },
  { minute: 67, type: 'chance', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 67, type: 'miss', team: 'away', playerId: 110, chanceType: 'through-ball' },
  { minute: 68, type: 'foul', team: 'home', playerId: 10, playerName: 'Home United A2' },
  { minute: 69, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away Rovers D1' },
  { minute: 71, type: 'foul', team: 'home', playerId: 7, playerName: 'Home United M2' },
  { minute: 72, type: 'chance', team: 'home', playerId: 10, chanceType: 'long-shot' },
  { minute: 72, type: 'miss', team: 'home', playerId: 10, chanceType: 'long-shot' },
  { minute: 72, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away Rovers D1' },
  { minute: 76, type: 'corner', team: 'away', playerId: 102, setPiece: 'corner', playerName: 'Away Rovers D1' },
  { minute: 77, type: 'offside', team: 'home', playerId: 9, playerName: 'Home United A1' },
    // PINNED-BEHAVIOR (CM-025): updateStamina has no RNG, so subs still land at
    // minutes 77/77/78/78/79/79 — but a keeper is replaced only by a bench GK, and
    // this fixture has none: the keeper keeps the shirt, and the tired outfield
    // chain (D1, then D2, then D3) rotates in S1/S2/S3. sub-event playerId = the
    // OUTGOING player (CM-025); subInId/subOutId and the name extras carry the swap.
  { minute: 77, type: 'sub', team: 'home', playerId: 2, subInId: 12, subOutId: 2, playerName: 'Home United D1', subInName: 'Home United S1', subOutName: 'Home United D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 77, type: 'sub', team: 'away', playerId: 102, subInId: 114, subOutId: 102, playerName: 'Away Rovers D1', subInName: 'Away Rovers S3', subOutName: 'Away Rovers D1' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'home', playerId: 3, subInId: 13, subOutId: 3, playerName: 'Home United D2', subInName: 'Home United S2', subOutName: 'Home United D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 78, type: 'sub', team: 'away', playerId: 103, subInId: 112, subOutId: 103, playerName: 'Away Rovers D2', subInName: 'Away Rovers S1', subOutName: 'Away Rovers D2' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'home', playerId: 4, subInId: 14, subOutId: 4, playerName: 'Home United D3', subInName: 'Home United S3', subOutName: 'Home United D3' },
    // PINNED-BEHAVIOR: fixed sub timing — see the min-77 comment above.
  { minute: 79, type: 'sub', team: 'away', playerId: 104, subInId: 113, subOutId: 104, playerName: 'Away Rovers D3', subInName: 'Away Rovers S2', subOutName: 'Away Rovers D3' },
  { minute: 80, type: 'chance', team: 'away', playerId: 109, chanceType: 'cross' },
  { minute: 80, type: 'save', team: 'away', playerId: 109, chanceType: 'cross', keeperId: 1 },
  { minute: 82, type: 'chance', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 82, type: 'miss', team: 'home', playerId: 9, chanceType: 'header' },
  { minute: 82, type: 'freeKick', team: 'away', playerId: 105, setPiece: 'freeKick', playerName: 'Away Rovers D4' },
  { minute: 82, type: 'miss', team: 'away', playerId: 105, setPiece: 'freeKick', keeperId: 1, playerName: 'Away Rovers D4' },
  { minute: 82, type: 'foul', team: 'away', playerId: 113, playerName: 'Away Rovers S2' },
  { minute: 83, type: 'corner', team: 'away', playerId: 105, setPiece: 'corner', playerName: 'Away Rovers D4' },
  { minute: 83, type: 'miss', team: 'away', playerId: 105, setPiece: 'corner', keeperId: 1, playerName: 'Away Rovers D4' },
  { minute: 86, type: 'freeKick', team: 'home', playerId: 7, setPiece: 'freeKick', playerName: 'Home United M2' },
];

// --- Pinned rendered-line routing (production renderer, en) ---

const RENDERED_1080: PinnedLine[] = [
  { minute: 0, key: 'kickoff', type: 'chance', team: 'home' },
  { minute: 3, key: 'offside', type: 'offside', team: 'home' },
  { minute: 3, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 4, key: 'offside', type: 'offside', team: 'home' },
  { minute: 7, key: 'penalty', type: 'penalty', team: 'home' },
  { minute: 8, key: 'foul', type: 'foul', team: 'home' },
  { minute: 12, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 12, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 13, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 13, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 17, key: 'offside', type: 'offside', team: 'home' },
  { minute: 22, key: 'foul', type: 'foul', team: 'away' },
  { minute: 23, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 23, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 23, key: 'foul', type: 'foul', team: 'home' },
  { minute: 24, key: 'corner', type: 'corner', team: 'away' },
  { minute: 26, key: 'chance.long-shot', type: 'chance', team: 'away' },
  { minute: 26, key: 'miss.long-shot', type: 'miss', team: 'away' },
  { minute: 27, key: 'corner', type: 'corner', team: 'home' },
  { minute: 28, key: 'injury', type: 'injury', team: 'away' },
  { minute: 34, key: 'chance.long-shot', type: 'chance', team: 'home' },
  { minute: 34, key: 'save.long-shot', type: 'save', team: 'home' },
  { minute: 37, key: 'injury', type: 'injury', team: 'away' },
  { minute: 38, key: 'foul', type: 'foul', team: 'home' },
  { minute: 39, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 39, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 40, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 41, key: 'foul', type: 'foul', team: 'home' },
  { minute: 41, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 44, key: 'corner', type: 'corner', team: 'home' },
  { minute: 44, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 45, key: 'chance.long-shot', type: 'chance', team: 'home' },
  { minute: 45, key: 'save.long-shot', type: 'save', team: 'home' },
  { minute: 48, key: 'offside', type: 'offside', team: 'home' },
  { minute: 50, key: 'corner', type: 'corner', team: 'home' },
  { minute: 51, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 52, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 52, key: 'save.through-ball', type: 'save', team: 'away' },
  { minute: 52, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 54, key: 'foul', type: 'foul', team: 'home' },
  { minute: 55, key: 'injury.recovers', type: 'injury', team: 'home' },
  { minute: 56, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 56, key: 'miss.one-on-one', type: 'miss', team: 'home' },
  { minute: 62, key: 'corner', type: 'corner', team: 'home' },
  { minute: 62, key: 'second-yellow', type: 'red', team: 'home' },
  { minute: 63, key: 'corner', type: 'corner', team: 'home' },
  { minute: 64, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 64, key: 'miss.one-on-one', type: 'miss', team: 'away' },
  { minute: 65, key: 'corner', type: 'corner', team: 'away' },
  { minute: 67, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 67, key: 'save.one-on-one', type: 'save', team: 'home' },
  { minute: 67, key: 'corner', type: 'corner', team: 'away' },
  { minute: 70, key: 'second-yellow', type: 'red', team: 'away' },
  { minute: 73, key: 'offside', type: 'offside', team: 'away' },
  { minute: 77, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 77, key: 'save.one-on-one', type: 'save', team: 'away' },
  { minute: 77, key: 'foul', type: 'foul', team: 'away' },
  { minute: 77, key: 'sub', type: 'sub', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'away' },
  { minute: 78, key: 'chance.long-shot', type: 'chance', team: 'home' },
  { minute: 78, key: 'miss.long-shot', type: 'miss', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'away' },
  { minute: 79, key: 'sub', type: 'sub', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'away' },
  { minute: 82, key: 'corner', type: 'corner', team: 'home' },
  { minute: 84, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 87, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 89, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 89, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 90, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 90, key: 'goal.cross', type: 'goal', team: 'away' },
  { minute: 90, key: 'full-time', type: 'chance', team: 'home' },
];

const RENDERED_12: PinnedLine[] = [
  { minute: 0, key: 'kickoff', type: 'chance', team: 'home' },
  { minute: 1, key: 'corner', type: 'corner', team: 'home' },
  { minute: 2, key: 'foul', type: 'foul', team: 'home' },
  { minute: 4, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 4, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 7, key: 'corner', type: 'corner', team: 'home' },
  { minute: 12, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 12, key: 'assist', type: 'assist', team: 'home' },
  { minute: 12, key: 'goal.header', type: 'goal', team: 'home' },
  { minute: 13, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 13, key: 'miss.one-on-one', type: 'miss', team: 'away' },
  { minute: 13, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 19, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 19, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 23, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 23, key: 'assist', type: 'assist', team: 'home' },
  { minute: 23, key: 'goal.through-ball', type: 'goal', team: 'home' },
  { minute: 26, key: 'chance.long-shot', type: 'chance', team: 'away' },
  { minute: 26, key: 'miss.long-shot', type: 'miss', team: 'away' },
  { minute: 29, key: 'foul', type: 'foul', team: 'away' },
  { minute: 30, key: 'foul', type: 'foul', team: 'away' },
  { minute: 32, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 34, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 34, key: 'miss.header', type: 'miss', team: 'home' },
  { minute: 36, key: 'corner', type: 'corner', team: 'away' },
  { minute: 36, key: 'offside', type: 'offside', team: 'home' },
  { minute: 37, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 39, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 39, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 45, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 45, key: 'miss.header', type: 'miss', team: 'home' },
  { minute: 47, key: 'corner', type: 'corner', team: 'home' },
  { minute: 51, key: 'foul', type: 'foul', team: 'away' },
  { minute: 52, key: 'chance.long-shot', type: 'chance', team: 'away' },
  { minute: 52, key: 'miss.long-shot', type: 'miss', team: 'away' },
  { minute: 53, key: 'missedPenalty', type: 'missedPenalty', team: 'away' },
  { minute: 54, key: 'corner', type: 'corner', team: 'away' },
  { minute: 54, key: 'foul', type: 'foul', team: 'away' },
  { minute: 56, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 56, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 58, key: 'corner', type: 'corner', team: 'home' },
  { minute: 58, key: 'corner', type: 'corner', team: 'away' },
  { minute: 60, key: 'corner', type: 'corner', team: 'away' },
  { minute: 60, key: 'foul', type: 'foul', team: 'home' },
  { minute: 64, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 64, key: 'save.through-ball', type: 'save', team: 'away' },
  { minute: 65, key: 'corner', type: 'corner', team: 'home' },
  { minute: 65, key: 'injury.recovers', type: 'injury', team: 'away' },
  { minute: 66, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 66, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 67, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 67, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 69, key: 'corner', type: 'corner', team: 'away' },
  { minute: 70, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 72, key: 'corner', type: 'corner', team: 'home' },
  { minute: 74, key: 'foul', type: 'foul', team: 'home' },
  { minute: 75, key: 'corner', type: 'corner', team: 'away' },
  { minute: 75, key: 'foul', type: 'foul', team: 'away' },
  { minute: 77, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 77, key: 'save.one-on-one', type: 'save', team: 'away' },
  { minute: 77, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 77, key: 'sub', type: 'sub', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'away' },
  { minute: 78, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 78, key: 'assist', type: 'assist', team: 'home' },
  { minute: 78, key: 'goal.one-on-one', type: 'goal', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'away' },
  { minute: 79, key: 'sub', type: 'sub', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'away' },
  { minute: 82, key: 'foul', type: 'foul', team: 'home' },
  { minute: 84, key: 'corner', type: 'corner', team: 'away' },
  { minute: 84, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 86, key: 'foul', type: 'foul', team: 'away' },
  { minute: 86, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 89, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 89, key: 'assist', type: 'assist', team: 'home' },
  { minute: 89, key: 'goal.one-on-one', type: 'goal', team: 'home' },
  { minute: 90, key: 'chance.long-shot', type: 'chance', team: 'away' },
  { minute: 90, key: 'save.long-shot', type: 'save', team: 'away' },
  { minute: 90, key: 'corner', type: 'corner', team: 'home' },
  { minute: 90, key: 'full-time', type: 'chance', team: 'home' },
];

const RENDERED_169: PinnedLine[] = [
  { minute: 0, key: 'kickoff', type: 'chance', team: 'home' },
  { minute: 1, key: 'offside', type: 'offside', team: 'home' },
  { minute: 6, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 7, key: 'corner', type: 'corner', team: 'away' },
  { minute: 7, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 7, key: 'foul', type: 'foul', team: 'away' },
  { minute: 12, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 12, key: 'assist', type: 'assist', team: 'home' },
  { minute: 12, key: 'goal.one-on-one', type: 'goal', team: 'home' },
  { minute: 13, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 13, key: 'assist', type: 'assist', team: 'away' },
  { minute: 13, key: 'goal.through-ball', type: 'goal', team: 'away' },
  { minute: 13, key: 'corner', type: 'corner', team: 'away' },
  { minute: 13, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 18, key: 'injury.recovers', type: 'injury', team: 'home' },
  { minute: 19, key: 'offside', type: 'offside', team: 'home' },
  { minute: 22, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 23, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 23, key: 'save.cross', type: 'save', team: 'home' },
  { minute: 23, key: 'foul', type: 'foul', team: 'home' },
  { minute: 24, key: 'corner', type: 'corner', team: 'away' },
  { minute: 26, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 26, key: 'save.through-ball', type: 'save', team: 'away' },
  { minute: 27, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 27, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 27, key: 'foul', type: 'foul', team: 'away' },
  { minute: 28, key: 'corner', type: 'corner', team: 'home' },
  { minute: 28, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 32, key: 'foul', type: 'foul', team: 'home' },
  { minute: 33, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 33, key: 'setpiece.goal', type: 'goal', team: 'home' },
  { minute: 34, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 34, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 36, key: 'corner', type: 'corner', team: 'away' },
  { minute: 38, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 39, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 39, key: 'assist', type: 'assist', team: 'away' },
  { minute: 39, key: 'goal.one-on-one', type: 'goal', team: 'away' },
  { minute: 39, key: 'foul', type: 'foul', team: 'home' },
  { minute: 42, key: 'corner', type: 'corner', team: 'home' },
  { minute: 45, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 45, key: 'save.header', type: 'save', team: 'home' },
  { minute: 48, key: 'offside', type: 'offside', team: 'away' },
  { minute: 50, key: 'corner', type: 'corner', team: 'home' },
  { minute: 50, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 50, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 52, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 52, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 56, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 56, key: 'miss.cross', type: 'miss', team: 'home' },
  { minute: 56, key: 'offside', type: 'offside', team: 'away' },
  { minute: 63, key: 'injury.recovers', type: 'injury', team: 'away' },
  { minute: 64, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 64, key: 'save.through-ball', type: 'save', team: 'away' },
  { minute: 67, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 67, key: 'miss.header', type: 'miss', team: 'home' },
  { minute: 71, key: 'corner', type: 'corner', team: 'home' },
  { minute: 71, key: 'ownGoal', type: 'ownGoal', team: 'home' },
  { minute: 73, key: 'yellow', type: 'yellow', team: 'away' },
  { minute: 77, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 77, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 77, key: 'corner', type: 'corner', team: 'away' },
  { minute: 77, key: 'setpiece.save', type: 'save', team: 'away' },
  { minute: 77, key: 'sub', type: 'sub', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'away' },
  { minute: 78, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 78, key: 'miss.cross', type: 'miss', team: 'home' },
  { minute: 78, key: 'corner', type: 'corner', team: 'away' },
  { minute: 78, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 78, key: 'sub', type: 'sub', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'away' },
  { minute: 79, key: 'freeKick', type: 'freeKick', team: 'home' },
  { minute: 79, key: 'setpiece.miss', type: 'miss', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'away' },
  { minute: 82, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 82, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 83, key: 'foul', type: 'foul', team: 'away' },
  { minute: 87, key: 'foul', type: 'foul', team: 'away' },
  { minute: 88, key: 'corner', type: 'corner', team: 'away' },
  { minute: 89, key: 'chance.one-on-one', type: 'chance', team: 'home' },
  { minute: 89, key: 'miss.one-on-one', type: 'miss', team: 'home' },
  { minute: 90, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 90, key: 'save.header', type: 'save', team: 'away' },
  { minute: 90, key: 'full-time', type: 'chance', team: 'home' },
];

const RENDERED_10: PinnedLine[] = [
  { minute: 0, key: 'kickoff', type: 'chance', team: 'home' },
  { minute: 1, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 2, key: 'foul', type: 'foul', team: 'away' },
  { minute: 3, key: 'injury.recovers', type: 'injury', team: 'home' },
  { minute: 4, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 11, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 11, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 11, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 13, key: 'corner', type: 'corner', team: 'away' },
  { minute: 14, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 14, key: 'miss.header', type: 'miss', team: 'away' },
  { minute: 20, key: 'corner', type: 'corner', team: 'home' },
  { minute: 21, key: 'chance.long-shot', type: 'chance', team: 'home' },
  { minute: 21, key: 'save.long-shot', type: 'save', team: 'home' },
  { minute: 21, key: 'foul', type: 'foul', team: 'away' },
  { minute: 23, key: 'corner', type: 'corner', team: 'home' },
  { minute: 25, key: 'corner', type: 'corner', team: 'home' },
  { minute: 25, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 27, key: 'chance.header', type: 'chance', team: 'away' },
  { minute: 27, key: 'save.header', type: 'save', team: 'away' },
  { minute: 30, key: 'yellow', type: 'yellow', team: 'home' },
  { minute: 31, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 31, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 32, key: 'corner', type: 'corner', team: 'home' },
  { minute: 32, key: 'corner', type: 'corner', team: 'away' },
  { minute: 37, key: 'corner', type: 'corner', team: 'away' },
  { minute: 39, key: 'corner', type: 'corner', team: 'away' },
  { minute: 40, key: 'chance.one-on-one', type: 'chance', team: 'away' },
  { minute: 40, key: 'save.one-on-one', type: 'save', team: 'away' },
  { minute: 40, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 40, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 41, key: 'chance.cross', type: 'chance', team: 'home' },
  { minute: 41, key: 'save.cross', type: 'save', team: 'home' },
  { minute: 44, key: 'foul', type: 'foul', team: 'away' },
  { minute: 46, key: 'foul', type: 'foul', team: 'home' },
  { minute: 46, key: 'foul', type: 'foul', team: 'away' },
  { minute: 51, key: 'chance.through-ball', type: 'chance', team: 'home' },
  { minute: 51, key: 'miss.through-ball', type: 'miss', team: 'home' },
  { minute: 53, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 53, key: 'miss.cross', type: 'miss', team: 'away' },
  { minute: 59, key: 'corner', type: 'corner', team: 'home' },
  { minute: 59, key: 'injury.recovers', type: 'injury', team: 'away' },
  { minute: 59, key: 'injury.recovers', type: 'injury', team: 'away' },
  { minute: 62, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 62, key: 'assist', type: 'assist', team: 'home' },
  { minute: 62, key: 'goal.header', type: 'goal', team: 'home' },
  { minute: 64, key: 'foul', type: 'foul', team: 'home' },
  { minute: 65, key: 'offside', type: 'offside', team: 'away' },
  { minute: 67, key: 'chance.through-ball', type: 'chance', team: 'away' },
  { minute: 67, key: 'miss.through-ball', type: 'miss', team: 'away' },
  { minute: 68, key: 'foul', type: 'foul', team: 'home' },
  { minute: 69, key: 'corner', type: 'corner', team: 'away' },
  { minute: 71, key: 'foul', type: 'foul', team: 'home' },
  { minute: 72, key: 'chance.long-shot', type: 'chance', team: 'home' },
  { minute: 72, key: 'miss.long-shot', type: 'miss', team: 'home' },
  { minute: 72, key: 'corner', type: 'corner', team: 'away' },
  { minute: 76, key: 'corner', type: 'corner', team: 'away' },
  { minute: 77, key: 'offside', type: 'offside', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'home' },
  { minute: 77, key: 'sub', type: 'sub', team: 'away' },
  { minute: 78, key: 'sub', type: 'sub', team: 'home' },
  { minute: 78, key: 'sub', type: 'sub', team: 'away' },
  { minute: 79, key: 'sub', type: 'sub', team: 'home' },
  { minute: 79, key: 'sub', type: 'sub', team: 'away' },
  { minute: 80, key: 'chance.cross', type: 'chance', team: 'away' },
  { minute: 80, key: 'save.cross', type: 'save', team: 'away' },
  { minute: 82, key: 'chance.header', type: 'chance', team: 'home' },
  { minute: 82, key: 'miss.header', type: 'miss', team: 'home' },
  { minute: 82, key: 'freeKick', type: 'freeKick', team: 'away' },
  { minute: 82, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 82, key: 'foul', type: 'foul', team: 'away' },
  { minute: 83, key: 'corner', type: 'corner', team: 'away' },
  { minute: 83, key: 'setpiece.miss', type: 'miss', team: 'away' },
  { minute: 86, key: 'freeKick', type: 'freeKick', team: 'home' },
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
  it('seed 1080: 71-event stream — two second-yellow reds (min 62 (None), min 70 (None)), penalty (min 7), 3 injuries (1 recovered / 2 non-recovered), CM-025 taker rule live; final 1-1', () => {
    const { home, away, result } = runMatch(1080);
    expect(pinEvents(result.events)).toEqual(EVENTS_1080);
    expect([home.goals, away.goals]).toEqual([1, 1]);
    // PINNED-BEHAVIOR (potential bug — out of CM-025 scope): possession in
    // result() is the share of the LEFTOVER CP accumulators (after chance
    // thresholds are subtracted), not total chance points — with the uniform
    // fixture it is seed-independent (always 70/30 here).
    expect([home.possession, away.possession]).toEqual([70, 30]);
    // Post-match state pinned directly (R1-05, CM-025):
    // home [10] off (10-man pitch); away [105] off (10-man pitch).
    // away [103, 104] injured: non-recovered — flagged AND on (the rotation skips injured players).
    // Both keepers keep the shirt (no bench GK in either squad).
    expect(pinState(home)).toEqual({ sentOff: [10], injured: [], onPitch: [1, 5, 6, 7, 8, 9, 11, 12, 13, 14] });
    expect(pinState(away)).toEqual({ sentOff: [105], injured: [103, 104], onPitch: [101, 103, 104, 108, 109, 110, 111, 112, 113, 114] });
  });

  it('seed 12: 76-event stream — missed penalty (min 53), 1 injury (1 recovered), 4 open-play assist goals, CM-025 taker rule live; final 4-0', () => {
    const { home, away, result } = runMatch(12);
    expect(pinEvents(result.events)).toEqual(EVENTS_12);
    expect([home.goals, away.goals]).toEqual([4, 0]);
    // PINNED-BEHAVIOR: possession = leftover-CP share (see the first stream's note).
    expect([home.possession, away.possession]).toEqual([70, 30]);
    // Post-match state pinned directly (R1-05, CM-025):
    // no flags at full time (recovered injuries clear the flag).
    // Both keepers keep the shirt (no bench GK in either squad).
    expect(pinState(home)).toEqual({ sentOff: [], injured: [], onPitch: [1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
    expect(pinState(away)).toEqual({ sentOff: [], injured: [], onPitch: [101, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] });
  });

  it('seed 169: 80-event stream — own goal (min 71), set-piece goal from freeKick (min 33), 2 injuries (2 recovered), 3 open-play assist goals, CM-025 taker rule live; final 2-3', () => {
    const { home, away, result } = runMatch(169);
    expect(pinEvents(result.events)).toEqual(EVENTS_169);
    expect([home.goals, away.goals]).toEqual([2, 3]);
    // PINNED-BEHAVIOR: possession = leftover-CP share (see the first stream's note).
    expect([home.possession, away.possession]).toEqual([70, 30]);
    // Post-match state pinned directly (R1-05, CM-025):
    // no flags at full time (recovered injuries clear the flag).
    // Both keepers keep the shirt (no bench GK in either squad).
    expect(pinState(home)).toEqual({ sentOff: [], injured: [], onPitch: [1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
    expect(pinState(away)).toEqual({ sentOff: [], injured: [], onPitch: [101, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] });
  });
});

describe('CM-022a golden — pinned asymmetric match (differentiated keepers + set-piece specialists, R1-01)', () => {
  it('seed 10: 72-event stream — 3 injuries (3 recovered), 1 open-play assist goal, value-ranked takers: home setPieces-20 specialist id 7 / away lowest-id 102, then 105 post-rotation; final 1-0', () => {
    const { home, away, result } = runAsymMatch(10);
    expect(pinEvents(result.events)).toEqual(EVENTS_10);
    expect([home.goals, away.goals]).toEqual([1, 0]);
    expect([home.possession, away.possession]).toEqual([51, 49]);
    // Post-match state (R1-05, CM-025): all three injuries recover — no flags at
    // full time; the keepers keep the shirt; the away lowest-id taker chain
    // (102, then 105 after the rotation) shows in the late set pieces.
    expect(pinState(home)).toEqual({ sentOff: [], injured: [], onPitch: [1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] });
    expect(pinState(away)).toEqual({ sentOff: [], injured: [], onPitch: [101, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] });
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
        // R2-01 (PR #36 review): assert the identities the routed template actually
        // carries — {keeper} on every save line, plus the shooter {player} when the
        // template has that slot (5 of 7 save-bearing keys; save.long-shot and
        // setpiece.save carry only {keeper}).
        // R1-01 (PR #37 review): count corrected — the template table has 7
        // save-bearing keys, 5 with {player}; "4 of 6" was the fixture-routed subset.
        if (e.keeperId !== undefined) {
          expect(line.text).toContain(ctx.players.get(e.keeperId)!);
        }
        const template = STRINGS.en[line.key as keyof typeof STRINGS.en];
        if (e.playerId !== undefined && template.some((t) => t.includes('{player}'))) {
          expect(line.text).toContain(ctx.players.get(e.playerId)!);
        }
      } else if (e.playerId !== undefined) {
        expect(line.text).toContain(ctx.players.get(e.playerId)!);
      }
    }
    expect(cursor).toBe(lines.length - 1);
  };

  it('seed 1080: every event renders — exact routing incl. second-yellow + penalty (73 lines)', () => {
    const { home, away, result } = runMatch(1080);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(73); // 71 events + kickoff + full-time, no assist lines
    checkSeam(EVENTS_1080, RENDERED_1080, lines, buildRenderContext(home, away));
    expect(lines.find(l => l.key === 'full-time')?.text).toBe('Full-time: Home FC 1-1 Away FC.');
  });

  it('seed 12: every event renders — exact routing incl. missedPenalty + injury.recovers, 4 assist lines (82 lines)', () => {
    const { home, away, result } = runMatch(12);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(82); // 76 events + kickoff + full-time, 4 assist lines
    checkSeam(EVENTS_12, RENDERED_12, lines, buildRenderContext(home, away));
    expect(lines.find(l => l.key === 'full-time')?.text).toBe('Full-time: Home FC 4-0 Away FC.');
  });

  it('seed 169: every event renders — exact routing incl. ownGoal + injury.recovers, 3 assist lines (85 lines)', () => {
    const { home, away, result } = runMatch(169);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(85); // 80 events + kickoff + full-time, 3 assist lines
    checkSeam(EVENTS_169, RENDERED_169, lines, buildRenderContext(home, away));
    expect(lines.find(l => l.key === 'full-time')?.text).toBe('Full-time: Home FC 2-3 Away FC.');
  });

  it('seed 10: every event renders — exact routing incl. injury.recovers + setpiece.miss, 1 assist line (75 lines)', () => {
    const { home, away, result } = runAsymMatch(10);
    const lines = renderPinned(result, home, away);
    expect(lines).toHaveLength(75); // 72 events + kickoff + full-time, 1 assist line
    checkSeam(EVENTS_10, RENDERED_10, lines, buildRenderContext(home, away));
    expect(lines.find(l => l.key === 'full-time')?.text).toBe('Full-time: Home United 1-0 Away Rovers.');
  });
});

describe('CM-022a golden — set-piece resolution unit pins (cascade-free)', () => {
  it('applySetPieceResolution grid: taker × keeper strong/average/weak × corner/freeKick × fixed rolls (the keeper-term pins CM-022e proves)', () => {
    // PINNED-BEHAVIOR: the keeper term is -(keeperStrength - AVERAGE_KEEPER_STRENGTH):
    // a BELOW-average keeper INCREASES conversion, an above-average keeper reduces it.
    // CM-022e (PR E) KEPT this formula and proved its intent (monotonic direction,
    // exactly 0 at AVERAGE, deviation magnitude pinned) in src/lib/tactics/__tests__/
    // setpieces.test.ts — these cells flipped zero times. Any future recalibration
    // must flip them 1:1 and cite a divergence-ledger entry.
    // R2-02 (PR #36 review): whole-array toEqual — a mismatch enumerates ALL flipped
    // cells in one run (divergence-ledger authoring), not just the first.
    const outcomes = GRID.map((cell) => {
      const taker = cell.taker === 'specialist'
        ? (cell.type === 'corner' ? GRID_CORNER_SPECIALIST : GRID_FREEKICK_SPECIALIST)
        : GRID_AVG;
      const rng = { next: () => cell.roll };
      return applySetPieceResolution(taker, GRID_DEFENDERS, GRID_KEEPERS[cell.keeper], rng, cell.type);
    });
    expect(outcomes).toEqual(GRID.map((cell) => cell.outcome));
  });
});

describe('CM-022a golden — determinism', () => {
  it('same seed + fresh teams run twice → deep-equal full streams and scorelines (seeds 1080, 12, 169 uniform + 10 asym)', () => {
    for (const seed of [1080, 12, 169]) {
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
  it('the pinned seeds cover every engine event type and extras family — derived from LIVE engine runs (R1-07, CM-025 reseed)', () => {
    const live = {
      1080: pinEvents(runMatch(1080).result.events),
      12: pinEvents(runMatch(12).result.events),
      169: pinEvents(runMatch(169).result.events),
      10: pinEvents(runAsymMatch(10).result.events),
    };
    // Mandatory categories: corner / freeKick / penalty / red / sub (task spec).
    expect(countBy(live[1080], 'corner')).toBeGreaterThan(0);
    expect(countBy(live[1080], 'freeKick')).toBeGreaterThan(0);
    expect(countBy(live[1080], 'penalty')).toBeGreaterThan(0);
    expect(countBy(live[1080], 'red')).toBeGreaterThan(0);
    expect(countBy(live[1080], 'sub')).toBeGreaterThan(0);
    // Rare categories deliberately covered: missedPenalty (12), ownGoal (169).
    expect(countBy(live[12], 'missedPenalty')).toBeGreaterThan(0);
    expect(countBy(live[169], 'ownGoal')).toBeGreaterThan(0);
    // Extras families across the union.
    const all = [...live[1080], ...live[12], ...live[169], ...live[10]];
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
    // Asymmetric discriminators (CM-025): the setPieces ranking is live — the home
    // setPieces-20 specialist (id 7) takes EVERY home set piece; the away tie at 10
    // resolves to the lowest on-pitch id (102, then 105 post-rotation); the GKs
    // (1/101) and the old corners/freeKicks specialists (6/106/107) never take.
    expect(live[10].some(e => (e.type === 'corner' || e.type === 'freeKick') && e.team === 'home' && e.playerId === 7)).toBe(true);
    expect(live[10].every(e => (e.type !== 'corner' && e.type !== 'freeKick') || e.team !== 'home' || e.playerId === 7)).toBe(true);
    expect(live[10].some(e => (e.type === 'corner' || e.type === 'freeKick') && e.team === 'away' && e.playerId === 102)).toBe(true);
    expect(live[10].every(e => (e.type !== 'corner' && e.type !== 'freeKick') || e.team !== 'away' || e.playerId === 102 || e.playerId === 105)).toBe(true);
    expect(live[10].every(e => (e.type !== 'corner' && e.type !== 'freeKick') || (e.playerId !== 1 && e.playerId !== 101 && e.playerId !== 6 && e.playerId !== 106))).toBe(true);
  });
});
