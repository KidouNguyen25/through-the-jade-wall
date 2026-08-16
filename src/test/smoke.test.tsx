import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';

describe('Game State Management (Zustand)', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('initializes with default Rain Alley state', () => {
    const state = useGameStore.getState();
    expect(state.currentScene).toBe('rain_alley');
    expect(state.checkpoint).toBe('cp_alley_start');
    expect(state.isPaused).toBe(false);
    expect(state.inventoryTiles).toEqual([]);
    expect(state.hasWhiteTile).toBe(false);
  });

  it('updates scene transition correctly', () => {
    const store = useGameStore.getState();
    store.setCurrentScene('east_arcade');
    expect(useGameStore.getState().currentScene).toBe('east_arcade');
  });

  it('handles inventory tile addition and removal uniquely', () => {
    const store = useGameStore.getState();
    store.addTileToInventory('tile_bamboo_1');
    store.addTileToInventory('tile_bamboo_1'); // Duplicate should not create duplicate entries
    expect(useGameStore.getState().inventoryTiles).toEqual(['tile_bamboo_1']);

    store.addTileToInventory('tile_bamboo_2');
    expect(useGameStore.getState().inventoryTiles).toEqual(['tile_bamboo_1', 'tile_bamboo_2']);

    store.removeTileFromInventory('tile_bamboo_1');
    expect(useGameStore.getState().inventoryTiles).toEqual(['tile_bamboo_2']);
  });

  it('tracks placed tile states and narrative flags', () => {
    const store = useGameStore.getState();
    store.setNarrativeFlag('met_white_tile', true);

    const updated = useGameStore.getState();
    expect(updated.narrativeFlags['met_white_tile']).toBe(true);
  });
});

describe('Settings State Management', () => {
  it('updates accessibility and audio volume settings', () => {
    const settings = useSettingsStore.getState();
    settings.setMasterVolume(0.5);
    settings.setReducedMotion(true);

    const updated = useSettingsStore.getState();
    expect(updated.masterVolume).toBe(0.5);
    expect(updated.reducedMotion).toBe(true);
  });
});
