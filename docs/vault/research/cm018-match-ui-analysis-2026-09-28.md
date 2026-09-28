# CM-018: Match UI — delegated-analysis artifact + delivery notes (2026-09-28)

## Delegation record (card-required)

- `~/.openclaw/bin/ask-claude --escalate --card 05987116-30ed-4b5f-bf1e-d712884abe4c "..."` — **exit 127, not found** (ask-claude is host-only; AGENTS.md sandbox list). Recorded per the artifact convention established by CM-013 (608da4b).
- Delegation fallback: `~/.openclaw/bin/ask-agy` (Gemini, host-relayed, workspace-read), foreground, ~6 min. Prompt preserved in /workspace/outbox/cm-018/PLAN.md context; verdicts below were applied.

## ask-agy verdicts (all applied)

1. Set-piece shot gating (corner 0.13 / FK 0.22) — validated as restoring bands (~3.46 goals predicted; measured 2.44 with 16.8 shots). One pushback: it recommended delivery-only events be silent; we KEPT them (card scope: "set-piece commentary hooks") with neutral `setpiece.*` string keys so a won corner reads as a hook, not a promise.
2. Empty-attackers: verdict said UPDATE THE TEST (center-backs legitimately finish corners; requiring an ATT is an anti-pattern). Applied: the CM-014 contract is scoped to OPEN PLAY (`resolveChance` early return preserved); set pieces no longer require a striker.
3. Live ticker: stepMinute() API (A) — applied. `startMatch()/stepMinute()/result()`; stepping N minutes is byte-identical to `simulate()` (test proves for 4 seeds incl. events JSON).
4. Worker: main thread behind `VITE_MATCH_WORKER` flag (default off), CM-T16 owns the RPC protocol later — applied (`isWorkerEnabled()` seam in matchStore).
5. Persistence: `writeManualSave('postmatch-{seed}-{homeId}-{awayId}')` via CM-011 saveManager (NOT rotateAutosave) — applied; shape fixture/seed/score/shots/onTarget/possession/events/playedAt.
6. Tactic test: mentality attacking vs defensive from minute 46, 60 seeds — applied (robust multiplier signal).
7. Branch strategy: commit CM-017 WIP as-is → calibration fix commit → branch cm-018-match-ui → merge cm-013-db-viewer — applied exactly.

## State found on arrival (leftover CM-017 WIP, uncommitted on cm-017-commentary)

- matchEngine v3 diff (+295) + commentary lib (no tests) + empty __tests__ dir: a cut-off run's work.
- Calibration BROKEN (200-match diag, all-10 ratings, 4-4-2): avgGoals **7.00** (band 1.5–4.0), avgShots **26.8** (band 10–20), ~12 set pieces/match EACH resolving as a full shot at ~45% goal rate (baseline effectiveRoll ≈ 0.75), 0 subs/match (bench pool broken), 3 failing tests.

## Root causes + fixes

- Every corner/free kick resolved as a shot → **gated shot attempts** (corner 13%, FK 22%; non-attempts remain delivery-only commentary hooks). Measured after: **2.44 goals, 16.8 shots, 13.4 set-piece events, 4.4 cards per match**.
- `updateStamina` incremented `minutesPlayed` for the BENCH → substituteAI's `minutesPlayed < 10` bench pool emptied by minute 10 → 0 subs ever. Fix: first 11 slots = on-pitch XI (subs swap in-place keeps the invariant); bench frozen. Subs now fire (tested, capped at 3).
- `second-yellow` commentary routing never fired (engine emits type 'red' + secondYellow; router checked only type 'yellow') → fixed.
- Injury `recovered` semantics kept as-is (WIP quirk documented; no behavioral contract broken).

## CM-018 delivered

- `src/lib/match/teamFactory.ts`: GameDataset -> TeamState (position mapping from CM2PlayerPositions, attribute mapping + synthesis for engine-only attrs, best-CA XI per formation, bench up to 7, club options list).
- `src/store/matchStore.ts`: live-match Zustand slice (decisions-doc #1 UI-only rule); engine runner in module closure; phases pre/live/half-time/full-time; per-minute commentary slices (deterministic per slice; bookends added by the store); speed control (2500/1000/300 ms/min); mid-match tactics apply from next minute (engine re-reads team.tactic each minute); post-match summary persisted via saveManager manual slot.
- `src/components/match/MatchDay.tsx`: pre-match (home/away selects, seed, tactic setup), live (scoreboard + minute ticker + possession, commentary feed, per-player stamina bars, tactics panel, thumb-zone bar per CM-R08 at mobile), half-time resume, full-time summary. Retro brand tokens (CM-061); responsive stacking at 390px.
- AppShell 'Match' tab + App routing.

## Gates

- `npm test`: **354 passed | 249 skipped, 0 failed** (600 total) — incl. new commentary suite (every event type renders, determinism, Hebrew i18n, score tracking), cm017-events suite (chance-type identity 3-4-3>4-4-2, subs wiring, stepping equivalence, mentality signal), matchStore lifecycle test with IndexedDB persistence round-trip.
- `npm run lint` (tsc --noEmit): clean; `npm run build` (tsc -b + vite): green, dist 296.6 kB.
- e2e: navigation + device-matrix specs updated for the Match tab; **Playwright not installed in sandbox — host re-run needed** (zero-console-error acceptance to be verified host-side on the real journey).

## Branches / commits

- `cm-017-commentary`: d704299 (WIP checkpoint), 29f58ba (CM-017 completion).
- `cm-018-match-ui`: c70932d (merge cm-013-db-viewer — team selection needs dataset + squad resolver), e5bc3d3 (core), 549647f (UI), 5c7896c (tests).
- Patches: /workspace/outbox/cm-018/0001-*.patch..0007. Host pushes + PR needed.
