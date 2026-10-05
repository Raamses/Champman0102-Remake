#!/usr/bin/env python3
"""Generate docs/vault/board-state.json — the kanban mirror the Mac side reads.

Single source of the board = docs/vault/plan-v2.md card tables + docs/vault/cards/*.md
specs. Status is derived from EVIDENCE (git history, spec-file presence), never asserted.

Never hand-edit the output; regenerate it in the same commit that changes board state:
    python3 scripts/board_state.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAN = ROOT / "docs/vault/plan-v2.md"
CARDS = ROOT / "docs/vault/cards"
OUT = ROOT / "docs/vault/board-state.json"

PHASE_TITLES = {
    0: "Phase 0 — reverse engineering",
    1: "Phase 1 — exhibition match",
    2: "Phase 2 — career mode",
    3: "Phase 3 — competitions",
    4: "Phase 4 — polish & ship",
}


def git(*args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=False
    ).stdout.strip()


def parse_plan() -> list[dict]:
    """Card rows out of plan-v2.md tables, tagged with their phase."""
    cards: list[dict] = []
    phase = None
    heading = re.compile(r"^###\s+(.*)$")
    for line in PLAN.read_text().splitlines():
        h = heading.match(line)
        if h:
            m = re.search(r"Phase\s+(\d)", h.group(1))
            phase = int(m.group(1)) if m else phase
            continue
        row = re.match(r"^\|\s*(CM-[\w.-]+)\s*\|\s*(.+?)\s*\|\s*([^|]+?)\s*\|\s*$", line)
        if row:
            cards.append(
                {"id": row.group(1), "scope": row.group(2), "owner": row.group(3), "phase": phase}
            )
    return cards


def main() -> int:
    subject = git("rev-parse", "HEAD")
    short = subject[:7]
    log = git("log", "--oneline", "-60")

    # commit subjects mentioning a card id => that card was landed on main
    landed: dict[str, str] = {}
    for line in log.splitlines():
        sha, _, text = line.partition(" ")
        for cid in set(re.findall(r"CM-[0-9A-Za-z]+", text)):
            landed.setdefault(cid, sha[:7])

    specs = {p.name for p in CARDS.glob("*.md")} if CARDS.is_dir() else set()

    cards = []
    for c in parse_plan():
        cid = c["id"]
        spec_files = sorted(f"docs/vault/cards/{s}" for s in specs if s.startswith(cid.lower()))
        ev = landed.get(cid)
        if ev:
            status = "done"
        elif spec_files:
            status = "backlog"  # specced, not built
        else:
            status = "backlog"
        cards.append(
            {
                "id": cid,
                "phase": c["phase"],
                "phase_title": PHASE_TITLES.get(c["phase"], "unknown"),
                "scope": c["scope"],
                "owner": c["owner"],
                "status": status,
                "spec": spec_files or None,
                "evidence": ({"commit": ev} if ev else None),
            }
        )

    state = {
        "schema": "champman.board-state.v1",
        "generated_by": "scripts/board_state.py",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "repo": "Raamses/Champman0102-Remake",
        "commit": short,
        "authority": {
            "decisions": "docs/vault/decisions-2026-09-11.md",
            "note": (
                "decisions-2026-09-11.md is AUTHORITATIVE. plan-v2.md card rows for "
                "CM-011/CM-012/CM-020 still read SQLite-WAM/OPFS and are SUPERSEDED by "
                "decisions §1 (in-memory SoA + IndexedDB end-of-turn writes)."
            ),
        },
        "done_definition": {
            "command": "scripts/verify.sh",
            "gates": ["tsc -b", "vitest run", "vitest run -c vitest.perf.config.ts", "seeded determinism suites"],
            "rule": "exit 0 == green == done; prose 'done' is invalid",
        },
        "progress_log": "progress.md",
        "counts": {
            s: sum(1 for c in cards if c["status"] == s)
            for s in sorted({c["status"] for c in cards})
        },
        "cards": cards,
    }
    OUT.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)} — {len(cards)} cards, {state['counts']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())