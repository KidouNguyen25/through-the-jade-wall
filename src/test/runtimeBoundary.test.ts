import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPlayerRuntimePosition,
  setPlayerRuntimePosition,
  getPlayerRuntimeRotation,
  setPlayerRuntimeRotation,
  isPlayerRuntimeMoving,
  setPlayerRuntimeMoving,
  syncPlayerRuntimeFromDurable,
  resetPlayerRuntime,
  copyPlayerRuntimePositionTo,
} from '../game/runtime/playerRuntime';
import { getSceneDefinition } from '../world/scenes/sceneRegistry';
import { useGameStore } from '../state/gameStore';

describe('Phase 9.2: Runtime State Boundary', () => {
  beforeEach(() => {
    resetPlayerRuntime();
    useGameStore.getState().resetGame();
  });

  describe('playerRuntime module', () => {
    it('manages runtime player position without allocating new objects per read', () => {
      setPlayerRuntimePosition(1.5, 0, -4.2);
      const pos1 = getPlayerRuntimePosition();
      expect(pos1).toEqual([1.5, 0, -4.2]);

      setPlayerRuntimePosition(3.0, 0.5, -8.0);
      const pos2 = getPlayerRuntimePosition();
      expect(pos2).toEqual([3.0, 0.5, -8.0]);
    });

    it('copies runtime position into target vector-like objects in-place', () => {
      setPlayerRuntimePosition(2.0, 1.0, -5.5);
      const mockVector = {
        x: 0,
        y: 0,
        z: 0,
        set(x: number, y: number, z: number) {
          this.x = x;
          this.y = y;
          this.z = z;
        },
      };

      copyPlayerRuntimePositionTo(mockVector);
      expect(mockVector.x).toBe(2.0);
      expect(mockVector.y).toBe(1.0);
      expect(mockVector.z).toBe(-5.5);
    });

    it('tracks rotation and locomotion flags', () => {
      setPlayerRuntimeRotation(Math.PI / 2);
      setPlayerRuntimeMoving(true);
      expect(getPlayerRuntimeRotation()).toBe(Math.PI / 2);
      expect(isPlayerRuntimeMoving()).toBe(true);

      setPlayerRuntimeMoving(false);
      expect(isPlayerRuntimeMoving()).toBe(false);
    });

    it('synchronizes runtime state from durable coordinates on scene warp or load', () => {
      syncPlayerRuntimeFromDurable([5.0, 0, -10.0], Math.PI);
      const [x, y, z] = getPlayerRuntimePosition();
      expect(x).toBe(5.0);
      expect(y).toBe(0);
      expect(z).toBe(-10.0);
      expect(getPlayerRuntimeRotation()).toBe(Math.PI);
    });
  });

  describe('Scene Registry', () => {
    it('registers all 6 vertical slice scenes with typed metadata', () => {
      const scenes = [
        'rain_alley',
        'east_arcade',
        'memory_room',
        'discard_passage',
        'dead_hand',
        'boss_court',
      ] as const;

      for (const sceneId of scenes) {
        const def = getSceneDefinition(sceneId);
        expect(def).toBeDefined();
        expect(def.id).toBe(sceneId);
        expect(def.component).toBeDefined();
        expect(def.title).toBeTruthy();
        expect(def.actTitle).toBeTruthy();
      }
    });

    it('throws descriptive error on unknown scene ID in development', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => getSceneDefinition('unknown_scene' as any)).toThrow(
        /\[SceneRegistry\] Unknown sceneId: "unknown_scene"/,
      );
    });
  });

  describe('Persistence and Runtime Snapshot Integrity', () => {
    it('takes runtime player position snapshot into durable save', () => {
      // Set runtime position
      setPlayerRuntimePosition(4.5, 0, -7.5);

      // Save game
      useGameStore.getState().saveGame();

      // Reset and verify load recovers the snapshotted coordinates
      resetPlayerRuntime();
      expect(getPlayerRuntimePosition()).toEqual([0, 0, 0]);

      const loaded = useGameStore.getState().loadGame();
      expect(loaded).toBe(true);
      expect(useGameStore.getState().playerPosition).toEqual([4.5, 0, -7.5]);
      expect(getPlayerRuntimePosition()).toEqual([4.5, 0, -7.5]);
    });

    it('syncs player runtime when transitioning scenes', () => {
      useGameStore.getState().enterTeaHouse();
      expect(getPlayerRuntimePosition()).toEqual([0, 0, 8.0]);

      useGameStore.getState().enterMemoryRoom();
      expect(getPlayerRuntimePosition()).toEqual([0, 0, 4.5]);

      useGameStore.getState().enterDiscardPassage();
      expect(getPlayerRuntimePosition()).toEqual([0, 0, 6.0]);

      useGameStore.getState().enterDeadHandCourtyard();
      expect(getPlayerRuntimePosition()).toEqual([0, 0, 7.5]);

      useGameStore.getState().enterBossCourt();
      expect(getPlayerRuntimePosition()).toEqual([0, 0, 8.5]);
    });
  });
});
