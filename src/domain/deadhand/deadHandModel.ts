/**
 * Through the Jade Wall - Phase 6 Dead Hand Domain Model
 * Pure deterministic domain logic for Watcher stealth detection, safe discard zones, and Invalidation.
 */

export interface SafeZone {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  tileId: string;
}

export const COURTYARD_SAFE_ZONES: SafeZone[] = [
  // West Discard Sanctuary & Colonnade (Marked with Bamboo 4)
  {
    id: 'safe_west_bamboo',
    minX: -6.5,
    maxX: -2.0,
    minZ: -9.5,
    maxZ: 5.0,
    tileId: 'tile_bamboo_4',
  },
  // East Discard Sanctuary & Colonnade (Marked with Red Dragon)
  {
    id: 'safe_east_dragon',
    minX: 2.0,
    maxX: 6.5,
    minZ: -9.5,
    maxZ: 5.0,
    tileId: 'tile_dragon_red',
  },
  // Central Gong Invalidation Dais Sanctuary
  {
    id: 'safe_central_gong',
    minX: -3.0,
    maxX: 3.0,
    minZ: -10.0,
    maxZ: -6.0,
    tileId: 'tile_white_dragon',
  },
];

/**
 * Pure evaluation of whether a player coordinate lies within any safe discard zone.
 */
export function isPlayerInSafeZone(
  playerPos: [number, number, number],
  safeZones: SafeZone[] = COURTYARD_SAFE_ZONES,
): boolean {
  const [px, , pz] = playerPos;
  return safeZones.some(
    (zone) => px >= zone.minX && px <= zone.maxX && pz >= zone.minZ && pz <= zone.maxZ,
  );
}

/**
 * Pure evaluation of whether a Watcher sentinel detects the player.
 * A Watcher detects if:
 * 1. Watchers are not frozen.
 * 2. Player is not in a safe discard zone.
 * 3. Distance is within detectionRadius.
 * 4. Angle between Watcher facing vector and player is within coneAngleRad.
 */
export function isPlayerDetectedByWatcher(
  playerPos: [number, number, number],
  watcherPos: [number, number, number],
  watcherFacingAngle: number,
  detectionRadius: number = 6.5,
  coneAngleRad: number = Math.PI / 3, // 60 degrees cone
  isInSafeZone: boolean = false,
  isFrozen: boolean = false,
): boolean {
  if (isFrozen || isInSafeZone) {
    return false;
  }

  const dx = playerPos[0] - watcherPos[0];
  const dz = playerPos[2] - watcherPos[2];
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist > detectionRadius || dist < 0.01) {
    return false;
  }

  // Calculate angle to player relative to Watcher's facing angle
  const angleToPlayer = Math.atan2(dx, dz);
  let angleDiff = Math.abs(angleToPlayer - watcherFacingAngle);
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  angleDiff = Math.abs(angleDiff);

  return angleDiff <= coneAngleRad / 2;
}

/**
 * Pure evaluation of striking the Invalidation Gong to declare Dead Hand (Chombo).
 */
export function evaluateInvalidation(
  hasWhiteTile: boolean,
  alreadyInvalidated: boolean,
): { success: boolean; narrativeKey: string; message: string } {
  if (alreadyInvalidated) {
    return {
      success: false,
      narrativeKey: 'ALREADY_INVALIDATED',
      message: 'The Watchers are already frozen in Dead Hand stasis.',
    };
  }

  if (!hasWhiteTile) {
    return {
      success: false,
      narrativeKey: 'MISSING_WHITE_TILE',
      message:
        'The Gong requires an uncarved tile to declare the state unclassifiable and force a Dead Hand.',
    };
  }

  return {
    success: true,
    narrativeKey: 'DEAD_HAND_SUCCESS',
    message:
      'Chombo declared! The Watchers’ illegal wait renders their hands invalid. Stasis engaged!',
  };
}
