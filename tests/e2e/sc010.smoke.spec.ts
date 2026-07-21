import { test, expect } from '@playwright/test';

/**
 * Visual ground truth for SC-010: the page really renders, the form really
 * accepts input, the engine really runs, the hero result really appears.
 * Closes debt #7 — no more "code-complete but visually unverified".
 * Lit open shadow DOM is pierced recursively by Playwright CSS selectors.
 *
 * Control order follows SC-010 schema property order:
 *   selects = [country, payFrequency, ...]   numbers = [netSalary, hoursPerWeek, ...]
 */
test('SC-010: fill the form, run the numbers, see the hero result', async ({ page }) => {
  await page.goto('/calculator.html');

  await page.locator('sc-select-input select').first().selectOption('US');
  await page.locator('sc-number-input input').first().fill('3500');
  await page.locator('sc-select-input select').nth(1).selectOption('monthly');

  // auto-waits until the button becomes enabled (form valid)
  await page.locator('sc-form-renderer button').click();

  const hero = page.locator('sc-result-card .hero');
  await expect(hero).toBeVisible({ timeout: 5000 });
  await expect(hero).toContainText(/\d/);

  await expect(page.locator('sc-result-card table tr').first()).toBeVisible();
  await expect(page.locator('sc-warning-panel .w').first()).toBeVisible();
});
