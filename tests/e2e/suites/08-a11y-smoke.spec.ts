import { test } from '@playwright/test';
import { catalog, expectA11ySmoke, expectPageSeoBasics } from '../helpers/regression';

/**
 * @a11y — Accessibility smoke across hubs + free + paid samples.
 */
test.describe('Accessibility smoke @a11y', () => {
  const samples = [
    '/',
    '/tools.html',
    '/pricing.html',
    '/login.html',
    ...catalog.freeTools.slice(0, 2).map((t) => t.canonicalPath),
    ...catalog.paidTools.slice(0, 2).map((t) => t.canonicalPath)
  ];

  for (const path of samples) {
    test(`a11y contracts: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expectPageSeoBasics(page);
      await expectA11ySmoke(page);
    });
  }
});
