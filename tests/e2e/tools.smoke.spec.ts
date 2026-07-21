import { test, expect } from '@playwright/test';

/**
 * Milestone visual smoke: every shipped tool really renders, accepts input,
 * runs the engine, and shows its hero result in a real browser.
 * One file, one test per tool — adding a tool later = one test appended here.
 * Lit open shadow DOM is pierced recursively by Playwright CSS selectors.
 * Fill order matches each schema's property order (deterministic).
 */

test('SC-010: form -> engine -> hero', async ({ page }) => {
  await page.goto('/calculator.html');
  await page.locator('sc-select-input select').first().selectOption('US');
  await page.locator('sc-number-input input').first().fill('3500');
  await page.locator('sc-select-input select').nth(1).selectOption('monthly');
  await page.locator('sc-form-renderer button').click();
  const hero = page.locator('sc-result-card .hero');
  await expect(hero).toBeVisible({ timeout: 5000 });
  await expect(hero).toContainText(/\d/);
  await expect(page.locator('sc-result-card table tr').first()).toBeVisible();
  await expect(page.locator('sc-warning-panel .w').first()).toBeVisible();
});

test('SC-012: form -> engine -> hero', async ({ page }) => {
  await page.goto('/calculator2.html');
  // Schema property order (number inputs): materialCost, scrapRate, laborHours,
  // laborHourlyCost, machineHours, machineHourlyCost, then optional costs,
  // then targetMargin (14), quantity (15). Required = first 6 + 14 + 15.
  const required: Array<[number, string]> = [
    [0, '1000'], [1, '0.1'], [2, '5'], [3, '40'], [4, '3'], [5, '60'],
    [14, '0.2'], [15, '10']
  ];
  const inputs = page.locator('sc-number-input input');
  for (const [i, v] of required) {
    await inputs.nth(i).fill(v);
  }
  await page.locator('sc-form-renderer button').click();
  const hero = page.locator('sc-quote-result .hero');
  await expect(hero).toBeVisible({ timeout: 5000 });
  await expect(hero).toContainText(/\d/);
  await expect(page.locator('sc-quote-result table tr').first()).toBeVisible();
});

test('SC-001: form -> engine -> hero', async ({ page }) => {
  await page.goto('/calculator3.html');
  // required numbers in schema order: designLoadN, weldLengthMm, weldStrengthMpa,
  // safetyFactor, materialThicknessMm (jointType enum is optional, left default)
  const values = ['50000', '200', '480', '2', '10'];
  const inputs = page.locator('sc-number-input input');
  for (let i = 0; i < values.length; i++) {
    await inputs.nth(i).fill(values[i]!);
  }
  await page.locator('sc-form-renderer button').click();
  const hero = page.locator('sc-weld-result .hero');
  await expect(hero).toBeVisible({ timeout: 5000 });
  await expect(hero).toContainText(/\d/);
  await expect(page.locator('sc-weld-result .bar > span')).toBeVisible();
});
