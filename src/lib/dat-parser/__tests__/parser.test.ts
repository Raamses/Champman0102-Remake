// @paths lib/dat-parser
import { describe, it, expect } from 'vitest';
import {
  parseIndexDat,
  parseCM2Club,
  parseClubDat,
  parseNatClubDat,
  parseCM2Nation,
  parseNationDat,
  parseCM2Name,
  parseNamesDat,
  parseCM2Staff,
  parseCM2PlayerAttrs,
  parseStaffDat,
  resolveStaffName,
} from '../parser';

// Helper to create a DataView from an array of bytes
function createView(bytes: number[]): DataView {
  const buffer = new ArrayBuffer(bytes.length);
  const view = new DataView(buffer);
  bytes.forEach((b, i) => view.setUint8(i, b));
  return view;
}

function bytesToBuffer(bytes: number[]): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.length);
  const view = new DataView(buffer);
  bytes.forEach((b, i) => view.setUint8(i, b));
  return buffer;
}

// Helper to write a fixed-width string into a byte array
function writeString(bytes: number[], offset: number, str: string, length: number) {
  for (let i = 0; i < length; i++) {
    bytes[offset + i] = i < str.length ? str.charCodeAt(i) : 0;
  }
}

function writeInt32(bytes: number[], offset: number, value: number) {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setInt32(0, value, true);
  const view = new Uint8Array(buf);
  for (let i = 0; i < 4; i++) bytes[offset + i] = view[i];
}

function writeInt16(bytes: number[], offset: number, value: number) {
  const buf = new ArrayBuffer(2);
  new DataView(buf).setInt16(0, value, true);
  const view = new Uint8Array(buf);
  for (let i = 0; i < 2; i++) bytes[offset + i] = view[i];
}

describe('parseIndexDat', () => {
  it('parses an 8-byte header followed by TIndex entries', () => {
    const entrySize = 67;
    const bytes = new Array(8 + entrySize * 2).fill(0);
    writeString(bytes, 8, 'club.dat', 51);
    writeInt32(bytes, 8 + 51, 0); // fileType
    writeInt32(bytes, 8 + 55, 10580); // count
    writeInt32(bytes, 8 + 59, 0); // offset
    writeInt32(bytes, 8 + 63, 2); // version

    writeString(bytes, 8 + entrySize, 'staff.dat', 51);
    writeInt32(bytes, 8 + entrySize + 51, 6);
    writeInt32(bytes, 8 + entrySize + 55, 132722);
    writeInt32(bytes, 8 + entrySize + 59, 0);
    writeInt32(bytes, 8 + entrySize + 63, 1);

    const entries = parseIndexDat(bytesToBuffer(bytes));
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({ name: 'club.dat', fileType: 0, count: 10580, offset: 0, version: 2 });
    expect(entries[1]).toEqual({ name: 'staff.dat', fileType: 6, count: 132722, offset: 0, version: 1 });
  });
});

describe('CM2Club parser (TClub, 581 bytes)', () => {
  it('parses a club record with name/shortName/squad at the real offsets', () => {
    const bytes = new Array(581).fill(0);
    writeInt32(bytes, 0, 676); // id (Arsenal's real club ID)
    writeString(bytes, 4, 'Arsenal', 51); // name
    writeString(bytes, 56, 'Arsenal', 26); // shortName
    writeInt32(bytes, 83, 7); // nation
    writeInt32(bytes, 87, 1); // division
    writeInt32(bytes, 101, 22961216); // cash
    writeInt16(bytes, 128, 180); // reputation (uint16, positive value reads the same via setInt16)
    writeInt32(bytes, 207, 5001); // manager
    writeInt32(bytes, 215, 88613); // squad[0] — a staff ID

    const view = new DataView(bytesToBuffer(bytes));
    const club = parseCM2Club(view, 0);

    expect(club.id).toBe(676);
    expect(club.name).toBe('Arsenal');
    expect(club.shortName).toBe('Arsenal');
    expect(club.nation).toBe(7);
    expect(club.division).toBe(1);
    expect(club.cash).toBe(22961216);
    expect(club.reputation).toBe(180);
    expect(club.manager).toBe(5001);
    expect(club.squad).toHaveLength(50);
    expect(club.squad[0]).toBe(88613);
  });
});

describe('parseClubDat / parseNatClubDat', () => {
  it('parses multiple 581-byte club records from a buffer', () => {
    const bytes = new Array(581 * 2).fill(0);
    writeInt32(bytes, 0, 0);
    writeString(bytes, 4, 'Arsenal', 51);
    writeInt32(bytes, 581, 1);
    writeString(bytes, 581 + 4, 'Liverpool', 51);

    const clubs = parseClubDat(bytesToBuffer(bytes));
    expect(clubs).toHaveLength(2);
    expect(clubs[0].name).toBe('Arsenal');
    expect(clubs[1].name).toBe('Liverpool');
  });

  it('parses nat_club.dat with the same TClub layout', () => {
    const bytes = new Array(581).fill(0);
    writeString(bytes, 4, 'England', 51);

    const teams = parseNatClubDat(bytesToBuffer(bytes));
    expect(teams).toHaveLength(1);
    expect(teams[0].name).toBe('England');
  });
});

