# CM-017 fix round — PR #32 review findings (2026-10-01)

Model: ollama-cloud/glm-5.3-flash (worker), fixes authored per the card's deleg
workflow: the REQUIRED `~/.openclaw/bin/ask-claude --escalate --card
5797d64c-d066-401a-9ca9-47f15dcd32f1 "…"` call does not exist in the builder
sandbox (host-only tool per AGENTS.md) — the attempt for the record failed with
`/bin/sh: 1: /home/ramamos/.openclaw/bin/ask-claude: not found` (exit 127), raw
log at `outbox/cm-017-fix/claude-attempt.txt`, preserved host-side re-run prompt
at `outbox/cm-017-fix/claude-delegation-prompt.txt` (same handling as CM-013,
commit 608da4b). The fix code was delegated to the sandbox-available Gemini
relay via `agy-edit --card 5797d64c-d066-401a-9ca9-47f15dcd32f1` in three
groups (types/D7/annotations; bench-subs; EN+HE templates); two of its multi-part
per-file edits under-applied (verified against `git diff`) and were completed
first-hand with the recorded anchors. Branch: `cm-017-fix`, head `c7888d3`,
base `origin/feat/cm-017-commentary` (5d6dfc2). The host pushes to PR #32.

## Finding 1 — the 5 spec-mandated event types (+ commentary, none dropped)

- `src/engine/types.ts`: `MatchEventType` extended with `penalty`,
  `missedPenalty`, `ownGoal`, `offside`, `foul`.
- `src/engine/commentary.ts`: `TEMPLATES_EN` + `TEMPLATES_HE` gained all five
  keys (the `Record<MatchEventType, string[]>` type makes a missing key a
  compile error — no type can be silently dropped by template); each key
  carries a 2–3-variant variety array, `{minute}' - ` prefix preserved.
- `src/engine/matchEngine.ts`: new `processOccurrenceEvents()` emits the five
  types into the stream (rates below); penalty award → convert (default
  0.78) → `penalty`, else `missedPenalty` (saved = on target). Goal-affecting
  paths are gated on `canScore()` (attackers on the pitch) so degenerate
  no-attacker states stay goal-free.
- Coverage fixture `allEventTypes` in `commentary.test.ts` extended with the
  five types (the "no event dropped" loop now exercises 16 types).

Test evidence (`cm017-fix-round.test.ts`): F1 forced-rate engine emission
(penalty/ownGoal/offside/foul present; penalty goals counted); F1
missedPenalty (conversion 0 → `missedPenalty`, zero `penalty` events); F1
i18n×determinism per new type (EN line contains `63'`, same seed → same
string, HE line contains Hebrew characters).

## Finding 2 — D7 canonical-first naming

- `matchEngine.ts` long-shot branch: `shooting ?? finishing` →
  `finishing ?? shooting` (canonical CM attribute read first, remake alias as
  fallback), formula now `finishing * 0.2`.

Test evidence: F2 — finishing 18 / shooting 2 outscores finishing 2 /
shooting 18 over 60 seeds (canonically-named attribute drives conversion).

## Finding 3 — chance-type constants annotated

- `matchEngine.ts`: `// Chance-type weights: placeholder constants pending
  CM-R03 calibration` above the weight block; `// typeMultiplier values:
  placeholder constants pending CM-R03 calibration` above the multiplier
  chain.
- The occurrence rates are now FIRST-CLASS `MatchConfig` fields
  (penaltyRate, ownGoalRate, offsideRate, foulRate, setPieceCornerRate,
  setPieceFreeKickRate, penaltyConversion) with defaults in
  `DEFAULT_MATCH_CONFIG`, each annotated `placeholder pending CM-R03
  calibration` — the config surface stays the single tuning point.

Test evidence: F3 — config surface assertions (exposure, sane ordering,
penaltyConversion in (0,1), ~0.11 penalties per match not per minute).

## Finding 4 — bench/subs bug (minutesPlayed starvation)

- `types.ts`: `PlayerState.onPitch?: boolean` — `undefined`/`true` = on the
  pitch (back-compat for starting-XI fixtures), `false` = bench / subbed off.
