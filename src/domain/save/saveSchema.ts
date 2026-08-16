export interface MemoryFragmentState {
  eastGate: boolean;
  midnightBell: boolean;
  captainSeal: boolean;
}

export interface SaveStateV1 {
  version: 1;
  savedAt: string;
  currentScene: 'rain_alley' | 'east_arcade' | 'memory_room' | 'discard_passage' | 'boss_court';
  checkpoint: string;
  playerPosition: [number, number, number];
  inventoryTiles: string[];
  selectedSlot: number;
  teaHouseUnlocked: boolean;
  hasWhiteTile: boolean;
  hasBamboo4: boolean;
  hasRedDragon: boolean;
  balconiesAligned: boolean;
  sameDoorPairActive: boolean;
  placedTiles: Record<string, string | null>;
  narrativeFlags: Record<string, boolean>;
  memoryFragments: MemoryFragmentState;
  memoryReconstructed: boolean;
  sacrificedTile: string | null;
  discardPassageChoice: 'archivist' | 'regent' | null;
  discardPassageResolved: boolean;
  westPathOpen: boolean;
  eastPathOpen: boolean;
}

export const SAVE_STORAGE_KEY = 'ttjw_save_slot_0';

export function createInitialSave(overrides?: Partial<SaveStateV1>): SaveStateV1 {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    currentScene: 'rain_alley',
    checkpoint: 'cp_alley_start',
    playerPosition: [0, 0, 8.0],
    inventoryTiles: [],
    selectedSlot: 0,
    teaHouseUnlocked: false,
    hasWhiteTile: false,
    hasBamboo4: false,
    hasRedDragon: false,
    balconiesAligned: false,
    sameDoorPairActive: false,
    placedTiles: {
      socket_balcony_1: 'tile_bamboo_2',
      socket_balcony_2: 'tile_bamboo_3',
      socket_balcony_3: null,
      socket_door_alpha: 'tile_dragon_red',
      socket_door_beta: null,
    },
    narrativeFlags: {
      examined_first_pedestal: false,
      heard_tea_house_rumor: false,
      unlocked_upper_terrace: false,
      discovered_memory_sanctuary: false,
    },
    memoryFragments: {
      eastGate: false,
      midnightBell: false,
      captainSeal: false,
    },
    memoryReconstructed: false,
    sacrificedTile: null,
    discardPassageChoice: null,
    discardPassageResolved: false,
    westPathOpen: false,
    eastPathOpen: false,
    ...overrides,
  };
}

export function serializeSave(state: SaveStateV1): string {
  return JSON.stringify({
    ...state,
    savedAt: new Date().toISOString(),
  });
}

export function deserializeSave(json: string): SaveStateV1 {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Malformed save data: root must be an object');
    }

    // Version migration hook
    if (parsed.version === 1) {
      return {
        ...createInitialSave(),
        ...parsed,
        version: 1,
      };
    }

    throw new Error(`Unsupported save version: ${parsed.version}`);
  } catch (err) {
    throw new Error(`Failed to deserialize save: ${(err as Error).message}`);
  }
}

export function saveToLocalStorage(state: SaveStateV1, key = SAVE_STORAGE_KEY): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const serialized = serializeSave(state);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

export function loadFromLocalStorage(key = SAVE_STORAGE_KEY): SaveStateV1 | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const item = window.localStorage.getItem(key);
    if (!item) return null;
    return deserializeSave(item);
  } catch {
    return null;
  }
}

export function clearLocalStorageSave(key = SAVE_STORAGE_KEY): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignored in headless/restricted storage environments
  }
}
