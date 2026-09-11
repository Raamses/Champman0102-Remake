// @paths lib/dat-parser
/**
 * CM01/02 `player_setup.cfg` parser + merge (CM-005).
 *
 * `player_setup.cfg` is a plain-text (ISO-8859-1, CRLF) patch file layered on
 * top of the binary `.dat` database — it carries "as of release" facts that
 * weren't baked into staff.dat: players who'd already retired, picked up a
 * starting injury, gone out on loan, etc. Each non-comment, non-blank line is
 * a quoted-string/number record:
 *
 *   "RETIREMENT" "Alex" "Sir Alex Ferguson" "Ferguson" "Manchester United" 23 7 2002
 *   "INT_RETIREMENT" "Tony" "" "Adams" "Arsenal"
 *   "INJURY" "Lee" "" "Dixon" "Arsenal" "TORN_KNEE_LIG"
 *   "LOAN" "Alex" "" "Manninger" "Arsenal" "Fiorentina" 30 6 2001 30 6 2002
 *
 * Fields are firstName / commonName / lastName, then type-specific fields.
 * commonName mirrors the empty-string-means-"use first+last" convention
 * `resolveStaffName` (parser.ts) already uses for the binary name tables, so
 * the two sources merge on the same display name.
 *
 * The file also carries FALSE_PASSPORT / FUTURE_TRANSFER / MANAGER_CONF /
 * MISCONDUCT / NANDROLONE records — out of scope for CM-005 (only
 * injuries/loans/retirements) — those lines are skipped.
 */
import type { CM2Club, CM2Name, CM2Staff } from './parser';
import { resolveStaffName } from './parser';

export interface CfgDate {
  day: number;
  month: number;
  year: number;
}

interface CfgPersonFields {
  firstName: string;
  commonName: string;
  lastName: string;
}

export interface RetirementEntry extends CfgPersonFields {
  clubName: string;
  date: CfgDate;
}

export interface IntRetirementEntry extends CfgPersonFields {
  clubName: string;
}

export interface InjuryEntry extends CfgPersonFields {
  clubName: string;
  injuryType: string;
  severityDays: number | null;
}

export interface LoanEntry extends CfgPersonFields {
  fromClubName: string;
  toClubName: string;
  startDate: CfgDate;
  endDate: CfgDate;
}

export interface PlayerSetupCfg {
  retirements: RetirementEntry[];
  intRetirements: IntRetirementEntry[];
  injuries: InjuryEntry[];
  loans: LoanEntry[];
}

// ─── Tokenizer ───
//
// Each line is a sequence of "quoted strings" and bare numbers separated by
// whitespace. Quotes may contain non-ASCII (Latin-1) characters.

type CfgToken = { kind: 'string'; value: string } | { kind: 'number'; value: number };

function tokenizeCfgLine(line: string): CfgToken[] {
  const tokens: CfgToken[] = [];
  let i = 0;
  const n = line.length;

  while (i < n) {
    const c = line[i];
    if (c === '"') {
      const end = line.indexOf('"', i + 1);
      if (end === -1) break;
      tokens.push({ kind: 'string', value: line.slice(i + 1, end) });
      i = end + 1;
    } else if (/\s/.test(c)) {
      i++;
    } else {
      let j = i;
      while (j < n && !/\s/.test(line[j])) j++;
      const raw = line.slice(i, j);
      const num = Number(raw);
      if (!Number.isNaN(num) && raw !== '') tokens.push({ kind: 'number', value: num });
      i = j;
    }
  }

  return tokens;
}

function strAt(tokens: CfgToken[], index: number): string | null {
  const t = tokens[index];
  return t && t.kind === 'string' ? t.value : null;
}

function numAt(tokens: CfgToken[], index: number): number | null {
  const t = tokens[index];
  return t && t.kind === 'number' ? t.value : null;
}

/**
 * Parse the full text of `player_setup.cfg` into typed retirement / injury /
 * loan records. Unrecognized or malformed lines (comments, blank lines, the
 * other record types, truncated records) are silently skipped.
 */
