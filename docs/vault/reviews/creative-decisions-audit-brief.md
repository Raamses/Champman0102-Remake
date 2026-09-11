# Creative-Decisions Audit Brief — Gemini 3.8 Flash (High)

**Task:** Adversarial review of every creative/design decision in this repo. Find holes: contradictions, unrealistic assumptions, missing requirements, security/legal/perf gaps, timeline fantasy. Do not praise. Do not repeat the existing reviews in `docs/vault/reviews/` — attack what they missed.

**Ordered by Ram, 2026-09-11. Model verified live: `gemini-3.8-flash-high` (agy).**

## Decision inventory to attack

| # | Decision | Source doc |
|---|----------|-----------|
| D1 | TypeScript DataView parser over Rust→WASM; claim "50MB parses in ms in browser" | plan-v2 §Key Decisions |
| D2 | TWO parsers maintained: TS runtime + Python offline converter (`scripts/dat_to_json.py`) — duplication risk | plan-v2 v1→v2 table #1; repo |
| D3 | SQLite-WASM + OPFS persistence over IndexedDB | plan-v2 #2 |
| D4 | BYOD: user supplies own .dat files; minimal sample dataset; "parser OK, distributing data is not" legal stance | plan-v2 #4, Key Decisions |
| D5 | Multi-file .dat: index/club/nat_club/nation/staff + player_setup.cfg merge | plan-v2 #8 |
| D6 | Chance creation → conversion match model; per-minute loop; CP thresholds; home advantage (+15% in match-engine.md vs +10% still in plan-v2 §Match Engine — contradiction, judge which is right); tempo factor 0.8–1.2; stamina decay 0.5–1%/min | architecture/match-engine.md |
| D7 | CM01/02 original attribute names (Shooting, Dirtyness, BigOccasion…) — mapping to .dat bytes is implied but unspecified | plan-v2 #7 |
| D8 | Multiplayer docs disagree in structure: multiplayer.md v2 presents host-authoritative WebRTC P2P + async play-by-mail scheduling as complementary layers, while plan-v2 summary row #5 records only "async play-by-mail" (the P2P layer was dropped in that table). Identify which doc is imprecise and what the real design requires — not a clean either/or | plan-v2 #5,#12 vs multiplayer.md |
| D9 | Text commentary (2D) match presentation | plan-v2 |
| D10 | PWA platform, no app store | plan-v2 |
| D11 | 7–8 week MVP (Phase 0 + Phase 1) with card list CM-001..021 | plan-v2 |
| D12 | Deterministic seeds for match-engine unit tests | plan-v2 #9 |
| D13 | Versioned save schema + migration functions | plan-v2 #10 |
| D14 | Firebase deferred post-v1 (applet config/firestore.rules still in repo root — dead weight?) | plan-v2; repo root |
| D15 | Phase 0 .dat format spike as 1-week gate before app work | plan-v2 #11 |
| D16 | Save-size estimate 10–15MB (not 100MB) tied to SQLite-WASM/OPFS — a concrete, previously-wrong numeric claim; distinct from D1's "50MB .dat binary parses in ms" (source binary ≠ save state, similar magnitudes, do not conflate) | plan-v2 §action items #7 |

## Doc precedence on conflict

`plan-v2.md` is the execution contract; `architecture/*.md` are proposals superseding plan-v1 sections. Where they disagree (e.g., D6 home bonus, D8 multiplayer layers), do not assume either is authoritative: report both values, judge on evidence (CM01/02 fidelity, data, cost), and recommend the specific doc edit.

## Required output format

Write findings to `docs/vault/reviews/creative-decisions-audit-gemini38.md`:

1. **Verdict line** per decision D1–D16: SOUND / RISKY / BROKEN.
2. **Holes** ranked P0 (project-killing) → P3 (nit): what breaks, when it breaks, concrete fix.
3. **Contradictions** between docs (D8 is one — find the rest).
4. **The 5 assumptions most likely to be wrong**, each with a falsification test a builder can run this week.
5. No restating of prior review content (`counsel-review.md`, `plan-v1-review.md`) as findings.

## Builder workflow (from Ram, 2026-09-11)

- Every part of work lands as its own PR — never direct commits to main.
- Each PR is checked with Claude (`claude -p` review) before merge.
- Results are distributed to all builders (GitHub + mailbox to Hermes). Repo is the single source of truth: `Raamses/Champman0102-Remake`.