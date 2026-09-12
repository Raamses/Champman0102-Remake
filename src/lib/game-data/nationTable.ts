// @paths lib/game-data
/**
 * Struct-of-arrays table for CM2Nation records (nation.dat).
 */
import type { CM2Nation } from '../dat-parser/parser';

export interface NationTable {
  length: number;
  id: Int32Array;
  name: string[];
  shortName: string[];
  threeLetterName: string[];
  nationality: string[];
  continent: Int32Array;
  numberClubs: Uint16Array;
  numberStaff: Int32Array;
  reputation: Uint16Array;
  idToIndex: Map<number, number>;
}

export interface NationRow {
  index: number;
  id: number;
  name: string;
  shortName: string;
  threeLetterName: string;
  nationality: string;
  continent: number;
  numberClubs: number;
  numberStaff: number;
  reputation: number;
}

export function buildNationTable(nations: CM2Nation[]): NationTable {
  const length = nations.length;
  const table: NationTable = {
    length,
    id: new Int32Array(length),
    name: new Array(length),
    shortName: new Array(length),
    threeLetterName: new Array(length),
    nationality: new Array(length),
    continent: new Int32Array(length),
    numberClubs: new Uint16Array(length),
    numberStaff: new Int32Array(length),
    reputation: new Uint16Array(length),
    idToIndex: new Map(),
  };

  for (let i = 0; i < length; i++) {
    const nation = nations[i];
    table.id[i] = nation.id;
    table.name[i] = nation.name;
    table.shortName[i] = nation.shortName;
    table.threeLetterName[i] = nation.threeLetterName;
    table.nationality[i] = nation.nationality;
    table.continent[i] = nation.continent;
    table.numberClubs[i] = nation.numberClubs;
    table.numberStaff[i] = nation.numberStaff;
    table.reputation[i] = nation.reputation;
    table.idToIndex.set(nation.id, i);
  }

  return table;
}

export function getNationRow(table: NationTable, index: number): NationRow {
  return {
    index,
    id: table.id[index],
    name: table.name[index],
    shortName: table.shortName[index],
    threeLetterName: table.threeLetterName[index],
    nationality: table.nationality[index],
    continent: table.continent[index],
    numberClubs: table.numberClubs[index],
    numberStaff: table.numberStaff[index],
    reputation: table.reputation[index],
  };
}

export function findNationRowById(table: NationTable, id: number): NationRow | null {
  const index = table.idToIndex.get(id);
  return index === undefined ? null : getNationRow(table, index);
}
