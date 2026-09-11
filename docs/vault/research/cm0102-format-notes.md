# CM01/02 .dat Binary Format Reference

**Source:** Reverse-engineered from `nckstwrt/CM0102Patcher` C# code, then
verified byte-for-byte against the real 2001 retail ISO's vanilla database
(CM-006).
**Date:** 2026-08-29, corrected 2026-09-11.
**Status:** Verified against real `.dat` files — Arsenal's 2001-02 squad
(Henry, Vieira, Bergkamp, Pires, Seaman, Campbell, Adams, Ljungberg, Wenger
as manager) round-trips correctly end to end.

## Correction (2026-09-11): wrong reference struct

The original version of this document used `CM2Player`/`CM2Team`/`CM2Manager`
from `CM0102Patcher/CM2.cs`. Those structs are **not** the CM01/02 format —
`CM2.cs`'s own `ReadData()` method reads them from `PLDATA1.DB1` /
`TMDATA.DB1` / `MGDATA.DB1`, which are files from the much older *CM2 96/97*
game. Applying them to real `club.dat`/`staff.dat` produced garbage (record
sizes didn't divide the file length evenly, e.g. `club.dat` % 361 != 0).

The correct reference is `CM0102Patcher/SaveChanger/Structures.cs`
(`TIndex`/`TClub`/`TStaff`/`TPlayer`/`TNonPlayer`/`TNation`/`TNames`), read
via `MiscFunctions.ReadFile<T>` in
`CM0102Patcher/History Editor/HistoryLoader.cs`. Every struct below was
confirmed against the real files: record sizes divide file lengths exactly,
`index.dat`'s declared counts match, and known real names/facts (club IDs,
squad numbers, position ratings) come out correct.

The biggest structural difference from the old (wrong) model: **most string
fields aren't inline**. Player/staff names, club/nation names are still
inline fixed-width strings in `TClub`/`TNation`, but a person's name is
stored as integer indices (`FirstName`, `SecondName`, `CommonName`) into
`first_names.dat`/`second_names.dat`/`common_names.dat`. `TStaff` also
mostly stores relationships (club, nation, player-extension) as integer IDs
rather than embedding data inline.

## Overview

CM01/02 stores game data in multiple `.dat` files, all directory-listed by
`index.dat`:
- `index.dat` — directory of every other file/segment (offsets, counts, format versions)
- `club.dat` / `nat_club.dat` — club / national-team records (same struct)
- `staff.dat` — three segments in one file: base staff records, non-player extension, player extension
- `nation.dat` — nation records
- `first_names.dat` / `second_names.dat` / `common_names.dat` — name tables, referenced by ID from `staff.dat`

Save games (`.sav`) are containers that unpack into these `.dat` files (per `agevak/CM0102` SaveUnpacker/SavePacker).

## String Encoding

- Fixed-width byte arrays (not null-terminated as a hard rule, but null-padded — trim trailing nulls when reading)
- Windows-1252 / Latin-1 encoding (NOT UTF-8) — confirmed via names with diacritics (e.g. "Arsène Wenger")
- Example: "Arsenal" in a 51-byte field = `[65,114,115,101,110,97,108,0,0,...,0]` (7 chars + 44 nulls)

## index.dat — directory of segments

```
Offset  Size  Field
0       8     Header (always zero in files examined)
8       67*N  TIndex entries, one per file/segment, to end of file
```

**TIndex entry (67 bytes):**

```
Offset  Size  Field       Encoding
0       51    Name        Fixed string — the target file name, e.g. "staff.dat"
51      4     FileType    Int32 — distinguishes multiple segments within one file
55      4     Count       Int32 — number of records in this segment
59      4     Offset      Int32 — byte offset of this segment within the target file
63      4     Version     Int32 — format version of this segment
```

`staff.dat` has **four** index entries against it, not one flat array:

| FileType | Meaning | Struct | Real counts (2001 retail) |
|----------|---------|--------|-----|
| 6 | Base staff records | `TStaff` | 132,722 |
| 8 | (unused in this file — count 0) | — | 0 |
| 9 | Non-player extension (staff, coaches, scouts, etc.) | `TNonPlayer` | 23,785 |
| 10 | Player extension (outfield/GK attributes) | `TPlayer` | 109,940 |

Every other `.dat` file has exactly one index entry and is a flat array of
one struct from offset 0.

## TClub (club.dat / nat_club.dat — 581 bytes)

Both files share this struct — `HistoryLoader.cs` reads `club.dat` and
`nat_club.dat` with the same `TClub` type. Confirmed: `club.dat` is exactly
`10580 * 581` bytes, `nat_club.dat` is exactly `426 * 581` bytes, matching
`index.dat`'s declared counts exactly.

