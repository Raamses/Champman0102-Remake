# ChampMan 01/02 Remake — Creative & Design Decisions Audit

**Auditor:** Gemini 3.8 Flash (High) (agy)  
**Date:** 2026-09-11  
**Target:** ChampMan 01/02 Remake (`Raamses/Champman0102-Remake`)  
**Scope:** Master Plan v2, Match Engine Architecture, Multiplayer Architecture, Binary Format Research, Community Offsets Research, Prior Reviews (v1 & Counsel).  
**Mode:** Strictly Adversarial. No praise. No repetition of prior findings from `plan-v1-review.md` or `counsel-review.md`. Every hole specifies **what is wrong**, **why it matters**, **when it breaks**, and **what to do instead**.

---

## 1. Verdict Inventory (D1 – D15)

| # | Decision | Verdict | Key Reason |
|---|----------|---------|------------|
| **D1** | TypeScript DataView parser over Rust→WASM; "50MB parses in ms in browser" | **RISKY** | 50MB binary I/O is fast, but allocating 6M+ JS properties across 132k staff and 110k players on the main thread takes 5–25s and risks mobile Safari Jetsam memory kill. |
| **D2** | Dual parsers: TS runtime + Python offline converter (`dat_to_json.py`) | **RISKY** | Maintenance divergence trap. Offsets and struct versions (v1 vs v2) will drift between Python and TS. Python is useless for a BYOD client-side PWA. |
| **D3** | SQLite-WASM + OPFS persistence over IndexedDB | **RISKY** | OPFS SyncAccessHandle requires Web Workers and Cross-Origin Isolation (`COOP/COEP`). Static PWA hosts fail without worker hacks; iOS Safari Private Browsing throws `SecurityError`. |
| **D4** | BYOD: user supplies own .dat files; minimal sample dataset | **RISKY** | Mobile Safari does not support folder upload (`webkitdirectory`). A user on iOS cannot select 10+ `.dat` files from Files app without a single `.zip` extraction pipeline. |
| **D5** | Multi-file .dat: index/club/nat_club/nation/staff + player_setup.cfg merge | **BROKEN** | Fatal assumption that `.dat` contains the game. Fixtures, league rules, prize money, disciplinary rules, and transfer windows are NOT in `.dat` files; they were hardcoded in `cm0102.exe`. |
| **D6** | Chance creation → conversion model (per-minute loop, CP threshold, stamina) | **BROKEN** | Catastrophic mathematical flaws: threshold 8.0 with 12 CP/min triggers a chance every minute (90 chances/match); sigmoid saturates; stamina decay of 1%/min cripples squads by minute 60; ultra-attacking has zero defensive penalty. |
| **D7** | CM01/02 original attribute names (Shooting, Dirtyness, BigOccasion) | **BROKEN** | Plan v2 and Match Engine still use obsolete CM2 96/97 attribute names. Real CM01/02 binary uses `finishing`, `freeKicks`, `decisions`, `importantMatches`. Wiring v2 engine to parser causes `NaN` evaluations and eternal 0-0 draws. |
| **D8** | Multiplayer: Plan v2 (Async Play-by-Mail) vs Multiplayer doc (WebRTC P2P) | **BROKEN** | Irreconcilable contradiction. WebRTC P2P requires simultaneous online peers and cannot do async play-by-mail. Plan v2 still claims Firebase Cloud Functions, which Multiplayer doc explicitly abandoned. |
| **D9** | Text commentary (2D) match presentation | **RISKY** | Commentary strings (`events.dat`) are omitted; no in-match tactical interaction loop exists in the engine (state machine is batch-only, precluding half-time subs). |
| **D10** | PWA platform, no app store | **RISKY** | Safari evicts inactive PWA storage after 7 days without warning. CM's high-density tabular UI is unusable on 390px mobile screens without a dedicated mobile information architecture from Day 1. |
| **D11** | 7–8 week MVP (Phase 0 + Phase 1) with card list CM-001..021 | **RISKY** | Phase 1 is scoped only as an exhibition match tech demo (no league, no career), but is estimated at 7-8 weeks by conflating it with Phase 2 career mode. SQLite-WASM worker integration alone will blow this schedule. |
| **D12** | Deterministic seeds for match-engine unit tests | **BROKEN** | The draft engine specifications in `plan-v2.md` and `match-engine.md` call native unseeded `Math.random()`, directly violating determinism. |
| **D13** | Versioned save schema + migration functions | **RISKY** | Save state lives in SQLite tables, not a JSON document. Schema evolution requires SQL DDL migrations (`ALTER TABLE`), which the TypeScript JSON migration plan completely ignores. |
| **D14** | Firebase deferred post-v1 (applet config / firestore.rules still in root) | **BROKEN** | Architecture drift: `App.tsx` and dependencies are still hard-wired to Firebase Auth and Firestore; root contains unmaintained dead security rules and `@google/genai` dead weight. |
| **D15** | Phase 0 .dat format spike as 1-week gate before app work | **SOUND** | Correct decision that already prevented catastrophic failure (caught the CM2 vs CM01/02 struct mismatch in CM-006). However, the gate was declared passed before competition and stadium files were mapped. |

