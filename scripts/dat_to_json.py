#!/usr/bin/env python3
"""
CM01/02 .dat → JSON converter.

Reads original CM01/02 binary .dat files and outputs JSON per entity type.
This is the fast path to getting data into the game — the TS runtime parser
comes later once the engine is proven.

Usage:
    python3 scripts/dat_to_json.py <dat_file> <entity_type> <output_json>

Entity types:
    player      — CM2Player struct (193 bytes) from staff.dat/index.dat
    team        — CM2Team struct (361 bytes) from club.dat
    manager     — CM2Manager struct (241 bytes)

Example:
    python3 scripts/dat_to_json.py data/staff.dat player data/players.json
    python3 scripts/dat_to_json.py data/club.dat team data/teams.json
"""

import json
import struct
import sys
from pathlib import Path


def read_fixed_string(data: bytes, offset: int, length: int) -> str:
    """Read a fixed-width string, trim trailing nulls, decode Windows-1252."""
    raw = data[offset:offset + length]
    null_pos = raw.find(b'\x00')
    if null_pos != -1:
        raw = raw[:null_pos]
    return raw.decode('windows-1252', errors='replace').strip()


def parse_player(data: bytes, offset: int):
    """Parse a CM2Player struct (193 bytes)."""
    if offset + 193 > len(data):
        return None

    ability_raw = struct.unpack_from('<H', data, offset + 163)[0]
    ability = ((ability_raw & 0xFF) - 1) + ((ability_raw >> 8) & 0xFF) * 128
    ability = max(0, min(200, ability))

    first_name = read_fixed_string(data, offset, 30)
    second_name = read_fixed_string(data, offset + 30, 35)
    if not first_name or not second_name:
        return None

    return {
        'firstName': first_name,
        'secondName': second_name,
        'nationality': read_fixed_string(data, offset + 65, 35),
        'nationalCaps': struct.unpack_from('B', data, offset + 100)[0],
        'nationalGoals': struct.unpack_from('B', data, offset + 101)[0],
        'team': read_fixed_string(data, offset + 102, 35),
        'unavailable': struct.unpack_from('B', data, offset + 137)[0],
        'dataSet': struct.unpack_from('B', data, offset + 138)[0],
        'birthDate': read_fixed_string(data, offset + 139, 13),
        'age': struct.unpack_from('B', data, offset + 152)[0],
        'positions': {
            'goalkeeper': struct.unpack_from('B', data, offset + 153)[0],
            'sweeper': struct.unpack_from('B', data, offset + 154)[0],
            'defence': struct.unpack_from('B', data, offset + 155)[0],
            'anchor': struct.unpack_from('B', data, offset + 156)[0],
            'midfield': struct.unpack_from('B', data, offset + 157)[0],
            'support': struct.unpack_from('B', data, offset + 158)[0],
            'attack': struct.unpack_from('B', data, offset + 159)[0],
            'rightSided': struct.unpack_from('B', data, offset + 160)[0],
            'leftSided': struct.unpack_from('B', data, offset + 161)[0],
            'centralSided': struct.unpack_from('B', data, offset + 162)[0],
        },
        'currentAbility': ability,
        'potentialAbility': struct.unpack_from('<H', data, offset + 165)[0],
        'reputation': struct.unpack_from('<H', data, offset + 167)[0],
        'attributes': {
            'aggression': struct.unpack_from('B', data, offset + 169)[0],
            'bigOccasion': struct.unpack_from('B', data, offset + 170)[0],
            'character': struct.unpack_from('B', data, offset + 171)[0],
            'consistency': struct.unpack_from('B', data, offset + 172)[0],
            'creativity': struct.unpack_from('B', data, offset + 173)[0],
            'determination': struct.unpack_from('B', data, offset + 174)[0],
            'dirtyness': struct.unpack_from('B', data, offset + 175)[0],
            'dribbling': struct.unpack_from('B', data, offset + 176)[0],
            'flair': struct.unpack_from('B', data, offset + 177)[0],
            'heading': struct.unpack_from('B', data, offset + 178)[0],
            'influence': struct.unpack_from('B', data, offset + 179)[0],
            'injProne': struct.unpack_from('B', data, offset + 180)[0],
            'intelligence': struct.unpack_from('B', data, offset + 181)[0],
            'marking': struct.unpack_from('B', data, offset + 182)[0],
            'offTheBall': struct.unpack_from('B', data, offset + 183)[0],
            'pace': struct.unpack_from('B', data, offset + 184)[0],
            'passing': struct.unpack_from('B', data, offset + 185)[0],
            'positioning': struct.unpack_from('B', data, offset + 186)[0],
            'setPieces': struct.unpack_from('B', data, offset + 187)[0],
            'shooting': struct.unpack_from('B', data, offset + 188)[0],
            'stamina': struct.unpack_from('B', data, offset + 189)[0],
            'strength': struct.unpack_from('B', data, offset + 190)[0],
            'tackling': struct.unpack_from('B', data, offset + 191)[0],
            'technique': struct.unpack_from('B', data, offset + 192)[0],
        },
    }


