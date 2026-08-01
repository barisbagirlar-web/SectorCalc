/**
 * One-shot production verification for the locked-demo report bridge.
 * This branch is intentionally not merged; the suite proves the exact live
 * customer flow after the production deployment has completed.
 */
import { test, expect } from '@playwright/test';

const tools = [
  { id: 'SC-008', path: '/calculator/tolerance-stack-up' },
  { id: 'SC-010', path: '/calculator/true-labor-cost' },
  { id: 'SC-012', path: '/calculator/quote-pricing' }
];

for (const tool of tools) {
  test(`LIVE ${tool.id} anonymous demo renders a real report @deep`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(`https://sectorcalc.com${tool.path}?live-demo-seal=${Date.now()}`, {
      waitUntil: 'domcontentloaded'
    });

    await expect(page.locator('[data-sc-study="sample"]')).toBeVisible({ timeout: 30_000 });
    await page.waitForFunction(
      () =>
        Boolean(
          (window as unknown as { __scProGate?: { isEntitled: () => boolean } }).__scProGate
        ),
      undefined,
      { timeout: 30_000 }
    );

    const entitled = await page.evaluate(
      () =>
        (window as unknown as { __scProGate?: { isEntitled: () => boolean } }).__scProGate?.isEntitled() ??
        null
    );
    expect(entitled).toBe(false);

    // SC-008 performs a synchronous Monte Carlo calculation inside the click
    // path. Schedule the real DOM click and observe the user-visible result
    // instead of making Playwright wait for the event handler to return.
    await page.evaluate(() => {
      window.setTimeout(() => {
        (document.querySelector('[data-sc-study="sample"]') as HTMLButtonElement | null)?.click();
      }, 0);
    });

    const title = page.locator('#reportArea .sc-report-title');
    await expect(title).toBeVisible({ timeout: 60_000 });
    await expect(title).toContainText(tool.id);
    await expect(page.locator('#reportArea .sc-empty')).toHaveCount(0);
  });
}