import { test, expect } from '@playwright/test';

/**
 * @visual — Layout regression via screenshot contracts.
 * Enabled when REGRESSION_VISUAL=1 (local or dedicated CI job).
 * Default CI skips to avoid OS font flake; layout suites cover structure.
 */
test.describe('Visual layout contracts @visual', () => {
  test.beforeEach(() => {
    test.skip(
      process.env.REGRESSION_VISUAL !== '1',
      'Set REGRESSION_VISUAL=1 to capture/compare screenshots'
    );
  });

  test('homepage chrome', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('#siteHeader')).toBeVisible();
    await expect(page).toHaveScreenshot('enterprise-homepage.png', {
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
      fullPage: false
    });
  });

  test('pricing packs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/pricing.html');
    await expect(page.locator('#packages .pack').first()).toBeVisible({ timeout: 12_000 });
    await expect(page.locator('#packages')).toHaveScreenshot('enterprise-pricing-packs.png', {
      maxDiffPixelRatio: 0.03,
      animations: 'disabled'
    });
  });
});