---

## 2. Numbered Holes Report (Ranked by Severity)

### Priority 0: Project-Killing Flaws (Must Fix Before Any Engine or UI Code)

#### Hole 01: The "Phantom League" Fallacy — `.dat` Files Contain Zero Game Logic or Calendar Rules
- **What is wrong:** Plan v2 assumes that parsing `.dat` files provides the data needed to run a league season. In reality, CM01/02 `.dat` files (`club.dat`, `staff.dat`, `club_comp.dat`) are merely an entity-relationship directory of names, IDs, stadium capacities, and player stats. As proven by the reverse-engineering offsets thread (`offsets-thread-notes.md`), **all competition rules, fixture generation algorithms, league calendars, promotion/relegation play-off brackets, substitution limits (3 of 5 vs 3 of 7), disciplinary thresholds, work permit rules, and prize/TV money are hardcoded in the x86 machine code of `cm0102.exe`**.
- **Why it matters:** Phase 2 (Career Mode) allocates 2–3 weeks to build season simulation, league tables, and scheduling. When the builder finishes the `.dat` parser, they will discover that the binary files tell them *nothing* about when fixtures are played, who qualifies for the Champions League, or how the FA Cup bracket is drawn. The team will hit a brick wall.
- **When it breaks:** Phase 2 kickoff (Card CM-030).
- **Concrete Fix:** 
  1. Stop treating the `.dat` files as a game definition. They are only an entity database.
  2. Author a formal, modular TypeScript `CompetitionRuleEngine`.
  3. Hardcode the English football pyramid rules for Phase 1/2 in TypeScript configuration files (`rules/england.ts`): 20 clubs, 38 fixtures, 3 points for win, goal difference tiebreaker, 3 relegation slots, 3 of 5 substitutions.
  4. Explicitly defer international and continental cup scheduling to Phase 3.

---

#### Hole 02: Mathematical Collapse of the Match Engine Formulas
- **What is wrong:** The chance creation and resolution formulas in `plan-v2.md` and `match-engine.md` are mathematically broken in three independent ways:
  1. **Threshold Frequency:** In `plan-v2.md` (lines 320–339), `calcChancePoints` yields `~10 to 15` points per minute for typical squads (`(14 * 0.6 + 12 * 0.4) * modifiers`). The `CHANCE_THRESHOLD` is set to `8.0`. Every team crosses the threshold **every single minute**, creating 90 chances per team (180 per match), rather than the intended ~12.
  2. **Sigmoid Saturation:** In `match-engine.md` (lines 70–76), `attackQuality` is a raw sum of weighted attributes (`15 * 3 + 15 * 2 + 15 * 1.5 + ... = 135`). Defense and keeper qualities are subtracted directly (`135 - 15 - 78 = 42`). `sigmoid(42)` is identically `1.0000000000000000`. Every single attack results in a goal.
  3. **Ratio Conversion Inflation:** In `plan-v2.md` (lines 351–355), `conversionRoll = attack / (attack + def*0.4 + gk*0.6) ≈ 0.50`. With the `0.8 + rand*0.4` multiplier, `goalChance` is `> 0.55` roughly 40% of the time. In football, shot conversion is 10–14%. A 40% conversion rate on 12 chances yields 5 goals per team (10 goals/match).
