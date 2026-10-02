// CM-022d — initPitch idempotency on re-startMatch (the PR-#34 round-1 legacy).
//
// The finding (open since PR #34 round 1, rode unaddressed through all four
// review rounds): initPitch assigned `p.onPitch = p.onPitch ?? (i < 11)`, so
// it only ever initialized a VIRGIN squad. Re-running startMatch on a used
// TeamState froze the closing roster into the next run — red-carded players
// stayed off, subbed-off starters stayed benched, substitutes stayed starting
// — while startMatch otherwise resets everything it owns (minute, events,
// chance points, subCount, goals/shots) for exactly that reuse case.
//
// The fix: assign unconditionally by slot — the first 11 slots start on the
// pitch, the rest on the bench — so a re-run resets exactly as a virgin init
// would. Single-run behavior is unchanged for every existing caller (no
// production code ever supplied a pre-set onPitch differing from the slot
// default); see the PR description for the one affected test, reworked here.
//
// Residual state NOT owned by initPitch (documented + pinned in test 3):
// startMatch still does not reset stamina/minutesPlayed/yellowCards/redCard/
// isInjured, and the engine reads every one of them (substituteAI filters on
// stamina/minutesPlayed/redCard/isInjured; discipline reads yellowCards;
// injury skips flagged players). Those ride stale across a re-run and are the
// deferred full-squad-reset scope, deliberately out of this PR.
import { describe, expect, it } from 'vitest';
import { MatchEngine } from '../matchEngine';
import type { TeamState } from '../types';
import { createGoldenTeam, pinEvents } from './golden.helpers';

/** Every player's onPitch flag must equal its slot contract (first 11 on, rest off). */
function expectSlotContract(team: TeamState): void {
  expect(team.players.map(p => p.onPitch)).toEqual([
    ...Array.from({ length: Math.min(11, team.players.length) }, () => true),
    ...Array.from({ length: Math.max(0, team.players.length - 11) }, () => false),
  ]);
}

const onPitchIds = (team: TeamState): Set<number> =>
  new Set(team.players.filter(p => p.onPitch !== false).map(p => p.id));

