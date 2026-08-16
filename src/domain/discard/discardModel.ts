/**
 * Through the Jade Wall - Phase 5 Discard Consequence Domain Model
 * Pure deterministic domain logic for tile sacrifice and irreversible spatial branching.
 */

export type DiscardAltarType = 'archivist_furnace' | 'regent_brazier';

export interface SacrificeResult {
  success: boolean;
  openedPath: 'west' | 'east' | null;
  collapsedPath: 'west' | 'east' | null;
  sacrificedTileId: string | null;
  narrativeKey: string;
  rejectionReason?: string;
}

/**
 * Pure deterministic evaluation of a tile sacrifice at a designated altar.
 *
 * Rules:
 * 1. White Dragon ('tile_white_dragon') is permanently protected and refuses to burn.
 * 2. Archivist Furnace ([ -3.0, 0, -5.0 ]) accepts bamboo/suited tiles to open the West Scholar's Path.
 * 3. Regent Brazier ([ 3.0, 0, -5.0 ]) accepts dragon/honor tiles to open the East Regent's Path.
 */
export function evaluateSacrifice(
  altar: DiscardAltarType,
  selectedTileId: string | null,
): SacrificeResult {
  if (!selectedTileId) {
    return {
      success: false,
      openedPath: null,
      collapsedPath: null,
      sacrificedTileId: null,
      narrativeKey: 'NO_TILE_SELECTED',
      rejectionReason: 'No tile selected from inventory to place onto the sacrificial altar.',
    };
  }

  // The White Dragon represents that which is uncarved and cannot be categorized or burned
  if (selectedTileId === 'tile_white_dragon') {
    return {
      success: false,
      openedPath: null,
      collapsedPath: null,
      sacrificedTileId: null,
      narrativeKey: 'WHITE_TILE_PROTECTED',
      rejectionReason:
        'The White Tile remains cold and unresponsive to the altar. An uncarved tile cannot be discarded.',
    };
  }

  if (altar === 'archivist_furnace') {
    // Accepts Bamboo 4 or any suited tile for scholarly sacrifice
    return {
      success: true,
      openedPath: 'west',
      collapsedPath: 'east',
      sacrificedTileId: selectedTileId,
      narrativeKey: 'DISCARD_ARCHIVIST_SUCCESS',
    };
  }

  if (altar === 'regent_brazier') {
    // Accepts Red Dragon or honor tiles for martial/regal sacrifice
    return {
      success: true,
      openedPath: 'east',
      collapsedPath: 'west',
      sacrificedTileId: selectedTileId,
      narrativeKey: 'DISCARD_REGENT_SUCCESS',
    };
  }

  return {
    success: false,
    openedPath: null,
    collapsedPath: null,
    sacrificedTileId: null,
    narrativeKey: 'INVALID_SACRIFICE',
    rejectionReason: 'The altar rejects this offering.',
  };
}
