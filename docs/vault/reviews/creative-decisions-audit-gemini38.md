# Adversarial Creative-Decisions Audit — Championship Manager 01/02 Remake

**Auditor:** Gemini 3.8 Flash (High)  
**Date:** 2026-09-11  
**Target Docket:** `docs/vault/plan-v2.md`, `docs/vault/architecture/match-engine.md`, `docs/vault/architecture/multiplayer.md`, `docs/vault/reviews/counsel-review.md`, `scripts/`, `src/`  
**Execution Standard:** Zero praise. Every decision D1–D16 attacked against real code, verified binary layouts, and browser execution realities.

---

## 1. Decision Inventory & Verdicts (D1–D16)

| # | Decision | Stated Rationale / Scope | Verdict | Primary Fatal Flaw |
|---|----------|--------------------------|---------|---------------------|
| **D1** | TS DataView parser over Rust→WASM; claim "50MB parses in ms in browser" | `plan-v2 §Key Decisions` | **RISKY** | "Parses in ms" is a 100x fantasy. Synchronous parsing of 242k objects on main thread blocks the DOM for 3–10s and risks mobile browser crash. |
| **D2** | Maintain two parsers: TS runtime + Python offline converter (`scripts/dat_to_json.py`) | `plan-v2 table #1; repo` | **BROKEN** | Already desynced and fatal. `scripts/dat_to_json.py` parses obsolete 1996 CM2 structs (193-byte players) that emit garbage against real CM01/02 files. |
| **D3** | SQLite-WASM + OPFS persistence over IndexedDB | `plan-v2 #2, Key Decisions` | **RISKY** | Browser OPFS `SyncAccessHandle` cannot run on the UI main thread and requires Cross-Origin Isolation headers (COOP/COEP) absent from Vite and PWA config. |
| **D4** | BYOD: user supplies own .dat files; minimal sample dataset; "parser OK, distribution not" | `plan-v2 #4, Legal Model` | **RISKY** | Mobile Safari cannot ingest 8+ loose uncompressed `.dat` files via file picker; community update `.dat` packs break on hardcoded v1 struct strides. |
| **D5** | Multi-file .dat: index/club/nat_club/nation/staff + player_setup.cfg merge | `plan-v2 #8` | **RISKY** | Omitted `club_comp.dat` and `stadium.dat` (leaving divisions and stadiums as orphan integers); `plan-v2` still documents obsolete 1996 inline strings. |
| **D6** | Chance creation → conversion model; per-minute loop; CP thresholds; stamina decay | `architecture/match-engine.md` | **BROKEN** | Uncalibrated math creates ~14 CP/min against an 8.0 threshold, triggering 90 chances/match and 30–50 goals; home bonus contradicts (+10% vs +15%). |
| **D7** | CM01/02 original attribute names (Shooting, Dirtyness, BigOccasion) | `plan-v2 #7` | **BROKEN** | Binary struct does not store localized UI names; it stores internal SI engine names (`finishing`, `decisions`). No mapping layer exists, causing `undefined` lookups. |
| **D8** | Multiplayer architecture: WebRTC P2P vs async play-by-mail scheduling | `plan-v2 #5 vs multiplayer.md` | **BROKEN** | Docs fundamentally contradict: `multiplayer.md` requires real-time WebRTC DataChannels for $0 P2P, but claims it works offline async without a server relay. |
| **D9** | Text commentary (2D) match presentation | `plan-v2 §Key Decisions` | **RISKY** | Naming conflates text commentary with CM4/FM 2D graphic dots; zero match commentary text strings or interpolation templates exist in repo. |
| **D10** | PWA platform, no app store | `plan-v2 §Key Decisions` | **RISKY** | iOS Safari aggressively evicts OPFS storage on uninstalled/inactive PWAs, wiping multi-season saves; zero PWA manifest or service worker exists. |
| **D11** | 7–8 week MVP (Phase 0 + Phase 1) with card list CM-001..021 | `plan-v2 §Phase Breakdown` | **BROKEN** | Timeline fantasy. Assigns SQLite-WASM worker ETL, tactical engine calibration, commentary, UI, and save migration to a single part-time builder in 3–4 weeks. |
| **D12** | Deterministic seeds for match-engine unit tests | `plan-v2 #9, #12` | **RISKY** | Both `plan-v2.md` and `match-engine.md` draft functions call unseeded `Math.random()`, directly violating determinism; no PRNG or float rules specified. |
| **D13** | Versioned save schema + migration functions | `plan-v2 #10` | **RISKY** | Documents a JSON wrapper interface but completely ignores SQLite relational DDL migrations (`PRAGMA user_version`, `ALTER TABLE`) inside OPFS files. |
| **D14** | Firebase deferred post-v1 | `plan-v2; repo root` | **RISKY** | Conceptually sound, but Firebase is actively entangled in `App.tsx`, `package.json`, and `AuthProvider.tsx`; removing it breaks the current build. |
| **D15** | Phase 0 .dat format spike as 1-week gate before app work | `plan-v2 #11` | **RISKY** | Passed prematurely. 47 bytes in `TStaff` remain unmapped, `club_comp.dat` is missing, and secondary converter is broken, passing format debt into Phase 1. |
| **D16** | Save-size estimate 10–15MB (not 100MB) tied to SQLite-WASM/OPFS | `plan-v2 §action items #7` | **BROKEN** | Numerically wrong. Halved player population (assumed 50k vs verified 132k staff / 110k players). True SQLite DB with indexes and history is 45–70MB. |

