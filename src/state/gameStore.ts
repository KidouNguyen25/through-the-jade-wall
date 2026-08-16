import { create } from 'zustand';
import { TileId, TileDefinition, TILE_CATALOG } from '../domain/mahjong/tileTypes';
import {
  evaluatePuzzle,
  EAST_ARCADE_SEQUENCE_PUZZLE,
  EAST_ARCADE_SAME_DOOR_PUZZLE,
} from '../domain/puzzle/puzzleModel';
import {
  SaveStateV1,
  createInitialSave,
  saveToLocalStorage,
  loadFromLocalStorage,
} from '../domain/save/saveSchema';
import { DialogueNode, DialogueTree } from '../domain/narrative/narrativeTypes';
import {
  MEMORY_ROOM_ENTRY_TREE,
  FRAGMENT_EAST_GATE_TREE,
  FRAGMENT_MIDNIGHT_BELL_TREE,
  FRAGMENT_CAPTAIN_SEAL_TREE,
  MEMORY_RECONSTRUCTED_TREE,
} from '../domain/narrative/dialogueData';

export type SceneId =
  'rain_alley' | 'east_arcade' | 'memory_room' | 'discard_passage' | 'boss_court';

export interface ActiveInteractable {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  promptText: string;
  inspectTitle?: string;
  inspectDescription?: string;
}

export interface ActiveInspection {
  title: string;
  description: string;
}

export interface GameState {
  currentScene: SceneId;
  checkpoint: string;
  playerPosition: [number, number, number];
  isPaused: boolean;
  inventoryTiles: TileId[];
  selectedSlot: number;
  hasWhiteTile: boolean;
  hasBamboo4: boolean;
  hasRedDragon: boolean;
  teaHouseUnlocked: boolean;
  balconiesAligned: boolean;
  sameDoorPairActive: boolean;
  placedTiles: Record<string, TileId | null>;
  activeInteractable: ActiveInteractable | null;
  activeInspection: ActiveInspection | null;
  narrativeMessage: string | null;
  portalWarping: boolean;

  // Tiered Guidance Hint State
  activeHintLevel: number;
  hintModalOpen: boolean;

  // Phase 4: Narrative & Memory Room State
  memoryFragments: {
    eastGate: boolean;
    midnightBell: boolean;
    captainSeal: boolean;
  };
  memoryReconstructed: boolean;
  narrativeFlags: Record<string, boolean>;
  activeDialogueTree: DialogueTree | null;
  activeDialogueNode: DialogueNode | null;
  dialogueHistory: DialogueNode[];

  // Actions
  setPlayerPosition: (position: [number, number, number]) => void;
  setCurrentScene: (scene: SceneId) => void;
  setCheckpoint: (checkpoint: string) => void;
  setPaused: (isPaused: boolean) => void;
  addTileToInventory: (tileId: TileId) => void;
  removeTileFromInventory: (tileId: TileId) => void;
  setSelectedSlot: (slot: number) => void;
  collectWhiteTile: () => void;
  collectBamboo4: () => void;
  collectRedDragon: () => void;
  enterTeaHouse: () => void;
  enterMemoryRoom: () => void;
  placeTileInSocket: (socketId: string, tileId: TileId) => void;
  traverseSameDoor: (fromDoor: 'alpha' | 'beta') => void;
  setActiveInteractable: (interactable: ActiveInteractable | null) => void;
  setActiveInspection: (inspection: ActiveInspection | null) => void;
  setNarrativeMessage: (message: string | null) => void;
  setHintLevel: (level: number) => void;
  toggleHintModal: () => void;

  // Phase 4 Actions
  startDialogue: (tree: DialogueTree, startNodeId?: string) => void;
  advanceDialogue: (choiceIndex?: number) => void;
  closeDialogue: () => void;
  collectMemoryFragment: (fragmentId: 'eastGate' | 'midnightBell' | 'captainSeal') => void;
  reconstructMemory: () => void;
  setNarrativeFlag: (flag: string, value?: boolean) => void;

