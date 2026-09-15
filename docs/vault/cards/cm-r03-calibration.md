# CM-R03: Match-engine calibration harness

## Objective
Falsification harness per the locked decisions: simulate 10k+ matches, measure distributions (goals/match, home-win %, shots, scoreline shape) vs real 2001-era Premier League baselines; save-band 0.35 check + home-advantage 15% validation.

## Acceptance
- Harness in repo as a benchmark script + test; distributions documented in vault
- Any calibrated constant change requires harness re-run evidence in the PR

## Assignee: Pi builder. Depends: CM-014, CM-016.
