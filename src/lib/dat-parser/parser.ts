// @paths lib/dat-parser
/**
 * CM01/02 .dat binary format parser.
 *
 * Reads the original game's binary files using DataView + ArrayBuffer.
 * No WASM needed — files parse in milliseconds in the browser.
 *
 * Verified against the real retail 2001 vanilla database (CM-006). The
 * layout below is NOT the `CM2Player`/`CM2Team` structs in
 * `CM0102Patcher/CM2.cs` — those describe the much older CM2 96/97 game
 * (`PLDATA1.DB1` / `TMDATA.DB1`). The real CM01/02 `index.dat`/`club.dat`/
 * `staff.dat`/`nation.dat` format is the `TIndex`/`TClub`/`TStaff`/`TPlayer`/
 * `TNation`/`TNames` structs from `CM0102Patcher/SaveChanger/Structures.cs`.
 * See docs/vault/research/cm0102-format-notes.md for the full byte layout
 * and how it was verified (Arsenal's 2001-02 squad).
 */

// ─── String helpers ───

// True Windows-1252, not Latin-1: bytes 0x80-0x9F map to characters other
// than their codepoint (e.g. 0x9E is 'ž', not U+009E) — a plain
// byte-to-charCode loop silently corrupts real names in that range (found
// via the retail second_names.dat fixture: byte 0x9E in "Gržej" decoded to a
// control character instead of 'ž'). Reused across calls since this runs
// once per name/club/nation record.
const CP1252_DECODER = new TextDecoder('windows-1252');

/**
 * Read a fixed-width string from a DataView at the given offset.
 * Trims trailing null bytes. Decodes from Windows-1252.
 */
