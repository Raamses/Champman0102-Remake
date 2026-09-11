# Creative Decisions Review — Hostile Engineer (Gemini 3.8 Flash High) — 2026-09-11

**Author:** Hostile Senior Staff Engineer  
**Target:** Plan v2, Match Engine Architecture, Storage/PWA Strategy, Legal Model, Phase Execution  
**Context:** Pre-implementation design audit. Zero tolerance for hand-waving, invented constants, or structural drift.

---

## Executive Summary

Plan v2 is an improvement over v1 in recognizing CM01/02's relational data format and discarding unviable P2P WebRTC syncing. However, it replaces v1's flaws with dangerous new illusions:
1. **The match engine math is fundamentally broken.** The formulas in Plan v2 make off-target shots mathematically impossible and produce ~45 goals per match (final scores like 23–22).
2. **The storage architecture ignores web platform realities.** SQLite-WASM with OPFS cannot run synchronously on the browser main thread. Claiming Zustand is a "thin layer over SQL" without a Web Worker bridge or an asynchronous caching architecture is invalid.
3. **Severe cognitive dissonance across existing artifacts.** The repository currently contains four diverging data models. The Python converter (`scripts/dat_to_json.py`) is actively parsing a 1996 format that fails on CM01/02 data, while Plan v2 documents obsolete structs already debunked in research notes.
4. **The BYOD onboarding model is an impassable wall on mobile.** Expecting iOS Safari users to extract and upload 7 loose `.dat` files kills the PWA vision.
5. **The 7–8 week MVP timeline is a fantasy.** Phase 0 alone slipped by nearly 100% just parsing five binary structs.

---

## What the Plan Gets Right (Keep-List)

- **Discarding WebRTC P2P for core gameplay:** Correct. Mobile OS app-suspension kills host-authoritative WebRTC instantly.
- **Dropping Rust→WASM for binary parsing:** Correct. Direct TypeScript `DataView`/`ArrayBuffer` parsing handles 50MB files in milliseconds without WASM toolchain overhead.
- **Relational entity model over flat JSON:** Correct. Mapping `TStaff`, `TPlayer`, `TClub`, and name tables faithfully reproduces the actual data structure.
- **Single-player career focus for v1:** Correct. Multiplayer before a proven single-player loop is suicide for a side project.

---

## Invented vs. Measured Numbers Audit

| Number in Plan | Location | Status | Reality / Problem |
|---|---|---|---|
| `CHANCE_THRESHOLD = 8.0` | `plan-v2.md:339` | **INVENTED** | Midfield attributes (scale 1–20) generate 12–15 points/min. Points exceed 8.0 *every single minute*, triggering 90 chances/team/match. |
| `CHANCE_THRESHOLD = 20` | `match-engine.md:65` | **INVENTED** | Disagrees with Plan v2 (8.0 vs 20). Neither is derived from match duration or attribute scaling. |
| `defense * 0.4 + keeper * 0.6` | `plan-v2.md:351` | **INVENTED** | Arbitrary convex combination. Scales to exactly 1.0 of average defense/keeper, neutralizing defensive depth. |
| Goal cutoffs: `> 0.55` goal, `> 0.35` saved | `plan-v2.md:355` | **INVENTED** | With `conversionRoll ~ 0.50`, minimum roll is `0.40`. Value is *never* `<= 0.35`. Misses are mathematically impossible (0%). |
| `fatigueMod = 1.0 - (minute/120)*0.15` | `plan-v2.md:329` | **INVENTED** | Linear arbitrary dampening completely disconnected from actual player stamina or workload. |
| `stamina < 50% = -20% all attrs` | `plan-v2.md:296` | **INVENTED** | Discontinuous step-function cliff. Causes sudden mid-match team collapse instead of realistic physical degradation. |
| Mentality modifiers (`0.7, 1.0, 1.3, 1.5`) | `plan-v2.md:324` | **INVENTED** | Round numbers with zero sensitivity analysis or tactical balance testing. |
| Save file size `10-15MB` | `plan-v2.md:575` | **INVENTED** | Ignores SQLite B-tree page overhead, table indices, search indices, and competition history tables. Real size: 30–50MB uncompressed. |
| `7-8 week MVP` | `plan-v2.md:16` | **INVENTED** | Contradicted by Phase 0 actual velocity (~2 weeks for file inspection and doc notes alone). |

