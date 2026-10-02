# CM-022a — Golden/characterization tests: the executable reconciliation spec

## Purpose
Pin the current production engine's observable behavior as an **executable spec**, per the 2026-10-02 PR-34 counsel (root cause of the 4 unconverged review rounds: *no frozen ground truth* — "fix the finding" and "introduce a new change" were indistinguishable). PR #34 is closed; the split is PR A (this) → B (delete dead commentary impl) → C (mechanical reconciliation) → D (initPitch idempotency) → E (keeper calibration). **This PR merges before any engine is touched.**

## Lineage note (why the base is `feat/cm-022-reconcile`, not bare main)
The pinned engine is the surviving R4 reconcile lineage (`feat/cm-022-reconcile @ da55bc5`, PR #34's head after round 4) — `src/engine/matchEngine.ts` driving the production renderer `src/lib/commentary` (via `src/store/matchStore`). Bare `main @ e9d1487` predates the CM-017/018/020/021 feature work entirely (its engine emits only `goal`/`save`/`miss` and has no renderer at all), so there is nothing to pin there. `feat/cm-022-reconcile` fully contains main and is the lineage the split PRs B–E modify, so the golden tests stack on it (tiny reviewable diff: tests + this card only) and gate everything that follows.

## Scope
- **Tests only. ZERO production changes.** New files: `src/engine/__tests__/golden.match.test.ts` + `src/engine/__tests__/golden.helpers.ts`.
- Characterizes DEFAULT-config behavior of the production engine + renderer seam. The dead second implementation (`src/engine/commentary.ts`, `src/engine/commentaryService.ts`) is never imported — PR B deletes it.
- NOT pinned (deliberately): template wording in `strings.ts` (only routing keys, line counts, per-event identity, and the full-time scoreline reconciliation are pinned), `description` strings on engine events (redundant with the pinned fields), shots counts, `initPitch` re-`startMatch` idempotency (PR D owns it).

## Canonical fixtures (defined once in `golden.helpers.ts`)
Two fixtures, both 4-4-2 balanced/normal/normal/normal/mixed, run via `new MatchEngine({ seed })` with every other config default:

1. **UNIFORM** (`createGoldenTeam`): all attributes 10, stamina 100, 11 starters + 3 bench (`onPitch: false`). **Player ids are disjoint: home 1–14, away 101–114** — matching production's globally-unique `staffId` invariant so the renderer's player map has no collisions (review R1-02).
2. **ASYMMETRIC** (`createAsymTeam`, review R1-01): Home United — strong keeper (handling 18/reflexes 17/oneOnOnes 16), corner specialist M1 (corners 20, freeKicks 3), setPieces-specialist M2 (setPieces 20, corners 5, freeKicks 5 — never the taker), strong finishers (finishing 18), strong defenders (marking/tackling/positioning 15); Away Rovers — weak keeper (handling 4/reflexes 5/oneOnOnes 6), freeKick specialist M1 (freeKicks 20), corner specialist M2 (corners 18), weak finishers/defenders. Everything else 10 — stamina decay and sub timing stay identical to the uniform fixture.

## Pinned-seed inventory
Uniform sweep 0..999 (default config): corner 999/1000 seeds, freeKick 983, yellow 986, sub 1000, injury 779, penalty 89, red 97, ownGoal 33, missedPenalty 15; set-piece goal/save/miss outcomes 247/168/769; goals with assist 711. Full combo (≥1 penalty + red + sub + corner + freeKick in one match): 8 seeds `[41, 96, 192, 371, 572, 659, 963, 970]`.

Four representative matches pinned in full (exact per-minute event streams incl. extras, scoreline, possession, post-match squad state, rendered key sequence):

| Seed | Fixture | Score | Events | Lines | What it pins |
|---|---|---|---|---|---|
| **41** | uniform | 2-1 | 70 | 73 | early second-yellow red (min 15, home) + 10-man ripple; converted penalty vs real keeper (min 17); set-piece goal from corner (min 35); open-play assist (min 89); NON-recovered injury (min 3); 10 corners, 15 chances |
| **149** | uniform | 2-0 | 76 | 78 | converted penalty (min 72) AND missedPenalty (min 90 — taker is a sub, "keeper" = outfield fallback after the min-77 GK sub); set-piece goal from free kick (min 65); set-piece save (min 78); recovered + non-recovered injuries |
| **686** | uniform | 2-1 | 77 | 79 | ownGoal with `creditTeam` (min 69, away defender credits home); converted penalty (min 48); 6 injuries all `recovered`; set-piece goal (min 70) |
| **10** | asym | 3-0 | 66 | 68 | value-ranked set-piece takers (home corners → M1 id 6; away corners → M2 id 107; away free kicks → M1 id 106; home free kicks → the GK via stable-sort tie; setPieces 20 on id 7 never picked); keeper-term outcomes vs BOTH keepers incl. the GK scoring a free kick (min 61) and a save vs the weak keeper (min 69) |

Union covers every engine-emitted event type (`goal, yellow, red, injury, sub, chance, save, miss, corner, freeKick, penalty, missedPenalty, ownGoal, offside, foul`), every extras family (`chanceType, setPiece, keeperId, subInId/subOutId, secondYellow, recovered, creditTeam, assistId, playerName/subInName/subOutName`), and post-match state (`redCard` sent-off sets, `isInjured` sets per side, final `onPitch` rosters).

**Set-piece resolution unit grid (cascade-free, review R1-01):** `applySetPieceResolution` pinned over taker (corner-specialist / freeKick-specialist / average) × keeper (strong 18/17/16 / average / weak 4/5/6) × corner/freeKick × fixed rolls (0.05/0.35/0.65/0.95) = 48 cells. These are the fine-grained targets PR E's keeper-term recalibration flips 1:1.

## Renderer seam (production `src/lib/commentary`, en)
Per pinned stream: exact line-key routing, line counts, kickoff/full-time framing, **template presence** (`STRINGS.en[key]` defined for every pinned key — a deleted template cannot silently fall back), text sentinels (no unfilled `{slot}`, no `Player <id>` unresolved-name fallback, no malformed empty-slot text), **per-event identity walk** (lines consumed in lockstep with events; every event's line names the right player — the keeper for save lines, subIn/subOut for subs; disjoint ids prove the side), and the full-time line reconciles with the engine scoreline (`creditTeam` accounting).

## Pinned quirks — PINNED-BEHAVIOR comments in the test (potential bugs, NOT fixed here)
1. **Constructor overrides `baseConversionRate`**: effective default is `0.12/0.9 ≈ 0.1333`, not `DEFAULT_MATCH_CONFIG.baseConversionRate = 0.13`.
2. **Possession is leftover-CP share**: `result()` divides the *remaining* CP accumulators, not totals — with uniform squads it is seed-independent (always 70/30).
3. **Deterministic stamina decay → fixed sub timing**: no RNG in `updateStamina`, so with these fixtures every match subs at minutes 77/77/78/78/79/79 and the first sub removes the **goalkeeper** (stable sort picks index 0) with no keeper replacement. After min 77 the team has no GK on pitch, so penalties/own-goal/set-piece resolution fall back to the first on-pitch outfield player as "keeper" (seed 149 min 90: `keeperId=14`; asym seed 10 min 85: `keeperId=12`).
4. **`sub` event `playerId` = the INCOMING player** (R4 flip), plus the shirt-swap state juggling (`minutesPlayed: 0`, `yellowCards: 0` for the incoming slot).
5. **Injury flag semantics**: `simulateInjury` sets `isInjured = true` then resets to `false` when NOT recovered — recovered players stay flagged, non-recovered are cleared ("stays on, flagged in commentary only" MVP).
6. **Set-piece taker selection**: ranked on `corners`/`freeKicks` only — the `setPieces` attribute is unused (asym: id 7 with setPieces 20 is never picked); the pool includes the goalkeeper, and uniform-attribute ties make the GK the taker (home free kicks in the asym fixture, all set pieces in the uniform fixture).
7. **Save templates asymmetry**: `save.long-shot` and `setpiece.save` carry only `{keeper}` (no `{player}`) — the seam identity check pins the keeper name for save lines for that reason.

## Divergence-ledger convention (binding for PRs B–E)
Every **intentional** behavior change is disclosed in that PR's description with exactly one ledger entry. **Fine-grained unit pins (the set-piece grid) flip 1:1** for targeted calibration changes (e.g. PR E's keeper term). Whole-stream literals are regenerated **only** with a cited regenerating command plus an event-level summary of what changed and why — a whole-stream rewrite is never a substitute for disclosure. PR C (mechanical reconciliation) must leave every pinned assertion **byte-identical**; anything else is a divergence-ledger entry or a disclosure violation (review-protocol rule 2: undisclosed changes are MAJOR).

## Review ledger (round 1, REQUEST_CHANGES → all resolved in round 2)
- **R1-01 [MAJOR]** uniform fixture nulls keeper-term/taker ranking → asymmetric fixture + pinned seed 10 + 48-cell unit grid. RESOLVED.
- **R1-02 [MAJOR]** colliding player ids (away overwrote home in the renderer map) → disjoint ids 101–114 + per-event identity walk. RESOLVED.
- **R1-03 [MINOR]** dead 'Unknown' assertion → real `Player <id>` sentinel + malformed-text guard. RESOLVED.
- **R1-04 [MINOR]** line.key is the requested key → template-presence assertion. RESOLVED.
- **R1-05 [MINOR]** no direct post-match state pins → `pinState` per seed (sent-off/injured/onPitch). RESOLVED.
- **R1-06 [MINOR]** "exactly one assertion" unachievable under RNG cascade → convention restated (grid pins flip 1:1; stream regeneration needs cited command + event diff). RESOLVED.
- **R1-07 [MINOR]** inventory tautological over constants → derived from live `runMatch`/`runAsymMatch` runs. RESOLVED.

## Out of scope
- PR B: delete `src/engine/commentary.ts` (+ `commentaryService.ts`) dead impl.
- PR D: `initPitch` idempotency on re-`startMatch` (open since round 1) + sub-AI keeper protection if adopted.
- PR E: keeper term calibration in `applySetPieceResolution` — flips the 48 grid cells + the asym seed-10 stream, with its discriminating test.
- CM-R03: the placeholder occurrence rates (`setPieceCornerRate 0.045` etc. are pinned as-is).