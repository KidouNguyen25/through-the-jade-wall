import { test, expect } from '@playwright/test';
import {
  setupConsoleErrorListener,
  clearStorageAndReload,
  focusGame,
  holdKey,
  sprintMove,
  interactWithPrompt,
  advanceDialogue,
  selectDialogueChoice,
  selectInventorySlot,
  expectInventorySlot,
  expectScene,
} from './helpers/gameplayHelpers';

test.describe('Through the Jade Wall — Vertical Slice Full Playthrough E2E', () => {
  test('progresses through Rain Alley, Balcony Bridge, Portal Gate, Memory Sanctuary, Discard Passage, Watcher Courtyard, and Dealer Climax', async ({
    page,
  }) => {
    test.setTimeout(360000);

    const consoleErrors = setupConsoleErrorListener(page);

    await clearStorageAndReload(page);

    // 1. Initial Rain Alley Verification
    await expect(page.locator('.game-title')).toHaveText('THROUGH THE JADE WALL');
    await expectScene(page, undefined, 'Phase 1: Rain Alley Slice');
    await expectInventorySlot(page, 0, undefined, false);

    // Focus canvas window for locomotion
    await focusGame(page);

    // 2. Sprint to White Tile in Rain Alley (at [1.6, 0, -3.5] from [0, 0, 8.0])
    await sprintMove(page, 'KeyW', 2100);
    await holdKey(page, 'KeyD', 450);

    // Pick up White Tile
    await interactWithPrompt(page, 'Pick up White Tile');

    // 3. Verify White Tile in inventory slot 0
    await expectInventorySlot(page, 0, 'WHITE', true);

    // 4. Return to center and sprint into Tea House doorway (at [0, 0, -10.0])
    await focusGame(page);
    await holdKey(page, 'KeyA', 450);
    await sprintMove(page, 'KeyW', 900);

    // Trigger enter Tea House
    await interactWithPrompt(page, 'Enter Tea House');

    // 5. Verify East Arcade Scene Transition
    await expectScene(page, 'East Arcade', 'Phase 2: Mahjong Sequence Gate');

    // 6. Move towards Bamboo 4 Tile in East Arcade (at [3.0, 0, 4.0] from spawn [0, 0, 8.0])
    await focusGame(page);
    await holdKey(page, 'KeyD', 800);
    await holdKey(page, 'KeyW', 1300);

    // 7. Pick up Bamboo 4 Tile
    await interactWithPrompt(page, 'Pick up 4 Bamboo');

    // 8. Verify Bamboo 4 in inventory slot 1
    await expectInventorySlot(page, 1, '4 BAM', true);

    // 9. Move towards Sequence Gate Socket 3 (at [2.2, 0, 2.0])
    await focusGame(page);
    await holdKey(page, 'KeyA', 250);
    await holdKey(page, 'KeyW', 550);

    // 10. Place Bamboo 4 into Socket 3
    await interactWithPrompt(page, 'Place 4 Bamboo');

    // 11. Verify Sequence Gate resolved and balconies aligned
    await expect(page.locator('.narrative-banner')).toContainText(
      'Sequence Bamboo (2-3-4) completed',
    );

    // 12. Test Hint Guidance Modal (H key)
    await page.keyboard.press('KeyH');
    await expect(page.locator('#hint-modal-title')).toBeVisible();
    await expect(page.locator('.hint-content')).toContainText('Environmental Observation');

    // Expand hint layer
    const expandHintBtn = page.locator('.btn-hint-expand');
    await expect(expandHintBtn).toBeVisible();
    await expandHintBtn.click();
    await expect(page.locator('.hint-content')).toContainText('Mahjong Space Principle');

    // Close hint modal
    await page.keyboard.press('KeyH');
    await expect(page.locator('#hint-modal-title')).not.toBeVisible();

    // 13. Walk across aligned Balcony Bridge to Upper Terrace Altar (from [2.1, 0, 1.8] to [0, 0, -10.8])
    await focusGame(page);
    await holdKey(page, 'KeyA', 600);
    await sprintMove(page, 'KeyW', 2300);

    // 14. Pick up Red Dragon Plaque at Altar ([0, 0, -12.0])
    await interactWithPrompt(page, 'Pick up Red Dragon Plaque');

    // 15. Verify Red Dragon in inventory slot 1
    await expectInventorySlot(page, 1, 'RED DRG', true);

    // 16. Navigate around Altar to Doorway Beta Socket (at [-3.5, 0, -15.0])
    await focusGame(page);
    await holdKey(page, 'KeyS', 200);
    await holdKey(page, 'KeyA', 1000);
    await holdKey(page, 'KeyW', 1000);

    // 17. Place Red Dragon Plaque into Doorway Beta
    await interactWithPrompt(page, 'Place Red Dragon Plaque');

    // 18. Verify Pair Gate Solved & Portal Activated
    await expect(page.locator('.narrative-banner')).toContainText(
      'Pair of Red Dragons established',
    );
    await expectScene(page, undefined, 'Phase 3: Impossible Space Gate');

    // 19. Walk forward past Doorway Beta to Memory Sanctuary Door (at [-3.5, 0, -19.5])
    await focusGame(page);
    await sprintMove(page, 'KeyW', 1200);

    // 20. Enter Memory Sanctuary
    await interactWithPrompt(page, 'Enter Memory Sanctuary');

    // 21. Verify Memory Room Scene Transition
    await expectScene(page, 'Memory Sanctuary', 'Phase 4: Memory Sanctuary');
    await expect(page.locator('[data-testid="memory-fragments-tracker"]')).toBeVisible();

    // 22. Advance through Introductory Dialogue Monologue
    const dialogueCard = page.locator('[data-testid="dialogue-card"]');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Alice');

    // Click continue on node 1, select choice 0, and advance remaining nodes
    await advanceDialogue(page, 1);
    await selectDialogueChoice(page, 0);
    await advanceDialogue(page, 2, true);

    // 23. Move to East Gate Fragment Pedestal (at [3.5, 0, -3.0] from spawn [0, 0, 4.5])
    await focusGame(page);
    await holdKey(page, 'KeyD', 1000);
    await holdKey(page, 'KeyW', 2000);

    // 24. Inspect East Gate Fragment
    await interactWithPrompt(page, 'Inspect East Gate Fragment');

    // Advance fragment dialogue
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Observation Log');
    await advanceDialogue(page, 2, true);

    // 25. Sprint to Midnight Bell Fragment Pedestal (at [-3.5, 0, -3.0] from [3.5, 0, -3.0])
    await focusGame(page);
    await sprintMove(page, 'KeyA', 1300);

    // 26. Inspect Midnight Bell Fragment
    await interactWithPrompt(page, 'Inspect Midnight Bell Fragment');
    await advanceDialogue(page, 2, true);

    // 27. Move to Captain's Seal Fragment Pedestal (at [0, 0, -6.5] from [-3.5, 0, -3.0])
    await focusGame(page);
    await sprintMove(page, 'KeyD', 650);
    await sprintMove(page, 'KeyW', 700);

    // 28. Inspect Captain's Seal Fragment
    await interactWithPrompt(page, "Inspect Captain's Seal Fragment");
    await advanceDialogue(page, 2);

    // 29. Verify Memory Reconstructed Status & Holographic Revelation Dialogue
    await expectScene(page, undefined, 'Phase 4: Memory Reconstructed');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Holographic Projection Online');

    // Advance revelation dialogue
    await advanceDialogue(page, 1);
    await selectDialogueChoice(page, 0);
    await advanceDialogue(page, 1, true);

    // 30. Step forward to Discard Passage Gateway (at [0, 0, -8.0] from [0, 0, -6.5])
    await focusGame(page);
    await holdKey(page, 'KeyW', 400);

    // 31. Enter Discard Passage
    await interactWithPrompt(page, 'Enter Discard Passage');

    // 32. Verify Discard Passage Transition & Advance Entry Inscription Monologue
    await expectScene(page, 'Passage of Broken Tiles', 'Phase 5: Discard Consequence');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Alice');
    await advanceDialogue(page, 3, true);

    // 33. Walk forward to Reliquary Table (at [0, 0, 3.0] from spawn [0, 0, 6.0])
    await focusGame(page);
    await holdKey(page, 'KeyW', 900);

    // 34. Draw offering tiles from Reliquary
    await interactWithPrompt(page, 'Draw Offering Tiles from Reliquary');

    // Verify Bamboo 4 and Red Dragon in slots 1 and 2
    await expectInventorySlot(page, 1, '4 BAM', true);
    await expectInventorySlot(page, 2, 'RED DRG', true);

    // 35. Walk to West Archivist Stone Furnace (at [-3.0, 0, -5.0] from [0, 0, 3.0])
    await focusGame(page);
    await sprintMove(page, 'KeyA', 600);
    await sprintMove(page, 'KeyW', 1350);

    // 36. Test White Tile Protection: Select slot 0 (Digit1) and attempt sacrifice
    await focusGame(page);
    await selectInventorySlot(page, 0);

    await interactWithPrompt(page, 'Sacrifice Selected Tile to Archivist Furnace');

    // Verify rejection dialogue
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Blank tile refuses to be categorized');
    await advanceDialogue(page, 2, true);

    // 37. Select Bamboo 4 in Slot 1 and perform Scholar's Sacrifice
    await focusGame(page);
    await selectInventorySlot(page, 1);

    await interactWithPrompt(page);

    // Verify consequence dialogue and status badge
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Emerald flame consumes the offered tile');
    await expectScene(page, undefined, 'Phase 5: Scholar’s Ascent (West Unlocked)');
    await advanceDialogue(page, 2, true);

    // 38. Walk through opened West Portcullis to North Threshold (from [-3.0, 0, -5.0] to [0, 0, -20.5])
    await focusGame(page);
    await sprintMove(page, 'KeyW', 2800);
    await holdKey(page, 'KeyD', 600);

    // 39. Interact with North Threshold to Enter Watcher Courtyard
    await interactWithPrompt(page, "Cross Threshold into Watcher's Courtyard");

    // 40. Verify Dead Hand Scene Transition & Advance Entry Monologue
    await expectScene(page, 'Courtyard of the Watchers', 'Phase 6: Watcher Encounter');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Alice');
    await advanceDialogue(page, 3, true);

    // 41. Stealth Flank along West Colonnade behind Watcher Alpha to Central Gong ([0, 0, -8.0])
    await focusGame(page);
    await sprintMove(page, 'KeyA', 900);
    await sprintMove(page, 'KeyW', 2800);
    await sprintMove(page, 'KeyD', 900);

    // 42. Strike Invalidation Gong to Declare Chombo (Dead Hand)
    await interactWithPrompt(page, 'Strike Gong to Declare Chombo');

    // 43. Verify Dead Hand Invalidation Dialogue & Stasis Status Badge
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('CHOMBO');
    await expectScene(page, undefined, 'Phase 6: Dead Hand Declared (Stasis Lock)');
    await advanceDialogue(page, 3, true);

    // 44. Walk around central gong and forward to unsealed Dealer's Court Gateway (at [0, 0, -20.5])
    await focusGame(page);
    await holdKey(page, 'KeyD', 350);
    await sprintMove(page, 'KeyW', 2600);
    await holdKey(page, 'KeyA', 350);

    // 45. Cross Gateway into Dealer’s Court
    await interactWithPrompt(page, 'Cross Gateway into Dealer’s Court');

    // 46. Verify Dealer's Intro Dialogue in Boss Court
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Seat of the Dealer');
    await expectScene(page, undefined, 'Phase 7: Dealer’s Court');
    await advanceDialogue(page, 4, true);

    // 47. Walk forward from entrance [0, 0, 8.5] to Central Tribunal Dais [0, 0, 0]
    await focusGame(page);
    await sprintMove(page, 'KeyW', 1600);

    // 48. Summon First Wind: Wind of the East (Ton)
    await interactWithPrompt(page, 'Hear Dealer’s Decree (Summon East Wind)');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('WIND OF THE EAST');
    await expectScene(page, undefined, 'Phase 7: Wind of the East');
    await advanceDialogue(page, 1, true);

    // 49. Rotate Arena: Wind of the South (Nan)
    await interactWithPrompt(page, 'Endure East Wind (Rotate to South Wind)');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('WIND OF THE SOUTH');
    await expectScene(page, undefined, 'Phase 7: Wind of the South');
    await advanceDialogue(page, 1, true);

    // 50. Trigger Final Hand Demand (Ron)
    await interactWithPrompt(page, 'Endure South Wind (Trigger Final Hand)');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('RON! The Final Wind is declared');
    await expectScene(page, undefined, 'Phase 7: The Final Hand (Ron)');
    await advanceDialogue(page, 2, true);

    // 51. Select White Tile (Slot 0 / Key1) to refuse the premise
    await selectInventorySlot(page, 0);

    // 52. Place White Tile on Central Tribunal Anchor
    await interactWithPrompt(page, 'Place White Tile to Refuse Premise');

    // 53. Verify Refusal Dialogue & Shattered False Trial
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('refuse the premise');
    await expectScene(page, undefined, 'Phase 7: Trial Shattered (Victory)');
    await advanceDialogue(page, 5, true);

    // 54. Verify Vertical Slice Complete Victory Modal
    const victoryModal = page.locator('[data-testid="victory-modal"]');
    await expect(victoryModal).toBeVisible({ timeout: 5000 });
    await expect(victoryModal).toContainText('VERTICAL SLICE COMPLETE');
    await expect(victoryModal).toContainText('“A hand may be complete and still be wrong.”');
    await expect(victoryModal).toContainText('Sequence Bridge');
    await expect(victoryModal).toContainText('Same-Door Principle');
    await expect(victoryModal).toContainText('Refusal of the Premise');

    // 55. Close victory modal to continue exploring
    await page.locator('.btn-primary', { hasText: 'Continue Exploring' }).click();
    await expect(victoryModal).not.toBeVisible({ timeout: 3000 });

    // 56. Verify 0 console errors across entire completed vertical slice journey!
    expect(consoleErrors).toEqual([]);
  });
});