  // Persistence
  saveGame: () => boolean;
  loadGame: () => boolean;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScene: 'rain_alley',
  checkpoint: 'cp_alley_start',
  playerPosition: [0, 0, 8.0],
  isPaused: false,
  inventoryTiles: [],
  selectedSlot: 0,
  hasWhiteTile: false,
  hasBamboo4: false,
  hasRedDragon: false,
  teaHouseUnlocked: false,
  balconiesAligned: false,
  sameDoorPairActive: false,
  placedTiles: {
    socket_balcony_1: 'tile_bamboo_2',
    socket_balcony_2: 'tile_bamboo_3',
    socket_balcony_3: null,
    socket_door_alpha: 'tile_dragon_red',
    socket_door_beta: null,
  },
  activeInteractable: null,
  activeInspection: null,
  narrativeMessage: 'Rain Alley — Step forward into the forgotten passage.',
  portalWarping: false,
  activeHintLevel: 1,
  hintModalOpen: false,

  // Phase 4 state
  memoryFragments: {
    eastGate: false,
    midnightBell: false,
    captainSeal: false,
  },
  memoryReconstructed: false,
  narrativeFlags: {
    discovered_memory_sanctuary: false,
    examined_first_pedestal: false,
  },
  activeDialogueTree: null,
  activeDialogueNode: null,
  dialogueHistory: [],

  setPlayerPosition: (position) => set({ playerPosition: position }),
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setCheckpoint: (checkpoint) => {
    set({ checkpoint });
    get().saveGame();
  },
  setPaused: (isPaused) => set({ isPaused }),

  addTileToInventory: (tileId) =>
    set((state) => {
      if (state.inventoryTiles.length >= 4 || state.inventoryTiles.includes(tileId)) {
        return state;
      }
      const newInventory = [...state.inventoryTiles, tileId];
      return {
        inventoryTiles: newInventory,
        selectedSlot: newInventory.length - 1,
      };
    }),

  removeTileFromInventory: (tileId) =>
    set((state) => {
      const filtered = state.inventoryTiles.filter((t) => t !== tileId);
      return {
        inventoryTiles: filtered,
        selectedSlot: Math.max(0, Math.min(state.selectedSlot, filtered.length - 1)),
      };
    }),

  setSelectedSlot: (slot) =>
    set((state) => ({
      selectedSlot: Math.max(0, Math.min(slot, state.inventoryTiles.length - 1)),
    })),

  collectWhiteTile: () =>
    set((state) => {
      if (state.hasWhiteTile) return state;
      const newInventory: TileId[] = state.inventoryTiles.includes('tile_white_dragon')
        ? state.inventoryTiles
        : [...state.inventoryTiles, 'tile_white_dragon'];

      return {
        hasWhiteTile: true,
        teaHouseUnlocked: true,
        inventoryTiles: newInventory,
        selectedSlot: newInventory.length - 1,
        checkpoint: 'cp_tea_house_unlocked',
        narrativeMessage:
          'Acquired White Tile (Haku)! The Tea House gate unlocks in response to the tile.',
      };
    }),

  collectBamboo4: () =>
    set((state) => {
      if (state.hasBamboo4) return state;
      const newInventory: TileId[] = state.inventoryTiles.includes('tile_bamboo_4')
        ? state.inventoryTiles
        : [...state.inventoryTiles, 'tile_bamboo_4'];

      return {
        hasBamboo4: true,
        inventoryTiles: newInventory,
        selectedSlot: newInventory.length - 1,
        narrativeMessage:
          'Acquired 4 Bamboo (Suu Sou)! It hums in resonance with the Balcony Sockets.',
      };
    }),