---

## 2. Adversarial Attack per Decision

### D1: TypeScript DataView Parser ("50MB parses in ms in browser")
- **The Claim:** `plan-v2.md` claims: *"TypeScript (DataView) | 50MB binary parses in ms in browser. No WASM toolchain friction."*
- **The Reality:** This claim is off by two orders of magnitude and will cause browser thread lockup. As verified in `docs/vault/research/cm0102-format-notes.md`, `staff.dat` alone contains **132,722 staff records** and **109,940 player records**. In `src/lib/dat-parser/parser.ts`:
  - `parseStaffRecords` iterates 132,722 times, allocating 132,722 JS objects.
  - `parsePlayerRecords` iterates 109,940 times, allocating an object with 12 nested position fields and 41 attribute fields (55+ properties per object).
  - Instantiating ~242,000 heap objects via individual `DataView` getter calls (`getInt32`, `getInt8`, `getUint16`) on the JavaScript main UI thread takes **1.5 to 4.5 seconds on desktop V8** and **8 to 15 seconds on mobile WebKit/Gecko**, completely freezing the DOM and triggering the browser's "Page Unresponsive" watchdog.
- **Verdict:** **RISKY**. The choice of TypeScript over WASM is acceptable, but main-thread execution and the "ms" performance assumption are dead wrong.

### D2: Two Parsers Maintained (TS Runtime + Python Offline Converter)
- **The Claim:** `plan-v2.md` v1→v2 table #1 establishes two parsers: TypeScript for browser runtime and Python (`scripts/dat_to_json.py`) for offline conversion.
- **The Reality:** This has already suffered catastrophic drift and is actively producing corrupted data. On 2026-09-11, `cm0102-format-notes.md` proved that the original reference structs (`CM2Player` 193 bytes, `CM2Team` 361 bytes) were from *CM2 96/97*, not CM01/02. While `src/lib/dat-parser/parser.ts` was rewritten to support real CM01/02 records (`TStaff` 157 bytes, `TPlayer` 70 bytes, `TClub` 581 bytes), **`scripts/dat_to_json.py` was never updated**.
- `scripts/dat_to_json.py` still reads 193-byte `CM2Player` and 361-byte `CM2Team` structs, doesn't parse `index.dat`, doesn't understand segmented `staff.dat`, and expects inline strings instead of name table lookups. `scripts/test_dat_to_json.py` only passes because it fabricates fake 193-byte buffers. Running `dat_to_json.py` on real CM01/02 files produces garbage.
- **Verdict:** **BROKEN**. Dual maintenance has already failed in Phase 0.

### D3: SQLite-WASM + OPFS Persistence over IndexedDB
- **The Claim:** Use SQLite-WASM with Origin Private File System (OPFS) persistence as the primary client database for 50k+ players to avoid IndexedDB volatility and enable relational SQL queries.
- **The Reality:** The architectural specification ignores hard browser sandbox requirements:
  1. **Thread Restriction:** The SQLite-WASM OPFS VFS (`OpfsDb` / `opfs-sahpool`) uses synchronous file access handles (`FileSystemSyncAccessHandle`). Standard Web APIs restrict `createSyncAccessHandle` strictly to **Dedicated Web Workers**. Calling it on the main thread throws a fatal runtime exception. Yet `plan-v2.md` §Architecture shows `Game Core` and `SQLite WASM (OPFS)` directly interacting with UI state without a Web Worker RPC boundary.
  2. **Cross-Origin Isolation:** OPFS VFS requires SharedArrayBuffer and Cross-Origin Isolation headers:
     ```http
     Cross-Origin-Opener-Policy: same-origin
     Cross-Origin-Embedder-Policy: require-corp
     ```
     Without these headers, OPFS falls back to volatile memory or fails to initialize. Static hosting providers (GitHub Pages, simple S3/Netlify) do not inject these headers by default.
  3. **Missing Dependency:** `@sqlite.org/sqlite-wasm` is not even listed in `package.json`.
- **Verdict:** **RISKY**. Conceptually sound, but architecturally invalid without worker isolation and COOP/COEP infrastructure.

### D4: BYOD (Bring Your Own Data) & Minimal Sample Dataset
- **The Claim:** User supplies their own legal `.dat` files. Minimal sample dataset shipped for onboarding. Clean-room reverse-engineered parser avoids IP infringement.
- **The Reality:** 
  1. **Mobile UX Impossibility:** CM01/02 database is not a single file. It requires at least 8 distinct files: `index.dat`, `club.dat`, `staff.dat`, `nation.dat`, `first_names.dat`, `second_names.dat`, `common_names.dat`, and `player_setup.cfg`. On iOS Safari, a user cannot select multiple files across sandboxed folders into a web file picker. Without ZIP/ISO archive drag-and-drop unpacking, BYOD on mobile is unusable.
  2. **Community Data Incompatibility:** The plan boasts that "2024/2025 community updates work out of the box." But `cm0102-format-notes.md` line 298 explicitly admits that `parser.ts` **hardcodes the 157-byte v1 stride** of retail vanilla data. Patched community databases frequently use `TStaff` version 2 (110 bytes), which will cause `parser.ts` to misalign and fail immediately.
