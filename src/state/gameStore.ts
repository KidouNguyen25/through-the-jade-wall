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
  DISCARD_PASSAGE_ENTRY_TREE,
  DISCARD_ARCHIVIST_CONSEQUENCE_TREE,
  DISCARD_REGENT_CONSEQUENCE_TREE,
  DISCARD_WHITE_TILE_REJECTED_TREE,
  DEAD_HAND_ENTRY_TREE,
  DEAD_HAND_DETECTED_TREE,
  DEAD_HAND_INVALIDATED_TREE,
} from '../domain/narrative/dialogueData';
import { DiscardAltarType, evaluateSacrifice } from '../domain/discard/discardModel';
import { evaluateInvalidation } from '../domain/deadhand/deadHandModel';
import { BossPhase, WindDirection, evaluateBossInterruption } from '../domain/boss/dealerBossModel';
import {
  DEALER_INTRO_TREE,
  DEALER_WIND_EAST_TREE,
  DEALER_WIND_SOUTH_TREE,
  DEALER_FORCED_HAND_TREE,
  DEALER_WHITE_TILE_INTERRUPT_TREE,
} from '../domain/narrative/dialogueData';

import { audioEngine } from '../audio/audioEngine';
import { useSettingsStore } from './settingsStore';

const getSfxVolume = () => {
  try {
    const s = useSettingsStore.getState();
    return s.masterVolume * s.sfxVolume;
  } catch {
    return 0.5;
  }
};