  collectRedDragon: () =>
    set((state) => {
      if (state.hasRedDragon) return state;
      const newInventory: TileId[] = state.inventoryTiles.includes('tile_dragon_red')
        ? state.inventoryTiles
        : [...state.inventoryTiles, 'tile_dragon_red'];

      return {
        hasRedDragon: true,
        inventoryTiles: newInventory,
        selectedSlot: newInventory.length - 1,
        narrativeMessage:
          'Acquired Red Dragon Plaque! In Mahjong, a Pair establishes spatial identity.',
      };
    }),

  enterTeaHouse: () => {
    set({
      currentScene: 'east_arcade',
      playerPosition: [0, 0, 8.0],
      checkpoint: 'cp_east_arcade_entered',
      narrativeMessage:
        'East Arcade — Three isolated balconies overlook the void. Complete the sequence to bridge the chasm.',
      activeInteractable: null,
      activeInspection: null,
      activeHintLevel: 1,
    });
    get().saveGame();
  },

  enterMemoryRoom: () => {
    set((state) => ({
      currentScene: 'memory_room',
      playerPosition: [0, 0, 4.5],
      checkpoint: 'cp_memory_room_entered',
      narrativeMessage:
        'Memory Sanctuary — The Dais of Triads awaits three resonance fragments to reconstruct the record.',
      activeInteractable: null,
      activeInspection: null,
      narrativeFlags: { ...state.narrativeFlags, discovered_memory_sanctuary: true },
    }));
    get().startDialogue(MEMORY_ROOM_ENTRY_TREE);
    get().saveGame();
  },

  placeTileInSocket: (socketId, tileId) =>
    set((state) => {
      const updatedPlaced = {
        ...state.placedTiles,
        [socketId]: tileId,
      };

      const updatedInventory = state.inventoryTiles.filter((t) => t !== tileId);

      // 1. Evaluate East Arcade Sequence Gate
      const socketTilesForSequence: Record<string, TileDefinition | null> = {
        socket_balcony_1: updatedPlaced.socket_balcony_1
          ? (TILE_CATALOG[updatedPlaced.socket_balcony_1] ?? null)
          : null,
        socket_balcony_2: updatedPlaced.socket_balcony_2
          ? (TILE_CATALOG[updatedPlaced.socket_balcony_2] ?? null)
          : null,
        socket_balcony_3: updatedPlaced.socket_balcony_3
          ? (TILE_CATALOG[updatedPlaced.socket_balcony_3] ?? null)
          : null,
      };

      const sequenceResult = evaluatePuzzle(EAST_ARCADE_SEQUENCE_PUZZLE, socketTilesForSequence);

      // 2. Evaluate Twin Doorway Same-Door Pair Gate
      const socketTilesForPair: Record<string, TileDefinition | null> = {
        socket_door_alpha: updatedPlaced.socket_door_alpha
          ? (TILE_CATALOG[updatedPlaced.socket_door_alpha] ?? null)
          : null,
        socket_door_beta: updatedPlaced.socket_door_beta
          ? (TILE_CATALOG[updatedPlaced.socket_door_beta] ?? null)
          : null,
      };

      const pairResult = evaluatePuzzle(EAST_ARCADE_SAME_DOOR_PUZZLE, socketTilesForPair);

      let message = state.narrativeMessage;
      let newCheckpoint = state.checkpoint;

      if (sequenceResult.isSolved && !state.balconiesAligned) {
        message =
          'Sequence Bamboo (2-3-4) completed! The three balconies shift and lock into a solid bridge across the void.';
        newCheckpoint = 'cp_balconies_aligned';
      } else if (pairResult.isSolved && !state.sameDoorPairActive) {
        message =
          'Pair of Red Dragons established! The twin doorways are now identical points in space.';
        newCheckpoint = 'cp_same_door_active';
      }

      return {
        placedTiles: updatedPlaced,
        inventoryTiles: updatedInventory,
        selectedSlot: Math.max(0, Math.min(state.selectedSlot, updatedInventory.length - 1)),
        balconiesAligned: sequenceResult.isSolved,
        sameDoorPairActive: pairResult.isSolved,
        narrativeMessage: message,
        checkpoint: newCheckpoint,
      };
    }),

