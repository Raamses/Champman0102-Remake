// @paths lib/dat-parser
/**
 * File-ingestion path normalizer for BYOD `.dat` uploads (test-program
 * meta-review #9: "Real-World BYOD Data Blind Spots"). Real user archives
 * (ZIP/ISO extractions, `webkitdirectory` folder picks) present the required
 * files at arbitrary nesting depth (`Data/club.dat`, `cm0102/Data/club.dat`)
 * and with inconsistent casing (`CLUB.DAT`, `Club.Dat`) — this resolves a
 * flat list of archive entries to the canonical CM01/02 filenames regardless
 * of either, so the parser stage always sees a known set of keys.
 */

export const REQUIRED_DAT_FILES = [
  'index.dat',
  'club.dat',
  'staff.dat',
  'nation.dat',
  'nat_club.dat',
  'first_names.dat',
  'second_names.dat',
  'common_names.dat',
  'player_setup.cfg',
] as const;

export type RequiredDatFile = (typeof REQUIRED_DAT_FILES)[number];

export interface ArchiveEntry<T> {
  /** Full path as reported by the archive/folder picker, e.g. "cm0102/Data/CLUB.DAT". */
  path: string;
  file: T;
}

export interface ResolvedArchiveFiles<T> {
  files: Partial<Record<RequiredDatFile, T>>;
  missing: RequiredDatFile[];
}

/** Last path segment, tolerant of both "/" and Windows "\" separators. */
function basename(path: string): string {
  const segments = path.split(/[/\\]+/).filter(Boolean);
  return segments[segments.length - 1] ?? '';
}

/**
 * Resolves an arbitrarily-nested, arbitrarily-cased set of archive entries to
 * the canonical required `.dat`/`.cfg` filenames. When more than one entry's
 * basename matches the same required file (e.g. a nested duplicate), the
 * first match in `entries` order wins.
 */
export function resolveArchiveFiles<T>(entries: ArchiveEntry<T>[]): ResolvedArchiveFiles<T> {
  const byLowerBasename = new Map<string, T>();
  for (const entry of entries) {
    const name = basename(entry.path).toLowerCase();
    if (!name || byLowerBasename.has(name)) continue;
    byLowerBasename.set(name, entry.file);
  }

  const files: Partial<Record<RequiredDatFile, T>> = {};
  const missing: RequiredDatFile[] = [];
  for (const required of REQUIRED_DAT_FILES) {
    const match = byLowerBasename.get(required);
    if (match !== undefined) {
      files[required] = match;
    } else {
      missing.push(required);
    }
  }

  return { files, missing };
}
