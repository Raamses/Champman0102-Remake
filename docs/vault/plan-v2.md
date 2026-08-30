# Championship Manager 01/02 Remake — Plan v2

**Date:** 2026-08-30
**Authors:** AmosBot (Pi) + Hermes (Mac), incorporating all 20 action items from 4 review passes
**Status:** Ready for execution
**Repo:** https://github.com/Raamses/Champman0102-Remake

---

## What Changed from v1

| # | v1 | v2 | Source |
|---|----|----|--------|
| 1 | Rust→WASM .dat parser | TypeScript parser using DataView/ArrayBuffer. Python offline converter for .dat→JSON. WASM deferred. | Counsel (both) |
| 2 | Zustand + IndexedDB | SQLite-WASM + OPFS persistence | Counsel (both) |
| 3 | 4-week MVP | 7-8 week MVP (Phase 0 + Phase 1) | Counsel (both) |
| 4 | Bundled .dat support | BYOD: user supplies own .dat file. Ship with minimal sample dataset. | Counsel (both) |
| 5 | P2P WebRTC multiplayer | Async play-by-mail. Host sims when all peers submit "Continue". Matches original CM01/02 network game. | Gemini counsel |
| 6 | Flat goal probability | Chance creation → conversion model. Tactics wired to engine. Stamina decay. | AmosBot review B2 |
| 7 | FM attribute names | CM01/02 original names (Shooting, Set Pieces, Intelligence, Dirtyness, BigOccasion, etc.) | AmosBot review D4 |
| 8 | Single index.dat | Multi-file: index.dat, club.dat, nat_club.dat, nation.dat, staff.dat + player_setup.cfg | AmosBot review B1, Nemotron |
| 9 | No testing strategy | Unit tests for match engine, transfer AI, competition. Playwright E2E. | AmosBot review C1 |
| 10 | No save migration | Versioned schema with migration functions | Nemotron counsel |
| 11 | No Phase 0 | Phase 0: .dat format spike (1 week) | AmosBot review C2 |
| 12 | Multiplayer in Phase 5 | Single-player ship first. Multiplayer deferred post-v1. | AmosBot review B3 |

---

## Architecture (v2)

```
┌──────────────────────────────────────────────────────────┐
│                    PWA (React + Vite)                     │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────┐  │
│  │  UI Layer │  │  State   │  │  Match    │  │  Save  │  │
│  │  (React)  │  │(Zustand  │  │  Engine   │  │ System │  │
│  │           │  │  thin)   │  │  (TS)     │  │        │  │
│  └─────────┘  └──────────┘  └───────────┘  └────────┘  │
│       │              │              │            │        │
│  ┌──────────────────────────────────────────────────────┐│
│  │              Game Core (TypeScript)                   ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   ││
│  │  │ SQLite   │  │Competition│  │  Transfer Market │   ││
│  │  │ WASM     │  │  System   │  │                  │   ││
│  │  │ (OPFS)   │  │           │  │                  │   ││
│  │  └──────────┘  └──────────┘  └──────────────────┘   ││
│  └──────────────────────────────────────────────────────┘│
│       │                                                  │
│  ┌──────────────────────────────────────────────────────┐│
│  │         .dat Parser (TypeScript)                      ││
│  │  Reads original CM01/02 binary files at runtime       ││
│  │  Using DataView + ArrayBuffer (no WASM needed)        ││
│  └──────────────────────────────────────────────────────┘│
│       │                                                  │
│  ┌──────────────────────────────────────────────────────┐│
│  │              Storage Layer                            ││
│  │  SQLite-WASM (OPFS) — local saves, game DB           ││
│  │  Firebase (post-v1) — multiplayer sync               ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

### Key Decisions (v2)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Platform | PWA | No app store, works everywhere, offline, installable |
| Match presentation | Text commentary (2D) | Fast, mobile-friendly, authentic |
| Database source | Original .dat files (BYOD) | Community updates work. Legal: parser is OK, distributing data is not |
| Parser | TypeScript (DataView) | 50MB binary parses in ms in browser. No WASM toolchain friction |
| State management | Zustand (UI state only) | Thin layer over SQLite-WASM. Game data lives in SQL |
| Storage (local) | SQLite-WASM + OPFS | Relational queries on 50K+ players. OPFS more durable than IndexedDB |
| Storage (multiplayer) | Deferred | Single-player first. Post-v1: async play-by-mail |
| Match engine | Chance creation → conversion | Realistic scorelines. Tactics matter. Stamina matters |
| Testing | Vitest (unit) + Playwright (E2E) | Deterministic seeds for match engine tests |

---

## Data Model (corrected to CM01/02 format)

### Player (matches actual CM2Player binary struct)

```typescript
interface Player {
  id: string;
  firstName: string;        // 30-byte fixed field
  secondName: string;       // 35-byte fixed field
  nationality: string;      // 35-byte fixed field
  caps: number;             // byte
  goals: number;            // byte (international goals)
  clubName: string;         // 35-byte fixed field (resolved to clubId)

