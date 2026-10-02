// @paths components/database
/**
 * CM-013 database viewer — the first visible UI on the .dat pipeline.
 * Drill-down: clubs list -> club squad -> player attribute view.
 * Data comes from the CM-011 pipeline via the useGameData hook; an empty
 * state offers BYOD import (files or the Data folder picked directly).
 */
import { useRef, useState } from 'react';
import { Database, FolderOpen, Upload } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { useGameData } from '../../hooks/useGameData';
import type { GameDataset } from '../../lib/game-data';
import ClubsList from './ClubsList';
import ClubView from './ClubView';
import PlayerView from './PlayerView';

type DatabaseRoute =
  | { kind: 'clubs' }
  | { kind: 'club'; clubId: number }
  | { kind: 'player'; clubId: number; playerId: number };

const DIR_PROPS = { webkitdirectory: '', directory: '' } as unknown as InputHTMLAttributes<HTMLInputElement>;

function ImportPanel({ error }: { error: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);
  const { importArchive } = useGameData();

  const pick = (files: FileList | null) => {
    if (files && files.length > 0) void importArchive(Array.from(files));
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded border border-brand-border bg-brand-surface p-8 text-center">
      <div className="w-12 h-12 rounded bg-brand-primary/10 flex items-center justify-center">
        <Database className="w-6 h-6 text-brand-primary" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-sm font-bold uppercase tracking-widest">No database loaded</h2>
        <p className="text-xs text-brand-muted leading-relaxed">
          Bring your own CM 01/02 data: pick the <span className="font-mono text-brand-text">.dat</span> files from
          your game's <span className="font-mono text-brand-text">Data</span> folder (index, club, nat_club, nation,
          staff, first_names, second_names, common_names). Everything stays local — parsed to in-memory tables and
          autosaved to this browser's IndexedDB.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-brand-primary text-black text-xs font-bold uppercase tracking-wide hover:bg-brand-primary-hover transition-colors"
        >
          <Upload className="w-4 h-4" /> Select .dat files
        </button>
        <button
          onClick={() => folderRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-brand-border text-brand-text text-xs font-bold uppercase tracking-wide hover:bg-white/5 transition-colors"
        >
          <FolderOpen className="w-4 h-4" /> Select Data folder
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".dat,.DAT,.cfg"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={folderRef}
        type="file"
        multiple
        {...DIR_PROPS}
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = '';
        }}
      />
      {error ? (
        <p className="text-xs text-red-400 font-mono max-w-md break-words" role="alert">{error}</p>
      ) : null}
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="flex flex-col items-center gap-3 py-32 text-brand-muted">
      <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
      <p className="text-[11px] font-bold uppercase tracking-widest">Loading dataset…</p>
    </div>
  );
}

export default function DatabaseView() {
  const { status, error, importArchive } = useGameData();
  const [route, setRoute] = useState<DatabaseRoute>({ kind: 'clubs' });

  const importArchiveFrom = (files: FileList | null) => {
    if (files && files.length > 0) void importArchive(Array.from(files));
  };

  if (status === 'loading') return <LoadingPanel />;

  if (status === 'ready') {
    return <ReadyRoutes route={route} setRoute={setRoute} />;
  }

  return <ImportPanel error={status === 'error' ? error : null} />;
}

function ReadyRoutes({
  route,
  setRoute,
}: {
  route: DatabaseRoute;
  setRoute: (r: DatabaseRoute) => void;
}) {
  const { getDataset } = useGameData();
  const ds: GameDataset | null = getDataset();

  if (!ds) {
    return <ImportPanel error="Dataset state lost — re-select the files." />;
  }
  if (route.kind === 'player') {
    return (
      <PlayerView
        dataset={ds}
        clubId={route.clubId}
        playerId={route.playerId}
        onBack={() => setRoute({ kind: 'club', clubId: route.clubId })}
      />
    );
  }
  if (route.kind === 'club') {
    return (
      <ClubView
        dataset={ds}
        clubId={route.clubId}
        onOpenPlayer={(playerId) => setRoute({ kind: 'player', clubId: route.clubId, playerId })}
        onBack={() => setRoute({ kind: 'clubs' })}
      />
    );
  }
  return <ClubsList dataset={ds} onOpenClub={(clubId) => setRoute({ kind: 'club', clubId })} />;
}
