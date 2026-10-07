### Summary
Harness bootstrap: root AGENTS.md, verify.sh gates, board-state mirror, progress log; fix round 1 applied.

### What lands
- `AGENTS.md` - thin pointer to vault.
- `scripts/verify.sh` - automated gate runner.
- `scripts/board_state.py` - defines how done is derived and produces the Mac-side mirror.
- `verify.sh --quick` mode - types+unit only, NOT a done signal.
- `docs/vault/board-state.json` - generated mirror of the kanban board.
- `progress.md` - shared agent-neutral progress log.
- `docs/vault/README.md` - accurate folder map.

### What does NOT land
- No `src/**` product code.
- No `.github` changes (protected-path rule).

### Gates and merge policy
- types (`tsc -b`)
- unit (`vitest run`)
- perf (`vitest run -c vitest.perf.config.ts`)
- determinism (`vitest run` on seeded suites twice, normalized outputs byte-identical)
`verify.sh` green is necessary but NOT sufficient; the actual merge gate is GitHub CI.

### Fix round 1 (review 5437843070)
- F1.1: Regenerated mirror to match progress log exactly.
- F1.2: `done` derived dynamically: progress.md + status-2026-09-29 records + full git history; no hardcoded registry; range-carrier rule documented for recorded ranges (CM-022a/b via the series carrier e8e821c)
- F1.3: Card universe is union of plan rows, specs, and registry entries.
- F1.4: Declared GitHub CI as actual merge gate.
- F1.5: determinism gate restored as an independent signal: seeded suites run twice, normalized JSON outputs byte-identical + both all-green.
- F1.6: Collapsed dead branch, enabled full vocabulary parsing.
- F1.7: Exact token matching for specs.
- F1.8: Precondition gate to prevent ungenerated board state drift.
- F1.9: Fail loudly on empty git output.
- F1.10: Listed `board_state.py` and `--quick` in What lands.
- F1.11: Aligned `README.md` structure table.
- F1.12: Replaced volatile metadata with stable provenance field.
- F1.13: Trailing newlines added to files.
- Board-state regeneration inside this PR.

### Evidence
- `progress.md` 2026-10-05 baseline 4/4 green at 1b5c498.
- This fix round at its own head.
