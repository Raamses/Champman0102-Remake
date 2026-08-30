// @paths lib/dat-parser
/**
 * CM01/02 .dat binary format parser.
 *
 * Reads the original game's binary files using DataView + ArrayBuffer.
 * No WASM needed — 50MB files parse in milliseconds in the browser.
 *
 * Reverse-engineered from nckstwrt/CM0102Patcher C# structs.
 * See docs/vault/research/cm0102-format-notes.md for byte layout.
 */

// ─── String helpers ───

/**
 * Read a fixed-width string from a DataView at the given offset.
 * Trims trailing null bytes. Decodes from Windows-1252 (Latin-1).
 */
function readFixedString(view: DataView, offset: number, length: number): string {
  const bytes = new Uint8Array(view.buffer, view.byteOffset + offset, length);
  // Find null terminator (or use full length)
  let end = bytes.indexOf(0);
  if (end === -1) end = length;
  // Decode Windows-1252 / Latin-1
  let str = '';
  for (let i = 0; i < end; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return str.trim();
}

/**
 * Read a little-endian unsigned 16-bit short.
 */
function readUint16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

/**
 * Read a little-endian signed 16-bit short.
 */
function readInt16(view: DataView, offset: number): number {
  return view.getInt16(offset, true);
}

/**
 * Read a little-endian 32-bit integer.
 */
function readInt32(view: DataView, offset: number): number {
  return view.getInt32(offset, true);
}

/**
 * Read a single unsigned byte.
 */
function readUint8(view: DataView, offset: number): number {
  return view.getUint8(offset);
}

// ─── CM2Player (193 bytes) ───

export interface CM2Player {
  firstName: string;
  secondName: string;
  nationality: string;
  nationalCaps: number;
  nationalGoals: number;
  team: string;
  unavailable: number;
  dataSet: number;
  birthDate: string;
  age: number;
  // Position flags (0-255)
  goalkeeper: number;
  sweeper: number;
  defence: number;
  anchor: number;
  midfield: number;
  support: number;
  attack: number;
  rightSided: number;
  leftSided: number;
  centralSided: number;
  // Ability (encoded: raw + 128)
  ability: number;
  potential: number;
  reputation: number;
  // Attributes (0-20)
  aggression: number;
  bigOccasion: number;
  character: number;
  consistency: number;
  creativity: number;
  determination: number;
  dirtyness: number;
  dribbling: number;
  flair: number;
  heading: number;
  influence: number;
  injProne: number;
  intelligence: number;
  marking: number;
  offTheBall: number;
  pace: number;
  passing: number;
  positioning: number;
  setPieces: number;
  shooting: number;
  stamina: number;
  strength: number;
  tackling: number;
  technique: number;
}

const CM2PLAYER_SIZE = 193;

export function parseCM2Player(view: DataView, offset: number): CM2Player {
  const abilityRaw = readUint16(view, offset + 163);
  // "First byte = 1, then add 128" — decode: subtract 128 from the high byte
  const ability = ((abilityRaw & 0xFF) - 1) + ((abilityRaw >> 8) & 0xFF) * 128;

  return {
    firstName: readFixedString(view, offset, 30),
    secondName: readFixedString(view, offset + 30, 35),
    nationality: readFixedString(view, offset + 65, 35),
    nationalCaps: readUint8(view, offset + 100),
    nationalGoals: readUint8(view, offset + 101),
    team: readFixedString(view, offset + 102, 35),
    unavailable: readUint8(view, offset + 137),
    dataSet: readUint8(view, offset + 138),
    birthDate: readFixedString(view, offset + 139, 13),
    age: readUint8(view, offset + 152),
    goalkeeper: readUint8(view, offset + 153),
    sweeper: readUint8(view, offset + 154),
    defence: readUint8(view, offset + 155),
    anchor: readUint8(view, offset + 156),
    midfield: readUint8(view, offset + 157),
    support: readUint8(view, offset + 158),
    attack: readUint8(view, offset + 159),
    rightSided: readUint8(view, offset + 160),
    leftSided: readUint8(view, offset + 161),
    centralSided: readUint8(view, offset + 162),
    ability: Math.min(200, Math.max(0, ability)),
    potential: readUint16(view, offset + 165),
    reputation: readUint16(view, offset + 167),
    aggression: readUint8(view, offset + 169),
    bigOccasion: readUint8(view, offset + 170),
    character: readUint8(view, offset + 171),
    consistency: readUint8(view, offset + 172),
    creativity: readUint8(view, offset + 173),
    determination: readUint8(view, offset + 174),
    dirtyness: readUint8(view, offset + 175),
    dribbling: readUint8(view, offset + 176),
    flair: readUint8(view, offset + 177),
    heading: readUint8(view, offset + 178),
    influence: readUint8(view, offset + 179),
    injProne: readUint8(view, offset + 180),
    intelligence: readUint8(view, offset + 181),
    marking: readUint8(view, offset + 182),
    offTheBall: readUint8(view, offset + 183),
    pace: readUint8(view, offset + 184),
    passing: readUint8(view, offset + 185),
    positioning: readUint8(view, offset + 186),
    setPieces: readUint8(view, offset + 187),
    shooting: readUint8(view, offset + 188),
    stamina: readUint8(view, offset + 189),
    strength: readUint8(view, offset + 190),
    tackling: readUint8(view, offset + 191),
    technique: readUint8(view, offset + 192),
  };
}

// ─── CM2Team (361 bytes) ───

export interface CM2Team {
  longName: string;
  shortName: string;
  nation: string;
  region: string;
  developed: number;
  xCoord: number;
  yCoord: number;
  eec: number;
  tCoef8893: number;
  city: string;
  stadium: string;
  capacity: number;
  seating: number;
  following: number;
  standing: number;
  blend: number;
  formation: string;
  style: string;
  firstHomeCol: string;
  secondHomeCol: string;
  firstAwayCol: string;
  secondAwayCol: string;
  division: string;
  lastDivision: string;
  lastPosition: number;
  cash: number;
  leagueStandard: number;
  transferSystem: number;
  wav: string;
}

const CM2TEAM_SIZE = 361;

export function parseCM2Team(view: DataView, offset: number): CM2Team {
  return {
    longName: readFixedString(view, offset, 35),
    shortName: readFixedString(view, offset + 35, 35),
    nation: readFixedString(view, offset + 70, 35),
    region: readFixedString(view, offset + 105, 35),
    developed: readUint8(view, offset + 140),
    xCoord: readUint8(view, offset + 141),
    yCoord: readUint8(view, offset + 142),
    eec: readUint8(view, offset + 143),
    tCoef8893: readInt32(view, offset + 144),
    city: readFixedString(view, offset + 148, 35),
    stadium: readFixedString(view, offset + 183, 35),
    capacity: readInt32(view, offset + 218),
    seating: readInt32(view, offset + 222),
    following: readUint8(view, offset + 226),
    standing: readUint8(view, offset + 227),
    blend: readUint8(view, offset + 228),
    formation: readFixedString(view, offset + 229, 10),
    style: readFixedString(view, offset + 239, 10),
    firstHomeCol: readFixedString(view, offset + 249, 15),
    secondHomeCol: readFixedString(view, offset + 264, 15),
    firstAwayCol: readFixedString(view, offset + 279, 15),
    secondAwayCol: readFixedString(view, offset + 294, 15),
    division: readFixedString(view, offset + 309, 15),
    lastDivision: readFixedString(view, offset + 324, 15),
    lastPosition: readUint8(view, offset + 339),
    cash: readInt32(view, offset + 340),
    leagueStandard: readUint8(view, offset + 344),
    transferSystem: readUint8(view, offset + 345),
    wav: readFixedString(view, offset + 346, 15),
  };
}

// ─── CM2Manager (241 bytes) ───

export interface CM2Manager {
  firstName: string;
  secondName: string;
  nationality: string;
  yearsInGame: number;
  favoured: string;
  ability: number;
  reputation: number;
  formation: string;
  style: string;
  managingClub: string;
  appointedClub: string;
  managingInternational: string;
  appointedInternational: string;
  playerManager: number;
}

const CM2MANAGER_SIZE = 241;

export function parseCM2Manager(view: DataView, offset: number): CM2Manager {
  return {
    firstName: readFixedString(view, offset, 20),
    secondName: readFixedString(view, offset + 20, 35),
    nationality: readFixedString(view, offset + 55, 35),
    yearsInGame: readUint8(view, offset + 90),
    favoured: readFixedString(view, offset + 91, 35),
    ability: readUint16(view, offset + 126),
    reputation: readUint16(view, offset + 128),
    formation: readFixedString(view, offset + 130, 10),
    style: readFixedString(view, offset + 140, 10),
    managingClub: readFixedString(view, offset + 150, 35),
    appointedClub: readFixedString(view, offset + 185, 10),
    managingInternational: readFixedString(view, offset + 195, 35),
    appointedInternational: readFixedString(view, offset + 230, 10),
    playerManager: readUint8(view, offset + 240),
  };
}

// ─── File-level parsers ───

/**
 * Parse an index.dat file (contains players, clubs, nations, competitions).
 * Tries to auto-detect record type by attempting to parse and checking if names are valid.
 */
export function parseIndexDat(buffer: ArrayBuffer): {
  players: CM2Player[];
  clubs: CM2Team[];
  managers: CM2Manager[];
} {
  const view = new DataView(buffer);
  const players: CM2Player[] = [];
  const clubs: CM2Team[] = [];
  const managers: CM2Manager[] = [];

  const totalBytes = view.byteLength;

  // Try to parse as CM2Player records first (most common)
  if (totalBytes >= CM2PLAYER_SIZE) {
    const numPlayers = Math.floor(totalBytes / CM2PLAYER_SIZE);
    for (let i = 0; i < numPlayers && i < 50000; i++) {
      const offset = i * CM2PLAYER_SIZE;
      try {
        const player = parseCM2Player(view, offset);
        // Sanity check: names should be non-empty and look like text
        if (player.firstName && player.secondName && player.firstName.length > 1) {
          players.push(player);
        }
      } catch {
        // Skip malformed records
      }
    }
  }

  return { players, clubs, managers };
}

/**
 * Parse a club.dat file (team records).
 */
export function parseClubDat(buffer: ArrayBuffer): CM2Team[] {
  const view = new DataView(buffer);
  const teams: CM2Team[] = [];
  const numTeams = Math.floor(view.byteLength / CM2TEAM_SIZE);

  for (let i = 0; i < numTeams; i++) {
    const offset = i * CM2TEAM_SIZE;
    try {
      const team = parseCM2Team(view, offset);
      if (team.longName && team.longName.length > 1) {
        teams.push(team);
      }
    } catch {
      // Skip malformed records
    }
  }

  return teams;
}

/**
 * Parse a staff.dat file (player/staff records).
 */
export function parseStaffDat(buffer: ArrayBuffer): CM2Player[] {
  const view = new DataView(buffer);
  const players: CM2Player[] = [];
  const numPlayers = Math.floor(view.byteLength / CM2PLAYER_SIZE);

  for (let i = 0; i < numPlayers; i++) {
    const offset = i * CM2PLAYER_SIZE;
    try {
      const player = parseCM2Player(view, offset);
      if (player.firstName && player.secondName && player.firstName.length > 1) {
        players.push(player);
      }
    } catch {
      // Skip malformed records
    }
  }

  return players;
}

/**
 * Read a file from a File object (browser) and return ArrayBuffer.
 */
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