  // Position flags (byte 0-255, NOT computed ratings)
  positions: {
    gk: number;
    sweeper: number;
    defence: number;
    anchor: number;
    midfield: number;
    support: number;
    attack: number;
    rightSided: number;
    leftSided: number;
    centralSided: number;
  };

  // Ability (encoded: raw short + 128)
  currentAbility: number;   // 0-200 (decoded)
  potentialAbility: number; // 0-200 (decoded)
  reputation: number;       // 0-200 (short)

  // Attributes (CM01/02 original names, byte 0-20)
  attributes: {
    shooting: number;        // NOT "finishing"
    setPieces: number;       // NOT "freeKicks"
    intelligence: number;    // NOT "decisions"
    dirtyness: number;       // NOT "aggression"
    bigOccasion: number;     // NOT "composure"
    flair: number;           // = "creativity"
    heading: number;
    pace: number;
    stamina: number;
    strength: number;
    tackling: number;
    passing: number;
    technique: number;
    offTheBall: number;
    aggression: number;      // separate from dirtyness in some versions
    bravery: number;
    consistency: number;
    dirtynessHidden: number;
    adaptability: number;    // hidden
    ambition: number;        // hidden
    controversy: number;     // hidden
    loyalty: number;         // hidden
    pressure: number;        // hidden
    professionalism: number; // hidden
    temperament: number;     // hidden
    sportsmanship: number;   // hidden
    versatility: number;     // hidden
    injuryProneness: number; // hidden
    importantMatches: number;// hidden
  };

  // Computed from position flags + attributes
  positionRatings: {
    GK: number;
    SW: number;   // sweeper
    DC: number;
    DL: number;
    DR: number;
    DMC: number;
    MC: number;
    ML: number;
    MR: number;
    AMC: number;
    AML: number;
    AMR: number;
    ST: number;
  };

  // Career state (runtime, not from .dat)
  condition: number;         // 0-100
  fitness: number;           // 0-100
  morale: number;            // 0-100 (mapped to tiers)
  injured: boolean;
  injuryDays: number;
  suspended: boolean;
  suspensionMatches: number;

  // Contract (from .dat or generated)
  contract: {
    wage: number;
    startDate: number;
    endDate: number;
    releaseClause: number | null;
    squadStatus: 'key' | 'first_team' | 'rotation' | 'squad' | 'youth' | 'listed';
  };

  transferListed: boolean;
  askingPrice: number;

  // History (accumulated at runtime)
  careerHistory: SeasonStat[];
}

interface SeasonStat {
  season: number;
  clubId: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  averageRating: number;
}
```

### Club (matches CM2Team binary struct)

```typescript
interface Club {
  id: string;
  name: string;             // 35-byte fixed field
  shortName: string;
  nation: string;
  league: string;
  reputation: number;       // 0-20
  finances: {
    balance: number;        // int32
    wageBudget: number;
    transferBudget: number;
  };
  stadium: {
    name: string;
    capacity: number;       // int32
    seating: number;        // int32
  };
  facilities: number;
  colors: { primary: string; secondary: string; };
  squad: string[];          // player IDs
  division: string;         // 15-byte field
  formation: string;        // 10-byte field
  style: string;
}
```

### Save Schema (versioned for migrations)

```typescript
interface SaveFile {
  version: number;          // Schema version, starts at 1
  createdAt: number;
  updatedAt: number;
  manager: {
    name: string;
    clubId: string;
    reputation: number;
    ability: number;
  };
  season: {
    year: number;
    state: 'pre_season' | 'in_season' | 'post_season';
    currentDate: number;    // in-game timestamp
  };
  // Game DB stored as SQLite-WASM OPFS blob
  // Save file references it + stores meta
}
```

---

## Match Engine (v2 — Chance Creation Model)

### Design

Replaces v1's flat probability with a two-phase model:
1. **Chance creation**: each minute, teams accumulate "chance points" from midfield attributes, tactic, and home advantage
2. **Chance conversion**: when points cross a threshold, a chance is created and resolved (goal/miss/save)

### Algorithm

```
PRE-MATCH
  - Load squads, determine starting XI from tactic + fitness + condition
  - Calculate base team strength from starting XI attributes
  - Apply tactic modifiers (mentality, tempo, pressing, width)
  - Apply home advantage (+10% chance creation)
  - Generate match seed (deterministic for multiplayer)