---

## Adversarial Findings (F1 .. F13)

### F1: [CRITICAL] Match Engine Conversion Formula Produces 0% Misses and ~45 Goals Per Match
- **Plan Reference:** `docs/vault/plan-v2.md` lines 318–359
- **Failure Scenario:**
  1. **Chance Creation Rate:** CM01/02 attributes are on a 1–20 scale. An average midfield generates `(13 * 0.6 + 13 * 0.4) * 1.0 * 1.0 * 1.0 * 0.94 = ~12.2` chance points per minute. `CHANCE_THRESHOLD` is set to `8.0`. Because accumulated points exceed 8.0 in *every single minute*, an event is generated every minute. That is **90 chances per team, 180 chances per match** (real football: 10–14 shots per team).
  2. **The Impossible Miss:** `conversionRoll = attackStrength / (attackStrength + defenseStrength * 0.4 + keeperStrength * 0.6)`. When opposing units have comparable skill (e.g. 14), `conversionRoll = 14 / (14 + 14*0.4 + 14*0.6) = 14 / 28 = 0.50`.
  3. Next: `goalChance = conversionRoll * (0.8 + Math.random() * 0.4)`. With `conversionRoll = 0.50`, `goalChance` is strictly bounded within `[0.40, 0.60)`.
  4. The cutoffs:
     ```typescript
     if (goalChance > 0.55) return 'goal';   // 25% probability
     if (goalChance > 0.35) return 'saved';  // 75% probability
     return 'missed';                        // 0% probability
     ```
     Because the minimum value is `0.40`, `goalChance <= 0.35` NEVER occurs. **Off-target misses cannot occur.** 100% of shots are on target.
  5. Combining 90 chances per team with a 25% goal probability yields **22.5 goals per team per match**. Final scorelines will be 23–21 or 24–22. The engine simulates water polo, not association football.
- **Concrete Alternative:**
  - Adopt a Poisson arrival process for chance creation calibrated to match time, e.g. `chanceProbabilityPerMinute = baseRate * (teamMidfield / oppMidfield)`. Set `baseRate = 0.12` to target ~11 total chances per team over 90 minutes.
  - Implement a 3-tier outcome resolution calibrated to real-world xG distributions:
    - Miss (off target / blocked): 50–60% base
    - Saved (keeper duel): 25–35% base
    - Goal: 10–15% base
  - Calculate `conversionRoll` using logistic or difference scaling rather than a normalized fraction: `logit(P_goal) = alpha + beta1*(shooting - keeperReflexes) + beta2*(technique - defenderTackling)`.

---

### F2: [CRITICAL] `Math.random()` in Engine Violates Determinism and Breaks Multiplayer / Testing
- **Plan Reference:** `docs/vault/plan-v2.md` line 353 vs line 270 vs line 512 (`rng.ts`)
- **Failure Scenario:** Line 353 explicitly executes `Math.random()` inside `resolveChance()`. Yet line 270 promises: *"Generate match seed (deterministic for multiplayer)"*, and line 75 promises deterministic Vitest unit tests. Calling the global unseeded `Math.random()` destroys determinism. Unit tests cannot replay specific matches, and any future multiplayer synchronization or bug reproduction from user save states becomes impossible.
- **Concrete Alternative:**
  - Enforce a strict rule: the match engine core must be a pure function `simulateMatch(home, away, tactics, seed: number)`.
  - Pass a deterministic PRNG instance (e.g. `splitmix32`, `mulberry32`, or `pcg32`) into every phase of the simulation loop.
  - Add an ESLint rule banning `Math.random()` across `src/engine/`.

---

### F3: [MAJOR] Defender Array Averaging Incentivizes Red Cards ("The Phantom Defender Bug")
- **Plan Reference:** `docs/vault/plan-v2.md` line 346:
  ```typescript
  const defenseStrength = avgAttribute(defenders, ['tackling', 'positioning', 'heading']);
  ```