- **Verdict:** **RISKY**. Legal stance is sound; onboarding UX and compatibility promises are broken.

### D5: Multi-File .dat Ingestion and player_setup.cfg Merge
- **The Claim:** Ingest `index.dat`, `club.dat`, `nat_club.dat`, `nation.dat`, `staff.dat`, and merge `player_setup.cfg`.
- **The Reality:** 
  1. **Critical Missing Files:** `club.dat` records store `division` and `stadium` as 32-bit integer foreign keys. To display what league a club plays in or what stadium capacity it has, the parser **must** read `club_comp.dat` and `stadium.dat`. Neither file is included in `plan-v2.md` table #8 or Phase 0 scope.
  2. **Specification Contradiction:** `plan-v2.md` §Data Model (lines 81–227) still specifies `firstName: string (30-byte fixed field)` and `clubName: string (35-byte fixed field)`. In reality, strings are external foreign keys in name table files. The contract contradicts the implementation.
- **Verdict:** **RISKY**. Orphan integer foreign keys and missing core competition files leave the database incomplete.

### D6: Chance Creation → Conversion Match Model & Formulas
- **The Claim:** Two-phase match simulation: midfield/tactics accumulate chance points (CP) per minute; when CP crosses a threshold, conversion resolves against keeper and defense.
- **The Reality:** The mathematical formulas in both `plan-v2.md` and `match-engine.md` are completely broken:
  1. **Chance Creation Rate:** `calcChancePoints` in `plan-v2.md` lines 331–335 computes:
     $$\text{CP} = (\text{midfield} \times 0.6 + \text{support} \times 0.4) \times \text{modifiers}$$
     Attributes are 1–20. A standard team averages attributes around 13–15. Thus, $\text{CP} \approx 14.0$ every minute.
     `plan-v2.md` line 339 sets `CHANCE_THRESHOLD = 8.0`.
     Because $14.0 \ge 8.0$, **a chance is created EVERY SINGLE MINUTE**. Over 90 minutes, each team creates 90 chances (180 chances per match!).
  2. **Conversion Rate:** `resolveChance` in `plan-v2.md` lines 351–355 computes:
     $$\text{conversionRoll} \approx 0.50 \text{ to } 0.60$$
     $$\text{goalChance} = \text{conversionRoll} \times (0.8 + \text{random} \times 0.4)$$
     With `goalChance > 0.55` returning a goal, roughly 45–50% of chances convert into goals.
     Combined with the CP rate, **matches will finish 45–40 or 35–30**.
  3. **The Sigmoid Alternative in `match-engine.md`:** `match-engine.md` line 76 uses:
     $$\text{goalProb} = \text{sigmoid}(\text{attackQuality} - \text{defenseQuality} - \text{keeperQuality} \times 0.7)$$
     Evaluating with 1–20 ratings: $15 - 15 - (15 \times 0.7) = -10.5$.
     $\text{sigmoid}(-10.5) = \frac{1}{1 + e^{10.5}} \approx 0.000027$.
     Under this formula, a goal is virtually impossible, producing permanent 0–0 scorelines.
  4. **Home Advantage Contradiction:** `plan-v2.md` line 269 states `+10%`, while `match-engine.md` line 26 states `+15%`.
- **Verdict:** **BROKEN**. The formulas have never been simulated or unit tested; they fail elementary sanity checks by orders of magnitude.

### D7: CM01/02 Original Attribute Names
- **The Claim:** `plan-v2.md` mandates original CM01/02 names: `Shooting`, `Intelligence`, `Set Pieces`, `Dirtyness`, `BigOccasion`, explicitly rejecting FM names (`Finishing`, `Decisions`, `Free Kicks`).
- **The Reality:** 
  1. In `src/lib/dat-parser/parser.ts` (lines 350–392), attributes are parsed directly from the binary `TPlayer` struct using the fields reverse-engineered from SI's code: `finishing`, `decisions`, `freeKicks`, `dirtiness`, `importantMatches`.
  2. SI's internal engine always used `Finishing` and `Decisions`; the CM01/02 UK English localization string table merely displayed them as `Shooting` and `Intelligence` in the UI!
  3. `plan-v2.md` assumes these UI names are the underlying data properties. `parser.ts` has no `shooting` or `bigOccasion` properties. Calling `player.attributes.shooting` in the match engine returns `undefined`.
- **Verdict:** **BROKEN**. Lack of an explicit translation dictionary between binary struct names and UI labels breaks attribute access.

### D8: Multiplayer Architecture (WebRTC P2P vs Async Play-by-Mail)
- **The Claim:** `multiplayer.md` proposes host-authoritative P2P over WebRTC DataChannels with async play-by-mail turn scheduling. `plan-v2.md` summary row #5 drops WebRTC and lists only async play-by-mail.
- **The Reality:** The two documents represent fundamentally incompatible networking topologies:
  1. WebRTC DataChannel is a **live, direct peer-to-peer transport**. It requires both browser endpoints to be simultaneously connected to the network.
  2. If player B is on mobile and submits a "Continue" turn at 11 PM while host player A has their iPhone locked, WebRTC cannot connect. You cannot have "offline play-by-mail" over P2P without a persistent, stateful relay server.
  3. `multiplayer.md` claims "Total server cost: $0. No Firestore, no Cloud Functions." But `plan-v2.md` line 462 lists "Multiplayer (async play-by-mail with Firebase Cloud Functions)."