function readFixedString(view: DataView, offset: number, length: number): string {
  const bytes = new Uint8Array(view.buffer, view.byteOffset + offset, length);
  // Find null terminator (or use full length)
  let end = bytes.indexOf(0);
  if (end === -1) end = length;
  return CP1252_DECODER.decode(bytes.subarray(0, end)).trim();
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

/**
 * Read a single signed byte (used for player attributes, which are `sbyte`
 * in the source structs).
 */
function readInt8(view: DataView, offset: number): number {
  return view.getInt8(offset);
}

// ─── TIndex (index.dat) ───
//
// index.dat is a directory: an 8-byte header (always zero in the files
// examined) followed by fixed-size TIndex entries, one per data file/segment,
// running to end-of-file. Each entry names a `.dat` file and gives the
// byte offset + record count of a segment within it — `staff.dat` has
// multiple segments (staff / non-player / player), distinguished by
// `fileType` and located via `offset`/`count` rather than being one flat
// array of a single struct.

export interface DatIndexEntry {
  name: string;
  fileType: number;
  count: number;
  offset: number;
  version: number;
}

const INDEX_HEADER_SIZE = 8;
const TINDEX_SIZE = 67; // byte[51] Name + int FileType + int Count + int Offset + int Version

export function parseIndexDat(buffer: ArrayBuffer): DatIndexEntry[] {
  const view = new DataView(buffer);
  const entries: DatIndexEntry[] = [];
  const numEntries = Math.floor((view.byteLength - INDEX_HEADER_SIZE) / TINDEX_SIZE);

  for (let i = 0; i < numEntries; i++) {
    const offset = INDEX_HEADER_SIZE + i * TINDEX_SIZE;
    const name = readFixedString(view, offset, 51);
    if (!name) continue;
    entries.push({
      name,
      fileType: readInt32(view, offset + 51),
      count: readInt32(view, offset + 55),
      offset: readInt32(view, offset + 59),
      version: readInt32(view, offset + 63),
    });
  }

  return entries;
}

// ─── TClub (club.dat / nat_club.dat — 581 bytes) ───
//
// Shared by club.dat (domestic clubs) and nat_club.dat (national-team
// "clubs") — both are read with the same TClub struct in
// CM0102Patcher/History Editor/HistoryLoader.cs. Unlike the old CM2Team
// struct, most fields (nation, division, manager, squad, ...) are integer
// IDs into other tables, not inline strings.

export interface CM2Club {
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
  /** Staff IDs of the up-to-50 squad slots. Empty slots are -1. */
  squad: number[];
}

const CM2CLUB_SIZE = 581;

export function parseCM2Club(view: DataView, offset: number): CM2Club {
  const squad: number[] = [];
  const squadOffset = offset + 215;
  for (let i = 0; i < 50; i++) {
    squad.push(readInt32(view, squadOffset + i * 4));
  }

  return {
    id: readInt32(view, offset),
    name: readFixedString(view, offset + 4, 51),
    shortName: readFixedString(view, offset + 56, 26),
    nation: readInt32(view, offset + 83),
    division: readInt32(view, offset + 87),
    lastDivision: readInt32(view, offset + 91),
    lastPosition: readUint8(view, offset + 95),
    cash: readInt32(view, offset + 101),
    stadium: readInt32(view, offset + 105),
    reputation: readUint16(view, offset + 128),
    manager: readInt32(view, offset + 207),
    assistantManager: readInt32(view, offset + 211),
    squad,
  };
}

function parseClubRecords(buffer: ArrayBuffer): CM2Club[] {
  const view = new DataView(buffer);
  const clubs: CM2Club[] = [];
  const numClubs = Math.floor(view.byteLength / CM2CLUB_SIZE);

  for (let i = 0; i < numClubs; i++) {
    const offset = i * CM2CLUB_SIZE;
    const club = parseCM2Club(view, offset);
    if (club.name) clubs.push(club);
  }

  return clubs;
}

/**
 * Parse a club.dat file (domestic club records).
 */
export function parseClubDat(buffer: ArrayBuffer): CM2Club[] {
  return parseClubRecords(buffer);
}

/**
 * Parse a nat_club.dat file (national-team records — same binary layout as
 * club.dat).
 */
export function parseNatClubDat(buffer: ArrayBuffer): CM2Club[] {
  return parseClubRecords(buffer);
}

// ─── TNation (nation.dat — 290 bytes) ───

export interface CM2Nation {
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

const CM2NATION_SIZE = 290;

export function parseCM2Nation(view: DataView, offset: number): CM2Nation {
  return {
    id: readInt32(view, offset),
    name: readFixedString(view, offset + 4, 51),
    shortName: readFixedString(view, offset + 56, 26),
    threeLetterName: readFixedString(view, offset + 83, 4),
    nationality: readFixedString(view, offset + 87, 26),
    continent: readInt32(view, offset + 113),
    numberClubs: readInt16(view, offset + 134),
    numberStaff: readInt32(view, offset + 136),
    reputation: readInt16(view, offset + 142),
  };
}

export function parseNationDat(buffer: ArrayBuffer): CM2Nation[] {
  const view = new DataView(buffer);
  const nations: CM2Nation[] = [];
  const numNations = Math.floor(view.byteLength / CM2NATION_SIZE);

  for (let i = 0; i < numNations; i++) {
    const offset = i * CM2NATION_SIZE;
    const nation = parseCM2Nation(view, offset);
    if (nation.name) nations.push(nation);
  }

  return nations;
}

// ─── TNames (first_names.dat / second_names.dat / common_names.dat — 60 bytes) ───
//
// Player/staff names are NOT stored inline — `TStaff` stores integer indices
// into these three name tables, which `staff.dat` records are resolved
// against (see `resolveStaffName`).

export interface CM2Name {
  name: string;
  id: number;
  nation: number;
  count: number;
}

const CM2NAME_SIZE = 60;

export function parseCM2Name(view: DataView, offset: number): CM2Name {
  return {
    name: readFixedString(view, offset, 51),
    id: readInt32(view, offset + 51),
    nation: readInt32(view, offset + 55),
    count: readInt8(view, offset + 59),
  };
}

export function parseNamesDat(buffer: ArrayBuffer): CM2Name[] {
  const view = new DataView(buffer);
  const names: CM2Name[] = [];
  const numNames = Math.floor(view.byteLength / CM2NAME_SIZE);

  for (let i = 0; i < numNames; i++) {
    names.push(parseCM2Name(view, i * CM2NAME_SIZE));
  }

  return names;
}

// ─── TStaff (staff.dat, base segment) ───
//
// The retail 2001 vanilla database is format version 1. CM0102Patcher's
// `TStaff` struct (Structures.cs) is version 2 and is 110 bytes; the real
// version-1 struct is 157 bytes. Byte-for-byte comparison against the real
// file confirms the two versions agree from offset 0 up to and including
// `ClubJob` at offset 57 — the extra 47 bytes live somewhere in the
// version-2 struct's tail (JobForClub..SquadSelectedFor, offsets 58-109),
// which has not been fully remapped. `player` (offset 145) is confirmed
// empirically: it indexes the TPlayer segment and lines up with known facts
// (e.g. Dennis Bergkamp's real squad number and attacking-midfielder rating).
// Fields between ClubJob and `player` are not exposed here — see
// docs/vault/research/cm0102-format-notes.md.

export interface CM2Staff {
  id: number;
  firstName: number;
  secondName: number;
  commonName: number;
  nation: number;
  intApps: number;
  intGoals: number;
  /** Club ID this person is employed by (player, manager, or other staff). -1/-2 if none. */
  clubJob: number;
  /** Index into the TPlayer segment if this person is a player, else -1. */
  player: number;
}

const TSTAFF_V1_SIZE = 157;
const TSTAFF_PLAYER_FIELD_OFFSET = 145;

export function parseCM2Staff(view: DataView, offset: number): CM2Staff {
  return {
    id: readInt32(view, offset),
    firstName: readInt32(view, offset + 4),
    secondName: readInt32(view, offset + 8),
    commonName: readInt32(view, offset + 12),
    nation: readInt32(view, offset + 26),
    intApps: readUint8(view, offset + 34),
    intGoals: readUint8(view, offset + 35),
    clubJob: readInt32(view, offset + 57),
    player: readInt32(view, offset + TSTAFF_PLAYER_FIELD_OFFSET),
  };
}

function parseStaffRecords(buffer: ArrayBuffer, byteOffset: number, count: number): CM2Staff[] {
  const view = new DataView(buffer);
  const staff: CM2Staff[] = [];
  const maxCount = Math.min(count, Math.floor((buffer.byteLength - byteOffset) / TSTAFF_V1_SIZE));

  for (let i = 0; i < maxCount; i++) {
    staff.push(parseCM2Staff(view, byteOffset + i * TSTAFF_V1_SIZE));
  }

  return staff;
}

// ─── TPlayer (staff.dat, player segment — 70 bytes) ───

export interface CM2PlayerPositions {
  goalkeeper: number;
  sweeper: number;
  defender: number;
  defensiveMidfielder: number;
  midfielder: number;
  attackingMidfielder: number;
  attacker: number;
  wingBack: number;
  rightSide: number;
  leftSide: number;
  central: number;
  freeRole: number;
}

export interface CM2PlayerAttributes {
  acceleration: number;
  aggression: number;
  agility: number;
  anticipation: number;
  balance: number;
  bravery: number;
  consistency: number;
  corners: number;
  crossing: number;
  decisions: number;
  dirtiness: number;
  dribbling: number;
  finishing: number;
  flair: number;
  freeKicks: number;
  handling: number;
  heading: number;
  importantMatches: number;
  injuryProneness: number;
  jumping: number;
  leadership: number;
  leftFoot: number;
  longShots: number;
  marking: number;
  movement: number;
  naturalFitness: number;
  oneOnOnes: number;
  pace: number;
  passing: number;
  penalties: number;
  positioning: number;
  reflexes: number;
  rightFoot: number;
  stamina: number;
  strength: number;
  tackling: number;
  teamwork: number;
  technique: number;
  throwIns: number;
  versatility: number;
  vision: number;
  workRate: number;
}

export interface CM2Player {
  id: number;
  squadNumber: number;
  currentAbility: number;
  potentialAbility: number;
  positions: CM2PlayerPositions;
  attributes: CM2PlayerAttributes;
}

const CM2PLAYER_ATTR_SIZE = 70;

export function parseCM2PlayerAttrs(view: DataView, offset: number): CM2Player {
  return {
    id: readInt32(view, offset),
    squadNumber: readUint8(view, offset + 4),
    currentAbility: readUint16(view, offset + 5),
    potentialAbility: readInt16(view, offset + 7),
    positions: {
      goalkeeper: readInt8(view, offset + 15),
      sweeper: readInt8(view, offset + 16),
      defender: readInt8(view, offset + 17),
      defensiveMidfielder: readInt8(view, offset + 18),
      midfielder: readInt8(view, offset + 19),
      attackingMidfielder: readInt8(view, offset + 20),
      attacker: readInt8(view, offset + 21),
      wingBack: readInt8(view, offset + 22),
      rightSide: readInt8(view, offset + 23),
      leftSide: readInt8(view, offset + 24),
      central: readInt8(view, offset + 25),
      freeRole: readInt8(view, offset + 26),
    },
    attributes: {
      acceleration: readInt8(view, offset + 27),
      aggression: readInt8(view, offset + 28),
      agility: readInt8(view, offset + 29),
      anticipation: readInt8(view, offset + 30),
      balance: readInt8(view, offset + 31),
      bravery: readInt8(view, offset + 32),
      consistency: readInt8(view, offset + 33),
      corners: readInt8(view, offset + 34),
      crossing: readInt8(view, offset + 35),
      decisions: readInt8(view, offset + 36),
      dirtiness: readInt8(view, offset + 37),
      dribbling: readInt8(view, offset + 38),
      finishing: readInt8(view, offset + 39),
      flair: readInt8(view, offset + 40),
      freeKicks: readInt8(view, offset + 41),
      handling: readInt8(view, offset + 42),
      heading: readInt8(view, offset + 43),
      importantMatches: readInt8(view, offset + 44),
      injuryProneness: readInt8(view, offset + 45),
      jumping: readInt8(view, offset + 46),
      leadership: readInt8(view, offset + 47),
      leftFoot: readInt8(view, offset + 48),
      longShots: readInt8(view, offset + 49),
      marking: readInt8(view, offset + 50),
      movement: readInt8(view, offset + 51),
      naturalFitness: readInt8(view, offset + 52),
      oneOnOnes: readInt8(view, offset + 53),
      pace: readInt8(view, offset + 54),
      passing: readInt8(view, offset + 55),
      penalties: readInt8(view, offset + 56),
      positioning: readInt8(view, offset + 57),
      reflexes: readInt8(view, offset + 58),
      rightFoot: readInt8(view, offset + 59),
      stamina: readInt8(view, offset + 60),
      strength: readInt8(view, offset + 61),
      tackling: readInt8(view, offset + 62),
      teamwork: readInt8(view, offset + 63),
      technique: readInt8(view, offset + 64),
      throwIns: readInt8(view, offset + 65),
      versatility: readInt8(view, offset + 66),
      vision: readInt8(view, offset + 67),
      workRate: readInt8(view, offset + 68),
    },
  };
}

function parsePlayerRecords(buffer: ArrayBuffer, byteOffset: number, count: number): Map<number, CM2Player> {
  const view = new DataView(buffer);
  const players = new Map<number, CM2Player>();
  const maxCount = Math.min(count, Math.floor((buffer.byteLength - byteOffset) / CM2PLAYER_ATTR_SIZE));

  for (let i = 0; i < maxCount; i++) {
    const player = parseCM2PlayerAttrs(view, byteOffset + i * CM2PLAYER_ATTR_SIZE);
    players.set(player.id, player);
  }

  return players;
}

// ─── staff.dat (combined, via index.dat directory) ───

export interface StaffDatBundle {
  staff: CM2Staff[];
  /** Keyed by CM2Player.id, which is what CM2Staff.player references. */
  players: Map<number, CM2Player>;
}

/**
 * Parse staff.dat using the segment offsets/counts recorded in index.dat.
 * staff.dat is not a flat array of one struct — it holds a `TStaff` segment
 * (fileType 6) plus separate `TPlayer` (fileType 10) and `TNonPlayer`
 * (fileType 9) extension segments, located by byte offset.
 */
export function parseStaffDat(buffer: ArrayBuffer, indexEntries: DatIndexEntry[]): StaffDatBundle {
  const staffEntry = indexEntries.find((e) => e.name === 'staff.dat' && e.fileType === 6);
  const playerEntry = indexEntries.find((e) => e.name === 'staff.dat' && e.fileType === 10);

  const staff = staffEntry ? parseStaffRecords(buffer, staffEntry.offset, staffEntry.count) : [];
  const players = playerEntry ? parsePlayerRecords(buffer, playerEntry.offset, playerEntry.count) : new Map();

  return { staff, players };
}

/**
 * Resolve a staff member's display name from the first/second/common name
 * tables (see `parseNamesDat`). Mirrors `HistoryLoader.StaffToName` in
 * CM0102Patcher.
 */
export function resolveStaffName(
  staffMember: CM2Staff,
  firstNames: CM2Name[],
  secondNames: CM2Name[],
  commonNames: CM2Name[]
): string | null {
  if (staffMember.firstName < 0 || staffMember.firstName >= firstNames.length) return null;
  if (staffMember.secondName < 0 || staffMember.secondName >= secondNames.length) return null;

  const common = commonNames[staffMember.commonName]?.name;
  if (staffMember.commonName >= 0 && staffMember.commonName < commonNames.length && common) {
    return common;
  }

  const first = firstNames[staffMember.firstName].name;
  const second = secondNames[staffMember.secondName].name;
  if (!first || !second) return null;
  return `${first} ${second}`;
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
