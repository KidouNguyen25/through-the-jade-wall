import { describe, it, expect, beforeEach } from 'vitest';
import { evaluateSacrifice } from '../domain/discard/discardModel';
import { useGameStore } from '../state/gameStore';

describe('Phase 5 Discard Consequence Domain Model', () => {
  it('returns failure when attempting sacrifice with no tile selected', () => {
    const result = evaluateSacrifice('archivist_furnace', null);
    expect(result.success).toBe(false);
    expect(result.narrativeKey).toBe('NO_TILE_SELECTED');
    expect(result.openedPath).toBeNull();
  });

  it('permanently protects White Tile from sacrificial discard', () => {
    const westResult = evaluateSacrifice('archivist_furnace', 'tile_white_dragon');
    expect(westResult.success).toBe(false);
    expect(westResult.narrativeKey).toBe('WHITE_TILE_PROTECTED');

    const eastResult = evaluateSacrifice('regent_brazier', 'tile_white_dragon');
    expect(eastResult.success).toBe(false);
    expect(eastResult.narrativeKey).toBe('WHITE_TILE_PROTECTED');
  });

  it('accepts tile at Archivist Stone Furnace and opens West path while collapsing East', () => {
    const result = evaluateSacrifice('archivist_furnace', 'tile_bamboo_4');
    expect(result.success).toBe(true);
    expect(result.openedPath).toBe('west');
    expect(result.collapsedPath).toBe('east');
    expect(result.sacrificedTileId).toBe('tile_bamboo_4');
    expect(result.narrativeKey).toBe('DISCARD_ARCHIVIST_SUCCESS');
  });

  it('accepts tile at Regent Brazen Brazier and opens East path while collapsing West', () => {
    const result = evaluateSacrifice('regent_brazier', 'tile_dragon_red');
    expect(result.success).toBe(true);
    expect(result.openedPath).toBe('east');
    expect(result.collapsedPath).toBe('west');
    expect(result.sacrificedTileId).toBe('tile_dragon_red');
    expect(result.narrativeKey).toBe('DISCARD_REGENT_SUCCESS');
  });
});

describe('Phase 5 Game Store State & Consequence Progression', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('enters Discard Passage and starts entry dialogue monologue', () => {
    const store = useGameStore.getState();
    store.enterDiscardPassage();

    const state = useGameStore.getState();
    expect(state.currentScene).toBe('discard_passage');
    expect(state.playerPosition).toEqual([0, 0, 6.0]);
    expect(state.checkpoint).toBe('cp_discard_passage_entered');
    expect(state.activeDialogueNode?.id).toBe('node_dp_1');
  });

  it('rejects White Tile sacrifice in game store without removing tile or opening paths', () => {
    const store = useGameStore.getState();
    store.collectWhiteTile();
    store.enterDiscardPassage();
    store.closeDialogue();

    expect(useGameStore.getState().inventoryTiles).toContain('tile_white_dragon');

    // Attempt sacrifice
    const success = store.performSacrifice('archivist_furnace');
    expect(success).toBe(false);

    const state = useGameStore.getState();
    expect(state.inventoryTiles).toContain('tile_white_dragon');
    expect(state.discardPassageResolved).toBe(false);
    expect(state.westPathOpen).toBe(false);
    expect(state.eastPathOpen).toBe(false);
    expect(state.activeDialogueNode?.id).toBe('node_wtr_1');
  });

  it('performs Scholar sacrifice at Archivist Furnace, opening West path and removing tile', () => {
    const store = useGameStore.getState();
    store.collectWhiteTile();
    store.collectBamboo4();
    store.setSelectedSlot(1); // Select Bamboo 4
    store.enterDiscardPassage();
    store.closeDialogue();

    const success = store.performSacrifice('archivist_furnace');
    expect(success).toBe(true);

    const state = useGameStore.getState();
    expect(state.inventoryTiles).not.toContain('tile_bamboo_4');
    expect(state.inventoryTiles).toContain('tile_white_dragon');
    expect(state.sacrificedTile).toBe('tile_bamboo_4');
    expect(state.discardPassageChoice).toBe('archivist');
    expect(state.discardPassageResolved).toBe(true);
    expect(state.westPathOpen).toBe(true);
    expect(state.eastPathOpen).toBe(false);
    expect(state.checkpoint).toBe('cp_discard_archivist_chosen');
    expect(state.activeDialogueNode?.id).toBe('node_arc_1');
  });

  it('performs Martial sacrifice at Regent Brazier, opening East path and removing tile', () => {
    const store = useGameStore.getState();
    store.collectWhiteTile();
    store.collectRedDragon();
    store.setSelectedSlot(1); // Select Red Dragon
    store.enterDiscardPassage();
    store.closeDialogue();

    const success = store.performSacrifice('regent_brazier');
    expect(success).toBe(true);

    const state = useGameStore.getState();
    expect(state.inventoryTiles).not.toContain('tile_dragon_red');
    expect(state.inventoryTiles).toContain('tile_white_dragon');
    expect(state.sacrificedTile).toBe('tile_dragon_red');
    expect(state.discardPassageChoice).toBe('regent');
    expect(state.discardPassageResolved).toBe(true);
    expect(state.eastPathOpen).toBe(true);
    expect(state.westPathOpen).toBe(false);
    expect(state.checkpoint).toBe('cp_discard_regent_chosen');
    expect(state.activeDialogueNode?.id).toBe('node_reg_1');
  });

  it('persists and restores discard consequence state via save / load', () => {
    const store = useGameStore.getState();
    store.collectWhiteTile();
    store.collectBamboo4();
    store.setSelectedSlot(1);
    store.enterDiscardPassage();
    store.performSacrifice('archivist_furnace');
    store.saveGame();

    // Reset game state
    store.resetGame();
    expect(useGameStore.getState().discardPassageResolved).toBe(false);

    // Load game state
    const loaded = store.loadGame();
    expect(loaded).toBe(true);

    const restored = useGameStore.getState();
    expect(restored.currentScene).toBe('discard_passage');
    expect(restored.sacrificedTile).toBe('tile_bamboo_4');
    expect(restored.discardPassageChoice).toBe('archivist');
    expect(restored.discardPassageResolved).toBe(true);
    expect(restored.westPathOpen).toBe(true);
    expect(restored.eastPathOpen).toBe(false);
  });
});
