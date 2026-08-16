import { describe, it, expect, beforeEach } from 'vitest';
import {
  isPlayerInSafeZone,
  isPlayerDetectedByWatcher,
  evaluateInvalidation,
} from '../domain/deadhand/deadHandModel';
import { useGameStore } from '../state/gameStore';

describe('Phase 6 Dead Hand Domain Model', () => {
  it('correctly identifies safe discard sanctuary zones', () => {
    // West Sanctuary
    expect(isPlayerInSafeZone([-3.5, 0, 1.0])).toBe(true);
    // East Sanctuary
    expect(isPlayerInSafeZone([3.5, 0, 1.0])).toBe(true);
    // Central Gong Sanctuary
    expect(isPlayerInSafeZone([0, 0, -8.0])).toBe(true);

    // Open Courtyard
    expect(isPlayerInSafeZone([0, 0, 0])).toBe(false);
    expect(isPlayerInSafeZone([-1.0, 0, -3.0])).toBe(false);
  });

  it('evaluates Watcher detection based on distance, cone angle, safe zone, and stasis', () => {
    const watcherPos: [number, number, number] = [0, 0, 0];
    const watcherFacingAngle = 0; // Facing south (+Z)

    // Directly in front of Watcher, in cone (dx = 0, dz = 4.0)
    const inConePos: [number, number, number] = [0, 0, 4.0];
    expect(
      isPlayerDetectedByWatcher(
        inConePos,
        watcherPos,
        watcherFacingAngle,
        6.5,
        Math.PI / 3,
        false,
        false,
      ),
    ).toBe(true);

    // Behind Watcher (dz = -3.0)
    const behindPos: [number, number, number] = [0, 0, -3.0];
    expect(
      isPlayerDetectedByWatcher(
        behindPos,
        watcherPos,
        watcherFacingAngle,
        6.5,
        Math.PI / 3,
        false,
        false,
      ),
    ).toBe(false);

    // Far away (> 6.5m)
    const farPos: [number, number, number] = [0, 0, 10.0];
    expect(
      isPlayerDetectedByWatcher(
        farPos,
        watcherPos,
        watcherFacingAngle,
        6.5,
        Math.PI / 3,
        false,
        false,
      ),
    ).toBe(false);

    // Inside Safe Zone -> detection blocked
    expect(
      isPlayerDetectedByWatcher(
        inConePos,
        watcherPos,
        watcherFacingAngle,
        6.5,
        Math.PI / 3,
        true,
        false,
      ),
    ).toBe(false);

    // Watchers Frozen -> detection disabled
    expect(
      isPlayerDetectedByWatcher(
        inConePos,
        watcherPos,
        watcherFacingAngle,
        6.5,
        Math.PI / 3,
        false,
        true,
      ),
    ).toBe(false);
  });

  it('evaluates Invalidation Gong requirements and Chombo penalty', () => {
    // Missing White Tile
    const noTileResult = evaluateInvalidation(false, false);
    expect(noTileResult.success).toBe(false);
    expect(noTileResult.narrativeKey).toBe('MISSING_WHITE_TILE');

    // Valid Invalidation with White Tile
    const validResult = evaluateInvalidation(true, false);
    expect(validResult.success).toBe(true);
    expect(validResult.narrativeKey).toBe('DEAD_HAND_SUCCESS');
    expect(validResult.message).toContain('Chombo declared');

    // Already Invalidated
    const alreadyResult = evaluateInvalidation(true, true);
    expect(alreadyResult.success).toBe(false);
    expect(alreadyResult.narrativeKey).toBe('ALREADY_INVALIDATED');
  });
});

describe('Phase 6 Game Store State & Watcher Courtyard Progression', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('enters Dead Hand Courtyard and triggers entry monologue', () => {
    const store = useGameStore.getState();
    store.enterDeadHandCourtyard();

    const state = useGameStore.getState();
    expect(state.currentScene).toBe('dead_hand');
    expect(state.playerPosition).toEqual([0, 0, 7.5]);
    expect(state.checkpoint).toBe('cp_dead_hand_entered');
    expect(state.activeDialogueNode?.id).toBe('node_dhe_1');
  });

  it('triggers watcher detection and resets player position to entrance checkpoint', () => {
    const store = useGameStore.getState();
    store.enterDeadHandCourtyard();
    store.closeDialogue();

    // Player moves deep into courtyard
    store.setPlayerPosition([0, 0, -2.0]);
    expect(useGameStore.getState().playerPosition).toEqual([0, 0, -2.0]);

    // Detection triggered
    store.triggerWatcherDetection();

    const state = useGameStore.getState();
    expect(state.playerPosition).toEqual([0, 0, 7.5]);
    expect(state.activeDialogueNode?.id).toBe('node_det_1');
  });

  it('activates Dead Hand Invalidation, freezing watchers and unlocking boss court', () => {
    const store = useGameStore.getState();
    store.collectWhiteTile();
    store.enterDeadHandCourtyard();
    store.closeDialogue();

    const success = store.activateDeadHandInvalidation();
    expect(success).toBe(true);

    const state = useGameStore.getState();
    expect(state.deadHandInvalidated).toBe(true);
    expect(state.bossCourtUnlocked).toBe(true);
    expect(state.watchersFrozen).toBe(true);
    expect(state.checkpoint).toBe('cp_dead_hand_invalidated');
    expect(state.activeDialogueNode?.id).toBe('node_inv_1');

    // Subsequent detection is ignored when frozen
    store.setPlayerPosition([0, 0, -3.0]);
    store.triggerWatcherDetection();
    expect(useGameStore.getState().playerPosition).toEqual([0, 0, -3.0]);
  });

  it('persists and restores Dead Hand state across save and load', () => {
    const store = useGameStore.getState();
    store.collectWhiteTile();
    store.enterDeadHandCourtyard();
    store.activateDeadHandInvalidation();
    store.saveGame();

    // Reset game state
    store.resetGame();
    expect(useGameStore.getState().deadHandInvalidated).toBe(false);

    // Restore from save
    const loaded = store.loadGame();
    expect(loaded).toBe(true);

    const restored = useGameStore.getState();
    expect(restored.currentScene).toBe('dead_hand');
    expect(restored.deadHandInvalidated).toBe(true);
    expect(restored.bossCourtUnlocked).toBe(true);
    expect(restored.watchersFrozen).toBe(true);
  });
});
