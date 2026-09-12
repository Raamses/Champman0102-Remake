// @paths lib/game-data
/**
 * Aggregate in-memory SoA dataset for a loaded .dat database (CM-011).
 *
 * Built once from dat-parser output at load time and held for the lifetime
 * of the session — this is the "compact struct-of-arrays typed buffers"
 * working set the storage decision (docs/vault/decisions-2026-09-11.md #1)
 * calls for, replacing the SQLite-WASM/OPFS plan from plan-v2.
 */
import type { CM2Club, CM2Name, CM2Nation, CM2Player, CM2Staff } from '../dat-parser/parser';
import { buildClubTable, type ClubTable } from './clubTable';
import { buildNationTable, type NationTable } from './nationTable';
import { buildNameTable, type NameTable } from './nameTable';
import { buildStaffTable, type StaffTable } from './staffTable';
import { buildPlayerTable, type PlayerTable } from './playerTable';

export interface GameDataSource {
  clubs: CM2Club[];
  natClubs: CM2Club[];
  nations: CM2Nation[];
  firstNames: CM2Name[];
  secondNames: CM2Name[];
  commonNames: CM2Name[];
  staff: CM2Staff[];
  players: CM2Player[] | Map<number, CM2Player>;
}

export interface GameDataset {
  clubs: ClubTable;
  natClubs: ClubTable;
  nations: NationTable;
  firstNames: NameTable;
  secondNames: NameTable;
  commonNames: NameTable;
  staff: StaffTable;
  players: PlayerTable;
}

export function buildGameDataset(source: GameDataSource): GameDataset {
  return {
    clubs: buildClubTable(source.clubs),
    natClubs: buildClubTable(source.natClubs),
    nations: buildNationTable(source.nations),
    firstNames: buildNameTable(source.firstNames),
    secondNames: buildNameTable(source.secondNames),
    commonNames: buildNameTable(source.commonNames),
    staff: buildStaffTable(source.staff),
    players: buildPlayerTable(source.players),
  };
}

// Rough estimate for string columns: 2 bytes/char (UTF-16) + a fixed
// per-string object overhead.
const BYTES_PER_STRING_OVERHEAD = 24;

/**
 * Sums the byte size of every TypedArray / string[] column on a table,
 * walking its own keys rather than naming fields — so a column added to any
 * table's interface is picked up automatically instead of silently dropped
 * from the estimate (this function's only job is to catch drift from the
 * 10-20MB working-set assumption, so it can't itself drift from the tables).
 * Non-column fields (`length`, `idToIndex`) aren't TypedArrays or string
 * arrays and are skipped.
 */
function tableBytes(table: object): number {
  let total = 0;
  for (const value of Object.values(table)) {
    if (ArrayBuffer.isView(value)) {
      total += value.byteLength;
    } else if (Array.isArray(value)) {
      for (const item of value) total += item.length * 2 + BYTES_PER_STRING_OVERHEAD;
    }
  }
  return total;
}

/**
 * Estimate the dataset's resident byte size — used by the CM-R03
 * falsification tests (decisions doc #1) to validate the 10-20MB working-set
 * assumption against real retail data.
 */
export function estimateGameDatasetBytes(dataset: GameDataset): number {
  return (
    tableBytes(dataset.clubs) +
    tableBytes(dataset.natClubs) +
    tableBytes(dataset.nations) +
    tableBytes(dataset.firstNames) +
    tableBytes(dataset.secondNames) +
    tableBytes(dataset.commonNames) +
    tableBytes(dataset.staff) +
    tableBytes(dataset.players)
  );
}

export * from './clubTable';
export * from './nationTable';
export * from './nameTable';
export * from './staffTable';
export * from './playerTable';