```
Offset  Size    Field             Encoding
0       4       ID                Int32 — matches the record's own array index
4       51      Name              Fixed string
55      1       GenderName        Byte
56      26      ShortName         Fixed string
82      1       ShortGenderName   Byte
83      4       Nation            Int32 — FK into nation.dat
87      4       Division          Int32 — FK into club_comp.dat
91      4       LastDivision      Int32
95      1       LastPosition      Byte
96      4       ReserveDivision   Int32
100     1       ProfessionalStatus Byte
101     4       Cash              Int32
105     4       Stadium           Int32 — FK into stadium.dat
109     1       OwnStadium        Byte
110     4       ReserveStadium    Int32
114     1       MatchDay          Byte
115     4       Attendance        Int32
119     4       MinAttendance     Int32
123     4       MaxAttendance     Int32
127     1       Training          Byte
128     2       Reputation        UInt16
130     1       PLC               Byte
131..190 (60)   Fore/BackColour1-3, FavStaff1-3, DisStaff1-3, Rival1-3   6x Int32 colours + 9x Int32 FKs
191     4       Chairman          Int32 — FK into staff.dat
195     12      Directors         Int32[3] — FKs into staff.dat
207     4       Manager           Int32 — FK into staff.dat
211     4       AssistantManager  Int32 — FK into staff.dat
215     200     Squad             Int32[50] — FKs into staff.dat, -1 = empty slot
415     20      Coaches           Int32[5]
435     28      Scouts            Int32[7]
463     12      Physios           Int32[3]
475     4       EuroFlag          Int32
479     1       EuroSeeding       Byte
480     80      TeamSelected      Int32[20]
560     16      TacticTraining    Int32[4]
576     4       TacticSelected    Int32
580     1       HasLinkedClub     Byte
```

**Total size: 581 bytes per club.** Verified: Arsenal is club ID **676**
(`club[676].Name == "Arsenal"`, `ShortName == "Arsenal"`).

## nation.dat (TNation — 290 bytes)

Verified: `61770 / 290 = 213` exactly, matching `index.dat`'s declared count.
Only the fields needed so far are exposed by the parser; the struct
continues past `Reputation` with colours and UEFA/FIFA coefficients (see
`CM0102Patcher/SaveChanger/Structures.cs` for the full 0x11C+ tail) — not
needed for gameplay and not verified here.

```
Offset  Size  Field              Encoding
0       4     ID                 Int32
4       51    Name               Fixed string
55      1     GenderName         Byte
56      26    ShortName          Fixed string
82      1     ShortGenderName    Byte
83      4     ThreeLetterName    Fixed string
87      26    Nationality        Fixed string
113     4     Continent          Int32
117     1     Region             Byte
118     1     ActualRegion       Byte
119-121 3     First/Second/ThirdLanguage  Byte x3
122     4     CapitalCity        Int32
126     1     StateOfDevelopment Byte
127     1     GroupMembership    Byte
128     4     NationalStadium    Int32
132     1     GameImportance     Byte
133     1     LeagueStandard     Byte
134     2     NumberClubs        Int16
136     4     NumberStaff        Int32
140     2     SeasonUpdateDay    Int16
142     2     Reputation         Int16
```

(Struct continues to offset 290 with colours/coefficients — see source.)

## Name tables (first_names.dat / second_names.dat / common_names.dat — 60 bytes, TNames)

```
Offset  Size  Field   Encoding
0       51    Name    Fixed string
51      4     ID      Int32 — matches record's own array index
55      4     Nation  Int32 — FK into nation.dat
59      1     Count   SByte
```

Verified: `first_names.dat` = `34363 * 60`, `second_names.dat` = `82338 * 60`,
`common_names.dat` = `8493 * 60` — all exact, matching `index.dat`.

A person's display name is **not** inline. `TStaff.CommonName` (if valid and
non-empty) is used as-is; otherwise the display name is
`first_names[FirstName].Name + " " + second_names[SecondName].Name`
(see `HistoryLoader.StaffToName`).

## TStaff — base segment (staff.dat, FileType 6)

The real retail 2001 database is **format version 1** for this segment
(`index.dat` entry `Count=132722, Version=1`). CM0102Patcher's own `TStaff`
C# struct is **version 2** and is 110 bytes — `HistoryLoader.Load` explicitly
throws if it sees `Version == 1`, telling the user to re-save via the
in-game editor first. The real version-1 record is **157 bytes**, not 110.

Byte comparison against real records confirms version 1 and version 2 agree
from offset 0 through `ClubJob` at offset 57 inclusive (verified: `ID` is
sequential 0,1,2,... across records, and `ClubJob == 676` for every Arsenal
player/manager found). The extra 47 bytes live somewhere after that, in what
the v2 struct calls `JobForClub..SquadSelectedFor` (offsets 58-109 in v2) —
that region has **not** been fully remapped for v1 and isn't exposed by the
parser.