describe('CM2Nation parser (TNation, 290 bytes)', () => {
  it('parses a nation record', () => {
    const bytes = new Array(290).fill(0);
    writeInt32(bytes, 0, 7);
    writeString(bytes, 4, 'England', 51);
    writeString(bytes, 56, 'England', 26);
    writeString(bytes, 83, 'ENG', 4);
    writeString(bytes, 87, 'English', 26);
    writeInt32(bytes, 113, 1);
    writeInt16(bytes, 134, 92);
    writeInt16(bytes, 142, 180);

    const view = new DataView(bytesToBuffer(bytes));
    const nation = parseCM2Nation(view, 0);

    expect(nation.id).toBe(7);
    expect(nation.name).toBe('England');
    expect(nation.shortName).toBe('England');
    expect(nation.threeLetterName).toBe('ENG');
    expect(nation.nationality).toBe('English');
    expect(nation.continent).toBe(1);
    expect(nation.numberClubs).toBe(92);
    expect(nation.reputation).toBe(180);
  });
});

describe('parseNationDat', () => {
  it('parses multiple 290-byte nation records from a buffer', () => {
    const bytes = new Array(290 * 2).fill(0);
    writeString(bytes, 4, 'England', 51);
    writeString(bytes, 290 + 4, 'Brazil', 51);

    const nations = parseNationDat(bytesToBuffer(bytes));
    expect(nations).toHaveLength(2);
    expect(nations[0].name).toBe('England');
    expect(nations[1].name).toBe('Brazil');
  });
});

describe('CM2Name parser (TNames, 60 bytes)', () => {
  it('parses a name record', () => {
    const bytes = new Array(60).fill(0);
    writeString(bytes, 0, 'Henry', 51);
    writeInt32(bytes, 51, 42);
    writeInt32(bytes, 55, 3);
    bytes[59] = 2;

    const view = new DataView(bytesToBuffer(bytes));
    const name = parseCM2Name(view, 0);

    expect(name.name).toBe('Henry');
    expect(name.id).toBe(42);
    expect(name.nation).toBe(3);
    expect(name.count).toBe(2);
  });

  it('parses multiple name records from a buffer', () => {
    const bytes = new Array(60 * 2).fill(0);
    writeString(bytes, 0, 'Thierry', 51);
    writeString(bytes, 60, 'Dennis', 51);

    const names = parseNamesDat(bytesToBuffer(bytes));
    expect(names).toHaveLength(2);
    expect(names[0].name).toBe('Thierry');
    expect(names[1].name).toBe('Dennis');
  });

  it('decodes CP1252 diacritics outside the Latin-1-identical range (0xA0+)', () => {
    // 0xF8 = 'ø', 0xE6 = 'æ' — Latin-1 and CP1252 agree here, so this alone
    // wouldn't catch a naive byte->charCode decoder.
    const bytes = new Array(60).fill(0);
    const raw = [0x53, 0xf8, 0x6c, 0x73, 0x6b, 0x6a, 0xe6, 0x72]; // "Sølskjær"
    raw.forEach((b, i) => (bytes[i] = b));

    const view = new DataView(bytesToBuffer(bytes));
    expect(parseCM2Name(view, 0).name).toBe('Sølskjær');
  });

  it('decodes the CP1252 0x80-0x9F block correctly, unlike a plain Latin-1 mapping', () => {
    // Byte 0x9E is 'ž' in true Windows-1252 but maps to the C1 control
    // U+009E under a naive byte->charCode (Latin-1) decode. Found via the
    // real retail second_names.dat fixture ("Gržej").
    const bytes = new Array(60).fill(0);
    const raw = [0x47, 0x72, 0x9e, 0x65, 0x6c, 0x6a]; // "Grželj"
    raw.forEach((b, i) => (bytes[i] = b));

    const view = new DataView(bytesToBuffer(bytes));
    expect(parseCM2Name(view, 0).name).toBe('Grželj');
  });
});

describe('CM2Staff parser (TStaff v1, 157 bytes)', () => {
  it('parses id/name-index/nation/clubJob/player at the real offsets', () => {
    const bytes = new Array(157).fill(0);
    writeInt32(bytes, 0, 88613); // id
    writeInt32(bytes, 4, 1029); // firstName index ("Dennis")
    writeInt32(bytes, 8, 43323); // secondName index ("Bergkamp")
    writeInt32(bytes, 26, 92); // nation
    bytes[34] = 79; // intApps
    bytes[35] = 37; // intGoals
    writeInt32(bytes, 57, 676); // clubJob (Arsenal)
    writeInt32(bytes, 145, 73003); // player index

    const view = new DataView(bytesToBuffer(bytes));
    const staff = parseCM2Staff(view, 0);

    expect(staff.id).toBe(88613);
    expect(staff.firstName).toBe(1029);
    expect(staff.secondName).toBe(43323);
    expect(staff.nation).toBe(92);
    expect(staff.intApps).toBe(79);
    expect(staff.intGoals).toBe(37);
    expect(staff.clubJob).toBe(676);
    expect(staff.player).toBe(73003);
  });
});