- **Failure Scenario:** Defense strength is computed as a flat average across all defenders on the pitch. If a team plays with 4 defenders (ratings: 18, 10, 10, 10), their `defenseStrength` is `48 / 4 = 12.0`. If two inferior defenders get red-carded or injured, leaving only the 18-rated star and one 10-rated defender, their `defenseStrength` jumps to `28 / 2 = 14.0`. If the 10-rated defender is sent off too, the single remaining star gives the team a `defenseStrength` of `18.0`. **Getting defenders sent off makes the team mathematically harder to score against.**
- **Concrete Alternative:**
  - Resolve chances through explicit spatial duels rather than squad-wide averages.
  - Determine chance zone (Left, Center, Right, Air, Counter). Pick the primary contesting defender in that zone. If a zone is vacated due to a red card or aggressive wingback overlap, apply a severe numerical penalty (e.g. undefended shot multiplier).
  - Defense strength must factor in defensive density (number of active defenders in the box), not just attribute means.

---

### F4: [MAJOR] Attribute Name Schizophrenia and Ghost Properties (`composure` vs `bigOccasion`)
- **Plan Reference:** `docs/vault/plan-v2.md` lines 114–118 vs line 343–344
- **Failure Scenario:**
  1. In Section 0, Table item 7, and the Player interface definition, the plan aggressively lectures:
     - `bigOccasion: number; // NOT "composure"`
     - `intelligence: number; // NOT "decisions"`
     - `shooting: number; // NOT "finishing"`
  2. In line 343 of the exact same document, `resolveChance()` defines:
     ```typescript
     const attackStrength = weightedAvg(attacker, {
       shooting: 0.35, technique: 0.20, bigOccasion: 0.20, offTheBall: 0.15, composure: 0.10
     });
     ```
     It requires **BOTH** `bigOccasion` and `composure`. Because `composure` was explicitly omitted from `Player.attributes`, `attacker.attributes.composure` evaluates to `undefined`. `weightedAvg()` performs arithmetic on `undefined`, producing `NaN`. Every calculation downstream degrades into `NaN`, breaking the simulation.
  3. In `src/lib/dat-parser/parser.ts` (lines 350–392), the parser actually extracts `finishing`, `decisions`, and `freeKicks` directly from `TPlayer` in `Structures.cs`! The plan's claim that CM01/02 binaries use `shooting` instead of `finishing` was based on the obsolete CM2 96/97 structs (`CM2Player`), not the real 2001 `TPlayer` struct.
- **Concrete Alternative:**
  - Make `src/lib/dat-parser/parser.ts` the single source of truth for attribute names. `TPlayer` in `Structures.cs` defines: `finishing`, `decisions`, `freeKicks`, `handling`, `reflexes`, `positioning`, `tackling`, `workRate`, etc.
  - Purge the obsolete `CM2Player` attribute naming mythology from `plan-v2.md` and harmonize all engine code with the verified `TPlayer` interface.

---

### F5: [MAJOR] Dual-Parser Drift and Obsolete Python Script
- **Plan Reference:** `scripts/dat_to_json.py` vs `src/lib/dat-parser/parser.ts` vs `src/types.ts`
- **Failure Scenario:**
  - `scripts/dat_to_json.py` (lines 38–145) hardcodes `CM2Player` (193 bytes), `CM2Team` (361 bytes), and `CM2Manager` (241 bytes). As documented in `cm0102-format-notes.md`, these are legacy CM2 96/97 structs from `PLDATA1.DB1`. If this script is run against actual CM01/02 retail files (`club.dat` or `staff.dat`), it parses misaligned garbage.
  - Meanwhile, `src/lib/dat-parser/parser.ts` was rewritten to parse the verified CM01/02 structs (`TClub` 581 bytes, `TStaff` 157 bytes, `TPlayer` 70 bytes, `TNames` 60 bytes).
  - Meanwhile, `src/types.ts` still contains modern FM attributes and Firebase auth profiles from the old prototype.
  - Maintaining two divergent parsers across TypeScript and Python guarantees that offline data conversions and runtime browser parsing will produce mismatched schemas, breaking imports.
