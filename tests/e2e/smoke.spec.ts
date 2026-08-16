import { test, expect } from '@playwright/test';

test.describe('Through the Jade Wall - Phase 6 Dead Hand Encounter E2E', () => {
  test('progresses through Rain Alley, Balcony Bridge, Portal Gate, Memory Sanctuary, Discard Passage, and Watcher Courtyard', async ({
    page,
  }) => {
    test.setTimeout(300000);

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    await page.waitForTimeout(500);

    // 1. Initial Rain Alley Verification
    await expect(page.locator('.game-title')).toHaveText('THROUGH THE JADE WALL');
    await expect(page.locator('.status-badge')).toContainText('Phase 1: Rain Alley Slice');
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible();

    const slot0 = page.locator('[data-testid="inventory-slot-0"]');
    await expect(slot0).toBeVisible();
    await expect(slot0).not.toHaveClass(/occupied/);

    // Focus canvas window
    await page.locator('body').focus();
    await page.waitForTimeout(300);

    // 2. Sprint to White Tile in Rain Alley (at [1.6, 0, -3.5] from [0, 0, 8.0])
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2100);
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');

    await page.keyboard.down('KeyD');
    await page.waitForTimeout(450);
    await page.keyboard.up('KeyD');

    const promptButton = page.locator('[data-testid="interaction-prompt-button"]');
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Pick up White Tile');
    await promptButton.click({ force: true });

    // 3. Verify White Tile in inventory
    await expect(slot0).toHaveClass(/occupied/);
    await expect(slot0).toContainText('WHITE');

    // 4. Return to center and sprint into Tea House doorway (at [0, 0, -10.0])
    await page.locator('body').focus();
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(450);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(900);
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');

    // Trigger enter Tea House
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Enter Tea House');
    await promptButton.click({ force: true });

    // 5. Verify East Arcade Scene Transition
    await expect(page.locator('.status-badge')).toContainText('Phase 2: Mahjong Sequence Gate');
    await expect(page.locator('.game-subtitle')).toContainText('East Arcade');

    // Re-focus body after scene change
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    // 6. Move towards Bamboo 4 Tile in East Arcade (at [3.0, 0, 4.0] from spawn [0, 0, 8.0])
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(800);
    await page.keyboard.up('KeyD');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1300);
    await page.keyboard.up('KeyW');

    // 7. Pick up Bamboo 4 Tile
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Pick up 4 Bamboo');
    await promptButton.click({ force: true });

    // 8. Verify Bamboo 4 in inventory
    const slot1 = page.locator('[data-testid="inventory-slot-1"]');
    await expect(slot1).toHaveClass(/occupied/);
    await expect(slot1).toContainText('4 BAM');

    // Re-focus body after collecting tile
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    // 9. Move towards Sequence Gate Socket 3 (at [2.2, 0, 2.0])
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(250);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(550);
    await page.keyboard.up('KeyW');

    // 10. Place Bamboo 4 into Socket 3
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Place 4 Bamboo');
    await promptButton.click({ force: true });

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
    await page.waitForTimeout(200);

    // 13. Walk across aligned Balcony Bridge to Upper Terrace Altar (from [2.1, 0, 1.8] to [0, 0, -10.8])
    await page.waitForTimeout(200);
    await page.locator('body').focus();
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(600);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2300);
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');

    // 14. Pick up Red Dragon Plaque at Altar ([0, 0, -12.0])
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Pick up Red Dragon Plaque');
    await promptButton.click({ force: true });

    // 15. Verify Red Dragon in inventory slot
    await expect(slot1).toHaveClass(/occupied/);
    await expect(slot1).toContainText('RED DRG');

    // Re-focus body after collecting Red Dragon
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    // 16. Navigate around Altar to Doorway Beta Socket (at [-3.5, 0, -15.0])
    await page.keyboard.down('KeyS');
    await page.waitForTimeout(200);
    await page.keyboard.up('KeyS');

    await page.keyboard.down('KeyA');
    await page.waitForTimeout(1000);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1400);
    await page.keyboard.up('KeyW');

    // 17. Place Red Dragon Plaque into Doorway Beta
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Place Red Dragon Plaque');
    await promptButton.click({ force: true });

    // 18. Verify Pair Gate Solved & Portal Activated
    await expect(page.locator('.narrative-banner')).toContainText(
      'Pair of Red Dragons established',
    );
    await expect(page.locator('.status-badge')).toContainText('Phase 3: Impossible Space Gate');

    // 19. Walk forward past Doorway Beta to Memory Sanctuary Door (at [-3.5, 0, -19.5])
    await page.waitForTimeout(200);
    await page.locator('body').focus();
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1200);
    await page.keyboard.up('KeyW');

    // 20. Enter Memory Sanctuary
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Enter Memory Sanctuary');
    await promptButton.click({ force: true });

    // 21. Verify Memory Room Scene Transition
    await expect(page.locator('.status-badge')).toContainText('Phase 4: Memory Sanctuary');
    await expect(page.locator('.game-subtitle')).toContainText('Memory Sanctuary');
    await expect(page.locator('[data-testid="memory-fragments-tracker"]')).toBeVisible();

    // 22. Advance through Introductory Dialogue Monologue
    const dialogueCard = page.locator('[data-testid="dialogue-card"]');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Alice');

    // Click continue on node 1
    const continueBtn = page.locator('[data-testid="dialogue-continue-btn"]');
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();

    // Choice node 2: select choice 0 ("What is this place?")
    const choice0 = page.locator('[data-testid="dialogue-choice-0"]');
    await expect(choice0).toBeVisible();
    await choice0.click();

    // Node 3 & 4
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();

    // Verify dialogue closed
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 23. Move to East Gate Fragment Pedestal (at [3.5, 0, -3.0] from spawn [0, 0, 4.5])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('KeyD');
    await page.waitForTimeout(1000);
    await page.keyboard.up('KeyD');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2000);
    await page.keyboard.up('KeyW');

    // 24. Inspect East Gate Fragment
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Inspect East Gate Fragment');
    await promptButton.click({ force: true });

    // Advance fragment dialogue
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Observation Log');
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 25. Sprint to Midnight Bell Fragment Pedestal (at [-3.5, 0, -3.0] from [3.5, 0, -3.0])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(1300);
    await page.keyboard.up('KeyA');
    await page.keyboard.up('ShiftLeft');

    // 26. Inspect Midnight Bell Fragment
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Inspect Midnight Bell Fragment');
    await promptButton.click({ force: true });

    // Advance fragment dialogue
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 27. Move to Captain's Seal Fragment Pedestal (at [0, 0, -6.5] from [-3.5, 0, -3.0])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(650);
    await page.keyboard.up('KeyD');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(700);
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');

    // 28. Inspect Captain's Seal Fragment
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText("Inspect Captain's Seal Fragment");
    await promptButton.click({ force: true });

    // Advance 3rd fragment dialogue
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await continueBtn.click();
    await continueBtn.click();

    // 29. Verify Memory Reconstructed Status & Holographic Revelation Dialogue
    await expect(page.locator('.status-badge')).toContainText('Phase 4: Memory Reconstructed');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Holographic Projection Online');

    // Advance revelation dialogue
    await continueBtn.click();
    const readyChoice = page.locator('[data-testid="dialogue-choice-0"]');
    await expect(readyChoice).toBeVisible();
    await readyChoice.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 30. Step forward to Discard Passage Gateway (at [0, 0, -8.0] from [0, 0, -6.5])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(400);
    await page.keyboard.up('KeyW');

    // 31. Enter Discard Passage
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Enter Discard Passage');
    await promptButton.click({ force: true });

    // 32. Verify Discard Passage Transition & Advance Entry Inscription Monologue
    await expect(page.locator('.status-badge')).toContainText('Phase 5: Discard Consequence');
    await expect(page.locator('.game-subtitle')).toContainText('Passage of Broken Tiles');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Alice');

    // Advance through 3 entry dialogue nodes
    await continueBtn.click();
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 33. Walk forward to Reliquary Table (at [0, 0, 3.0] from spawn [0, 0, 6.0])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(900);
    await page.keyboard.up('KeyW');

    // 34. Draw offering tiles from Reliquary
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Draw Offering Tiles from Reliquary');
    await promptButton.click({ force: true });

    // Verify Bamboo 4 and Red Dragon in slots 1 and 2
    await expect(slot1).toHaveClass(/occupied/);
    await expect(slot1).toContainText('4 BAM');
    const slot2 = page.locator('[data-testid="inventory-slot-2"]');
    await expect(slot2).toHaveClass(/occupied/);
    await expect(slot2).toContainText('RED DRG');

    // 35. Walk to West Archivist Stone Furnace (at [-3.0, 0, -5.0] from [0, 0, 3.0])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(600);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1350);
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');

    // 36. Test White Tile Protection: Select slot 0 (Digit1) and attempt sacrifice
    await page.waitForTimeout(200);
    await page.locator('body').focus();
    await page.keyboard.press('Digit1');
    await page.waitForTimeout(200);

    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Sacrifice Selected Tile to Archivist Furnace');
    await promptButton.click({ force: true });

    // Verify rejection dialogue
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Blank tile refuses to be categorized');
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 37. Select Bamboo 4 in Slot 1 and perform Scholar's Sacrifice
    await page.waitForTimeout(200);
    await page.locator('body').focus();
    await page.keyboard.press('Digit2');
    await page.waitForTimeout(200);

    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await promptButton.click({ force: true });

    // Verify consequence dialogue and status badge
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Emerald flame consumes the offered tile');
    await expect(page.locator('.status-badge')).toContainText(
      'Phase 5: Scholar’s Ascent (West Unlocked)',
    );

    // Advance consequence dialogue
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 38. Walk through opened West Portcullis to North Threshold (from [-3.0, 0, -5.0] to [0, 0, -20.5])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2800);
    await page.keyboard.up('KeyW');

    await page.keyboard.down('KeyD');
    await page.waitForTimeout(600);
    await page.keyboard.up('KeyD');
    await page.keyboard.up('ShiftLeft');

    // 39. Interact with North Threshold to Enter Watcher Courtyard
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText("Cross Threshold into Watcher's Courtyard");
    await promptButton.click({ force: true });

    // 40. Verify Dead Hand Scene Transition & Advance Entry Monologue
    await expect(page.locator('.status-badge')).toContainText('Phase 6: Watcher Encounter');
    await expect(page.locator('.game-subtitle')).toContainText('Courtyard of the Watchers');
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Alice');

    // Advance 3 entry dialogue nodes
    await continueBtn.click();
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 41. Stealth Flank along West Colonnade behind Watcher Alpha to Central Gong ([0, 0, -8.0])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(900);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2800);
    await page.keyboard.up('KeyW');

    await page.keyboard.down('KeyD');
    await page.waitForTimeout(900);
    await page.keyboard.up('KeyD');
    await page.keyboard.up('ShiftLeft');

    // 42. Strike Invalidation Gong to Declare Chombo (Dead Hand)
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Strike Gong to Declare Chombo');
    await promptButton.click({ force: true });

    // 43. Verify Dead Hand Invalidation Dialogue & Stasis Status Badge
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('CHOMBO');
    await expect(page.locator('.status-badge')).toContainText(
      'Phase 6: Dead Hand Declared (Stasis Lock)',
    );

    // Advance 3 invalidation dialogue nodes
    await continueBtn.click();
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 44. Walk around central gong and forward to unsealed Dealer's Court Gateway (at [0, 0, -20.5])
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    // Move slightly right to bypass gong pedestal obstacle
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(350);
    await page.keyboard.up('KeyD');

    // Sprint forward towards the northern gateway
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2600);
    await page.keyboard.up('KeyW');

    // Move back towards centerline
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(350);
    await page.keyboard.up('KeyA');
    await page.keyboard.up('ShiftLeft');

    // 45. Cross Gateway into Dealer's Court
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Cross Gateway into Dealer’s Court');
    await promptButton.click({ force: true });

    // 46. Verify Dealer's Intro Dialogue in Boss Court
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('Seat of the Dealer');
    await expect(page.locator('.status-badge')).toContainText('Phase 7: Dealer’s Court');

    // Advance 4 intro dialogue nodes
    await continueBtn.click();
    await continueBtn.click();
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 47. Walk forward from entrance [0, 0, 8.5] to Central Tribunal Dais [0, 0, 0]
    await page.waitForTimeout(300);
    await page.locator('body').focus();
    await page.waitForTimeout(200);

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1600);
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');

    // 48. Summon First Wind: Wind of the East (Ton)
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Hear Dealer’s Decree (Summon East Wind)');
    await promptButton.click({ force: true });

    // Verify East Wind dialogue & status badge
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('WIND OF THE EAST');
    await expect(page.locator('.status-badge')).toContainText('Phase 7: Wind of the East');
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 49. Rotate Arena: Wind of the South (Nan)
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Endure East Wind (Rotate to South Wind)');
    await promptButton.click({ force: true });

    // Verify South Wind dialogue & status badge
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('WIND OF THE SOUTH');
    await expect(page.locator('.status-badge')).toContainText('Phase 7: Wind of the South');
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 50. Trigger Final Hand Demand (Ron)
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Endure South Wind (Trigger Final Hand)');
    await promptButton.click({ force: true });

    // Verify Forced Hand dialogue & status badge
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('RON! The Final Wind is declared');
    await expect(page.locator('.status-badge')).toContainText('Phase 7: The Final Hand (Ron)');
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

    // 51. Select White Tile (Slot 1 / Key1) to refuse the premise
    await page.keyboard.press('Digit1');

    // 52. Place White Tile on Central Tribunal Anchor
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Place White Tile to Refuse Premise');
    await promptButton.click({ force: true });

    // 53. Verify Refusal Dialogue & Shattered False Trial
    await expect(dialogueCard).toBeVisible({ timeout: 5000 });
    await expect(dialogueCard).toContainText('refuse the premise');
    await expect(page.locator('.status-badge')).toContainText('Phase 7: Trial Shattered (Victory)');

    // Advance 5 climax dialogue nodes
    await continueBtn.click();
    await continueBtn.click();
    await continueBtn.click();
    await continueBtn.click();
    await continueBtn.click();
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });

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