- **Why it matters:** The match engine is the core product. If implemented as written, it generates absurd basketball scores (e.g. 45–38 or 8–6) and completely destroys the tactical credibility of the game.
- **When it breaks:** Phase 1 (Card CM-014 / CM-019).
- **Concrete Fix:**
  1. Re-normalize `chancePoints` to represent **expected fractional chances per minute**:
     $$\text{Base CP/min} = \frac{\text{Attacking Midfield Quality}}{\text{Opponent Defensive Quality}} \times 0.14$$
     Over 90 minutes, an even match generates $90 \times 0.14 = 12.6$ chances per team.
  2. Set `CHANCE_THRESHOLD = 1.0`. When `accumulatedCP >= 1.0`, trigger a chance and subtract `1.0` (preserve remainder!).
  3. Split chance resolution into two rolls:
     - **Shot Accuracy:** Attack quality vs pressure $\to$ On-Target (40%), Off-Target (40%), Blocked (20%).
     - **Shot Conversion:** On-Target shot vs Goalkeeper $\to$ Goal (25–30% of on-target shots, yielding an overall 10–12% conversion rate), Saved (60%), Rebound/Corner (10–15%).

---

#### Hole 03: The Attribute Ghosting Catastrophe (`NaN` Match Results)
- **What is wrong:** `plan-v2.md` (lines 112–143, 344) and `match-engine.md` (lines 53, 70) specify attribute names based on AmosBot's erroneous CM2 96/97 notes: `shooting`, `setPieces`, `intelligence`, `bigOccasion`, `dirtyness`. However, the verified parser (`src/lib/dat-parser/parser.ts`, lines 349–392) uses the actual CM01/02 struct names: `finishing`, `freeKicks`, `decisions`, `importantMatches`, `dirtiness`.
- **Why it matters:** When `resolveChance` accesses `attacker.attributes.shooting` or `player.attributes.bigOccasion`, JavaScript evaluates them as `undefined`. Any arithmetic operation on `undefined` yields `NaN`. All comparisons (`NaN > 0.55`) return `false`. **Every single match simulated against parsed data will silently terminate 0-0 with 0 shots, 0 saves, and 0 events.**
- **When it breaks:** Phase 1 integration (Card CM-014 + CM-016).
- **Concrete Fix:** Update `plan-v2.md`, `src/types.ts`, and `docs/vault/architecture/match-engine.md` immediately to match `CM2PlayerAttributes` in `parser.ts`:
  - `shooting` $\to$ `finishing`
  - `setPieces` $\to$ `freeKicks`
  - `intelligence` $\to$ `decisions`
  - `bigOccasion` $\to$ `importantMatches`
  - `dirtyness` $\to$ `dirtiness`
  - Eliminate the phantom attribute `creativity` (use `flair` and `vision`).

---

#### Hole 04: The Asynchronous WebRTC Impossible Architecture
- **What is wrong:** `docs/vault/architecture/multiplayer.md` designs a "Host-Authoritative WebRTC P2P" architecture and labels it "Async Play (AGy's play-by-mail suggestion)" where "Host holds the week open until all peers send Continue." This is an architectural impossibility. WebRTC DataChannels require an active, bidirectional peer-to-peer connection between running browser instances. If Player A takes their turn at 9:00 AM and Player B takes their turn at 6:00 PM, WebRTC cannot communicate because Player A's browser is closed or suspended.
- **Why it matters:** The project claims to have solved multiplayer with "$0 server cost" via WebRTC, but the described gameplay loop is asynchronous play-by-mail. You cannot build play-by-mail over synchronous WebRTC without an always-on host machine (which destroys the mobile PWA premise).
- **When it breaks:** Post-v1 multiplayer design kickoff.
- **Concrete Fix:** 
  1. Formally decouple synchronous LAN-style play from asynchronous play-by-mail.
  2. For async play-by-mail, reject WebRTC entirely. Use an asynchronous mailbox pattern: a free-tier Cloudflare Worker with KV/D1 or Supabase free tier.
  3. Turn payloads are compressed JSON action packets (`{ week: 14, managerId: 'user_1', orders: [...] }`) stored in KV. When the final manager submits their turn, the worker or the next active client triggers the weekly simulation batch.

---

### Priority 1: High-Risk Architecture & Mechanical Flaws

