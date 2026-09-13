#!/usr/bin/env python3
"""Compile cached champman0102.net offsets thread pages into a single notes file."""

import os
from pathlib import Path

CACHE_DIR = Path.home() / ".hermes/cache/web"
OUTPUT_DIR = Path.home() / "Champman0102-Remake/docs/vault/research"
OUTPUT_FILE = OUTPUT_DIR / "offsets-thread-notes.md"

# Cached pages in order
PAGES = [
    ("champman0102.net-4d35a0403f.md", "Page 1 (posts 1-25)"),
    ("champman0102.net-abf6efde76.md", "Page 2 (posts 26-50)"),
    ("champman0102.net-65165a3817.md", "Page 3 (posts 51-75)"),
    ("champman0102.net-2c5f63fd15.md", "Page 4 (posts 76-100)"),
    ("champman0102.net-ccf6c0cff5.md", "Page 5 (posts 101-125)"),
    ("champman0102.net-fe75357af0.md", "Page 6 (posts 126-150)"),
]

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w") as out:
    out.write("# CM01/02 Offsets Thread Notes\n\n")
    out.write("**Source:** https://champman0102.net/viewtopic.php?t=1540\n")
    out.write("**Total posts:** 764 across 31 pages\n")
    out.write("**Scraped:** 6 pages (150 posts) — partial coverage\n\n")
    out.write("---\n\n")

    for filename, label in PAGES:
        filepath = CACHE_DIR / filename
        if filepath.exists():
            content = filepath.read_text(encoding="utf-8")
            out.write(f"## {label}\n\n")
            out.write(content)
            out.write("\n\n---\n\n")
            print(f"✓ {label}")
        else:
            print(f"✗ {filename} not found")

print(f"\nCompiled to {OUTPUT_FILE}")
