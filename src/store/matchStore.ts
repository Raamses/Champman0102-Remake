// @paths store
/**
 * CM-018 live-match Zustand slice — UI state only (decisions doc #1). The
 * MatchEngine instance, TeamState objects and commentary context live in a
 * module closure (non-serializable runtime, rebuilt by prepare()); the store
 * holds renderable snapshots. Post-match summaries persist through the
 * CM-011 IndexedDB layer (saveManager manual slot family `postmatch-*`).
 *
 * The engine runs on the MAIN THREAD behind the `VITE_MATCH_WORKER` flag
 * (default off): engine steps are sub-millisecond, and the CM-T16 worker RPC
 * protocol is not built yet. The flag is the documented seam.
 */
import { create } from 'zustand';
import { MatchEngine } from '../engine/matchEngine';
import type { Tactic } from '../engine/types';
import { renderCommentary, type CommentaryContext } from '../lib/commentary/commentary';
import { buildMatchTeam, listClubOptions, type MatchTeamBuild } from '../lib/match/teamFactory';
import type { GameDataset } from '../lib/game-data';
import { createSaveManager } from '../lib/persistence/saveManager';

type MatchPhase = 'pre' | 'live' | 'half-time' | 'full-time';
export type MatchSpeed = 'slow' | 'normal' | 'fast';

/** Milliseconds per simulated minute per speed setting. */
export const SPEED_MS: Record<MatchSpeed, number> = { slow: 2500, normal: 1000, fast: 300 };

export interface StaminaSlot {
  id: number;
  name: string;
  pos: string;
  stamina: number; // 0-100
}

export interface FeedItem {
  minute: number;
  text: string;
  kind: 'commentary' | 'system';
}

interface PostMatchSummary {
  fixture: { homeClubId: number; awayClubId: number; homeName: string; awayName: string };
  seed: number;
  score: { home: number; away: number };
  shots: { home: number; away: number };
  onTarget: { home: number; away: number };
  possession: { home: number; away: number };
  events: Array<{ minute: number; type: string; team: string; description: string }>;
  playedAt: number;
}

const postmatchSaves = createSaveManager<PostMatchSummary>({ currentSchemaVersion: 1, migrations: new Map() });

interface MatchStoreState {
  phase: MatchPhase;
  homeName: string;
  awayName: string;
  minute: number;
  homeGoals: number;
  awayGoals: number;
  homePossession: number;
  feed: FeedItem[];
  homeStamina: StaminaSlot[];
  awayStamina: StaminaSlot[];
  homeTactic: Tactic;
  awayTactic: Tactic;
  speed: MatchSpeed;
  error: string | null;
  persistedSlot: string | null;

  prepare(dataset: GameDataset, homeClubId: number, awayClubId: number, seed: number): void;
  kickOff(): void;
  resumeSecondHalf(): void;
  tick(): void;
  skipToFullTime(): void;
  setTactic(side: 'home' | 'away', patch: Partial<Tactic>): void;
  setSpeed(speed: MatchSpeed): void;
  reset(): void;
}

/** Module closure: the non-serializable runtime. */
interface MatchRuntime {
  engine: MatchEngine;
  home: TeamStateRt;
  away: TeamStateRt;
  ctx: CommentaryContext;
  seed: number;
  persisted: boolean;
}
type TeamStateRt = MatchTeamBuild['team'];

let rt: MatchRuntime | null = null;

function staminaSnapshot(team: TeamStateRt): StaminaSlot[] {
  return team.players.slice(0, 11).map((p) => ({ id: p.id, name: p.name, pos: p.position, stamina: Math.round(p.stamina) }));
}

function systemItem(minute: number, text: string): FeedItem {
  return { minute, text, kind: 'system' };
}

const tacticLabels: Record<keyof Tactic, string> = {
  formation: 'formation', mentality: 'mentality', tempo: 'tempo',
  pressing: 'pressing', passing: 'passing', width: 'width',
};

