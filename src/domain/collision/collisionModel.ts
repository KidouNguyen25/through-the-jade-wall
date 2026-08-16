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
