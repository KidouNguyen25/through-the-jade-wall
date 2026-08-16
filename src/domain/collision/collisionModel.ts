export interface BoundingBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

// Alley bounding box: length along Z axis, narrow X
export const ALLEY_BOUNDS: BoundingBox = {
  minX: -2.8,
  maxX: 2.8,
  minZ: -15.0,
  maxZ: 9.0,
};

// East Arcade bounding box: extends from South Promenade across Balcony Bridge to Upper Terrace
export const EAST_ARCADE_BOUNDS: BoundingBox = {
  minX: -6.5,
  maxX: 6.5,
  minZ: -20.0,
  maxZ: 9.5,
};

// Memory Room Sanctuary bounding box: hexagonal/octagonal hall
export const MEMORY_ROOM_BOUNDS: BoundingBox = {
  minX: -7.0,
  maxX: 7.0,
  minZ: -14.0,
  maxZ: 6.0,
};

// Obstacles in Rain Alley
export const ALLEY_OBSTACLES: BoundingBox[] = [
  // White Tile Pedestal against right wall at [1.6, 0, -3.5]
  { minX: 1.0, maxX: 2.2, minZ: -4.2, maxZ: -2.8 },
  // Tea House Left Gate Column at z = -10.0
  { minX: -3.0, maxX: -1.4, minZ: -10.5, maxZ: -9.5 },
  // Tea House Right Gate Column at z = -10.0
  { minX: 1.4, maxX: 3.0, minZ: -10.5, maxZ: -9.5 },
];

// Obstacles in East Arcade
export const EAST_ARCADE_OBSTACLES: BoundingBox[] = [
  // Merchant Table at [3.0, 0, 4.0]
  { minX: 2.4, maxX: 3.6, minZ: 3.4, maxZ: 4.6 },
  // Sequence Gate Sockets Pedestal at [0, 0, 2.0]
  { minX: -2.8, maxX: 2.8, minZ: 1.5, maxZ: 2.5 },
  // Upper Pavilion Central Shrine Altar at [0, 0, -12.0]
  { minX: -0.7, maxX: 0.7, minZ: -12.7, maxZ: -11.3 },
  // Left Observation Tower wall at [-5.0, 0, -15.0]
  { minX: -6.0, maxX: -4.4, minZ: -16.0, maxZ: -14.0 },
  // Right Pavilion Wall at [5.0, 0, -10.0]
  { minX: 4.4, maxX: 6.0, minZ: -11.0, maxZ: -9.0 },
];

// Obstacles in Memory Room
export const MEMORY_ROOM_OBSTACLES: BoundingBox[] = [
  // Central Dais Projector Table at [0, 0, 0]
  { minX: -1.2, maxX: 1.2, minZ: -1.2, maxZ: 1.2 },
  // North Altar Wall at [0, 0, -9.0]
  { minX: -2.5, maxX: 2.5, minZ: -9.5, maxZ: -8.5 },
  // North Captain's Seal Pedestal at [0, 0, -6.5]
  { minX: -0.45, maxX: 0.45, minZ: -6.95, maxZ: -6.05 },
  // East Memory Pedestal at [3.5, 0, -3.0]
  { minX: 2.8, maxX: 4.2, minZ: -3.7, maxZ: -2.3 },
  // West Memory Pedestal at [-3.5, 0, -3.0]
  { minX: -4.2, maxX: -2.8, minZ: -3.7, maxZ: -2.3 },
];

// Bounds for Discard Passage
export const DISCARD_PASSAGE_BOUNDS: BoundingBox = {
  minX: -8.0,
  maxX: 8.0,
  minZ: -24.0,
  maxZ: 8.0,
};

// Obstacles in Discard Passage
export const DISCARD_PASSAGE_BASE_OBSTACLES: BoundingBox[] = [
  // Central Chasm Abyss Divider
  { minX: -0.8, maxX: 0.8, minZ: -18.0, maxZ: -1.0 },
  // West Archivist Stone Furnace at [-3.0, 0, -5.0]
  { minX: -3.7, maxX: -2.3, minZ: -5.7, maxZ: -4.3 },
  // East Regent Brazen Brazier at [3.0, 0, -5.0]
  { minX: 2.3, maxX: 3.7, minZ: -5.7, maxZ: -4.3 },
  // North Threshold Wall at [0, 0, -22.5]
  { minX: -2.0, maxX: 2.0, minZ: -23.5, maxZ: -22.0 },
];

export const WEST_GATE_BARRIER: BoundingBox = {
  minX: -7.5,
  maxX: -0.8,
  minZ: -9.5,
  maxZ: -8.5,
};

