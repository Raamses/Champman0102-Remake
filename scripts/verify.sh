#!/usr/bin/env bash
# ChampMan 01/02 Remake — the 4 mandatory gates (Ram's ruling).
# ALL four must pass. Exit 0 == green == "done". Prose "done" is invalid.
#
#   1 types        tsc -b
#   2 unit         vitest run
#   3 perf         vitest run -c vitest.perf.config.ts   (CM-T11 budgets)
#   4 determinism  seeded suites run twice; normalized results must be byte-identical; both runs all-green
#
# Usage: scripts/verify.sh [--quick]   (--quick skips perf; NOT a done signal)

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

run_determinism_check() {
  (
  local suites="src/engine/__tests__/golden.match.test.ts src/engine/__tests__/matchEngine.test.ts src/lib/dat-parser/fuzz/fuzz.test.ts"
  local TMP
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT

  npx vitest run $suites --reporter=json 2> "$TMP/A.stderr.log" > "$TMP/A.raw.json"
  if [ $? -ne 0 ]; then
    tail -n 10 "$TMP/A.stderr.log"
    return 1
  fi

  npx vitest run $suites --reporter=json 2> "$TMP/B.stderr.log" > "$TMP/B.raw.json"
  if [ $? -ne 0 ]; then
    tail -n 10 "$TMP/B.stderr.log"
    return 1
  fi

  python3 - "$TMP" << 'EOF'
import json, sys

def normalize(prefix, letter):
    try:
        with open(f"{prefix}/{letter}.raw.json") as f:
            data = json.load(f)
    except Exception:
        sys.exit(1)
        
    num_total = data.get("numTotalTests", 0)
    num_failed = data.get("numFailedTests", 0)
    
    if not data or num_total == 0 or num_failed != 0:
        sys.exit(1)
        
    assertions = []
    for tr in data.get("testResults", []):
        for ar in tr.get("assertionResults", []):
            assertions.append(f"{ar.get('status', 'unknown')}::{ar.get('fullName', '')}")
    assertions.sort()
    
    canon = {
        "numTotalTests": num_total,
        "numPassedTests": data.get("numPassedTests", 0),
        "numFailedTests": num_failed,
        "numPendingTests": data.get("numPendingTests", 0),
        "assertions": assertions
    }
    
    with open(f"{prefix}/{letter}.norm.json", 'w') as f:
        json.dump(canon, f, sort_keys=True, separators=(',', ':'))
        f.write('\n')

prefix = sys.argv[1]
normalize(prefix, 'A')
normalize(prefix, 'B')
EOF
  if [ $? -ne 0 ]; then
    return 1
  fi

  if ! cmp -s "$TMP/A.norm.json" "$TMP/B.norm.json"; then
    diff "$TMP/A.norm.json" "$TMP/B.norm.json" | head -n 5
    return 1
  fi

  local passed total
  passed=$(grep -o '"numPassedTests":[0-9]*' "$TMP/A.norm.json" | cut -d':' -f2 | head -n1)
  total=$(grep -o '"numTotalTests":[0-9]*' "$TMP/A.norm.json" | cut -d':' -f2 | head -n1)
  printf "determinism: run A/B byte-identical, %s/%s passed.\n" "$passed" "$total"
  )
}

echo "ChampMan verify — $(date -u +%Y-%m-%dT%H:%M:%SZ) — commit $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

if ! python3 scripts/board_state.py >/dev/null 2>&1 || ! git diff --exit-code docs/vault/board-state.json >/dev/null; then
  printf '\n\033[31m[FAIL]\033[0m PRECONDITION: board-state.json generator drift or error. Never hand-edit the mirror!\n'
  exit 1
fi

run_gate types        npx tsc -b
run_gate unit         npx vitest run
if [ "$QUICK" -eq 0 ]; then
  run_gate perf         npx vitest run -c vitest.perf.config.ts
  run_gate determinism  run_determinism_check
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
