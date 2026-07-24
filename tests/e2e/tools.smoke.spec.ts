import { test, expect } from '@playwright/test';

/**
 * Visual smoke against shipped *-pro calculator pages.
 * Each test: page loads, live engine updates, Generate Report shows a real report.
 */

test('SC-010 labor-pro: live + report', async ({ page }) => {
  await page.goto('/labor-pro.html');
  await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
  await page.fill('#netSalary', '3500');
  await page.locator('#netSalary').dispatchEvent('input');
  await expect(page.locator('#liveResult')).toContainText(/\d/);
  await page.locator('button.sc-btn-primary').click();
  await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-010');
  await expect(page.locator('#reportArea .sc-chart, #reportArea .sc-pareto-row').first()).toBeVisible();
});

test('SC-012 quote-pro: live + report', async ({ page }) => {
  await page.goto('/quote-pro.html');
  await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
  await page.fill('#materialCost', '1500');
  await page.locator('#materialCost').dispatchEvent('input');
  await expect(page.locator('#liveResult')).toContainText(/\d/);
  await page.locator('button.sc-btn-primary').click();
  await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-012');
  await expect(page.locator('#reportArea .sc-chart, #reportArea .sc-pareto-row').first()).toBeVisible();
});

test('SC-001 weld-pro: live + report', async ({ page }) => {
  await page.goto('/weld-pro.html');
  await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
  await page.fill('#weldLengthMm', '80');
  await page.locator('#weldLengthMm').dispatchEvent('input');
  await expect(page.locator('#liveResult')).toContainText(/\d/);
  await page.locator('button.sc-btn-primary').click();
  await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-001');
  await expect(page.locator('#reportArea .sc-chart, #reportArea svg').first()).toBeVisible();
});

test('SC-008 sc008-pro: live + report', async ({ page }) => {
  await page.goto('/sc008-pro.html');
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

test('SC-020 machining-pro: live + audit', async ({ page }) => {
  await page.goto('/machining-pro.html');
  await page.locator('#calcBtn').click();
  await expect(page.locator('#verdict')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#verdict')).toContainText(/RELEASED|CAUTION|DO NOT RUN|FAIL|ACCEPTED/i);
  await expect(page.locator('#kpis .kpi').first()).toBeVisible();
  await expect(page.locator('#aEngine')).toContainText('FS-ENGINE');
  await expect(page.locator('#aEngine')).toContainText(/integrity|hash/i);
});

test('SC-021 bearing-pro: live + audit', async ({ page }) => {
  await page.goto('/bearing-pro.html');
  await page.locator('#calcBtn').click();
  await expect(page.locator('#verdict')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#verdict')).toContainText(/ACCEPTED|CONDITIONALLY|REJECTED|FAIL/i);
  await expect(page.locator('#kpis .kpi').first()).toBeVisible();
  await expect(page.locator('#aEngine')).toContainText('BL-ENGINE');
});

test('tools catalog: omni search + live links', async ({ page }) => {
  await page.goto('/tools.html');
  await expect(page.locator('#q')).toBeVisible();
  await expect(page.locator('#stLive')).not.toHaveText('0');
  await page.locator('#q').fill('bearing');
  await expect(page.locator('#catalog')).toContainText(/Bearing Life/i);
  await expect(page.locator('a[href="/bearing-pro.html"]').first()).toBeVisible();
  await expect(page.locator('a[href="/machining-pro.html"]').first()).toBeVisible();
});

test('legacy calculator redirects still land on pro tools', async ({ page }) => {
  await page.goto('/calculator.html');
  await expect(page).toHaveURL(/labor-pro/);
  await page.goto('/calculator2.html');
  await expect(page).toHaveURL(/quote-pro/);
  await page.goto('/calculator3.html');
  await expect(page).toHaveURL(/weld-pro/);
  await page.goto('/calculator4.html');
  await expect(page).toHaveURL(/machining-pro/);
});

test('pricing page renders packages from source of truth', async ({ page }) => {
  await page.goto('/pricing.html');
  await expect(page.locator('#packages .pack')).toHaveCount(5, { timeout: 8000 });
  await expect(page.locator('#packages .pack.pop, #packages .pack.featured').first()).toBeVisible();
  await page.locator('#packages button.load').first().click();
  await expect(page.locator('#pay-status')).toContainText(/Checkout is not live yet/i);
});

test('homepage mobile nav hamburger opens links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('#mobileMenuBtn');
  await expect(toggle).toBeVisible();
  await expect(page.locator('#mobileNav')).toHaveAttribute('aria-hidden', 'true');
  await toggle.click();
  await expect(page.locator('#mobileNav')).toHaveClass(/active/);
  await expect(page.locator('#mobileNav')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#mobileNav a[href="/tools.html"]')).toBeVisible();
  await expect(page.locator('#mobileNav a[href="#decide"]')).toBeVisible();
  await expect(page.locator('#mobileNav a[href="/pricing.html"]')).toBeVisible();
  await page.locator('#mobileNav a[href="/tools.html"]').click();
  await expect(page).toHaveURL(/tools\.html/);
});

test('homepage desktop Tools nav opens catalog', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.locator('.main-nav a[href="/tools.html"]').click();
  await expect(page).toHaveURL(/tools\.html/);
  await expect(page.locator('#q')).toBeVisible();
});

test('discovery files are served as text/xml', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('Sitemap:');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('sc008-pro.html');
  const llms = await request.get('/llms.txt');
  expect(llms.ok()).toBeTruthy();
  expect(await llms.text()).toContain('SC-008');
  const llm = await request.get('/llm.txt');
  expect(llm.ok()).toBeTruthy();
  expect(await llm.text()).toContain('SC-010');
});
