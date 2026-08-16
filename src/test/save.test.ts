import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialSave,
  serializeSave,
  deserializeSave,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorageSave,
} from '../domain/save/saveSchema';

describe('SaveSchema v1 Persistence & Migration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates valid initial save state with version 1', () => {
    const save = createInitialSave();
    expect(save.version).toBe(1);
    expect(save.currentScene).toBe('rain_alley');
    expect(save.checkpoint).toBe('cp_alley_start');
    expect(save.memoryFragments.eastGate).toBe(false);
    expect(save.memoryReconstructed).toBe(false);
  });

  it('serializes and deserializes save state losslessly', () => {
    const original = createInitialSave({
      currentScene: 'memory_room',
      checkpoint: 'cp_all_fragments_collected',
      hasWhiteTile: true,
      hasBamboo4: true,
      hasRedDragon: true,
      memoryFragments: {
        eastGate: true,
        midnightBell: true,
        captainSeal: true,
      },
      memoryReconstructed: true,
    });

    const json = serializeSave(original);
    const restored = deserializeSave(json);

    expect(restored.version).toBe(1);
    expect(restored.currentScene).toBe('memory_room');
    expect(restored.checkpoint).toBe('cp_all_fragments_collected');
    expect(restored.memoryReconstructed).toBe(true);
    expect(restored.memoryFragments.eastGate).toBe(true);
  });

  it('persists and retrieves from LocalStorage', () => {
    const state = createInitialSave({
      currentScene: 'east_arcade',
      checkpoint: 'cp_same_door_active',
      sameDoorPairActive: true,
    });

    const saved = saveToLocalStorage(state);
    expect(saved).toBe(true);

    const loaded = loadFromLocalStorage();
    expect(loaded).not.toBeNull();
    expect(loaded?.currentScene).toBe('east_arcade');
    expect(loaded?.sameDoorPairActive).toBe(true);

    clearLocalStorageSave();
    expect(loadFromLocalStorage()).toBeNull();
  });

  it('throws descriptive error on malformed or unsupported save version', () => {
    expect(() => deserializeSave('{ "invalid": true }')).toThrow(/Unsupported save version/);
    expect(() => deserializeSave('not a json')).toThrow(/Failed to deserialize save/);
  });
});
