import { create } from 'zustand';

export interface GameState {
  currentScene:
    'bootstrap' | 'rain_alley' | 'tea_house' | 'east_arcade' | 'memory_room' | 'dealers_court';
  activeCheckpoint: string;
  isPaused: boolean;
  inventoryTiles: string[];
  solvedPuzzles: Record<string, boolean>;
  narrativeFlags: Record<string, boolean>;

  // Actions
  setScene: (scene: GameState['currentScene']) => void;
  setPaused: (isPaused: boolean) => void;
  setCheckpoint: (checkpoint: string) => void;
  addTile: (tileId: string) => void;
  removeTile: (tileId: string) => void;
  setPuzzleSolved: (puzzleId: string, isSolved?: boolean) => void;
  setNarrativeFlag: (flag: string, value?: boolean) => void;
  resetGame: () => void;
}

const initialState = {
  currentScene: 'bootstrap' as const,
  activeCheckpoint: 'cp_bootstrap',
  isPaused: false,
  inventoryTiles: [],
  solvedPuzzles: {},
  narrativeFlags: {},
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setScene: (scene) => set({ currentScene: scene }),
  setPaused: (isPaused) => set({ isPaused }),
  setCheckpoint: (checkpoint) => set({ activeCheckpoint: checkpoint }),
  addTile: (tileId) =>
    set((state) => ({
      inventoryTiles: state.inventoryTiles.includes(tileId)
        ? state.inventoryTiles
        : [...state.inventoryTiles, tileId],
    })),
  removeTile: (tileId) =>
    set((state) => ({
      inventoryTiles: state.inventoryTiles.filter((id) => id !== tileId),
    })),
  setPuzzleSolved: (puzzleId, isSolved = true) =>
    set((state) => ({
      solvedPuzzles: { ...state.solvedPuzzles, [puzzleId]: isSolved },
    })),
  setNarrativeFlag: (flag, value = true) =>
    set((state) => ({
      narrativeFlags: { ...state.narrativeFlags, [flag]: value },
    })),
  resetGame: () => set(initialState),
}));
