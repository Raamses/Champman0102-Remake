// @paths components/database
// CM-013 player attribute view: bio chips (CA/PA/squad number), the 12
// position ratings and the full 43-attribute panel (1-20 scale, CM-T07).
import { ChevronLeft } from 'lucide-react';
import type { CM2PlayerAttributes, CM2PlayerPositions } from '../../lib/dat-parser/parser';
import {
  ATTRIBUTE_FIELDS,
  POSITION_FIELDS,
  findPlayerRowById,
} from '../../lib/game-data/playerTable';
import { findClubRowById } from '../../lib/game-data/clubTable';
import { getStaffRow, resolveStaffRowName } from '../../lib/game-data/staffTable';
import type { GameDataset } from '../../lib/game-data';

interface PlayerViewProps {
  dataset: GameDataset;
  clubId: number;
  playerId: number;
  onBack: () => void;
}

function attrLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());
}

export default function PlayerView({ dataset, clubId, playerId, onBack }: PlayerViewProps) {
  const player = findPlayerRowById(dataset.players, playerId);

  if (!player) {
    return (
      <div className="space-y-4">
        <BackButton onClick={onBack} />
        <p className="text-xs text-brand-muted py-16 text-center">
          Player #{playerId} not found in this dataset.
        </p>
      </div>
    );
  }

  const club = findClubRowById(dataset.clubs, clubId);
  const personName = resolvePlayerName(dataset, playerId);

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />

      <div className="rounded border border-brand-border bg-brand-surface p-4 space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-base font-black text-brand-text">{personName ?? `Player #${playerId}`}</h2>
          {club ? <span className="text-[10px] text-brand-muted truncate">{club.name || club.shortName}</span> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip label="Squad №" value={`#${player.squadNumber}`} />
          <Chip label="CA" value={String(player.currentAbility)} highlight />
          <Chip label="PA" value={String(player.potentialAbility)} highlight />
        </div>
      </div>

      <section className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted">Positions</h3>
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1">
          {POSITION_FIELDS.map((field) => {
            const value: number = player.positions[field as keyof CM2PlayerPositions];
            return (
              <li
                key={field}
                className="rounded border border-brand-border bg-brand-surface px-2 py-2 text-center"
              >
                <p className="text-[9px] font-bold uppercase tracking-wide text-brand-muted truncate">
                  {attrLabel(field)}
                </p>
                <p className={value >= 15 ? 'text-xs font-mono font-black text-brand-primary' : 'text-xs font-mono text-brand-text'}>
                  {value}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-muted">Attributes</h3>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {ATTRIBUTE_FIELDS.map((field) => {
            const value: number = player.attributes[field as keyof CM2PlayerAttributes];
            return (
              <li key={field} className="rounded border border-brand-border bg-brand-surface px-3 py-2 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-brand-muted truncate">
                    {attrLabel(field)}
                  </span>
                  <span className="text-xs font-mono font-black text-brand-text">{value}</span>
                </div>
                <div className="h-1 rounded bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-brand-primary"
                    style={{ width: `${Math.max(0, Math.min(100, (value / 20) * 100))}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-brand-text transition-colors"
    >
      <ChevronLeft className="w-3 h-3" /> Back
    </button>
  );
}

function Chip({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded border border-brand-border bg-brand-bg px-3 py-2 min-w-[4.5rem]">
      <p className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">{label}</p>
      <p className={highlight ? 'text-xs font-mono font-black text-brand-primary' : 'text-xs font-mono font-bold text-brand-text'}>
        {value}
      </p>
    </div>
  );
}

/**
 * staff.dat carries the person record that links to the player segment
 * (staff.player == CM2Player.id), so the display name comes via staff.
 */
function resolvePlayerName(dataset: GameDataset, playerId: number): string | null {
  for (let i = 0; i < dataset.staff.length; i++) {
    const row = getStaffRow(dataset.staff, i);
    if (row.player === playerId) {
      return resolveStaffRowName(row, dataset.firstNames, dataset.secondNames, dataset.commonNames);
    }
  }
  return null;
}
