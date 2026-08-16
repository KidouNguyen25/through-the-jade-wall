/**
 * Through the Jade Wall - Phase 7 Dealer Boss Domain Model
 * Pure deterministic domain logic for circular court topology, Wind quadrant calculation,
 * hazard area verification, and White Tile interruption climax.
 */

export type WindDirection = 'east' | 'south' | 'west' | 'north';

export type BossPhase =
  'intro' | 'wind_east' | 'wind_south' | 'forced_hand' | 'interrupted_victory';

export interface WindConfig {
  id: WindDirection;
  label: string;
  kanji: string;
  baseAngle: number; // Angle in radians on unit circle (East = +X / 0, South = +Z / π/2, etc.)
  color: string;
  hazardColor: string;
}

export const WIND_CONFIGS: Record<WindDirection, WindConfig> = {
  east: {
    id: 'east',
    label: 'East Wind (Ton)',
    kanji: '東',
    baseAngle: 0, // +X direction
    color: '#38bdf8',
    hazardColor: '#ef4444',
  },
  south: {
    id: 'south',
    label: 'South Wind (Nan)',
    kanji: '南',
    baseAngle: Math.PI / 2, // +Z direction
    color: '#f87171',
    hazardColor: '#ef4444',
  },
  west: {
    id: 'west',
    label: 'West Wind (Shaa)',
    kanji: '西',
    baseAngle: Math.PI, // -X direction
    color: '#34d399',
    hazardColor: '#ef4444',
  },
  north: {
    id: 'north',
    label: 'North Wind (Pei)',
    kanji: '北',
    baseAngle: -Math.PI / 2, // -Z direction
    color: '#a78bfa',
    hazardColor: '#ef4444',
  },
};

/**
 * Normalizes an angle in radians to [0, 2π)
 */
export function normalizeAngle(rad: number): number {
  let a = rad % (Math.PI * 2);
  if (a < 0) a += Math.PI * 2;
  return a;
}

/**
 * Calculates which quadrant/wind sector the player is standing in.
 * Center origin is [0, 0, 0].
 * Quadrants are 90-degree sectors centered around each cardinal wind:
 * - East:  [-π/4,  π/4]  (or [7π/4, 2π) and [0, π/4])
 * - South: [ π/4, 3π/4]
 * - West:  [3π/4, 5π/4]
 * - North: [5π/4, 7π/4]
 */
export function getPlayerQuadrant(
  playerPosition: [number, number, number],
  arenaRotation: number = 0,
): WindDirection {
  const [x, , z] = playerPosition;
  const dist = Math.sqrt(x * x + z * z);

  // At exact center dais (within 1.5m), consider it safe neutral
  if (dist < 1.5) {
    return 'north';
  }

  // Calculate world angle from center to player in X-Z plane
  // atan2(z, x) gives angle where +X is 0, +Z is +π/2, -X is π, -Z is -π/2
  const rawAngle = Math.atan2(z, x);
  // Subtract arena rotation to get angle in arena's local frame
  const localAngle = normalizeAngle(rawAngle - arenaRotation);

  const quarter = Math.PI / 4;

  if (localAngle >= 7 * quarter || localAngle < quarter) {
    return 'east';
  } else if (localAngle >= quarter && localAngle < 3 * quarter) {
    return 'south';
  } else if (localAngle >= 3 * quarter && localAngle < 5 * quarter) {
    return 'west';
  } else {
    return 'north';
  }
}

/**
 * Evaluates whether the player is currently in an active hazard zone.
 * In Phase East: East quadrant is radiant hazard; West quadrant is safe sanctuary.
 * In Phase South: South quadrant is radiant hazard; North quadrant is safe sanctuary.
 */
export function isPlayerInHazardZone(
  playerPosition: [number, number, number],
  activeHazardWind: WindDirection | null,
  arenaRotation: number = 0,
): boolean {
  if (!activeHazardWind) return false;

  const [x, , z] = playerPosition;
  const dist = Math.sqrt(x * x + z * z);

  // Central Tribunal Dais (dist < 1.8m) is always insulated / safe
  if (dist < 1.8) return false;

  const currentQuadrant = getPlayerQuadrant(playerPosition, arenaRotation);
  return currentQuadrant === activeHazardWind;
}

/**
 * Result of evaluating player's interaction with the Central Tribunal Anchor Dais
 */
export interface InterruptionResult {
  success: boolean;
  isVictory: boolean;
  message: string;
  dialogueTreeId?: string;
}

/**
 * Pure evaluation function for the climax White Tile Interruption
 */
export function evaluateBossInterruption(
  selectedTileId: string | null,
  bossPhase: BossPhase,
): InterruptionResult {
  if (bossPhase === 'interrupted_victory') {
    return {
      success: false,
      isVictory: true,
      message: 'The false trial is already shattered. The Jade Wall stands open.',
    };
  }

  if (bossPhase !== 'forced_hand') {
    return {
      success: false,
      isVictory: false,
      message: 'The Tribunal Anchor is inert. The Dealer has not yet declared the Final Hand.',
    };
  }

  if (!selectedTileId) {
    return {
      success: false,
      isVictory: false,
      message: 'Select a tile from your inventory to place upon the Tribunal Anchor.',
    };
  }

  // If player selects the White Dragon / Blank Tile: Refuse the premise!
  if (selectedTileId === 'tile_white_dragon') {
    return {
      success: true,
      isVictory: true,
      message:
        'A hand may be complete and still be wrong. The White Tile shatters the false trial.',
      dialogueTreeId: 'DEALER_WHITE_TILE_INTERRUPT_TREE',
    };
  }

  // If player attempts to place another tile, the Dealer rejects it as an incomplete pair
  return {
    success: false,
    isVictory: false,
    message:
      'The offered tile cannot bridge the contradiction. The Dealer demands a complete pair.',
  };
}
