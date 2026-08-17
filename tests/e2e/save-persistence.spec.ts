import { test, expect } from '@playwright/test';
import {
  setupConsoleErrorListener,
  clearStorageAndReload,
  focusGame,
  sprintMove,
  holdKey,
  interactWithPrompt,
  expectScene,
  expectInventorySlot,
  advanceDialogue,
} from './helpers/gameplayHelpers';
import {
  createInitialSave,
  SAVE_STORAGE_KEY,
  serializeSave,
} from '../../src/domain/save/saveSchema';

test.describe('Through the Jade Wall — Save Persistence & Checkpoint Restoration E2E', () => {
  test('persists gameplay progression across browser page reload', async ({ page }) => {
    test.setTimeout(120000);
    const consoleErrors = setupConsoleErrorListener(page);

    await clearStorageAndReload(page);

    // 1. Start in Rain Alley, acquire White Tile
    await expectScene(page, undefined, 'Phase 1: Rain Alley Slice');
    await focusGame(page);
    await sprintMove(page, 'KeyW', 2100);
    await holdKey(page, 'KeyD', 450);
    await interactWithPrompt(page, 'Pick up White Tile');
    await expectInventorySlot(page, 0, 'WHITE', true);

    // 2. Cross into Tea House (East Arcade)
    await focusGame(page);
    await holdKey(page, 'KeyA', 450);
    await sprintMove(page, 'KeyW', 900);
    await interactWithPrompt(page, 'Enter Tea House');
    await expectScene(page, 'East Arcade', 'Phase 2: Mahjong Sequence Gate');

    // 3. Reload the browser page to test cold persistence restoration
    await page.reload();
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible({
      timeout: 10000,
    });
    await page.waitForTimeout(500);

    // 4. Verify scene, status, and inventory are restored from localStorage
    await expectScene(page, 'East Arcade', 'Phase 2: Mahjong Sequence Gate');
    await expectInventorySlot(page, 0, 'WHITE', true);

    expect(consoleErrors).toEqual([]);
  });

  test('restores mid-game memory reconstruction checkpoint from valid save state', async ({
    page,
  }) => {
    test.setTimeout(120000);
    const consoleErrors = setupConsoleErrorListener(page);

    await page.goto('/');

    // Inject SaveState at Memory Sanctuary with East Gate and Midnight Bell fragments collected
    const memorySaveState = createInitialSave({
      currentScene: 'memory_room',
      checkpoint: 'cp_memory_room_entered',
      playerPosition: [0, 0, -6.5],
      inventoryTiles: ['tile_white_dragon', 'tile_bamboo_4', 'tile_dragon_red'],
      teaHouseUnlocked: true,
      hasWhiteTile: true,
      hasBamboo4: true,
      hasRedDragon: true,
      balconiesAligned: true,
      sameDoorPairActive: true,
      placedTiles: {
        socket_balcony_1: 'tile_bamboo_2',
        socket_balcony_2: 'tile_bamboo_3',
        socket_balcony_3: 'tile_bamboo_4',
        socket_door_alpha: 'tile_dragon_red',
        socket_door_beta: 'tile_dragon_red',
      },
      memoryFragments: {
        eastGate: true,
        midnightBell: true,
        captainSeal: false,
      },
      memoryReconstructed: false,
    });

    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, value);
      },
      { key: SAVE_STORAGE_KEY, value: serializeSave(memorySaveState) },
    );

    // Reload into restored checkpoint
    await page.reload();
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible({
      timeout: 10000,
    });
    await page.waitForTimeout(500);

    // Verify Scene & Inventory are restored
    await expectScene(page, 'Memory Sanctuary', 'Phase 4: Memory Sanctuary');
    await expectInventorySlot(page, 0, 'WHITE', true);
    await expectInventorySlot(page, 1, '4 BAM', true);
    await expectInventorySlot(page, 2, 'RED DRG', true);

    // Close intro dialogue if present
    const dialogueCard = page.locator('[data-testid="dialogue-card"]');
    if (await dialogueCard.isVisible()) {
      await advanceDialogue(page, 1);
      const choice0 = page.locator('[data-testid="dialogue-choice-0"]');
      if (await choice0.isVisible()) {
        await choice0.click();
      }
      await advanceDialogue(page, 2, true);
    }

    // Inspect final fragment at [0, 0, -6.5] to trigger full reconstruction
    await interactWithPrompt(page, "Inspect Captain's Seal Fragment");
    await advanceDialogue(page, 2);

    // Verify Holographic Reconstruction triggers successfully from saved progression!
    await expectScene(page, undefined, 'Phase 4: Memory Reconstructed');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Holographic Projection Online');

    expect(consoleErrors).toEqual([]);
  });
});