export const EAST_GATE_BARRIER: BoundingBox = {
  minX: 0.8,
  maxX: 7.5,
  minZ: -9.5,
  maxZ: -8.5,
};

// Bounds for Dead Hand Courtyard (Scene: 'dead_hand')
export const DEAD_HAND_BOUNDS: BoundingBox = {
  minX: -8.0,
  maxX: 8.0,
  minZ: -24.0,
  maxZ: 10.0,
};

// Obstacles in Dead Hand Courtyard
export const DEAD_HAND_BASE_OBSTACLES: BoundingBox[] = [
  // West Watcher Sentinel Pedestal at [-3.3, 0, -3.3]
  { minX: -4.0, maxX: -2.6, minZ: -4.0, maxZ: -2.6 },
  // East Watcher Sentinel Pedestal at [3.3, 0, -3.3]
  { minX: 2.6, maxX: 4.0, minZ: -4.0, maxZ: -2.6 },
  // Central Gong Invalidation Pedestal at [0, 0, -8.0]
  { minX: -1.0, maxX: 1.0, minZ: -8.8, maxZ: -7.2 },
  // North Boss Gate Wall at [0, 0, -22.5]
  { minX: -2.0, maxX: 2.0, minZ: -23.5, maxZ: -21.5 },
];

export const BOSS_GATE_BARRIER: BoundingBox = {
  minX: -7.0,
  maxX: 7.0,
  minZ: -19.5,
  maxZ: -18.5,
};

// Bounds for Dealer's Court (Scene: 'boss_court')
export const BOSS_COURT_BOUNDS: BoundingBox = {
  minX: -11.5,
  maxX: 11.5,
  minZ: -11.5,
  maxZ: 11.5,
};

// Obstacles in Dealer's Court
export const BOSS_COURT_BASE_OBSTACLES: BoundingBox[] = [
  // Central Tribunal Dais Pedestal at [0, 0, 0]
  { minX: -0.9, maxX: 0.9, minZ: -0.9, maxZ: 0.9 },
  // North Dealer Throne Dais at [0, 0, -9.0]
  { minX: -2.5, maxX: 2.5, minZ: -10.2, maxZ: -7.8 },
  // East Wind Obelisk at [8.5, 0, 0]
  { minX: 7.8, maxX: 9.2, minZ: -0.7, maxZ: 0.7 },
  // West Wind Obelisk at [-8.5, 0, 0]
  { minX: -9.2, maxX: -7.8, minZ: -0.7, maxZ: 0.7 },
  // South Wind Obelisk at [0, 0, 8.5]
  { minX: -0.7, maxX: 0.7, minZ: 7.8, maxZ: 9.2 },
];

// Chasm Void Obstacle (active when balconies are NOT aligned)
export const CHASM_VOID_OBSTACLE: BoundingBox = {
  minX: -6.5,
  maxX: 6.5,
  minZ: -1.8,
  maxZ: 0.2,
};

export function clampPositionToBounds(
  x: number,
  z: number,
  radius: number,
  bounds: BoundingBox,
): [number, number] {
  const clampedX = Math.max(bounds.minX + radius, Math.min(bounds.maxX - radius, x));
  const clampedZ = Math.max(bounds.minZ + radius, Math.min(bounds.maxZ - radius, z));
  return [clampedX, clampedZ];
}

export function isCollidingWithBox(
  x: number,
  z: number,
  radius: number,
  box: BoundingBox,
): boolean {
  const closestX = Math.max(box.minX, Math.min(box.maxX, x));
  const closestZ = Math.max(box.minZ, Math.min(box.maxZ, z));
  const dx = x - closestX;
  const dz = z - closestZ;
  return dx * dx + dz * dz < radius * radius;
}

export function resolveBoxCollision(
  x: number,
  z: number,
  radius: number,
  box: BoundingBox,
): [number, number] {
  if (!isCollidingWithBox(x, z, radius, box)) {
    return [x, z];
  }

  // Determine closest edge to push player out
  const overlapLeft = x + radius - box.minX;
  const overlapRight = box.maxX - (x - radius);
  const overlapBottom = z + radius - box.minZ;
  const overlapTop = box.maxZ - (z - radius);

  const minOverlap = Math.min(overlapLeft, overlapRight, overlapBottom, overlapTop);

  if (minOverlap === overlapLeft) return [box.minX - radius, z];
  if (minOverlap === overlapRight) return [box.maxX + radius, z];
  if (minOverlap === overlapBottom) return [x, box.minZ - radius];
  return [x, box.maxZ + radius];
}
