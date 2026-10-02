# CM-022b — Delete the dead second commentary implementation

## Purpose
Step 2 of the CM-022 split (2026-10-02 PR-34 counsel): with the golden/characterization spec merged first (PR #36 = CM-022a, d0e9c97), delete the production-unused second commentary implementation `src/engine/commentary.ts` — the file left behind since PR #34 round 3 — as a trivially-reviewable, behavior-preserving deletion. No production code path changes: the production renderer is `src/lib/commentary` (driven via `src/store/matchStore`), which is untouched.

## Grep proof of non-reference (pre-deletion, @ d0e9c97)
Full-tree greps for every import/reference of the dead impl:

```
=== engine/commentary (path-style imports) ===
./src/engine/__tests__/golden.match.test.ts:5:// The dead second implementation src/engine/commentary.ts is never imported.
   (comment only — no import)

=== CommentaryService ===
./src/lib/commentary/commentary.ts:54: * CommentaryService — MatchEvent stream -> seeded, deterministic commentary.
   (doc comment in the PRODUCTION lib — names its own contract; lib untouched)
./src/engine/commentary.ts:398/401: (the dead impl's own definition)
./src/engine/__tests__/commentary.test.ts:3: import { CommentaryService } from '../commentary';
./src/engine/__tests__/cm017-fix-round.test.ts:4: import { CommentaryService } from '../commentary';
./src/engine/__tests__/cm017-fix-round.test.ts:109: const service = new CommentaryService({...})   (one test)

=== relative imports ../commentary or ./commentary ===
src/engine/commentaryService.ts:2: export * from './commentary';   (re-export shim of the dead impl)
src/engine/__tests__/commentary.test.ts:3 + src/engine/__tests__/cm017-fix-round.test.ts:4  (tests above)
src/lib/commentary/__tests__/*: import from '../commentary'  (the PRODUCTION lib's own tests — untouched)

=== e2e ===
(no hits, case-insensitive)
```

**Zero production (non-test) files import the dead impl.** The only production-file mention is the `src/lib/commentary/commentary.ts:54` doc comment (the production line — deliberately untouched; it describes the production lib's deterministic-rendering contract, not the deleted class). Post-deletion re-grep: only comments remain (this card's companion test comments).

## What was deleted
| File | Lines | Why |
|---|---|---|
| `src/engine/commentary.ts` | 733 | The dead second implementation (CommentaryService) — production-unused since PR #34 R3 |
| `src/engine/commentaryService.ts` | 2 | Re-export shim (`export * from './commentary'`) of the dead impl only; nothing imports it (grep above), and it cannot compile once the impl is gone. Sanctioned by the CM-022a card ("PR B: delete src/engine/commentary.ts (+ commentaryService.ts) dead impl") |
| `src/engine/__tests__/commentary.test.ts` | 361 (10 tests) | Exists exclusively to test the dead impl — single describe `CommentaryService (CM-017)`, every test's subject is CommentaryService (MatchEngine is only an event source) |

**Surgical test cut (file NOT deleted):** `src/engine/__tests__/cm017-fix-round.test.ts` (264 → 234 lines) is a MIXED file: its F2/F3/F4/F5 tests pin production `MatchEngine`/config contracts and stay. Only the one test that instantiated the dead impl was removed (`F1: every new type renders i18n commentary for en + he with determinism`) along with the now-unused `CommentaryService`/`MatchEvent`/`MatchEventType` imports; its intent (i18n rendering of the new event types, en+he determinism) is pinned more strongly by the CM-022a golden suite on the production renderer. Header comment updated to say so. Deleting the whole file would have deleted live production-engine contracts — explicitly out of scope.

## Test-only MINOR fixes from PR #36 review (ledger items RESOLVED)
- **R2-01 (RESOLVED):** the seam identity walk asserted only the keeper on save lines. Now the save-line assertions match the template's actual placeholders: `{keeper}` always (when `keeperId` present), plus the shooter `{player}` when (and only when) the routed template carries that slot — read from `STRINGS.en[line.key]` itself, so it self-maintains across template changes. Today that is 5 of 7 save-bearing templates (`save`, `save.header`, `save.one-on-one`, `save.cross`, `save.through-ball`); `save.long-shot` and `setpiece.save` remain keeper-only.
- **R2-02 (RESOLVED):** the 48-cell `applySetPieceResolution` grid asserted per-cell in a loop (aborts at the first flipped cell). Now it maps all 48 outcomes and compares with one whole-array `toEqual` against `GRID.map(c => c.outcome)` — a mismatch enumerates ALL flipped cells in one run, which is exactly the divergence-ledger authoring aid PR E needs. Expected data unchanged.

## Golden byte-identity statement
The full suite is green with all pinned assertions unchanged: **643 passed | 2 skipped (645), 22 files** — baseline at d0e9c97 was **654 passed | 2 skipped (656), 23 files**. The −11 tests are exactly the 10 tests of the deleted dead-impl suite + the 1 surgically-removed dead-impl test; no pinned test was weakened. The two MINOR fixes only strengthen assertions (R2-01 adds shooter presence) or change comparison mechanics over the same expected data (R2-02). Every pinned stream, scoreline, rendered line, and grid outcome is byte-identical. `npx tsc -b` clean.

## No production behavior changes
Deleted files were never imported by production code (grep proof above); no production file was modified. Zero engine/renderer behavior delta.

## Deviations from the build+ship policy (disclosed)
- Direct `git rm` of the three files (policy allows the surgical single-file deletion op with grep proof — done and pasted above).
- Direct test-code edits (policy allows dictated exact content): the cm017-fix-round.test.ts surgical cut + the R2-01/R2-02 golden-suite fixes + the golden header comment update. agy was not used — these are small surgical diffs where hand-dictation is lower-risk than an agent round-trip.