export function parsePlayerSetupCfg(text: string): PlayerSetupCfg {
  const retirements: RetirementEntry[] = [];
  const intRetirements: IntRetirementEntry[] = [];
  const injuries: InjuryEntry[] = [];
  const loans: LoanEntry[] = [];

  const lines = text.split(/\r\n|\r|\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const tokens = tokenizeCfgLine(trimmed);
    const type = strAt(tokens, 0);
    if (!type) continue;

    const firstName = strAt(tokens, 1);
    const commonName = strAt(tokens, 2);
    const lastName = strAt(tokens, 3);
    if (firstName === null || commonName === null || lastName === null) continue;
    const person: CfgPersonFields = { firstName, commonName, lastName };

    switch (type) {
      case 'RETIREMENT': {
        const clubName = strAt(tokens, 4);
        const day = numAt(tokens, 5);
        const month = numAt(tokens, 6);
        const year = numAt(tokens, 7);
        if (clubName === null || day === null || month === null || year === null) continue;
        retirements.push({ ...person, clubName, date: { day, month, year } });
        break;
      }
      case 'INT_RETIREMENT': {
        const clubName = strAt(tokens, 4);
        if (clubName === null) continue;
        intRetirements.push({ ...person, clubName });
        break;
      }
      case 'INJURY': {
        const clubName = strAt(tokens, 4);
        const injuryType = strAt(tokens, 5);
        if (clubName === null || injuryType === null) continue;
        const severityDays = numAt(tokens, 6);
        injuries.push({ ...person, clubName, injuryType, severityDays });
        break;
      }
      case 'LOAN': {
        const fromClubName = strAt(tokens, 4);
        const toClubName = strAt(tokens, 5);
        const sDay = numAt(tokens, 6);
        const sMonth = numAt(tokens, 7);
        const sYear = numAt(tokens, 8);
        const eDay = numAt(tokens, 9);
        const eMonth = numAt(tokens, 10);
        const eYear = numAt(tokens, 11);
        if (
          fromClubName === null ||
          toClubName === null ||
          sDay === null ||
          sMonth === null ||
          sYear === null ||
          eDay === null ||
          eMonth === null ||
          eYear === null
        )
          continue;
        loans.push({
          ...person,
          fromClubName,
          toClubName,
          startDate: { day: sDay, month: sMonth, year: sYear },
          endDate: { day: eDay, month: eMonth, year: eYear },
        });
        break;
      }
      default:
        // FALSE_PASSPORT / FUTURE_TRANSFER / MANAGER_CONF / MISCONDUCT /
        // NANDROLONE / anything else — out of scope for CM-005.
        break;
    }
  }

  return { retirements, intRetirements, injuries, loans };
}

// ─── Merge against staff.dat / club.dat ───

export interface MergedInjury extends InjuryEntry {
  staffId: number;
}

export interface MergedLoan extends LoanEntry {
  staffId: number;
  fromClubId: number | null;
  toClubId: number | null;
}

export interface MergedRetirement extends RetirementEntry {
  staffId: number;
  clubId: number | null;
}

export interface MergedIntRetirement extends IntRetirementEntry {
  staffId: number;
  clubId: number | null;
}

export interface MergedPlayerSetup {
  retirements: MergedRetirement[];
  intRetirements: MergedIntRetirement[];
  injuries: MergedInjury[];
  loans: MergedLoan[];
  /** Counts of cfg entries that couldn't be matched to a unique staff/club record. */
  unmatchedCounts: {
    retirements: number;
    intRetirements: number;
    injuries: number;
    loans: number;
  };
}

function personDisplayName(person: CfgPersonFields): string {
  return person.commonName || `${person.firstName} ${person.lastName}`;
}

