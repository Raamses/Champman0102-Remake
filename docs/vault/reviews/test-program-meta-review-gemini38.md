# Adversarial Meta-Review: ChampMan Test Program (Special Forces Manual)

**Document Reviewed:** [`docs/vault/testing/test-strategy.md`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-strategy.md) & [`docs/vault/testing/test-cards.md`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md)  
**Reviewer:** Special Forces Adversarial Meta-Reviewer (Gemini 3.8 Flash)  
**Status:** **REVISE TEST PROGRAM BEFORE MERGE**

---

### Executive Assessment

The test program provides a solid high-level framework, but under combat conditions it possesses **fatal structural holes**. It suffers from an unexecutable L2 layer that attempts to test browser-only OPFS/SQLite-WASM in headless Node.js, an illegal CI fixture assumption that guarantees instant GitHub Actions failure, dangerous IEEE 754 determinism blind spots across hardware architectures, fantasy performance budgets that will cause CI flakiness, and severe doctrine violations where Hermes tests his own features.

Below is the numbered findings report ordered by severity, with concrete remediation for each item.

---

## Findings Report (Ordered by Severity)

---

### 1. [CRITICAL] CI Fixture Legal & Deployment Wall (L2 / PR Gate Collapse)
* **Risk Surface:** CI Gaps / Missing Fixture Pipeline
* **The Hole:** Doctrine Rule 3 proclaims: *"The vanilla 2001 set (`~/cm0102-game-data/`) is canonical; synthetic fixtures only for edge cases."* L2 integration tests and [`CM-T07`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) mandate running real `.dat` fixtures against the parser and schema on every PR touching the pipeline.  
  However, `~/cm0102-game-data/` is a local directory on a single Raspberry Pi. The vanilla 2001 game files are commercial copyrighted assets that **cannot be committed to the public GitHub repository** under the project’s BYOD legal doctrine ([`plan-v2.md`](file:///home/ramamos/cm-review-wt/docs/vault/plan-v2.md#L450)). When GitHub Actions ([`CM-T12`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md)) spins up a clean Ubuntu runner, `~/cm0102-game-data/` will not exist. Every PR touching the pipeline will instantly crash with `ENOENT`.
* **Adversarial Blast Radius:** The entire L2 PR gate fails immediately upon CI activation, or developers will be forced to bypass the merge gate.
* **Concrete Fix:**
  * **Scope Change to [`CM-T07`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) & [`CM-T12`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):** PR runs must use an anonymized, structurally valid synthetic binary corpus.
  * **New Card `CM-T14: Canonical Synthetic Fixture Generator & CI Secret Vault` (Assignee: Pi | Deps: None):**
    * Author a deterministic generator producing a minimal legal binary fixture pack (valid headers, 10 clubs, 200 players, index offsets) committed to git for standard L2 PR gates.
    * For Nightly / L4 runs on GitHub Actions, configure an encrypted repository secret / artifact download step to pull the canonical 2001 fixture into `/tmp/cm0102-game-data/`.

---

### 2. [CRITICAL] Node/Vitest Tooling Fantasy for OPFS & SQLite-WASM
* **Risk Surface:** Missing Test Layers / Impossible Tooling
* **The Hole:** [`test-strategy.md`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-strategy.md) assigns L2 to `vitest + real fixtures`, covering:  
  `staged vanilla .dat → parser → SQLite-WASM import; OPFS save/load round-trip; worker protocol`.  
  Vitest runs in **Node.js** (or JSDOM / Happy-DOM). **`navigator.storage.getDirectory()` (OPFS) and `FileSystemSyncAccessHandle` do not exist in Node.js or JSDOM.** Furthermore, official `@sqlite.org/sqlite-wasm` OPFS VFS requires Web Workers and `createSyncAccessHandle()`. You cannot execute real OPFS round-trips or SQLite-WASM OPFS VFS in standard Node-based Vitest without either:
  1. Relying on an in-memory mock that fails to test actual filesystem locking, disk flushes, and OPFS errors; or
  2. Crashing with `ReferenceError: navigator is not defined`.
* **Adversarial Blast Radius:** Either [`CM-T08`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) will be authored against a fake mock (delivering zero real confidence in OPFS durability), or the test will fail to run in CI.
* **Concrete Fix:**
  * **Split [`CM-T08`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) into two discrete cards:**
    * **`CM-T08A: Save Schema & Migration Engine (Vitest L1/L2)` (Assignee: Pi):** Pure data transformations, version upgrades ($v1 \to v2 \to vN$), and corrupt payload validation in Node.
    * **`CM-T08B: OPFS Storage Engine & Driver Contract (Browser Runner L2/L3)` (Assignee: Pi):** Runs under Playwright or Vitest Browser Mode (`@vitest/browser` with Playwright provider) targeting real Chromium, Firefox, and WebKit instances to exercise true `FileSystemSyncAccessHandle` I/O.

---

### 3. [CRITICAL] Unrealistic Wall-Clock Budgets & Missing Memory Ceiling
* **Risk Surface:** Unrealistic Budgets / CI Flakiness
* **The Hole:** [`CM-T11`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) mandates:  
  *30MB staff.dat parse < 5s, full import < 30s, 10k seeded matches < 60s as failing tests.*  
  1. **10,000 matches in 60s = 6ms per match (166 matches/sec):** In Phase 1, the match engine simulates 90 distinct minute ticks, each evaluating midfield strength, chance creation, conversion duels, stamina decay across 22 players, and AI substitution logic. On a throttled 2-vCPU GitHub Actions runner or a Raspberry Pi 5 (`raamsesrpi5`), 10,000 full-resolution matches will take 3–5 minutes. This test will constantly flake and fail CI.
  2. **Full import < 30s:** Parsing 6 binary files (~40MB) and inserting 55,000+ relational rows into SQLite-WASM OPFS in a virtualized container with unbuffered I/O will frequently breach 30 seconds.
  3. **Zero Memory Budget:** Transforming 55,000 binary records into raw JavaScript heap objects easily causes a 250MB–400MB memory spike. iOS Safari enforces a strict ~300MB tab memory limit before silently killing the web process. The test program enforces zero RSS/heap limits.
* **Adversarial Blast Radius:** Flaky CI builds will cause developers to `@skip` the tests, while mobile devices will crash with silent browser OOM terminations during import.
* **Concrete Fix:**
  * **Scope Change to [`CM-T11`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):**
    * Split engine benchmark: PR gate runs **500 headless matches < 3s**; 10,000 matches moved to Nightly stress gate and benchmarked relative to a calibrated CPU baseline loop (ops/sec normalization), not raw wall-clock time.
    * Add **Memory Heap Ceilings**: Full import memory ceiling $\le 120\text{MB}$ peak heap usage (monitored via `performance.memory` or Node `process.memoryUsage()`).
    * Mandate SQLite batching benchmark: verify `BEGIN TRANSACTION` / `COMMIT` grouping passes 55,000 inserts in $< 15\text{s}$ on standard reference hardware.

---

### 4. [HIGH] IEEE 754 Cross-Platform & Engine Determinism Blind Spot
* **Risk Surface:** Determinism Blind Spots
* **The Hole:** Doctrine Rule 2 states: *"Determinism is a feature. Same seed + same tactics → identical match report. Any diff = bug."*  
  However, match calculations in [`plan-v2.md`](file:///home/ramamos/cm-review-wt/docs/vault/plan-v2.md#L300) rely on standard JavaScript 64-bit floating-point math (`calcChancePoints`, stamina decay factors, conversion rolls).  
  Different JavaScript engines (V8 in Chrome, JavaScriptCore in Safari, SpiderMonkey in Firefox) and CPU architectures (x86_64 in CI vs ARM64 on Apple Silicon and Raspberry Pi) handle intermediate floating-point rounding, transcendental functions, and FMA (Fused Multiply-Add) optimizations with subtle low-order bit variances. If a conversion roll yields `0.5500000000000001` on V8 and `0.5499999999999999` on JSC, a goal becomes a save, completely desynchronizing the match and butterfly-effecting all subsequent seed consumption.
* **Adversarial Blast Radius:** Saves or multiplayer matches verified on Linux x86 will desync when loaded on an iPhone or Mac.
* **Concrete Fix:**
  * **Scope Change to [`CM-T05`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):** Engine calculations must use **fixed-point integer arithmetic** (scaled basis points, e.g., $10,000 = 100.00\%$) for all chance rolls, fatigue deductions, and PRNG thresholds. Float math is banned from `src/engine/`.
  * **New Card `CM-T15: Cross-Architecture Determinism Proof Harness` (Assignee: Pi | Deps: CM-014, CM-T05):**
    Run an identical match seed in Playwright across Chromium (Linux), WebKit (macOS), and Firefox, outputting a SHA-256 event ledger hash (minute, event type, player ID, score). The test fails if hashes differ by even 1 byte. Volatile metadata (epoch timestamps) must be normalized out.

---

### 5. [HIGH] Unhandled OPFS Real-World Failure Modes
* **Risk Surface:** OPFS Edge Cases Not Covered
* **The Hole:** [`test-strategy.md`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-strategy.md) lists storage states as:  
  *fresh OPFS · existing save vN · quota-exceeded · private-mode fallback.*  
  However, [`CM-T08`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) fails to specify the most common browser storage failure modes:
  1. **Multi-Tab Lock Contention (`NoModificationAllowedError`):** OPFS `createSyncAccessHandle()` locks files exclusively. If the user opens ChampMan in two tabs, tab 2 crashes on startup.
  2. **Safari 7-Day Storage Eviction:** Safari evicts non-persisted storage after 7 days of inactivity unless `navigator.storage.persist()` was explicitly requested and granted.
  3. **Mid-Save Abort / Crash Recovery:** Tab closure or browser termination during an active SQLite-WASM transaction or save write can leave a broken lock or half-committed file.
  4. **COOP/COEP Isolation Verification:** SQLite-WASM OPFS VFS requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. If these headers drop, storage initialization fails silently.
* **Adversarial Blast Radius:** Catastrophic save corruption and white-screen startup crashes on multi-tab browsing or Safari.
* **Concrete Fix:**
  * **Scope Change to [`CM-T08`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):** Expand acceptance criteria to include:
    1. Multi-tab lock contention test: Tab 2 detects existing lock and displays a friendly "Game already open in another tab" banner without crashing.
    2. Atomic write / journal rollback test: Simulate a terminated save stream; verify engine rolls back to previous valid save snapshot without corrupting the career.
    3. Storage persistence contract: Assert `navigator.storage.persist()` is called on career creation.
    4. Private browsing fallback: In environments where `getDirectory()` throws `SecurityError`, assert graceful fallback to IndexedDB or immediate file export download prompt.

---

### 6. [HIGH] Doctrine Breach: Hermes Tests Hermes Across Core Systems
* **Risk Surface:** Wrong Cross-Assignments / Doctrine Violation
* **The Hole:** Doctrine Rule 1 strictly states: *"Builder ≠ tester. The adversarial/edge suite for a feature is authored by a different builder than the feature."*  
  Yet in [`test-cards.md`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):
  * **CM-T06** (Transfer AI + competitions suites) is assigned to **Hermes**, who is also the sole developer assigned to build [`CM-032`](file:///home/ramamos/cm-review-wt/docs/vault/plan-v2.md#L415) (Transfers), [`CM-034`](file:///home/ramamos/cm-review-wt/docs/vault/plan-v2.md#L417) (Player aging), and [`CM-035`](file:///home/ramamos/cm-review-wt/docs/vault/plan-v2.md#L418) (Competitions).
  * **CM-T04** (E2E match journey) is assigned to **Hermes**, who builds the match engine and match UI ([`CM-014`](file:///home/ramamos/cm-review-wt/docs/vault/plan-v2.md#L398)–[`CM-018`](file:///home/ramamos/cm-review-wt/docs/vault/plan-v2.md#L402)).
  * **CM-T10** (E2E career + quick sim) is assigned to **Hermes**, who builds the career features.  
  Meanwhile, **Pi is assigned 6 cards in Wave 1 alone** (T01, T02, T07, T09, T11, T12), creating an immediate operational bottleneck while Hermes has zero Wave 1 test responsibilities.
* **Adversarial Blast Radius:** Hermes will naturally test against his own implementation assumptions, letting transfer valuation exploits and competition edge cases slip through, while Wave 1 stalls on Pi.
* **Concrete Fix:**
  * **Rebalance and Enforce Cross-Assignment:**
    * **Reassign [`CM-T06`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) to Pi:** Pi writes adversarial transfer AI tests (e.g., zero-dollar bid exploits, wage budget overflows, infinite loan loops) and competition tiebreakers.
    * **Reassign [`CM-T09`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) (Fuzz corpus) to Hermes:** Hermes immediately builds the malformed `.dat` generator in Wave 1, relieving Pi's bottleneck.
    * **Cross-Assign [`CM-T04`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) to Pi:** Pi tests Hermes's match UI with invalid formations, depleted benches, and tactical chaos.

---

### 7. [HIGH] CI Gate Inversion: Nightly-Only L3 Leaves UI Broken on PR Merges
* **Risk Surface:** CI Gaps
* **The Hole:** [`test-strategy.md`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-strategy.md) establishes:  
  *CI: per PR → L1+L2+build+tsc; nightly → L3 full matrix + L4. Merge gate: L1+L2 green + Claude APPROVE.*  
  De-coupling L3 entirely from the PR merge gate means **a PR can break user routing, crash on page load, or fail to render the squad page without failing CI**. The build and unit tests will pass, the code will merge to `main`, and the team will only discover the broken application 24 hours later during the nightly run.
* **Adversarial Blast Radius:** Main branch stays broken for frontend users while CI reports green.
* **Concrete Fix:**
  * **Scope Change to [`CM-T12`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):** Split L3 into two tiers:
    * **L3a PR Fast-Smoke Gate (< 60s):** Headless Chromium single-run on every PR. Validates AppShell mount, primary route navigation, zero console errors, and BYOD file dialog launch.
    * **L3b Nightly Matrix:** Full cross-browser matrix (Chromium, Firefox, WebKit) $\times$ viewports (Desktop, Mobile 390px) $\times$ complete career and match journeys.

---

### 8. [MEDIUM] Missing Web Worker RPC Protocol & Memory Transfer Contract
* **Risk Surface:** Missing Test Layers
* **The Hole:** The architecture mandates offloading the `.dat` parser, SQLite-WASM, and match engine to a Web Worker via Comlink/postMessage to prevent blocking the React UI thread (Verdict F6). However, the test program has **zero test coverage for the Worker RPC boundary**:
  1. No test verifies `ArrayBuffer` objects are transferred rather than cloned (cloning a 30MB buffer doubles memory consumption instantly).
  2. No test verifies worker crash handling (e.g., unhandled exception inside worker resulting in an unrecoverable UI spinner).
  3. No test verifies rapid cancellation (e.g., user navigating away during an active import or simulation).
* **Adversarial Blast Radius:** UI thread freezes during intensive calculations or gets permanently stuck on unhandled worker exceptions.
* **Concrete Fix:**
  * **New Card `CM-T16: Web Worker RPC & Lifecycle Contract Suite` (Assignee: Pi | Deps: CM-011, CM-014):**
    Integration suite verifying:
    1. Transferable object assertion (`buffer.byteLength === 0` on main thread after dispatch).
    2. Worker error propagation (typed RPC errors surface cleanly to the UI store).
    3. Worker termination and respawn under rapid navigation cancellation.

---

### 9. [MEDIUM] Real-World BYOD Data Blind Spots: CP1252, Case-Sensitivity, and Archive Paths
* **Risk Surface:** Missed Risk Surfaces
* **The Hole:** [`CM-T07`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) checks for standard record counts and Arsenal ID 676. But real CM01/02 files provided by users via BYOD present distinct edge cases not covered:
  1. **Character Encoding:** CM01/02 files use Windows-1252 (CP1252). Accented characters (e.g., *Solskjær*, *Bergkamp*, *Møller*) will corrupt or throw exceptions if decoded using standard UTF-8 `TextDecoder`.
  2. **Filename Casing:** Linux and web storage are case-sensitive. User archives contain mixed casing (`CLUB.DAT`, `club.dat`, `Club.Dat`).
  3. **Nested Archives:** User ZIP/ISO uploads frequently contain root directory nesting (e.g., `Data/club.dat` or `cm0102/Data/club.dat`).
* **Adversarial Blast Radius:** Real users uploading valid game data experience corrupted player names, broken search indices, or "missing file" errors.
* **Concrete Fix:**
  * **Scope Change to [`CM-T07`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md) & [`CM-T09`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):**
    * Add specific test assertions for CP1252 name decoding (verifying diacritics match canonical historical spellings).
    * Add file ingestion normalizer tests verifying case-insensitivity and arbitrary archive directory nesting.

---

### 10. [MEDIUM] Missing Pre-Gate for Hardcoded Competition Rules (The H01 "Phantom League" Defect)
* **Risk Surface:** Missed Risk Surfaces
* **The Hole:** Review finding H01 established that `.dat` files **do not contain competition rules, prize money, or league promotion/relegation tables** (they were hardcoded in the original C++ binary). The test cards assume that once `.dat` files are parsed, Phase 2 can simulate leagues. If Phase 2 starts without verifying that hardcoded English pyramid rules integrate with parsed club IDs, the season simulation collapses.
* **Adversarial Blast Radius:** Phase 2 development stalls because competition fixtures cannot map to parsed teams.
* **Concrete Fix:**
  * **New Card `CM-T17: Competition Rule Engine Contract & Falsification Suite` (Assignee: Pi | Deps: CM-011, CM-T07):**
    Verify that the hardcoded English league pyramid configuration (Premier League down to Conference) correctly binds to the parsed 2001 `.dat` team IDs, stadium seating, and division codes before any Phase 2 career card merges.

---

### 11. [LOW] Headless AudioContext & Haptics Failure in Playwright
* **Risk Surface:** CI Gaps / Flakiness Traps
* **The Hole:** Verdict P4 adopted suspense audio commentary and haptics. In headless Playwright CI, calling Web Audio or `navigator.vibrate` without an active user gesture throws `DOMException: The AudioContext was not allowed to start` or logs browser warnings. This violates Doctrine Rule 5: *"Zero console errors in E2E runs; new warnings reviewed per release."*
* **Adversarial Blast Radius:** E2E runs will fail the zero-console-error policy on commentary match screens.
* **Concrete Fix:**
  * **Scope Change to [`CM-T01`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):**
    Configure Playwright browser args with `--autoplay-policy=no-user-gesture-required` and inject standard mocks for `window.AudioContext` and `navigator.vibrate` in E2E test fixtures.

---

## Remediation Summary: Updated Card Register

To close all identified holes, apply the following card adjustments and additions to [`docs/vault/testing/test-cards.md`](file:///home/ramamos/cm-review-wt/docs/vault/testing/test-cards.md):

| Card | Action | Scope / Changes | Assignee | Deps |
|---|---|---|---|---|
| **CM-T01** | Scope Change | Add audio autoplay flag & haptic mock harness to Playwright config | Pi | None |
| **CM-T05** | Scope Change | Enforce fixed-point integer math (no floats in engine) for determinism | Pi | CM-014 |
| **CM-T06** | **Reassign** | Reassign to Pi to honor "Builder ≠ Tester" doctrine | **Pi** | CM-014, CM-030 |
| **CM-T07** | Scope Change | Add CP1252 diacritics test & archive path normalization | Pi | CM-011 |
| **CM-T08** | **Split** | Split into `CM-T08A` (Migrations in Vitest) and `CM-T08B` (Real OPFS/locking in Browser) | Pi | CM-020 |
| **CM-T09** | **Reassign** | Reassign to Hermes to eliminate Wave 1 Pi bottleneck | **Hermes** | None |
| **CM-T11** | Scope Change | Replace wall-clock 10k match gate with CPU-calibrated benchmark + add $\le 120\text{MB}$ heap limit | Pi | None |
| **CM-T12** | Scope Change | Add L3a fast-smoke gate to every PR; full matrix nightly | Pi | CM-T01 |
| **CM-T14** | **NEW** | Canonical synthetic `.dat` generator for PRs + encrypted CI fixture vault | Pi | None |
| **CM-T15** | **NEW** | Cross-platform (x86 vs ARM64) & cross-engine (V8/JSC/SpiderMonkey) determinism proof suite | Pi | CM-014, CM-T05 |
| **CM-T16** | **NEW** | Web Worker RPC protocol, transferable memory & lifecycle test suite | Pi | CM-011, CM-014 |
| **CM-T17** | **NEW** | Competition Rule Engine pre-falsification suite (English pyramid fixture mapping) | Pi | CM-011, CM-T07 |

---
*End of Report.*