- **Verdict:** **BROKEN**. Complete architectural contradiction between docs. P2P WebRTC cannot execute offline asynchronous play-by-mail.

### D9: Text Commentary (2D) Match Presentation
- **The Claim:** Match presentation uses "Text commentary (2D)".
- **The Reality:** 
  1. **Historical/Technical Confusion:** CM01/02 had text commentary and pitch radar flashes. The "2D match engine" (top-down pitch with 2D circles moving in real time) was introduced in CM4 (2003) and FM 2005. Calling it "Text commentary (2D)" creates confusion over whether 2D physics simulation is in scope.
  2. **Missing Content Pipeline:** An authentic CM01/02 match requires hundreds of contextual text lines (shots hitting woodwork, referee warnings, crowd reactions). No commentary string tables or event mapping templates exist anywhere in the codebase.
- **Verdict:** **RISKY**. Semantic confusion and missing narrative asset pipeline.

### D10: PWA Platform, No App Store
- **The Claim:** Build as a progressive web app: no app store fees, cross-platform, offline-ready.
- **The Reality:** 
  1. **iOS Storage Eviction:** WebKit enforces aggressive storage quota policies on iOS. For non-standalone web apps, storage can be pruned after 7 days of inactivity. Even for standalone PWAs, device storage pressure triggers silent OPFS eviction. A user's multi-season career save can be purged without warning.
  2. **Repository Reality:** The repo currently has no `public/` directory, no `manifest.json`, no service worker, and no offline asset caching configured in Vite.
- **Verdict:** **RISKY**. Severe data-loss exposure on iOS devices; zero PWA infrastructure currently in place.

### D11: 7–8 Week MVP Timeline (Phase 0 + Phase 1) with CM-001..021
- **The Claim:** Deliver a playable MVP with loaded `.dat` files, database viewer, tactical match simulation, and save/load in 7–8 weeks.
- **The Reality:** Phase 1 alone (CM-010 to CM-021) assigns 12 heavy architectural cards to a single developer ("Hermes") across 3–4 weeks. This includes:
  - SQLite-WASM OPFS integration and schema architecture (CM-011)
  - Bulk ETL import pipeline for 242,000 entities into SQLite (CM-012)
  - Full chance creation/conversion tactical match engine with stamina decay (CM-014, CM-016)
  - Tactic builder and live commentary UI (CM-015, CM-018)
  - Versioned save migration system (CM-020)
  Phase 0 already suffered an emergency format rewrite and remains partially unmapped. Expecting one part-time engineer to complete Phase 1 in 4 weeks is timeline fantasy.
- **Verdict:** **BROKEN**. Chronic underestimation of systems engineering complexity.

### D12: Deterministic Seeds for Match-Engine Unit Tests
- **The Claim:** Seeded PRNG ensures deterministic simulation for testing and multiplayer synchronization.
- **The Reality:** 
  1. While the requirement is stated in `plan-v2.md` #9 and CM-019, the actual sample code provided in `plan-v2.md` line 353 explicitly executes:
     `const goalChance = conversionRoll * (0.8 + Math.random() * 0.4);`
  2. Similarly, `match-engine.md` line 79 executes:
     `const roll = Math.random();`
  3. `Math.random()` cannot be seeded in standard JavaScript. The specification documents provide implementation code that directly violates their own determinism mandate.
- **Verdict:** **RISKY**. Sound objective, but completely contradicted by the draft code; no specific PRNG (e.g. Mulberry32, PCG) or fixed-point integer rules are established.

### D13: Versioned Save Schema + Migration Functions
- **The Claim:** Versioned save schema (`SaveFile`) with migration functions ensures long-term save compatibility.
- **The Reality:** `plan-v2.md` lines 231–250 defines a TypeScript interface for a JSON document containing metadata and an opaque pointer to an SQLite OPFS blob. It provides zero architecture for how the *internal relational tables* inside the SQLite binary file undergo DDL schema evolution (`PRAGMA user_version`, `ALTER TABLE`, column migrations, index rebuilds). Migrating JSON metadata does nothing when the underlying SQL table structure changes.
- **Verdict:** **RISKY**. Superficial JSON-level design that ignores the actual relational database persistence layer.

### D14: Firebase Deferred Post-v1
- **The Claim:** Remove Firebase from the MVP stack; defer multiplayer sync to post-v1.
- **The Reality:** Firebase is still deeply embedded in the current repository:
  - `package.json` includes `firebase` (v12.13.0) and `@google/genai`.
  - `src/App.tsx` wraps the entire component tree in `<AuthProvider>` from `src/lib/AuthProvider.tsx`.
  - `src/lib/firebase.ts` initializes Firebase and Firestore.
  - `firebase-applet-config.json` and `firestore.rules` sit in the repo root.
  Removing Firebase in CM-010 without simultaneously scaffolding a replacement local state store will break the application build.
- **Verdict:** **RISKY**. Correct strategic decision, but currently represents active dead weight and build breakage risk.

