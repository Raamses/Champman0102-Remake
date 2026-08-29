# CM01/02 .dat Binary Format Reference

**Source:** Reverse-engineered from `nckstwrt/CM0102Patcher` C# code
**Date:** 2026-08-29
**Status:** Verified against C# struct definitions — NOT yet verified against actual .dat files

## Overview

CM01/02 stores game data in multiple `.dat` files:
- `index.dat` — main database (clubs, staff, nations, competitions)
- `club.dat` — club details
- `staff.dat` — player/staff records
- `nation.dat` — nation data
- `nat_club.dat` — national team clubs

Save games (`.sav`) are containers that unpack into these `.dat` files (per `agevak/CM0102` SaveUnpacker/SavePacker).

## String Encoding

- Fixed-width byte arrays (not null-terminated, not length-prefixed)
- Likely Windows-1252 / Latin-1 encoding (NOT UTF-8)
- Trim trailing null bytes when reading
- Example: "Arsenal" in a 35-byte field = `[65,114,115,101,110,97,108,0,0,...,0]` (7 chars + 28 nulls)

## CM2Player Struct (staff.dat / index.dat player records)

```
Offset  Size  Field             Encoding
0       30    FirstName         Fixed string, 30 bytes
30      35    SecondName         Fixed string, 35 bytes
65      35    Nationality        Fixed string, 35 bytes
100     1     NationalCaps      Byte (0-255)
101     1     NationalGoals      Byte (0-255)
102     35    Team               Fixed string, 35 bytes
137     1     Unavailable        Byte flag
138     1     DataSet            Byte
139     13    BirthDate          Fixed string, 13 bytes (format: "d.M.yy")
152     1     Age                Byte
153     1     Goalkeeper         Byte (0-255, position rating)
154     1     Sweeper            Byte (0-255)
155     1     Defence            Byte (0-255)
156     1     Anchor             Byte (0-255)
157     1     Midfield           Byte (0-255)
158     1     Support            Byte (0-255)
159     1     Attack             Byte (0-255)
160     1     RightSided         Byte (0-255)
161     1     LeftSided          Byte (0-255)
162     1     CentralSided       Byte (0-255)
163     2     Ability            Short — ENCODING: "First byte = 1, then add 128"
165     2     Potential          Short
167     2     Reputation         Short
169     1     Aggression         Byte (0-20)
170     1     BigOccasion        Byte (0-20)
171     1     Character         Byte (0-20)
172     1     Consistency       Byte (0-20)
173     1     Creativity        Byte (0-20)
174     1     Determination      Byte (0-20)
175     1     Dirtyness         Byte (0-20)
176     1     Dribbling         Byte (0-20)
177     1     Flair             Byte (0-20)
178     1     Heading           Byte (0-20)
179     1     Influence         Byte (0-20)
180     1     InjProne          Byte (0-20)
181     1     Intelligence      Byte (0-20)
182     1     Marking           Byte (0-20)
183     1     OffTheBall        Byte (0-20)
184     1     Pace              Byte (0-20)
185     1     Passing           Byte (0-20)
186     1     Positioning       Byte (0-20)
187     1     SetPieces         Byte (0-20)
188     1     Shooting         Byte (0-20)
189     1     Stamina           Byte (0-20)
190     1     Strength          Byte (0-20)
191     1     Tackling          Byte (0-20)
192     1     Technique         Byte (0-20)
```

**Total size: 193 bytes per player**

### Critical Notes

1. **Ability encoding**: The C# comment says "First byte = 1, then add 128". This likely means the raw short value needs `value + 128` or some bit manipulation. Must verify with actual data.

2. **Attribute names differ from modern FM**:
   - `Shooting` (NOT `Finishing`)
   - `SetPieces` (NOT `FreeKicks`)
   - `Intelligence` (NOT `Decisions`)
   - `Dirtyness` (NOT `Aggression` — Aggression is separate)
   - `BigOccasion` (NOT `Composure`)
   - `InjProne` (NOT `InjuryProneness` — abbreviated in binary)

3. **Positions are byte values (0-255), not computed ratings**: The game interprets these as position familiarity. Higher = more natural in that position.

