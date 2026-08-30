// @paths lib/dat-parser
import { describe, it, expect } from 'vitest';
import {
  parseCM2Player,
  parseCM2Team,
  parseCM2Manager,
  parseStaffDat,
  parseClubDat,
} from '../parser';

// Helper to create a DataView from an array of bytes
function createView(bytes: number[]): DataView {
  const buffer = new ArrayBuffer(bytes.length);
  const view = new DataView(buffer);
  bytes.forEach((b, i) => view.setUint8(i, b));
  return view;
}

// Helper to write a fixed-width string into a byte array
function writeString(bytes: number[], offset: number, str: string, length: number) {
  for (let i = 0; i < length; i++) {
    bytes[offset + i] = i < str.length ? str.charCodeAt(i) : 0;
  }
}

describe('CM2Player parser', () => {
  it('parses a valid player record', () => {
    const bytes = new Array(193).fill(0);
    writeString(bytes, 0, 'David', 30);         // firstName
    writeString(bytes, 30, 'Beckham', 35);        // secondName
    writeString(bytes, 65, 'England', 35);       // nationality
    bytes[100] = 50;                             // caps
    bytes[101] = 15;                             // goals
    writeString(bytes, 102, 'Manchester United', 35); // team
    bytes[152] = 27;                             // age
    bytes[153] = 0;                              // GK
    bytes[159] = 90;                             // attack
    bytes[157] = 85;                             // midfield
    bytes[158] = 80;                             // support

    // Ability encoding: first byte = 1, then add 128
    // raw = 1 + (some_value * 256) where some_value encodes the ability
    // For ability = 180: high byte = 180 >> 7 = 1 (carry), low byte = 180 - 128 = 52
    // Actually: raw short = low_byte + high_byte * 256
    // Decode: (raw & 0xFF) - 1 + (raw >> 8) * 128
    // For ability = 180: we want (raw & 0xFF) - 1 + (raw >> 8) * 128 = 180
    // Let raw >> 8 = 1, (raw & 0xFF) = 53 -> raw = 1 * 256 + 53 = 309
    bytes[163] = 53;   // low byte
    bytes[164] = 1;    // high byte

    bytes[188] = 16;                             // shooting
    bytes[185] = 18;                             // passing
    bytes[177] = 17;                             // flair

    const view = createView(bytes);
    const player = parseCM2Player(view, 0);

    expect(player.firstName).toBe('David');
    expect(player.secondName).toBe('Beckham');
    expect(player.nationality).toBe('England');
    expect(player.nationalCaps).toBe(50);
    expect(player.nationalGoals).toBe(15);
    expect(player.team).toBe('Manchester United');
    expect(player.age).toBe(27);
    expect(player.attack).toBe(90);
    expect(player.midfield).toBe(85);
    expect(player.support).toBe(80);
    expect(player.shooting).toBe(16);
    expect(player.passing).toBe(18);
    expect(player.flair).toBe(17);
  });
});

describe('CM2Team parser', () => {
  it('parses a valid team record', () => {
    const bytes = new Array(361).fill(0);
    writeString(bytes, 0, 'Arsenal Football Club', 35);  // longName
    writeString(bytes, 35, 'Arsenal', 35);               // shortName
    writeString(bytes, 70, 'England', 35);               // nation
    writeString(bytes, 105, 'London', 35);               // region
    writeString(bytes, 148, 'London', 35);               // city
    writeString(bytes, 183, 'Highbury', 35);             // stadium
    // capacity at offset 218 (int32, little-endian) = 38449 (0x9631)
    bytes[218] = 0x31; bytes[219] = 0x96; bytes[220] = 0; bytes[221] = 0;
    writeString(bytes, 309, 'EPR', 15);                  // division
    // cash at offset 340 (int32, little-endian) = 22976128 (0x015E5C40)
    bytes[340] = 0x40; bytes[341] = 0x5C; bytes[342] = 0x5E; bytes[343] = 0x01;

    const view = createView(bytes);
    const team = parseCM2Team(view, 0);

    expect(team.longName).toBe('Arsenal Football Club');
    expect(team.shortName).toBe('Arsenal');
    expect(team.nation).toBe('England');
    expect(team.city).toBe('London');
    expect(team.stadium).toBe('Highbury');
    expect(team.capacity).toBe(38449);
    expect(team.division).toBe('EPR');
    expect(team.cash).toBe(22961216);
  });
});

describe('parseStaffDat', () => {
  it('parses multiple player records from a buffer', () => {
    const numPlayers = 3;
    const bytes = new Array(193 * numPlayers).fill(0);

    // Player 1
    writeString(bytes, 0, 'Thierry', 30);
    writeString(bytes, 30, 'Henry', 35);
    writeString(bytes, 65, 'France', 35);

    // Player 2
    writeString(bytes, 193, 'Dennis', 30);
    writeString(bytes, 193 + 30, 'Bergkamp', 35);
    writeString(bytes, 193 + 65, 'Netherlands', 35);

    // Player 3
    writeString(bytes, 386, 'Sol', 30);
    writeString(bytes, 386 + 30, 'Campbell', 35);
    writeString(bytes, 386 + 65, 'England', 35);

    const buffer = new ArrayBuffer(bytes.length);
    const view = new DataView(buffer);
    bytes.forEach((b, i) => view.setUint8(i, b));

    const players = parseStaffDat(buffer);
    expect(players.length).toBe(3);
    expect(players[0].firstName).toBe('Thierry');
    expect(players[0].secondName).toBe('Henry');
    expect(players[1].firstName).toBe('Dennis');
    expect(players[1].secondName).toBe('Bergkamp');
    expect(players[2].firstName).toBe('Sol');
    expect(players[2].secondName).toBe('Campbell');
  });
});
