import React, { useState, useEffect, FormEvent, useRef } from 'react';
import {
  newCareerState,
  type CareerState,
  saveCareerAutosave,
  saveCareerManual,
  listCareerSaves,
  deleteCareerManual,
  loadCareerSlot,
  buildAutosaveRecovery,
  exportCareerToFile,
  importCareerFromFile,
  purgeAutosaves,
  repairCurrentAutosave,
  AUTOSAVE_PREVIOUS_SLOT,
  AUTOSAVE_CURRENT_SLOT,
  getSaveRecord
} from '../lib/persistence/career';
import { exportSaveToFile } from '../lib/persistence/exportImport';
import { SaveCorruptionError } from '../lib/persistence/errors';

async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    try { await navigator.storage.persist(); } catch {}
  }
}

async function isStoragePersisted() {
  if (navigator.storage && navigator.storage.persisted) {
    try { return await navigator.storage.persisted(); } catch {}
  }
  return false;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'save';
}

function SavesView() {
  const [storageStatus, setStorageStatus] = useState<string | null>(null);
  const [currentCareer, setCurrentCareer] = useState<CareerState | null>(null);
  const [saves, setSaves] = useState<any[]>([]);
  
  const [newClubId, setNewClubId] = useState('1');
  const [newManagerName, setNewManagerName] = useState('Manager');
  const [manualLabel, setManualLabel] = useState('My Save');
  
  const [recoveryError, setRecoveryError] = useState<{ code: string, message: string, slot?: string } | null>(null);
  const [recoveryIsAutosave, setRecoveryIsAutosave] = useState(false);
  const [recoveryPreviousCorrupt, setRecoveryPreviousCorrupt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshSaves = async () => {
    const list = await listCareerSaves();
    setSaves(list);
  };

  useEffect(() => {
    requestPersistentStorage().then(() => {
      isStoragePersisted().then(persisted => {
        setStorageStatus(persisted ? 'Storage: persistent' : 'Storage: best-effort (browser may evict)');
      });
    });
    refreshSaves();
  }, []);

  const handleNewCareer = (e: FormEvent) => {
    e.preventDefault();
    const state = newCareerState(parseInt(newClubId, 10) || 1, newManagerName || 'Manager');
    setCurrentCareer(state);
  };

  const handleSaveAutosave = async () => {
    if (!currentCareer) return;
    await saveCareerAutosave(currentCareer);
    await refreshSaves();
  };

  const handleSaveManual = async () => {
    if (!currentCareer) return;
    const slotId = slugify(manualLabel);
    await saveCareerManual(slotId, currentCareer, manualLabel);
    await refreshSaves();
  };

  const handleLoad = async (slot: string, kind: string) => {
    try {
      const result = await loadCareerSlot(slot);
      if (result) {
        setCurrentCareer(result.envelope.payload);
      }
    } catch (err) {
      if (err instanceof SaveCorruptionError) {
        setRecoveryError({ code: err.code, message: err.message, slot });
        setRecoveryIsAutosave(kind === 'autosave');
        setRecoveryPreviousCorrupt(false);
      }
    }
  };

  const handleContinue = async () => {
    const result = await buildAutosaveRecovery();
    if (result.status === 'ok') {
      setCurrentCareer(result.career);
    } else if (result.status === 'corrupt') {
      setRecoveryError({ code: result.currentError.code, message: result.currentError.message, slot: AUTOSAVE_CURRENT_SLOT });
      setRecoveryIsAutosave(true);
      setRecoveryPreviousCorrupt(false);
    } else if (result.status === 'empty') {
      alert('No career saves yet — start a new career');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importCareerFromFile(file);
      setCurrentCareer(imported);
      await saveCareerAutosave(imported, 'Imported save');
      await refreshSaves();
    } catch (err) {
      if (err instanceof SaveCorruptionError) {
        setRecoveryError({ code: err.code, message: `Import failed: ${err.message}` });
        setRecoveryIsAutosave(false);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExport = (career: CareerState, label: string) => {
    exportCareerToFile(career, label);
  };

  const handleDelete = async (slot: string) => {
    const stripped = slot.replace(/^manual-/, '');
    await deleteCareerManual(stripped);
    await refreshSaves();
  };

  const doRecoveryLoadPrevious = async () => {
    try {
      const result = await loadCareerSlot(AUTOSAVE_PREVIOUS_SLOT);
      if (result) {
        setCurrentCareer(result.envelope.payload);
        setRecoveryError(null);
        // Heal the corrupt current slot on disk too: if we only restored the
        // previous turn in memory, the next launch would hit the same
        // corruption all over again.
        try {
          await repairCurrentAutosave(result.envelope.payload);
        } catch {
          // storage write failed — the corrupt slot remains until a retry
        }
        await refreshSaves();
      }
    } catch (err) {
      if (err instanceof SaveCorruptionError) {
        setRecoveryPreviousCorrupt(true);
      }
    }
  };

  const doRecoveryPurge = async () => {
    await purgeAutosaves();
    await refreshSaves();
    setRecoveryError(null);
  };

  const doRecoveryExport = async () => {
    try {
      const slot = recoveryError?.slot || AUTOSAVE_CURRENT_SLOT;
      const raw = await getSaveRecord(slot);
      if (raw) {
        exportSaveToFile({ schemaVersion: raw.schemaVersion, payload: raw.payload } as any, 'corrupt-save-export');
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      {storageStatus && (
        <div className="bg-brand-surface border border-brand-border px-4 py-2 rounded text-xs font-bold uppercase text-brand-muted">
          {storageStatus}
        </div>
      )}

      <div className="flex gap-4 items-center">
        <button
          onClick={handleContinue}
          className="bg-brand-primary text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wide hover:bg-brand-primary/90 transition-colors"
        >
          Continue
        </button>
        <label className="bg-brand-surface border border-brand-border text-brand-text px-4 py-2 rounded text-xs font-bold uppercase tracking-wide hover:bg-white/5 transition-colors cursor-pointer">
          Import Save
          <input type="file" accept="application/json" className="hidden" ref={fileInputRef} onChange={handleImport} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-surface border border-brand-border rounded p-4 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/90">Current Career</h2>
          
          {currentCareer ? (
            <div className="space-y-4">
              <div className="text-xs text-brand-muted space-y-1">
                <p>Season: {currentCareer.career.seasonNumber} | Turn: {currentCareer.career.turn}</p>
                <p>Manager: {currentCareer.career.managerName} | Club: {currentCareer.career.clubId}</p>
                <p>Matches: {currentCareer.matchHistory.length}</p>
                <p>Last played: {currentCareer.lastPlayedAt === 0 ? 'unknown' : new Date(currentCareer.lastPlayedAt).toLocaleString()}</p>
              </div>
              <div className="text-xs text-brand-muted italic">Save -&gt; reload restores the career</div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSaveAutosave}
                  className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30 px-3 py-2 rounded text-xs font-bold uppercase hover:bg-brand-primary/30 transition-colors"
                >
                  Save turn (autosave)
                </button>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualLabel}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualLabel(e.target.value)}
                    className="flex-1 bg-brand-bg border border-brand-border rounded px-2 py-1 text-xs text-brand-text"
                    placeholder="Slot label"
                  />
                  <button
                    onClick={handleSaveManual}
                    className="bg-brand-surface border border-brand-border text-brand-text px-3 py-2 rounded text-xs font-bold uppercase hover:bg-white/5 transition-colors whitespace-nowrap"
                  >
                    Manual save slot
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNewCareer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-brand-muted mb-1">Manager Name</label>
                <input
                  type="text"
                  value={newManagerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewManagerName(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded px-2 py-1 text-xs text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-brand-muted mb-1">Club ID</label>
                <input
                  type="number"
                  value={newClubId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewClubId(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded px-2 py-1 text-xs text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-surface border border-brand-border text-brand-text px-3 py-2 rounded text-xs font-bold uppercase hover:bg-white/5 transition-colors"
              >
                New career
              </button>
            </form>
          )}
        </div>

        <div className="bg-brand-surface border border-brand-border rounded p-4 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/90">Saved Games</h2>
          <div className="space-y-2">
            {saves.map((save: import('../lib/persistence/career').SaveRecord) => {
              const payload = save.payload && typeof save.payload === 'object' ? (save.payload as any) : null;
              const needsMigration = !payload?.career?.managerName;
              return (
                <div key={save.slot} className="bg-brand-bg border border-brand-border rounded p-3 text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-start text-brand-muted">
                    <div>
                      <span className="font-bold text-brand-text">{save.label}</span>
                      <span className="ml-2 uppercase">({save.kind})</span>
                    </div>
                    <span>{new Date(save.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-brand-muted">
                    {needsMigration ? (
                      `v${save.schemaVersion} (needs migration)`
                    ) : (
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <span>S{payload.career.seasonNumber} T{payload.career.turn}</span>
                        <span>Manager: {payload.career.managerName}</span>
                        <span>Club: {payload.career.clubId}</span>
                        <span>Matches: {payload.matchHistory?.length ?? 0}</span>
                        <span>Played: {payload.lastPlayedAt ? new Date(payload.lastPlayedAt).toLocaleString() : `${new Date(save.createdAt).toLocaleString()} (save time)`}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-brand-muted font-mono text-[10px]">Slot: {save.slot} | Schema: v{save.schemaVersion}</div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => handleLoad(save.slot, save.kind)} className="bg-brand-surface border border-brand-border px-2 py-1 rounded font-bold uppercase hover:bg-white/5 text-brand-text transition-colors">Load</button>
                    {!needsMigration && (
                      <button onClick={() => handleExport(payload, save.label)} className="bg-brand-surface border border-brand-border px-2 py-1 rounded font-bold uppercase hover:bg-white/5 text-brand-text transition-colors">Export</button>
                    )}
                    {save.kind === 'manual' && (
                      <button onClick={() => handleDelete(save.slot)} className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded font-bold uppercase hover:bg-red-500/20 transition-colors">Delete</button>
                    )}
                  </div>
                </div>
              );
            })}
            {saves.length === 0 && <div className="text-xs text-brand-muted uppercase text-center py-4">No saves found</div>}
          </div>
        </div>
      </div>

      {recoveryError && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-brand-surface border border-brand-border rounded p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-red-400 uppercase tracking-wide">Save is corrupt</h3>
            <p className="text-sm text-brand-muted">Code: {recoveryError.code}</p>
            <p className="text-sm text-brand-text">{recoveryError.message}</p>
            
            <div className="flex flex-col gap-2 pt-4">
              {recoveryIsAutosave && (
                <>
                  <button onClick={doRecoveryLoadPrevious} className="bg-brand-surface border border-brand-border px-4 py-2 rounded text-xs font-bold uppercase text-brand-text hover:bg-white/5 transition-colors">
                    Load previous autosave
                  </button>
                  {recoveryPreviousCorrupt && (
                    <p className="text-xs text-red-400 font-bold uppercase text-center">Previous autosave is also corrupt</p>
                  )}
                  <button onClick={doRecoveryPurge} className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded text-xs font-bold uppercase text-red-400 hover:bg-red-500/20 transition-colors">
                    Delete corrupt saves, start fresh
                  </button>
                  <button onClick={doRecoveryExport} className="bg-brand-surface border border-brand-border px-4 py-2 rounded text-xs font-bold uppercase text-brand-text hover:bg-white/5 transition-colors">
                    Download corrupt save for inspection
                  </button>
                </>
              )}
              <button onClick={() => setRecoveryError(null)} className="bg-brand-surface border border-brand-border px-4 py-2 rounded text-xs font-bold uppercase text-brand-text hover:bg-white/5 mt-2 transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavesView;