- **Concrete Alternative:**
  - Delete `scripts/dat_to_json.py` and `scripts/test_dat_to_json.py` immediately.
  - Build a single CLI tool in TypeScript (e.g. `scripts/convert-dat.ts` executed via `tsx` or `bun`) that imports the exact same parser modules from `src/lib/dat-parser/`.
  - Update `src/types.ts` to export the canonical types used by `parser.ts`.

---

### F6: [CRITICAL] SQLite-WASM + OPFS Cannot Run Synchronously on the Main Thread and Invalidates the "Zustand Thin Layer"
- **Plan Reference:** `docs/vault/plan-v2.md` lines 42–46, 71–72, and Architecture diagram
- **Failure Scenario:**
  1. **Worker-Only Restriction:** The official `@sqlite.org/sqlite-wasm` implementation with OPFS persistence (`opfs` VFS) utilizes `FileSystemFileHandle.createSyncAccessHandle()`. Web standards strictly forbid `createSyncAccessHandle` on the main window thread; it **ONLY exists inside Web Workers**.
  2. **Asynchronous Reality vs Zustand Sync Model:** The plan illustrates: `UI Layer (React) -> State (Zustand thin) -> Match Engine (TS) -> SQLite WASM (OPFS)`. If SQLite is in a Worker, every single query requires an asynchronous `postMessage` RPC bridge. Zustand stores are synchronous. You cannot have a "thin Zustand layer over SQL" where components or the match engine read attributes synchronously from SQLite.
  3. Either the entire active squad/competition dataset is loaded into JS heap memory (rendering SQLite redundant during gameplay), or every UI component must handle async loading states, query suspense, and cache invalidation.
  4. **COOP/COEP Headers:** Running SQLite-WASM with high-performance OPFS requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. When deployed as a static client-side PWA, setting these headers requires service-worker proxy hacks (e.g. `coi-serviceworker`) which break external asset loading and WebRTC signaling.
  5. **Safari OPFS Bugs:** Safari iOS has notorious bugs with OPFS sync handles failing to release locks if a PWA is backgrounded or crashes, rendering the database inaccessible upon reload until the user clears site data.
- **Concrete Alternative:**
  - Explicitly architect the data pipeline:
    - **Option A (Relational in Memory, IndexedDB Cold Storage):** Parse `.dat` files into an in-memory relational structure (or an in-memory SQLite database via plain WASM without OPFS), and persist game saves as compressed binary dumps into standard `IndexedDB` via `idb-keyval`. 50,000 players in typed binary arrays occupy < 15MB of RAM—trivial for modern mobile devices.
    - **Option B (Worker-Based SQLite Architecture):** If SQLite-WASM is mandatory, design an explicit `DbWorker` interface with `Comlink`, treat SQLite as an asynchronous backend service, and replace Zustand with TanStack Query (React Query) for UI state caching.

---

### F7: [CRITICAL] BYOD Mobile User Experience is an Impassable Onboarding Cliff
- **Plan Reference:** `docs/vault/plan-v2.md` lines 69, 470–476
- **Failure Scenario:**
  - The plan dictates: *"BYOD: user supplies own .dat file. Ship with minimal sample dataset. No bundled rosters."*
  - A real CM01/02 database is not a single file. It consists of at least 7 separate files: `index.dat`, `club.dat`, `staff.dat`, `nation.dat`, `first_names.dat`, `second_names.dat`, and `common_names.dat`.
  - A user installing the PWA on an iPhone or Android phone is prompted to upload their `.dat` files. Standard mobile users cannot extract a 600MB PC ISO or unpack a `.rar` archive on iOS to supply seven raw `.dat` files through a mobile Safari file picker. 99% of prospective players will abandon the app on the splash screen.
  - Furthermore, the promised "minimal sample dataset (fictional players/clubs)" has no specification, no creation card, and no allocated time in any phase.
- **Concrete Alternative:**
  - Provide an in-browser archive extractor (using `fflate` for `.zip` or a pure JS ISO reader). The user uploads a single `.zip` or `.iso` file, and the app unpacks the requisite `.dat` files in memory.
  - Add an explicit ticket in Phase 1 for a procedural "Sample Universe Generator" that creates a fictional 16-team league in valid binary `.dat` format packaged into `public/sample.iso` for instant zero-friction onboarding.

---

