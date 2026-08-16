import { TileDefinition, areTilesIdentical, Suit } from './tileTypes';

export type MeldType = 'pair' | 'triplet' | 'sequence' | 'invalid';

export interface MeldResult {
  isValid: boolean;
  type: MeldType;
  suit?: Suit;
  ranks?: number[];
  description: string;
}

export function isPair(tiles: TileDefinition[]): boolean {
  if (tiles.length !== 2) return false;
  const first = tiles[0];
  const second = tiles[1];
  if (!first || !second) return false;
  return areTilesIdentical(first, second);
}

export function isTriplet(tiles: TileDefinition[]): boolean {
  if (tiles.length !== 3) return false;
  const first = tiles[0];
  const second = tiles[1];
  const third = tiles[2];
  if (!first || !second || !third) return false;
  return areTilesIdentical(first, second) && areTilesIdentical(second, third);
}

export function isSequence(tiles: TileDefinition[]): boolean {
  if (tiles.length !== 3) return false;

  const first = tiles[0];
  const second = tiles[1];
  const third = tiles[2];
  if (!first || !second || !third) return false;

  // Sequences only exist for suited tiles (bamboo, character, circle)
  const isSuited = first.suit === 'bamboo' || first.suit === 'character' || first.suit === 'circle';

  if (!isSuited) return false;

  // All 3 tiles must share the same suit
  if (first.suit !== second.suit || second.suit !== third.suit) {
    return false;
  }

  // All 3 must have valid ranks (1..9)
  if (first.rank === undefined || second.rank === undefined || third.rank === undefined) {
    return false;
  }

  // Sort ranks in ascending order
  const sortedRanks = [first.rank, second.rank, third.rank].sort((a, b) => a - b);
  const r0 = sortedRanks[0];
  const r1 = sortedRanks[1];
  const r2 = sortedRanks[2];

  if (r0 === undefined || r1 === undefined || r2 === undefined) return false;

  return r0 + 1 === r1 && r1 + 1 === r2;
}

export function resolveMeld(tiles: TileDefinition[]): MeldResult {
  if (!tiles || tiles.length === 0) {
    return {
      isValid: false,
      type: 'invalid',
      description: 'No tiles provided to evaluate.',
    };
  }

  if (tiles.length === 2) {
    if (isPair(tiles)) {
      const tile = tiles[0];
      return {
        isValid: true,
        type: 'pair',
        suit: tile?.suit,
        ranks: tile?.rank !== undefined ? [tile.rank] : undefined,
        description: `Valid Pair (Toitsu): Two matching ${tile?.label ?? ''} tiles binding identical state.`,
      };
    }
    return {
      isValid: false,
      type: 'invalid',
      description: 'Invalid Pair: The two tiles do not match.',
    };
  }

  if (tiles.length === 3) {
    if (isTriplet(tiles)) {
      const tile = tiles[0];
      return {
        isValid: true,
        type: 'triplet',
        suit: tile?.suit,
        ranks: tile?.rank !== undefined ? [tile.rank] : undefined,
        description: `Valid Triplet (Pung): Three matching ${tile?.label ?? ''} tiles stabilizing repeated objects.`,
      };
    }

    if (isSequence(tiles)) {
      const first = tiles[0];
      const ranks = tiles
        .map((t) => t.rank)
        .filter((r): r is number => r !== undefined)
        .sort((a, b) => a - b);

      return {
        isValid: true,
        type: 'sequence',
        suit: first?.suit,
        ranks,
        description: `Valid Sequence (Chow): ${first?.suit} [${ranks.join(', ')}] aligning continuous spatial paths.`,
      };
    }

    return {
      isValid: false,
      type: 'invalid',
      description:
        'Invalid combination: The three tiles form neither a valid sequence nor a triplet.',
    };
  }

  return {
    isValid: false,
    type: 'invalid',
    description: `Invalid tile count (${tiles.length}). Early melds accept exactly 2 (Pair) or 3 (Sequence/Triplet) tiles.`,
  };
}