  traverseSameDoor: (fromDoor) => {
    const { sameDoorPairActive } = get();
    if (!sameDoorPairActive) return;

    set({ portalWarping: true });

    if (fromDoor === 'alpha') {
      // Warp to Doorway Beta High Tower observation deck
      set({
        playerPosition: [-3.5, 0, -15.8],
        checkpoint: 'cp_upper_terrace_reached',
        narrativeMessage:
          'Impossible Traversal: Alice steps through Doorway Alpha and emerges at Doorway Beta on the high observation tower.',
      });
    } else {
      // Warp back to Doorway Alpha Pavilion
      set({
        playerPosition: [3.5, 0, -8.5],
        checkpoint: 'cp_door_alpha_returned',
        narrativeMessage:
          'Impossible Traversal: Alice steps through Doorway Beta and returns to Doorway Alpha.',
      });
    }

    setTimeout(() => {
      set({ portalWarping: false });
    }, 400);

    get().saveGame();
  },

  setActiveInteractable: (interactable) => set({ activeInteractable: interactable }),
  setActiveInspection: (inspection) => set({ activeInspection: inspection }),
  setNarrativeMessage: (message) => set({ narrativeMessage: message }),
  setHintLevel: (level) => set({ activeHintLevel: Math.min(3, Math.max(1, level)) }),
  toggleHintModal: () => set((state) => ({ hintModalOpen: !state.hintModalOpen })),

  // Phase 4: Dialogue Actions
  startDialogue: (tree, startNodeId) => {
    const initialId = startNodeId || tree.initialNodeId;
    const initialNode = tree.nodes[initialId] || null;
    if (!initialNode) return;

    set({
      activeDialogueTree: tree,
      activeDialogueNode: initialNode,
      dialogueHistory: [initialNode],
    });
  },

  advanceDialogue: (choiceIndex) => {
    const { activeDialogueTree, activeDialogueNode, dialogueHistory } = get();
    if (!activeDialogueTree || !activeDialogueNode) return;

    let nextNodeId: string | undefined;

    if (
      choiceIndex !== undefined &&
      activeDialogueNode.choices &&
      activeDialogueNode.choices[choiceIndex]
    ) {
      const choice = activeDialogueNode.choices[choiceIndex];
      nextNodeId = choice.nextNodeId;
      if (choice.setFlag) {
        get().setNarrativeFlag(choice.setFlag, true);
      }
    } else {
      nextNodeId = activeDialogueNode.nextNodeId;
    }

    if (nextNodeId && activeDialogueTree.nodes[nextNodeId]) {
      const nextNode: DialogueNode = activeDialogueTree.nodes[nextNodeId]!;
      set({
        activeDialogueNode: nextNode,
        dialogueHistory: [...dialogueHistory, nextNode],
      });
    } else {
      get().closeDialogue();
    }
  },

  closeDialogue: () => {
    const { memoryFragments, memoryReconstructed } = get();
    set({
      activeDialogueTree: null,
      activeDialogueNode: null,
    });

    // If all 3 fragments are collected and memory is not yet reconstructed, trigger reconstruction
    if (
      memoryFragments.eastGate &&
      memoryFragments.midnightBell &&
      memoryFragments.captainSeal &&
      !memoryReconstructed
    ) {
      get().reconstructMemory();
    }
  },

  setNarrativeFlag: (flag, value = true) =>
    set((state) => ({
      narrativeFlags: {
        ...state.narrativeFlags,
        [flag]: value,
      },
    })),

