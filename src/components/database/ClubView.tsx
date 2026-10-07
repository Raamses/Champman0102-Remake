// @paths components/database
// CM-013 club view: club facts + the squad drill-down list. Squad slots
// resolve through staff.dat (person name + linked player record).
import { useMemo, useState } from 'react';
import { ChevronLeft, Users } from 'lucide-react';
import type { GameDataset } from '../../lib/game-data';
import { findClubRowById } from '../../lib/game-data/clubTable';
import { findStaffRowById, resolveStaffRowName } from '../../lib/game-data/staffTable';
import { formatMoney, nationName, resolveSquad, type SquadEntry } from '../../lib/game-data/squad';

interface ClubViewProps {
  dataset: GameDataset;
  clubId: number;
  onOpenPlayer: (playerId: number) => void;
  onBack: () => void;
}

function FactChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-brand-border bg-brand-bg px-3 py-2 min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">{label}</p>
      <p className="text-xs font-bold text-brand-text truncate" title={value}>{value}</p>
    </div>
  );
}

export default function ClubView({ dataset, clubId, onOpenPlayer, onBack }: ClubViewProps) {
  const [onlyPlayers, setOnlyPlayers] = useState(true);

  const facts = useMemo(() => findClubRowById(dataset.clubs, clubId), [dataset, clubId]);
  const squad = useMemo(() => resolveSquad(dataset, clubId), [dataset, clubId]);
  const visible: SquadEntry[] = onlyPlayers ? squad.filter((entry: SquadEntry) => entry.playerRow) : squad;

  if (!facts) {
    return <p className="text-xs text-brand-muted py-16 text-center">Club #{clubId} not found in this dataset.</p>;
  }

  const nation = nationName(dataset, facts.nation);
  const managerName =
    facts.manager >= 0
      ? (() => {
          const row = findStaffRowById(dataset.staff, facts.manager);
          return row
            ? resolveStaffRowName(row, dataset.firstNames, dataset.secondNames, dataset.commonNames)
            : null;
        })()
      : null;

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-brand-text transition-colors"
      >
        <ChevronLeft className="w-3 h-3" /> All clubs
      </button>

      <div className="rounded border border-brand-border bg-brand-surface p-4 space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-base font-black text-brand-text">{facts.name || facts.shortName}</h2>
          {facts.shortName ? (
            <span className="text-[10px] font-mono text-brand-muted">{facts.shortName}</span>
          ) : null}
          <span className="text-[10px] text-brand-muted">{nation ?? '—'}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <FactChip label="Reputation" value={String(facts.reputation)} />
          <FactChip label="Cash" value={formatMoney(facts.cash)} />
          <FactChip label="Manager" value={managerName ?? '—'} />
          <FactChip label="Division" value={`#${facts.division}`} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-muted">
          <Users className="w-3.5 h-3.5" /> Squad ({visible.length})
        </h3>
        <label className="flex items-center gap-2 text-[10px] font-mono text-brand-muted cursor-pointer">
          <input
            type="checkbox"
            checked={onlyPlayers}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOnlyPlayers(e.target.checked)}
            className="accent-brand-primary"
          />
          players only
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="text-xs text-brand-muted py-10 text-center">No squad members resolved for this club.</p>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          {visible.map((entry) => (
            <li key={`${entry.slot}-${entry.staffId}`}>
              <button
                disabled={!entry.playerRow}
                onClick={() => entry.playerRow && onOpenPlayer(entry.playerRow.id)}
                className={
                  entry.playerRow
                    ? 'w-full flex items-baseline gap-2 px-3 py-2 rounded text-left hover:bg-white/5 border border-transparent hover:border-brand-border transition-colors'
                    : 'w-full flex items-baseline gap-2 px-3 py-2 rounded text-left border border-transparent opacity-60'
                }
              >
                <span className="text-[10px] font-mono text-brand-muted w-6 shrink-0">{entry.slot + 1}.</span>
                <span className="text-xs font-bold text-brand-text truncate">
                  {entry.name ?? `staff #${entry.staffId}`}
                </span>
                {entry.playerRow ? (
                  <span className="ml-auto shrink-0 text-[10px] font-mono text-brand-primary">
                    #{entry.playerRow.squadNumber} CA {entry.playerRow.currentAbility} / PA {entry.playerRow.potentialAbility}
                  </span>
                ) : (
                  <span className="ml-auto shrink-0 text-[10px] font-mono text-brand-muted">non-player</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
