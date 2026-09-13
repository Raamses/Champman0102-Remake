# Second-Opinion Review of the Creative-Decisions Verdict — 2026-09-11

**Reviewer:** AmosBot (Pi) — independent adversarial pass on `creative-decisions-verdict.md` (PR #3).
**Method:** Every PARTIAL and REJECTED ruling was restated and re-verified against the repo (docs, code, git history, staged retail data), not taken from any reviewer doc. 20 ACCEPTED rulings were spot-checked for rubber-stamping. Where numbers mattered, they were re-derived (engine math simulated; scrape coverage counted; test suite executed).

---

## Summary

The verdict survives adversarial review. All 10 PARTIAL rulings and all 3 embedded REJECTED sub-rulings are upheld (13/13 AGREE), several with reasoning refinements or technical corrections that strengthen rather than weaken them. Of 20 ACCEPTED rulings spot-checked, none is a rubber-stamp: each rests on a verifiable repo fact (citations verified against the repo; the F1 math was re-simulated and is *worse* than reported; the CM-006 retail-validation claim was re-run live — 37/37 parser tests pass against the staged retail database). Two contradictions present in the merged audit evidence were never adjudicated by the verdict and are flagged below as gaps: the regen-allocation contradiction (CM-034 Phase 2 vs CM-054/Action-Item-#10 Phase 3) and the population-sizing contradiction (plan's 50K vs measured 109,940 players / 132,722 staff). **Counts: 13 AGREE, 0 OVERTURN, 0 NEEDS-EVIDENCE on the PARTIAL/REJECTED docket; 2 unadjudicated contradictions + 6 technical corrections found.**

## Second-opinion verdict table (PARTIAL / REJECTED docket)

| Finding | Original ruling | Second opinion | One-line basis |
|---|---|---|---|
| F4 attribute naming + `composure` ghost field | PARTIAL (ghost field fix now; parser.ts canonical for code; display labels deferred to screenshot verification) | **AGREE** | Ghost field confirmed (plan-v2:118 vs :344); parser field names confirmed in code and live-tested; deferring display labels avoids ruling on an unverified claim |
| F8 trademark risk | PARTIAL (legitimate gap; owner-level decision; nominative-use phrasing regardless) | **AGREE** | Counsel review contains zero trademark analysis (copyright only); rebrand is an owner governance call, phrasing is cheap insurance |
| F12 offsets-thread relevance | PARTIAL (deprecate as primary spec; keep as secondary reference) | **AGREE** | Re-counted: 174 exe/memory/patch mentions vs 33 .dat mentions; 6 of 31 pages scraped — "zero relevance" indeed overstated, deprecation indeed due |
| P1 ZIP onboarding displacing CM-013 | ACCEPTED, displacement PARTIAL (keep minimal viewer as parser verification surface) | **AGREE** | Real-data test suite silently skips without staged files; a human-visible viewer is the only non-ephemeral parse-verification surface |
| P4 suspense pacing + audio/haptics; CM-052/053 displacement | PARTIAL (accept pacing + small-scope audio/haptics; displacement "mostly notional") | **AGREE** (1 correction) | CM-052/053 are Phase 3 (plan-v2:438–439) so displacement saves zero MVP days; correction: `navigator.vibrate` does not exist on iOS Safari — haptics degrade silently there |
| P5 briefing + micro-save; replace CM-038 inbox | PARTIAL (micro-save→CM-020; briefing→Phase 2; replacing inbox REJECTED) | **AGREE** | Briefing requires career state that only exists from Phase 2; CM-038 (plan-v2:425) holds match reports/offers/board messages a one-page modal cannot; complement not replacement is right |
| P6 stakes meters; displace CM-050 cup complexity | PARTIAL (meters accepted Phase 2; displacement REJECTED) | **AGREE** (reasoning refined) | Verdict's "cups are core identity" is the weaker ground; the decisive ground is that CM-050 is Phase 3 (plan-v2:436) so displacement buys zero MVP time — same notional logic as P4 |
| P7 slot-and-tap tactics; displace CM-051 CL tiebreakers | PARTIAL (defer pattern to Phase 2; displacement REJECTED) | **AGREE** | CM-051 is Phase 3 (plan-v2:437); deferral coherent iff Phase 1 ships touch-operable *minimal* tactic controls (formation/mentality selects) — make that explicit in plan v3 |
| D15 Phase 0 gate closed early | PARTIAL (gate caught the struct mismatch; reopen narrowly via CM-R06/CM-R13) | **AGREE** | Gate's catch is real (parser.ts header documents the CM2→TPlayer rewrite; live tests pass); stadium/club_comp (parser gap) and TStaff 58–144 (format-notes:219 UNVERIFIED) are exactly the narrow reopen scope |
| D16 save-size 10–15MB | PARTIAL/UNMEASURED (measure in CM-R03; don't pick a number by argument) | **AGREE** | All three figures in circulation (10–15MB plan-v2:575, 30–50MB engineer, 45–70MB audit) are estimates; audit's BROKEN grade itself bakes in unmeasured SQLite-overhead assumptions — demotion to UNMEASURED is the more honest grade |

## REJECTED sub-rulings (embedded in P5/P6/P7) — individually ruled

| Sub-ruling | Second opinion | Basis |
|---|---|---|
| P5: "Replacing the desktop-style inbox entirely" | **AGREE with rejection** | CM-038 scope (news/inbox: match reports, transfer offers, board messages, plan-v2:425) is functionally irreducible to a briefing modal; CM01/02's inbox is load-bearing UX, and P5's briefing is additive state, not a superset |
| P6: "Displacing CM-050 cup complexity" | **AGREE with rejection** | Displacement is timeline-notional (Phase 3, plan-v2:436); replays/extra-time are a small extension of CM-035's match-resolution code (one fixture-decision branch + extra-time/stamina interaction), not a separable cost pool — cutting them buys nothing for MVP |
| P7: "Displacing CM-051 CL tiebreakers" | **AGREE with rejection** | Same Phase-3 notional displacement; tiebreaker logic is a small pure-function surface where correctness is cheap and wrongness is visible to every player |

---

## Per-finding adjudication

### F4 — Attribute-name schizophrenia + `composure` ghost field — original PARTIAL — **AGREE**

**Finding (engineer):** plan-v2:114–118 mandates `shooting`/`intelligence`/`bigOccasion` ("NOT finishing/decisions/composure") while plan-v2:344's own `resolveChance` pseudocode reads `composure`, which the plan's Player interface omits → `undefined` → NaN cascade. Meanwhile parser.ts actually parses `finishing`/`decisions`/`freeKicks` from the real 2001 TPlayer struct.

**Verdict rationale:** ghost-field bug accepted for immediate fix; parser.ts canonical for code field names ("verified offsets beat plan prose"); display labels deferred until verified against actual CM01/02 screenshots.

**Independent verification:**
- Ghost field: plan-v2:118 declares `bigOccasion` "NOT composure" and the interface block (114–118) has no `composure`; plan-v2:344 weights `composure: 0.10`. NaN propagation confirmed by inspection.
- Parser names: `finishing` (offset+39), `decisions` (+36), `freeKicks` (+41), `importantMatches` (+44), `dirtiness` (+37) confirmed in `src/lib/dat-parser/parser.ts:435–473` and the `CM2PlayerAttributes` interface (~351–394).
- CM-006 claim re-run live: `npx vitest run src/lib/dat-parser` → **3 files, 37 passed, 1 skipped** including the real-data suite against `/home/ramamos/cm0102-game-data` (9 files, ~43MB, staff.dat 30.2MB). The defer-to-parser rationale is not taken on trust — it is reproducible.
- Display labels: the audit claims the game UI displayed "Shooting"/"Intelligence" for binary `finishing`/`decisions`. Nothing in the repo can verify or refute this; no screenshot/string-table asset exists here. The verdict's refusal to rule either way without artifact evidence is correct and is the strongest feature of this ruling.

**Second opinion:** AGREE. One addition for plan v3: parser.ts's own interface names are misnomers — `CM2Player`/`CM2Club`/`CM2Staff`/`CM2Name` actually encode the 2001 `TPlayer`/`TClub`/`TStaff`/`TNames` structs (the header comment says so explicitly). Renaming these interfaces (or aliasing) in v3 would remove the next naming war before it starts.

### F8 — Trademark risk in project identity — original PARTIAL — **AGREE**

**Finding (engineer):** counsel covered copyright only; "Championship Manager"/"ChampMan" are active marks (Eidos/Square Enix lineage); repo name and plan title invite C&D regardless of BYOD.

**Verdict rationale:** legitimate gap, not covered by counsel passes; rebranding is owner-level; nominative-fair-use phrasing recommended regardless; not executed unilaterally.

**Independent verification:** `docs/vault/reviews/counsel-review.md` read in full — both counsel sections (Gemini, Nemotron) discuss copyright/compilation rights and roster-pack derivative works; the word trademark never appears. plan-v2:1 brands the project "Championship Manager 01/02 Remake" and plan-v2:470–476 (Legal Model) is silent on marks. The current mark status of "Championship Manager" in 2026 is not verifiable from the repo either — which is exactly why this stays an owner decision rather than a unilateral rename.

**Second opinion:** AGREE. The PARTIAL scope (owner ratifies) plus unconditional nominative phrasing is the correct governance outcome; nothing in the evidence justifies overriding the owner's call.

### F12 — offsets-thread-notes wasted effort — original PARTIAL — **AGREE**

**Finding (engineer):** CM-002's scrape (t=1540, 31 pages) is exe-patch disassembly discussion with "zero relevance" to .dat structures; deprecate the file.

**Verdict rationale:** file is dominated by exe/memory/patch content (175 vs 33 .dat mentions) and only 6 of 31 pages scraped — but "zero relevance" overstated; keep as secondary reference, deprecate as primary spec; parser work bases on Structures.cs + binary validation.

**Independent verification (re-counted):** `grep -c -i "exe|memory|patch"` → **174**; `grep -c -i "\.dat"` → **33**; header states "Total posts: 764 across 31 pages; Scraped: 6 pages (150 posts)". The verdict's 175/33/6-of-31 figures are accurate to within one unit. The engineer's "zero relevance" is contradicted by 33 .dat mentions; the verdict's middle position is factually grounded.

**Second opinion:** AGREE. Deprecate-as-primary is the operative instruction and matches the file's actual composition.

### P1 — One-drop ZIP onboarding + instant demo; displaces CM-013 — original ACCEPTED with displacement PARTIAL — **AGREE**

**Verdict rationale:** onboarding funnel + demo match accepted; keep a minimal DB viewer as the parser-verification surface, demoted from headline feature.

**Independent verification:** CM-013 is a Phase 1 card (plan-v2:400). The only automated parser verification is `real-data.test.ts`, which **silently skips itself** when `/home/ramamos/cm0102-game-data` is absent (`describe.runIf(HAS_REAL_DATA)`, line 45) — on any machine without staged retail data, green CI proves nothing about the parser. A viewer is the only persistent human-verification surface, and H10's missing stadium/competition names will surface there first.

**Second opinion:** AGREE. The minimal-viewer carve-out is justified by the test suite's own skip behavior, not just sentiment.

### P4 — Suspense-paced commentary + audio/haptics; displaces CM-052/CM-053 — original PARTIAL — **AGREE (one technical correction)**

**Verdict rationale:** pacing + template variance accepted; audio/haptics as small-scope; displacement "mostly notional — accept the reordering, not the deletion."

**Independent verification:** CM-052 and CM-053 are Phase 3 cards (plan-v2:438–439). The design doc's P4 trade-off row claims "Saves 5 days overall" — those are Phase 3 days, outside the 7–8-week MVP window, so "displacement is mostly notional" is exactly right.

**Correction:** the design doc's haptics mechanism (`navigator.vibrate([40,60,40])`, P4 item 3) is unavailable on iOS Safari — WebKit has never shipped the Vibration API. On the project's primary mobile platform the haptics item silently no-ops. Keep it as a progressive enhancement, but plan v3 should not count it as iOS-experienced UX.

**Second opinion:** AGREE with that correction noted for CM-R09 scope.

### P5 — Morning briefing + micro-saves; replace CM-038 inbox — original PARTIAL with one REJECTED sub-ruling — **AGREE**

**Verdict rationale:** micro-save/resume merges into CM-020 (real mobile-interruption problem); briefing card → Phase 2; wholesale inbox replacement rejected — CM-038 stays.

**Independent verification:** CM-038 (plan-v2:425) = "News/inbox system: match reports, transfer offers, board messages". A one-page briefing modal cannot carry negotiation threads, offer histories, or board messages — the reviewer's proposal replaces a superset with a subset. The briefing's own inputs (fixtures, injuries, transfer state) do not exist until Phase 2, so the verdict's Phase-2 placement is forced by dependency order, not taste. Micro-save into CM-020 is consistent with H13's state-machine engine (per-minute persistence requires steppable state).

**Second opinion:** AGREE, including the embedded REJECTED of inbox replacement.

### P6 — Boardroom/fan stakes + "as it stands" table; displace CM-050 — original PARTIAL with REJECTED sub-ruling — **AGREE (reasoning refined)**

**Verdict rationale:** meters cheap and high-leverage, accepted into Phase 2 (CM-038/CM-035 adjacency); displacing CM-050 cup complexity REJECTED because "cups are core CM01/02 identity; not cut on a UX reviewer's hunch."

**Independent verification:** CM-050 is Phase 3 (plan-v2:436); CM-035 (competition system) is Phase 2 (plan-v2:422), so the adjacency claim checks out. The design doc's P6 row claims "Saves 2 days" — but displacing a Phase 3 card saves zero MVP-window time. The verdict reached the right ruling via its identity argument; the stronger and sufficient ground is the same notional-displacement logic it applied to P4: **CM-050 is post-MVP, so "displacing" it funds nothing**. Replays/extra-time are a small extension of CM-035's match-resolution code (one fixture-decision branch + extra-time/stamina interaction), not a separable cost pool.

**Second opinion:** AGREE. Plan v3 should also strike the design doc's "saves 2 days" arithmetic — the verdict's honesty list flagged the 15-day aggregate but not this per-row instance.

### P7 — Slot-and-tap mobile tactics; displace CM-051 — original PARTIAL with REJECTED sub-ruling — **AGREE**

**Verdict rationale:** pattern good, defer to Phase 2; displacing CM-051 CL tiebreakers rejected — "edge-case logic is small, correctness matters."

**Independent verification:** CM-051 is Phase 3 (plan-v2:437) — displacement again notional for MVP. The deferral has one internal tension the verdict should have named: it simultaneously accepts P2 (mobile IA from day 1, CM-061 pulled into Phase 1). Coherence requires Phase 1 tactics to be touch-operable *in some minimal form* (formation/mentality selects work fine on touch); the deferred item is only the 15-slot grid + instruction badges.

**Second opinion:** AGREE, conditional on plan v3 stating that Phase 1's tactic UI ships touch-minimal controls rather than desktop drag-and-drop; otherwise P2 and P7 pull in opposite directions.

### D15 — Phase 0 gate "passed" prematurely — original PARTIAL — **AGREE**

**Verdict rationale:** gate correctly caught the CM2-vs-CM01/02 struct mismatch but closed before stadium/competition tables (H10) and TStaff contract bytes (F10); CM-R06/CM-R13 reopen narrowly.

**Independent verification:** parser.ts's header documents the CM2→TPlayer correction and its real-data tests pass live (37/37) — the gate's success is real. But parser.ts contains no `parseStadiumDat`/`parseClubCompDat` (verified by grep: zero hits), club.stadium is a raw int (parser.ts, offset+105; format-notes:106 "Stadium Int32 — FK into stadium.dat"), and format-notes:219 marks offsets 58..144 "UNVERIFIED" with parser.ts's comment confirming fields between ClubJob (57) and player (145) are not exposed. The reopen scope is exactly the two named gaps — proportionate, not a wholesale gate failure.

**Second opinion:** AGREE.

### D16 — Save-size 10–15MB — original PARTIAL/UNMEASURED — **AGREE**

**Verdict rationale:** flagged unmeasured; both the plan's 10–15MB (plan-v2:575) and the engineer's 30–50MB counter are estimates; measure in CM-R03 harness.

**Independent verification:** three incompatible figures circulate: plan-v2:575 (10–15MB, marked "Done"), engineer F1-table (30–50MB "real"), audit D16 (45–70MB, derived from inserting 109,940 players + 132,722 staff + 10,580 clubs into SQLite with indexes). The audit's BROKEN grade rests on its own unmeasured assumptions (per-row overhead, index sizing, and — decisively — the assumption that the save contains the full imported DB). Under the verdict's own recommended storage architecture (Option A: in-memory relational + IndexedDB persistence), a save is a snapshot/delta artifact whose size is dominated by career-state, not the 43MB retail database. The question is architecture-dependent before it is arithmetic-dependent.

**Second opinion:** AGREE — and the audit's demotion from BROKEN to UNMEASURED was the correct epistemic move; the harness measurement (CM-R03/CM-R11) should fix the storage architecture first, then measure.

---

## ACCEPTED-ruling spot-checks (20 checked; no rubber-stamping found)

| Ruling | Second opinion | Evidence |
|---|---|---|
| F1 engine math (~45 goals, 0% misses) | **AGREE — strengthened** | Re-simulated plan-v2:318–357 verbatim: per-min CP 13.58→12.07 for a 14/13 team vs threshold 8.0. Reading the plan's "If accumulatedPoints >= threshold: create chance, Reset accumulator" (plan-v2:274–282) as a per-minute if-check yields 90 chances/team → ~45 goals/match (the reported figure); reading it as a while-loop drain of the accumulator yields **144 chances/team and ~80 goals/match** — the finding is worse under either interpretation. Scoping nuance: "0% misses" holds only when conversionRoll ≥ 0.4375 (equal-or-better attackers); a=10 vs d=g=15 misses ~18% of the time. Root cause unchanged: invented constants. |
| F2 / H11 Math.random vs determinism | AGREE | plan-v2:353 `Math.random()` inside resolveChance vs plan-v2:270 "deterministic for multiplayer" and rng.ts in the file structure; match-engine.md:79 same. |
| F3 phantom defender | AGREE | plan-v2:346 flat `avgAttribute(defenders, …)`; the red-card arithmetic (18,10,10,10 → 12.0 → 14.0 → 18.0) verifies. Density-weighted minimum fix is proportionate. |
| F5 / D2 dual-parser drift | AGREE | dat_to_json.py:38 "CM2Player struct (193 bytes)", :107 CM2Team 361, :14 CM2Manager 241 — the 1996 layout with inline strings; parser.ts uses the 70-byte TPlayer with FK names. Live-tested: Python path would misparse the staged 2001 files. |
| F6 / H05 SQLite-WASM/OPFS | AGREE (nuance) | `createSyncAccessHandle` is worker-only (File System Standard); COOP/COEP needed by the default sqlite-wasm OPFS VFS (SharedArrayBuffer/Atomics proxy). Nuance: the `opfs-sahpool` VFS works without cross-origin isolation (still worker-only) — worth a line in plan v3, changes nothing about the Option A recommendation. |
| F7 / H06 BYOD mobile | AGREE | iOS Safari lacks `webkitdirectory` folder upload; `<input multiple>` exists but the true blocker is upstream (no on-device way to extract .dat files from a 600MB ISO/RAR). Verdict correctly flagged "85%/99% abandonment" as invented. |
| F9 fast headless sim in Phase 1 | AGREE | CM-062 sits in Phase 4 (plan-v2:448); 380–2,000 matches/season through a minute-tick loop is untestable; dual-mode from CM-014 is right. |
| F10 TStaff 58–144 unmapped | AGREE | format-notes:219 "58..144 … UNVERIFIED"; parser.ts comment: fields between ClubJob (57) and player (145) not exposed. |
| F11 / D11 / H16 timeline | AGREE | Git history: CM-003 2026-08-30 → CM-004 2026-09-09 → CM-005 2026-09-11 (≈12 days for Phase 0 vs 1-week budget). Arithmetic: Phase 0 (1wk) + Phase 1 (3–4wk) = 4.5wk vs "7-8 week MVP (Phase 0 + Phase 1)" (plan-v2:16, 376). Counsel's 7-week estimate included "Single-league season loop + save/load: 1.5 weeks" (counsel-review.md, Nemotron) which is Phase 2 in plan-v2. All three legs verified. |
| F13 commentary authoring pipeline | AGREE | CM-017 (plan-v2:404) is a renderer; no template assets/string tables exist anywhere in the repo. |
| H01 phantom league | AGREE (evidence note) | club.dat stores division/stadium as int FKs (parser.ts:87/+105; format-notes:106); no competition-rule tables parsed or scheduled; offsets-thread content (exe patches for 3-point rule, inflation, league caps) corroborates rules-in-exe. Note: the strongest form ("ALL rules hardcoded in exe") rests on community RE knowledge, not repo-verifiable fact — keep the Assumption-5 falsification gate as planned. |
| H07 main-thread ingestion | AGREE | Property-count arithmetic checks: 132,722×9 (staff) + 109,940×57 (players, per parser.ts object shape) ≈ 7.5M properties; parser.ts allocates full objects today. The 5–25s figures are unmeasured and the verdict correctly routed them to a falsification test (CM-R11) instead of adopting them. |
| H08 god-mode tactics | AGREE | plan-v2:324 mentalityMod scales CP; `resolveChance(attacker, defenders, keeper)` (plan-v2:341) takes no mentality/tactic parameter; the tactics table's "defensive = +20% defense strength" has no implementation path. |
| H09 stamina decimation | AGREE (derivation caveat) | The holes doc's 2.1%/min drops the formula's own `(1/naturalFitness)` factor (match-engine.md:95), which as written (1–20 scale) would shrink decay ~14× — the formula is unit-broken either way, so the calibration-harness ruling stands; the specific "0 stamina by min 60" figure should not be quoted forward. |
| H10 stadium/club_comp unparsed | AGREE | Zero hits for parseStadium/parseClubComp in parser.ts; stadium is a raw FK int. |
| H11/D12 determinism | AGREE | Same citations as F2. |
| H12/D13 SQL DDL migrations | AGREE | plan-v2:232–250 models the save as a JSON wrapper; SQLite state needs `PRAGMA user_version` + ordered DDL. Correct. |
| H14 Safari 7-day eviction | AGREE | WebKit's 7-day script-writable-storage cap for non-persisted sites; `navigator.storage.persist()` + export-save is the standard mitigation. |
| H15 zombie Firebase deps | AGREE | `firebase-applet-config.json`, `firebase-blueprint.json`, `firestore.rules` present at repo root; package.json carries `firebase ^12.13.0` and `@google/genai ^1.29.0`. |
| D6 home advantage +10% vs +15% | AGREE | plan-v2:269 vs match-engine.md:26, verified verbatim. |
| D8/H04 multiplayer contradiction | AGREE | multiplayer.md: host-authoritative WebRTC DataChannels + async week-open play — unusable when a peer is offline (DataChannel requires simultaneous connectivity); plan-v2:462 "Firebase Cloud Functions" contradicts multiplayer.md's "$0 / No Cloud Functions"; multiplayer.md:60 "Host saves league state to IndexedDB" contradicts plan-v2's SQLite-WASM+OPFS. |

---

## Gaps: contradictions present in the merged evidence but never adjudicated

The audit doc's own contradiction register lists seven; the verdict explicitly ruled only one (D6 home advantage). Two unruled items are material and should be folded into CM-R10 (plan v3):

1. **Regen allocation triple-contradiction.** CM-034 (Phase 2, plan-v2:421) includes "regen generation"; CM-054 (Phase 3, plan-v2:440) includes "regen generation"; Action Item #10 (plan-v2:578) allocates regens to Phase 3. The audit flagged this (Contradiction 6); the verdict is silent. Rule needed: if Phase 2 ships multi-season careers, regens are Phase 2-blocking (squad collapse without them); otherwise strip the clause from CM-034 and keep #10/CM-054 authoritative. (The verdict's P8 note — "Downgrading CM-034 regen math: already low priority" — gestures at this but adjudicates neither the contradiction nor the phase.)
2. **Population-sizing contradiction.** Plan v2 sizes storage and memory for "50K+ players" (Key Decisions) while format-notes:77–80 measure 132,722 staff / 109,940 players (audit Contradiction 7). The verdict's H07/F6/D16 discussion uses both numbers without reconciling them. Plan v3 must baseline all sizing (heap, IndexedDB snapshot, harness fixtures) on the measured counts, or the CM-R11 falsification test will be run against the wrong population.

## Technical corrections to carry into plan v3 / card scope

- F1 re-derivation strengthens the finding (~45 goals/match under a one-chance-per-minute reading of the plan's threshold check; ~80 goals/match under a drain-the-accumulator reading — absurd under either) and scopes the "0% misses" claim to conversionRoll ≥ 0.4375 — quote the finding with both bounds.
- H09's "0 stamina by minute 60" derivation ignores `(1/naturalFitness)`; the formula is unit-broken either way, but do not propagate the specific number.
- P4 haptics: `navigator.vibrate` is unavailable on iOS Safari; treat haptics as Android-only progressive enhancement (CM-R09).
- F6: note the `opfs-sahpool` VFS as the COI-free fallback in the storage decision record (worker-only constraint still absolute).
- F4: rename parser.ts's `CM2*` interfaces (they encode 2001 TPlayer/TClub/TStaff/TNames) in v3 to end the CM2-vs-TPlayer confusion at the source.
- P7 deferral requires Phase 1 tactics to ship touch-minimal controls, or P2 (mobile IA day 1) and P7 contradict each other.

## Method note

Reviewed in worktree `/home/ramamos/.openclaw/workspace/Champman0102-Remake-sowt` at origin/main (59bc979). Sources: verdict + 4 review docs + counsel review + plan-v2 + match-engine.md + multiplayer.md + format notes + offsets-thread notes + parser.ts + playerSetup/tests + types.ts + App/AppShell/Squad + scripts/dat_to_json.py + package.json + git history. Numeric checks: engine math re-simulated (node, verbatim plan pseudocode); scrape coverage re-counted via `grep -cE -i "exe|memory|patch"` → 174 and `grep -c -i "\.dat"` → 33. Parser test suite executed live against staged retail data: 37 passed / 1 skipped.