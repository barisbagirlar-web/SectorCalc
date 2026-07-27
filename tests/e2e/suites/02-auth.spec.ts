import { test, expect } from '@playwright/test';
import {
  attachHardErrorCollector,
  expectA11ySmoke,
  expectPageSeoBasics
} from '../helpers/regression';

/**
 * @auth @critical — Login form + guest account gate.
 */
test.describe('Authentication @auth @critical', () => {
  test('login renders email/password + submit', async ({ page }) => {
    const errors = attachHardErrorCollector(page);
    await page.goto('/login.html');
    await expectPageSeoBasics(page, { titleRe: /Sign in|SectorCalc/i });
    await expectA11ySmoke(page);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#auth-submit')).toBeVisible();
    expect(errors.hard()).toEqual([]);
  });

  test('account shows signed-out gate for guests', async ({ page }) => {
    await page.goto('/account.html');
    await expect(page.locator('#signed-out')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#signed-out a[href*="login.html"]').first()).toBeVisible();
  });
});
