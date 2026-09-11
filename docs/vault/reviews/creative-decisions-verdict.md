# Creative Decisions — Adjudication Verdict (Hermes, Mac) — 2026-09-11

**Inputs (three Gemini 3.8 Flash (High) passes):** `creative-decisions-g38-engineer.md` (hostile staff engineer, F1–F13), `creative-decisions-g38-design.md` (product/UX, P1–P8), and `creative-decisions-audit-gemini38.md` (D1–D16 decision audit per `creative-decisions-audit-brief.md`, landed on branch `docs/creative-decisions-audit`).
**Method:** All reviewer claims about existing code/files were verified directly against the repo before ruling (per adversarial-review discipline: reviewers are inputs, not deciders).
**Rule applied:** A proposed abstraction is only accepted if it *resolves* the cited cases, not merely relocates them.

---

## Verified by direct inspection (not taken on trust)

| Claim | Verification |
|---|---|
| CHANCE_THRESHOLD=8.0 (plan-v2:339) vs 20 (match-engine.md:65) contradiction | CONFIRMED — two docs disagree |
| Conversion math → 0% misses (goalChance min 0.40 > 0.35 cutoff) | CONFIRMED — arithmetic checks out |
| `composure` ghost field → NaN in resolveChance pseudocode | CONFIRMED — not in Player interface |
| `scripts/dat_to_json.py` parses CM2Player 193-byte (CM2 96/97) structs | CONFIRMED — line 38, while parser.ts uses 2001 TPlayer/TStaff/TClub |
| "Manager Royale" cyberpunk theme, FM 1–100 attrs in types.ts | CONFIRMED — App.tsx:164, AppShell.tsx:120/236, types.ts:33–40 |
| parser.ts uses `finishing`/`decisions` names | CONFIRMED — parser.ts:359–438 |
| Plan pseudocode calls `Math.random()` while mandating seeded PRNG | CONFIRMED — plan-v2:353 vs rng.ts spec |

## Engineer findings

