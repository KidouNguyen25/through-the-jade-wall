import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPlayerQuadrant,
  isPlayerInHazardZone,
  normalizeAngle,
  evaluateBossInterruption,
} from '../domain/boss/dealerBossModel';
import { useGameStore } from '../state/gameStore';

describe('Phase 7: Dealer Boss Domain & Wind Topology Model', () => {
  describe('normalizeAngle', () => {
    it('normalizes negative angles and multiple revolutions to [0, 2π)', () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI);
      expect(normalizeAngle(Math.PI * 2)).toBeCloseTo(0);
      expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2);
      expect(normalizeAngle(Math.PI * 5)).toBeCloseTo(Math.PI);
    });
  });

  describe('getPlayerQuadrant', () => {
    it('accurately identifies player quadrant in unrotated arena', () => {
      // East: +X
      expect(getPlayerQuadrant([5.0, 0, 0], 0)).toBe('east');
      // South: +Z
      expect(getPlayerQuadrant([0, 0, 5.0], 0)).toBe('south');
      // West: -X
      expect(getPlayerQuadrant([-5.0, 0, 0], 0)).toBe('west');
      // North: -Z
      expect(getPlayerQuadrant([0, 0, -5.0], 0)).toBe('north');
    });

    it('accurately calculates local quadrant when arena is rotated by 90 degrees (π/2)', () => {
      // With arena rotated by +90 deg (+π/2 radians):
      // A player standing at world South (+Z) is in the arena's local East quadrant
      expect(getPlayerQuadrant([0, 0, 5.0], Math.PI / 2)).toBe('east');
      // A player standing at world West (-X) is in the arena's local South quadrant
      expect(getPlayerQuadrant([-5.0, 0, 0], Math.PI / 2)).toBe('south');
      // A player standing at world North (-Z) is in the arena's local West quadrant
      expect(getPlayerQuadrant([0, 0, -5.0], Math.PI / 2)).toBe('west');
      // A player standing at world East (+X) is in the arena's local North quadrant
      expect(getPlayerQuadrant([5.0, 0, 0], Math.PI / 2)).toBe('north');
    });
  });

  describe('isPlayerInHazardZone', () => {
    it('returns false if no hazard wind is active', () => {
      expect(isPlayerInHazardZone([5.0, 0, 0], null, 0)).toBe(false);
    });

    it('returns true when player is in the active hazard quadrant', () => {
      // East quadrant is hazard
      expect(isPlayerInHazardZone([5.0, 0, 0], 'east', 0)).toBe(true);
      // West quadrant is safe
      expect(isPlayerInHazardZone([-5.0, 0, 0], 'east', 0)).toBe(false);
    });

    it('considers the central tribunal dais safe from hazard radiation', () => {
      // Standing on central dais (dist < 1.8m)
      expect(isPlayerInHazardZone([0.5, 0, 0.5], 'east', 0)).toBe(false);
    });
  });

  describe('evaluateBossInterruption', () => {
    it('rejects interruption if not in forced_hand phase', () => {
      const result = evaluateBossInterruption('tile_white_dragon', 'wind_east');
      expect(result.success).toBe(false);
      expect(result.isVictory).toBe(false);
      expect(result.message).toContain('Tribunal Anchor is inert');
    });

    it('rejects when no tile is selected', () => {
      const result = evaluateBossInterruption(null, 'forced_hand');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Select a tile');
    });

    it('rejects non-white tiles as incomplete pairs', () => {
      const result = evaluateBossInterruption('tile_bamboo_4', 'forced_hand');
      expect(result.success).toBe(false);
      expect(result.isVictory).toBe(false);
      expect(result.message).toContain('cannot bridge the contradiction');
    });

    it('accepts White Dragon (Blank Tile) to refuse premise and trigger vertical slice victory', () => {
      const result = evaluateBossInterruption('tile_white_dragon', 'forced_hand');
      expect(result.success).toBe(true);
      expect(result.isVictory).toBe(true);
      expect(result.dialogueTreeId).toBe('DEALER_WHITE_TILE_INTERRUPT_TREE');
      expect(result.message).toContain('A hand may be complete and still be wrong');
    });
  });
});

describe('Phase 7: Store Integration & Save Persistence', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('initializes boss court with intro phase and dialogue', () => {
    const store = useGameStore.getState();
    store.enterBossCourt();

    const state = useGameStore.getState();
    expect(state.currentScene).toBe('boss_court');
    expect(state.dealerPhase).toBe('intro');
    expect(state.activeDialogueTree?.id).toBe('dealer_intro');
  });

  it('progresses through Wind phases correctly', () => {
    const store = useGameStore.getState();
    store.enterBossCourt();

    store.advanceBossWind('wind_east');
    expect(useGameStore.getState().dealerPhase).toBe('wind_east');
    expect(useGameStore.getState().activeHazardWind).toBe('east');

    store.advanceBossWind('wind_south');
    expect(useGameStore.getState().dealerPhase).toBe('wind_south');
    expect(useGameStore.getState().activeHazardWind).toBe('south');
    expect(useGameStore.getState().arenaRotation).toBeCloseTo(Math.PI / 2);

    store.advanceBossWind('forced_hand');
    expect(useGameStore.getState().dealerPhase).toBe('forced_hand');
    expect(useGameStore.getState().activeHazardWind).toBeNull();
  });

  it('completes vertical slice upon White Tile interruption and persists state', () => {
    const store = useGameStore.getState();
    store.enterBossCourt();
    store.advanceBossWind('forced_hand');

    // Add White Tile to inventory
    store.addTileToInventory('tile_white_dragon');
    store.setSelectedSlot(0);

    const success = store.interruptWithWhiteTile();
    expect(success).toBe(true);

    const victoryState = useGameStore.getState();
    expect(victoryState.dealerPhase).toBe('interrupted_victory');
    expect(victoryState.whiteTileInscribed).toBe(true);
    expect(victoryState.verticalSliceCompleted).toBe(true);
    expect(victoryState.activeDialogueTree?.id).toBe('dealer_white_tile_interrupt');

    // Verify localStorage persistence
    store.saveGame();
    store.resetGame();
    expect(useGameStore.getState().verticalSliceCompleted).toBe(false);

    store.loadGame();
    const loadedState = useGameStore.getState();
    expect(loadedState.currentScene).toBe('boss_court');
    expect(loadedState.dealerPhase).toBe('interrupted_victory');
    expect(loadedState.whiteTileInscribed).toBe(true);
    expect(loadedState.verticalSliceCompleted).toBe(true);
  });
});