function buildStaffNameIndex(
  staff: CM2Staff[],
  firstNames: CM2Name[],
  secondNames: CM2Name[],
  commonNames: CM2Name[]
): Map<string, CM2Staff[]> {
  const index = new Map<string, CM2Staff[]>();
  for (const member of staff) {
    const name = resolveStaffName(member, firstNames, secondNames, commonNames);
    if (!name) continue;
    const bucket = index.get(name);
    if (bucket) bucket.push(member);
    else index.set(name, [member]);
  }
  return index;
}

function buildClubNameIndex(clubs: CM2Club[]): Map<string, number> {
  const index = new Map<string, number>();
  for (const club of clubs) {
    if (club.name) index.set(club.name.toLowerCase(), club.id);
    if (club.shortName) index.set(club.shortName.toLowerCase(), club.id);
  }
  return index;
}

/**
 * Resolve a cfg person + club-name hint to a single staff record. If the
 * name matches more than one staff member, the club hint (when non-empty)
 * disambiguates; if it still doesn't resolve to exactly one match, returns
 * null (caller counts it as unmatched rather than guessing).
 */
function matchStaff(
  person: CfgPersonFields,
  clubName: string,
  nameIndex: Map<string, CM2Staff[]>,
  clubIndex: Map<string, number>
): { staff: CM2Staff; clubId: number | null } | null {
  const candidates = nameIndex.get(personDisplayName(person));
  if (!candidates || candidates.length === 0) return null;

  const clubId = clubName ? clubIndex.get(clubName.toLowerCase()) ?? null : null;

  if (candidates.length === 1) {
    return { staff: candidates[0], clubId };
  }

  if (clubId !== null) {
    const atClub = candidates.filter((c) => c.clubJob === clubId);
    if (atClub.length === 1) return { staff: atClub[0], clubId };
  }

  return null;
}

/**
 * Merge parsed `player_setup.cfg` records onto the binary staff.dat/club.dat
 * data, matching each entry to a staff record (by resolved display name,
 * disambiguated by club when the name isn't unique) and to a club id.
 */
export function mergePlayerSetup(
  cfg: PlayerSetupCfg,
  staff: CM2Staff[],
  clubs: CM2Club[],
  firstNames: CM2Name[],
  secondNames: CM2Name[],
  commonNames: CM2Name[]
): MergedPlayerSetup {
  const nameIndex = buildStaffNameIndex(staff, firstNames, secondNames, commonNames);
  const clubIndex = buildClubNameIndex(clubs);

  const retirements: MergedRetirement[] = [];
  const intRetirements: MergedIntRetirement[] = [];
  const injuries: MergedInjury[] = [];
  const loans: MergedLoan[] = [];
  const unmatchedCounts = { retirements: 0, intRetirements: 0, injuries: 0, loans: 0 };

  for (const entry of cfg.retirements) {
    const match = matchStaff(entry, entry.clubName, nameIndex, clubIndex);
    if (!match) {
      unmatchedCounts.retirements++;
      continue;
    }
    retirements.push({ ...entry, staffId: match.staff.id, clubId: match.clubId });
  }

  for (const entry of cfg.intRetirements) {
    const match = matchStaff(entry, entry.clubName, nameIndex, clubIndex);
    if (!match) {
      unmatchedCounts.intRetirements++;
      continue;
    }
    intRetirements.push({ ...entry, staffId: match.staff.id, clubId: match.clubId });
  }

  for (const entry of cfg.injuries) {
    const match = matchStaff(entry, entry.clubName, nameIndex, clubIndex);
    if (!match) {
      unmatchedCounts.injuries++;
      continue;
    }
    injuries.push({ ...entry, staffId: match.staff.id });
  }

  for (const entry of cfg.loans) {
    const match = matchStaff(entry, entry.fromClubName, nameIndex, clubIndex);
    if (!match) {
      unmatchedCounts.loans++;
      continue;
    }
    const toClubId = clubIndex.get(entry.toClubName.toLowerCase()) ?? null;
    loans.push({ ...entry, staffId: match.staff.id, fromClubId: match.clubId, toClubId });
  }

  return { retirements, intRetirements, injuries, loans, unmatchedCounts };
}