#### Hole 05: Mobile Browser OPFS & SharedArrayBuffer Fatal Lockout
- **What is wrong:** Plan v2 adopted SQLite-WASM + OPFS (Decision D3) to replace IndexedDB. However, running SQLite-WASM with high-performance persistent OPFS (`opfs-sahpool` or `opfs` VFS) has strict platform constraints that are completely unaccounted for:
  1. It **must** execute in a dedicated Web Worker; the synchronous `FileSystemSyncAccessHandle` API is not available on the browser window/main thread.
  2. It **requires** Cross-Origin Isolation (`Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`). On static hosting (like GitHub Pages), these HTTP headers cannot be set natively.
  3. iOS Safari in Private Browsing blocks OPFS with a `SecurityError`.
  4. If a user opens the PWA across two browser tabs, OPFS locks the database file; the second tab crashes with `NoModificationAllowedError`.
- **Why it matters:** Without cross-origin headers, SQLite-WASM fails on initial boot. Without Web Worker isolation, the main thread freezes during heavy queries. Without lock management, multi-tab usage corrupts the save.
- **When it breaks:** Phase 1 (Card CM-011).
- **Concrete Fix:**
  1. Build a dedicated SQLite Web Worker (`sqlite.worker.ts`) using Comlink or standard `postMessage` RPC.
  2. Add `coi-serviceworker` to `index.html` to inject COOP/COEP headers on static hosts.
  3. Implement feature detection on startup: if OPFS or SharedArrayBuffer is unavailable (e.g. Private Browsing), gracefully fall back to SQLite with IndexedDB VFS or in-memory mode with explicit download prompts.

---

#### Hole 06: BYOD Mobile File Picker Failure (iOS Folder Upload Impossibility)
- **What is wrong:** Decision D4 mandates Bring Your Own Data (BYOD), requiring the user to supply their own `.dat` files. In CM01/02, the database is not a single file; it is a directory containing at least 10 interdependent files (`index.dat`, `club.dat`, `staff.dat`, `nation.dat`, `first_names.dat`, `second_names.dat`, `common_names.dat`, `club_comp.dat`, `nat_club.dat`, `player_setup.cfg`). On iOS Safari, `<input type="file" webkitdirectory>` is **completely unsupported**. A mobile user on an iPhone or iPad cannot upload a directory from the Files app.
- **Why it matters:** The game is positioned as a mobile-friendly PWA. If an iOS user cannot import the data folder, 50%+ of mobile users cannot play the game with custom or original data.
- **When it breaks:** Phase 1 (Card CM-012 / CM-013).
- **Concrete Fix:** 
  1. Do not ask users to select a folder or individual `.dat` files.
  2. Require the user to upload a single `.zip` file (or CM01/02 `.iso` image).
  3. Integrate client-side decompression using `fflate` (lightweight, high-speed pure JS unzip). The PWA extracts the `.dat` files from `Data/` in memory inside a Web Worker.

---

#### Hole 07: Main-Thread Freezing During 50MB Binary Parsing & Ingestion
- **What is wrong:** The claim in Plan v2 that "50MB binary parses in ms in the browser" is dangerously naive. Reading 50MB into an `ArrayBuffer` takes ~10ms. But creating JavaScript object instances for 132,722 `CM2Staff`, 109,940 `CM2Player` (with 53 nested attributes and position ratings each), 10,580 `CM2Club`, and 125,000 names requires allocating over **6 million JavaScript object properties**. In V8 and JavaScriptCore, this allocation takes 5 to 15 seconds on a desktop CPU and 20 to 45 seconds on a mobile device. Then, inserting them into SQLite-WASM takes an additional 15–30 seconds.
- **Why it matters:** Running this pipeline on the main thread will trigger the browser's "Page Unresponsive / Wait or Kill" dialog, drop frames, and trigger aggressive iOS Jetsam process termination due to transient heap spikes (>400MB).
- **When it breaks:** Phase 1 (Card CM-012).
- **Concrete Fix:**
  1. Move the entire ingestion pipeline to a background Web Worker.
  2. Never instantiate a massive array of 110k full player JS objects in memory. Stream records directly from the `DataView` into prepared SQLite statements in batches of 5,000 within a single transaction (`BEGIN TRANSACTION` ... `COMMIT`).
  3. Post progress percentages back to the UI thread (`postMessage({ type: 'PROGRESS', pct })`) to drive an authentic retro loading progress bar.

---

#### Hole 08: Tactics Engine "God-Mode" Exploit (Zero Defensive Downside)
- **What is wrong:** In `plan-v2.md` (lines 320–335), `calcChancePoints` calculates a team's attacking output by multiplying midfield ratings by the mentality modifier:
  `const mentalityMod = { defensive: 0.7, balanced: 1.0, attacking: 1.3, ultra_attacking: 1.5 };`
  However, `calcChancePoints` does **not** reference the opponent's tactics or its own defensive risk. Furthermore, `resolveChance(attacker, defenders, keeper)` in `plan-v2.md` does not receive the attacking or defending team's mentality at all!
