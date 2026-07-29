import { test, expect } from '@playwright/test';

/**
 * Browser-level closure for ADV-F1 (share XSS) and ADV-F3 (unit SSOT).
 * Runs against local preview / deploy preview baseURL.
 */
test('SC-008 share XSS payload does not execute @deep', async ({ page }) => {
  const payload = 'Spacer"><img src=x onerror="window.__xssFired=1">';
  const state = {
    specUpper: '0.150',
    specLower: '-0.150',
    cpkTarget: '1.33',
    seed: '12345',
    unit: 'mm',
    dims: [{ name: payload, nominal: 25, tol: 0.05, dist: 'normal' }]
  };
  // Intentionally omit &h= → load path must still escape (and may warn tampered).
  const s = encodeURIComponent(JSON.stringify(state));
  page.on('dialog', async (d) => {
    await d.accept();
  });
  await page.goto(`/calculator/tolerance-stack-up?s=${s}`);
  await expect(page).toHaveURL(/\/calculator\/tolerance-stack-up/);
  await page.waitForTimeout(800);
  const fired = await page.evaluate(
    () => (window as unknown as { __xssFired?: number }).__xssFired
  );
  expect(fired).toBeUndefined();
  await expect(page.locator('#dimList img')).toHaveCount(0);
  await expect(page.locator('#dimList input[data-f="name"]').first()).toHaveValue(payload);
});

test('SC-008 legacy share redirect preserves query @deep', async ({ page }) => {
  const state = {
    specUpper: '0.150',
    specLower: '-0.150',
    cpkTarget: '1.33',
    seed: '12345',
    unit: 'mm',
    dims: [{ name: 'LegacyShareDim', nominal: 12, tol: 0.02, dist: 'normal' }]
  };
  const s = encodeURIComponent(JSON.stringify(state));
  page.on('dialog', async (d) => {
    await d.accept();
  });
  await page.goto(`/sc008-pro.html?s=${s}`);
  await expect(page).toHaveURL(/\/calculator\/tolerance-stack-up\?s=/);
  await expect(page.locator('#dimList input[data-f="name"]').first()).toHaveValue('LegacyShareDim');
});

test('SC-008 unit toggle preserves mm SSOT identity @deep', async ({ page }) => {
  await page.goto('/calculator/tolerance-stack-up');
  await expect(page.locator('#dimList input[data-f="nominal"]').first()).toBeVisible({
    timeout: 15000
  });
  const mmNom = await page.locator('#dimList input[data-f="nominal"]').first().inputValue();
  await page.locator('#unitSpec').selectOption('inch');
  await page.waitForTimeout(250);
  await page.locator('#unitSpec').selectOption('mm');
  await page.waitForTimeout(250);
  const back = await page.locator('#dimList input[data-f="nominal"]').first().inputValue();
  expect(Number(back)).toBeCloseTo(Number(mmNom), 4);
});
