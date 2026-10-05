# Progress log — ChampMan 01/02 Remake

Newest first. One entry per working session. Evidence = command + result + date.
Fleet protocol: harness kit README at `~/.hermes/harness/README.md`.

---

## 2026-10-05 — harness bootstrap (root AGENTS.md, verify.sh, board-state.json)

**Session scope:** root harness only. No product code touched. One feature per session — the feature
was *make the harness exist*.

### Done
- `AGENTS.md` (repo root) — thin pointer: vault authority (`decisions-2026-09-11.md` authoritative,
  sync FROM it), the 4 mandatory gates, kanban-as-feature-list protocol, one-feature-per-session,
  pointer to `docs/vault/`.
- `scripts/verify.sh` — types + unit + perf + determinism, exit 0 = green. `--quick` skips perf and
  determinism and is explicitly **not** a done signal.
- `docs/vault/board-state.json` — generated mirror of the kanban board for the Mac side.
- This file.

### Evidence — baseline verify run, commit `1b5c498`, 2026-10-05
```
$ ./scripts/verify.sh
[PASS] types        npx tsc -b                                                        8s
[PASS] unit         npx vitest run                          24 files / 650 passed, 2 skipped  11s
[PASS] perf         npx vitest run -c vitest.perf.config.ts  4 passed, 1 skipped          1s
                    (staff.dat heap 76.6MB raw / 74.8MB retained vs 120MB budget;
                     10k seeded sims 85.0ms vs 2001.4ms CPU-calibrated budget)
[PASS] determinism  vitest run golden.match + matchEngine + fuzz   261 passed          2s
VERIFY GREEN — 4/4 gates pass. Evidence: 1b5c498 @ 2026-10-05
```

### Board position at this commit
- Last merged: **CM-023b** (`1b5c498`, PR #41) — Playwright suite green. Phase 1 integration landed.
- Merged spine: CM-010/011/013/014/015/016/016b/021*, 022a–022e, 023b (PRs #8–#41).
- **Open on the workboard:** CM-023 in `review`; CM-024 (code/test drift fails loudly) in `triage`.
- **Repo cards with no merged implementation:** `cm-018-match-ui`, `cm-020-saveload`,
  `cm-r03-calibration` (CM-R03 is the top spine card — the placeholder engine constants stay
  provisional until it lands).
- Blocked elsewhere: none in this repo.

### Resume path
```bash
cd ~/.openclaw/workspace/Champman0102-Remake && git pull && ./scripts/verify.sh
```
A fresh process reproduces the 4/4 green above on `1b5c498`. Next session: pick the next `ready`
card off the board (CM-R03 calibration is the spine), state it in this file, and stop at one feature.

### Contradictions found while reading (not fixed — flagged for Ram)
1. **`plan-v2.md` still reads SQLite-WAM/OPFS** for CM-011/012/020. Superseded by
   `decisions-2026-09-11.md` §1 (in-memory SoA + IndexedDB end-of-turn). The plan's own header warns
   it is partly superseded; the *tables* were never updated. Low risk — §1 says read the decisions
   doc first — but it is a trap for an agent that greps the plan.
2. **CM-021 (Phase 1 integration) PR #35 was CLOSED, not merged.** It was scoped to CM-013/017/018/020/022
   but CM-018 and CM-020 never landed, so it was correctly not merged. The workboard still lists
   CM-023 as the Phase 1 integration card; the card ID drifted from the vault's CM-021.