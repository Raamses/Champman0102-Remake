// @paths components/database
// CM-013 clubs browse list: search + name-sorted, DOM-capped for the
// ~10,580-club retail world database.
import { useMemo, useState } from 'react';
import type { GameDataset } from '../../lib/game-data';
import { browseClubs, type ClubListItem } from '../../lib/game-data/squad';

interface ClubsListProps {
  dataset: GameDataset;
  onOpenClub: (clubId: number) => void;
}

export default function ClubsList({ dataset, onOpenClub }: ClubsListProps) {
  const [query, setQuery] = useState('');

  const { items, total, capped } = useMemo(() => browseClubs(dataset, query), [dataset, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Search clubs…"
          aria-label="Search clubs"
          className="w-full sm:max-w-xs px-3 py-2 rounded bg-brand-surface border border-brand-border text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-primary"
        />
        <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wide">
          {items.length} / {total} clubs
        </span>
        {capped ? (
          <span className="text-[10px] font-mono text-brand-muted">— refine search to see more</span>
        ) : null}
      </div>

      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        {items.map(({ row, nationName: clubNation }: ClubListItem) => (
          <li key={row.id}>
            <button
              onClick={() => onOpenClub(row.id)}
              className="w-full flex items-baseline gap-2 px-3 py-2 rounded text-left hover:bg-white/5 border border-transparent hover:border-brand-border transition-colors"
            >
              <span className="text-xs font-bold text-brand-text truncate">{row.name || row.shortName}</span>
              {row.shortName ? (
                <span className="text-[10px] font-mono text-brand-muted">{row.shortName}</span>
              ) : null}
              <span className="ml-auto text-[10px] text-brand-muted truncate hidden sm:block">
                {clubNation ?? '—'}
              </span>
              <span className="text-[10px] font-mono text-brand-primary shrink-0">{row.reputation}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