MATCH (90 min + stoppage)
  For each minute:
    1. CHANCE CREATION
       homePoints = calcChancePoints(homeTeam, tactic, minute)
       awayPoints = calcChancePoints(awayTeam, tactic, minute)
       Accumulate points for each team

       If accumulatedPoints >= threshold:
         Create chance event
         Reset accumulator
         Proceed to conversion

    2. CHANCE CONVERSION
       Determine chance type (shot/header/set piece/through ball)
       Weight by attacker attributes (shooting, heading, technique, offTheBall)
       Determine defender response (tackling, positioning, anticipation)
       Determine keeper response (handling, reflexes, oneOnOnes)
       Roll conversion: goal / saved / missed / blocked

    3. STAMINA DECAY
       Each player loses stamina per minute based on:
         - Base rate × tempo multiplier
         - Pressing intensity multiplier
         - Player's naturalFitness attribute (higher = slower decay)
       Low stamina reduces effective attributes (below 50% stamina = -20% all attrs)

    4. CARDS/FOULS/INJURIES
       Foul probability weighted by aggression + dirtyness + referee strictness
       Card probability from foul severity + player's dirtyness
       Injury probability from injuryProneness + tackle severity

    5. SUBSTITUTIONS (AI manager)
       At 60-80 min: replace tired/injured players with subs
       Weight by stamina, scoreline, tactic mentality

POST-MATCH
  - Calculate player ratings (1-10) from events + position + minutes
  - Apply condition/fitness changes
  - Update morale based on result + expectations
  - Check injuries (extend if severe)
  - Return MatchResult with full event list
```

### Key Functions

```typescript
// Chance points per minute — based on midfield + tactic + home advantage
function calcChancePoints(team: TeamSheet, tactic: Tactic, minute: number): number {
  const midfield = avgAttribute(team.midfielders, ['passing', 'technique', 'flair', 'offTheBall']);
  const support = avgAttribute(team.attackers, ['offTheBall', 'passing']);

  // Tactic modifiers
  const mentalityMod = { defensive: 0.7, balanced: 1.0, attacking: 1.3, ultra_attacking: 1.5 };
  const tempoMod = { slow: 0.9, normal: 1.0, fast: 1.15 };
  const widthMod = { narrow: 0.9, normal: 1.0, wide: 1.1 };

  // Late game fatigue reduces creation
  const fatigueMod = 1.0 - (minute / 120) * 0.15;

  return (midfield * 0.6 + support * 0.4)
    * mentalityMod[tactic.mentality]
    * tempoMod[tactic.tempo]
    * widthMod[tactic.width]
    * fatigueMod;
}

// Chance threshold — ~12 chances per team per match average
const CHANCE_THRESHOLD = 8.0;

