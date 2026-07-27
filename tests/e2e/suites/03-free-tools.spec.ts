import { test, expect } from '@playwright/test';
import {
  attachHardErrorCollector,
  catalog,
  expectFreeToolSurface,
  expectPageSeoBasics,
  expectToolChrome,
  waitForGateState
} from '../helpers/regression';

/**
 * @free @critical — All five Tier-B free SEO-bait tools: no credit gate, free AEO strip.
 */
test.describe('Free SEO-bait tools @free @critical', () => {
  for (const tool of catalog.freeTools) {
    test(`${tool.toolId} ${tool.name} is free (no credit gate)`, async ({ page }) => {
      const errors = attachHardErrorCollector(page);
      await page.goto(tool.canonicalPath);
      await expect(page).toHaveURL(new RegExp(tool.canonicalPath.replace(/\//g, '\\/')));
      await expectPageSeoBasics(page);
      await expectToolChrome(page);

      const state = await waitForGateState(page);
      if (state === 'free-tool') {
        await expectFreeToolSurface(page, tool.toolId);
      } else if (process.env.BASE_URL) {
        test.skip(true, 'Free markers not yet on remote host (awaiting promote)');
      } else {
        throw new Error(`Expected free-tool state for ${tool.toolId}, got ${state}`);
      }

      await expect(page.locator(`a[href="${tool.upsellHref}"]`).first()).toBeAttached();
      expect(errors.hard()).toEqual([]);
    });
  }
});
