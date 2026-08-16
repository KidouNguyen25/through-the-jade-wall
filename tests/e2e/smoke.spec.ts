import { test, expect } from '@playwright/test';

test.describe('Through the Jade Wall - Mahjong Sequence Gate E2E', () => {
  test('progresses from Rain Alley to East Arcade, collects Bamboo 4, and aligns Balcony Sequence Gate', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // 1. Initial Rain Alley Verification & Wait for full React/DOM readiness
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

    // 3. Verify White Tile added to first inventory slot
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

    // 12. Verify zero console errors throughout
    expect(consoleErrors).toEqual([]);
  });
});