describe('CM-022d: initPitch idempotency on re-startMatch', () => {
  it('re-startMatch after a partway match resets onPitch to exactly the initial XI (red-card ghosts gone)', () => {
    const home = createGoldenTeam(1, 'Home XI', true);
    const away = createGoldenTeam(2, 'Away XI', false);
    const kickoffXI = (team: TeamState) => new Set(team.players.slice(0, 11).map(p => p.id));
    const homeKickoffXI = kickoffXI(home);
    const awayKickoffXI = kickoffXI(away);

    // Seed 41 (golden card): second-yellow red card at minute 15 (home) plus
    // early injuries. Stop at minute 30 — BEFORE the fixture's first
    // substitution (minute 77), so no shirt-swap has moved players between
    // slots and the kickoff XI still occupies slots 0-10.
    const engine = new MatchEngine({ seed: 41 });
    engine.startMatch(home, away);
    while (engine.currentMinute < 30) engine.stepMinute();

    // Non-vacuity: the first run really produced ghost sources — at least one
    // first-XI player is off the pitch (the sent-off player), so the old
    // `??` init would have frozen a non-XI roster into the next run.
    const sentOff = home.players.filter(p => p.redCard);
    expect(sentOff.length).toBeGreaterThan(0);
    expect(sentOff.every(p => p.onPitch === false)).toBe(true);
    expect(onPitchIds(home)).not.toEqual(homeKickoffXI);

    // Re-run startMatch on the SAME squad (the reuse startMatch claims to
    // support — same engine instance, live-mode restart path).
    engine.startMatch(home, away);

    // The engine-side resets this finding rode along with still hold...
    expect(engine.currentMinute).toBe(0);
    expect(home.goals).toBe(0);
    // ...and initPitch now resets onPitch exactly as a virgin init would:
    // per-slot flags, and the on-pitch set is exactly the initial XI.
    expectSlotContract(home);
    expectSlotContract(away);
    expect(onPitchIds(home)).toEqual(homeKickoffXI);
    expect(onPitchIds(away)).toEqual(awayKickoffXI);

    // PINNED-RESIDUAL (disclosure made executable): onPitch is reset, but
    // redCard is NOT — initPitch does not own it, and the engine skips
    // red-carded players in discipline and sub selection. A sent-off player
    // therefore returns to the pitch flag-wise while still carrying the
    // sending-off. Deferred full-squad-reset scope flips this pin
    // deliberately (divergence-ledger convention).
    expect(sentOff[0].onPitch).toBe(true);
    expect(sentOff[0].redCard).toBe(true);
  });

  it('re-startMatch after a FULL match resets onPitch by slot even after substitution shirt-swaps', () => {
    const home = createGoldenTeam(1, 'Home XI', true);
    const away = createGoldenTeam(2, 'Away XI', false);
    const engine = new MatchEngine({ seed: 41 });
    const first = engine.simulate(home, away);

    // Non-vacuity: the full run really exercised the sub machinery.
    expect(first.events.filter(e => e.type === 'sub').length).toBeGreaterThan(0);

    // Golden quirk #4 (shirt swap): a sub writes the incoming player INTO the
    // outgoing's XI slot (onPitch: true) and the outgoing into the bench slot
    // (onPitch: false) — so after swaps the sub-written flags already match
    // the slot contract. What the reset actually restores is everything else:
    // red-carded XI players (kept off by the old `??` init) go back on
    // flag-wise, and any pre-set/custom value is overwritten by the slot rule.
    engine.startMatch(home, away);
    expectSlotContract(home);
    expectSlotContract(away);
    expect(onPitchIds(home)).toEqual(new Set(home.players.slice(0, 11).map(p => p.id)));

    // initPitch owns onPitch FLAGS, not array order: after shirt-swaps the
    // re-run XI is whoever occupies slots 0-10 (the closing-match roster),
    // not the original kickoff identities. Restoring the original order
    // belongs to the deferred full-squad-reset scope, not this PR.
  });

  it('PINNED-BOUNDARY: a re-run stream is NOT yet a fresh-squad stream — residual non-initPitch state rides', () => {
    // The strongest form — "the full second-run event stream deep-equals a
    // fresh squad's stream on the same seed" — is NOT achievable with an
    // onPitch-only reset, and this test pins that boundary so a future
    // full-squad-reset PR must flip it deliberately. Why it cannot hold:
    // startMatch does not reset stamina/minutesPlayed/yellowCards/redCard/
    // isInjured (not state initPitch owns), and the engine reads every one —
    // substituteAI filters on stamina<25 && minutesPlayed>50 && !redCard &&
    // !isInjured with a minutesPlayed<10 bench, discipline escalates a
    // yellowCards-carrying player to a second yellow, and injury skips
    // flagged players. Concretely, after the shirt-swaps the bench slots hold
    // subbed-off starters with residual minutesPlayed > 10, so the re-run can
    // never substitute at all (no bench-eligible player exists) and the
    // subbed-off goalkeeper sits in a bench slot — the re-run plays without a
    // GK from kickoff, its set-piece takers come off a swapped slot order, and
    // the run-1 sent-off player is back on the pitch but immune to discipline.
    // Same-seed fresh engines make the RNG identical, so the divergence is
    // attributable purely to residual squad state.
    const home = createGoldenTeam(1, 'Home XI', true);
    const away = createGoldenTeam(2, 'Away XI', false);
    const virginHome = structuredClone(home);
    const virginAway = structuredClone(away);

    const first = new MatchEngine({ seed: 41 });
    first.simulate(home, away); // the squad is now used

    const rerun = new MatchEngine({ seed: 41 });
    rerun.startMatch(home, away);
    while (!rerun.isFinished) rerun.stepMinute();

    const fresh = new MatchEngine({ seed: 41 });
    fresh.startMatch(virginHome, virginAway);
    while (!fresh.isFinished) fresh.stepMinute();

    const rerunStream = pinEvents(rerun.result().events);
    const freshStream = pinEvents(fresh.result().events);

    // The reset held (the boundary is residual state, not a broken fix)...
    expectSlotContract(home);
    expectSlotContract(away);
    // ...and yet the streams still differ, because of exactly that residual.
    expect(rerunStream.length).toBeGreaterThan(0);
    expect(rerunStream).not.toEqual(freshStream);
  });
});