# CM-020: Save/load system

## Objective
Versioned save format over IndexedDB (CM-011): season state, squad, finances-lite, match history; export/import (already in persistence/exportImport.ts); migrations for schema bumps.

## Acceptance
- Save -> reload restores full career state; corruption -> typed error + recovery prompt
- Migration path v1->v2 tested (CM-T08A unblocked by this card)

## Assignee: Pi builder. Depends: CM-011 (merged).
