# CM-018: Match day UI

## Objective
Match screen wired to engine + commentary: live minute ticker, event feed, scoreline, stamina bars, tactics panel (change mentality/tempo/pressing/passing/width mid-match).

## Scope
- MatchDay page: uses MatchEngine in a Web Worker (CM-T16 protocol) or main thread behind a flag
- Zustand store slice for live match state; mobile-responsive per CM-061/F1 finding
- Tactics changes apply from next minute (engine accepts tactic mutations)
- Post-match summary -> persisted via CM-011 persistence layer

## Acceptance
- Full match plays in UI with commentary stream; zero console errors
- Tactic changes measurably affect the running match (test)
- Responsive 390px (no mobile nav regression)

## Assignee: Pi builder. Depends: CM-016b, CM-017.
