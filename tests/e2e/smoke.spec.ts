import { test, expect } from '@playwright/test';

test.describe('Through the Jade Wall - Phase 3 Impossible Space & Same Door E2E', () => {
  test('progresses through Rain Alley, Balcony Sequence Bridge, and Twin Doorway Portal Traversal', async ({
    page,
  }) => {
    test.setTimeout(60000);

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // 1. Initial Rain Alley Verification
    await expect(page.locator('.game-title')).toHaveText('THROUGH THE JADE WALL');
    await expect(page.locator('.status-badge')).toContainText('Phase 1: Rain Alley Slice');
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible();

    const slot0 = page.locator('[data-testid="inventory-slot-0"]');
    await expect(slot0).toBeVisible();
    await expect(slot0).not.toHaveClass(/occupied/);

    await page.waitForTimeout(500);

    // 2. Pick up White Tile in Rain Alley (at [1.6, 0, -3.5])
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2000);
    await page.keyboard.up('KeyW');

    await page.keyboard.down('KeyD');
    await page.waitForTimeout(400);
    await page.keyboard.up('KeyD');

    const promptButton = page.locator('[data-testid="interaction-prompt-button"]');
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Pick up White Tile');
    await page.keyboard.press('KeyE');

    // 3. Verify White Tile in inventory
    await expect(slot0).toHaveClass(/occupied/);
    await expect(slot0).toContainText('WHITE');

    // 4. Return to center and sprint into Tea House doorway (at [0, 0, -10.0])
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(400);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1300);
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');

    // Trigger enter Tea House
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Enter Tea House');
    await page.keyboard.press('KeyE');

    // 5. Verify East Arcade Scene Transition
    await expect(page.locator('.status-badge')).toContainText('Phase 2: Mahjong Sequence Gate');
    await expect(page.locator('.game-subtitle')).toContainText('East Arcade');

    // Re-focus body after scene change
    await page.locator('body').focus();
    await page.waitForTimeout(500);

    // 6. Move towards Bamboo 4 Tile in East Arcade (at [3.0, 0, 4.0] from spawn [0, 0, 8.0])
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(800);
    await page.keyboard.up('KeyD');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1400);
    await page.keyboard.up('KeyW');

    // 7. Pick up Bamboo 4 Tile
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Pick up 4 Bamboo');
    await page.keyboard.press('KeyE');

    // 8. Verify Bamboo 4 in inventory
    const slot1 = page.locator('[data-testid="inventory-slot-1"]');
    await expect(slot1).toHaveClass(/occupied/);
    await expect(slot1).toContainText('4 BAM');

    // Re-focus body after collecting tile
    await page.locator('body').focus();
    await page.waitForTimeout(300);

    // 9. Move towards Sequence Gate Socket 3 (at [2.2, 0, 2.0])
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(250);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(600);
    await page.keyboard.up('KeyW');

    // 10. Place Bamboo 4 into Socket 3
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Place 4 Bamboo');
    await page.keyboard.press('KeyE');

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
    await page.waitForTimeout(300);

    // 13. Walk across aligned Balcony Bridge to Upper Terrace Altar (from [2.1, 0, 1.8] to [0, 0, -10.8])
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
    await page.keyboard.press('KeyE');

    // 15. Verify Red Dragon in inventory slot
    await expect(slot1).toHaveClass(/occupied/);
    await expect(slot1).toContainText('RED DRG');

    // Re-focus body after collecting Red Dragon
    await page.locator('body').focus();
    await page.waitForTimeout(300);

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
    await page.keyboard.press('KeyE');

    // 18. Verify Pair Gate Solved & Portal Activated
    await expect(page.locator('.narrative-banner')).toContainText(
      'Pair of Red Dragons established',
    );
    await expect(page.locator('.status-badge')).toContainText('Phase 3: Impossible Space Gate');

    // 19. Step Through Doorway Beta to warp to Doorway Alpha
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Step Through Doorway Beta');
    await page.keyboard.press('KeyE');

    // 20. Verify Impossible Traversal
    await expect(page.locator('.narrative-banner')).toContainText('Impossible Traversal');

    // 21. Verify 0 console errors throughout entire slice
    expect(consoleErrors).toEqual([]);
  });
});
