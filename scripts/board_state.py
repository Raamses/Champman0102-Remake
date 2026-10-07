#!/usr/bin/env python3
"""Generate docs/vault/board-state.json — the kanban mirror the Mac side reads.

Single source of the board = union of docs/vault/plan-v2.md card tables + docs/vault/cards/*.md
specs + record-derived cards (spine-A landed ids outside the universe, and passthrough-recorded ids). Status is derived dynamically by reading recorded evidence.

Algorithm:
1) Records source A (progress.md):
   - landed ids: lines matching "Merged spine:". Comma/slash split, strip trailing '*' (which are EXCLUDED). Expands ranges like "022a-022e" (letters) or "CM-001..006" (numeric).
   - not-landed overrides: line "Repo cards with no merged implementation:". Parses backtick slugs. EXCLUDED from landed.
   - passthrough states: line "Open on the workboard:". Parses backticked/quoted state word. Mapped to vocabulary {backlog, ready, in_progress, review, done, blocked} (others to backlog with stderr note).
2) Records source B (docs/vault/status-2026-09-29.md, optional):
   - line "- **Merged / done:**" under "## Phase 1 state". Parses ids and optional "(...)". Ignored if parenthetical is not a 7-hex sha or "PR #<n>". Sha is used directly as evidence. Source B supplies landed/evidence only for ids inside the universe.
3) Universe scoping:
   - Only ids in the universe (plan-v2 UNION cards/*.md) get normal status routing. Recorded ids outside the universe become cards if they are spine-A landed ids (scope = evidence commit subject) or passthrough-recorded ids. Snapshot-only out-of-universe ids are deliberately excluded. Non-CM- matches are skipped.
4) Evidence commit per landed id, in order:
   (a) explicit sha from source B
   (b) search FULL git history for exact id (word-boundary), PR-squash marker "(#<digits>)", newest, reachable from HEAD, skip subjects starting with Revert or WIP
   (c) same search without PR-marker
   (d) range-carrier fallback: if id came from a recorded range expansion and no exact-mention commit exists, use OLDEST reachable PR-marker commit mentioning any same-base sibling id inside the range (e.g. for CM-022a/b, e8e821c carries the whole 022a-022e series)
   (e) no evidence: stderr warn loudly, id status falls through
5) verify citation:
   - parses progress.md newest-first for "VERIFY GREEN ... Evidence: <sha> @ <date>". Citation = f"progress.md {date} recorded green run at {sha}"
6) Status derivation:
   - done: landed and not excluded and evidence found
   - elif passthrough state
   - elif spec files exist -> ready
   - else backlog

Never hand-edit the output; regenerate it in the same commit that changes board state:
    python3 scripts/board_state.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
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

VOCABULARY = {"backlog", "ready", "in_progress", "review", "done", "blocked"}

def canon_id(raw: str) -> str:
    raw = raw.strip()
    if not raw.upper().startswith("CM-"): raw = "CM-" + raw
    m = re.match(r'^(CM-\d+)([a-zA-Z])$', raw, re.IGNORECASE)
    if m: return f"{m.group(1).upper()}{m.group(2).lower()}"
    return raw.upper()

def expand_id(p: str) -> list[str]:
    p = p.strip()
    m_dots = re.match(r'^(?:CM-)?([a-z]*)(\d+)\.\.(?:CM-)?(?:[a-z]*)(\d+)$', p, re.IGNORECASE)
    if m_dots:
        prefix = m_dots.group(1).upper()
        start, end = int(m_dots.group(2)), int(m_dots.group(3))
        pad = len(m_dots.group(2))
        return [f"CM-{prefix}{str(i).zfill(pad)}" for i in range(start, end + 1)]
    m_letters = re.match(r'^(?:CM-)?(\d+)([a-z])[-–](?:CM-)?(?:(\d+))?([a-z])$', p, re.IGNORECASE)
    if m_letters:
        b1, l1, b2, l2 = m_letters.group(1), m_letters.group(2).lower(), m_letters.group(3), m_letters.group(4).lower()
        if not b2 or b1 == b2: return [f"CM-{b1}{chr(c)}" for c in range(ord(l1), ord(l2) + 1)]
    return [canon_id(p)]

def parse_progress_md() -> tuple[set[str], set[str], dict[str, str], str, str, dict[str, list[str]]]:
    landed, excluded, passthrough, ranges_map = set(), set(), {}, {}
    verify_sha, verify_date = "", ""
    path = ROOT / "progress.md"
    if not path.exists(): return landed, excluded, passthrough, verify_sha, verify_date, ranges_map
        
    for line in path.read_text().splitlines():
        if not verify_sha:
            m = re.search(r"VERIFY GREEN .* Evidence: ([0-9a-f]{7,40}) @ ([0-9]{4}-[0-9]{2}-[0-9]{2})", line)
            if m: verify_sha, verify_date = m.groups()
                
        if "Merged spine:" in line:
            for p in re.split(r'[,/]', line.split("Merged spine:", 1)[1]):
                p = re.sub(r'\(.*?\)', '', p).strip(' .')
                if not p: continue
                is_excluded = p.endswith('*')
                p = p.rstrip('*')
                exp = expand_id(p)
                for cid in exp:
                    if not cid.upper().startswith("CM-"): continue
                    if is_excluded: excluded.add(cid)
                    else: landed.add(cid)
                if len(exp) > 1:
                    for cid in exp: ranges_map[cid] = exp
                        
        if "Repo cards with no merged implementation:" in line:
            for s in re.findall(r'`(.*?)`', line):
                s = s.lower()
                if s.startswith('cm-'): s = s[3:]
                excluded.add(canon_id(s.split('-')[0]))
                
        if "Open on the workboard:" in line:
            for part in line.split(';'):
                m = re.search(r'(CM-[\w.-]+).*?in [`"\'](\w+)[`"\']', part, re.IGNORECASE)
                if m:
                    cid, st = canon_id(m.group(1)), m.group(2)
                    if st not in VOCABULARY:
                        sys.stderr.write(f"Warning: status '{st}' for {cid} unknown, mapping to backlog\n")
                        st = "backlog"
                    passthrough[cid] = st
                    
    return landed, excluded, passthrough, verify_sha, verify_date, ranges_map

def parse_source_b() -> tuple[set[str], dict[str, str]]:
    landed, explicit_ev = set(), {}
    path = ROOT / "docs/vault/status-2026-09-29.md"
    if not path.exists():
        sys.stderr.write(f"Warning: {path} missing\n")
        return landed, explicit_ev
    try: text = path.read_text()
    except Exception:
        sys.stderr.write(f"Warning: {path} unparseable\n")
        return landed, explicit_ev
        
    in_phase1 = False
    for line in text.splitlines():
        if line.startswith("## Phase 1 state"): in_phase1 = True
        elif line.startswith("## ") and in_phase1: break
        if in_phase1 and line.startswith("- **Merged / done:**"):
            for p in line.split("**", 2)[-1].split(','):
                p = p.strip()
                m_paren = re.search(r'\((.*?)\)', p)
                paren_text = m_paren.group(1) if m_paren else None
                for tok in re.sub(r'\(.*?\)', '', p).strip().split():
                    if not re.match(r'^(CM-)?[\w.-]+$', tok, re.IGNORECASE): continue
                    if not tok.upper().startswith("CM-") and not tok[0].isdigit(): continue
                    for cid in expand_id(tok):
                        if not cid.upper().startswith("CM-"): continue
                        landed.add(cid)
                        if paren_text and (re.match(r'^[0-9a-f]{7}$', paren_text) or re.match(r'^PR #\d+$', paren_text)):
                            if re.match(r'^[0-9a-f]{7}$', paren_text): explicit_ev[cid] = paren_text
    return landed, explicit_ev

def get_git_commits() -> list[dict]:
    res = subprocess.run(["git", "log", "-z", "--format=%H%x01%s%x01%b"], cwd=ROOT, capture_output=True, text=True, check=False)
    if res.returncode != 0 or not res.stdout:
        sys.stderr.write("git log failed or empty output\n")
        sys.exit(1)
    commits = []
    for block in res.stdout.split('\x00'):
        if not block: continue
        parts = block.split('\x01', 2)
        if len(parts) >= 2:
            commits.append({"sha": parts[0], "subject": parts[1].strip(), "body": parts[2] if len(parts) > 2 else ""})
    return commits

def find_evidence(cid: str, commits: list[dict], explicit_ev: dict[str, str], ranges_map: dict[str, list[str]]) -> str | None:
    """
    0) explicit sha from source B (unchanged).
    1) subject ends with the PR-squash marker "(#<digits>)" AND the SUBJECT contains the exact id.
    2) range-carrier rule (ONLY ids from a recorded range expansion): oldest->newest scan for a marker-terminated subject whose message mentions any same-base sibling id inside the recorded range.
    3) marker-terminated subject AND the message contains the exact id INSIDE A LANDING-BULLET LINE: keep only mentions where the mentioning line, stripped, starts (after an optional conventional type token like feat/docs/test/fix/chore/perf/refactor plus parenthesis, e.g. "feat(", "test(") with the exact id itself — i.e. lines like "feat(CM-013): ..." or "CM-018 core: ..." count; mid-sentence cross-references like "... binaries excluded (CM-006)." do NOT.
    4) subject contains the exact id, any commit (direct-landing records like the Phase 0 commits).
    5) none matched -> the single loud stderr warning, return None.
    """
    if cid in explicit_ev: return explicit_ev[cid]
    cid_pat = r'\b' + re.escape(cid) + r'\b'
    
    for c in commits:
        if c["subject"].startswith("Revert") or c["subject"].startswith("WIP"): continue
        if re.search(r'\(\#\d+\)$', c["subject"]) and re.search(cid_pat, c["subject"], re.IGNORECASE):
            if check_ancestor(c["sha"]): return c["sha"][:7]
            
    if cid in ranges_map:
        for c in reversed(commits):
            if c["subject"].startswith("Revert") or c["subject"].startswith("WIP"): continue
            if re.search(r'\(\#\d+\)$', c["subject"]):
                text = c["subject"] + "\n" + c["body"]
                for sib in ranges_map[cid]:
                    if re.search(r'\b' + re.escape(sib) + r'\b', text, re.IGNORECASE):
                        if check_ancestor(c["sha"]): return c["sha"][:7]
                        
    for c in commits:
        if c["subject"].startswith("Revert") or c["subject"].startswith("WIP"): continue
        if re.search(r'\(\#\d+\)$', c["subject"]):
            text = c["subject"] + "\n" + c["body"]
            for line in text.splitlines():
                s = line.strip().lstrip('*-').strip()
                if re.match(r'^(?:[a-zA-Z]+\()?(' + re.escape(cid) + r')\b', s, re.IGNORECASE):
                    if check_ancestor(c["sha"]): return c["sha"][:7]

    for c in commits:
        if c["subject"].startswith("Revert") or c["subject"].startswith("WIP"): continue
        if re.search(cid_pat, c["subject"], re.IGNORECASE):
            if check_ancestor(c["sha"]): return c["sha"][:7]

    sys.stderr.write(f"Warning: loud git() failure — no reachable evidence commit found for landed id {cid}\n")
    return None

def git(*args: str) -> str:
    res = subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=False
    )
    out = res.stdout.strip()
    if res.returncode != 0 or not out:
        sys.stderr.write(f"git {' '.join(args)} failed or empty output\n{res.stderr}\n")
        sys.exit(1)
    return out

def check_ancestor(sha: str) -> bool:
    res = subprocess.run(
        ["git", "merge-base", "--is-ancestor", sha, "HEAD"],
        cwd=ROOT, capture_output=True, check=False
    )
    return res.returncode == 0

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
    specs = {p.name for p in CARDS.glob("*.md")} if CARDS.is_dir() else set()
    
    card_dict = {}
    for c in parse_plan():
        card_dict[c["id"].upper()] = c

    for spec in sorted(specs):
        stem = spec[:-3]
        parts = stem.split('-')
        if len(parts) >= 2 and parts[0].lower() == 'cm':
            raw_id = parts[1]
            display_id = f"CM-{raw_id.upper()}" if raw_id.lower().startswith('r') else f"CM-{raw_id.lower()}"
            cid_up = display_id.upper()
            if cid_up not in card_dict:
                card_dict[cid_up] = {
                    "id": display_id,
                    "scope": stem,
                    "owner": None,
                    "phase": None,
                }

    landed_A, excluded_A, passthrough, v_sha, v_date, ranges_map = parse_progress_md()
    landed_B, explicit_ev = parse_source_b()
    landed = landed_A | landed_B
    
    universe = set(card_dict.keys())

    commits = get_git_commits()
    evidence = {}
    for cid in landed:
        if cid in excluded_A: continue
        cid_up = cid.upper()
        if cid_up not in universe and cid not in landed_A: continue
        sha = find_evidence(cid, commits, explicit_ev, ranges_map)
        if sha: evidence[cid] = sha

    for cid in landed_A:
        cid_up = cid.upper()
        if cid_up not in universe:
            sha = evidence.get(cid)
            subj = "recorded landed in the progress.md merged spine; no spec file"
            if sha:
                for c in commits:
                    if c["sha"].startswith(sha):
                        subj = c["subject"]
                        break
            card_dict[cid_up] = {
                "id": cid,
                "scope": subj,
                "owner": None,
                "phase": 1,
            }

    for cid in passthrough:
        cid_up = cid.upper()
        if cid_up not in card_dict:
            card_dict[cid_up] = {
                "id": cid,
                "scope": cid,
                "owner": None,
                "phase": None,
            }

    passthrough_up = {k.upper(): v for k, v in passthrough.items()}
    evidence_up = {k.upper(): v for k, v in evidence.items()}
    landed_up = {x.upper() for x in landed}
    excluded_up = {x.upper() for x in excluded_A}

    cards = []
    for cid_up in sorted(card_dict.keys()):
        c = card_dict[cid_up]
        display_id = c["id"]
        
        spec_files = []
        for s in specs:
            stem = s[:-3]
            parts = stem.split('-')
            if len(parts) >= 2 and parts[0].lower() == 'cm' and parts[1].upper() == cid_up[3:]:
                spec_files.append(f"docs/vault/cards/{s}")
        spec_files.sort()

        status = "backlog"
        ev = None
        if cid_up in landed_up and cid_up not in excluded_up and cid_up in evidence_up:
            status = "done"
            ev = evidence_up[cid_up]
        elif cid_up in passthrough_up:
            status = passthrough_up[cid_up]
        elif spec_files:
            status = "ready"
            
        phase = c["phase"]
        
        evidence_dict = None
        if ev:
            verify_str = f"progress.md {v_date} recorded green run at {v_sha}" if v_sha and v_date else "progress.md recorded green run"
            evidence_dict = {
                "commit": ev,
                "verify": verify_str
            }

        cards.append(
            {
                "id": display_id,
                "phase": phase,
                "phase_title": PHASE_TITLES.get(phase, "unscheduled") if phase is not None else "unscheduled",
                "scope": c["scope"],
                "owner": c["owner"],
                "status": status,
                "spec": spec_files or None,
                "evidence": evidence_dict,
            }
        )

    state = {
        "schema": "champman.board-state.v2",
        "generated_from": {
            "sources": ["docs/vault/plan-v2.md", "docs/vault/cards/*.md", "progress.md", "scripts/board_state.py", "docs/vault/status-2026-09-29.md"]
        },
        "repo": "Raamses/Champman0102-Remake",
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
            "gates": ["tsc -b", "vitest run", "vitest run -c vitest.perf.config.ts", "seeded determinism suites run twice; normalized outputs byte-identical"],
            "rule": "verify.sh green is necessary but NOT sufficient; GitHub CI (incl. vite build and chromium smoke) is the merge gate",
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
