// @paths lib/game-data
/**
 * Squad-resolution helpers for the database viewer UI (CM-013).
 *
 * club.dat's flattened squad slots hold staff.dat ids (staff.dat carries the
 * person record AND the player link), so the club -> squad -> player
 * drill-down is: squad slot -> staff row -> resolved name + linked player row.
 */
import type { GameDataset } from './dataset';
import { findClubRowById, getClubRow, type ClubRow } from './clubTable';
import { findStaffRowById, resolveStaffRowName, getStaffRow, type StaffRow } from './staffTable';
import { findPlayerRowById, type PlayerRow } from './playerTable';
import { findNationRowById, type NationRow } from './nationTable';

export interface SquadEntry {
  /** 0-based squad slot in the club's flattened squad column. */
  slot: number;
  staffId: number;
  staffRow: StaffRow;
  /** Resolved person name, or null when the name tables can't resolve it. */
  name: string | null;
  /** staff.player link (CM-011: -1 means "not a player"). */
  playerId: number | null;
  playerRow: PlayerRow | null;
}

/** Squad slots for one club, in slot order; empty slots (-1) skipped. */
export function resolveSquad(dataset: GameDataset, clubId: number): SquadEntry[] {
  const club = findClubRowById(dataset.clubs, clubId);
  if (!club) return [];

  const entries: SquadEntry[] = [];
  club.squad.forEach((staffId, slot) => {
    if (staffId < 0) return;
    const staffRow = findStaffRowById(dataset.staff, staffId);
    if (!staffRow) return; // dangling reference: invisible rather than view-breaking
    const playerId = staffRow.player >= 0 ? staffRow.player : null;
    entries.push({
      slot,
      staffId,
      staffRow,
      name: resolveStaffRowName(staffRow, dataset.firstNames, dataset.secondNames, dataset.commonNames),
      playerId,
      playerRow: playerId === null ? null : findPlayerRowById(dataset.players, playerId),
    });
  });
  return entries;
}


export function nationName(dataset: GameDataset, nationId: number): string | null {
  return findNationRowById(dataset.nations, nationId)?.name ?? null;
}

/** Best-effort display name for a club: name first, shortName as fallback. */
export function clubLabel(dataset: GameDataset, clubId: number): string {
  const club = findClubRowById(dataset.clubs, clubId);
  if (!club) return `#${clubId}`;
  return club.name || club.shortName || `#${club.id}`;
}

export interface ClubListItem {
  row: ClubRow;
  nationName: string | null;
}

/**
 * Clubs for the browse list, name-sorted, optionally filtered by a
 * case-insensitive name/shortName substring. `limit` caps render size —
 * the retail world database is ~10,580 clubs, far past a sane DOM budget.
 */
export function browseClubs(
  dataset: GameDataset,
  query: string,
  limit = 300
): { items: ClubListItem[]; total: number; capped: boolean } {
  const needle = query.trim().toLowerCase();
  const matched: ClubRow[] = [];
  for (let i = 0; i < dataset.clubs.length; i++) {
    const row = getClubRow(dataset.clubs, i);
    if (
      !needle ||
      row.name.toLowerCase().includes(needle) ||
      row.shortName.toLowerCase().includes(needle)
    ) {
      matched.push(row);
      if (matched.length >= limit * 2) break; // small over-can so sorting still sees a superset
    }
  }
  matched.sort((a, b) => a.name.localeCompare(b.name));
  const items = matched.slice(0, limit).map((row) => ({
    row,
    nationName: nationName(dataset, row.nation),
  }));
  return { items, total: dataset.clubs.length, capped: matched.length > limit };
}

/** £-formatted cash with M/k compaction (cash is a plain int in club.dat). */
export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}£${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}£${Math.round(abs / 1000)}k`;
  return `${sign}£${abs}`;
}
