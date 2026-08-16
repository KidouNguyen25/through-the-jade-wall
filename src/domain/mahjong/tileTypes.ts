export type Suit = 'bamboo' | 'character' | 'circle' | 'wind' | 'dragon' | 'blank';
export type Wind = 'east' | 'south' | 'west' | 'north';
export type Dragon = 'red' | 'green' | 'white';

export type TileId = string;

export interface TileDefinition {
  id: TileId;
  suit: Suit;
  rank?: number; // 1..9 for suited tiles
  wind?: Wind;
  dragon?: Dragon;
  label: string;
  shortName: string;
  narrativeFragment?: string;
}

export const TILE_CATALOG: Record<string, TileDefinition> = {
  // White / Blank Tile (The Contradiction / Guide)
  tile_white_dragon: {
    id: 'tile_white_dragon',
    suit: 'blank',
    dragon: 'white',
    label: 'White Tile (Blank)',
    shortName: 'WHITE',
    narrativeFragment: 'A completely uncarved tile. It holds the right to remain unclassified.',
  },

  // Bamboo Suit
  tile_bamboo_1: {
    id: 'tile_bamboo_1',
    suit: 'bamboo',
    rank: 1,
    label: '1 Bamboo (Sparrow)',
    shortName: '1 BAM',
    narrativeFragment: 'A sparrow perched on a single green stalk.',
  },
  tile_bamboo_2: {
    id: 'tile_bamboo_2',
    suit: 'bamboo',
    rank: 2,
    label: '2 Bamboo',
    shortName: '2 BAM',
    narrativeFragment: 'Two parallel pillars establishing the first foundation of the arcade.',
  },
  tile_bamboo_3: {
    id: 'tile_bamboo_3',
    suit: 'bamboo',
    rank: 3,
    label: '3 Bamboo',
    shortName: '3 BAM',
    narrativeFragment: 'Three steps rising above the water line.',
  },
  tile_bamboo_4: {
    id: 'tile_bamboo_4',
    suit: 'bamboo',
    rank: 4,
    label: '4 Bamboo',
    shortName: '4 BAM',
    narrativeFragment: 'Four bridge supports connecting the northern and southern arcades.',
  },
  tile_bamboo_5: {
    id: 'tile_bamboo_5',
    suit: 'bamboo',
    rank: 5,
    label: '5 Bamboo',
    shortName: '5 BAM',
    narrativeFragment: 'Five bamboo struts framing the high upper archways.',
  },

  // Circle (Pin / Dot) Suit
  tile_circle_1: {
    id: 'tile_circle_1',
    suit: 'circle',
    rank: 1,
    label: '1 Circle (Giant Pearl)',
    shortName: '1 PIN',
    narrativeFragment: 'A single celestial pearl floating in equilibrium.',
  },
  tile_circle_2: {
    id: 'tile_circle_2',
    suit: 'circle',
    rank: 2,
    label: '2 Circle',
    shortName: '2 PIN',
    narrativeFragment: 'Two balancing spheres reflecting water reflections.',
  },
  tile_circle_3: {
    id: 'tile_circle_3',
    suit: 'circle',
    rank: 3,
    label: '3 Circle',
    shortName: '3 PIN',
    narrativeFragment: 'Three diagonal stars marking the constellation path.',
  },
  tile_circle_4: {
    id: 'tile_circle_4',
    suit: 'circle',
    rank: 4,
    label: '4 Circle',
    shortName: '4 PIN',
    narrativeFragment: 'Four corner boundary posts of the courtyard.',
  },
  tile_circle_5: {
    id: 'tile_circle_5',
    suit: 'circle',
    rank: 5,
    label: '5 Circle',
    shortName: '5 PIN',
    narrativeFragment: 'Five points surrounding the central sanctuary dais.',
  },

  // Character (Wan) Suit
  tile_character_1: {
    id: 'tile_character_1',
    suit: 'character',
    rank: 1,
    label: '1 Character',
    shortName: '1 WAN',
    narrativeFragment: 'The first numeric character of the imperial ledger.',
  },
  tile_character_2: {
    id: 'tile_character_2',
    suit: 'character',
    rank: 2,
    label: '2 Character',
    shortName: '2 WAN',
    narrativeFragment: 'Two horizontal balance bars inscribed in vermilion.',
  },
  tile_character_3: {
    id: 'tile_character_3',
    suit: 'character',
    rank: 3,
    label: '3 Character',
    shortName: '3 WAN',
    narrativeFragment: 'Three tiers of ancient court bureaucracy.',
  },
  tile_character_4: {
    id: 'tile_character_4',
    suit: 'character',
    rank: 4,
    label: '4 Character',
    shortName: '4 WAN',
    narrativeFragment: 'Four square walls containing the outer settlement.',
  },
  tile_character_5: {
    id: 'tile_character_5',
    suit: 'character',
    rank: 5,
    label: '5 Character',
    shortName: '5 WAN',
    narrativeFragment: 'The crossroads where the five outer roads converge.',
  },

  // Dragons
  tile_dragon_red: {
    id: 'tile_dragon_red',
    suit: 'dragon',
    dragon: 'red',
    label: 'Red Dragon (Chun)',
    shortName: 'RED DRG',
    narrativeFragment:
      'A vermilion seal establishing identity. When two doors share this mark, they become the same passage in space.',
  },
  tile_dragon_green: {
    id: 'tile_dragon_green',
    suit: 'dragon',
    dragon: 'green',
    label: 'Green Dragon (Hatsu)',
    shortName: 'GRN DRG',
    narrativeFragment: 'The blooming jade spring that stabilizes spatial curvature.',
  },

  // Winds
  tile_wind_east: {
    id: 'tile_wind_east',
    suit: 'wind',
    wind: 'east',
    label: 'East Wind (Ton)',
    shortName: 'EAST',
    narrativeFragment: 'The seat of the reigning Dealer. Controls the rotation of outer hallways.',
  },
  tile_wind_south: {
    id: 'tile_wind_south',
    suit: 'wind',
    wind: 'south',
    label: 'South Wind (Nan)',
    shortName: 'SOUTH',
    narrativeFragment: 'The warm current opening the southern water gates.',
  },
  tile_wind_west: {
    id: 'tile_wind_west',
    suit: 'wind',
    wind: 'west',
    label: 'West Wind (Shaa)',
    shortName: 'WEST',
    narrativeFragment: 'The setting wind sealing the twilight archives.',
  },
  tile_wind_north: {
    id: 'tile_wind_north',
    suit: 'wind',
    wind: 'north',
    label: 'North Wind (Pei)',
    shortName: 'NORTH',
    narrativeFragment: 'The cold stillness locking immutable memories in ice.',
  },
};

export function areTilesEqual(a: TileDefinition | null, b: TileDefinition | null): boolean {
  if (!a || !b) return false;
  return a.id === b.id;
}

export function areTilesIdentical(a: TileDefinition | null, b: TileDefinition | null): boolean {
  return areTilesEqual(a, b);
}

export function getTileById(id: string): TileDefinition | undefined {
  return TILE_CATALOG[id];
}

export function isSuitedTile(tile: TileDefinition): boolean {
  return tile.suit === 'bamboo' || tile.suit === 'character' || tile.suit === 'circle';
}

export function isHonorTile(tile: TileDefinition): boolean {
  return tile.suit === 'wind' || tile.suit === 'dragon';
}
