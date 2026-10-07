// @paths hooks
/**
 * React binding between the CM-011 data pipeline and the CM-013 database
 * viewer. The SoA dataset itself lives at module scope (game data is NOT
 * zustand state — decisions doc #1 keeps zustand UI-only); this hook exposes
 * the UI-visible load status plus the BYOD import action.
 *
 * Import flow (mirrors the CM-T07 integration test): user picks the .dat
 * files (files or webkitdirectory folder pick) -> resolveArchiveFiles
 * normalizes paths/casing -> dat-parser -> buildGameDataset -> in-memory SoA
 * + end-of-turn autosave envelope into IndexedDB. On next mount the dataset
 * hydrates straight out of the autosave slot — structured clone preserves
 * the TypedArray columns and idToIndex maps, so no re-parse is needed.
 */
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';
import {
  resolveArchiveFiles,
  REQUIRED_DAT_FILES,
  type ArchiveEntry,
} from '../lib/dat-parser/archivePaths';
import {
  parseIndexDat,
  parseClubDat,
  parseNatClubDat,
  parseNationDat,
  parseNamesDat,
  parseStaffDat,
} from '../lib/dat-parser/parser';
import { buildGameDataset, type GameDataset } from '../lib/game-data';
import { createSaveManager, AUTOSAVE_CURRENT_SLOT, type SaveManager } from '../lib/persistence';
import { requestPersistentStorage } from '../lib/persistence/persist';

/** The dataset snapshot CM-013 persists; CM-020 owns the gameplay state. */
const DATASET_SCHEMA_VERSION = 1;

type GameDataStatus = 'idle' | 'loading' | 'empty' | 'ready' | 'error';

interface GameDataUiState {
  status: GameDataStatus;
  /** Set alongside `error` — human-readable, shown in the import panel. */
  error: string | null;
  /** Bumped whenever the module-level dataset is (re)placed. */
  version: number;
}

interface GameDataUiStore extends GameDataUiState {
  setUi: (patch: Partial<GameDataUiState>) => void;
}

const useGameDataUi = create<GameDataUiStore>((set) => ({
  status: 'idle',
  error: null,
  version: 0,
  setUi: (patch) => set(patch),
}));

let dataset: GameDataset | null = null;
let saveManager: SaveManager<GameDataset> | null = null;

function getManager(): SaveManager<GameDataset> {
  if (!saveManager) {
    saveManager = createSaveManager<GameDataset>({
      currentSchemaVersion: DATASET_SCHEMA_VERSION,
      migrations: new Map(),
    });
  }
  return saveManager;
}

/** Raw accessor for render-time reads; changes re-render via `version`. */
function getGameDataset(): GameDataset | null {
  return dataset;
}

const DAT_FILES = REQUIRED_DAT_FILES.filter((name) => name !== 'player_setup.cfg');

async function importArchive(list: File[]): Promise<void> {
  const ui = useGameDataUi.getState();
  ui.setUi({ status: 'loading', error: null });

  try {
    const buffers = await Promise.all(
      list.map(async (file) => ({
        path: (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name,
        file: await file.arrayBuffer(),
      }))
    );
    const entries: ArchiveEntry<ArrayBuffer>[] = buffers;
    const { files, missing } = resolveArchiveFiles(entries);

    const gap = missing.filter((name) => name !== 'player_setup.cfg');
    if (gap.length > 0) {
      throw new Error(`Missing required files: ${gap.join(', ')}`);
    }

    const indexEntries = parseIndexDat(files['index.dat']!);
    const clubs = parseClubDat(files['club.dat']!);
    const natClubs = parseNatClubDat(files['nat_club.dat']!);
    const nations = parseNationDat(files['nation.dat']!);
    const firstNames = parseNamesDat(files['first_names.dat']!);
    const secondNames = parseNamesDat(files['second_names.dat']!);
    const commonNames = parseNamesDat(files['common_names.dat']!);
    const { staff, players } = parseStaffDat(files['staff.dat']!, indexEntries);

    const built = buildGameDataset({
      clubs,
      natClubs,
      nations,
      firstNames,
      secondNames,
      commonNames,
      staff,
      players,
    });

    dataset = built;
    ui.setUi({ status: 'ready', version: useGameDataUi.getState().version + 1 });

    // End-of-turn persistence is best-effort: the in-memory dataset already
    // powers the views, so a persistence failure only downgrades durability.
    try {
      await getManager().writeAutosave(
        built,
        `Dataset: ${built.clubs.length} clubs, ${built.players.length} players`
      );
      void requestPersistentStorage();
    } catch {
      ui.setUi({
        error: 'Dataset loaded, but autosave persistence failed — it will not survive a reload.',
      });
    }
  } catch (err) {
    dataset = null;
    ui.setUi({
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

async function hydrateFromAutosave(): Promise<void> {
  const ui = useGameDataUi.getState();
  if (ui.status !== 'idle') return; // import already won the race
  ui.setUi({ status: 'loading' });
  try {
    const envelope = await getManager().loadSave(AUTOSAVE_CURRENT_SLOT);
    if (envelope?.payload) {
      dataset = envelope.payload;
      ui.setUi({ status: 'ready', version: useGameDataUi.getState().version + 1 });
    } else {
      ui.setUi({ status: 'empty' });
    }
  } catch (err) {
    ui.setUi({
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export interface UseGameData {
  status: GameDataStatus;
  error: string | null;
  version: number;
  /** null until a dataset is in memory; read fresh on each render. */
  getDataset: typeof getGameDataset;
  importArchive: (files: File[]) => Promise<void>;
}

export function useGameData(): UseGameData {
  const status = useGameDataUi((s) => s.status);
  const error = useGameDataUi((s) => s.error);
  const version = useGameDataUi((s) => s.version);

  useEffect(() => {
    void hydrateFromAutosave();
  }, []);

  const importArchiveCb = useCallback(
    async (files: File[]) => {
      void importArchive(files);
    },
    []
  );

  return { status, error, version, getDataset: getGameDataset, importArchive: importArchiveCb };
}