export const useMatchStore = create<MatchStoreState>((set, get) => ({
  phase: 'pre',
  homeName: '',
  awayName: '',
  minute: 0,
  homeGoals: 0,
  awayGoals: 0,
  homePossession: 50,
  feed: [],
  homeStamina: [],
  awayStamina: [],
  homeTactic: { formation: '4-4-2', mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' },
  awayTactic: { formation: '4-4-2', mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' },
  speed: 'normal',
  error: null,
  persistedSlot: null,

  prepare(dataset, homeClubId, awayClubId, seed) {
    try {
      const home = buildMatchTeam(dataset, homeClubId, true, '4-4-2', {
        mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed',
      });
      const away = buildMatchTeam(dataset, awayClubId, false, '4-4-2', {
        mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed',
      });
      const engine = new MatchEngine({ seed });
      const ctx: CommentaryContext = {
        homeTeam: home.team.name,
        awayTeam: away.team.name,
        players: new Map<number, string>(
          [...home.team.players, ...away.team.players].map((p) => [p.id, p.name])
        ),
        homeFormation: '4-4-2',
        awayFormation: '4-4-2',
      };
      rt = { engine, home: home.team, away: away.team, ctx, seed, persisted: false };
      set({
        phase: 'pre',
        homeName: home.team.name,
        awayName: away.team.name,
        minute: 0,
        homeGoals: 0,
        awayGoals: 0,
        homePossession: 50,
        feed: [],
        homeStamina: staminaSnapshot(home.team),
        awayStamina: staminaSnapshot(away.team),
        homeTactic: { ...home.team.tactic },
        awayTactic: { ...away.team.tactic },
        error: null,
        persistedSlot: null,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
    }
  },

  kickOff() {
    if (!rt) return;
    const s = get();
    // Apply any tactic tweaks made on the pre-match screen before kickoff.
    (rt.home.tactic as Tactic) = { ...s.homeTactic };
    (rt.away.tactic as Tactic) = { ...s.awayTactic };
    rt.ctx.homeFormation = s.homeTactic.formation;
    rt.ctx.awayFormation = s.awayTactic.formation;
    rt.engine.startMatch(rt.home, rt.away);
    set({ phase: 'live', minute: 0, feed: [systemItem(0, 'Kick off!')] });
  },

  resumeSecondHalf() {
    if (!rt || get().phase !== 'half-time') return;
    set({ phase: 'live' });
  },

  tick() {
    if (!rt || get().phase !== 'live') return;
    const engine = rt.engine;
    if (engine.isFinished) {
      finish(set, get);
      return;
    }
    const before = get();
    const step = engine.stepMinute();
    const lines: FeedItem[] = renderCommentary(step.events, rt.ctx, { seed: rt.seed })
      .filter((l) => l.key !== 'kickoff' && l.key !== 'full-time')
      .map((l) => ({ minute: l.minute, text: l.text, kind: 'commentary' as const }));
    const snapshot = engine.result();
    const phase: MatchPhase = step.minute === 45 ? 'half-time' : engine.isFinished ? 'full-time' : 'live';
    let feed: FeedItem[];
    if (phase === 'half-time') feed = [systemItem(45, 'Half-time.'), ...lines, ...before.feed];
    else if (phase === 'full-time') feed = [systemItem(90, 'Full time.'), ...lines, ...before.feed];
    else feed = [...lines, ...before.feed];
    const next: Partial<MatchStoreState> = {
      minute: step.minute,
      homeGoals: step.homeGoals,
      awayGoals: step.awayGoals,
      homePossession: snapshot.homeTeam.possession,
      feed: feed.slice(0, 400),
      homeStamina: staminaSnapshot(rt.home),
      awayStamina: staminaSnapshot(rt.away),
      phase,
    };
    set(next);
    if (phase === 'full-time') finish(set, get);
  },

  skipToFullTime() {
    if (!rt || get().phase === 'pre' || rt.engine.isFinished) return;
    const engine = rt.engine;
    while (!engine.isFinished) engine.stepMinute();
    // Render the whole remaining stream at once for a clean final feed.
    const all = renderCommentary(engine.result().events, rt.ctx, { seed: rt.seed });
    const feed = all.map((l) => ({ minute: l.minute, text: l.text, kind: 'commentary' as const }));
    const snapshot = engine.result();
    set({
      minute: 90,
      homeGoals: snapshot.homeTeam.goals,
      awayGoals: snapshot.awayTeam.goals,
      homePossession: snapshot.homeTeam.possession,
      feed: feed.slice(0, 400),
      homeStamina: staminaSnapshot(rt.home),
      awayStamina: staminaSnapshot(rt.away),
      phase: 'full-time',
    });
    finish(set, get);
  },

  setTactic(side, patch) {
    const s = get();
    const key = side === 'home' ? 'homeTactic' : 'awayTactic';
    const nextTactic = { ...s[key], ...patch };
    const team = side === 'home' ? rt?.home : rt?.away;
    if (team) (team.tactic as Tactic) = { ...nextTactic }; // applies from the next minute
    const feedItem = systemItem(
      s.minute,
      `${side === 'home' ? s.homeName : s.awayName}: ${describeChanges(s[key], nextTactic)} (from next minute)`
    );
    const patchSet: Partial<MatchStoreState> = { [key]: nextTactic, feed: [feedItem, ...s.feed].slice(0, 400) };
    set(patchSet as Partial<MatchStoreState>);
  },

  setSpeed(speed) {
    set({ speed });
  },

  reset() {
    rt = null;
    set({
      phase: 'pre', homeName: '', awayName: '', minute: 0, homeGoals: 0, awayGoals: 0,
      homePossession: 50, feed: [], homeStamina: [], awayStamina: [], error: null, persistedSlot: null,
    });
  },
}));

function describeChanges(before: Tactic, after: Tactic): string {
  const dims = (Object.keys(tacticLabels) as Array<keyof Tactic>).filter((k) => before[k] !== after[k]);
  if (dims.length === 0) return 'no tactic change';
  return dims.map((k) => `${tacticLabels[k]} ${after[k]}`).join(', ');
}

type SetFn = (partial: Partial<MatchStoreState>) => void;
type GetFn = () => MatchStoreState;

/** Full-time: freeze phase and persist the post-match summary (CM-011). */
function finish(set: SetFn, get: GetFn): void {
  if (!rt) return;
  const snapshot = rt.engine.result();
  const state = get();
  if (!rt.persisted) {
    rt.persisted = true;
    const slot = `postmatch-${rt.seed}-${snapshot.homeTeam.id}-${snapshot.awayTeam.id}`;
    const summary = {
      fixture: { homeClubId: snapshot.homeTeam.id, awayClubId: snapshot.awayTeam.id, homeName: snapshot.homeTeam.name, awayName: snapshot.awayTeam.name },
      seed: rt.seed,
      score: { home: snapshot.homeTeam.goals, away: snapshot.awayTeam.goals },
      shots: { home: snapshot.homeTeam.shots, away: snapshot.awayTeam.shots },
      onTarget: { home: snapshot.homeTeam.shotsOnTarget, away: snapshot.awayTeam.shotsOnTarget },
      possession: { home: snapshot.homeTeam.possession, away: snapshot.awayTeam.possession },
      events: snapshot.events.map((e) => ({ minute: e.minute, type: e.type, team: e.team, description: e.description })),
      playedAt: Date.now(),
    };
    void postmatchSaves
      .writeManualSave(slot, summary, `Post-match ${snapshot.homeTeam.name} v ${snapshot.awayTeam.name}`)
      .catch((err) => set({ error: `persist failed: ${err instanceof Error ? err.message : String(err)}` }));
    set({ persistedSlot: slot });
  }
  set({ phase: 'full-time', minute: 90, homeGoals: snapshot.homeTeam.goals, awayGoals: snapshot.awayTeam.goals, homePossession: snapshot.homeTeam.possession });
}

/**
 * Documented CM-T16 seam (docs/vault/testing/test-cards.md;
 * docs/vault/cards/cm-018-match-ui.md worker-or-main-thread flag);
 * allowlisted in knip.json (tags: -knip-allow).
 * @knip-allow
 */
export const isWorkerEnabled = (): boolean => {
  // CM-T16 will own the worker RPC protocol; the flag is the documented seam.
  try {
    return Boolean((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_MATCH_WORKER);
  } catch {
    return false;
  }
};

