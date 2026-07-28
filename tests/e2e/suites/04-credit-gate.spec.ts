import { test, expect } from '@playwright/test';
import {
  attachHardErrorCollector,
  catalog,
  expectDemoLockedWorkspace,
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

test.describe('Tier-A demo lock @gate @critical', () => {
  test('SC-020 locked workspace blocks Reset and custom edits', async ({ page }) => {
    const tool = catalog.paidTools.find((t) => t.id === 'SC-020');
    if (!tool) throw new Error('SC-020 missing from catalog');
    await page.goto(tool.canonicalPath);
    const state = await waitForGateState(page);
    test.skip(state !== 'locked', `monetization not enforced here (state=${state})`);

    await expectLockedGate(page, 'SC-020');
    await expectDemoLockedWorkspace(page);

    // Reset must stay disabled / no-op
    const reset = page.locator('[data-sc-study="blank"]');
    await expect(reset).toBeDisabled();

    // Force-edit attempt: strip readonly and type — must revert to demo
    const probe = page.locator('input[data-sc-gate-lock="1"]').first();
    await expect(probe).toBeAttached();
    const before = await probe.inputValue();
    await probe.evaluate((el: HTMLInputElement) => {
      el.readOnly = false;
      el.removeAttribute('readonly');
      el.value = '99999';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect.poll(async () => probe.inputValue()).toBe(before);
    await expect(page.locator('body')).toHaveClass(/sc-demo-locked/);
  });

  test('free tool keeps Reset enabled (no Tier-A lock)', async ({ page }) => {
    const tool = catalog.freeTools.find((t) => t.toolId === 'SC-028');
    if (!tool) throw new Error('SC-028 missing from catalog');
    await page.goto(tool.canonicalPath);
    await expect(page.locator('[data-sc-study="blank"]')).toBeEnabled({ timeout: 15_000 });
    await expect(page.locator('body.sc-demo-locked')).toHaveCount(0);
    await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toHaveCount(0);
  });
});