def parse_team(data: bytes, offset: int):
    """Parse a CM2Team struct (361 bytes)."""
    if offset + 361 > len(data):
        return None

    long_name = read_fixed_string(data, offset, 35)
    if not long_name or len(long_name) <= 1:
        return None

    return {
        'longName': long_name,
        'shortName': read_fixed_string(data, offset + 35, 35),
        'nation': read_fixed_string(data, offset + 70, 35),
        'region': read_fixed_string(data, offset + 105, 35),
        'developed': struct.unpack_from('B', data, offset + 140)[0],
        'xCoord': struct.unpack_from('B', data, offset + 141)[0],
        'yCoord': struct.unpack_from('B', data, offset + 142)[0],
        'eec': struct.unpack_from('B', data, offset + 143)[0],
        'tCoef8893': struct.unpack_from('<i', data, offset + 144)[0],
        'city': read_fixed_string(data, offset + 148, 35),
        'stadium': read_fixed_string(data, offset + 183, 35),
        'capacity': struct.unpack_from('<i', data, offset + 218)[0],
        'seating': struct.unpack_from('<i', data, offset + 222)[0],
        'following': struct.unpack_from('B', data, offset + 226)[0],
        'standing': struct.unpack_from('B', data, offset + 227)[0],
        'blend': struct.unpack_from('B', data, offset + 228)[0],
        'formation': read_fixed_string(data, offset + 229, 10),
        'style': read_fixed_string(data, offset + 239, 10),
        'firstHomeCol': read_fixed_string(data, offset + 249, 15),
        'secondHomeCol': read_fixed_string(data, offset + 264, 15),
        'firstAwayCol': read_fixed_string(data, offset + 279, 15),
        'secondAwayCol': read_fixed_string(data, offset + 294, 15),
        'division': read_fixed_string(data, offset + 309, 15),
        'lastDivision': read_fixed_string(data, offset + 324, 15),
        'lastPosition': struct.unpack_from('B', data, offset + 339)[0],
        'cash': struct.unpack_from('<i', data, offset + 340)[0],
        'leagueStandard': struct.unpack_from('B', data, offset + 344)[0],
        'transferSystem': struct.unpack_from('B', data, offset + 345)[0],
        'wav': read_fixed_string(data, offset + 346, 15),
    }


def parse_manager(data: bytes, offset: int):
    """Parse a CM2Manager struct (241 bytes)."""
    if offset + 241 > len(data):
        return None

    first_name = read_fixed_string(data, offset, 20)
    second_name = read_fixed_string(data, offset + 20, 35)
    if not first_name or not second_name:
        return None

    return {
        'firstName': first_name,
        'secondName': second_name,
        'nationality': read_fixed_string(data, offset + 55, 35),
        'yearsInGame': struct.unpack_from('B', data, offset + 90)[0],
        'favoured': read_fixed_string(data, offset + 91, 35),
        'ability': struct.unpack_from('<H', data, offset + 126)[0],
        'reputation': struct.unpack_from('<H', data, offset + 128)[0],
        'formation': read_fixed_string(data, offset + 130, 10),
        'style': read_fixed_string(data, offset + 140, 10),
        'managingClub': read_fixed_string(data, offset + 150, 35),
        'appointedClub': read_fixed_string(data, offset + 185, 10),
        'managingInternational': read_fixed_string(data, offset + 195, 35),
        'appointedInternational': read_fixed_string(data, offset + 230, 10),
        'playerManager': struct.unpack_from('B', data, offset + 240)[0],
    }


PARSERS = {
    'player': (parse_player, 193),
    'team': (parse_team, 361),
    'manager': (parse_manager, 241),
}


def convert_dat_to_json(dat_path: str, entity_type: str, output_path: str):
    """Convert a .dat file to JSON."""
    dat_path = Path(dat_path)
    output_path = Path(output_path)

    if not dat_path.exists():
        print(f"Error: {dat_path} not found", file=sys.stderr)
        sys.exit(1)

    if entity_type not in PARSERS:
        print(f"Error: Unknown entity type '{entity_type}'. Use: {', '.join(PARSERS.keys())}",
              file=sys.stderr)
        sys.exit(1)

    parser_fn, struct_size = PARSERS[entity_type]
    data = dat_path.read_bytes()

    records = []
    offset = 0

    while offset + struct_size <= len(data):
        record = parser_fn(data, offset)
        if record:
            records.append(record)
        offset += struct_size

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(records, indent=2, ensure_ascii=False), encoding='utf-8')

    print(f"Converted {len(records)} {entity_type} records from {dat_path}")
    print(f"Output: {output_path}")


def main():
    if len(sys.argv) != 4:
        print("Usage: python3 dat_to_json.py <dat_file> <entity_type> <output_json>")
        print("Entity types: player, team, manager")
        sys.exit(1)

    convert_dat_to_json(sys.argv[1], sys.argv[2], sys.argv[3])


if __name__ == '__main__':
    main()