// Conversion — attacker vs defender + keeper
function resolveChance(attacker: Player, defenders: Player[], keeper: Player): ChanceResult {
  const attackStrength = weightedAvg(attacker, {
    shooting: 0.35, technique: 0.20, bigOccasion: 0.20, offTheBall: 0.15, composure: 0.10
  });
  const defenseStrength = avgAttribute(defenders, ['tackling', 'positioning', 'heading']);
  const keeperStrength = weightedAvg(keeper, {
    handling: 0.35, reflexes: 0.35, oneOnOnes: 0.30
  });

  const conversionRoll = attackStrength / (attackStrength + defenseStrength * 0.4 + keeperStrength * 0.6);
  // conversionRoll ~0.4-0.7 typically; multiply by randomness
  const goalChance = conversionRoll * (0.8 + Math.random() * 0.4);

  if (goalChance > 0.55) return 'goal';
  if (goalChance > 0.35) return 'saved';
  return 'missed';
}
```

### Tactics → Engine Wiring

| Tactic Setting | Engine Effect |
|----------------|---------------|
| Mentality (defensive→ultra) | Chance creation multiplier 0.7→1.5. Also affects defense: defensive = +20% defense strength |
| Tempo (slow→fast) | Chance creation 0.9→1.15. Stamina decay 0.85→1.3 |
| Pressing (low→extreme) | Chance creation 0.9→1.2. Stamina decay 1.0→1.5. Foul probability 0.8→1.5 |
| Passing (short→long) | Chance type distribution: short = more through balls, long = more headers |
| Width (narrow→wide) | Chance creation 0.9→1.1. Cross frequency |
| Formation | Determines which attributes matter (4-4-2 = balanced midfield, 3-4-3 = more attackers, etc.) |
| Player roles (defend/support/attack) | Individual chance contribution weights |
| Creative license (disciplined→expressive) | Flair attribute weight 0.5→1.5 |

---

## Phase Breakdown (v2 — 7-8 week MVP)

### Phase 0: .dat Format Spike (1 week)
**Goal:** Prove we can read the binary format. Produce a working parser that dumps club + player names.

| Card | Scope | Who |
|------|-------|-----|
| CM-001 | Clone CM0102Patcher, analyze C# structs, document exact byte layout for all entity types | Hermes |
| CM-002 | Scrape offsets thread (764 posts) from champman0102.net, compile into parser spec | Hermes |
| CM-003 | Write TypeScript .dat parser — reads index.dat, dumps all club names + player names | Hermes |
| CM-004 | Extend parser to read club.dat, nat_club.dat, nation.dat, staff.dat | Hermes |
| CM-005 | Merge player_setup.cfg data (starting injuries/loans/retirements) | Hermes |
| CM-006 | Parser tests: verify against known data (e.g., Arsenal's squad in 2001) | AmosBot (review) |

**Deliverable:** `src/lib/datParser.ts` that reads any CM01/02 .dat file and returns typed data. Documented byte layout in `docs/vault/research/dat-format-spec.md`.

### Phase 1: Foundation (3-4 weeks)
**Goal:** Single playable match. Pick two teams, simulate, see text commentary + result.

| Card | Scope | Who |
|------|-------|-----|
| CM-010 | Project scaffold: Vite + React + TS + Tailwind. Remove existing Firebase (defer to post-v1) | Hermes |
| CM-011 | SQLite-WASM + OPFS integration. Database schema for players, clubs, leagues, nations | Hermes |
| CM-012 | .dat → SQLite-WASM import pipeline. Load parsed data into SQL tables | Hermes |
| CM-013 | Database viewer UI: browse clubs, click club → see squad, click player → see attributes | Hermes |
| CM-014 | Match engine core: chance creation model, conversion, stamina decay, events | Hermes |
| CM-015 | Tactics system: formations, mentality, tempo, pressing, width, player roles | Hermes |
| CM-016 | Wire tactics to match engine (all modifiers from table above) | Hermes |
| CM-017 | Text commentary renderer: events → readable text with minute markers | Hermes |
| CM-018 | Match UI: team selection, tactic setup, "Play Match" button, live commentary feed | Hermes |
| CM-019 | Match engine unit tests: deterministic seeds, edge cases (0-0, red cards, extra time, penalties) | Hermes |
| CM-020 | Save/load system: SQLite-WASM OPFS persistence, versioned schema with migration support | Hermes |
| CM-021 | Review + integration testing for Phase 1 | AmosBot |

**Deliverable:** PWA that loads a .dat file, shows a database viewer, lets you pick two teams and play a match with text commentary. Can save/load state.

### Phase 2: Career Mode (2-3 weeks)
**Goal:** Full single-player career. Manage a club through a season.

| Card | Scope | Who |
|------|-------|-----|
| CM-030 | Season simulation: full league round-robin, fixture generation, league table | Hermes |
| CM-031 | Squad management UI: tactic builder, starting XI selection, player roles | Hermes |
| CM-032 | Transfer market: player valuation, AI bidding, buy/sell logic, transfer list | Hermes |
| CM-033 | Transfer AI tests: valuation formulas, AI bidding behavior | Hermes |
| CM-034 | Player development: aging, attribute progression, regen generation | Hermes |
| CM-035 | Competition system: league table computation, tiebreakers, promotion/relegation | Hermes |
| CM-036 | Competition tests: table computation, tiebreakers, promotion/relegation scenarios | Hermes |
| CM-037 | Calendar/scheduling: match days, rest days, transfer windows | Hermes |
| CM-038 | News/inbox system: match reports, transfer offers, board messages | Hermes |
| CM-039 | Career save/load: persist full season state, continue from save | Hermes |
| CM-040 | Review + integration testing for Phase 2 | AmosBot |

**Deliverable:** Full career mode. Manage any club, play seasons, buy/sell players, get promoted/relegated.

### Phase 3: Competitions (2 weeks)
**Goal:** Cups, continental competitions, international management.

| Card | Scope | Who |
|------|-------|-----|
| CM-050 | Domestic cups: knockout format, random draw, replays, extra time + penalties | Hermes |
| CM-051 | Champions League / Europa: group stage → knockout, two-legged ties, away goals | Hermes |
| CM-052 | World Cup: qualification, group stage, knockout, international squad selection | Hermes |
| CM-053 | International job system: apply for jobs → pick squad → friendlies → qualifiers | Hermes |
| CM-054 | End of season: awards, retirement, regen generation, contract renewals | Hermes |
| CM-055 | Competition integration tests | Hermes |
| CM-056 | Review + integration testing for Phase 3 | AmosBot |

**Deliverable:** Full competition structure matching CM01/02.

### Phase 4: Polish (1-2 weeks)
**Goal:** PWA-ready, mobile-friendly, performant.

| Card | Scope | Who |
|------|-------|-----|
| CM-060 | PWA manifest + service worker (Workbox), offline support | Hermes |
| CM-061 | Mobile-responsive UI: touch-friendly, responsive layouts | Hermes |
| CM-062 | Quick sim mode: skip commentary, show result + key events | Hermes |
| CM-063 | Performance optimization: large DB queries, match sim speed | Hermes |
| CM-064 | Playwright E2E tests: load .dat, play match, save career | Hermes |
| CM-065 | Bug fixes + final polish | Hermes |
| CM-066 | Final review + ship v1 | AmosBot + Ram |

**Deliverable:** Shippable v1 PWA. Single-player CM01/02 remake with .dat file support.

### Post-v1 (deferred)
- Multiplayer (async play-by-mail with Firebase Cloud Functions)
- Tauri desktop wrapper
- Tactic sharing / save file sharing
- Mod support
- Database update tool

---

## Legal Model

- **BYOD (Bring Your Own Data):** The PWA ships with a minimal public-domain sample dataset (fictional players/clubs). Users load their own legally-acquired .dat files.
- **No bundled rosters:** No in-app downloader for .dat files. No distribution of original or community-updated data.
- **Parser is legal:** Reverse-engineering for interoperability is protected.
- **Community .dat packs:** Users obtain these themselves from champman0102.net community. We don't host or link.

---

## Testing Strategy

| Layer | Tool | What |
|-------|------|------|
| Match engine | Vitest | Deterministic seeds, attribute effects, edge cases |
| Transfer AI | Vitest | Valuation formulas, bidding logic |
| Competition | Vitest | League tables, tiebreakers, cup draws, promotion/relegation |
| .dat parser | Vitest | Parse known files, verify output matches expected data |
| E2E | Playwright | Load .dat, browse DB, play match, save career |
| Save migration | Vitest | v1→v2 schema migration, backward compat |

---

## File Structure (v2)

```
Champman0102-Remake/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types.ts                 # Corrected to CM01/02 format
│   ├── constants.ts
│   ├── lib/
│   │   ├── datParser.ts         # TypeScript .dat parser (DataView)
│   │   ├── sqlite.ts            # SQLite-WASM + OPFS integration
│   │   ├── dbSchema.ts          # SQL schema + migrations
│   │   ├── dbImport.ts          # .dat → SQLite pipeline
│   │   └── utils.ts
│   ├── engine/
│   │   ├── matchEngine.ts       # Chance creation + conversion
│   │   ├── tactics.ts           # Tactic system + modifiers
│   │   ├── playerRatings.ts     # Post-match rating calculation
│   │   ├── stamina.ts           # Stamina decay model
│   │   └── rng.ts               # Seeded PRNG (deterministic)
│   ├── game/
│   │   ├── competition.ts       # League + cup simulation
│   │   ├── transfers.ts         # Transfer market + AI
│   │   ├── development.ts       # Player aging + regens
│   │   ├── calendar.ts          # Season scheduling
│   │   └── saveSystem.ts        # Save/load + migration
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── DatabaseViewer.tsx   # Browse clubs/players
│   │   ├── MatchView.tsx        # Team select + commentary
│   │   ├── SquadView.tsx        # Squad management
│   │   ├── TacticBuilder.tsx    # Formation + instructions
│   │   ├── TransferMarket.tsx
│   │   ├── LeagueTable.tsx
│   │   ├── Fixtures.tsx
│   │   └── Inbox.tsx            # News/messages
│   ├── store/
│   │   └── gameStore.ts         # Zustand (UI state only)
│   └── tests/
│       ├── matchEngine.test.ts
│       ├── transfers.test.ts
│       ├── competition.test.ts
│       ├── datParser.test.ts
│       └── saveMigration.test.ts
├── e2e/
│   └── play.spec.ts
├── docs/
│   └── vault/
│       ├── plan-v2.md            # This file
│       ├── reviews/
│       ├── research/
│       │   └── dat-format-spec.md
│       └── architecture/
├── public/
│   └── manifest.json
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

