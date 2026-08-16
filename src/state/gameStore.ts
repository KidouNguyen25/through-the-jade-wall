import { create } from 'zustand';
import { InteractableObject } from '../domain/interaction/interactionModel';

export interface InspectionData {
  title: string;
  description: string;
}

export interface GameState {
  currentScene:
    'bootstrap' | 'rain_alley' | 'tea_house' | 'east_arcade' | 'memory_room' | 'dealers_court';
  activeCheckpoint: string;
  isPaused: boolean;
  inventoryTiles: string[];
  solvedPuzzles: Record<string, boolean>;
  narrativeFlags: Record<string, boolean>;

  // Phase 1 Locomotion & Progression State
  playerPosition: [number, number, number];
  playerRotation: number;
  activeInteractable: InteractableObject | null;
  activeInspection: InspectionData | null;
  hasWhiteTile: boolean;
  teaHouseUnlocked: boolean;
  playerInsideTeaHouse: boolean;
  bannerMessage: string | null;

  // Actions
  setScene: (scene: GameState['currentScene']) => void;
  setPaused: (isPaused: boolean) => void;
  setCheckpoint: (checkpoint: string) => void;
  addTile: (tileId: string) => void;
  removeTile: (tileId: string) => void;
  setPuzzleSolved: (puzzleId: string, isSolved?: boolean) => void;
  setNarrativeFlag: (flag: string, value?: boolean) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerRotation: (rot: number) => void;
  setActiveInteractable: (interactable: InteractableObject | null) => void;
  setActiveInspection: (inspection: InspectionData | null) => void;
  collectWhiteTile: () => void;
  unlockTeaHouse: () => void;
  enterTeaHouse: () => void;
  setBannerMessage: (message: string | null) => void;
  resetGame: () => void;
}

const initialState = {
  currentScene: 'rain_alley' as const,
  activeCheckpoint: 'cp_rain_alley_start',
  isPaused: false,
  inventoryTiles: [],
  solvedPuzzles: {},
  narrativeFlags: {},

  // Initial Player Spawn in Rain Alley
  playerPosition: [0, 0, 5.0] as [number, number, number],
  playerRotation: Math.PI,
  activeInteractable: null,
  activeInspection: null,
  hasWhiteTile: false,
  teaHouseUnlocked: false,
  playerInsideTeaHouse: false,
  bannerMessage: 'Explore Rain Alley. Look for the White Tile.',
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
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerRotation: (rot) => set({ playerRotation: rot }),
  setActiveInteractable: (interactable) => set({ activeInteractable: interactable }),
  setActiveInspection: (inspection) => set({ activeInspection: inspection }),

  collectWhiteTile: () =>
    set((state) => {
      const alreadyHas = state.hasWhiteTile;
      if (alreadyHas) return state;
      return {
        hasWhiteTile: true,
        teaHouseUnlocked: true,
        activeCheckpoint: 'cp_white_tile_collected',
        inventoryTiles: [...state.inventoryTiles, 'tile_white_dragon'],
        narrativeFlags: { ...state.narrativeFlags, collected_white_tile: true },
        bannerMessage: 'The White Tile clicks in your palm. The Tea House doors slide open ahead.',
      };
    }),

  unlockTeaHouse: () =>
    set((state) => ({
      teaHouseUnlocked: true,
      narrativeFlags: { ...state.narrativeFlags, tea_house_unlocked: true },
    })),

  enterTeaHouse: () =>
    set((state) => ({
      playerInsideTeaHouse: true,
      currentScene: 'tea_house',
      activeCheckpoint: 'cp_tea_house_entered',
      narrativeFlags: { ...state.narrativeFlags, entered_tea_house: true },
      bannerMessage: 'You step into the Tea House. Four seats surround an abandoned Mahjong hand.',
    })),

  setBannerMessage: (bannerMessage) => set({ bannerMessage }),
  resetGame: () => set(initialState),
}));