### D15: Phase 0 .dat Format Spike as 1-Week Gate
- **The Claim:** 1-week spike (CM-001..CM-006) to prove binary format parsing before beginning app work.
- **The Reality:** The spike uncovered that the team had spent days using the wrong 1996 struct definitions, which saved the project from total disaster. However, the gate was declared "done" prematurely:
  - `TStaff` has an unmapped 47-byte region (offsets 58–144) containing contracts and wages.
  - `club_comp.dat` was never investigated or parsed.
  - `scripts/dat_to_json.py` was left abandoned in a broken 1996 state.
- **Verdict:** **RISKY**. The decision to have a spike was the best decision made, but the exit criteria were relaxed prematurely.

### D16: Save-Size Estimate 10–15MB Tied to SQLite-WASM/OPFS
- **The Claim:** Action item #7 asserts: *"Estimate save size correctly (10-15MB, not 100MB) | Done."*
- **The Reality:** The math behind this claim is demonstrably false:
  1. The estimate assumed ~50,000 players at ~100 bytes each = 5MB.
  2. In reality, `cm0102-format-notes.md` confirmed **132,722 staff records**, **109,940 player records**, and **10,580 club records**.
  3. Storing 110k players with 40+ integer columns, plus 132k staff and 10k clubs in SQLite requires table B-trees, page padding (4KB page size), and secondary indexes on `club_id`, `nation_id`, and `position`.
  4. Initial database size for raw records and indexes is **35–50MB**.
  5. As career mode progresses, accumulating `SeasonStat` records for 100k players across multiple seasons, plus competition fixture archives, will expand the SQLite file to **60–90MB**.
  6. Under SQLite WAL mode, write logs expand this further, directly threatening mobile browser storage quotas.
- **Verdict:** **BROKEN**. The numeric claim is wrong by a factor of 4x to 6x.

---

## 3. Contradictions Between Project Documents

### Contradiction 1: D6 Home Advantage Multiplier
- **`plan-v2.md` (line 269):** Specifies `+10% chance creation` (`Apply home advantage (+10% chance creation)`).
- **`architecture/match-engine.md` (lines 26 & 56):** Specifies `+15% CP` (`Home advantage (+15% CP, not +10% — home advantage in football is significant)` and `const homeBonus = team.isHome ? 1.15 : 1.0;`).
- **Resolution & Recommendation:** Real 2001/02 football historical home win rates sit at 46–48%, with away wins at 28–30% (a ~1.6x advantage). A 10% multiplier is insufficient in a compound creation-conversion engine. **Recommend editing `plan-v2.md` line 269 to +15%**, aligning with `match-engine.md`.

### Contradiction 2: D8 Multiplayer Architecture Topology
- **`architecture/multiplayer.md` (lines 11–37, 72):** Proposes a **Host-Authoritative WebRTC P2P** model with $0 server cost; explicitly states *"Firestore: not needed at all for P2P; Cloud Functions: not needed, host is authoritative"*.
- **`plan-v2.md` (lines 18, 58, 462):** Row #5 drops P2P WebRTC entirely in favor of *"Async play-by-mail"*, but line 462 specifies *"Multiplayer (async play-by-mail with Firebase Cloud Functions)"*.
- **Resolution & Recommendation:** You cannot run an offline asynchronous turn-based game over peer-to-peer WebRTC without a server. **Recommend editing `multiplayer.md` and `plan-v2.md`** to clearly split the modes: (a) Synchronous LAN/Desktop play uses WebRTC P2P; (b) Asynchronous mobile play-by-mail requires a lightweight persistent cloud datastore.

### Contradiction 3: Data Model Specifications (1996 Structs vs Verified 2001 Layout)
- **`plan-v2.md` (lines 81–185, 200–227):** Documents `interface Player` as having inline fixed strings (`firstName: string // 30-byte fixed field`, `clubName: string // 35-byte fixed field`), citing `matches actual CM2Player binary struct`.
- **`docs/vault/research/cm0102-format-notes.md` (lines 11–27) & `parser.ts`:** Explicitly warns that `CM2Player` is from *CM2 96/97* and produces garbage. Real CM01/02 files store names as foreign keys into separate name table files (`first_names.dat`, `second_names.dat`).
- **Resolution & Recommendation:** `plan-v2.md` was never updated after the CM-006 spike findings. **Recommend rewriting `plan-v2.md` §Data Model** to match `CM2Staff`, `CM2Player`, and `CM2Club` from `parser.ts`.

### Contradiction 4: Chance Accumulation Thresholds
- **`plan-v2.md` (line 339):** Sets `const CHANCE_THRESHOLD = 8.0;`.
- **`architecture/match-engine.md` (line 65):** Sets `const CHANCE_THRESHOLD = 20;`.
- **Resolution & Recommendation:** Both thresholds are broken against the ~14 CP/min generation formula, but they directly contradict each other. **Recommend establishing a normalized CP model** where average teams produce 0.133 CP/min and threshold is 1.0 (yielding ~12 chances per match).