export type SceneId =
  'rain_alley' | 'east_arcade' | 'memory_room' | 'discard_passage' | 'dead_hand' | 'boss_court';

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

  // Phase 5: Discard Consequence State
  sacrificedTile: string | null;
  discardPassageChoice: 'archivist' | 'regent' | null;
  discardPassageResolved: boolean;
  westPathOpen: boolean;
  eastPathOpen: boolean;

  // Phase 6: Dead Hand Encounter State
  deadHandInvalidated: boolean;
  bossCourtUnlocked: boolean;
  watchersFrozen: boolean;

  // Phase 7: Dealer Boss Puzzle State
  dealerPhase: BossPhase;
  arenaRotation: number;
  activeHazardWind: WindDirection | null;
  whiteTileInscribed: boolean;
  verticalSliceCompleted: boolean;
  victoryModalOpen: boolean;

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
  enterDiscardPassage: () => void;
  enterDeadHandCourtyard: () => void;
  triggerWatcherDetection: () => void;
  activateDeadHandInvalidation: () => boolean;
  performSacrifice: (altar: DiscardAltarType) => boolean;
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

  // Phase 7 Actions
  enterBossCourt: () => void;
  advanceBossWind: (targetPhase: 'wind_east' | 'wind_south' | 'forced_hand') => void;
  interruptWithWhiteTile: () => boolean;
  closeVictoryModal: () => void;

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

  // Phase 5 state
  sacrificedTile: null,
  discardPassageChoice: null,
  discardPassageResolved: false,
  westPathOpen: false,
  eastPathOpen: false,

  // Phase 6 state
  deadHandInvalidated: false,
  bossCourtUnlocked: false,
  watchersFrozen: false,

  // Phase 7 state
  dealerPhase: 'intro',
  arenaRotation: 0,
  activeHazardWind: null,
  whiteTileInscribed: false,
  verticalSliceCompleted: false,
  victoryModalOpen: false,

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

  collectWhiteTile: () => {
    audioEngine.playTileInteractSound(getSfxVolume());
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
    });
  },

  collectBamboo4: () => {
    audioEngine.playTileInteractSound(getSfxVolume());
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
    });
  },

  collectRedDragon: () => {
    audioEngine.playTileInteractSound(getSfxVolume());
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
    });
  },

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

  enterDiscardPassage: () => {
    set({
      currentScene: 'discard_passage',
      playerPosition: [0, 0, 6.0],
      checkpoint: 'cp_discard_passage_entered',
      narrativeMessage:
        'Passage of Broken Tiles — Two colossal sacrificial altars stand above the abyss.',
      activeInteractable: null,
      activeInspection: null,
      activeHintLevel: 1,
    });
    get().startDialogue(DISCARD_PASSAGE_ENTRY_TREE);
    get().saveGame();
  },

  performSacrifice: (altar: DiscardAltarType) => {
    const state = get();
    if (state.discardPassageResolved) return false;

    const selectedTileId = state.inventoryTiles[state.selectedSlot] ?? null;
    const result = evaluateSacrifice(altar, selectedTileId);

    if (!result.success) {
      if (result.narrativeKey === 'WHITE_TILE_PROTECTED') {
        get().startDialogue(DISCARD_WHITE_TILE_REJECTED_TREE);
      } else {
        set({
          narrativeMessage: result.rejectionReason ?? 'The altar rejected this offering.',
        });
      }
      return false;
    }

    // Successful sacrifice
    const remainingTiles = state.inventoryTiles.filter((_, index) => index !== state.selectedSlot);

    const isWest = result.openedPath === 'west';
    audioEngine.playGateShiftSound(getSfxVolume());

    set({
      inventoryTiles: remainingTiles,
      selectedSlot: Math.max(0, Math.min(state.selectedSlot, remainingTiles.length - 1)),
      sacrificedTile: result.sacrificedTileId,
      discardPassageChoice: isWest ? 'archivist' : 'regent',
      discardPassageResolved: true,
      westPathOpen: isWest,
      eastPathOpen: !isWest,
      checkpoint: isWest ? 'cp_discard_archivist_chosen' : 'cp_discard_regent_chosen',
      narrativeMessage: isWest
        ? 'Scholar’s sacrifice accepted! West portcullis rises as East passage collapses.'
        : 'Martial sacrifice accepted! East iron gate ascends as West archway collapses.',
      activeInteractable: null,
    });

    if (isWest) {
      get().startDialogue(DISCARD_ARCHIVIST_CONSEQUENCE_TREE);
    } else {
      get().startDialogue(DISCARD_REGENT_CONSEQUENCE_TREE);
    }

    get().saveGame();
    return true;
  },

  enterDeadHandCourtyard: () => {
    set({
      currentScene: 'dead_hand',
      playerPosition: [0, 0, 7.5],
      checkpoint: 'cp_dead_hand_entered',
      narrativeMessage:
        'Courtyard of the Watchers — Two patrolling sentinels scan the floor. Stand on Safe Discard tiles to remain hidden.',
      activeInteractable: null,
      activeInspection: null,
      activeHintLevel: 1,
    });
    get().startDialogue(DEAD_HAND_ENTRY_TREE);
    get().saveGame();
  },

  triggerWatcherDetection: () => {
    const state = get();
    if (state.watchersFrozen) return;

    set({
      playerPosition: [0, 0, 7.5],
      narrativeMessage: 'Detected by Watcher Sentinel! Repositioned to courtyard entrance.',
      activeInteractable: null,
    });
    get().startDialogue(DEAD_HAND_DETECTED_TREE);
  },

  activateDeadHandInvalidation: () => {
    const state = get();
    const result = evaluateInvalidation(state.hasWhiteTile, state.deadHandInvalidated);

    if (!result.success) {
      set({ narrativeMessage: result.message });
      return false;
    }

    audioEngine.playChomboGongSound(getSfxVolume());

    set({
      deadHandInvalidated: true,
      bossCourtUnlocked: true,
      watchersFrozen: true,
      checkpoint: 'cp_dead_hand_invalidated',
      narrativeMessage: result.message,
      activeInteractable: null,
    });

    get().startDialogue(DEAD_HAND_INVALIDATED_TREE);
    get().saveGame();
    return true;
  },

  placeTileInSocket: (socketId, tileId) => {
    audioEngine.playTileInteractSound(getSfxVolume());
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
        audioEngine.playGateShiftSound(getSfxVolume());
        message =
          'Sequence Bamboo (2-3-4) completed! The three balconies shift and lock into a solid bridge across the void.';
        newCheckpoint = 'cp_balconies_aligned';
      } else if (pairResult.isSolved && !state.sameDoorPairActive) {
        audioEngine.playGateShiftSound(getSfxVolume());
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
    });
  },

  traverseSameDoor: (fromDoor) => {
    const { sameDoorPairActive } = get();
    if (!sameDoorPairActive) return;

    audioEngine.playGateShiftSound(getSfxVolume());
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
    const { memoryFragments, memoryReconstructed, verticalSliceCompleted } = get();
    set({
      activeDialogueTree: null,
      activeDialogueNode: null,
      victoryModalOpen: verticalSliceCompleted ? true : get().victoryModalOpen,
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
    audioEngine.playTileInteractSound(getSfxVolume());
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
    audioEngine.playMemoryHologramSound(getSfxVolume());
    set({
      memoryReconstructed: true,
      checkpoint: 'cp_memory_reconstructed',
      narrativeMessage:
        'Holographic Memory Reconstructed! The true history of the Jade Wall and the path ahead are revealed.',
    });
    get().startDialogue(MEMORY_RECONSTRUCTED_TREE);
    get().saveGame();
  },

  // Phase 7: Dealer Boss Puzzle Actions
  enterBossCourt: () => {
    set({
      currentScene: 'boss_court',
      playerPosition: [0, 0, 8.5],
      checkpoint: 'cp_boss_court_entered',
      dealerPhase: 'intro',
      arenaRotation: 0,
      activeHazardWind: null,
      activeInteractable: null,
      activeInspection: null,
      narrativeMessage:
        'The Seat of the Dealer — A vast circular amphitheater under the eye of the Supreme Arbiter.',
    });
    get().startDialogue(DEALER_INTRO_TREE);
    get().saveGame();
  },

  advanceBossWind: (targetPhase) => {
    audioEngine.playGateShiftSound(getSfxVolume());
    if (targetPhase === 'wind_east') {
      set({
        dealerPhase: 'wind_east',
        arenaRotation: 0,
        activeHazardWind: 'east',
        checkpoint: 'cp_boss_wind_east',
        narrativeMessage:
          'Wind of the East (Ton) active! The East sector radiates with hazard energy. Safe haven is West.',
      });
      get().startDialogue(DEALER_WIND_EAST_TREE);
    } else if (targetPhase === 'wind_south') {
      set({
        dealerPhase: 'wind_south',
        arenaRotation: Math.PI / 2,
        activeHazardWind: 'south',
        checkpoint: 'cp_boss_wind_south',
        narrativeMessage:
          'Wind of the South (Nan) active! The court rotates 90 degrees. Safe haven is North.',
      });
      get().startDialogue(DEALER_WIND_SOUTH_TREE);
    } else if (targetPhase === 'forced_hand') {
      set({
        dealerPhase: 'forced_hand',
        arenaRotation: Math.PI,
        activeHazardWind: null,
        checkpoint: 'cp_boss_forced_hand',
        narrativeMessage: 'RON! The Dealer demands the Final Hand pair on the Tribunal Anchor!',
      });
      get().startDialogue(DEALER_FORCED_HAND_TREE);
    }
    get().saveGame();
  },

  interruptWithWhiteTile: () => {
    const { inventoryTiles, selectedSlot, dealerPhase } = get();
    const selectedTileId = inventoryTiles[selectedSlot] ?? null;

    const result = evaluateBossInterruption(selectedTileId, dealerPhase);

    if (!result.success) {
      set({ narrativeMessage: result.message });
      return false;
    }

    audioEngine.playClimaxShatterSound(getSfxVolume());

    // Success: Refuse the premise with the White Tile!
    set({
      dealerPhase: 'interrupted_victory',
      whiteTileInscribed: true,
      verticalSliceCompleted: true,
      victoryModalOpen: false,
      checkpoint: 'cp_vertical_slice_complete',
      activeHazardWind: null,
      activeInteractable: null,
      narrativeMessage:
        '“A hand may be complete and still be wrong.” The White Tile shatters the false trial. The vertical slice is complete.',
    });

    get().startDialogue(DEALER_WHITE_TILE_INTERRUPT_TREE);
    get().saveGame();
    return true;
  },

  closeVictoryModal: () => set({ victoryModalOpen: false }),

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
      sacrificedTile: state.sacrificedTile,
      discardPassageChoice: state.discardPassageChoice,
      discardPassageResolved: state.discardPassageResolved,
      westPathOpen: state.westPathOpen,
      eastPathOpen: state.eastPathOpen,
      deadHandInvalidated: state.deadHandInvalidated,
      bossCourtUnlocked: state.bossCourtUnlocked,
      dealerPhase: state.dealerPhase,
      whiteTileInscribed: state.whiteTileInscribed,
      verticalSliceCompleted: state.verticalSliceCompleted,
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
      sacrificedTile: loaded.sacrificedTile ?? null,
      discardPassageChoice: loaded.discardPassageChoice ?? null,
      discardPassageResolved: loaded.discardPassageResolved ?? false,
      westPathOpen: loaded.westPathOpen ?? false,
      eastPathOpen: loaded.eastPathOpen ?? false,
      deadHandInvalidated: loaded.deadHandInvalidated ?? false,
      bossCourtUnlocked: loaded.bossCourtUnlocked ?? false,
      watchersFrozen: loaded.deadHandInvalidated ?? false,
      dealerPhase: loaded.dealerPhase ?? 'intro',
      whiteTileInscribed: loaded.whiteTileInscribed ?? false,
      verticalSliceCompleted: loaded.verticalSliceCompleted ?? false,
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
      sacrificedTile: initial.sacrificedTile,
      discardPassageChoice: initial.discardPassageChoice,
      discardPassageResolved: initial.discardPassageResolved,
      westPathOpen: initial.westPathOpen,
      eastPathOpen: initial.eastPathOpen,
      deadHandInvalidated: initial.deadHandInvalidated,
      bossCourtUnlocked: initial.bossCourtUnlocked,
      watchersFrozen: false,
      dealerPhase: initial.dealerPhase,
      whiteTileInscribed: initial.whiteTileInscribed,
      verticalSliceCompleted: initial.verticalSliceCompleted,
      victoryModalOpen: false,
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
