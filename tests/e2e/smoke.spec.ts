import { test, expect } from '@playwright/test';

test.describe('Through the Jade Wall - Locomotion & Progression E2E', () => {
  test('allows player to walk through Rain Alley, collect White Tile, and unlock Tea House', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // 1. Verify App Header & Initial Rain Alley State
    await expect(page.locator('.game-title')).toHaveText('THROUGH THE JADE WALL');
    await expect(page.locator('.status-badge')).toContainText('Phase 1: Rain Alley Slice');
    await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible();

    // 2. Initial state: No white tile in inventory
    const inventorySlot = page.locator('[data-testid="inventory-slot-0"]');
    await expect(inventorySlot).toBeVisible();
    await expect(inventorySlot).not.toHaveClass(/occupied/);

    // 3. Move Player Forward towards White Tile at z = -3.5 (from z = 5.0)
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2000); // 2 seconds @ 3.6m/s moves ~7.2m to z = -2.2
    await page.keyboard.up('KeyW');

    // 4. Interaction prompt should appear near White Tile
    const promptButton = page.locator('[data-testid="interaction-prompt-button"]');
    await expect(promptButton).toBeVisible({ timeout: 5000 });
    await expect(promptButton).toContainText('Pick up White Tile');

    // 5. Press 'E' key to pick up White Tile
    await page.keyboard.press('KeyE');

    // 6. Verify inventory and state update
    await expect(inventorySlot).toHaveClass(/occupied/);
    await expect(inventorySlot).toContainText('WHITE');

    // 7. Verify banner message updates
    await expect(page.locator('.narrative-banner')).toContainText('Tea House doors slide open');

    // 8. Move further forward into Tea House doorway (at z = -10.0)
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1600); // Sprint to doorway
    await page.keyboard.up('KeyW');
    await page.keyboard.up('ShiftLeft');

    // 9. If enter prompt appears, press 'E'
    const enterPrompt = page.locator('[data-testid="interaction-prompt-button"]');
    if (await enterPrompt.isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.keyboard.press('KeyE');
    }

    // 10. Verify settings modal can still open and close seamlessly
    await page.getByRole('button', { name: /Settings/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close Settings' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // 11. Verify zero fatal console errors throughout whole walkthrough
    expect(consoleErrors).toEqual([]);
  });
});
