# CM-016: Wire Tactics to Match Engine

## Objective
Connect all five tactic dimensions (mentality, tempo, pressing, passing, width) throughout the match engine so tactics measurably affect both offense AND defense. Replace the tactics scaffold placeholder with a real module.

## Current State
- `src/engine/matchEngine.ts`: 222 lines, two-phase model implemented
  - `calculateChancePoints()`: exists, calls incomplete `tacticChanceModifier()`
  - `updateStamina()`: conditional (fast?1.5 : pressing?1.4 : 1.0) — tempo and pressing don't stack
  - Conversion: single `goalProb` + static save threshold (0.35 above goalProb)
  - No opponent-tactic defensive pressure, no formation impact, no substitutions, no set pieces
- `src/engine/types.ts`: Tactic interface defined with all 5 dimensions ✓
- `src/lib/tactics/`: only `placeholder.txt` — empty

## What Needs Wiring

### Critical Changes

**A. Formation Impact on Stat Pools** (in `calculateChancePoints`)
- Formation determines which positional groups contribute more (MID for wide formations, DEF for narrow)
- Each formation maps to relative position weights
- Wide = midfielders produce more CP from passing+flair; narrow = attackers get more touches
- **Acceptance**: 4-5-1 produces fewer chances than 4-3-3 at same player ratings (verified via tests)

**B. Full Multi-Plane Tactic Modifier** (replace `tacticChanceModifier()`)
Currently: `mentalityMod * widthMod * passingMod` — missing pressing and tempo entirely.
New formula combines ALL five dimensions:
```
attackFactor = mentality_attacking(1.3) OR balanced(1.0) OR defensive(0.85)
speedFactor = tempo_fast(1.15) OR normal(1.0) OR slow(0.9)
widthFactor = width_wide(1.1) OR normal(1.0) OR narrow(0.95)
passingFactor = passing_long(1.2) OR mixed(1.0) OR short(0.9)
pressingFactor = high(1.1) OR normal(1.0) OR low(0.9)
finalAttack = base * attackFactor * speedFactor * widthFactor * passingFactor * pressingFactor
```
Defensive side: opponent's defensive mentality reduces our conversion probability.

**C. Opponent Defensive Pressure**
Opponent mentality/pressing actively reduces our chance creation AND conversion:
- Defensive mentality: -15% opponent conversion probability
- High pressing: -10% opponent chance creation
- Both stack (multiplicative)
**Acceptance**: Same attacker vs defensive opponent yields <10% goals vs vs attacking opponent ~18%

**D. Stamina Decay Combo** (fix `updateStamina()`)
Current: tempo fast?1.5 else pressing?1.4 else 1.0
Fix: tempo and pressing combine multiplicatively
```
intensity = (tempo==='fast'?1.3:1.0) * (pressing==='high'?1.25:1.0)
decay = 0.5 * intensity * naturalFitnessFactor
```
Ultra-attacking adds additional +0.2 intensity cost
**Acceptance**: ultra-attacking+fast tempo player at minute 70 has ~40% less stamina vs balanced+normal

**E. Improved Conversion Model**
Replace flat `goalProb + 0.35 save cutoff` with multi-variable resolution:
```
baseConversion = shooter.shooting * 0.35 + technique * 0.20 + bigOccasion * 0.20 + offTheBall * 0.15
defensePenalty = avg(defenders.tackling + positioning) * 0.25
keeperPenalty = keeper.handling*0.35 + reflexes*0.35 + oneOnOnes*0.30
convertedRoll = baseConversion / (baseConversion + defensePenalty + keeperPenalty)
roll = convertedRoll * rng.range(0.7, 1.3)
```
Outcome: goal if roll > 0.55, save if > 0.30, miss otherwise.
Each shot type weighted differently (header bonus heading, free kick uses freeKicks attribute).

### Secondary Changes (if time)

**F. Basic Substitution Logic**
- Auto-sub when stamina < 25% or injured
- Context-aware: ahead 1-0 at 70min → defensive sub; trailing 0-1 at 75min → fresh attacker
- Subs enter at reduced stamina (85%)

**G. Set Pieces**
- Corner kicks: 3-4 corners per match (randomized + post-goal corner)
- Free kicks triggered by fouls near penalty area
- Resolution uses player freeKick/corner/crossing attributes

## Files Changed
1. `src/lib/tactics/index.ts` — replace placeholder with full implementation
2. `src/lib/tactics/formations.ts` — formation definitions + position weights  
3. `src/engine/matchEngine.ts` — integrate tactic wiring (chance creation, conversion, stamina, optional subs/set pieces)
4. `src/engine/__tests__/match-engine.test.ts` — new tests proving each tactic dimension works

## Acceptance Criteria (must pass)
1. ✅ All 5 tactic dimensions measurably influence match outcomes (verified via statistical tests)
2. ✅ Formation changes team composition and stat contributions
3. ✅ Opponent tactics reduce your effectiveness (not just your own tactics help you)
4. ✅ Stamina decay correctly combines tempo + pressing multiplicatively
5. ✅ Conversion model uses shooter/defender/keeper attributes proportionally
6. ✅ Existing match engine tests still pass (zero regressions)
7. ✅ All new tests included and passing before PR merge
8. ✅ CI green

## Approach
1. Implement tactics module (formations + complete modifier functions)
2. Extend matchEngine.ts to use all tactic data comprehensively
3. Write tests proving each dimension works
4. Run vitest, fix any issues
5. Push branch, open PR, submit for Claude review

## Dependencies
- CM-014 match engine exists ✓
- CM-015 scaffold branch exists ✓ (will supersede with real implementation)
- PR-based workflow: branch → PR → Claude review → squash merge ✓