- **Why it matters:** Playing `ultra_attacking` increases chance generation by +50% with **zero penalty to defensive stability or chance concession**. A human player will immediately discover that setting 3-4-3 Ultra-Attacking breaks the game and guarantees a 90% win rate.
- **When it breaks:** Phase 1 (Card CM-016).
- **Concrete Fix:**
  1. Chance generation must be coupled across both teams. If Team A plays `ultra_attacking`, Team B's counter-attack chance multiplier must increase proportionally:
     $$\text{Opponent Counter Bonus} = 1.0 + (\text{Mentality} - 1.0) \times 0.8$$
  2. In `resolveChance`, defensive positioning must be degraded by high attacking mentalities (e.g. defenders caught out of position, reducing `defenseStrength` by 25%).

---

#### Hole 09: Stamina Decay Squad Decimation
- **What is wrong:** `match-engine.md` (lines 43, 93–106) specifies stamina decay at `0.5% - 1.0%` per minute base, multiplied by `1.5x` for fast tempo and `1.4x` for high pressing. At high intensity, decay is $1.0\% \times 1.5 \times 1.4 = 2.1\%$ per minute. By half-time (minute 45), players have lost 94% of their stamina. By minute 60, all 22 players are at 0 stamina. The engine specifies that below 30 stamina, attributes drop by $(30 - \text{stamina})\%$, and below 15 stamina, injury risk triples.
- **Why it matters:** Every match played at normal-to-high tempo will devolve into a farce where both teams are walking, attributes are zeroed, and multiple players suffer severe injuries every match.
- **When it breaks:** Phase 1 (Card CM-014 / CM-019).
- **Concrete Fix:**
  1. Base stamina decay must be calibrated to real football: players should finish 90 minutes at 70%–82% condition under normal tempo.
  2. Set base decay to **0.18% per minute** (total 16% decay over 90 mins).
  3. High pressing and fast tempo should increase decay to at most **0.28% per minute** (total 25% decay over 90 mins).
  4. Stamina recovery must occur during half-time (+5% to +8% condition restored during the interval).

---

### Priority 2: Operational, Data Integrity & Gameplay Flaws

#### Hole 10: Unmapped Stadium and Competition Binary Tables (`stadium.dat`, `club_comp.dat`)
- **What is wrong:** Plan v2 (line 217) defines the `Club` entity with embedded stadium details: `{ name: string; capacity: number; seating: number; }`. But `cm0102-format-notes.md` (line 106) proves that `club.dat` does not contain stadium names or capacities; it only contains a 4-byte foreign key `stadium` pointing to `stadium.dat`. Similarly, competition names are integer IDs pointing to `club_comp.dat`. Neither `stadium.dat` nor `club_comp.dat` is parsed in `src/lib/dat-parser/parser.ts` or scheduled in Phase 0.
- **Why it matters:** Club profiles will have missing stadium names, capacity 0, and division numbers instead of "Premier Division" or "Serie A". Ticket revenue calculations in Phase 2 will divide by zero or yield 0 attendance.
- **When it breaks:** Phase 1 UI / Database Viewer (Card CM-013).
- **Concrete Fix:** Add `parseStadiumDat` and `parseClubCompDat` to `src/lib/dat-parser/parser.ts` before Phase 1 begins.

#### Hole 11: Unseeded `Math.random()` Violates Test Determinism
- **What is wrong:** Plan v2 (line 75) and Action Item 12 mandate "Deterministic seeds for match-engine unit tests." Yet the actual implementation code provided in `plan-v2.md` (line 353) and `match-engine.md` (line 79) directly invokes standard JavaScript `Math.random()`:
  `const goalChance = conversionRoll * (0.8 + Math.random() * 0.4);`
  `const roll = Math.random();`
- **Why it matters:** `Math.random()` cannot be seeded in JavaScript. Any unit test attempting to assert that seed `0xDEADBEEF` produces a 2-1 win with an Arsenal goal in minute 43 will fail unpredictably across environments and test runs.
- **When it breaks:** Phase 1 Unit Testing (Card CM-019).
- **Concrete Fix:** Create a deterministic PRNG module (`src/engine/rng.ts`) implementing Mulberry32 or Xoshiro128**. Inject the PRNG instance into the match engine context. Strictly forbid `Math.random()` in ESLint rules.

