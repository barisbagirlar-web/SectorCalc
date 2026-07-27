import { test, expect } from '@playwright/test';
import {
  attachHardErrorCollector,
  catalog,
  expectPageSeoBasics,
  expectToolChrome,
  waitForGateState
} from '../helpers/regression';

/**
 * @matrix — Full 25-tool load matrix from registry SSOT.
 * Each tool: canonical URL, SEO basics, guide chrome, gate/free state coherent, no hard JS errors.
 */
test.describe('Tool matrix — all calculators @matrix', () => {
  test('catalog fixture matches live registry baselines', async () => {
    expect(catalog.calculatorCount).toBe(25);
    expect(catalog.calculators).toHaveLength(25);
    expect(catalog.freeToolIds).toHaveLength(5);
    expect(catalog.paidTools).toHaveLength(20);
    expect(catalog.sitemapCount).toBe(catalog.indexableBaseline);
  });

  for (const tool of catalog.calculators) {
    test(`${tool.id} ${tool.canonicalPath} loads clean`, async ({ page }) => {
      const errors = attachHardErrorCollector(page);
      await page.goto(tool.canonicalPath);
      await expect(page).toHaveURL(new RegExp(tool.canonicalPath.replace(/\//g, '\\/')));
      await expectPageSeoBasics(page, {
        titleRe: new RegExp(
          tool.id.replace('-', '\\-') + '|SectorCalc|' + tool.name.slice(0, 12),
          'i'
        )
      });
      await expectToolChrome(page);
      await expect(page.locator('#sc-guide')).toBeVisible({ timeout: 15_000 });

      const state = await waitForGateState(page);
      if (tool.free) {
        expect(['free-tool', 'none']).toContain(state);
        if (state === 'free-tool') {
          await expect(page.locator(`aside.sc-free-aeo[data-tool-id="${tool.id}"]`)).toBeAttached();
          await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toHaveCount(0);
        } else if (!process.env.BASE_URL) {
          throw new Error(`${tool.id}: expected free-tool markers locally`);
        }
      } else {
        if (state === 'free-tool') {
          throw new Error(`${tool.id} must not show free AEO strip`);
        }
        if (state === 'locked' || state === 'free-config' || state === 'active') {
          await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toBeAttached();
          await expect(page.locator('.sc-pro-gate-kicker')).toContainText(tool.id);
        } else {
          await expect(
            page
              .locator(
                `body[data-sc-tool-id="${tool.id}"], #sc-guide[data-tool-id="${tool.id}"], [data-tool-id="${tool.id}"]`
              )
              .first()
          ).toBeAttached();
        }
      }

      expect(errors.hard()).toEqual([]);
    });
  }
});
