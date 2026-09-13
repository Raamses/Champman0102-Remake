// @paths lib/game-data
/**
 * Struct-of-arrays table for CM2Name records (first_names.dat /
 * second_names.dat / common_names.dat). Row index IS the lookup key —
 * CM2Staff.firstName/secondName/commonName are indices into these tables —
 * so no id->index map is needed here.
 */
import type { CM2Name } from '../dat-parser/parser';

export interface NameTable {
  length: number;
  name: string[];
  id: Int32Array;
  nation: Int32Array;
  count: Int8Array;
}

export function buildNameTable(names: CM2Name[]): NameTable {
  const length = names.length;
  const table: NameTable = {
    length,
    name: new Array(length),
    id: new Int32Array(length),
    nation: new Int32Array(length),
    count: new Int8Array(length),
  };

  for (let i = 0; i < length; i++) {
    const entry = names[i];
    table.name[i] = entry.name;
    table.id[i] = entry.id;
    table.nation[i] = entry.nation;
    table.count[i] = entry.count;
  }

  return table;
}