#### Hole 12: SQL Schema Migration Incompatibility
- **What is wrong:** Plan v2 (Decision D13, Card CM-020) specifies a versioned save schema with migration functions. But Plan v2 stores game state in SQLite-WASM, not in JSON. If the database schema changes between game updates (e.g. adding a new table for European coefficients or adding columns to `player_history`), a TypeScript object migration function cannot migrate an OPFS SQLite binary file.
- **Why it matters:** Career saves from early versions will crash upon loading after any data model change, alienating early testers.
- **When it breaks:** Phase 2 / Phase 3 updates.
- **Concrete Fix:** Implement a standard SQL DDL migration runner. Store a `schema_version` table in SQLite. When opening a save database, execute ordered `.sql` migration patches (`001_init.sql`, `002_add_coefficients.sql`) using `db.exec()`.

#### Hole 13: The "Batch Sim" vs Interactive Match Lock-In
- **What is wrong:** In `plan-v2.md` (lines 307–313), the match engine algorithm is structured as a synchronous batch loop that simulates minutes 1–90 and returns a complete `MatchResult` with an event list. But Card CM-018 promises a "live commentary feed" and managerial decision-making. If the simulation executes all 90 minutes in one synchronous call, the human manager cannot pause at the 60th minute, make tactical substitutions, or change mentality when trailing.
- **Why it matters:** In-match tactical intervention is 50% of the gameplay in CM01/02. Without it, the game is merely an idle spreadsheet viewer.
- **When it breaks:** Phase 1 Match UI (Card CM-018).
- **Concrete Fix:** Design the match engine as an iterable generator or state machine:
  `class MatchSimulation { stepMinute(): MinuteEvents[]; applySubstitution(...); setTactic(...); }`.
  The UI timer steps the engine minute-by-minute, pausing automatically on key events or user input.

#### Hole 14: Silent Safari PWA Storage Eviction
- **What is wrong:** WebKit (Safari on iOS) enforces aggressive storage eviction policies: website data (including IndexedDB and OPFS) for non-installed sites is subject to eviction after 7 days of inactivity. Even installed PWAs can have caches evicted during major iOS system updates if storage pressure occurs.
- **Why it matters:** A user who plays a 10-season career and pauses for two weeks may return to find their save database permanently deleted by the OS with zero recovery recourse.
- **When it breaks:** Post-launch user retention.
- **Concrete Fix:**
  1. Call `navigator.storage.persist()` on initial launch to request persistent storage exemption.
  2. Implement an automated "Export Save" feature that prompts the user to download a `.cm0102save` backup file to local device storage after major milestones (end of season, cup finals).

---

### Priority 3: Codebase Hygeine & Timeline Realism (Nits & Drifts)

#### Hole 15: Zombie Firebase & AI Dependencies in Repo Root
- **What is wrong:** Plan v2 explicitly deferred Firebase to post-v1 (Action Item 3, Card CM-010). However, the repository root still contains `firebase-applet-config.json`, `firebase-blueprint.json`, and `firestore.rules`. Worse, `package.json` contains `firebase: ^12.13.0` and `@google/genai: ^1.29.0`, and `src/App.tsx` is completely coupled to `AuthProvider` and Firestore.
- **Why it matters:** The production bundle is burdened with 200KB+ of unused SDKs. New contributors or subagents will be confused about whether Firebase is active or deprecated.
- **When it breaks:** Phase 1 scaffold cleanup (Card CM-010).
- **Concrete Fix:** Execute Card CM-010 immediately. Remove `firebase` and `@google/genai` from `package.json`. Delete `firestore.rules` and `firebase-*.json`. Refactor `App.tsx` to load from a local mock/SQLite context.

