# AGENTS.md — ChampMan 01/02 Remake ("Injury Time")

Thin pointer. Everything real lives in `docs/vault/` — read the vault, not this file.

## 1. Authority — the vault decides
- **`docs/vault/decisions-2026-09-11.md` is AUTHORITATIVE.** Sync FROM it; never re-interpret a
  secondhand answer. If a plan, card, code comment, or memory contradicts it, the vault wins.
- `docs/vault/` is the source of truth. Hierarchy: `decisions-2026-09-11.md` → `plan-v2.md` (partly
  superseded) → `cards/*.md` → code. Read `docs/vault/README.md` for the folder map.

## 2. Definition of done — the 4 gates, ALL must pass
`scripts/verify.sh` runs them; **exit 0 is the only "done"**. Prose "done" is invalid.

| Gate | Command | Covers |
|---|---|---|
| types | `tsc -b` | whole-program typecheck |
| unit | `vitest run` | L1 unit + L2 pure-logic integration |
| perf | `vitest run -c vitest.perf.config.ts` | CM-T11 budgets (heap ceiling, 10k-sim CPU) |
| determinism | `vitest run src/engine/__tests__/golden.match.test.ts src/engine/__tests__/matchEngine.test.ts src/lib/dat-parser/fuzz/fuzz.test.ts` | same seed → byte-identical stream |

Evidence = command + result + date, recorded in the repo (commit message / `claude-progress.md`).
Ram's ruling: **pass = test pass.** An agent claiming done without a green `scripts/verify.sh` run is wrong.

## 3. Kanban is the feature list
- The card board (`docs/vault/plan-v2.md` tables + `docs/vault/cards/*.md`) is the work list. A card
  with no spec file in `docs/vault/cards/` is a wish, not work.
- `docs/vault/board-state.json` is the generated mirror (card, status, evidence). Regenerate it in the
  same commit that changes board state — never hand-edit it.
- Status vocabulary: `backlog` → `ready` → `in_progress` → `review` → `done` / `blocked`. `done`
  requires the 4 gates green for that commit.
- Session start: read the board, pick a `ready` card, state it in `claude-progress.md`. Session end:
  board updated, `claude-progress.md` has the resume path, and a restart (`scripts/verify.sh` from a
  clean process) still passes.

## 4. Scope
- **One feature per session.** Anything discovered along the way that is not that feature goes to the
  board as a new card — never onto the active branch.
- `main` is protected: every change lands via PR with a reviewer approval. Never push to `main`.

## 5. Housekeeping
- Progress log: `claude-progress.md` (one entry per session, newest first).
- Fleet-wide protocols (update/remove, evidence, progress-file discipline, verification-sanity-suite
  spec) live in the harness kit README mirrored at `~/.hermes/harness/README.md` — reference it, do not
  duplicate it here.
- Changes that contradict §1–§4 are bugs. Fix the change, or ask Ram.