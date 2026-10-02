# CM-022d — initPitch idempotency on re-startMatch (the PR-#34 R1 legacy)

## Purpose
Step 4 of the CM-022 split (2026-10-02 PR-34 counsel): close the finding that rode unaddressed from PR #34 round 1 through all four review rounds — the exact "review as advice, not gate" pathology the counsel diagnosed. `startMatch` resets everything it owns (minute, events, chance points, `subCount`, team goals/shots) *for exactly the squad-reuse case*, but `initPitch` assigned `p.onPitch = p.onPitch ?? (i < 11)` — which only ever initializes a **virgin** squad. Re-running `startMatch` on a used `TeamState` froze the closing roster into the next run.

## Lineage
- **PR #34 R1 (MINOR, matchEngine.ts:106)**: "`initPitch` assigns only when `onPitch === undefined`, so calling `startMatch()` again on a `TeamState` that has already played… leaves subbed-off players permanently benched and substitutes permanently on. The replaced `idx < 11` rule was self-correcting. Assign `p.onPitch = i < 11` unconditionally."
- Flagged STILL OPEN in the PR #34 R4 ledger; carried into the split plan as PR D (`plans/COUNSEL-PR34-CM022.md`, synthesis §3).

## Stale-state inventory — what a re-run startMatch left stale (pre-fix)
Everything a match mutates on `TeamState`/`PlayerState`, versus what `startMatch` reset:

| State | Mutated by | Reset by old startMatch? |
|---|---|---|
| `onPitch` | red cards (`simulateDiscipline`), substitutions | **NO — the bug**: `??` kept every existing value (red-carded XI players off forever; substitutes on forever) |
| `minute`, `events`, `homeCP`/`awayCP`, `subCount`, team `goals`/`shots`/`shotsOnTarget` | engine | yes (untouched by this PR) |
| `PlayerState.stamina` | `updateStamina` (per-minute decay) | NO — residual |
| `PlayerState.minutesPlayed` | `updateStamina` (per-minute accumulation) | NO — residual |
| `PlayerState.yellowCards` | `simulateDiscipline` | NO — residual |
| `PlayerState.redCard` | `simulateDiscipline` (sendings-off) | NO — residual |
| `PlayerState.isInjured` | `simulateInjury` (recovered players stay flagged) | NO — residual |

The residuals are read by the engine: `substituteAI` filters on `stamina < 25 && minutesPlayed > 50 && !redCard && !isInjured` with a `minutesPlayed < 10` bench; discipline escalates a `yellowCards`-carrying player to a second yellow; injury skips flagged players. **They are NOT state initPitch owns** — deliberately out of this PR's scope (a full squad-state reset is its own future PR). One knock-on of the residual set is pinned in the boundary test: after the shirt-swaps the bench slots hold subbed-off starters with `minutesPlayed > 10`, so a re-run can never substitute at all, and the subbed-off goalkeeper sits on the bench — the re-run plays without a GK from kickoff.

## The fix (surgical, one function)
`initPitch` now assigns **unconditionally by slot** — the first 11 slots start on the pitch, the rest on the bench:

```ts
p.onPitch = i < 11;   // was: p.onPitch = p.onPitch ?? (i < 11)
```

- Idempotent by construction: the assignment no longer depends on prior state, so re-running `startMatch` resets `onPitch` exactly as a virgin init would.
- **Single-run behavior unchanged** for every existing caller: no production code (or fixture) ever supplied a pre-set `onPitch` differing from the slot default — golden fixtures set bench `onPitch: false` (slots 11-13) and leave starters undefined, and `src/store/matchStore.prepare` builds fresh squads without touching `onPitch`. For all of them the two forms assign identical values; the golden suite proves it (below).
- **One disclosed contract change**: pre-set custom `onPitch` rosters are no longer honored at kickoff — the slot rule wins. The only affected code in the repo was the PR-#34-remediation selection test (`matchEngine.test.ts`), which built a custom roster via pre-set flags and mirrored the `??` semantics; it is reworked in this PR to construct off-pitch state the way production creates it (red cards + substitutions mid-match) and to hard-code the slot-contract kickoff set.

## The discriminating test — `src/engine/__tests__/initpitch.idempotency.test.ts`
Three tests, all failing on the pre-fix code (verified by stashing the engine hunk: 3/3 fail; restored: 3/3 pass):
1. **Partway match (seed 41, minute 30 — past the minute-15 second-yellow red, before the fixture's minute-77 first sub)**: non-vacuity (a sent-off XI player is off pitch, the closing roster ≠ kickoff XI), then re-`startMatch` asserts per-slot flags, the on-pitch id set == exactly the initial XI, engine-side resets (`minute` 0, `goals` 0), and the **pinned residual**: the sent-off player is back on flag-wise but still `redCard: true` (initPitch doesn't own it).
2. **Full match (subs occurred)**: the shirt-swap (golden quirk #4) already leaves sub-written flags slot-consistent; the reset restores the red-carded XI players. `initPitch` owns flags, not array order — the re-run XI is whoever occupies slots 0-10 after swaps (identity restoration = the deferred full-squad-reset scope).
3. **PINNED-BOUNDARY (the strongest form, attempted and honestly closed)**: "the full second-run event stream deep-equals a fresh squad's stream on the same seed" is **not achievable** with an onPitch-only reset — same-seed fresh engines prove the RNG identical, so the pinned divergence is attributable purely to the residual state inventory above (no-keeper re-run, swapped slot order, discipline-immune sent-off player). The test pins `rerunStream ≠ freshStream` so a future full-squad-reset PR must flip it deliberately (divergence-ledger convention).

## Golden zero-flip statement
`src/engine/__tests__/golden.match.test.ts` — **merged UNMODIFIED and fully green** (11 tests), both before (baseline run @ e8e821c: 643 passed | 2 skipped) and after the fix (646 passed | 2 skipped). Zero golden assertions flipped: the fix changes only re-run state, and every pinned stream is a single-run stream on index-default fixtures, where the two assignment forms are value-identical.

## Verification
- `npx tsc -b` — clean.
- `npx vitest run` — **646 passed | 2 skipped** (baseline 643 + the 3 new tests; the reworked selection test stays green).
- Discriminating proof — old code: 3/3 new tests fail; fixed code: 3/3 pass.
