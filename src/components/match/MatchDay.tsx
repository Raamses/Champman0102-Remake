import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { listClubOptions } from '../../lib/match/teamFactory';
import { useMatchStore, SPEED_MS, type MatchSpeed } from '../../store/matchStore';
import type { GameDataset } from '../../lib/game-data';
import type { Tactic } from '../../engine/types';
import { cn } from '../../lib/utils';

const TACTIC_DIMS: Array<{ key: TacticKey; label: string; values: string[] }> = [
  { key: 'mentality', label: 'Mentality', values: ['defensive', 'balanced', 'attacking'] },
  { key: 'tempo', label: 'Tempo', values: ['slow', 'normal', 'fast'] },
  { key: 'pressing', label: 'Pressing', values: ['low', 'normal', 'high'] },
  { key: 'passing', label: 'Passing', values: ['short', 'mixed', 'long'] },
  { key: 'width', label: 'Width', values: ['narrow', 'normal', 'wide'] },
];

const FORMATIONS: Tactic['formation'][] = ['4-4-2', '4-3-3', '3-5-2', '4-5-1', '5-3-2', '3-4-3', '5-4-1'];

function TacticPanel({ side, title }: { side: 'home' | 'away'; title: string }) {
  const tactic = useMatchStore((s) => (side === 'home' ? s.homeTactic : s.awayTactic));
  const setTactic = useMatchStore((s) => s.setTactic);
  const phase = useMatchStore((s) => s.phase);

  const setFormation = (f: Tactic['formation']) => setTactic(side, { formation: f });

  return (
    <div className="bg-brand-surface border border-brand-border rounded p-3 space-y-2" data-testid={`tactics-${side}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">{title}</span>
        {phase === 'live' && <span className="text-[9px] uppercase text-brand-primary">next minute</span>}
      </div>
      <div className="flex flex-wrap gap-1">
        {FORMATIONS.map((f) => (
          <button
            key={f}
            disabled={phase === 'live'} // formation is a pre-match + half-time decision
            onClick={() => setFormation(f)}
            className={cn(
              'px-2 py-1 text-[10px] font-bold rounded border transition-colors',
              tactic.formation === f ? 'bg-brand-primary text-black border-brand-primary' : 'border-brand-border text-brand-muted hover:text-brand-text',
              phase === 'live' && 'opacity-40 cursor-not-allowed'
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {(['mentality', 'tempo', 'pressing', 'passing', 'width'] as const).map((dim) => (
          <label key={dim} className="flex items-center justify-between gap-2 text-[10px] text-brand-muted uppercase">
            {dim}
            <select
              value={tactic[dim]}
              onChange={(e) => setTactic(side, { [dim]: e.target.value } as Partial<Tactic>)}
              className="bg-brand-bg border border-brand-border rounded px-1 py-0.5 text-[10px] text-brand-text"
            >
              {(dim === 'mentality' ? ['defensive', 'balanced', 'attacking']
                : dim === 'tempo' ? ['slow', 'normal', 'fast']
                : dim === 'pressing' ? ['low', 'normal', 'high']
                : dim === 'passing' ? ['short', 'mixed', 'long']
                : ['narrow', 'normal', 'wide']
              ).map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

function StaminaBars({ slots, accent }: { slots: { id: number; name: string; pos: string; stamina: number }[]; accent: string }) {
  return (
    <div className="space-y-1">
      {slots.map((p) => (
        <div key={p.id} className="flex items-center gap-2">
          <span className="w-8 text-[9px] font-bold text-brand-muted shrink-0">{p.pos}</span>
          <div className="flex-1 h-2 bg-brand-bg border border-brand-border rounded overflow-hidden">
            <div className={cn('h-full transition-all duration-500', p.stamina > 50 ? accent : p.stamina > 25 ? 'bg-yellow-500' : 'bg-red-600')} style={{ width: `${p.stamina}%` }} />
          </div>
          <span className="w-12 text-[9px] text-brand-muted truncate" title={p.name}>{p.name}</span>
        </div>
      ))}
    </div>
  );
}

function Scoreboard() {
  const minute = useMatchStore((s) => s.minute);
  const homeGoals = useMatchStore((s) => s.homeGoals);
  const awayGoals = useMatchStore((s) => s.awayGoals);
  const homeName = useMatchStore((s) => s.homeName);
  const awayName = useMatchStore((s) => s.awayName);
  const homePossession = useMatchStore((s) => s.homePossession);
  const phase = useMatchStore((s) => s.phase);
  return (
    <div className="bg-brand-surface border border-brand-border rounded p-4">
      <div className="flex items-center justify-center gap-4">
        <span className="flex-1 text-right text-xs font-bold uppercase truncate">{homeName}</span>
        <span className="text-2xl font-black tabular-nums text-brand-primary px-3 py-1 border border-brand-border rounded bg-brand-bg">
          {homeGoals}–{awayGoals}
        </span>
        <span className="flex-1 text-xs font-bold uppercase truncate">{awayName}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-brand-muted">
        <span className="tabular-nums font-bold">{phase === 'pre' ? "P" : `${minute}'`}</span>
        <span>Possession {homePossession}% / {100 - homePossession}%</span>
        <span className="uppercase tracking-widest">{phase}</span>
      </div>
    </div>
  );
}

function Feed() {
  const feed = useMatchStore((s) => s.feed);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    boxRef.current?.scrollTo({ top: 0 });
  }, [feed.length]);
  return (
    <div ref={boxRef} data-testid="commentary-feed" className="flex-1 min-h-40 max-h-72 lg:max-h-none overflow-y-auto bg-brand-bg border border-brand-border rounded p-2 space-y-1">
      {feed.length === 0 && <p className="text-[10px] text-brand-muted">Commentary appears here once the match kicks off.</p>}
      {feed.map((item, i) => (
        <p key={`${item.minute}-${i}`} className={cn('text-[11px] leading-snug', item.kind === 'system' ? 'text-brand-muted italic' : 'text-brand-text')}>
          <span className="text-brand-muted tabular-nums mr-1">{item.minute}'</span>
          {item.text}
        </p>
      ))}
    </div>
  );
}