#### Hole 16: Timeline Scoping Math Error (4-Week Tech Demo vs 8-Week MVP)
- **What is wrong:** Plan v2 table #3 states "7-8 week MVP (Phase 0 + Phase 1)". But Phase 0 is budgeted for 1 week and Phase 1 is budgeted for 3–4 weeks ($1 + 3.5 = 4.5$ weeks). Where did 7–8 weeks come from? In Counsel Review (line 51), Nemotron's 7-week MVP estimate explicitly included the **Single-League Season Loop** (which in Plan v2 is Phase 2: Career Mode, cards CM-030..040, an additional 2–3 weeks).
- **Why it matters:** If the team ships Phase 1 after 4–5 weeks, they only deliver a single exhibition match tech demo. Stakeholders expecting a playable "Championship Manager" game will find that leagues, transfers, and careers do not exist until week 8.
- **When it breaks:** End of Phase 1 milestone review.
- **Concrete Fix:** Align terminology in Plan v2. Clearly designate Phase 1 as "Exhibition Match Milestone" (Week 4) and Phase 2 as "Playable Career MVP" (Week 7–8).

---

## 3. Cross-Document Contradiction Matrix

| Subject | Document A | Document B | Conflict Detail | Resolution |
|---------|------------|------------|-----------------|------------|
| **Multiplayer Architecture** | `plan-v2.md` (§Architecture line 58, §Post-v1 line 462) | `architecture/multiplayer.md` (lines 11–37, 74–80) | Plan v2 specifies **Firebase Cloud Functions** for async play-by-mail. Multiplayer doc explicitly **abandons Firebase/Cloud Functions** ($0 cost) in favor of **Host-Authoritative WebRTC P2P**. | Kill WebRTC P2P for async play. Adopt lightweight cloud mailbox (Cloudflare Worker / Supabase). |
| **Player Attributes** | `plan-v2.md` (§Data Model lines 112–143) | `research/cm0102-format-notes.md` & `src/lib/dat-parser/parser.ts` | Plan v2 lists `shooting`, `setPieces`, `intelligence`, `bigOccasion`. Format notes and actual parser prove those were from CM2 96/97; real CM01/02 has `finishing`, `freeKicks`, `decisions`, `importantMatches`. | Purge CM2 96/97 names from `plan-v2.md` and `match-engine.md`. |
| **Storage Engine** | `plan-v2.md` (§Key Decisions line 72) | `architecture/multiplayer.md` (line 60) | Plan v2 mandates **SQLite-WASM + OPFS**. Multiplayer doc states **Host saves league state to IndexedDB**. | Standardize on SQLite-WASM OPFS across all docs. |
| **Save File Structure** | `plan-v2.md` (lines 232–250) | `plan-v2.md` (Key Decisions line 72) | Line 232 defines a JSON `SaveFile` object referencing an OPFS blob. SQLite with OPFS stores the database directly as a virtual file, not as a JSON container referencing a blob. | Treat SQLite database file as the save container; metadata lives in a `save_metadata` SQL table. |
| **MVP Definition** | `plan-v2.md` (Table line 16) | `plan-v2.md` (Phase Breakdown lines 392, 412) | Table claims Phase 0 + 1 is the "7–8 week MVP". Phase breakdown shows Phase 0 + 1 is 4–5 weeks and only plays a single match. Season play is Phase 2. | Rename Phase 1 to "Match Engine Tech Demo"; Phase 2 is "Career Mode MVP". |
| **Tactics Defense Multiplier** | `plan-v2.md` (§Tactics Wiring line 365) | `plan-v2.md` (`calcChancePoints` lines 320–335) | Table says "defensive = +20% defense strength". But `calcChancePoints` and `resolveChance` contain no code or parameters implementing defensive bonus. | Wire tactic defensive modifiers into `resolveChance`. |

---

## 4. The 5 Assumptions Most Likely to Be Wrong

### Assumption 1: "A 50MB CM01/02 binary database parses in milliseconds in the browser with TypeScript DataView."
- **Why it's suspect:** Parsing the binary buffer takes milliseconds; constructing 250,000+ complex JavaScript object graphs for 132k staff, 110k players, and 10k clubs takes 10–30 seconds and consumes >300MB of heap.
- **Falsification Test:**  
  Run a standalone Node/Browser script that loads the real retail database files (`staff.dat`, `club.dat`, `names.dat`) into memory, parses all records into full JavaScript objects matching the `Player` interface, and records:
  1. Exact wall-clock execution time (`console.time`).
  2. Memory footprint via `process.memoryUsage()` or Chrome DevTools Memory Heap Snapshot.
- **Pass/Fail Threshold:** If parsing and object allocation takes $>2.0$ seconds or peak heap exceeds $150\text{MB}$, the assumption is **FALSIFIED**.

---

