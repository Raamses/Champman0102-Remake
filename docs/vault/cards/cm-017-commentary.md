# CM-017: Match commentary system

## Objective
Generate live text commentary from engine events (the CM01/02 feel). Consumes the MatchEvent stream from CM-014/016.

## Scope
- CommentaryService: event stream -> templated commentary with variety (seeded, deterministic per seed)
- **Chance-type modeling (cross / through-ball / header / long-shot / one-on-one) — ACTIVATES all three formation fields:** after CM-016b lands, crossFactor, throughBallBias AND headerBias are all fully dead (CM-016b's blend references only midfieldMult/attackMult). CM-017 activates all three into the per-chance-type probability model — no aggregate-removal or double-application step needed (CM-016b already replaced the aggregate usage with the unrelated blend).
- **Formation identity closes here:** "3-4-3 outscores 4-4-2 at equal player ratings" is an acceptance criterion of THIS card via chance-type distribution (inherited from CM-016b).
- Set-piece commentary hooks (corners, free kicks) using lib/tactics/setpieces.ts
- Substitution events (lib/tactics/substitutions.ts wired into the engine here or CM-018)
- i18n-ready strings (Hebrew + English)

## Acceptance
- Every MatchEvent type produces commentary; no event dropped
- Same seed => same commentary string (determinism)
- 3-4-3 > 4-4-2 at equal player ratings (identity, via chance types)
- Unit tests + golden fixtures; existing suite green

## Assignee: Pi builder (agy). Depends: CM-014, CM-016, CM-016b.