4. **No hidden attributes in this struct**: Hidden attributes (adaptability, ambition, controversy, loyalty, pressure, professionalism, temperament, sportsmanship, discipline, consistency, importantMatches, injuryProneness, versatility) may be stored elsewhere or derived. The plan's list of hidden attributes may not match what's actually in the .dat files.

## CM2Team Struct (club.dat / team data)

```
Offset  Size  Field             Encoding
0       35    LongName           Fixed string
35      35    ShortName          Fixed string
70      35    Nation             Fixed string
105     35    Region             Fixed string
140     1     Developed          Byte
141     1     XCoord             Byte (map position)
142     1     YCoord             Byte (map position)
143     1     EEC                Byte (EU membership flag?)
144     4     TCoef8893          Int32 (UEFA coefficient 1988-1993)
148     35    City               Fixed string
183     35    Stadium            Fixed string
218     4     Capacity           Int32
222     4     Seating            Int32
226     1     Following          Byte
227     1     Standing           Byte
228     1     Blend              Byte
229     10    Formation          Fixed string (10 bytes)
239     10    Style              Fixed string (10 bytes)
249     15    FirstHomeCol       Fixed string (kit colors)
264     15    SecondHomeCol      Fixed string
279     15    FirstAwayCol      Fixed string
294     15    SecondAwayCol     Fixed string
309     15    Division          Fixed string (league code, e.g. "EPR", "ED1")
324     15    LastDivision       Fixed string
339     1     LastPosition       Byte
340     4     Cash              Int32 (club finances)
344     1     LeagueStandard    Byte
345     1     TransferSystem    Byte
346     15    Wav               Fixed string (sound file reference)
```

**Total size: 361 bytes per team**

### Division Codes (from C# code)

| Code | League |
|------|--------|
| `EPR` | English Premier Division |
| `ED1` | English First Division |
| `ED2` | English Second Division |
| `ED3` | English Third Division |
| `SPR` | Scottish Premier Division |
| `SD1` | Scottish First Division |
| `SD2` | Scottish Second Division |
| `SD3` | Scottish Third Division |

## CM2Manager Struct

```
Offset  Size  Field                  Encoding
0       20    FirstName              Fixed string
20      35    SecondName             Fixed string
55      35    Nationality            Fixed string
90      1     YearsInGame            Byte
91      35    Favoured               Fixed string (favored club)
126     2     Ability                Short
128     2     Reputation             Short
130     10    Formation              Fixed string
140     10    Style                  Fixed string
150     35    ManagingClub           Fixed string
185     10    AppointedClub          Fixed string
195     35    ManagingInternational  Fixed string
230     10    AppointedInternational Fixed string
240     1     PlayerManager          Byte (flag: 1 = human player)
```

**Total size: 241 bytes per manager**

## Parsing Strategy for Rust→WASM

1. Read file as raw bytes
2. Determine record count (file size / struct size, or from a header)
3. For each record, read at fixed offsets using `std::io::Cursor` or direct byte slicing
4. Convert strings: trim trailing nulls, decode from Windows-1252 to UTF-8
5. Transform Ability: apply the "add 128" decoding
6. Return structured data to JS via `wasm-bindgen`

## Open Questions

1. **Does `index.dat` have a header?** The C# code reads it via a `HistoryLoader` that seems to understand the file structure. Need to inspect actual file.
2. **Are there more fields not in these structs?** The C# structs may be for CM2 (the predecessor), not CM0102 specifically. The code references both CM2 and CM0102 data.
3. **Where are hidden attributes stored?** The CM2Player struct has ~20 attributes, but the plan lists 40+. Hidden attributes may be in a separate section or a different version of the struct.
4. **What is the record count and ordering?** Are records fixed-size and sequential, or is there an index/offset table?

## Spike Plan

1. Obtain a CM01/02 installation or `.dat` files
2. Hex-dump the first 1000 bytes of `index.dat` — look for header structure
3. Try reading at offset 0 with CM2Player struct — check if names make sense
4. If not, try CM2Team struct — club names should be identifiable
5. Map out record boundaries and count
6. Write minimal Rust parser that dumps first 10 clubs + 10 players
7. Verify against known CM01/02 data (e.g., "Manchester United", "David Beckham" for 2001/02 season)