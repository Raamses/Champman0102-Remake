// @paths lib/game-data
/**
 * Struct-of-arrays table for CM2Player records (staff.dat player segment).
 *
 * Positions and attributes are the bulk of the per-player payload (54 sbyte
 * fields) — packed into two flattened Int8Array columns (one row's worth of
 * slots per player) instead of nested objects, since these are the fields
 * that dominate the working-set estimate for the full player pool.
 */
import type { CM2Player, CM2PlayerAttributes, CM2PlayerPositions } from '../dat-parser/parser';

export const POSITION_FIELDS: (keyof CM2PlayerPositions)[] = [
  'goalkeeper',
  'sweeper',
  'defender',
  'defensiveMidfielder',
  'midfielder',
  'attackingMidfielder',
  'attacker',
  'wingBack',
  'rightSide',
  'leftSide',
  'central',
  'freeRole',
];

export const ATTRIBUTE_FIELDS: (keyof CM2PlayerAttributes)[] = [
  'acceleration',
  'aggression',
  'agility',
  'anticipation',
  'balance',
  'bravery',
  'consistency',
  'corners',
  'crossing',
  'decisions',
  'dirtiness',
  'dribbling',
  'finishing',
  'flair',
  'freeKicks',
  'handling',
  'heading',
  'importantMatches',
  'injuryProneness',
  'jumping',
  'leadership',
  'leftFoot',
  'longShots',
  'marking',
  'movement',
  'naturalFitness',
  'oneOnOnes',
  'pace',
  'passing',
  'penalties',
  'positioning',
  'reflexes',
  'rightFoot',
  'stamina',
  'strength',
  'tackling',
  'teamwork',
  'technique',
  'throwIns',
  'versatility',
  'vision',
  'workRate',
];

export const POSITION_COUNT = POSITION_FIELDS.length;
export const ATTRIBUTE_COUNT = ATTRIBUTE_FIELDS.length;

export interface PlayerTable {
  length: number;
  id: Int32Array;
  squadNumber: Uint8Array;
  currentAbility: Uint16Array;
  potentialAbility: Int16Array;
  /** Flattened [row * POSITION_COUNT + POSITION_FIELDS.indexOf(field)]. */
  positions: Int8Array;
  /** Flattened [row * ATTRIBUTE_COUNT + ATTRIBUTE_FIELDS.indexOf(field)]. */
  attributes: Int8Array;
  /** CM2Player id -> row index (staff.dat player segment ids aren't contiguous). */
  idToIndex: Map<number, number>;
}

export interface PlayerRow {
  index: number;
  id: number;
  squadNumber: number;
  currentAbility: number;
  potentialAbility: number;
  positions: CM2PlayerPositions;
  attributes: CM2PlayerAttributes;
}

function packFlat<TField extends string>(
  dest: Int8Array,
  base: number,
  fields: readonly TField[],
  source: Record<TField, number>
): void {
  for (let f = 0; f < fields.length; f++) {
    dest[base + f] = source[fields[f]];
  }
}

function unpackFlat<TField extends string>(
  src: Int8Array,
  base: number,
  fields: readonly TField[]
): Record<TField, number> {
  const result = {} as Record<TField, number>;
  for (let f = 0; f < fields.length; f++) {
    result[fields[f]] = src[base + f];
  }
  return result;
}

export function buildPlayerTable(players: CM2Player[] | Map<number, CM2Player>): PlayerTable {
  const list = players instanceof Map ? Array.from(players.values()) : players;
  const length = list.length;
  const table: PlayerTable = {
    length,
    id: new Int32Array(length),
    squadNumber: new Uint8Array(length),
    currentAbility: new Uint16Array(length),
    potentialAbility: new Int16Array(length),
    positions: new Int8Array(length * POSITION_COUNT),
    attributes: new Int8Array(length * ATTRIBUTE_COUNT),
    idToIndex: new Map(),
  };

  for (let i = 0; i < length; i++) {
    const player = list[i];
    table.id[i] = player.id;
    table.squadNumber[i] = player.squadNumber;
    table.currentAbility[i] = player.currentAbility;
    table.potentialAbility[i] = player.potentialAbility;

    packFlat(table.positions, i * POSITION_COUNT, POSITION_FIELDS, player.positions);
    packFlat(table.attributes, i * ATTRIBUTE_COUNT, ATTRIBUTE_FIELDS, player.attributes);

    table.idToIndex.set(player.id, i);
  }

  return table;
}

export function getPlayerRow(table: PlayerTable, index: number): PlayerRow {
  const positions = unpackFlat(table.positions, index * POSITION_COUNT, POSITION_FIELDS);
  const attributes = unpackFlat(table.attributes, index * ATTRIBUTE_COUNT, ATTRIBUTE_FIELDS);

  return {
    index,
    id: table.id[index],
    squadNumber: table.squadNumber[index],
    currentAbility: table.currentAbility[index],
    potentialAbility: table.potentialAbility[index],
    positions,
    attributes,
  };
}

export function findPlayerRowById(table: PlayerTable, id: number): PlayerRow | null {
  const index = table.idToIndex.get(id);
  return index === undefined ? null : getPlayerRow(table, index);
}