### Contradiction 5: Chance Resolution Conversion Formulas
- **`plan-v2.md` (lines 351–355):** Uses a linear ratio: `conversionRoll = attack / (attack + def*0.4 + gk*0.6)`, scoring when `goalChance > 0.55` (yielding ~50% conversion).
- **`architecture/match-engine.md` (line 76):** Uses a logistic sigmoid: `sigmoid(attack - def - gk*0.7)`, which for 1–20 ratings produces negative exponents and $\approx 0.00003$ probability (yielding ~0% conversion).
- **Resolution & Recommendation:** Neither formula is functional. **Recommend replacing both** with an empirical tiered lookup or calibrated logistic curve: `P(goal) = 0.12 * (attack / (defense*0.5 + gk*0.5))`.

### Contradiction 6: Regens Roadmap Allocation
- **`plan-v2.md` Action Item #10 (line 578):** Allocates regens to **Phase 3** (`NICE | Add regens (newgen generation) | Phase 3 | Pending (CM-054)`).
- **`plan-v2.md` Phase 2 Scope (line 421):** Allocates regens to **Phase 2** (`CM-034 | Player development: aging, attribute progression, regen generation`).
- **Resolution & Recommendation:** If career mode runs multi-season simulations in Phase 2, regens are mandatory to prevent squad collapse. **Recommend moving regens definitively to Phase 2 (CM-034)** and marking Action Item #10 as Phase 2.

### Contradiction 7: Database Player Population Size
- **`plan-v2.md` Action Item #7 & `counsel-review.md`:** Assumes **50,000 players** for storage sizing and query architecture.
- **`cm0102-format-notes.md` (lines 77–80):** Confirms **132,722 staff records** and **109,940 player records** in the retail database.
- **Resolution & Recommendation:** The actual record count is 2.4x higher than planned. **Recommend updating all sizing, memory, and SQLite indexing models** to baseline on 133k staff and 110k players.

---

## 4. Ranked Vulnerability Register (P0 to P3)

### Priority P0: Project-Killing Flaws

#### P0-1: Broken Match Engine Math Generates Absurd Scorelines
- **What Breaks:** Teams generate ~14 CP per minute against an 8.0 threshold, triggering chance conversion every minute (90 chances/match per team). With conversion succeeding at ~50%, matches end with 30 to 50 goals per side. Conversely, using the `sigmoid` formula in `match-engine.md`, negative exponents yield near-zero probabilities, causing permanent 0–0 draws.
- **When It Breaks:** Phase 1 execution of CM-014 and CM-019 unit tests.
- **Concrete Fix:** 
  1. Calibrate CP: `chancePoints = (teamMidfieldRating / 15.0) * 0.133` per minute.
  2. Set `CHANCE_THRESHOLD = 1.0`. Average teams will reach the threshold ~12 times in 90 minutes.
  3. Calibrate Conversion: Target real football base conversion (~11% of chances become goals, ~35% on target). Attacker finishing vs goalkeeper reflexes must scale around a base goal probability of 0.12, modulated by tactical duty.

#### P0-2: SQLite-WASM OPFS Crashes on Main Thread & Lacks COOP/COEP Headers
- **What Breaks:** SQLite-WASM OPFS `SyncAccessHandle` throws a fatal `TypeError` when instantiated on the UI main thread. Furthermore, without `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` HTTP headers, browser OPFS access is blocked.
- **When It Breaks:** Immediate failure during CM-011 setup.
- **Concrete Fix:** 
  1. Build an explicit Web Worker (`src/worker/dbWorker.ts`) to host SQLite-WASM.
  2. Use `Comlink` or typed `postMessage` RPC for async query execution from the React UI.
  3. Inject COOP/COEP headers in `vite.config.ts` under `server.headers` and `preview.headers`.
  4. Add `coi-serviceworker` to `index.html` to enable cross-origin isolation on static PWA hosting.

#### P0-3: Obsolete 1996 Structs in Plan v2 Contract & Broken Python Converter
- **What Breaks:** `plan-v2.md` §Data Model still dictates 1996 `CM2Player` (193-byte) structs with inline strings. Builders implementing CM-011 and CM-012 will build SQL tables that cannot accept data from the actual 2001 binary format. Meanwhile, `scripts/dat_to_json.py` is actively generating corrupted data.
- **When It Breaks:** CM-011 (SQL Schema) and CM-012 (Data Import Pipeline).
- **Concrete Fix:** 
  1. Overwrite `plan-v2.md` §Data Model with the verified types from `src/lib/dat-parser/parser.ts`.
  2. Delete `scripts/dat_to_json.py` and `scripts/test_dat_to_json.py` from the repository to eliminate duplicate maintenance debt.

#### P0-4: Impossible P2P Offline Async Multiplayer Topology
- **What Breaks:** `multiplayer.md` assumes asynchronous play-by-mail can run over zero-cost WebRTC DataChannels between mobile PWAs. When a player backgrounds their phone or goes offline, WebRTC DataChannels drop, preventing other peers from submitting turns.
- **When It Breaks:** First attempted multiplayer playtest where players are not simultaneously active in open desktop browser tabs.
- **Concrete Fix:** Formally split the multiplayer specification: restrict WebRTC P2P to synchronous live desktop play; specify an external lightweight mailbox store (e.g. Firebase Firestore or a minimal Node relay) for asynchronous play-by-mail.

---

### Priority P1: Major Functional Failures

