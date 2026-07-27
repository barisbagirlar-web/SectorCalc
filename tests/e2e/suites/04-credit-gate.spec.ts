import { test, expect } from '@playwright/test';
import {
  attachHardErrorCollector,
  catalog,
  expectLockedGate,
  expectPageSeoBasics,
  expectToolChrome,
  waitForGateState
} from '../helpers/regression';

/**
 * @gate @critical — Paid tools: lock CTA when monetization on, free-config when off.
 * Representative set covers CORE / PRO / ADVANCED revenue tiers.
 */
const SAMPLE_PAID = catalog.paidTools.filter((t) =>
  ['SC-008', 'SC-010', 'SC-012', 'SC-020', 'SC-021'].includes(t.id)
);

test.describe('Credit gate surface @gate @critical', () => {
  for (const tool of SAMPLE_PAID) {
    test(`${tool.id} ${tool.name} mounts paid surface`, async ({ page }) => {
      const errors = attachHardErrorCollector(page);
      await page.goto(tool.canonicalPath);
      await expect(page).toHaveURL(new RegExp(tool.canonicalPath.replace(/\//g, '\\/')));
      await expectPageSeoBasics(page);
      await expectToolChrome(page);

      const state = await waitForGateState(page);
      if (state === 'locked') {
        await expectLockedGate(page, tool.id);
      } else if (state === 'free-config' || state === 'active') {
        // CI/local without monetization OR already entitled session.
        await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toBeVisible();
        await expect(page.locator('.sc-pro-gate-kicker')).toContainText(tool.id);
      } else if (state === 'free-tool') {
        throw new Error(`${tool.id} incorrectly marked free`);
      } else {
        // Gate mount race on slow CI — paid tools must eventually mount gate (isCreditRequired).
        await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toBeVisible({
          timeout: 15_000
        });
      }
      expect(errors.hard()).toEqual([]);
    });
  }

  test('legacy sc008-pro.html redirects to canonical', async ({ page }) => {
    await page.goto('/sc008-pro.html');
    await expect(page).toHaveURL(/\/calculator\/tolerance-stack-up/);
  });
});