- `matchEngine.ts updateStamina()`: skips `onPitch === false` — pitch minutes
  and decay count on-pitch players only, so substituteAI's bench pool
  (`minutesPlayed < 10`) no longer starves.
- `matchEngine.ts processSubstitutions()`: 3-sub limit per team
  (`subCount`, reset per `simulate()`); the subbed-off player is marked
  `onPitch = false` (the sub-off), the incoming player `onPitch = true`.
- `substitutions.ts`: both pools exclude non-pitch players; the bench pool
  additionally excludes players who already came on (`onPitch !== true`),
  enforcing no re-entry.

Test evidence: F4a — with a marked bench and no substitutions triggered, all
starters accumulate minutes while every bench player stays at 0; F4b —
exhausted starters (fast + high press + attacking, poor natural fitness)
produce exactly 3 sub events per team (the cap), unique `subOutId`s, no
double-entry, every subbed-off player marked `onPitch === false` and every
incoming player `onPitch === true`.

## Finding 5 — set-piece hooks wired into the minute loop

- `matchEngine.ts simulateMinute()` now calls `processSetPieces()` —
  rate-rolled corner + freeKick triggers per team per minute (skipped for
  no-attacker sides), each resolved through
  `applySetPieceResolution(attackerAttr, defenderAttrs, keeperAttr, rng,
  type)` from `lib/tactics/setpieces.ts`.
- PR semantics preserved: the SP event is typed by OUTCOME (`goal`/`save`)
  and the corner/free-kick flavor rides in the description ("…scores from a
  corner!", "🧤 …saves the corner attempt…"). `corner`/`freeKick`-typed
  events come from the service-side hook (`CommentaryService.
  resolveAndCommentSetPiece`) — synthetic coverage renders them.

Test evidence: F5a (forced SP rates) — corner-flavored and free-kick-flavored
events both present; F5b (strong set-piece takers, seed 21) — a set-piece
GOAL event reaches the stream.

## Calibration census (all-10 attributes, 100 seeds, after the fix)

`DEFAULT_MATCH_CONFIG` SP rates trimmed to keep the CM-016 statistical gates
mid-range (was avgGoals 3.63 / avgShots 19.00 at rate 0.016/0.005):

```
avgGoals=2.86  avgShots=17.00  spEvents=1.57/match
penalty=0.16/match  ownGoal=0.04/match  offside=2.32/match  foul=8.37/match
```

All occurrence rates are declared placeholders pending CM-R03 calibration.

## Determinism contract (the varRng isolation)

All NEW CM-017 event machinery (SP triggers + resolution + occurrence
emitters, including `simulateSetPiece`'s internal draws) consumes a dedicated
feature RNG `varRng = RNG(seedFromString('cm017:' + seed))`. The calibrated
outcome RNG's seeded sequences are byte-identical to the PR head, so the
CM-014/016/016b statistical gates keep their PR-green values; commentary
generation is deterministic per (seed, event stream, lang). Same seed ⇒ same
events ⇒ same commentary strings.

## card-verify (final tree, head c7888d3)

```
PASS typecheck 7.1s
PASS lint 7.3s
PASS unit 7.6s
--- git status --- (clean)
```

Full suite: 349 passed / 0 failed / 249 skipped (skips are the host-only
real-data suites, unchanged); `npm run build` green (tsc -b + vite build).

## Known limits

1. Occurrence rates, type multipliers and weights are in-code placeholders
   pending CM-R03 harness calibration (annotated at every site).
2. The engine does not emit `chance`-typed pre-events or `assistId` on this
   path (PR design); `chance`/`assist` commentary coverage stays synthetic.
3. Set-piece awards: outcome-typed events with flavor in the description;
   `corner`/`freeKick`-typed events come from the service-side hook only.
4. Occurrence events are informational in MVP depth — cards do not remove
   players from the pools; injured players stay on; no re-entry after a sub.
5. Bench eligibility relies on explicit `onPitch: false` marking by match
   setup (CM-018 owns the team-state wiring); `undefined` = on pitch for
   back-compat with existing 11-man fixtures.
6. `substituteAI`'s pools operate on position filters; a subbed-off player
   remains in the position pools until slots are reconciled (CM-018's
   on-pitch bookkeeping) — minutes accounting itself is fixed here.