### Assumption 2: "SQLite-WASM with OPFS works seamlessly out of the box on static hosting."
- **Why it's suspect:** OPFS with `FileSystemSyncAccessHandle` requires cross-origin isolation (`SharedArrayBuffer`). Static web servers (GitHub Pages) do not serve `COOP/COEP` headers by default. Furthermore, Safari Private Browsing completely disables OPFS.
- **Falsification Test:**  
  Deploy a minimal Vite bundle containing `@sqlite.org/sqlite-wasm` initializing an OPFS database to GitHub Pages. Open the URL on:
  1. Desktop Chrome (standard window).
  2. iOS Safari (standard tab).
  3. iOS Safari (Private Browsing tab).
- **Pass/Fail Threshold:** If the database throws `SharedArrayBuffer is not defined`, `SecurityError`, or fails to persist a table across page refresh on any of these three environments, the assumption is **FALSIFIED**.

---

### Assumption 3: "The chance creation + conversion formulas produce realistic football scorelines (2.5–2.7 goals/match)."
- **Why it's suspect:** As mathematically demonstrated in Hole 02, the formulas in `plan-v2.md` and `match-engine.md` produce either 80+ shots per game or 100% conversion rates due to threshold and scaling errors.
- **Falsification Test:**  
  Implement the exact `calcChancePoints` and `resolveChance` functions from `plan-v2.md` in a headless Vitest script. Simulate 1,000 matches between Arsenal (attributes ~15–18) and Southampton (attributes ~11–13). Calculate:
  1. Average chances created per team.
  2. Average shots on target per team.
  3. Average goals per match.
- **Pass/Fail Threshold:** If average goals per match is $< 2.0$ or $> 3.5$, or if total chances per match exceeds $30$, the assumption is **FALSIFIED**.

---

### Assumption 4: "Multiplayer can operate host-authoritatively over WebRTC P2P as an asynchronous play-by-mail game."
- **Why it's suspect:** Mobile OSes suspend background browser tabs after 15–30 seconds, immediately dropping WebRTC peer connections. WebRTC cannot store-and-forward turns when the host is asleep.
- **Falsification Test:**  
  Set up two mobile devices connected via a basic WebRTC DataChannel demo. Device A acts as Host, Device B as Peer.
  1. Send a ping message every 30 seconds from B to A.
  2. Lock the screen of Device A (Host) for 5 minutes.
  3. Attempt to send an action from Device B to Device A.
- **Pass/Fail Threshold:** If Device B encounters a connection timeout, dropped packet, or ICE disconnect, the assumption is **FALSIFIED**.

---

### Assumption 5: "All required competition rules, fixtures, and prize money structures exist in the `.dat` database."
- **Why it's suspect:** Decades of community research (`offsets-thread-notes.md`) prove that `cm0102.exe` hardcoded league structures, prize pools, and schedules in machine code.
- **Falsification Test:**  
  Inspect the parsed data tables from `club_comp.dat`, `nation.dat`, and `club.dat`. Write a script searching for:
  1. Premier League win points (3) and draw points (1).
  2. Relegation position cutoff (18th).
  3. Prize money amounts for Premier League finishing positions.
- **Pass/Fail Threshold:** If these values cannot be located inside the parsed binary data structures, the assumption is **FALSIFIED**.

---

## 5. Summary of Recommended Immediate Actions

1. **Purge dead attribute names:** Standardize on `TPlayer` attribute names (`finishing`, `freeKicks`, `decisions`, `importantMatches`) across all architectural specifications and `src/types.ts`.
2. **Overhaul Match Engine Math:** Replace threshold 8.0 and unscaled sigmoid formulas with expected fractional chance generation (0.14 CP/min base) and dual-roll resolution (accuracy $\to$ conversion).
3. **Isolate Database Pipeline in a Web Worker:** Ensure `.dat` parsing and SQLite-WASM ingestion run off the main thread with progress streaming and batch transactions.
4. **Kill WebRTC Async Fantasy:** Update `multiplayer.md` to specify an asynchronous mailbox pattern over cheap serverless storage (Cloudflare Worker KV), abandoning WebRTC P2P.
5. **Support `.zip` Upload for Mobile:** Add client-side zip extraction via `fflate` so iOS users can import their data in a single tap.
6. **Clean Root Repo:** Delete residual Firebase config files, remove `@google/genai` and `firebase` from `package.json`, and unhook `App.tsx` from Firebase Auth.
