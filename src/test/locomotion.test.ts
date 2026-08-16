import { describe, it, expect, beforeEach } from 'vitest';
import {
  clampPositionToBounds,
  isCollidingWithBox,
  resolveBoxCollision,
  BoundingBox,
} from '../domain/collision/collisionModel';
import {
  isWithinInteractionRange,
  getNearestInteractable,
  InteractableObject,
} from '../domain/interaction/interactionModel';
import { useGameStore } from '../state/gameStore';

describe('Collision Domain Logic', () => {
  const testBounds: BoundingBox = {
    minX: -5,
    maxX: 5,
    minZ: -10,
    maxZ: 10,
  };

  it('clamps coordinates strictly within alley boundaries', () => {
    const radius = 0.5;
    // Outside left
    expect(clampPositionToBounds(-6, 0, radius, testBounds)).toEqual([-4.5, 0]);
    // Outside right
    expect(clampPositionToBounds(8, 0, radius, testBounds)).toEqual([4.5, 0]);
    // Outside bottom
    expect(clampPositionToBounds(0, -12, radius, testBounds)).toEqual([0, -9.5]);
    // Outside top
    expect(clampPositionToBounds(0, 15, radius, testBounds)).toEqual([0, 9.5]);
    // Inside untouched
    expect(clampPositionToBounds(1, 2, radius, testBounds)).toEqual([1, 2]);
  });

  it('detects collision with obstacle boxes', () => {
    const obstacle: BoundingBox = {
      minX: -1,
      maxX: 1,
      minZ: -1,
      maxZ: 1,
    };
    const radius = 0.5;

    // Inside box
    expect(isCollidingWithBox(0, 0, radius, obstacle)).toBe(true);
    // Touching perimeter
    expect(isCollidingWithBox(1.2, 0, radius, obstacle)).toBe(true);
    // Well outside
    expect(isCollidingWithBox(3, 0, radius, obstacle)).toBe(false);
  });

  it('resolves penetration by pushing player outward along shallowest overlap', () => {
    const obstacle: BoundingBox = {
      minX: -1,
      maxX: 1,
      minZ: -1,
      maxZ: 1,
    };
    const radius = 0.5;

    // Approaching from right (+X)
    const [resolvedX, resolvedZ] = resolveBoxCollision(1.3, 0, radius, obstacle);
    expect(resolvedX).toBeCloseTo(1.5);
    expect(resolvedZ).toBe(0);

    // Uncolliding point stays unchanged
    expect(resolveBoxCollision(5, 5, radius, obstacle)).toEqual([5, 5]);
  });
});

describe('Interaction Domain Logic', () => {
  it('evaluates whether player is within interaction range', () => {
    const targetPos: [number, number, number] = [0, 1, 0];
    const radius = 2.0;

    // Inside range
    expect(isWithinInteractionRange([0, 1, 1], targetPos, radius)).toBe(true);
    // Right at boundary
    expect(isWithinInteractionRange([2, 1, 0], targetPos, radius)).toBe(true);
    // Outside range
    expect(isWithinInteractionRange([0, 1, 3], targetPos, radius)).toBe(false);
  });

  it('selects nearest interactable within radius', () => {
    const playerPos: [number, number, number] = [0, 0, 0];
    const interactables: InteractableObject[] = [
      { id: 'far', name: 'Far Tile', position: [0, 0, 5], radius: 6, promptText: 'Far' },
      { id: 'near', name: 'Near Tile', position: [0, 0, 1], radius: 2, promptText: 'Near' },
      { id: 'out', name: 'Out of Range', position: [0, 0, 10], radius: 2, promptText: 'Out' },
    ];

    const nearest = getNearestInteractable(playerPos, interactables);
    expect(nearest?.id).toBe('near');
  });
});

describe('Progression State Machine', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('collects White Tile and unlocks Tea House entrance', () => {
    const store = useGameStore.getState();
    expect(store.hasWhiteTile).toBe(false);
    expect(store.teaHouseUnlocked).toBe(false);

    store.collectWhiteTile();

    const updated = useGameStore.getState();
    expect(updated.hasWhiteTile).toBe(true);
    expect(updated.teaHouseUnlocked).toBe(true);
    expect(updated.inventoryTiles).toContain('tile_white_dragon');
    expect(updated.activeCheckpoint).toBe('cp_white_tile_collected');
    expect(updated.narrativeFlags['collected_white_tile']).toBe(true);
  });

  it('transitions scene upon entering Tea House', () => {
    const store = useGameStore.getState();
    store.collectWhiteTile();
    store.enterTeaHouse();

    const updated = useGameStore.getState();
    expect(updated.playerInsideTeaHouse).toBe(true);
    expect(updated.currentScene).toBe('east_arcade');
    expect(updated.activeCheckpoint).toBe('cp_east_arcade_start');
    expect(updated.narrativeFlags['entered_tea_house']).toBe(true);
  });

  it('solves Same Door Pair and warps across space (Phase 3)', () => {
    const store = useGameStore.getState();
    store.enterTeaHouse();
    store.collectRedDragon();

    expect(useGameStore.getState().hasRedDragon).toBe(true);
    expect(useGameStore.getState().inventoryTiles).toContain('tile_dragon_red');

    // Place Red Dragon in Door Beta socket
    const solved = store.placeTileInSocket('socket_door_beta', 'tile_dragon_red');
    expect(solved).toBe(true);
    expect(useGameStore.getState().sameDoorPairActive).toBe(true);
    expect(useGameStore.getState().activeCheckpoint).toBe('cp_same_door_paired');

    // Traverse from Door Alpha -> Warps to Door Beta at [-3.5, 0, -15.8]
    store.traverseSameDoor('alpha');
    expect(useGameStore.getState().playerPosition).toEqual([-3.5, 0, -15.8]);
    expect(useGameStore.getState().activeCheckpoint).toBe('cp_upper_terrace_reached');

    // Traverse from Door Beta -> Warps back to Door Alpha at [3.5, 0, -8.5]
    store.traverseSameDoor('beta');
    expect(useGameStore.getState().playerPosition).toEqual([3.5, 0, -8.5]);
  });
});
