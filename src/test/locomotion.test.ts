import { describe, it, expect, beforeEach } from 'vitest';
import {
  clampPositionToBounds,
  isCollidingWithBox,
  resolveBoxCollision,
  ALLEY_BOUNDS,
  ALLEY_OBSTACLES,
} from '../domain/collision/collisionModel';
import {
  isWithinInteractionRange,
  getNearestInteractable,
  InteractableObject,
} from '../domain/interaction/interactionModel';
import { useGameStore } from '../state/gameStore';

describe('Collision Domain Logic', () => {
  const playerRadius = 0.45;

  it('clamps coordinates strictly within alley boundaries', () => {
    // Attempting to move past left wall (minX: -2.8)
    const [clampedX] = clampPositionToBounds(-4.0, 0, playerRadius, ALLEY_BOUNDS);
    expect(clampedX).toBeCloseTo(-2.8 + playerRadius, 5);

    // Attempting to move past South start boundary (maxZ: 9.0)
    const [, clampedZ] = clampPositionToBounds(0, 12.0, playerRadius, ALLEY_BOUNDS);
    expect(clampedZ).toBeCloseTo(9.0 - playerRadius, 5);
  });

  it('detects collision with obstacle boxes', () => {
    const pedestal = ALLEY_OBSTACLES[0]!; // [1.0 to 2.2, -4.2 to -2.8]

    // Point right next to pedestal penetrating border
    const colliding = isCollidingWithBox(0.9, -3.5, playerRadius, pedestal);
    expect(colliding).toBe(true);

    // Point far in the alley center
    const notColliding = isCollidingWithBox(0.0, 0.0, playerRadius, pedestal);
    expect(notColliding).toBe(false);
  });

  it('resolves penetration by pushing player outward along shallowest overlap', () => {
    const obstacle = { minX: 1.0, maxX: 2.0, minZ: -4.0, maxZ: -3.0 };

    // Player entering from the left (x = 0.8 penetrates 1.0 with radius 0.45)
    const [resolvedX, resolvedZ] = resolveBoxCollision(0.8, -3.5, playerRadius, obstacle);
    expect(resolvedX).toBeCloseTo(1.0 - playerRadius, 5);
    expect(resolvedZ).toBe(-3.5);
  });
});

describe('Interaction Domain Logic', () => {
  it('evaluates whether player is within interaction range', () => {
    const playerPos: [number, number, number] = [0, 0, 0];
    const triggerPos: [number, number, number] = [0, 0, 2.0];

    expect(isWithinInteractionRange(playerPos, triggerPos, 2.5)).toBe(true);
    expect(isWithinInteractionRange(playerPos, triggerPos, 1.5)).toBe(false);
  });

  it('selects nearest interactable within radius', () => {
    const playerPos: [number, number, number] = [0, 0, 0];
    const interactables: InteractableObject[] = [
      { id: 'far', name: 'Far Tile', position: [0, 0, 2], radius: 3, promptText: 'Far' },
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
    expect(updated.checkpoint).toBe('cp_tea_house_unlocked');
  });

  it('transitions scene upon entering Tea House', () => {
    const store = useGameStore.getState();
    store.collectWhiteTile();
    store.enterTeaHouse();

    const updated = useGameStore.getState();
    expect(updated.currentScene).toBe('east_arcade');
    expect(updated.checkpoint).toBe('cp_east_arcade_entered');
  });

  it('solves Same Door Pair and warps across space (Phase 3)', () => {
    const store = useGameStore.getState();
    store.enterTeaHouse();
    store.collectRedDragon();

    expect(useGameStore.getState().hasRedDragon).toBe(true);
    expect(useGameStore.getState().inventoryTiles).toContain('tile_dragon_red');

    // Place Red Dragon in Door Beta socket
    store.placeTileInSocket('socket_door_beta', 'tile_dragon_red');
    expect(useGameStore.getState().sameDoorPairActive).toBe(true);
    expect(useGameStore.getState().checkpoint).toBe('cp_same_door_active');

    // Traverse from Door Alpha -> Warps to Door Beta at [-3.5, 0, -15.8]
    store.traverseSameDoor('alpha');
    expect(useGameStore.getState().playerPosition).toEqual([-3.5, 0, -15.8]);
    expect(useGameStore.getState().checkpoint).toBe('cp_upper_terrace_reached');

    // Traverse from Door Beta -> Warps back to Door Alpha at [3.5, 0, -8.5]
    store.traverseSameDoor('beta');
    expect(useGameStore.getState().playerPosition).toEqual([3.5, 0, -8.5]);
  });
});
