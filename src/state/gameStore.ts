import { create } from 'zustand';
import { InteractableObject } from '../domain/interaction/interactionModel';
import { getTileById } from '../domain/mahjong/tileTypes';
import {
  EAST_ARCADE_SEQUENCE_PUZZLE,
  EAST_ARCADE_SAME_DOOR_PUZZLE,
  evaluatePuzzle,
} from '../domain/puzzle/puzzleModel';

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
  selectedInventoryTileId: string | null;
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

  // Phase 2 Mahjong Foundation & East Arcade State
  hasBamboo4: boolean;
  placedTiles: Record<string, string | null>;
  balconiesAligned: boolean;

  // Phase 3 Impossible Space & Same Door Pair State
  hasRedDragon: boolean;
  sameDoorPairActive: boolean;
  portalWarping: boolean;
  hintModalOpen: boolean;
  activeHintLevel: number;

  // Actions
  setScene: (scene: GameState['currentScene']) => void;
  setPaused: (isPaused: boolean) => void;
  setCheckpoint: (checkpoint: string) => void;
  addTile: (tileId: string) => void;
  removeTile: (tileId: string) => void;
  selectInventoryTile: (tileId: string | null) => void;
  setPuzzleSolved: (puzzleId: string, isSolved?: boolean) => void;
  setNarrativeFlag: (flag: string, value?: boolean) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerRotation: (rot: number) => void;
  setActiveInteractable: (interactable: InteractableObject | null) => void;
  setActiveInspection: (inspection: InspectionData | null) => void;
  collectWhiteTile: () => void;
  collectBamboo4: () => void;
  collectRedDragon: () => void;
  placeTileInSocket: (socketId: string, tileId: string) => boolean;
  removeTileFromSocket: (socketId: string) => void;
  unlockTeaHouse: () => void;
  enterTeaHouse: () => void;
  transitionToEastArcade: () => void;
  traverseSameDoor: (fromDoor: 'alpha' | 'beta') => void;
  teleportPlayer: (pos: [number, number, number], rot?: number) => void;
  toggleHintModal: () => void;
  requestNextHint: () => void;
  setBannerMessage: (message: string | null) => void;
  resetGame: () => void;
}

const initialState = {
  currentScene: 'rain_alley' as const,
  activeCheckpoint: 'cp_rain_alley_start',
  isPaused: false,
  inventoryTiles: [],
  selectedInventoryTileId: null,
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

  // Phase 2 Sequence Gate initial state
  hasBamboo4: false,
  placedTiles: {
    socket_balcony_1: 'tile_bamboo_2',
    socket_balcony_2: 'tile_bamboo_3',
    socket_balcony_3: null,
    socket_door_alpha: 'tile_dragon_red',
    socket_door_beta: null,
  },
  balconiesAligned: false,

  // Phase 3 Same Door Pair initial state
  hasRedDragon: false,
  sameDoorPairActive: false,
  portalWarping: false,
  hintModalOpen: false,
  activeHintLevel: 1,
};

