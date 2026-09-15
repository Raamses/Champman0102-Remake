# CM-017: Match commentary system

## Objective
Generate live text commentary from engine events (the CM01/02 feel: "GOAL! ...", chances, cards, subs). Consumes MatchEvent stream from CM-014/016.

## Scope
- CommentaryService: event stream -> templated commentary lines with variety (seeded, deterministic per seed)
- Chance-type modeling (cross/through-ball/header/long-shot/one-on-one) driven by formation crossFactor/throughBallBias/headerBias (currently dead fields — activates with this card)
- Set-piece commentary hooks (corners, free kicks) using lib/tactics/setpieces.ts
- Substitution events (lib/tactics/substitutions.ts wired into engine here or CM-018)
- i18n-ready strings (Hebrew + English)

## Acceptance
- Every MatchEvent type produces commentary; no event dropped
- Same seed => same commentary string (determinism)
- Unit tests + golden fixtures; existing suite green

## Assignee: Pi builder (claude -p). Depends: CM-014, CM-016.