### F8: [MAJOR] Trademark Infringement in Project Identity
- **Plan Reference:** `docs/vault/plan-v2.md` lines 1, 6, 470–476
- **Failure Scenario:** Counsel addressed copyright in database compilation and reverse engineering exemptions. However, counsel and the authors completely ignored **Trademark Law**. "Championship Manager" and "ChampMan" are active registered trademarks owned by Square Enix / Eidos. Marketing the web app as "Championship Manager 01/02 Remake" or hosting it under a domain containing "champman" invites an immediate Lanham Act / UK Trade Marks Act cease-and-desist letter or domain seizure, regardless of whether data files are BYOD.
- **Concrete Alternative:**
  - Rebrand the project immediately to an independent trademark (e.g. *OpenManager 01/02*, *RetroPitch 01/02*, or *ProManager Classic*).
  - Use trademark-compliant nominative fair use phrasing: *"An open-source, modernized match engine compatible with CM 01/02 data formats."*

---

### F9: [MAJOR] Phase Ordering Flaw: Fast Background Match Simulation Buried in Phase 4 Instead of Phase 1
- **Plan Reference:** `docs/vault/plan-v2.md` Phase Breakdown (§Phase 1 vs §Phase 2 vs §Phase 4)
- **Failure Scenario:**
  - Phase 1 builds a minute-by-minute text commentary match engine (CM-014, CM-017).
  - Phase 2 introduces the full league schedule (CM-030). A single season in one 20-team league contains 380 matches. If lower divisions or cups are simulated, that number exceeds 2,000 matches per season.
  - Simulating 2,000 matches through a minute-by-minute 90-tick loop that calculates player-level chance points and duels will take 3–5 minutes of frozen CPU time per season advance.
  - The plan categorizes "Quick sim mode" (CM-062) under **Phase 4: Polish**.
  - Attempting to build and test Career Mode in Phase 2 without a vectorized, microsecond-speed background match simulator will make testing season progression unplayable and force a complete rewrite of the match engine in Phase 2.