export const useGameStore = create<GameState>((set, get) => ({
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
      selectedInventoryTileId:
        state.selectedInventoryTileId === tileId ? null : state.selectedInventoryTileId,
    })),
  selectInventoryTile: (tileId) => set({ selectedInventoryTileId: tileId }),
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
        selectedInventoryTileId: 'tile_white_dragon',
        narrativeFlags: { ...state.narrativeFlags, collected_white_tile: true },
        bannerMessage: 'The White Tile clicks in your palm. The Tea House doors slide open ahead.',
      };
    }),

  collectBamboo4: () =>
    set((state) => {
      if (state.hasBamboo4) return state;
      return {
        hasBamboo4: true,
        inventoryTiles: [...state.inventoryTiles, 'tile_bamboo_4'],
        selectedInventoryTileId: 'tile_bamboo_4',
        narrativeFlags: { ...state.narrativeFlags, collected_bamboo_4: true },
        bannerMessage: 'Acquired 4 Bamboo! Look for the sequence socket at the Balcony Gate.',
      };
    }),

  collectRedDragon: () =>
    set((state) => {
      if (state.hasRedDragon) return state;
      return {
        hasRedDragon: true,
        inventoryTiles: [...state.inventoryTiles, 'tile_dragon_red'],
        selectedInventoryTileId: 'tile_dragon_red',
        narrativeFlags: { ...state.narrativeFlags, collected_red_dragon: true },
        bannerMessage:
          'Acquired Red Dragon Plaque! In Mahjong, a Pair establishes spatial identity.',
      };
    }),

  placeTileInSocket: (socketId, tileId) => {
    const state = get();
    const updatedPlaced = { ...state.placedTiles, [socketId]: tileId };
    const updatedInventory = state.inventoryTiles.filter((id) => id !== tileId);

    // Evaluate Sequence Gate
    const seqPlacedMap: Record<string, ReturnType<typeof getTileById>> = {
      socket_balcony_1: getTileById(updatedPlaced['socket_balcony_1'] ?? ''),
      socket_balcony_2: getTileById(updatedPlaced['socket_balcony_2'] ?? ''),
      socket_balcony_3: getTileById(updatedPlaced['socket_balcony_3'] ?? ''),
    };
    const seqEvaluation = evaluatePuzzle(EAST_ARCADE_SEQUENCE_PUZZLE, seqPlacedMap);

    // Evaluate Same Door Pair Gate
    const doorPlacedMap: Record<string, ReturnType<typeof getTileById>> = {
      socket_door_alpha: getTileById(updatedPlaced['socket_door_alpha'] ?? ''),
      socket_door_beta: getTileById(updatedPlaced['socket_door_beta'] ?? ''),
    };
    const doorEvaluation = evaluatePuzzle(EAST_ARCADE_SAME_DOOR_PUZZLE, doorPlacedMap);

    const isSeqSolved = seqEvaluation.isSolved;
    const isDoorSolved = doorEvaluation.isSolved;

    let banner = state.bannerMessage;
    let checkpoint = state.activeCheckpoint;

    if (isSeqSolved && !state.balconiesAligned) {
      banner =
        'Sequence Bamboo (2-3-4) completed! The three balconies shift and align into a bridge.';
      checkpoint = 'cp_balconies_aligned';
    } else if (isDoorSolved && !state.sameDoorPairActive) {
      banner =
        'Pair of Red Dragons established! Doorway Alpha and Doorway Beta are now the same door in space.';
      checkpoint = 'cp_same_door_paired';
    }

    set({
      placedTiles: updatedPlaced,
      inventoryTiles: updatedInventory,
      selectedInventoryTileId: null,
      balconiesAligned: isSeqSolved,
      sameDoorPairActive: isDoorSolved,
      solvedPuzzles: {
        ...state.solvedPuzzles,
        [EAST_ARCADE_SEQUENCE_PUZZLE.id]: isSeqSolved,
        [EAST_ARCADE_SAME_DOOR_PUZZLE.id]: isDoorSolved,
      },
      bannerMessage: banner,
      activeCheckpoint: checkpoint,
    });

    return isSeqSolved || isDoorSolved;
  },

  removeTileFromSocket: (socketId) => {
    const state = get();
    const tileId = state.placedTiles[socketId];
    if (!tileId) return;

    const updatedPlaced = { ...state.placedTiles, [socketId]: null };
    const updatedInventory = [...state.inventoryTiles, tileId];

    // Re-evaluate
    const seqPlacedMap: Record<string, ReturnType<typeof getTileById>> = {
      socket_balcony_1: getTileById(updatedPlaced['socket_balcony_1'] ?? ''),
      socket_balcony_2: getTileById(updatedPlaced['socket_balcony_2'] ?? ''),
      socket_balcony_3: getTileById(updatedPlaced['socket_balcony_3'] ?? ''),
    };
    const seqEvaluation = evaluatePuzzle(EAST_ARCADE_SEQUENCE_PUZZLE, seqPlacedMap);

    const doorPlacedMap: Record<string, ReturnType<typeof getTileById>> = {
      socket_door_alpha: getTileById(updatedPlaced['socket_door_alpha'] ?? ''),
      socket_door_beta: getTileById(updatedPlaced['socket_door_beta'] ?? ''),
    };
    const doorEvaluation = evaluatePuzzle(EAST_ARCADE_SAME_DOOR_PUZZLE, doorPlacedMap);

    set({
      placedTiles: updatedPlaced,
      inventoryTiles: updatedInventory,
      balconiesAligned: seqEvaluation.isSolved,
      sameDoorPairActive: doorEvaluation.isSolved,
      solvedPuzzles: {
        ...state.solvedPuzzles,
        [EAST_ARCADE_SEQUENCE_PUZZLE.id]: seqEvaluation.isSolved,
        [EAST_ARCADE_SAME_DOOR_PUZZLE.id]: doorEvaluation.isSolved,
      },
    });
  },

  unlockTeaHouse: () =>
    set((state) => ({
      teaHouseUnlocked: true,
      narrativeFlags: { ...state.narrativeFlags, tea_house_unlocked: true },
    })),

  enterTeaHouse: () => {
    set({
      playerInsideTeaHouse: true,
      currentScene: 'east_arcade',
      activeCheckpoint: 'cp_east_arcade_start',
      playerPosition: [0, 0, 8.0],
      narrativeFlags: { ...get().narrativeFlags, entered_tea_house: true },
      bannerMessage:
        'You pass through the Tea House and emerge into the East Arcade. Three balconies float disconnected ahead.',
    });
  },

  transitionToEastArcade: () => {
    set({
      currentScene: 'east_arcade',
      activeCheckpoint: 'cp_east_arcade_start',
      playerPosition: [0, 0, 8.0],
      bannerMessage: 'East Arcade: Find the missing Bamboo 4 tile to align the balconies.',
    });
  },

  traverseSameDoor: (fromDoor) => {
    const { sameDoorPairActive } = get();
    if (!sameDoorPairActive) return;

    set({ portalWarping: true });

    if (fromDoor === 'alpha') {
      // Step into Alpha (East Wall [3.5, 0, -10.0]) -> Step OUT of Beta (Tower [-3.5, 0, -15.5]) facing South
      set({
        playerPosition: [-3.5, 0, -15.8],
        playerRotation: 0,
        bannerMessage:
          'Impossible Traversal: Stepping through Door Alpha brought you out of Door Beta on the High Tower.',
        activeCheckpoint: 'cp_upper_terrace_reached',
      });
    } else {
      // Step into Beta -> Step OUT of Alpha ([3.5, 0, -8.5]) facing South
      set({
        playerPosition: [3.5, 0, -8.5],
        playerRotation: 0,
        bannerMessage:
          'Impossible Traversal: Stepping through Door Beta returned you to the Lower Pavilion.',
      });
    }

    setTimeout(() => {
      set({ portalWarping: false });
    }, 400);
  },

  teleportPlayer: (pos, rot) => {
    set({
      playerPosition: pos,
      playerRotation: rot !== undefined ? rot : get().playerRotation,
    });
  },

  toggleHintModal: () => set((state) => ({ hintModalOpen: !state.hintModalOpen })),
  requestNextHint: () =>
    set((state) => ({
      activeHintLevel: Math.min(3, state.activeHintLevel + 1),
    })),

  setBannerMessage: (bannerMessage) => set({ bannerMessage }),
  resetGame: () => set(initialState),
}));
