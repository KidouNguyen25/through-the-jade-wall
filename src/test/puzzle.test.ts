import { describe, it, expect } from 'vitest';
import { evaluatePuzzle, EAST_ARCADE_SEQUENCE_PUZZLE } from '../domain/puzzle/puzzleModel';
import { TILE_CATALOG } from '../domain/mahjong/tileTypes';

describe('Puzzle Socket Evaluation', () => {
  const b2 = TILE_CATALOG['tile_bamboo_2']!;
  const b3 = TILE_CATALOG['tile_bamboo_3']!;
  const b4 = TILE_CATALOG['tile_bamboo_4']!;
  const b5 = TILE_CATALOG['tile_bamboo_5']!;

  it('evaluates incomplete state when a socket is empty', () => {
    const placedTiles = {
      socket_balcony_1: b2,
      socket_balcony_2: b3,
      socket_balcony_3: null,
    };

    const result = evaluatePuzzle(EAST_ARCADE_SEQUENCE_PUZZLE, placedTiles);
    expect(result.isComplete).toBe(false);
    expect(result.isSolved).toBe(false);
  });

  it('evaluates successful resolution when 2-3-4 sequence is placed', () => {
    const placedTiles = {
      socket_balcony_1: b2,
      socket_balcony_2: b3,
      socket_balcony_3: b4,
    };

    const result = evaluatePuzzle(EAST_ARCADE_SEQUENCE_PUZZLE, placedTiles);
    expect(result.isComplete).toBe(true);
    expect(result.isSolved).toBe(true);
    expect(result.message).toContain('Puzzle Solved');
  });

  it('rejects invalid sequence when incorrect tile (e.g. Bamboo 5) is placed', () => {
    const placedTiles = {
      socket_balcony_1: b2,
      socket_balcony_2: b3,
      socket_balcony_3: b5,
    };

    const result = evaluatePuzzle(EAST_ARCADE_SEQUENCE_PUZZLE, placedTiles);
    expect(result.isComplete).toBe(true);
    expect(result.isSolved).toBe(false);
  });
});
