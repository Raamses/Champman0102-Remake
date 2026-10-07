# Progress log — ChampMan 01/02 Remake

**Shared, agent-neutral session log. EVERY entry is signed** (`## <date> — <agent>`).

Concurrent-writer rules (fleet protocol, Hermes 2026-10-05):
1. **Append-only, newest on top.** Never edit or delete another agent's entry — a correction is a
   new entry that cites the one it corrects.
2. One entry = one session = one signature. Unsigned entry = invalid.
3. A progress update commits **atomically with the work it describes**.
4. Agent-internal journals (OpenClaw memory files, agent session logs) stay machine-private. This
   file is shared state.

Evidence = command + result + date. Fleet protocol details: harness kit README at
`~/.hermes/harness/README.md`.

---

## 2026-10-07 — builder (OpenClaw): PR 42 fix round 1 (review 5437843070)

- F1.1: Regenerated mirror to match progress log exactly.
- F1.2: `done` derived dynamically: parsed progress.md spine/no-implementation/board-position lines + the status-2026-09-29 snapshot + full git history (merge-only evidence, range-carrier rule for recorded ranges); no hardcoded registry
- F1.3: Card universe is union of plan rows, specs, and registry entries.
- F1.4: Documented GitHub CI as the true merge gate in AGENTS.md.
- F1.5: determinism gate restored as an independent signal: seeded suites run twice, normalized JSON outputs byte-identical + both all-green (4-gate vocabulary kept; no fallback).
- F1.6: Status parsing fixed to support full vocabulary, dropped dead backlog branch.
- F1.7: exact id-token equality (never prefix matching).
- F1.8: Added pre-gate generation check in verify.sh to prevent hand-edits.
- F1.9: Script fails loudly if git rev-parse returns empty.
- F1.10: Documented board_state.py and verify.sh --quick in description.md.
- F1.11: Corrected docs/vault/README.md directory and file mappings.
- F1.12: removed volatile commit/generated_at; stable generated_from sources list instead.
- F1.13: trailing newlines enforced on the five touched files

### Evidence
card-verify green on this head
full ./scripts/verify.sh run green per the final gate table (exact numbers recorded in docs/vault/research/cm-pr42-fix1-2026-10.md)
regen check (python3 scripts/board_state.py && git diff --exit-code docs/vault/board-state.json) clean
board-state.json regenerated inside this PR (host steering).
full ./scripts/verify.sh 4/4 green on the fix head, 2026-10-07 (regen precondition clean)

---

## 2026-10-05 — amosbot (Pi): progress-log rename + protocol header

**Renamed** `claude-progress.md` → `progress.md` (git mv, same PR) per Hermes msg-000156:
the Claude-named file was agent-specific baggage. Updated the three references that pointed
at the old name (`AGENTS.md` x4, `scripts/board_state.py`, regenerated
`docs/vault/board-state.json`) and added the signed-entry/concurrent-writer rules above.

Evidence: `grep -rn "claude-progress" .` → 0 hits, 2026-10-05.

---

## 2026-10-05 — amosbot (Pi): harness bootstrap (root AGENTS.md, verify.sh, board-state.json)

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
