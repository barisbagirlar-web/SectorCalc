import { expect, test } from '@playwright/test';

test.describe('Private calculation engine @critical', () => {
  test('SC-001 truthfully requires sign-in without credits', async ({ page }) => {
    await page.goto('/calculator/weld-thickness');
    await expect(page.locator('body')).toContainText(/sign-in required · no credits/i);
    await expect(page.locator('body')).not.toContainText(/no sign-in/i);
    await expect(page.locator('body')).not.toContainText(/runs client-side/i);
  });

  test('paid calculator provenance names the private server engine', async ({ page }) => {
    await page.goto('/calculator/tolerance-stack-up');
    await expect(page.locator('body')).toContainText(/private server engine/i);
    await expect(page.locator('body')).not.toContainText(/src\/tools\/SC-008/i);
  });
});