---

## Orchestration Model

- **AmosBot (Pi):** Orchestrator. Creates cards, assigns to Hermes, reviews completed work, runs tests, manages the vault, reports to Ram.
- **Hermes (Mac):** Executor. Picks up cards, implements code, pushes to branches, reports completion via mailbox + HANDOFF.
- **Ram:** Final approval. Reviews before merge to main, reviews before ship.
- **Communication:** Mailbox for real-time, HANDOFF for durable record. All reviews go to HANDOFF.

---

## Action Items Checklist (all 20 from reviews)

| # | Priority | Action | Phase | Status |
|---|----------|--------|-------|--------|
| 1 | CRITICAL | Fix .dat parser to use actual CM2Player struct (CM01/02 attr names, byte flags, ability encoding) | Phase 0 | Pending |
| 2 | CRITICAL | Redesign match engine: chance creation + conversion, not flat probability | Phase 1 | Pending |
| 3 | CRITICAL | Fix multiplayer: defer to post-v1, single-player first | Post-v1 | Deferred |
| 4 | IMPORTANT | Add testing strategy (Vitest + Playwright) | All phases | Pending |
| 5 | IMPORTANT | Revise timelines: 7-8 weeks not 4 | All phases | Done (this doc) |
| 6 | IMPORTANT | Reconcile existing repo code with plan | Phase 1 | Pending (CM-010) |
| 7 | IMPORTANT | Estimate save size correctly (10-15MB, not 100MB) | Phase 1 | Done |
| 8 | IMPORTANT | Use CM01/02 attribute names, not FM names | Phase 0 | Done (data model above) |
| 9 | NICE | Add quick sim mode | Phase 4 | Pending (CM-062) |
| 10 | NICE | Add regens (newgen generation) | Phase 3 | Pending (CM-054) |
| 11 | NICE | Add holiday mode for multiplayer | Post-v1 | Deferred |
| 12 | NICE | Consider deterministic match seed | Phase 1 | Done (seeded PRNG in design) |
| 13 | CRITICAL | BYOD: ship with sample dataset, no bundled rosters | All phases | Done (legal model above) |
| 14 | CRITICAL | MVP timeline 7-8 weeks | All phases | Done (this doc) |
| 15 | IMPORTANT | SQLite-WASM + OPFS for storage | Phase 1 | Pending (CM-011) |
| 16 | IMPORTANT | Skip Rust→WASM, use TS parser | Phase 0 | Done (this doc) |
| 17 | IMPORTANT | Document P2P limitation, async play-by-mail | Post-v1 | Deferred |
| 18 | IMPORTANT | Save migration strategy — versioned schema | Phase 1 | Pending (CM-020) |
| 19 | NICE | Merge player_setup.cfg with .dat data | Phase 0 | Pending (CM-005) |
| 20 | NICE | International job system in roadmap | Phase 3 | Pending (CM-053) |