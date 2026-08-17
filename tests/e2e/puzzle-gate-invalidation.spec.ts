import { test, expect } from '@playwright/test';
import {
  setupConsoleErrorListener,
  focusGame,
  holdKey,
  sprintMove,
  interactWithPrompt,
  expectScene,
} from './helpers/gameplayHelpers';
import {
  createInitialSave,
  SAVE_STORAGE_KEY,
  serializeSave,
} from '../../src/domain/save/saveSchema';

test.describe('Through the Jade Wall — Puzzle Invalidation & Spatial Gate Rules E2E', () => {
  test('verifies Sequence Gate remains unbridged until Bamboo 4 is slotted', async ({ page }) => {
    test.setTimeout(120000);
    const consoleErrors = setupConsoleErrorListener(page);

    await page.goto('/');

    // Start in East Arcade with Bamboo 4 collected but NOT yet placed in socket
    const eastArcadeState = createInitialSave({
      currentScene: 'east_arcade',
      checkpoint: 'cp_east_arcade_entered',
      playerPosition: [0, 0, 8.0],
      inventoryTiles: ['tile_white_dragon', 'tile_bamboo_4'],
      teaHouseUnlocked: true,
      hasWhiteTile: true,
      hasBamboo4: true,
      balconiesAligned: false,
      sameDoorPairActive: false,
    });

    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, value);
      },
      { key: SAVE_STORAGE_KEY, value: serializeSave(eastArcadeState) },
    );

    await page.reload();
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible({
      timeout: 10000,
    });
    await page.waitForTimeout(500);
    await expectScene(page, 'East Arcade', 'Phase 2: Mahjong Sequence Gate');

    // Move to Socket 3
    await focusGame(page);
    await holdKey(page, 'KeyD', 500);
    await holdKey(page, 'KeyW', 1800);
    await holdKey(page, 'KeyA', 250);

    // Place Bamboo 4 into Socket 3
    await interactWithPrompt(page, 'Place 4 Bamboo');

    // Verify Sequence Gate completes and bridge locks in
    await expect(page.locator('.narrative-banner')).toContainText(
      'Sequence Bamboo (2-3-4) completed',
    );

    expect(consoleErrors).toEqual([]);
  });

  test('verifies Same-Door Pair warp triggers only when both Red Dragon sockets are completed', async ({
    page,
  }) => {
    test.setTimeout(120000);
    const consoleErrors = setupConsoleErrorListener(page);

    await page.goto('/');

    // Start in East Arcade with bridge aligned, Red Dragon in inventory, Door Beta empty
    const pairState = createInitialSave({
      currentScene: 'east_arcade',
      checkpoint: 'cp_balconies_aligned',
      playerPosition: [0, 0, -10.8], // At Upper Terrace Altar
      inventoryTiles: ['tile_white_dragon', 'tile_dragon_red'],
      teaHouseUnlocked: true,
      hasWhiteTile: true,
      hasBamboo4: true,
      hasRedDragon: true,
      balconiesAligned: true,
      sameDoorPairActive: false,
      placedTiles: {
        socket_balcony_1: 'tile_bamboo_2',
        socket_balcony_2: 'tile_bamboo_3',
        socket_balcony_3: 'tile_bamboo_4',
        socket_door_alpha: 'tile_dragon_red',
        socket_door_beta: null, // Door Beta socket empty
      },
    });

    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, value);
      },
      { key: SAVE_STORAGE_KEY, value: serializeSave(pairState) },
    );

    await page.reload();
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible({
      timeout: 10000,
    });
    await page.waitForTimeout(500);

    // Navigate to Doorway Beta Socket (at [-3.5, 0, -15.0])
    await focusGame(page);
    await holdKey(page, 'KeyS', 200);
    await holdKey(page, 'KeyA', 1000);
    await holdKey(page, 'KeyW', 1100);

    // Place Red Dragon Plaque into Doorway Beta
    await interactWithPrompt(page, 'Place Red Dragon Plaque');

    // Verify Pair Gate Solved & Portal Activated
    await expect(page.locator('.narrative-banner')).toContainText(
      'Pair of Red Dragons established',
    );
    await expectScene(page, undefined, 'Phase 3: Impossible Space Gate');

    // Walk forward past Doorway Beta to Memory Sanctuary Door (at [-3.5, 0, -19.5])
    await focusGame(page);
    await sprintMove(page, 'KeyW', 1500);

    // Enter Memory Sanctuary
    await interactWithPrompt(page, 'Enter Memory Sanctuary');
    await expectScene(page, 'Memory Sanctuary', 'Phase 4: Memory Sanctuary');

    expect(consoleErrors).toEqual([]);
  });
});
