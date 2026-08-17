import { test, expect } from '@playwright/test';
import {
  setupConsoleErrorListener,
  focusGame,
  sprintMove,
  interactWithPrompt,
  expectScene,
  expectInventorySlot,
  advanceDialogue,
  selectInventorySlot,
} from './helpers/gameplayHelpers';
import {
  createInitialSave,
  SAVE_STORAGE_KEY,
  serializeSave,
} from '../../src/domain/save/saveSchema';

test.describe('Through the Jade Wall — Discard Consequence & Branching Regressions E2E', () => {
  test('executes Martial Sacrifice (Regent branch) unlocking East gate and collapsing West archway', async ({
    page,
  }) => {
    test.setTimeout(120000);
    const consoleErrors = setupConsoleErrorListener(page);

    await page.goto('/');

    // Start at Discard Passage with offering tiles in inventory at Reliquary table [0, 0, 3.0]
    const discardSaveState = createInitialSave({
      currentScene: 'discard_passage',
      checkpoint: 'cp_discard_passage_entered',
      playerPosition: [0, 0, 3.0],
      inventoryTiles: ['tile_white_dragon', 'tile_bamboo_4', 'tile_dragon_red'],
      teaHouseUnlocked: true,
      hasWhiteTile: true,
      hasBamboo4: true,
      hasRedDragon: true,
      balconiesAligned: true,
      sameDoorPairActive: true,
      memoryReconstructed: true,
      discardPassageResolved: false,
    });

    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, value);
      },
      { key: SAVE_STORAGE_KEY, value: serializeSave(discardSaveState) },
    );

    await page.reload();
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible({
      timeout: 10000,
    });
    await page.waitForTimeout(500);

    // Verify Scene & Advance entry dialogue
    await expectScene(page, 'Passage of Broken Tiles', 'Phase 5: Discard Consequence');
    const dialogueCard = page.locator('[data-testid="dialogue-card"]');
    if (await dialogueCard.isVisible()) {
      await advanceDialogue(page, 3, true);
    }

    // Walk towards East Regent Brazen Brazier at [3.0, 0, -5.0]
    await focusGame(page);
    await sprintMove(page, 'KeyD', 600);
    await sprintMove(page, 'KeyW', 1500);

    // Select Red Dragon Plaque (Slot 2 / Digit3)
    await focusGame(page);
    await selectInventorySlot(page, 2);

    // Perform Martial Sacrifice
    await interactWithPrompt(page, 'Sacrifice Selected Tile to Regent Brazier');

    // Verify consequence dialogue and Regent status badge
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Crimson fire roars');
    await expectScene(page, undefined, 'Phase 5: Martial Passage (East Unlocked)');
    await advanceDialogue(page, 2, true);

    // Verify Red Dragon is consumed from inventory
    await expectInventorySlot(page, 0, 'WHITE', true);
    await expectInventorySlot(page, 1, '4 BAM', true);
    await expectInventorySlot(page, 2, undefined, false);

    // Walk through opened East Iron Gate to North Threshold (at [0, 0, -20.5])
    await focusGame(page);
    await sprintMove(page, 'KeyW', 2600);
    await sprintMove(page, 'KeyA', 600);

    // Interact with North Threshold to Enter Watcher Courtyard
    await interactWithPrompt(page, "Cross Threshold into Watcher's Courtyard");
    await expectScene(page, 'Courtyard of the Watchers', 'Phase 6: Watcher Encounter');

    expect(consoleErrors).toEqual([]);
  });

  test('enforces White Tile immunity/protection preventing accidental discard sacrifice', async ({
    page,
  }) => {
    test.setTimeout(120000);
    const consoleErrors = setupConsoleErrorListener(page);

    await page.goto('/');

    const discardSaveState = createInitialSave({
      currentScene: 'discard_passage',
      checkpoint: 'cp_discard_passage_entered',
      playerPosition: [-3.0, 0, -5.0], // Positioned directly at West Furnace
      inventoryTiles: ['tile_white_dragon', 'tile_bamboo_4', 'tile_dragon_red'],
      teaHouseUnlocked: true,
      hasWhiteTile: true,
      hasBamboo4: true,
      hasRedDragon: true,
      balconiesAligned: true,
      sameDoorPairActive: true,
      memoryReconstructed: true,
      discardPassageResolved: false,
    });

    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, value);
      },
      { key: SAVE_STORAGE_KEY, value: serializeSave(discardSaveState) },
    );

    await page.reload();
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible({
      timeout: 10000,
    });
    await page.waitForTimeout(500);

    const dialogueCard = page.locator('[data-testid="dialogue-card"]');
    if (await dialogueCard.isVisible()) {
      await advanceDialogue(page, 3, true);
    }

    // Select White Tile in Slot 0 (Digit1)
    await focusGame(page);
    await selectInventorySlot(page, 0);

    // Attempt to sacrifice White Tile to Archivist Furnace
    await interactWithPrompt(page, 'Sacrifice Selected Tile to Archivist Furnace');

    // Verify rejection dialogue protects the White Tile
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Blank tile refuses to be categorized');
    await advanceDialogue(page, 2, true);

    // Verify White Tile is STILL present in inventory and discard passage remains unresolved
    await expectInventorySlot(page, 0, 'WHITE', true);
    await expectScene(page, undefined, 'Phase 5: Discard Consequence');

    expect(consoleErrors).toEqual([]);
  });
});
