"""Tests for the Python .dat → JSON converter."""

import json
import struct
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.dat_to_json import read_fixed_string, parse_player, parse_team, convert_dat_to_json


def write_string(data: bytearray, offset: int, s: str, length: int) -> None:
    for i in range(length):
        data[offset + i] = ord(s[i]) if i < len(s) else 0


def test_read_fixed_string():
    data = b'Hello\x00\x00\x00World\x00\x00\x00'
    assert read_fixed_string(data, 0, 8) == 'Hello'
    assert read_fixed_string(data, 8, 11) == 'World'


def test_parse_player_basic():
    data = bytearray(193)
    write_string(data, 0, 'David', 30)
    write_string(data, 30, 'Beckham', 35)
    write_string(data, 65, 'England', 35)
    data[100] = 50  # caps
    data[101] = 15  # goals
    write_string(data, 102, 'Manchester United', 35)
    data[152] = 27  # age
    data[153] = 10  # GK
    data[159] = 90  # attack
    data[157] = 85  # midfield

    # Ability: raw = 1*256 + 53 = 309
    struct.pack_into('<H', data, 163, 309)

    data[188] = 16  # shooting
    data[185] = 18  # passing
    data[177] = 17  # flair

    player = parse_player(bytes(data), 0)
    assert player is not None
    assert player['firstName'] == 'David'
    assert player['secondName'] == 'Beckham'
    assert player['nationality'] == 'England'
    assert player['nationalCaps'] == 50
    assert player['team'] == 'Manchester United'
    assert player['age'] == 27
    assert player['positions']['attack'] == 90
    assert player['positions']['midfield'] == 85
    assert player['attributes']['shooting'] == 16
    assert player['attributes']['passing'] == 18
    assert player['attributes']['flair'] == 17


def test_parse_team_basic():
    data = bytearray(361)
    write_string(data, 0, 'Arsenal Football Club', 35)
    write_string(data, 35, 'Arsenal', 35)
    write_string(data, 70, 'England', 35)
    write_string(data, 148, 'London', 35)
    write_string(data, 183, 'Highbury', 35)
    # capacity = 38417 (0x9611)
    struct.pack_into('<i', data, 218, 38417)
    write_string(data, 309, 'EPR', 15)
    # cash = 26700000 (0x01975C40)
    struct.pack_into('<i', data, 340, 26700000)

    team = parse_team(bytes(data), 0)
    assert team is not None
    assert team['longName'] == 'Arsenal Football Club'
    assert team['shortName'] == 'Arsenal'
    assert team['nation'] == 'England'
    assert team['city'] == 'London'
    assert team['stadium'] == 'Highbury'
    assert team['capacity'] == 38417
    assert team['division'] == 'EPR'
    assert team['cash'] == 26700000


def test_parse_player_returns_none_for_empty():
    data = bytearray(193)
    player = parse_player(bytes(data), 0)
    assert player is None  # No names


def test_convert_dat_to_json_integration():
    """Test full file conversion."""
    num_records = 3
    data = bytearray(193 * num_records)

    # Player 1
    write_string(data, 0, 'Thierry', 30)
    write_string(data, 30, 'Henry', 35)
    write_string(data, 65, 'France', 35)

    # Player 2
    write_string(data, 193, 'Dennis', 30)
    write_string(data, 193 + 30, 'Bergkamp', 35)
    write_string(data, 193 + 65, 'Netherlands', 35)

    # Player 3
    write_string(data, 386, 'Sol', 30)
    write_string(data, 386 + 30, 'Campbell', 35)
    write_string(data, 386 + 65, 'England', 35)

    with tempfile.NamedTemporaryFile(suffix='.dat', delete=False) as f:
        f.write(bytes(data))
        dat_path = f.name

    with tempfile.NamedTemporaryFile(suffix='.json', delete=False) as f:
        json_path = f.name

    try:
        convert_dat_to_json(dat_path, 'player', json_path)
        result = json.loads(Path(json_path).read_text())
        assert len(result) == 3
        assert result[0]['firstName'] == 'Thierry'
        assert result[1]['secondName'] == 'Bergkamp'
        assert result[2]['nationality'] == 'England'
    finally:
        Path(dat_path).unlink(missing_ok=True)
        Path(json_path).unlink(missing_ok=True)


if __name__ == '__main__':
    test_read_fixed_string()
    test_parse_player_basic()
    test_parse_team_basic()
    test_parse_player_returns_none_for_empty()
    test_convert_dat_to_json_integration()
    print("All tests passed!")
