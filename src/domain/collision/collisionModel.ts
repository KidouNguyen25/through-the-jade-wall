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

// Obstacles in the alley (pedestals, crates, lantern posts)
export const ALLEY_OBSTACLES: BoundingBox[] = [
  // White Tile Pedestal at z = -3.5
  { minX: -0.8, maxX: 0.8, minZ: -4.2, maxZ: -2.8 },
  // Tea House Left Gate Column at z = -10.0
  { minX: -3.0, maxX: -1.4, minZ: -10.5, maxZ: -9.5 },
  // Tea House Right Gate Column at z = -10.0
  { minX: 1.4, maxX: 3.0, minZ: -10.5, maxZ: -9.5 },
];

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
  obstacle: BoundingBox,
): [number, number] {
  if (!isCollidingWithBox(x, z, radius, obstacle)) {
    return [x, z];
  }

  // Push back out along shortest penetration axis
  const overlapLeft = x + radius - obstacle.minX;
  const overlapRight = obstacle.maxX - (x - radius);
  const overlapFront = z + radius - obstacle.minZ;
  const overlapBack = obstacle.maxZ - (z - radius);

  const minOverlap = Math.min(overlapLeft, overlapRight, overlapFront, overlapBack);

  if (minOverlap === overlapLeft) return [obstacle.minX - radius, z];
  if (minOverlap === overlapRight) return [obstacle.maxX + radius, z];
  if (minOverlap === overlapFront) return [x, obstacle.minZ - radius];
  return [x, obstacle.maxZ + radius];
}
