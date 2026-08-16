import { test, expect } from '@playwright/test';

test.describe('Through the Jade Wall - Smoke Test', () => {
  test('renders application header, canvas container, and status bar without errors', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Check header and title
    await expect(page.locator('.game-title')).toHaveText('THROUGH THE JADE WALL');
    await expect(page.locator('.status-badge')).toContainText('Phase 0: Industrial Bootstrap');

    // Check canvas container presence
    const canvasContainer = page.locator('[data-testid="game-canvas-container"]');
    await expect(canvasContainer).toBeVisible();

    // Verify settings modal interaction
    await page.getByRole('button', { name: /Settings/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /System Configuration/i })).toBeVisible();

    // Close settings modal
    await page.getByRole('button', { name: 'Close Settings' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Verify no fatal console errors occurred
    expect(consoleErrors).toEqual([]);
  });
});
