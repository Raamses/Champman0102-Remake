# Match Engine Design — Chance Creation + Conversion Model

**Status:** DRAFT — proposed by AmosBot, 2026-08-29
**Supersedes:** Plan v1 §4 (flat probability model)

## Why the Plan's Model Is Wrong

The plan uses `goalProbability(homeStrength, awayStrength)` per minute. This has five problems:

1. **Double real goal totals** — base 0.03/min per team = 5.4 goals/match (real: 2.7)
2. **Strength affects share, not volume** — total goals constant regardless of team quality gap
3. **No chance → goal pipeline** — "goal or no goal" per minute has no concept of chances created vs. converted
4. **Tactics not wired** — formations and mentality defined but don't affect simulation
5. **No stamina decay** — players perform identically in minute 1 and minute 90

## Proposed Model: Chance Creation + Conversion

### Per-Minute Loop

```
For each minute (1-90 + stoppage):
  1. CHANCE CREATION PHASE
     - Each team accumulates "chance points" (CP) based on:
       - Midfield creativity, passing, off-the-ball (weighted by tactic)
       - Tempo (faster = more CP but lower conversion)
       - Home advantage (+15% CP, not +10% — home advantage in football is significant)
       - Opponent pressing (high pressing reduces opponent CP)
       - Opponent defense quality (positioning, tackling reduce CP)
     - When CP crosses a threshold, a chance is created
     
  2. CHANCE RESOLUTION PHASE
     - Chance quality = attacker attributes (finishing/shooting, composure/big occasion)
       modified by: position, tactic duty, fatigue
     - Chance saved = goalkeeper (handling, reflexes, one-on-ones) + defense
     - Roll: chance_quality vs. (goalkeeper + defense) → goal, save, or miss
     
  3. AMBIENT EVENTS
     - Cards: probability weighted by aggression/dirtyness + referee strictness
     - Injuries: probability weighted by injury proneness + condition
     - Substitutions: manager AI at 60-80 min based on fitness/rating
     
  4. STATE UPDATE
     - Stamina decay: ~0.5-1% per minute per player, modified by naturalFitness
     - Condition: drops faster for high-intensity tactics (high pressing, fast tempo)
     - Morale: shifts based on scoreline + recent events
```

### Key Formulas (Draft)

```typescript
// Chance points per minute
function chancePoints(team: TeamState, opponent: TeamState): number {
  const midfield = avgAttr(team.activeMidfield, ['creativity', 'passing', 'offTheBall', 'intelligence']);
  const tacticBonus = tacticChanceModifier(team.tactic);  // attacking = +30%, defensive = -20%
  const tempoFactor = 0.8 + (team.tactic.tempo * 0.2);    // fast = 1.2, slow = 0.8
  const homeBonus = team.isHome ? 1.15 : 1.0;
  const pressReduction = opponentPressingReduction(opponent.tactic.pressing);
  
  const base = midfield * tacticBonus * tempoFactor * homeBonus;
  const reduced = base * (1 - pressReduction);
  return reduced;
}

// Chance threshold (lower = more chances)
const CHANCE_THRESHOLD = 20;  // tune to ~10-15 chances/match total

// Chance resolution
function resolveChance(attacker: Player, keeper: Player, defenders: Player[], tactic: Tactic): ChanceResult {
  const attackQuality = weightedAvg(attacker, {
    shooting: 3, bigOccasion: 2, technique: 1.5, composure: 1.5, pace: 1
  }) * tacticDutyBonus(tactic, attacker.role);  // attack duty = 1.2, defend = 0.8
  
  const defenseQuality = avgAttr(defenders, ['positioning', 'tackling', 'marking']);
  const keeperQuality = weightedAvg(keeper, { handling: 3, reflexes: 2.5, oneOnOnes: 2 });
  
  const goalProb = sigmoid(attackQuality - defenseQuality - keeperQuality * 0.7);
  const saveProb = sigmoid(keeperQuality - attackQuality * 0.6) * 0.7;
  
  const roll = Math.random();
  if (roll < goalProb) return { type: 'goal', xG: goalProb };
  if (roll < goalProb + saveProb) return { type: 'save' };
  return { type: 'miss' };
}
```

### Tactics → Engine Wiring

| Tactic Setting | Engine Effect |
|---------------|---------------|
| Formation | Determines how many players contribute to CP (midfielders) vs. defense (defenders) |
| Mentality (attacking) | +30% CP, -20% defense quality |
| Mentality (defensive) | -20% CP, +15% defense quality |
| Tempo (fast) | +20% CP, +50% stamina decay |
| Pressing (high) | -25% opponent CP, +40% stamina decay |
| Width (wide) | +10% CP from wide players, -10% central |
| Passing (long) | +20% CP but -15% conversion (lower quality chances) |

### Stamina Model

```typescript
// Per minute, per player
staminaDecay = base_decay * tactic_intensity * (1 / naturalFitness)
// base_decay: 0.5% at low intensity, 1.0% normal, 1.5% high
// When stamina < 30, attribute effectiveness drops by (30 - stamina)%
// At stamina < 15, injury risk increases 3x
```

### Player Rating (Revised)

The plan's rating formula only counts goals, assists, cards. A proper rating needs:

```typescript
function calculateRating(player, events, position, minutesPlayed): number {
  let rating = 6.0;
  
  // Attackers: goals, assists, shots on target, dribbles
  // Midfielders: pass completion, key passes, tackles won, interceptions
  // Defenders: tackles, interceptions, blocks, clearances, errors leading to shots
  // Goalkeepers: saves, goals conceded, clean sheet bonus, one-on-ones saved
  
  // Position-specific weighting applied to event contributions
  // Minutes played penalty if < 45 min
  // Clutch bonus: goals in last 10 min, equalizers, winners
  
  return clamp(rating, 1, 10);
}
```

### Tuning Targets

| Metric | Target | Source |
|--------|--------|--------|
| Average goals/match | 2.5-2.7 | Real football |
| Average shots/match | 12-14 | Real football |
| Average shots on target | 4-5 | Real football |
| Home win % | 45-48% | Historical |
| Draw % | 25-28% | Historical |
| Away win % | 28-30% | Historical |
| Average yellows/match | 3-4 | Real football |
| Average reds/match | 0.1-0.2 | Real football |

### Testing Strategy

1. **Deterministic seed tests**: Fix RNG seed, simulate 1000 matches between identical teams, verify scoreline distribution
2. **Attribute sensitivity**: Increase one player's finishing by 10, verify goal count increases
3. **Tactic sensitivity**: 4-4-2 defensive vs 3-4-3 attacking, verify CP and scoreline differ
4. **Stamina test**: Verify performance degrades over 90 minutes
5. **Edge cases**: 10 men (red card), injured keeper, empty squad