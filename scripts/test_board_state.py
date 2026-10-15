#!/usr/bin/env python3
"""Unit tests for scripts/board_state.py evidence stability and derivation rules."""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


class TestBoardState(unittest.TestCase):
    board_state_py = Path(__file__).resolve().parent / "board_state.py"

    def setUp(self) -> None:
        self.tmpdir = tempfile.TemporaryDirectory()
        self.repo = Path(self.tmpdir.name)
        self._git("init", "-b", "main")
        self._git("config", "user.name", "Tester")
        self._git("config", "user.email", "tester@example.com")

        (self.repo / "docs/vault/cards").mkdir(parents=True, exist_ok=True)
        (self.repo / "scripts").mkdir(parents=True, exist_ok=True)

        shutil.copy(self.board_state_py, self.repo / "scripts/board_state.py")

        (self.repo / "docs/vault/plan-v2.md").write_text(
            "### Phase 1 — exhibition match\n"
            "| CM-013 | Database viewer | Hermes |\n"
            "| CM-021 | Phase 1 integration | Hermes |\n"
            "| CM-022a | Golden tests | Hermes |\n"
            "| CM-022b | Delete dead impl | Hermes |\n"
            "| CM-022c | Land reconciled | Hermes |\n"
            "| CM-022d | InitPitch idempotency | Hermes |\n"
            "| CM-022e | Keeper proof | Hermes |\n"
        )

        (self.repo / "progress.md").write_text(
            "# Progress log — ChampMan 01/02 Remake\n\n"
            "## 2026-10-05 — baseline\n"
            "VERIFY GREEN — 4/4 gates pass. Evidence: 1b5c498 @ 2026-10-05\n"
            "- Merged spine: CM-013, 021*, 022a-022e\n"
        )

        (self.repo / "docs/vault/status-2026-09-29.md").write_text(
            "## Phase 1 state\n"
            "- **Merged / done:** \n"
        )

    def tearDown(self) -> None:
        self.tmpdir.cleanup()

    def _git(self, *args: str) -> str:
        res = subprocess.run(
            ["git", *args],
            cwd=self.repo,
            capture_output=True,
            text=True,
            check=True,
        )
        return res.stdout.strip()

    def _run_generator(self) -> dict:
        out_path = self.repo / "docs/vault/board-state.json"
        if out_path.exists():
            out_path.unlink()
        res = subprocess.run(
            [sys.executable, "scripts/board_state.py"],
            cwd=self.repo,
            capture_output=True,
            text=True,
        )
        if res.returncode != 0:
            raise RuntimeError(
                f"board_state.py failed (rc={res.returncode}):\n"
                f"stderr:\n{res.stderr}\nstdout:\n{res.stdout}"
            )
        return json.loads(out_path.read_text())

    def test_case_a_invariant_body_mention(self) -> None:
        """Step-1 invariant (Rule 3): squash commit L lands CM-013 via body mention.
        A later squash commit S whose body mentions CM-013 must not steal evidence.
        Mirror before S == on branch containing S == after squash-merge onto main.
        """
        self._git("add", ".")
        self._git(
            "commit",
            "-m",
            "feat(reconcile): land lineage (#36)\n\nCM-013: database viewer UI",
        )
        l_sha = self._git("rev-parse", "HEAD")[:7]

        state_before = self._run_generator()
        ev_before = next(
            c["evidence"] for c in state_before["cards"] if c["id"] == "CM-013"
        )
        self.assertIsNotNone(ev_before)
        self.assertEqual(ev_before["commit"], l_sha)

        self._git("checkout", "-b", "feat/harness")
        (self.repo / "f2").write_text("harness work")
        self._git("add", ".")
        self._git("commit", "-m", "chore: harness (#42)\n\nCM-013 done (earlier)")
        s_sha = self._git("rev-parse", "HEAD")[:7]

        state_branch = self._run_generator()
        ev_branch = next(
            c["evidence"] for c in state_branch["cards"] if c["id"] == "CM-013"
        )
        self.assertIsNotNone(ev_branch)

        (self.repo / "docs/vault/board-state.json").unlink(missing_ok=True)
        self._git("checkout", "main")
        self._git("merge", "--squash", "feat/harness")
        self._git("commit", "-m", "chore: harness (#42)\n\nCM-013 done (earlier)")
        squash_sha = self._git("rev-parse", "HEAD")[:7]

        state_after = self._run_generator()
        ev_after = next(
            c["evidence"] for c in state_after["cards"] if c["id"] == "CM-013"
        )
        self.assertIsNotNone(ev_after)

        self.assertEqual(ev_before["commit"], ev_branch["commit"])
        self.assertEqual(ev_before["commit"], ev_after["commit"])
        self.assertEqual(ev_after["commit"], l_sha)

    def test_case_a_invariant_subject_mention(self) -> None:
        """Step-1 invariant (Rule 1): squash commit L mentions CM-013 in subject.
        Mirror before S == on branch containing S == after squash-merge onto main.
        """
        self._git("add", ".")
        self._git("commit", "-m", "CM-013: db viewer (#36)\n\nInitial implementation")
        l_sha = self._git("rev-parse", "HEAD")[:7]

        state_before = self._run_generator()
        ev_before = next(
            c["evidence"] for c in state_before["cards"] if c["id"] == "CM-013"
        )
        self.assertIsNotNone(ev_before)
        self.assertEqual(ev_before["commit"], l_sha)

        self._git("checkout", "-b", "feat/harness")
        (self.repo / "f2").write_text("harness work")
        self._git("add", ".")
        self._git("commit", "-m", "chore: harness (#42)\n\nCM-013 done (earlier)")

        state_branch = self._run_generator()
        ev_branch = next(
            c["evidence"] for c in state_branch["cards"] if c["id"] == "CM-013"
        )
        self.assertIsNotNone(ev_branch)

        (self.repo / "docs/vault/board-state.json").unlink(missing_ok=True)
        self._git("checkout", "main")
        self._git("merge", "--squash", "feat/harness")
        self._git("commit", "-m", "chore: harness (#42)\n\nCM-013 done (earlier)")

        state_after = self._run_generator()
        ev_after = next(
            c["evidence"] for c in state_after["cards"] if c["id"] == "CM-013"
        )
        self.assertIsNotNone(ev_after)

        self.assertEqual(ev_before["commit"], ev_branch["commit"])
        self.assertEqual(ev_before["commit"], ev_after["commit"])
        self.assertEqual(ev_after["commit"], l_sha)

    def test_case_b_excluded_trailing_star(self) -> None:
        """CM-021 recorded as 021* (trailing star) is excluded; must not be done even if commits mention it."""
        self._git("add", ".")
        self._git("commit", "-m", "initial")
        self._git("commit", "--allow-empty", "-m", "feat(CM-021): phase 1 integration (#35)")

        state = self._run_generator()
        card_021 = next(c for c in state["cards"] if c["id"] == "CM-021")
        self.assertNotEqual(card_021["status"], "done")
        self.assertIsNone(card_021["evidence"])

    def test_case_c_range_carrier_rule2(self) -> None:
        """CM-022a-022e expands the range; rule 2 assigns evidence from OLDEST marker-terminated commit."""
        self._git("add", ".")
        self._git("commit", "-m", "initial")
        self._git("commit", "--allow-empty", "-m", "feat(engine): golden tests for CM-022a (#36)")
        c_old = self._git("rev-parse", "HEAD")[:7]

        self._git("commit", "--allow-empty", "-m", "feat(engine): keeper proof for CM-022e (#40)")
        c_new = self._git("rev-parse", "HEAD")[:7]

        state = self._run_generator()
        card_022b = next(c for c in state["cards"] if c["id"] == "CM-022b")
        self.assertEqual(card_022b["status"], "done")
        self.assertIsNotNone(card_022b["evidence"])
        self.assertEqual(card_022b["evidence"]["commit"], c_old)
        self.assertNotEqual(card_022b["evidence"]["commit"], c_new)


if __name__ == "__main__":
    unittest.main()
