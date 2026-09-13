// @paths lib/persistence
/**
 * IndexedDB connection for end-of-turn save persistence (decisions doc #1).
 * One object store, keyed by save slot id — autosave rotation and manual
 * saves are just different slot-naming conventions over the same store, so
 * rotation can happen inside a single readwrite transaction.
 */

export const DB_NAME = 'injury-time';
export const DB_VERSION = 1;
export const SAVES_STORE = 'saves';

export const AUTOSAVE_CURRENT_SLOT = 'autosave-current';
export const AUTOSAVE_PREVIOUS_SLOT = 'autosave-previous';

export type SaveKind = 'autosave' | 'manual';

export interface SaveRecord<TPayload = unknown> {
  /** Primary key. Autosaves use fixed slots; manual saves use caller-chosen ids. */
  slot: string;
  kind: SaveKind;
  label: string;
  createdAt: number;
  schemaVersion: number;
  payload: TPayload;
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function promisifyTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

let dbPromise: Promise<IDBDatabase> | null = null;

export function openSaveDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SAVES_STORE)) {
        const store = db.createObjectStore(SAVES_STORE, { keyPath: 'slot' });
        store.createIndex('kind', 'kind', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

/** Closes the cached connection (if open) so a later call reopens fresh. */
export async function closeSaveDatabase(): Promise<void> {
  const pending = dbPromise;
  if (!pending) return;
  // Clear the cache before awaiting the close so a concurrent
  // openSaveDatabase() call can't be handed this now-closing connection.
  dbPromise = null;
  const db = await pending;
  db.close();
}

export async function getSaveRecord<TPayload = unknown>(slot: string): Promise<SaveRecord<TPayload> | undefined> {
  const db = await openSaveDatabase();
  const tx = db.transaction(SAVES_STORE, 'readonly');
  const store = tx.objectStore(SAVES_STORE);
  return promisifyRequest(store.get(slot)) as Promise<SaveRecord<TPayload> | undefined>;
}

export async function getAllSaveRecords(): Promise<SaveRecord[]> {
  const db = await openSaveDatabase();
  const tx = db.transaction(SAVES_STORE, 'readonly');
  const store = tx.objectStore(SAVES_STORE);
  return promisifyRequest(store.getAll());
}

export async function deleteSaveRecord(slot: string): Promise<void> {
  const db = await openSaveDatabase();
  const tx = db.transaction(SAVES_STORE, 'readwrite');
  tx.objectStore(SAVES_STORE).delete(slot);
  await promisifyTransaction(tx);
}

/**
 * Runs `writes` (a set of slot -> record puts) inside a single readwrite
 * transaction, so a rotation (e.g. current -> previous, new -> current)
 * either fully applies or not at all.
 */
export async function putSaveRecordsTransactionally(records: SaveRecord[]): Promise<void> {
  const db = await openSaveDatabase();
  const tx = db.transaction(SAVES_STORE, 'readwrite');
  const store = tx.objectStore(SAVES_STORE);
  for (const record of records) store.put(record);
  await promisifyTransaction(tx);
}

/**
 * Writes a new autosave, rotating the previous "current" autosave (if any)
 * into the "previous" slot first. The read of the existing "current" slot
 * happens in its own transaction (there is only ever one writer — the
 * end-of-turn save flow — so this isn't racy in practice); both resulting
 * puts are then applied in a single readwrite transaction, so the rotation
 * itself can't be observed half-applied.
 */
export async function rotateAutosave(record: Omit<SaveRecord, 'slot'>): Promise<void> {
  const current = await getSaveRecord(AUTOSAVE_CURRENT_SLOT);

  const records: SaveRecord[] = [];
  if (current) records.push({ ...current, slot: AUTOSAVE_PREVIOUS_SLOT });
  records.push({ ...record, slot: AUTOSAVE_CURRENT_SLOT });

  await putSaveRecordsTransactionally(records);
}
