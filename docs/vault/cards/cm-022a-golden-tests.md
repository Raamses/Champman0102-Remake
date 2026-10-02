# CM-022a — Golden/characterization tests: the executable reconciliation spec

## Purpose
Pin the current production engine's observable behavior as an **executable spec**, per the 2026-10-02 PR-34 counsel (root cause of the 4 unconverged review rounds: *no frozen ground truth* — "fix the finding" and "introduce a new change" were indistinguishable). PR #34 is closed; the split is PR A (this) → B (delete dead commentary impl) → C (mechanical reconciliation) → D (initPitch idempotency) → E (keeper calibration). **This PR merges before any engine is touched.**

## Lineage note (why the base is `feat/cm-022-reconcile`, not bare main)
The pinned engine is the surviving R4 reconcile lineage (`feat/cm-022-reconcile @ da55bc5`, PR #34's head after round 4) — `src/engine/matchEngine.ts` driving the production renderer `src/lib/commentary` (via `src/store/matchStore`). Bare `main @ e9d1487` predates the CM-017/018/020/021 feature work entirely (its engine emits only `goal`/`save`/`miss` and has no renderer at all), so there is nothing to pin there. `feat/cm-022-reconcile` fully contains main and is the lineage the split PRs B–E modify, so the golden tests stack on it (tiny reviewable diff: tests + this card only) and gate everything that follows.

## Scope
- **Tests only. ZERO production changes.** New files: `src/engine/__tests__/golden.match.test.ts` + `src/engine/__tests__/golden.helpers.ts`.
- Characterizes DEFAULT-config behavior of the production engine + renderer seam. The dead second implementation (`src/engine/commentary.ts`, `src/engine/commentaryService.ts`) is never imported — PR B deletes it.
- NOT pinned (deliberately): template wording in `strings.ts` (cosmetic; only the routing keys, line counts, and the full-time scoreline reconciliation are pinned), `description` strings on engine events (redundant with the pinned fields), shots/possession team stats except possession (leftover-CP derived), `initPitch` re-`startMatch` idempotency (PR D owns it).

## Canonical fixture (defined once in `golden.helpers.ts`)
Uniform "average team" squads — all attributes 10, stamina 100, 11 starters + 3 bench (`onPitch: false`), 4-4-2 balanced/normal/normal/normal/mixed, `Home FC`/`Away FC` names — run via `new MatchEngine({ seed })` with every other config default.

## Pinned-seed inventory
Sweep 0..999 under the canonical fixture (default config): corner 999/1000 seeds, freeKick 983, yellow 986, sub 1000, injury 779, penalty 89, red 97, ownGoal 33, missedPenalty 15; set-piece goal/save/miss outcomes 247/168/769; goals with assist 711. Full combo (≥1 penalty + red + sub + corner + freeKick in one match): 8 seeds `[41, 96, 192, 371, 572, 659, 963, 970]`.

Three representative matches pinned in full (exact per-minute event streams incl. extras, scoreline, possession, rendered key sequence):

| Seed | Score | Events | Renderer lines | What it pins |
|---|---|---|---|---|
| **41** | 2-1 | 70 | 73 | early second-yellow red (min 15, home) + 10-man ripple; converted penalty (min 17) vs real keeper; set-piece GOAL from corner (min 35, away); open-play assist (min 89); NON-recovered injury (min 3); 10 corners, 15 chances, all 5 chance-type keys |
| **149** | 2-0 | 76 | 78 | converted penalty (min 72) AND missedPenalty (min 90 — taker is a sub, "keeper" = outfield fallback after the GK sub); set-piece goal from free kick (min 65); set-piece SAVE (min 78); recovered + non-recovered injuries |
| **686** | 2-1 | 77 | 79 | ownGoal with `creditTeam` (min 69, away defender credits home); converted penalty (min 48); 6 injuries all `recovered`; set-piece goal (min 70) + set-piece miss |

Union covers every event type the engine emits and every extras field (`chanceType`, `setPiece`, `keeperId`, `subInId`/`subOutId`, `secondYellow`, `recovered`, `creditTeam`, `assistId`, `playerName`).

## Pinned quirks — PINNED-BEHAVIOR comments in the test (potential bugs, NOT fixed here)
1. **Constructor overrides `baseConversionRate`**: effective default is `0.12/0.9 ≈ 0.1333`, not `DEFAULT_MATCH_CONFIG.baseConversionRate = 0.13`.
2. **Possession is leftover-CP share**: `result()` divides the *remaining* CP accumulators, not totals — with uniform squads it is seed-independent (always 70/30).
3. **Deterministic stamina decay → fixed sub timing**: no RNG in `updateStamina`, so with the uniform fixture every match subs at minutes 77/77/78/78/79/79 and the first sub removes the **goalkeeper** (stable sort picks index 0) with no keeper replacement. After min 77 the team has no GK on pitch, so penalties/own-goal resolution fall back to the first on-pitch outfield player as "keeper" (seed 149 min 90: `keeperId=14`).
4. **`sub` event `playerId` = the INCOMING player** (R4 flip), plus the shirt-swap state juggling (`minutesPlayed: 0`, `yellowCards: 0` for the incoming slot).
5. **Injury flag semantics**: `simulateInjury` sets `isInjured = true` then resets to `false` when NOT recovered — recovered players stay flagged, non-recovered are cleared ("stays on, flagged in commentary only" MVP).
6. **Set-piece taker selection**: ranked on `corners`/`freeKicks` only, over an on-pitch pool that includes the goalkeeper.

## Divergence-ledger convention (binding for PRs B–E)
Each **intentional** behavior change in a split PR flips **exactly one pinned assertion**, and that flip is listed in that PR's description with its reason. Anything else that changes a golden assertion is a disclosure violation (review-protocol rule 2: undisclosed changes are MAJOR). Mechanical reconciliations (PR C) must leave the golden output byte-identical.

## Out of scope
- PR B: delete `src/engine/commentary.ts` (+ `commentaryService.ts`) dead impl.
- PR D: `initPitch` idempotency on re-`startMatch` (open since round 1) + sub-AI keeper protection if adopted.
- PR E: keeper term calibration in `applySetPieceResolution` (+ its missing discriminating test).
- CM-R03: the placeholder occurrence rates (`setPieceCornerRate 0.045` etc. are pinned as-is).