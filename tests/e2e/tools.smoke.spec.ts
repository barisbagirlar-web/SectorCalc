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

test('legacy calculator redirects still land on pro tools', async ({ page }) => {
  await page.goto('/calculator.html');
  await expect(page).toHaveURL(/labor-pro/);
  await page.goto('/calculator2.html');
  await expect(page).toHaveURL(/quote-pro/);
  await page.goto('/calculator3.html');
  await expect(page).toHaveURL(/weld-pro/);
  await page.goto('/calculator4.html');
  await expect(page).toHaveURL(/sc008-pro/);
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
  const toggle = page.locator('#nav-toggle');
  await expect(toggle).toBeVisible();
  await expect(page.locator('#primary-nav')).toBeHidden();
  await toggle.click();
  await expect(page.locator('#site-nav')).toHaveClass(/is-open/);
  await expect(page.locator('#primary-nav a[href="#tools"]')).toBeVisible();
  await expect(page.locator('#primary-nav a[href="/pricing.html"]')).toBeVisible();
  await page.locator('#primary-nav a[href="/pricing.html"]').click();
  await expect(page).toHaveURL(/pricing/);
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