- **Concrete Alternative:**
  - Architect the match engine with dual execution modes in Phase 1 (CM-014):
    1. *Full Event Simulation:* Minute-by-minute with commentary events (for the player's active match).
    2. *Fast Headless Simulation:* Matrix-based attribute comparison calculating scoreline, cards, and key stats in < 1 millisecond (for AI vs AI matches).
  - Move CM-062 from Phase 4 to Phase 1.

---

### F10: [MAJOR] Unmapped 47-Byte Region in `TStaff` Blocks Career Contracts, Wages, and Job Roles
- **Plan Reference:** `docs/vault/research/cm0102-format-notes.md` lines 190–226
- **Failure Scenario:**
  - `cm0102-format-notes.md` reveals that retail 2001 `staff.dat` uses `TStaff` Version 1 (157 bytes per record), whereas modern tools use Version 2 (110 bytes).
  - Byte offsets 58–144 (87 bytes in v1, containing ~47 unmapped bytes) are marked as **UNVERIFIED**.
  - These unmapped bytes house critical career mode properties: player wages, contract start/end dates, release clauses, transfer status, and squad status.
  - Phase 2 features (CM-032 Transfer Market, CM-031 Squad Management) depend directly on contracts and wages. If these offsets are not reversed, the game cannot import existing contracts from retail data.
- **Concrete Alternative:**
  - Prioritize reverse-engineering `TStaff` offsets 58–144 before exiting Phase 1.
  - In `src/lib/dat-parser/parser.ts`, implement an explicit heuristic contract generator as a fallback for any unmapped contract fields: infer wage and squad status from `CurrentAbility` and `Reputation`.

---

### F11: [CRITICAL] 7–8 Week MVP Timeline is Unrealistic Given Phase 0 Velocity
- **Plan Reference:** `docs/vault/plan-v2.md` Section "Phase Breakdown", lines 376–460
- **Failure Scenario:**
  - Plan v2 budgeted Phase 0 (.dat format spike) as **1 week**.
  - In reality, work began around August 30 and the latest commits (CM-002 notes, CM-006 retail validation) landed on September 11. That is **13 calendar days** (~2 full weeks) solely for format verification—and the parser still has unmapped staff bytes and divergent Python scripts.
  - Phase 1 (12 tickets) and Phase 2 (11 tickets) tackle massive problem domains: SQLite storage engine, tactics engine, text commentary generator, AI transfer bidding, contract negotiation, player development, and competition tables.
  - Claiming that Phase 1 (which took 2 weeks just to inspect data) and Phase 2 will be completed in 5–6 weeks total is pure scheduling fantasy. Delivering an MVP with single-player career mode will realistically require **14–18 weeks**.
- **Concrete Alternative:**
  - Acknowledge a realistic 14–16 week timeline for the full Phase 1–3 scope.
  - If a true 7–8 week deadline is non-negotiable, cut scope ruthlessly:
    - Lock Phase 1 to a single hardcoded league (English Premier League only, 20 clubs).
    - Disable transfer market bidding and player aging in MVP; implement match simulation and league fixture progression only.

---

### F12: [MINOR] CM-002 Scraping Wasted Effort on Executable Patches Instead of Data Formats
- **Plan Reference:** `docs/vault/research/offsets-thread-notes.md` lines 1–8455
- **Failure Scenario:** CM-002 was chartered to *"Scrape offsets thread from champman0102.net, compile into parser spec"*. The scraped thread (`viewtopic.php?t=1540`) is a 31-page discussion of OllyDbg assembly patches for `cm0102.exe` (patching inflation, 3-point rules, league standard caps). It has zero relevance to database binary file structures. Time was wasted compiling disassembly memory offsets under the assumption that they were file offsets.
- **Concrete Alternative:** Deprecate `offsets-thread-notes.md`. Base all future parser work strictly on `CM0102Patcher/SaveChanger/Structures.cs` and empirical binary validation.

---

### F13: [MINOR] Commentary Engine Missing Content Authoring Pipeline
- **Plan Reference:** `docs/vault/plan-v2.md` line 404 (CM-017)
- **Failure Scenario:** CM-017 scopes a *"Text commentary renderer: events -> readable text with minute markers"*. A match engine produces abstract event tokens (`SHOT`, `CROSS`, `SAVE`, `GOAL`). Turning these into immersive, varied commentary requires hundreds of parameterized text templates. Without an authoring pipeline or an extracted template bank, commentary will become intensely repetitive within 2 matches.
- **Concrete Alternative:** Define a JSON-based commentary dictionary with token replacement (`{ATTACKER}`, `{KEEPER}`, `{DISTANCE}`) and multiple variance levels (e.g. 5+ distinct variations per event type).

---

## Blocking Changes (Mandatory Before Phase 1 Code)

1. **Fix Match Engine Mathematical Formulas:**
   - Recalibrate `calcChancePoints` to produce 10–14 total chances per team per 90 minutes.
   - Replace the flawed `conversionRoll` and cutoffs with a continuous logistic model guaranteeing realistic off-target misses (~50%), saves (~35%), and goals (~15%).
2. **Purge Non-Deterministic RNG:**
   - Ban `Math.random()`. Inject a seeded PRNG (`splitmix32` / `pcg32`) into all match simulation methods.
3. **Decide Storage Architecture Realities:**
   - If using SQLite-WASM, specify the Web Worker RPC architecture and acknowledge async queries.
   - If building a synchronous UI with Zustand, use an in-memory database with IndexedDB dump persistence.
4. **Kill the Dual-Parser Drift:**
   - Delete `scripts/dat_to_json.py`. Reconcile `src/types.ts` with `src/lib/dat-parser/parser.ts`.
5. **Rebrand to Neutral Trademark:**
   - Remove "Championship Manager" / "ChampMan" from the app name and repo branding.
6. **Integrate Background Batch Sim into Phase 1:**
   - Do not defer fast headless simulation to Phase 4 Polish. Build it alongside the match engine.

---

## Verdict

### **FIX FIRST**

The project has made strong progress in understanding the 2001 binary file layouts (`TStaff`/`TPlayer`/`TClub`). However, the match engine formulas in Plan v2 are completely broken, the storage/Zustand architecture ignores web worker constraints, and the code repository is drifting into multiple inconsistent data models. **Do not write Phase 1 feature code until the blocking changes above are formalized in Plan v3.**