function PreMatch({ dataset }: { dataset: GameDataset }) {
  const prepare = useMatchStore((s) => s.prepare);
  const kickOff = useMatchStore((s) => s.kickOff);
  const error = useMatchStore((s) => s.error);
  const homeName = useMatchStore((s) => s.homeName);
  const [homeId, setHomeId] = useState<number | null>(null);
  const [awayId, setAwayId] = useState<number | null>(null);
  const [seed, setSeed] = useState(42);

  const options = useMemo(() => listClubOptions(dataset), [dataset]);

  const onPrepare = () => {
    if (homeId === null || awayId === null) return;
    prepare(dataset, homeId, awayId, seed);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="bg-brand-surface border border-brand-border rounded p-4 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Match day — pick the teams</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="space-y-1 block">
            <span className="text-[10px] uppercase text-brand-muted">Home (you)</span>
            <select
              data-testid="select-home"
              value={homeId ?? ''}
              onChange={(e) => setHomeId(e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-brand-bg border border-brand-border rounded px-2 py-1.5 text-xs text-brand-text"
            >
              <option value="">— select —</option>
              {options.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.squadSize})</option>)}
            </select>
          </label>
          <label className="space-y-1 block">
            <span className="text-[10px] uppercase text-brand-muted">Away</span>
            <select
              data-testid="select-away"
              value={awayId ?? ''}
              onChange={(e) => setAwayId(e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-brand-bg border border-brand-border rounded px-2 py-1.5 text-xs text-brand-text"
            >
              <option value="">— select —</option>
              {options.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.squadSize})</option>)}
            </select>
          </label>
        </div>
        <div className="flex items-end gap-3">
          <label className="space-y-1 block flex-1">
            <span className="text-[10px] uppercase text-brand-muted">Seed (deterministic replay)</span>
            <input
              type="number"
              value={seed}
              min={0}
              onChange={(e) => setSeed(Math.max(0, Number(e.target.value) || 0))}
              className="w-full bg-brand-bg border border-brand-border rounded px-2 py-1.5 text-xs text-brand-text tabular-nums"
            />
          </label>
          <button
            data-testid="prepare-match"
            onClick={onPrepare}
            disabled={homeId === null || awayId === null || homeId === awayId}
            className="px-4 py-1.5 bg-brand-primary text-black text-[10px] font-bold uppercase rounded disabled:opacity-40"
          >
            Set up match
          </button>
        </div>
        {error && <p className="text-[10px] text-red-500">{error}</p>}
      </div>

      {homeName && (
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <TacticPanel side="home" title={`Tactics — ${homeName}`} />
            <TacticPanel side="away" title="Tactics — away" />
          </div>
          <button
            data-testid="kick-off"
            onClick={kickOff}
            className="w-full px-4 py-3 bg-brand-primary text-black text-xs font-black uppercase tracking-widest rounded"
          >
            Kick off
          </button>
        </div>
      )}
    </div>
  );
}

