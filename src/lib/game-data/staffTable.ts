// @paths lib/game-data
/**
 * Struct-of-arrays table for CM2Staff records (staff.dat base segment).
 */
import type { CM2Staff } from '../dat-parser/parser';
import type { NameTable } from './nameTable';

export interface StaffTable {
  length: number;
  id: Int32Array;
  firstName: Int32Array;
  secondName: Int32Array;
  commonName: Int32Array;
  nation: Int32Array;
  intApps: Uint8Array;
  intGoals: Uint8Array;
  clubJob: Int32Array;
  /** CM2Player.id this staff member plays as, -1 if not a player. */
  player: Int32Array;
  idToIndex: Map<number, number>;
}

export interface StaffRow {
  index: number;
  id: number;
  firstName: number;
  secondName: number;
  commonName: number;
  nation: number;
  intApps: number;
  intGoals: number;
  clubJob: number;
  player: number;
}

export function buildStaffTable(staff: CM2Staff[]): StaffTable {
  const length = staff.length;
  const table: StaffTable = {
    length,
    id: new Int32Array(length),
    firstName: new Int32Array(length),
    secondName: new Int32Array(length),
    commonName: new Int32Array(length),
    nation: new Int32Array(length),
    intApps: new Uint8Array(length),
    intGoals: new Uint8Array(length),
    clubJob: new Int32Array(length),
    player: new Int32Array(length),
    idToIndex: new Map(),
  };

  for (let i = 0; i < length; i++) {
    const member = staff[i];
    table.id[i] = member.id;
    table.firstName[i] = member.firstName;
    table.secondName[i] = member.secondName;
    table.commonName[i] = member.commonName;
    table.nation[i] = member.nation;
    table.intApps[i] = member.intApps;
    table.intGoals[i] = member.intGoals;
    table.clubJob[i] = member.clubJob;
    table.player[i] = member.player;
    table.idToIndex.set(member.id, i);
  }

  return table;
}

export function getStaffRow(table: StaffTable, index: number): StaffRow {
  return {
    index,
    id: table.id[index],
    firstName: table.firstName[index],
    secondName: table.secondName[index],
    commonName: table.commonName[index],
    nation: table.nation[index],
    intApps: table.intApps[index],
    intGoals: table.intGoals[index],
    clubJob: table.clubJob[index],
    player: table.player[index],
  };
}

export function findStaffRowById(table: StaffTable, id: number): StaffRow | null {
  const index = table.idToIndex.get(id);
  return index === undefined ? null : getStaffRow(table, index);
}

/**
 * Resolve a staff member's display name from the name tables. Same
 * common-name-wins convention as `resolveStaffName` in the .dat parser
 * (CM0102Patcher's `HistoryLoader.StaffToName`), operating on SoA tables
 * instead of object arrays.
 */
export function resolveStaffRowName(
  row: StaffRow,
  firstNames: NameTable,
  secondNames: NameTable,
  commonNames: NameTable
): string | null {
  if (row.firstName < 0 || row.firstName >= firstNames.length) return null;
  if (row.secondName < 0 || row.secondName >= secondNames.length) return null;

  const common = row.commonName >= 0 && row.commonName < commonNames.length ? commonNames.name[row.commonName] : null;
  if (common) return common;

  const first = firstNames.name[row.firstName];
  const second = secondNames.name[row.secondName];
  if (!first || !second) return null;
  return `${first} ${second}`;
}
