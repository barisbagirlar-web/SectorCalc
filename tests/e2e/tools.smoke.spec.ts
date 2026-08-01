import { test, expect, type Page } from '@playwright/test';
import { waitForGateState, expectLockedGate } from './helpers/regression';

/**
 * @deep — Engine compute paths when unlocked; credit-lock contract when locked.
 * Structural SEO/nav/commerce coverage lives in tests/e2e/suites/*.
 */

async function runOrAssertLock(
  page: Page,
  toolId: string,
  unlocked: () => Promise<void>
): Promise<void> {
  const state = await waitForGateState(page);
  if (state === 'locked') {
    await expectLockedGate(page, toolId);
    return;
  }
  await unlocked();
}

test('SC-010 labor-pro: live + report @deep', async ({ page }) => {
  await page.goto('/labor-pro.html');
  await runOrAssertLock(page, 'SC-010', async () => {
    await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
    await page.fill('#netSalary', '3500');
    await page.locator('#netSalary').dispatchEvent('input');
    await expect(page.locator('#liveResult')).toContainText(/\d/);
    await page.locator('button[onclick="generateReport()"]').click();
    await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-010');
    await expect(
      page.locator('#reportArea .sc-chart, #reportArea .sc-pareto-row').first()
    ).toBeVisible();
  });
});

test('SC-012 quote-pro: live + report @deep', async ({ page }) => {
  await page.goto('/quote-pro.html');
  await runOrAssertLock(page, 'SC-012', async () => {
    await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
    await page.fill('#materialCost', '1500');
    await page.locator('#materialCost').dispatchEvent('input');
    await expect(page.locator('#liveResult')).toContainText(/\d/);
    await page.locator('button[onclick="generateReport()"]').click();
    await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-012');
    await expect(
      page.locator('#reportArea .sc-chart, #reportArea .sc-pareto-row').first()
    ).toBeVisible();
  });
});

test('SC-001 weld-pro: live + report @deep', async ({ page }) => {
  await page.goto('/weld-pro.html');
  // Free tool — must compute.
  const state = await waitForGateState(page);
  expect(['free-tool', 'none', 'free-config']).toContain(state);
  await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
  await page.fill('#weldLengthMm', '80');
  await page.locator('#weldLengthMm').dispatchEvent('input');
  await expect(page.locator('#liveResult')).toContainText(/\d/);
  await page.locator('button[onclick="generateReport()"]').click();
  await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-001');
  await expect(page.locator('#reportArea .sc-chart, #reportArea svg').first()).toBeVisible();
});

test('SC-008 sc008-pro: live + report @deep', async ({ page }) => {
  await page.goto('/sc008-pro.html');
  await runOrAssertLock(page, 'SC-008', async () => {
    await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 15000 });
    const tol = page.locator('#dimList input[data-f="tolerance"]').first();
    await tol.fill('0.080');
    await tol.dispatchEvent('input');
    await expect(page.locator('#liveResult')).toContainText(/\d/);
    await page.locator('#genReport').click();
    await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-008');
    await expect(page.locator('#reportArea .sc-chart, #reportArea svg').first()).toBeVisible();
  });
});

test('SC-020 machining-pro: live + audit @deep', async ({ page }) => {
  await page.goto('/machining-pro.html');
  await runOrAssertLock(page, 'SC-020', async () => {
    await page.locator('#calcBtn').click();
    await expect(page.locator('#verdict')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('#verdict')).toContainText(
      /RELEASED|CAUTION|DO NOT RUN|FAIL|ACCEPTED/i
    );
    await expect(page.locator('#kpis .kpi').first()).toBeVisible();
    await expect(page.locator('#aEngine')).toContainText('FS-ENGINE');
    await expect(page.locator('#aEngine')).toContainText(/integrity|hash/i);
  });
});

test('SC-021 bearing-pro: live + audit @deep', async ({ page }) => {
  await page.goto('/bearing-pro.html');
  await runOrAssertLock(page, 'SC-021', async () => {
    await page.locator('#calcBtn').click();
    await expect(page.locator('#verdict')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('#verdict')).toContainText(/ACCEPTED|CONDITIONALLY|REJECTED|FAIL/i);
    await expect(page.locator('#aEngine')).toContainText('BL-ENGINE');
  });
});

test('engagement mounts under form action on live tools @deep', async ({ page }) => {
  const tools = [
    { url: '/machining-pro.html', mode: 'calcBtn' },
    { url: '/bearing-pro.html', mode: 'calcBtn' },
    { url: '/sc008-pro.html', mode: 'sidebar' },
    { url: '/labor-pro.html', mode: 'sidebar' },
    { url: '/quote-pro.html', mode: 'sidebar' },
    { url: '/weld-pro.html', mode: 'sidebar' }
  ];
  for (const t of tools) {
    await page.goto(t.url);
    const formEngage = page.locator('[data-sc-engage-slot="form"] .sc-engage');
    await expect(formEngage).toBeVisible({ timeout: 8000 });
    await expect(formEngage).toContainText(/find this calculator helpful/i);
    const placed = await page.evaluate((mode) => {
      const host = document.querySelector('[data-sc-engage-slot="form"]');
      if (!host) return false;
      if (mode === 'calcBtn') {
        const btn = document.getElementById('calcBtn');
        return !!(btn && btn.nextElementSibling === host);
      }
      const ft = document.querySelector('.sc-sidebar-ft');
      return !!(ft && ft.contains(host));
    }, t.mode);
    expect(placed, `${t.url} engagement placement`).toBeTruthy();
  }
});
