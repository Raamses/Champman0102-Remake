// @paths lib/game-data
/**
 * Struct-of-arrays table for CM2Club records (club.dat / nat_club.dat).
 *
 * Each numeric field is its own compact TypedArray column instead of one JS
 * object per club — avoids the object-per-record allocation cost the
 * decisions doc calls out (D1's 242k-object blowup) while keeping random
 * access O(1) by row index.
 */
import type { CM2Club } from '../dat-parser/parser';

export const CLUB_SQUAD_SIZE = 50;

export interface ClubTable {
  length: number;
  id: Int32Array;
  name: string[];
  shortName: string[];
  nation: Int32Array;
  division: Int32Array;
  lastDivision: Int32Array;
  lastPosition: Uint8Array;
  cash: Int32Array;
  stadium: Int32Array;
  reputation: Uint16Array;
  manager: Int32Array;
  assistantManager: Int32Array;
  /** Flattened [row * CLUB_SQUAD_SIZE + slot] — staff ids, -1 for empty slots. */
  squad: Int32Array;
  /** club id -> row index, for resolving references from other tables. */
  idToIndex: Map<number, number>;
}

export interface ClubRow {
  index: number;
  id: number;
  name: string;
  shortName: string;
  nation: number;
  division: number;
  lastDivision: number;
  lastPosition: number;
  cash: number;
  stadium: number;
  reputation: number;
  manager: number;
  assistantManager: number;
  squad: number[];
}

export function buildClubTable(clubs: CM2Club[]): ClubTable {
  const length = clubs.length;
  const table: ClubTable = {
    length,
    id: new Int32Array(length),
    name: new Array(length),
    shortName: new Array(length),
    nation: new Int32Array(length),
    division: new Int32Array(length),
    lastDivision: new Int32Array(length),
    lastPosition: new Uint8Array(length),
    cash: new Int32Array(length),
    stadium: new Int32Array(length),
    reputation: new Uint16Array(length),
    manager: new Int32Array(length),
    assistantManager: new Int32Array(length),
    squad: new Int32Array(length * CLUB_SQUAD_SIZE),
    idToIndex: new Map(),
  };

  for (let i = 0; i < length; i++) {
    const club = clubs[i];
    table.id[i] = club.id;
    table.name[i] = club.name;
    table.shortName[i] = club.shortName;
    table.nation[i] = club.nation;
    table.division[i] = club.division;
    table.lastDivision[i] = club.lastDivision;
    table.lastPosition[i] = club.lastPosition;
    table.cash[i] = club.cash;
    table.stadium[i] = club.stadium;
    table.reputation[i] = club.reputation;
    table.manager[i] = club.manager;
    table.assistantManager[i] = club.assistantManager;
    for (let s = 0; s < CLUB_SQUAD_SIZE; s++) {
      table.squad[i * CLUB_SQUAD_SIZE + s] = club.squad[s] ?? -1;
    }
    table.idToIndex.set(club.id, i);
  }

  return table;
}

export function getClubRow(table: ClubTable, index: number): ClubRow {
  const start = index * CLUB_SQUAD_SIZE;
  return {
    index,
    id: table.id[index],
    name: table.name[index],
    shortName: table.shortName[index],
    nation: table.nation[index],
    division: table.division[index],
    lastDivision: table.lastDivision[index],
    lastPosition: table.lastPosition[index],
    cash: table.cash[index],
    stadium: table.stadium[index],
    reputation: table.reputation[index],
    manager: table.manager[index],
    assistantManager: table.assistantManager[index],
    squad: Array.from(table.squad.subarray(start, start + CLUB_SQUAD_SIZE)),
  };
}

export function findClubRowById(table: ClubTable, id: number): ClubRow | null {
  const index = table.idToIndex.get(id);
  return index === undefined ? null : getClubRow(table, index);
}