#### P1-1: Missing Name Mapping Layer (UI Names vs Binary Struct Names)
- **What Breaks:** `plan-v2.md` specifies UI attribute names (`Shooting`, `Intelligence`, `Set Pieces`), while `parser.ts` extracts SI binary names (`finishing`, `decisions`, `freeKicks`). Calling `player.attributes.shooting` returns `undefined`, causing NaN in engine math.
- **When It Breaks:** CM-014 and CM-016 match engine integration.
- **Concrete Fix:** Create `src/lib/attributeMap.ts` defining a typed mapping between storage keys (`finishing`) and display labels (`Shooting`).

#### P1-2: Mobile Ingestion Failure for Multi-File BYOD
- **What Breaks:** Users cannot select 8 separate `.dat` files into an iOS Safari file picker.
- **When It Breaks:** Mobile user onboarding in Phase 1 / Phase 4.
- **Concrete Fix:** Add `jszip` to `package.json`. Allow users to upload a single `.zip` or `.iso` archive containing the `Data/` folder, extracting all `.dat` files into memory inside the database Web Worker.

#### P1-3: Underestimated Database Size Exceeds iOS Safari Storage Quotas
- **What Breaks:** With 133k staff and 110k players, the SQLite database reaches 45–70MB. Safari on iOS subjects uninstalled web apps to strict storage quotas (~50–100MB) and silently wipes OPFS during low disk space cleanup.
- **When It Breaks:** Multi-season career saves or initial import on iOS devices.
- **Concrete Fix:** 
  1. Add an option during import to load only active leagues and high-reputation players into SQLite, keeping inactive staff in a compressed table.
  2. Provide an explicit "Export Save File" button that downloads the `.sqlite` database to local disk.

#### P1-4: Missing Competition and Stadium Definitions
- **What Breaks:** `club.dat` provides `division` and `stadium` as raw integer IDs. Without parsing `club_comp.dat` and `stadium.dat`, teams have no league names or stadium capacities.
- **When It Breaks:** CM-013 (Database Viewer) and CM-030 (League Tables).
- **Concrete Fix:** Add `club_comp.dat` and `stadium.dat` parsing functions to `src/lib/dat-parser/parser.ts`.

#### P1-5: Unmapped 47-Byte Region in v1 TStaff
- **What Breaks:** Retail v1 `staff.dat` offsets 58–144 are skipped, leaving player contracts, wages, and squad status missing.
- **When It Breaks:** CM-031 (Squad Management) and CM-032 (Transfer Market).
- **Concrete Fix:** Map offsets 58–144 by diffing against `CM0102Patcher` C# structures to extract wage, contract expiration, and squad status fields.

---

### Priority P2: Medium Risk & Operational Friction

#### P2-1: Synchronous Main-Thread Parsing Freezes UI
- **What Breaks:** Parsing 242k records on the main thread freezes the DOM for 3–10 seconds.
- **When It Breaks:** Initial `.dat` load in browser.
- **Concrete Fix:** Move `parseStaffDat` into the database Web Worker; parse and write directly into SQLite batch transactions (`INSERT INTO players ...`) without creating intermediate in-memory JS object maps.

#### P2-2: Active Dead Weight in Repository Root
- **What Breaks:** `package.json` contains unused `firebase` and `@google/genai` packages. `src/App.tsx` is wrapped in `AuthProvider.tsx`. Deleting Firebase in CM-010 will break the build.
- **When It Breaks:** Beginning of Phase 1 (CM-010).
- **Concrete Fix:** Create a dedicated cleanup PR to replace `AuthProvider` with a minimal local user store and remove Firebase dependencies from `package.json`.

#### P2-3: Save File Migration Strategy Omits Relational DDL
- **What Breaks:** Changes to SQLite table structures cannot be handled by JSON version increments.
- **When It Breaks:** First database schema change between game versions.
- **Concrete Fix:** Implement an SQLite schema migration runner in the Web Worker using `PRAGMA user_version` and incremental `.sql` migration files.

#### P2-4: Commentary Engine Lacks Variety and Asset Pipeline
- **What Breaks:** Match text commentary feels repetitive due to lack of authentic CM01/02 phrase templates.
- **When It Breaks:** CM-017 / CM-018 match view testing.
- **Concrete Fix:** Parse `events.cfg` or compile an authentic JSON commentary dictionary with token placeholders (`{player}`, `{club}`, `{minute}`).

---

### Priority P3: Minor Inconsistencies & Hygiene

#### P3-1: Naming Confusion: "Text Commentary (2D)"
- **What Breaks:** Misleads contributors into expecting a 2D pitch renderer.
- **When It Breaks:** UI implementation review.
- **Concrete Fix:** Rename to "Text Commentary with Pitch Radar".

#### P3-2: Missing public/manifest.json and Workbox Config
- **What Breaks:** PWA cannot be installed or run offline.
- **When It Breaks:** CM-060 PWA packaging.
- **Concrete Fix:** Create `public/manifest.json` and configure `vite-plugin-pwa`.

#### P3-3: Missing Vitest / Playwright Script Configurations
- **What Breaks:** Playwright is specified in the roadmap but not included in `package.json` devDependencies.
- **When It Breaks:** CM-064 testing card.
- **Concrete Fix:** Add `@playwright/test` to `devDependencies` and configure `playwright.config.ts`.

---

## 5. The 5 Assumptions Most Likely to Be Wrong

