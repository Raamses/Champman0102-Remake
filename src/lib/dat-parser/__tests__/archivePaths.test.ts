// @paths lib/dat-parser
import { describe, it, expect } from 'vitest';
import { resolveArchiveFiles, REQUIRED_DAT_FILES, type ArchiveEntry } from '../archivePaths';

function entry(path: string): ArchiveEntry<string> {
  return { path, file: path };
}

describe('resolveArchiveFiles', () => {
  it('resolves all required files from a flat, canonically-cased archive', () => {
    const entries = REQUIRED_DAT_FILES.map((name) => entry(name));
    const { files, missing } = resolveArchiveFiles(entries);

    expect(missing).toEqual([]);
    for (const name of REQUIRED_DAT_FILES) {
      expect(files[name]).toBe(name);
    }
  });

  it('is case-insensitive (CLUB.DAT, Staff.Dat, ...)', () => {
    const { files, missing } = resolveArchiveFiles([
      entry('CLUB.DAT'),
      entry('Staff.Dat'),
      entry('INDEX.DAT'),
      entry('Nation.DAT'),
      entry('NAT_CLUB.dat'),
      entry('FIRST_NAMES.DAT'),
      entry('SECOND_NAMES.DAT'),
      entry('COMMON_NAMES.DAT'),
      entry('PLAYER_SETUP.CFG'),
    ]);

    expect(missing).toEqual([]);
    expect(files['club.dat']).toBe('CLUB.DAT');
    expect(files['staff.dat']).toBe('Staff.Dat');
    expect(files['player_setup.cfg']).toBe('PLAYER_SETUP.CFG');
  });

  it('resolves files nested under arbitrary archive/ISO directory structure', () => {
    const { files, missing } = resolveArchiveFiles([
      entry('Data/club.dat'),
      entry('cm0102/Data/staff.dat'),
      entry('cm0102/Data/INDEX.DAT'),
      entry('some-zip-root/nested/deep/nation.dat'),
    ]);

    expect(files['club.dat']).toBe('Data/club.dat');
    expect(files['staff.dat']).toBe('cm0102/Data/staff.dat');
    expect(files['index.dat']).toBe('cm0102/Data/INDEX.DAT');
    expect(files['nation.dat']).toBe('some-zip-root/nested/deep/nation.dat');
    expect(missing).toEqual(
      expect.arrayContaining(['nat_club.dat', 'first_names.dat', 'second_names.dat', 'common_names.dat', 'player_setup.cfg'])
    );
  });

  it('resolves Windows-style backslash paths from a raw ISO/zip extraction', () => {
    const { files } = resolveArchiveFiles([entry('cm0102\\Data\\CLUB.DAT')]);
    expect(files['club.dat']).toBe('cm0102\\Data\\CLUB.DAT');
  });

  it('reports every required file as missing when the archive has none of them', () => {
    const { files, missing } = resolveArchiveFiles([entry('readme.txt'), entry('setup.exe')]);
    expect(files).toEqual({});
    expect(missing).toEqual([...REQUIRED_DAT_FILES]);
  });

  it('does not substring-match unrelated files sharing a suffix', () => {
    const { files, missing } = resolveArchiveFiles([entry('club.dat.bak'), entry('old_club.dat.txt')]);
    expect(files['club.dat']).toBeUndefined();
    expect(missing).toContain('club.dat');
  });

  it('prefers the first matching entry when duplicates are nested at different depths', () => {
    const { files } = resolveArchiveFiles([entry('Data/club.dat'), entry('backup/Data/club.dat')]);
    expect(files['club.dat']).toBe('Data/club.dat');
  });
});
