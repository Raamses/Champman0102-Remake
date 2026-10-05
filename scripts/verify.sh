#!/usr/bin/env bash
# ChampMan 01/02 Remake — the 4 mandatory gates (Ram's ruling).
# ALL four must pass. Exit 0 == green == "done". Prose "done" is invalid.
#
#   1 types        tsc -b
#   2 unit         vitest run
#   3 perf         vitest run -c vitest.perf.config.ts   (CM-T11 budgets)
#   4 determinism  seeded suites: same seed -> byte-identical stream
#
# Usage: scripts/verify.sh [--quick]   (--quick skips perf + determinism; NOT a done signal)

set -uo pipefail
cd "$(dirname "$0")/.."

QUICK=0
[ "${1:-}" = "--quick" ] && QUICK=1

FAILED=()
RESULTS=()

run_gate() {
  local name="$1"; shift
  printf '\n\033[1m=== GATE %s ===\033[0m\n' "$name"
  local start end rc
  start=$(date +%s)
  "$@"
  rc=$?
  end=$(date +%s)
  if [ "$rc" -eq 0 ]; then
    printf '\033[32m[PASS]\033[0m %-14s %ss\n' "$name" "$((end-start))"
    RESULTS+=("PASS  $name  $((end-start))s")
  else
    printf '\033[31m[FAIL]\033[0m %-14s %ss (exit %s)\n' "$name" "$((end-start))" "$rc"
    FAILED+=("$name")
    RESULTS+=("FAIL  $name  $((end-start))s  exit=$rc")
  fi
}

echo "ChampMan verify — $(date -u +%Y-%m-%dT%H:%M:%SZ) — commit $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

run_gate types        npx tsc -b
run_gate unit         npx vitest run
if [ "$QUICK" -eq 0 ]; then
  run_gate perf         npx vitest run -c vitest.perf.config.ts
  run_gate determinism  npx vitest run \
      src/engine/__tests__/golden.match.test.ts \
      src/engine/__tests__/matchEngine.test.ts \
      src/lib/dat-parser/fuzz/fuzz.test.ts
fi

printf '\n\033[1m=== SUMMARY ===\033[0m\n'
printf '  %s\n' "${RESULTS[@]}"

if [ "${#FAILED[@]}" -eq 0 ]; then
  if [ "$QUICK" -eq 0 ]; then
    printf '\n\033[32mVERIFY GREEN\033[0m — 4/4 gates pass. Evidence: %s @ %s\n' \
      "$(git rev-parse --short HEAD 2>/dev/null)" "$(date -u +%Y-%m-%d)"
  else
    printf '\n\033[33mVERIFY GREEN (--quick)\033[0m — types+unit only. NOT a done signal.\n'
  fi
  exit 0
fi

printf '\n\033[31mVERIFY RED\033[0m — failed: %s\n' "${FAILED[*]}"
exit 1