### Assumption 1: "A 50MB .dat binary parses in milliseconds in the browser using TypeScript DataView"
- **Why It's Likely Wrong:** Parsing 132,722 staff and 109,940 players instantiates >240,000 JavaScript objects with 40+ properties each. V8 heap allocations and DataView function call overhead on the main thread will take 3 to 10 seconds and risk crashing mobile WebKit tabs.
- **Falsification Test (Run This Week):**
  1. Write a standalone test script loading `staff.dat` using `parseStaffDat` from `src/lib/dat-parser/parser.ts`.
  2. Run it under Chrome DevTools with 4x CPU throttling (simulating a mobile device).
  3. Measure `performance.now()` duration and heap delta via `performance.memory`.
  4. *Falsification Condition:* If parse time exceeds 1,000ms or blocks the main thread, the assumption is falsified.

### Assumption 2: "SQLite-WASM + OPFS can be integrated directly as a local storage layer without dedicated Web Worker architecture and cross-origin isolation headers"
- **Why It's Likely Wrong:** Browser security specifications strictly restrict `FileSystemSyncAccessHandle` (used by SQLite OPFS VFS) to Dedicated Web Workers. Calling SQLite OPFS directly on the main thread throws `TypeError: createSyncAccessHandle is not a function`. Furthermore, OPFS requires COOP/COEP HTTP headers.
- **Falsification Test (Run This Week):**
  1. In `src/main.tsx`, attempt to import and initialize `@sqlite.org/sqlite-wasm` with an OPFS database on the main thread.
  2. Run `npm run dev` and open `http://localhost:3000`.
  3. *Falsification Condition:* If the browser console throws an OPFS initialization error or missing sync access handle exception, the assumption is falsified.

### Assumption 3: "A realistic career mode save game in SQLite-WASM will only take 10–15MB"
- **Why It's Likely Wrong:** `cm0102-format-notes.md` proved there are 132,722 staff, 109,940 players, and 10,580 clubs. Inserting 110k players with 40 attributes and B-tree indexes into SQLite produces a file of 45–70MB before accounting for match replays or multi-season career history.
- **Falsification Test (Run This Week):**
  1. Write a Node/Python script creating an SQLite database with tables for `players` (40 integer attributes), `clubs`, and `staff`.
  2. Insert 109,940 player rows, 132,722 staff rows, and 10,580 club rows. Create 3 basic indexes (`club_id`, `nation_id`, `position`).
  3. Execute `VACUUM;` and measure the final `.sqlite` file size on disk.
  4. *Falsification Condition:* If file size exceeds 20MB, the assumption is falsified.

### Assumption 4: "The published chance creation and conversion formulas produce ~12 chances and ~2.7 goals per match"
- **Why It's Likely Wrong:** With average squad attributes of 12–15, `calcChancePoints` yields ~14 CP/min. Against `CHANCE_THRESHOLD = 8.0`, a chance is triggered every single minute (90 chances per game). With `conversionRoll > 0.55` converting at ~50%, matches will produce 40+ goals per game.
- **Falsification Test (Run This Week):**
  1. Create a 30-line script implementing `calcChancePoints` and `resolveChance` verbatim from `plan-v2.md` lines 319–358.
  2. Simulate a 90-minute match between two teams with 14.0 average attributes.
  3. Run 100 iterations; record total chances created and goals scored.
  4. *Falsification Condition:* If average chances created per team exceed 20, or average goals per match exceed 5.0, the assumption is falsified.

### Assumption 5: "Community update .dat packs can be parsed out-of-the-box by the Phase 0 TypeScript parser"
- **Why It's Likely Wrong:** The Phase 0 parser (`parser.ts`) hardcodes the 157-byte v1 stride for `TStaff`. Community updates from champman0102.net often use database formats where `staff.dat` version is 2 (110 bytes per record), which will misalign every record in the file.
- **Falsification Test (Run This Week):**
  1. Obtain an `index.dat` and `staff.dat` from a recent community data update (e.g. 2024 or 2025 release).
  2. Run `parseIndexDat` and check the `version` field for `staff.dat`.
  3. Pass `staff.dat` buffer to `parseStaffDat`.
  4. *Falsification Condition:* If `version !== 1` or if extracted staff names fail to align with known roster players, the assumption is falsified.

---

## 6. Required Immediate Actions

1. **Scrub Obsolete Data Models:** Update `plan-v2.md` §Data Model to eliminate all references to 1996 `CM2Player`/`CM2Team` structs. Replace with the verified relational structures from `parser.ts`.
2. **Delete `scripts/dat_to_json.py`:** Remove the broken Python converter immediately to prevent developers from relying on corrupted 1996 data structures.
3. **Redesign Engine Math in Code:** Throw out the uncalibrated formulas in `plan-v2.md` and `match-engine.md`. Implement a normalized engine model where midfield ratings generate 0.133 CP/min against a 1.0 threshold, and conversion scales to an 11% base goal probability.
4. **Isolate SQLite-WASM in a Web Worker:** Update Card CM-011 to explicitly require a Dedicated Web Worker architecture with COOP/COEP headers before any database code is written.
5. **Add ZIP Ingestion for BYOD:** Update Card CM-003/CM-012 to ingest `.zip` or `.iso` archives using `jszip`, enabling one-click mobile dataset upload.