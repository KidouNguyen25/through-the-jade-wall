import { Page, Locator, expect } from '@playwright/test';

/**
 * Setup console error listening. Returns an array that collects fatal runtime console errors.
 */
export function setupConsoleErrorListener(page: Page): string[] {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  return consoleErrors;
}

/**
 * Clear local/session storage and reload to ensure a pristine session state.
 */
export async function clearStorageAndReload(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await expect(page.locator('[data-testid="game-canvas-container"]')).toBeVisible({
    timeout: 10000,
  });
  await page.locator('body').focus();
  await page.waitForTimeout(500);
}

/**
 * Focus the game interactive context (body element) for keyboard input.
 */
export async function focusGame(page: Page): Promise<void> {
  await page.locator('body').focus();
}

/**
 * Perform a physical movement keystroke by holding a key for a specified duration in milliseconds.
 */
export async function holdKey(page: Page, key: string, durationMs: number): Promise<void> {
  await page.keyboard.down(key);
  await page.waitForTimeout(durationMs);
  await page.keyboard.up(key);
}

/**
 * Perform a sprint movement keystroke by holding ShiftLeft while holding the movement key.
 */
export async function sprintMove(page: Page, key: string, durationMs: number): Promise<void> {
  await page.keyboard.down('ShiftLeft');
  await page.keyboard.down(key);
  await page.waitForTimeout(durationMs);
  await page.keyboard.up(key);
  await page.keyboard.up('ShiftLeft');
}

/**
 * Wait for the on-screen 3D interaction prompt to appear, optionally verify its prompt text,
 * and click it using force: true to bypass CSS pulsing micro-animations.
 */
export async function interactWithPrompt(
  page: Page,
  expectedPromptText?: string | RegExp,
  timeoutMs: number = 8000,
): Promise<Locator> {
  const promptButton = page.locator('[data-testid="interaction-prompt-button"]');
  await expect(promptButton).toBeVisible({ timeout: timeoutMs });
  if (expectedPromptText) {
    if (typeof expectedPromptText === 'string') {
      await expect(promptButton).toContainText(expectedPromptText);
    } else {
      await expect(promptButton).toHaveText(expectedPromptText);
    }
  }
  await promptButton.click({ force: true });
  return promptButton;
}

/**
 * Deterministically advance active narrative dialogue nodes.
 */
export async function advanceDialogue(
  page: Page,
  nodeCount: number = 1,
  expectCloseAfter: boolean = false,
): Promise<void> {
  const continueBtn = page.locator('[data-testid="dialogue-continue-btn"]');
  const dialogueCard = page.locator('[data-testid="dialogue-card"]');

  for (let i = 0; i < nodeCount; i++) {
    await expect(continueBtn).toBeVisible({ timeout: 5000 });
    await continueBtn.click();
  }

  if (expectCloseAfter) {
    await expect(dialogueCard).not.toBeVisible({ timeout: 3000 });
  }
}

/**
 * Select a specific branching dialogue choice button by zero-based index.
 */
export async function selectDialogueChoice(page: Page, choiceIndex: number = 0): Promise<void> {
  const choiceBtn = page.locator(`[data-testid="dialogue-choice-${choiceIndex}"]`);
  await expect(choiceBtn).toBeVisible({ timeout: 5000 });
  await choiceBtn.click();
}

/**
 * Select an inventory slot via keyboard Digit shortcut (Digit1..Digit4 for slots 0..3).
 */
export async function selectInventorySlot(page: Page, slotIndex: number): Promise<void> {
  const digitKey = `Digit${slotIndex + 1}`;
  await page.keyboard.press(digitKey);
}

/**
 * Assert inventory slot state (occupied, empty, or specific tile abbreviation).
 */
export async function expectInventorySlot(
  page: Page,
  slotIndex: number,
  tileAbbrev?: string | RegExp,
  isOccupied: boolean = true,
): Promise<Locator> {
  const slot = page.locator(`[data-testid="inventory-slot-${slotIndex}"]`);
  await expect(slot).toBeVisible({ timeout: 5000 });
  if (isOccupied) {
    await expect(slot).toHaveClass(/occupied/);
    if (tileAbbrev) {
      if (typeof tileAbbrev === 'string') {
        await expect(slot).toContainText(tileAbbrev);
      } else {
        await expect(slot).toHaveText(tileAbbrev);
      }
    }
  } else {
    await expect(slot).not.toHaveClass(/occupied/);
  }
  return slot;
}

/**
 * Assert current scene subtitle and optional status badge text.
 */
export async function expectScene(
  page: Page,
  expectedSubtitle?: string,
  expectedStatusBadge?: string,
): Promise<void> {
  if (expectedSubtitle) {
    await expect(page.locator('.game-subtitle')).toContainText(expectedSubtitle, {
      timeout: 6000,
    });
  }
  if (expectedStatusBadge) {
    await expect(page.locator('.status-badge')).toContainText(expectedStatusBadge, {
      timeout: 6000,
    });
  }
}
