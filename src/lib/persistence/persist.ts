// @paths lib/persistence
/**
 * Best-effort durability request (decisions doc #1, H14 mitigation) — asks
 * the browser not to silently evict this origin's storage under pressure.
 * iOS Safari in particular will evict IndexedDB after ~7 days of inactivity
 * without this; it's not a guarantee, hence "best-effort".
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  return navigator.storage.persist();
}

export async function isStoragePersisted(): Promise<boolean> {
  if (!navigator.storage?.persisted) return false;
  return navigator.storage.persisted();
}