function LiveMatch() {
  const phase = useMatchStore((s) => s.phase);
  const homeStamina = useMatchStore((s) => s.homeStamina);
  const awayStamina = useMatchStore((s) => s.awayStamina);
  const persistedSlot = useMatchStore((s) => s.persistedSlot);
  const homeGoals = useMatchStore((s) => s.homeGoals);
  const awayGoals = useMatchStore((s) => s.awayGoals);
  const homeName = useMatchStore((s) => s.homeName);
  const awayName = useMatchStore((s) => s.awayName);

  // Auto-tick loop driven by the speed setting; paused at half-time/full-time.
  const speed = useMatchStore((s) => s.speed);
  useEffect(() => {
    if (phase !== 'live') return;
    const interval = window.setInterval(() => {
      useMatchStore.getState().tick();
    }, SPEED_MS[speed]);
    return () => window.clearInterval(interval);
  }, [phase, speed]);

  return (
    <div className="max-w-5xl mx-auto space-y-3 pb-16 md:pb-0">
      <Scoreboard />
      <div className="grid lg:grid-cols-[1fr_320px] gap-3">
        <div className="space-y-3">
          <Feed />
          <div className="flex flex-wrap items-center gap-2">
            {phase === 'half-time' ? (
              <button data-testid="second-half" onClick={() => useMatchStore.getState().resumeSecondHalf()} className="px-3 py-1.5 bg-brand-primary text-black text-[10px] font-bold uppercase rounded">
                Second half
              </button>
            ) : phase === 'live' ? (
              <span className="text-[10px] text-brand-muted uppercase tracking-widest">● live</span>
            ) : null}
            {(['slow', 'normal', 'fast'] as MatchSpeed[]).map((spd) => (
              <button
                key={spd}
                onClick={() => useMatchStore.getState().setSpeed(spd)}
                className={cn('px-2 py-1 text-[10px] font-bold uppercase rounded border', speed === spd ? 'bg-brand-primary text-black border-brand-primary' : 'border-brand-border text-brand-muted')}
              >
                {spd}
              </button>
            ))}
            <button onClick={() => useMatchStore.getState().tick()} className="px-2 py-1 text-[10px] font-bold uppercase rounded border border-brand-border text-brand-muted">+1 min</button>
            <button onClick={() => useMatchStore.getState().skipToFullTime()} className="px-2 py-1 text-[10px] font-bold uppercase rounded border border-brand-border text-brand-muted">Skip to FT</button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-brand-surface border border-brand-border rounded p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">Stamina — {homeName}</p>
            <StaminaBars slots={homeStamina} accent="bg-brand-primary" />
          </div>
          <div className="bg-brand-surface border border-brand-border rounded p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">Stamina — away</p>
            <StaminaBars slots={awayStamina} accent="bg-blue-400" />
          </div>
          <TacticPanel side="home" title={`Tactics — ${homeName}`} />
        </div>
      </div>
      {/* Thumb-zone bar (CM-R08): primary live controls within thumb reach on mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-10 bg-brand-surface border-t border-brand-border p-2 flex items-center justify-center gap-2">
        {phase === 'half-time' ? (
          <button onClick={() => useMatchStore.getState().resumeSecondHalf()} className="px-4 py-2 bg-brand-primary text-black text-[10px] font-black uppercase rounded">2nd half</button>
        ) : (
          <>
            {(['slow', 'normal', 'fast'] as MatchSpeed[]).map((spd) => (
              <button
                key={spd}
                onClick={() => useMatchStore.getState().setSpeed(spd)}
                className={cn('px-3 py-2 text-[10px] font-bold uppercase rounded border', speed === spd ? 'bg-brand-primary text-black border-brand-primary' : 'border-brand-border text-brand-muted')}
              >
                {spd}
              </button>
            ))}
            <button onClick={() => useMatchStore.getState().skipToFullTime()} className="px-3 py-2 text-[10px] font-bold uppercase rounded border border-brand-border text-brand-muted">FT</button>
          </>
        )}
      </div>
      {phase === 'full-time' && (
        <div data-testid="full-time-summary" className="bg-brand-surface border border-brand-border rounded p-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Full time</p>
          <p className="text-[11px] text-brand-text">
            Final score: {homeGoals}–{awayGoals}.
            {persistedSlot ? ' Summary saved to IndexedDB.' : ''}
          </p>
          <button onClick={() => useMatchStore.getState().reset()} className="px-3 py-1.5 bg-brand-primary text-black text-[10px] font-bold uppercase rounded mt-1">
            Back to match day
          </button>
        </div>
      )}
    </div>
  );
}

export default function MatchDay() {
  const { status, getDataset } = useGameData();
  const phase = useMatchStore((s) => s.phase);

  if (status === 'loading' || status === 'idle') {
    return <p className="text-xs text-brand-muted uppercase tracking-widest text-center py-24">Loading database…</p>;
  }
  if (status !== 'ready') {
    return (
      <p className="text-xs text-brand-muted text-center py-24 max-w-sm mx-auto">
        No database loaded. Import your CM 01/02 data files in the <span className="text-brand-primary font-bold">Database</span> tab first — the match engine builds its squads from them.
      </p>
    );
  }
  const dataset = getDataset();
  if (!dataset) return <p className="text-xs text-brand-muted text-center py-24">Database vanished — re-import in the Database tab.</p>;

  return (
    <div className="space-y-4">
      {phase === 'pre' ? <PreMatch dataset={dataset} /> : <LiveMatch />}
    </div>
  );
}

// Re-export for tests.
export { TACTIC_DIMS };
type TacticKey = 'formation' | 'mentality' | 'tempo' | 'pressing' | 'passing' | 'width';