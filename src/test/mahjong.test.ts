import { describe, it, expect } from 'vitest';
import { isPair, isTriplet, isSequence, resolveMeld } from '../domain/mahjong/meldResolver';
import {
  TILE_CATALOG,
  getTileById,
  areTilesIdentical,
  TileDefinition,
} from '../domain/mahjong/tileTypes';

describe('Mahjong Tile Catalog & Identity', () => {
  it('retrieves valid tiles by id', () => {
    const tile = getTileById('tile_bamboo_4');
    expect(tile).toBeDefined();
    expect(tile?.suit).toBe('bamboo');
    expect(tile?.rank).toBe(4);
  });

  it('correctly compares tile identity', () => {
    const tileA = TILE_CATALOG['tile_bamboo_2'];
    const tileC = TILE_CATALOG['tile_bamboo_3'];

    if (!tileA || !tileC) throw new Error('Tiles missing from catalog');

    const tileB: TileDefinition = {
      id: tileA.id,
      suit: tileA.suit,
      rank: tileA.rank,
      label: tileA.label,
      shortName: tileA.shortName,
    };

    expect(areTilesIdentical(tileA, tileB)).toBe(true);
    expect(areTilesIdentical(tileA, tileC)).toBe(false);
  });
});

describe('Meld Resolver — Pairs (Toitsu)', () => {
  it('validates matching pairs', () => {
    const tileA = TILE_CATALOG['tile_character_1'];
    if (!tileA) throw new Error('Missing tile');

    const tileB: TileDefinition = {
      id: tileA.id,
      suit: tileA.suit,
      rank: tileA.rank,
      label: tileA.label,
      shortName: tileA.shortName,
    };

    expect(isPair([tileA, tileB])).toBe(true);
    const result = resolveMeld([tileA, tileB]);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('pair');
  });

  it('rejects pairs with mismatched tiles or incorrect length', () => {
    const tileA = TILE_CATALOG['tile_bamboo_1'];
    const tileB = TILE_CATALOG['tile_bamboo_2'];
    if (!tileA || !tileB) throw new Error('Missing tile');

    expect(isPair([tileA, tileB])).toBe(false);
    expect(isPair([tileA])).toBe(false);
    expect(isPair([tileA, tileA, tileA])).toBe(false);
  });
});

describe('Meld Resolver — Triplets (Pung)', () => {
  it('validates matching triplets', () => {
    const tileA = TILE_CATALOG['tile_circle_1'];
    if (!tileA) throw new Error('Missing tile');

    const tileB: TileDefinition = {
      id: tileA.id,
      suit: tileA.suit,
      rank: tileA.rank,
      label: tileA.label,
      shortName: tileA.shortName,
    };

    expect(isTriplet([tileA, tileB, { ...tileB }])).toBe(true);
    const result = resolveMeld([tileA, tileB, { ...tileB }]);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('triplet');
  });

  it('rejects non-identical triplets', () => {
    const tileA = TILE_CATALOG['tile_circle_1'];
    const tileB = TILE_CATALOG['tile_circle_2'];
    if (!tileA || !tileB) throw new Error('Missing tile');

    expect(isTriplet([tileA, tileA, tileB])).toBe(false);
  });
});

describe('Meld Resolver — Sequences (Chow)', () => {
  it('validates 3 consecutive suited tiles in ascending order', () => {
    const b2 = TILE_CATALOG['tile_bamboo_2'];
    const b3 = TILE_CATALOG['tile_bamboo_3'];
    const b4 = TILE_CATALOG['tile_bamboo_4'];
    if (!b2 || !b3 || !b4) throw new Error('Missing tile');

    expect(isSequence([b2, b3, b4])).toBe(true);
    const result = resolveMeld([b2, b3, b4]);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('sequence');
    expect(result.ranks).toEqual([2, 3, 4]);
  });

  it('validates sequences provided out-of-order', () => {
    const b2 = TILE_CATALOG['tile_bamboo_2'];
    const b3 = TILE_CATALOG['tile_bamboo_3'];
    const b4 = TILE_CATALOG['tile_bamboo_4'];
    if (!b2 || !b3 || !b4) throw new Error('Missing tile');

    expect(isSequence([b4, b2, b3])).toBe(true);
    const result = resolveMeld([b4, b2, b3]);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('sequence');
    expect(result.ranks).toEqual([2, 3, 4]);
  });

  it('rejects sequences with gaps (e.g. 2-3-5)', () => {
    const b2 = TILE_CATALOG['tile_bamboo_2'];
    const b3 = TILE_CATALOG['tile_bamboo_3'];
    const b5 = TILE_CATALOG['tile_bamboo_5'];
    if (!b2 || !b3 || !b5) throw new Error('Missing tile');

    expect(isSequence([b2, b3, b5])).toBe(false);
  });

  it('rejects sequences across mixed suits', () => {
    const b2 = TILE_CATALOG['tile_bamboo_2'];
    const b3 = TILE_CATALOG['tile_bamboo_3'];
    if (!b2 || !b3) throw new Error('Missing tile');

    const c4: TileDefinition = {
      id: 'char_4',
      suit: 'character',
      rank: 4,
      label: '4 Character',
      shortName: '4 WAN',
    };

    expect(isSequence([b2, b3, c4])).toBe(false);
  });

  it('rejects sequences with honors / dragons / blanks', () => {
    const white = TILE_CATALOG['tile_white_dragon'];
    const b2 = TILE_CATALOG['tile_bamboo_2'];
    const b3 = TILE_CATALOG['tile_bamboo_3'];
    if (!white || !b2 || !b3) throw new Error('Missing tile');

    expect(isSequence([b2, b3, white])).toBe(false);
  });
});