describe('CM2PlayerAttrs parser (TPlayer, 70 bytes)', () => {
  it('parses ability, positions and attributes at the real offsets', () => {
    const bytes = new Array(70).fill(0);
    writeInt32(bytes, 0, 73003); // id
    bytes[4] = 10; // squadNumber
    // currentAbility (uint16) = 165, potentialAbility (int16) = 185
    const abilityBuf = new ArrayBuffer(4);
    const abilityView = new DataView(abilityBuf);
    abilityView.setUint16(0, 165, true);
    abilityView.setInt16(2, 185, true);
    const abilityBytes = new Uint8Array(abilityBuf);
    for (let i = 0; i < 4; i++) bytes[5 + i] = abilityBytes[i];

    bytes[20] = 20; // attackingMidfielder
    bytes[21] = 20; // attacker
    bytes[25] = 20; // central
    bytes[40] = 18; // flair
    bytes[55] = 17; // passing
    bytes[39] = 16; // finishing

    const view = new DataView(bytesToBuffer(bytes));
    const player = parseCM2PlayerAttrs(view, 0);

    expect(player.id).toBe(73003);
    expect(player.squadNumber).toBe(10);
    expect(player.currentAbility).toBe(165);
    expect(player.potentialAbility).toBe(185);
    expect(player.positions.attackingMidfielder).toBe(20);
    expect(player.positions.attacker).toBe(20);
    expect(player.positions.central).toBe(20);
    expect(player.attributes.flair).toBe(18);
    expect(player.attributes.passing).toBe(17);
    expect(player.attributes.finishing).toBe(16);
  });
});

describe('parseStaffDat', () => {
  it('splits staff.dat into staff + player segments using index.dat offsets', () => {
    const staffBytes = new Array(157 * 2).fill(0);
    writeInt32(staffBytes, 0, 0);
    writeInt32(staffBytes, 4, 1); // firstName
    writeInt32(staffBytes, 8, 2); // secondName
    writeInt32(staffBytes, 57, 676); // clubJob
    writeInt32(staffBytes, 145, 0); // player index

    writeInt32(staffBytes, 157, 1);
    writeInt32(staffBytes, 157 + 4, 3);
    writeInt32(staffBytes, 157 + 8, 4);
    writeInt32(staffBytes, 157 + 57, -2); // no club job
    writeInt32(staffBytes, 157 + 145, -1); // not a player

    const playerSegmentOffset = 157 * 2;
    const fullBytes = staffBytes.concat(new Array(70).fill(0));
    writeInt32(fullBytes, playerSegmentOffset, 0); // player id
    fullBytes[playerSegmentOffset + 4] = 14; // squadNumber

    const buffer = bytesToBuffer(fullBytes);
    const bundle = parseStaffDat(buffer, [
      { name: 'staff.dat', fileType: 6, count: 2, offset: 0, version: 1 },
      { name: 'staff.dat', fileType: 10, count: 1, offset: playerSegmentOffset, version: 2 },
    ]);

    expect(bundle.staff).toHaveLength(2);
    expect(bundle.staff[0].clubJob).toBe(676);
    expect(bundle.staff[1].clubJob).toBe(-2);
    expect(bundle.players.get(0)?.squadNumber).toBe(14);
  });
});

describe('resolveStaffName', () => {
  it('joins first + second name when there is no common name', () => {
    const staff = { id: 1, firstName: 0, secondName: 0, commonName: -1, nation: 0, intApps: 0, intGoals: 0, clubJob: 676, player: 0 };
    const firstNames = [{ name: 'Thierry', id: 0, nation: 0, count: 0 }];
    const secondNames = [{ name: 'Henry', id: 0, nation: 0, count: 0 }];
    const commonNames: typeof firstNames = [];

    expect(resolveStaffName(staff, firstNames, secondNames, commonNames)).toBe('Thierry Henry');
  });

  it('prefers the common name when present', () => {
    const staff = { id: 1, firstName: 0, secondName: 0, commonName: 0, nation: 0, intApps: 0, intGoals: 0, clubJob: 676, player: 0 };
    const firstNames = [{ name: 'Ronaldo', id: 0, nation: 0, count: 0 }];
    const secondNames = [{ name: 'Luis Nazario de Lima', id: 0, nation: 0, count: 0 }];
    const commonNames = [{ name: 'Ronaldo', id: 0, nation: 0, count: 0 }];

    expect(resolveStaffName(staff, firstNames, secondNames, commonNames)).toBe('Ronaldo');
  });

  it('returns null for out-of-range name indices', () => {
    const staff = { id: 1, firstName: 999, secondName: 0, commonName: -1, nation: 0, intApps: 0, intGoals: 0, clubJob: -2, player: -1 };
    expect(resolveStaffName(staff, [], [], [])).toBeNull();
  });
});