| # | Ruling | Notes |
|---|---|---|
| F1 match-engine math (~45 goals/match, 0% misses) | **ACCEPTED — CRITICAL, blocking** | The plan's own comment says "~12 chances/team" while the constants produce 90. Constants were invented, not measured. Fix via calibrated Poisson-style rate + 3-tier outcome distribution (miss ~50–60%, saved ~25–35%, goal ~10–15%), targets to be **measured by sim harness, not re-invented**. CM-R03 tracks this. |
| F2 Math.random() breaks determinism | **ACCEPTED** | Plan already specs rng.ts; make it binding: engine = pure `simulateMatch(home, away, tactics, seed)`, ESLint ban on Math.random in src/engine/. |
| F3 phantom-defender (red cards improve defense) | **ACCEPTED** | Real failure mode. Simplification ruling: minimum fix is density-weighted defense (count of active defenders factors in), zone-based duels deferred to Phase 2 — F3's full proposal is heavier than the bug requires. |
| F4 attribute-name schizophrenia + NaN ghost field | **PARTIAL** | Ghost field + internal contradiction: accepted, fix immediately. The naming war (CM names vs TPlayer names): **parser.ts wins for code field names** (verified offsets from Structures.cs beat plan prose); in-game **display labels** are a separate UI mapping, to be verified against actual CM01/02 screenshots before any rename. Plan-v2's naming lecture gets corrected in v3. |
| F5 dual-parser drift, obsolete Python script | **ACCEPTED** | Delete dat_to_json.py + test, single TS CLI importing src/lib/dat-parser modules. CM-R05 scope. |
| F6 SQLite-WASM/OPFS main-thread impossibility, "Zustand thin over SQL" invalid | **ACCEPTED — DECIDED by Ram 2026-09-11: in-memory struct-of-arrays typed buffers + IndexedDB end-of-turn FULL-STATE writes** | **CORRECTION 23:59:** an earlier edit to this row recorded the decision as "SQLite-WASM in Comlink worker" — that was this agent's misreading of Ram's Telegram answer, never his ruling. Authoritative record: `docs/vault/decisions-2026-09-11.md` (PR #11, AmosBot): walk back SQLite-WASM for MVP; end-of-turn full-state writes to IndexedDB (original CM01/02 model); RAM-resident data makes a live SQL engine pure overhead at MVP scope; SoA parsing sidesteps the D1 object-allocation blowup; autosave rotation + manual slots, `storage.persist()` + export-save (H14), versioned `{schemaVersion, payload}` envelope with TS migration chain (H12 adapted); Zustand stays UI-only; GitHub Pages stays; SQLite-WASM documented Phase-2 upgrade path. CM-R03 falsification tests still gate CM-012. |
| F7 BYOD mobile onboarding cliff | **ACCEPTED** | ZIP/ISO in-browser extraction + sample-universe generator card (missing from all phases — added). The reviewer's "85% abandonment" figure is itself an invented number — treat as directional, not measured. |
| F8 trademark risk ("Championship Manager"/"ChampMan" branding) | **PARTIAL — DECIDED by Ram 2026-09-11: rebrand to "Injury Time"** | Ram picked the name (searched: The Gaffer/The Dugout/Giant Killers all taken; Row Z/Backpass/The Away End/Injury Time survived). New identity: **Injury Time** — "A retro football management game compatible with CM 01/02 data files" (nominative fair use; keep "01/02" out of the title). CM-R10 scope: repo rename plan, tagline, docs sweep. |
| F9 fast headless sim belongs in Phase 1, not Phase 4 | **ACCEPTED** | 380–2,000 matches/season through a minute-tick loop makes Phase 2 untestable. Dual-mode engine (full event sim + fast headless) from CM-014; CM-062 pulled forward. |
| F10 unmapped TStaff 58–144 bytes block contracts/wages | **ACCEPTED** | New card: reverse-engineer before Phase 2; heuristic contract generator as fallback. |
| F11 7–8 week timeline fantasy (Phase 0 took 13 days vs 1 wk budget) | **ACCEPTED — DECIDED by Ram 2026-09-11: no ship date, quality-first** | Ram's ruling: side project, no deadline; goal is a game that's *good* — the thing he loved playing, with the mobile play-a-friend option as a personal must-have. Plan v3 drops calendar-pressure framing; phases gate on done-when-real (falsification tests, harness numbers), not weeks. Implication: full Phase 1–3 scope stays; async play-a-friend multiplayer rises from "post-v1 maybe" to a named post-v1 commitment (design already decided: async mailbox over serverless KV per H04). |
| F12 offsets thread (t=1540) is exe-patch discussion, wrong source | **PARTIAL** | Verified: notes file is dominated by exe/memory/patch content (175 vs 33 .dat mentions) and only 6 of 31 pages scraped. But "zero relevance" is overstated — keep as secondary reference, deprecate as primary spec. Parser work bases on Structures.cs + binary validation. |
| F13 commentary authoring pipeline missing | **ACCEPTED** | JSON template dictionary, ≥5 variants per event type, token replacement. |

## Design findings

| # | Ruling | Notes |
|---|---|---|
| P1 ZIP onboarding + instant demo match | **ACCEPTED** | Displacing CM-013 raw DB viewer: **PARTIAL** — keep a minimal viewer as the parser verification surface, demote from headline feature. |
| P2 retro-authentic UI + bottom thumb bar, kill "Manager Royale" | **ACCEPTED** | Theme confirmed in code; mobile IA from day 1 (CM-061 pulled into Phase 1). |
| P3 three-gear sim dial (Instant / Key moments / Full) | **ACCEPTED** | Aligns with F9; effort genuinely small once events are generated upfront. |
| P4 suspense-paced commentary + Web Audio + haptics | **PARTIAL** | Suspense pacing + template variance accepted; audio/haptics accepted as small-scope items. Displacing CM-052/CM-053 (international management): those are already Phase 3/post-MVP scope, so "displacement" is mostly notional — accept the reordering, not the deletion. |
| P5 morning briefing + micro-saved match state | **PARTIAL** | Micro-save/resume (mobile interruption is real) merges into CM-020 save system. Morning briefing card → Phase 2. Replacing the desktop-style inbox entirely: rejected — CM-038 stays, briefing complements it. |
| P6 boardroom/fan stakes meters + "as it stands" table | **PARTIAL** | Cheap, high-leverage — accept into Phase 2 (CM-038/CM-035 adjacency). Displacing CM-050 cup complexity: **REJECTED** — cups are core CM01/02 identity; not cut on a UX reviewer's hunch. |
| P7 slot-and-tap mobile tactics | **PARTIAL — defer to Phase 2** | Good pattern; displacing CM-051 CL tiebreakers rejected (edge-case logic is small, correctness matters). |
| P8 scout's black book presets | **ACCEPTED** | Pre-canned SQL filters, trivially cheap, high nostalgia value. Downgrading CM-034 regen math: already low priority. |

## Audit-pass findings (D1–D16 brief)

| # | Ruling | Notes |
|---|---|---|
| H01 phantom league — .dat holds entity data only; fixtures/rules/prize money hardcoded in cm0102.exe | **ACCEPTED — CRITICAL, plan-level** | Verified: format notes map stadium as FK into stadium.dat; no competition-rule tables in parser scope. Phase 2 cannot assume .dat yields a playable season. Plan v3 must add a `rules/` CompetitionRuleEngine (hardcoded England pyramid config first) and mark the "5 assumptions falsification tests" (esp. Assumption 5) as pre-Phase-2 gates. |
| H02 engine math collapse (threshold/sigmoid/ratio inflation) | **ACCEPTED — merges with F1** | Same root cause as F1: invented constants. One fix path: CM-R03 calibration harness decides. Reviewer's 0.14 CP/min + dual-roll proposal is a starting hypothesis, not the answer — measure, don't re-invent. |
| H03 attribute ghosting → NaN, purge CM2 96/97 names | **ACCEPTED — merges with F4** | parser.ts is canonical for field names (see F4 ruling); plan-v2's naming lecture must be corrected in v3. |
| H04 WebRTC async play-by-mail impossibility in multiplayer.md | **ACCEPTED** | Verified contradiction (plan-v2 Firebase row vs multiplayer.md host-authoritative WebRTC). Async play-by-mail over serverless mailbox (Cloudflare Worker KV class) is the only coherent async design; keep synchronous co-op as a separate later concern. Doc fix in plan v3 + multiplayer.md rewrite (post-v1, low urgency). |
| H05 OPFS/COOP/COEP/Safari private-browsing/multi-tab lock | **ACCEPTED — merges with F6** | Same conclusion, more failure modes (multi-tab NoModificationAllowedError, private browsing SecurityError). Reinforces in-memory + IndexedDB recommendation. |
| H06 iOS folder-upload impossibility → single .zip | **ACCEPTED — merges with F7/P1** | CM-R07 already tracks; add fflate in-worker extraction detail. |
| H07 main-thread ingestion freeze (5–45s, Jetsam) | **ACCEPTED — NEW card needed** | The "50MB parses in ms" claim conflates buffer read with object-graph allocation. Reviewer's 6M-property/5–25s figures are estimates — the falsification test (measure wall-clock + heap on real retail data) must run before CM-012 design. Streaming to storage in batches + worker isolation accepted. New card CM-R11. |
| H08 god-mode tactics (ultra_attacking, zero downside; resolveChance never sees mentality) | **ACCEPTED — NEW card needed** | Cross-team coupling (counter-attack bonus) + defensive degradation from high mentalities. CM-R03 must include a tactics-balance check in the harness (ultra-attacking vs balanced win-rate delta within sane bounds). CM-R12. |
| H09 stamina decay decimation (2.1%/min worst case → 0 stamina by min 60) | **ACCEPTED — merges into CM-R03** | Same class as F1: invented constants. Target: finish 90' at 70–82% condition normal tempo; halftime recovery. Measured by the same harness. |
| H10 stadium.dat / club_comp.dat unparsed (stadium name/capacity, competition names missing) | **ACCEPTED — NEW card needed** | Verified: club.dat has only a 4-byte stadium FK. Parser work card CM-R13 before CM-013 viewer. |
| H11 Math.random vs determinism | **ACCEPTED — merges with F2** | Same finding, third independent pass. Triple redundancy makes this the most-confirmed hole in the project. |
| H12 SQL DDL migration runner vs TS object migrations | **ACCEPTED — ADAPTED (DECIDED)** | Real incoherence — but the fix follows the storage decision, not the SQLite assumption: saves are a versioned `{schemaVersion, payload}` envelope with ordered TS migration functions on load (authoritative: `decisions-2026-09-11.md`); the SQL DDL runner requirement dissolves with SQLite-WASM deferred. CM-020 records version + migration chain. |
| H13 batch-only engine prevents in-match intervention | **ACCEPTED — NEW card needed** | Generator/state-machine design (`MatchSimulation.stepMinute()` + `applySubstitution/setTactic`) is the right call; folds into CM-R03's engine recalibration scope — one redesign, not two. |
| H14 Safari 7-day storage eviction | **ACCEPTED — small** | `navigator.storage.persist()` + milestone export-save prompt; folds into CM-020 save system scope. |
| H15 zombie Firebase/@google/genai deps + root config files | **ACCEPTED** | Confirmed on disk (firebase-applet-config.json, firebase-blueprint.json, firestore.rules). Already in CM-R05 scope; add root-file deletion + App.tsx decoupling explicitly. |
| H16 MVP definition math error (Phase 0+1 = 4.5 wks, not 7–8; 7-wk counsel estimate included career loop) | **ACCEPTED** | Plan v3 must rename Phase 1 = "Exhibition Match Milestone", Phase 2 = "Career MVP" and fix the arithmetic. Merges with F11 timeline honesty. |
| D6 home advantage +10% vs +15% | **ACCEPTED** | Verified contradiction (plan-v2:269 vs match-engine.md:26). Harness measures; doc precedence rule says neither doc wins by default. |
| D15 Phase 0 gate "passed" prematurely | **PARTIAL** | Gate correctly caught CM2-vs-CM01/02 struct mismatch, but closed before stadium/competition tables mapped (H10) and TStaff contract bytes (F10) — CM-R06/CM-R13 reopen it narrowly. |
| D16 save-size 10–15MB | **PARTIAL** | Flagged as unmeasured (engineer's 30–50MB counter-estimate also unmeasured). Measure in CM-R03 harness; don't pick a number by argument. |

## D1–D16 decision inventory — explicit rulings (second-agent fix: no silent skips)

| # | Decision | Verdict | Maps to |
|---|----------|---------|---------|
| D1 | TS DataView parser; "50MB parses in ms" | **RISKY** | Buffer read is fast; object-graph allocation is the real cost (H07, CM-R11 falsification test). |
| D2 | Dual parsers TS + Python | **BROKEN** | F5 — delete Python converter, single TS CLI. CM-R05. |
| D3 | SQLite-WASM + OPFS | **RISKY → DEFERRED (DECIDED)** | F6 + H05 — **DECIDED by Ram: walk back SQLite-WASM for MVP** (authoritative: `decisions-2026-09-11.md`); in-memory typed buffers + IndexedDB end-of-turn writes; SQLite-WASM = Phase-2 upgrade path only. |
| D4 | BYOD + sample dataset | **RISKY** | F7 + H06 — CM-R07 (zip importer, sample universe, demo match). |
| D5 | Multi-file .dat + player_setup.cfg merge | **SOUND (partial)** | CM-005 already merged (699ae5f); gaps tracked by CM-R06 (TStaff bytes) + CM-R13 (stadium/club_comp). |
| D6 | Chance creation → conversion model | **BROKEN** | F1 + H02 + this row's own +10%/+15% contradiction — CM-R03 harness. |
| D7 | CM01/02 original attribute names | **BROKEN (as documented)** | F4 + H03 — parser.ts canonical for field names; plan prose wrong; display labels verified separately. |
| D8 | Multiplayer docs disagree | **BROKEN** | H04 — plan-v2 Firebase row vs multiplayer.md host-authoritative WebRTC; async mailbox design wins. |
| D9 | Text commentary (2D) presentation | **SOUND (with conditions)** | Presentation choice itself confirmed right (keep-list); execution gaps tracked: F13 + P4 (CM-R09 template dictionary + pacing), H13 (state machine for in-match intervention, folded into CM-R03). |
| D10 | PWA platform, no app store | **SOUND (with conditions)** | Platform choice stands; platform *realities* need engineering: H05 (OPFS constraints), H14 (Safari 7-day eviction → storage.persist + export-save), P2 (mobile IA day 1, CM-R08). |
| D11 | 7–8 week MVP | **BROKEN (arithmetic) → RESOLVED (DECIDED)** | F11 + H16 — Phase 0+1 = 4.5 weeks and is an exhibition-match milestone; **DECIDED by Ram: no ship date, quality-first, full scope** — plan v3 renames phases (Exhibition Match Milestone / Career MVP) and drops calendar framing. |
| D12 | Deterministic seeds | **BROKEN (as drafted)** | F2 + H11 — Math.random in spec pseudocode; seeded PRNG mandatory, ESLint ban. |
| D13 | Versioned save schema | **RISKY → RESOLVED (DECIDED, adapted)** | H12 — with storage decided (in-memory + IndexedDB end-of-turn), saves use a versioned `{schemaVersion, payload}` envelope + ordered TS migration functions on load; SQL DDL runner not required (SQLite-WASM deferred). CM-020. |
| D14 | Firebase deferred, dead weight remains | **BROKEN (repo state)** | H15 — root firebase-*.json/firestore.rules confirmed on disk; @google/genai in package.json; CM-R05. |
| D15 | Phase 0 as 1-week gate | **SOUND (closed early)** | See D15 row above — gate caught the CM2 mismatch but closed before stadium/competition/TStaff coverage. |
| D16 | Save-size 10–15MB | **UNMEASURED** | See D16 row above — measure in CM-R03 harness; both 10–15MB and the 30–50MB counter-claim are estimates. |

**Evidence-chain note (second-agent fix):** rulings H01–H16 cite `creative-decisions-audit-gemini38.md`, which is **not merged** — it lives on branch `docs/creative-decisions-audit` (commit 057dc07) pending its own PR. Reviewers of this verdict should fetch that branch to audit the evidence: `git fetch origin docs/creative-decisions-audit`. All code-level claims in the H-rulings were independently re-verified on main by Hermes (see "Verified by direct inspection" table), so the verdict stands even if that branch is later reworked.

## Reviewer-invented numbers flagged (per honesty rule)

- Design: "85% abandonment", "400% slower evaluation", "saves 15 engineer-days" — unmeasured estimates, treated as directional.
- Engineer: "~45 goals/match" is *derived* (90 chances × 25%) and stands; "3–5 min frozen CPU" and "14–18 weeks" are estimates; "30–50MB save" unverified.

## Contradiction ruled

Engineer F4 says code should use `finishing`/`decisions`; plan-v2 says those names are wrong. Ruling: **defer to the parser** — parser.ts was validated against real retail data (CM-006), plan prose was not. Display labels verified separately against the actual game UI. This kills the naming fight as a Phase 1 blocker.

## Net outcome

**All three Ram decisions landed 2026-09-11 — CM-R10 unblocked:**
1. **Storage: in-memory struct-of-arrays typed buffers + IndexedDB end-of-turn full-state writes** (authoritative record: `decisions-2026-09-11.md`; corrects the SQLite-worker reading this file previously carried); GitHub Pages stays; Zustand stays UI-only; autosave rotation + manual slots + storage.persist() + export-save; versioned `{schemaVersion, payload}` save envelope.
2. **Rebrand: "Injury Time"** — tagline "A retro football management game compatible with CM 01/02 data files."
3. **Timeline: no ship date, quality-first** — full Phase 1–3 scope, phases gate on measured done-when-real, async play-a-friend multiplayer is a named post-v1 commitment.

- **Verdict adopted: FIX FIRST** — no Phase 1 feature code until the engine recalibration (F1/F2/F3/H02/H08/H09/H13), parser consolidation (F5/H03), storage decision (F6/H05 — now decided), and ingestion-isolation test (H07) land.
- **Plan v3 required**, incorporating: corrected engine section with measured-not-invented constants, dual-mode + state-machine engine in Phase 1, storage architecture decision, CompetitionRuleEngine (`rules/`) acknowledging .dat = entity database only (H01), timeline honesty + MVP definition fix (F11/H16), naming harmonization per parser.ts (F4/H03), multiplayer doc contradiction resolved (H04), onboarding cards (F7/H06/P1).
- ~~Decisions required from Ram~~ → **All decided 2026-09-11** (see Net outcome above; F6/F8/F11 rows carry the DECIDED markers).

## Triple-confirmed holes (found independently by ≥2 passes — highest confidence)

1. **Math.random() vs mandated determinism** — F2, H11 (2 passes) + brief D12: 3 confirmations.
2. **Engine math produces absurd scorelines** — F1, H02, brief D6: 3 confirmations.
3. **Attribute naming split (CM2 96/97 names in plan vs TPlayer names in parser)** — F4, H03, brief D7: 3 confirmations.
4. **OPFS/SQLite-WASM platform constraints** — F6, H05, brief D3: 3 confirmations.
5. **BYOD multi-file mobile upload** — F7, H06, brief D4: 3 confirmations.

## Follow-up cards created on kanban board `champman`

CM-R01 (repo hygiene/CI/PR protocol), CM-R02 (this adjudication), CM-R03 (engine calibration harness — absorbs F1/F2/F3/H02/H08/H09/H13/D6/H09), CM-R04 (standing second-agent PR review duty), CM-R05 (CM-010 scaffold + parser consolidation — absorbs F5/H15), CM-R06 (TStaff 58–144 reverse-engineering), CM-R07 (onboarding: ZIP importer + sample universe + demo match — absorbs F7/H06/P1), CM-R08 (retro UI reset + mobile-first shell), CM-R09 (commentary template dictionary), CM-R10 (plan v3 rewrite after Ram's three decisions), CM-R11 (ingestion worker-isolation falsification test — H07), CM-R12 (tactics balance coupling — H08), CM-R13 (stadium.dat + club_comp.dat parsing — H10).