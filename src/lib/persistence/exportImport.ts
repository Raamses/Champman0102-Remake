// @paths lib/persistence
/**
 * Export-save-to-file (decisions doc #1, H14 mitigation): the file is the
 * durability backstop when a browser evicts IndexedDB (iOS Safari's ~7-day
 * inactivity eviction being the motivating case) — same "save to disk" feel
 * as the original CM01/02's save files.
 */
import type { SaveEnvelope } from './envelope';

export interface ExportedSaveFile<TPayload = unknown> {
  envelope: SaveEnvelope<TPayload>;
  label: string;
  exportedAt: number;
}

export function serializeSaveFile<TPayload>(envelope: SaveEnvelope<TPayload>, label: string): string {
  const file: ExportedSaveFile<TPayload> = { envelope, label, exportedAt: Date.now() };
  return JSON.stringify(file);
}

export function parseSaveFile<TPayload = unknown>(json: string): ExportedSaveFile<TPayload> {
  const parsed = JSON.parse(json);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof parsed.envelope !== 'object' ||
    parsed.envelope === null ||
    typeof parsed.envelope.schemaVersion !== 'number'
  ) {
    throw new Error('Not a valid Injury Time save file');
  }
  return parsed as ExportedSaveFile<TPayload>;
}

/** Triggers a browser download of the save as a .json file. Browser-only. */
export function exportSaveToFile<TPayload>(
  envelope: SaveEnvelope<TPayload>,
  label: string,
  fileName: string = `${label}.json`
): void {
  const json = serializeSaveFile(envelope, label);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Reads a user-selected save file (browser File API) back into an envelope. */
export async function importSaveFromFile<TPayload = unknown>(file: File): Promise<ExportedSaveFile<TPayload>> {
  const text = await file.text();
  return parseSaveFile<TPayload>(text);
}