```
Offset  Size  Field         Encoding                          Status
0       4     ID            Int32, sequential                 verified
4       4     FirstName     Int32 — FK into first_names.dat    verified
8       4     SecondName    Int32 — FK into second_names.dat   verified
12      4     CommonName    Int32 — FK into common_names.dat   verified
16      8     DateOfBirth   TCMDate (Day:i16, Year:i16, LeapYear:i32)  not yet exposed by parser
24      2     YearOfBirth   UInt16                             not yet exposed by parser
26      4     Nation        Int32 — FK into nation.dat         verified
30      4     SecondNation  Int32                              not yet exposed by parser
34      1     IntApps       Byte                               verified
35      1     IntGoals      Byte                               verified
36..56  21    NationalJob/JobForNation/DateJoined-ExpiresNation  not yet exposed by parser
57      4     ClubJob       Int32 — FK into club.dat            verified (matches Arsenal ID 676 for every Arsenal player found)
58..144 87    unmapped (v1-only region, ~47 bytes larger than v2's equivalent span)  UNVERIFIED
145     4     Player        Int32 — index into the TPlayer segment, -1 if not a player  verified empirically (see below)
```

**Total size: 157 bytes per staff record** (real, version 1). Do not reuse
the 110-byte v2 size from `Structures.cs` — it under-reads real files by 47
bytes per record and misaligns every subsequent record.

`Player` at offset 145 was confirmed empirically, not by a byte-offset
comment in the C# source: for the staff record identified as
"Dennis Bergkamp" (`FirstName`→"Dennis", `SecondName`→"Bergkamp"), the value
at offset 145 indexes a `TPlayer` record with `SquadNumber == 10` (Bergkamp's
real Arsenal shirt number) and `AttackingMidfielder`/`Central` position
ratings of 20/20 — a match too specific to be coincidental.

## TPlayer — player extension (staff.dat, FileType 10 — 70 bytes)

Verified: segment length `30150534 - 22454734 = 7695800`, and
`7695800 / 70 = 109940` exactly, matching `index.dat`'s declared count.
`TPlayer.ID` is sequential (0, 1, 2, ...) within the segment and is what
`TStaff.Player` (offset 145) references.

```
Offset  Size  Field              Encoding
0       4     ID                 Int32, sequential
4       1     SquadNumber        Byte
5       2     CurrentAbility     UInt16
7       2     PotentialAbility   Int16
9       2     HomeReputation     UInt16
11      2     CurrentReputation  UInt16
13      2     WorldReputation    UInt16
15      12    Positions          SByte[12]: Goalkeeper, Sweeper, Defender, DefensiveMidfielder, Midfielder, AttackingMidfielder, Attacker, WingBack, RightSide, LeftSide, Central, FreeRole
27      41    Attributes         SByte[41], alphabetical-ish per `TPlayer` in Structures.cs (Acceleration..WorkRate), 1-20 scale
68      1     PlayerMorale       Byte
```

**Total size: 70 bytes per player.** All attribute/position bytes observed
in real data are within the expected 1-20 range.

## TNonPlayer — non-player extension (staff.dat, FileType 9 — 68 bytes)

Verified: segment length `22454734 - 20837354 = 1617380`, and
`1617380 / 23785 = 68` exactly, matching `index.dat`'s declared count. Not
exposed by the parser yet (not needed for CM-006's scope: player/club
verification) — layout is in `CM0102Patcher/SaveChanger/Structures.cs`'s
`TNonPlayer` class if needed later, but its exact byte offsets haven't been
independently re-verified against this 68-byte real stride the way `TClub`/
`TStaff`/`TPlayer` were.

## Verification performed (CM-006)

Cross-referencing `club.dat` + `staff.dat` + name tables against the real
2001-02 Arsenal squad, via `s.ClubJob == 676` (Arsenal's club ID):

- Found 63 staff records tied to Arsenal.
- Confirmed players: Thierry Henry, Patrick Vieira, Dennis Bergkamp, Robert
  Pires, David Seaman, Sol Campbell, Tony Adams, Martin Keown, Lee Dixon,
  Ashley Cole, Fredrik Ljungberg, Sylvain Wiltord, Gilles Grimandi, Ray
  Parlour, Nwankwo Kanu, Francis Jeffers, Stuart Taylor, Richard Wright.
- Confirmed manager: Arsène Wenger.
- Confirmed Dennis Bergkamp's `TPlayer` record: squad number 10 (his real
  Arsenal number), current ability 165, potential ability 185, all
  attribute/position bytes in range 1-20, and a central attacking-midfielder
  position profile consistent with his real playing role.

See `src/lib/dat-parser/__tests__/real-data.test.ts` for the automated
version of this check (runs only when the staged retail data files are
present on disk — they are not committed to the repo).

## Open questions (remaining)

1. **The 47-byte unmapped region in v1 `TStaff` (offsets 58-144).** Not
   needed for the CM-006 squad-verification goal, but will matter once
   contracts/wages/personality attributes are needed (Phase 1+ cards).
2. **`TNonPlayer` byte offsets** — struct size (68 bytes) confirmed via
   division, but individual field offsets not independently re-verified.
3. **Format-version handling** — this vanilla 2001 ISO has `staff.dat` at
   version 1 and `club.dat`/`nation.dat` at version 2. Patched/later saves
   may use version 2 `TStaff` (110 bytes) instead. The parser currently
   hardcodes the 157-byte v1 stride; a version-aware parser will be needed
   before supporting patched save files.