  collectMemoryFragment: (fragmentId) => {
    set((state) => {
      const updated = {
        ...state.memoryFragments,
        [fragmentId]: true,
      };

      const allCollected = updated.eastGate && updated.midnightBell && updated.captainSeal;

      return {
        memoryFragments: updated,
        checkpoint: allCollected ? 'cp_all_fragments_collected' : state.checkpoint,
        narrativeMessage: `Collected Memory Fragment: [${fragmentId}]. Place on Dais of Triads.`,
      };
    });

    if (fragmentId === 'eastGate') get().startDialogue(FRAGMENT_EAST_GATE_TREE);
    else if (fragmentId === 'midnightBell') get().startDialogue(FRAGMENT_MIDNIGHT_BELL_TREE);
    else if (fragmentId === 'captainSeal') get().startDialogue(FRAGMENT_CAPTAIN_SEAL_TREE);

    get().saveGame();
  },

  reconstructMemory: () => {
    set({
      memoryReconstructed: true,
      checkpoint: 'cp_memory_reconstructed',
      narrativeMessage:
        'Holographic Memory Reconstructed! The true history of the Jade Wall and the path ahead are revealed.',
    });
    get().startDialogue(MEMORY_RECONSTRUCTED_TREE);
    get().saveGame();
  },

  // Persistence
  saveGame: () => {
    const state = get();
    const saveState: SaveStateV1 = {
      version: 1,
      savedAt: new Date().toISOString(),
      currentScene: state.currentScene,
      checkpoint: state.checkpoint,
      playerPosition: state.playerPosition,
      inventoryTiles: state.inventoryTiles,
      selectedSlot: state.selectedSlot,
      teaHouseUnlocked: state.teaHouseUnlocked,
      hasWhiteTile: state.hasWhiteTile,
      hasBamboo4: state.hasBamboo4,
      hasRedDragon: state.hasRedDragon,
      balconiesAligned: state.balconiesAligned,
      sameDoorPairActive: state.sameDoorPairActive,
      placedTiles: state.placedTiles,
      narrativeFlags: state.narrativeFlags,
      memoryFragments: state.memoryFragments,
      memoryReconstructed: state.memoryReconstructed,
    };
    return saveToLocalStorage(saveState);
  },

  loadGame: () => {
    const loaded = loadFromLocalStorage();
    if (!loaded) return false;

    set({
      currentScene: loaded.currentScene,
      checkpoint: loaded.checkpoint,
      playerPosition: loaded.playerPosition,
      inventoryTiles: loaded.inventoryTiles as TileId[],
      selectedSlot: loaded.selectedSlot,
      teaHouseUnlocked: loaded.teaHouseUnlocked,
      hasWhiteTile: loaded.hasWhiteTile,
      hasBamboo4: loaded.hasBamboo4,
      hasRedDragon: loaded.hasRedDragon,
      balconiesAligned: loaded.balconiesAligned,
      sameDoorPairActive: loaded.sameDoorPairActive,
      placedTiles: loaded.placedTiles as Record<string, TileId | null>,
      narrativeFlags: loaded.narrativeFlags,
      memoryFragments: loaded.memoryFragments,
      memoryReconstructed: loaded.memoryReconstructed,
    });
    return true;
  },

  resetGame: () => {
    const initial = createInitialSave();
    set({
      currentScene: initial.currentScene,
      checkpoint: initial.checkpoint,
      playerPosition: initial.playerPosition,
      inventoryTiles: initial.inventoryTiles as TileId[],
      selectedSlot: initial.selectedSlot,
      teaHouseUnlocked: initial.teaHouseUnlocked,
      hasWhiteTile: initial.hasWhiteTile,
      hasBamboo4: initial.hasBamboo4,
      hasRedDragon: initial.hasRedDragon,
      balconiesAligned: initial.balconiesAligned,
      sameDoorPairActive: initial.sameDoorPairActive,
      placedTiles: initial.placedTiles as Record<string, TileId | null>,
      narrativeFlags: initial.narrativeFlags,
      memoryFragments: initial.memoryFragments,
      memoryReconstructed: initial.memoryReconstructed,
      activeInteractable: null,
      activeInspection: null,
      activeDialogueTree: null,
      activeDialogueNode: null,
      dialogueHistory: [],
      narrativeMessage: 'Rain Alley — Step forward into the forgotten passage.',
    });
  },
}));

export default useGameStore;
