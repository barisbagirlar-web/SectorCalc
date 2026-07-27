import { test, expect } from '@playwright/test';
import {
  attachHardErrorCollector,
  catalog,
  expectA11ySmoke,
  expectPageSeoBasics
} from '../helpers/regression';

/**
 * @commerce @critical — Pricing SSOT, auth-gated checkout, package contracts.
 */
test.describe('Commerce — pricing & checkout @commerce @critical', () => {
  test('pricing hub SEO + a11y + 4 one-time packs', async ({ page }) => {
    const errors = attachHardErrorCollector(page);
    await page.goto('/pricing.html');
    await expectPageSeoBasics(page, { titleRe: /credit|pricing|SectorCalc/i });
    await expectA11ySmoke(page);
    await expect(page.locator('#packages .pack')).toHaveCount(4, { timeout: 15_000 });
    await expect(page.locator('#packages')).toContainText(/ONE-TIME|one-time/i);
    await expect(page.locator('#packages')).toContainText(/USD|CREDIT|credits/i);
    for (const key of ['STARTER', 'WORKSHOP', 'PROFESSIONAL', 'TEAM_WALLET']) {
      await expect(page.locator(`#packages #${key}, #packages .pack#${key}`).first()).toBeVisible();
    }
    await expect(
      page.getByRole('link', { name: /Commission credits|Get credits/i }).first()
    ).toBeVisible();
    expect(errors.hard()).toEqual([]);
  });

  test('unsigned pack load routes to login with next=', async ({ page }) => {
    await page.goto('/pricing.html');
    await expect(page.locator('#packages button.load').first()).toBeVisible({ timeout: 15_000 });
    await Promise.all([
      page.waitForURL(/\/login\.html(?:\?|$)/, { timeout: 12_000 }),
      page.locator('#packages button.load').first().click()
    ]);
    await expect(page).toHaveURL(/login\.html/);
    await expect(page).toHaveURL(/next=/);
  });

  test('homepage credit packs match catalog tool count claim', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/SectorCalc/i);
    // Home must not claim all 25 tools are free.
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/all\s+25\s+tools\s+are\s+free/i);
    expect(catalog.calculatorCount).toBe(25);
    expect(catalog.freeToolIds.length).toBe(5);
  });
});
