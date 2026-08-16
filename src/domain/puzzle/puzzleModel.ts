import { TileDefinition, Suit } from '../mahjong/tileTypes';
import { resolveMeld, MeldType } from '../mahjong/meldResolver';

export interface SocketDefinition {
  id: string;
  name: string;
  position: [number, number, number];
  defaultTileId?: string;
  isLocked?: boolean;
}

export interface PuzzleDefinition {
  id: string;
  name: string;
  requiredMeldType: MeldType;
  requiredSuit?: Suit;
  requiredRanks?: number[];
  sockets: SocketDefinition[];
}

export interface PuzzleEvaluationResult {
  isComplete: boolean;
  isSolved: boolean;
  message: string;
  placedTiles: TileDefinition[];
}

export function evaluatePuzzle(
  puzzle: PuzzleDefinition,
  placedTilesMap: Record<string, TileDefinition | null>,
): PuzzleEvaluationResult {
  const currentTiles: TileDefinition[] = [];

  for (const socket of puzzle.sockets) {
    const tile = placedTilesMap[socket.id];
    if (tile) {
      currentTiles.push(tile);
    }
  }

  // Check if all sockets have a tile placed
  if (currentTiles.length < puzzle.sockets.length) {
    return {
      isComplete: false,
      isSolved: false,
      message: `Incomplete: ${currentTiles.length}/${puzzle.sockets.length} sockets filled.`,
      placedTiles: currentTiles,
    };
  }

  // Resolve the meld using the deterministic domain resolver
  const meldResult = resolveMeld(currentTiles);

  if (!meldResult.isValid) {
    return {
      isComplete: true,
      isSolved: false,
      message: `Invalid Meld: ${meldResult.description}`,
      placedTiles: currentTiles,
    };
  }

  if (meldResult.type !== puzzle.requiredMeldType) {
    return {
      isComplete: true,
      isSolved: false,
      message: `Mismatched Meld: Expected ${puzzle.requiredMeldType}, got ${meldResult.type}.`,
      placedTiles: currentTiles,
    };
  }

  if (puzzle.requiredSuit && meldResult.suit !== puzzle.requiredSuit) {
    return {
      isComplete: true,
      isSolved: false,
      message: `Mismatched Suit: Expected ${puzzle.requiredSuit}, got ${meldResult.suit}.`,
      placedTiles: currentTiles,
    };
  }

  if (puzzle.requiredRanks && meldResult.ranks) {
    const sortedRequired = [...puzzle.requiredRanks].sort((a, b) => a - b);
    const sortedCurrent = [...meldResult.ranks].sort((a, b) => a - b);
    const ranksMatch =
      sortedRequired.length === sortedCurrent.length &&
      sortedRequired.every((r, idx) => r === sortedCurrent[idx]);

    if (!ranksMatch) {
      return {
        isComplete: true,
        isSolved: false,
        message: `Mismatched Sequence Ranks: Expected [${sortedRequired.join(', ')}], got [${sortedCurrent.join(', ')}].`,
        placedTiles: currentTiles,
      };
    }
  }

  return {
    isComplete: true,
    isSolved: true,
    message: `Puzzle Solved: ${meldResult.description}`,
    placedTiles: currentTiles,
  };
}

// East Arcade Sequence Gate Specification (Phase 2)
export const EAST_ARCADE_SEQUENCE_PUZZLE: PuzzleDefinition = {
  id: 'puzzle_east_arcade_sequence',
  name: 'Three Balcony Sequence Gate',
  requiredMeldType: 'sequence',
  requiredSuit: 'bamboo',
  requiredRanks: [2, 3, 4],
  sockets: [
    {
      id: 'socket_balcony_1',
      name: 'Balcony 1 Socket',
      position: [-2.0, 1.0, 0],
      defaultTileId: 'tile_bamboo_2',
      isLocked: true,
    },
    {
      id: 'socket_balcony_2',
      name: 'Balcony 2 Socket',
      position: [0.0, 1.0, 0],
      defaultTileId: 'tile_bamboo_3',
      isLocked: true,
    },
    {
      id: 'socket_balcony_3',
      name: 'Balcony 3 Socket (Missing)',
      position: [2.0, 1.0, 0],
      isLocked: false,
    },
  ],
};

// East Arcade "Same Door" Pair Puzzle Specification (Phase 3)
export const EAST_ARCADE_SAME_DOOR_PUZZLE: PuzzleDefinition = {
  id: 'puzzle_east_arcade_same_door',
  name: 'Twin Doorway Pair Gate (Same Door Puzzle)',
  requiredMeldType: 'pair',
  requiredSuit: 'dragon',
  sockets: [
    {
      id: 'socket_door_alpha',
      name: 'Door Alpha Plaque Socket',
      position: [3.5, 1.2, -10.0],
      defaultTileId: 'tile_dragon_red',
      isLocked: true,
    },
    {
      id: 'socket_door_beta',
      name: 'Door Beta Plaque Socket (Missing)',
      position: [-3.5, 3.2, -14.0],
      isLocked: false,
    },
  ],
};
