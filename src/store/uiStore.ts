// @paths store
/**
 * Zustand UI state — navigation/UI-only concerns (decisions doc #1: "Zustand
 * stays UI-state only"). Game data lives in the SoA dataset
 * (src/lib/game-data) and persisted state lives in IndexedDB
 * (src/lib/persistence); neither belongs here.
 */
import { create } from 'zustand';

interface UiState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeTab: 'database',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
