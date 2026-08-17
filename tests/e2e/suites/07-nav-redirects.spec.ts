import { test, expect } from '@playwright/test';

/**
 * @nav @critical — Legacy redirects + site chrome navigation.
 */
test.describe('Navigation & redirects @nav @critical', () => {
  test('legacy calculator*.html land on live tools', async ({ page }) => {
    await page.goto('/calculator.html');
    await expect(page).toHaveURL(/true-labor-cost|labor-pro/);
    await page.goto('/calculator2.html');
    await expect(page).toHaveURL(/quote-pricing|quote-pro/);
    await page.goto('/calculator3.html');
    await expect(page).toHaveURL(/weld-thickness|weld-pro/);
    await page.goto('/calculator4.html');
    await expect(page).toHaveURL(/cnc-feeds-speeds|machining-pro/);
  });

  test('desktop Tools nav opens catalog', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('#siteHeader')).toBeVisible();
    await page.locator('.main-nav a[href="/tools"]').click();
    await expect(page).toHaveURL(/\/tools\/?$/);
    await expect(page.locator('#q')).toBeVisible();
  });

  test('mobile hamburger opens nav links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const toggle = page.locator('#mobileMenuBtn');
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('#mobileNav')).toHaveClass(/active/);
    await expect(page.locator('#mobileNav a[href="/tools"]')).toBeVisible();
    await expect(page.locator('#mobileNav a[href="/pricing"]')).toBeVisible();
  });

  test('tools.html shared header + live catalog count', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.locator('#siteHeader')).toBeVisible();
    await expect(page.locator('#siteHeader a[href="/pricing"]')).toBeVisible();
    await expect(page.locator('#q')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/What do you need to calculate today/i);
    await expect(page.locator('#free-calculators')).toHaveCount(0);
    await expect(page.locator('#problems-we-solve')).toHaveCount(0);
    await expect(page.locator('#stLive')).not.toHaveText('0');
  });
});
