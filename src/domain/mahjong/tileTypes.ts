export type Suit = 'bamboo' | 'character' | 'circle' | 'wind' | 'dragon' | 'blank';
export type Wind = 'east' | 'south' | 'west' | 'north';
export type Dragon = 'red' | 'green' | 'white';

export interface TileDefinition {
  id: string;
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
    narrativeFragment: 'Five lanterns suspended across the central courtyard.',
  },

  // Character Suit
  tile_character_1: {
    id: 'tile_character_1',
    suit: 'character',
    rank: 1,
    label: '1 Character',
    shortName: '1 WAN',
    narrativeFragment: 'A single stroke declaring the first imperial decree.',
  },
  tile_character_2: {
    id: 'tile_character_2',
    suit: 'character',
    rank: 2,
    label: '2 Character',
    shortName: '2 WAN',
    narrativeFragment: 'Two witnesses required to validate an identity.',
  },

  // Circle Suit
  tile_circle_1: {
    id: 'tile_circle_1',
    suit: 'circle',
    rank: 1,
    label: '1 Circle (Pearl)',
    shortName: '1 PIN',
    narrativeFragment: 'The full moon mirrored on the tea table.',
  },
  tile_circle_2: {
    id: 'tile_circle_2',
    suit: 'circle',
    rank: 2,
    label: '2 Circle',
    shortName: '2 PIN',
    narrativeFragment: 'Two bronze coins paid at the gates of Jade Court.',
  },

  // Winds
  tile_wind_east: {
    id: 'tile_wind_east',
    suit: 'wind',
    wind: 'east',
    label: 'East Wind',
    shortName: 'EAST',
    narrativeFragment: 'The prevailing direction of authority. Governed by the Magistrate.',
  },
  tile_wind_south: {
    id: 'tile_wind_south',
    suit: 'wind',
    wind: 'south',
    label: 'South Wind',
    shortName: 'SOUTH',
    narrativeFragment: 'The wind of preservation and healing.',
  },
};

export function getTileById(id: string): TileDefinition | null {
  return TILE_CATALOG[id] ?? null;
}

export function areTilesIdentical(tileA: TileDefinition, tileB: TileDefinition): boolean {
  if (tileA.suit !== tileB.suit) return false;
  if (tileA.rank !== tileB.rank) return false;
  if (tileA.wind !== tileB.wind) return false;
  if (tileA.dragon !== tileB.dragon) return false;
  return true;
}
