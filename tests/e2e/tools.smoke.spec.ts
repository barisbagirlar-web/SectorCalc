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

test('tool SEO guide + engagement mounts on SC-020', async ({ page }) => {
  await page.goto('/machining-pro.html');
  await expect(page.locator('#sc-guide')).toBeVisible();
  await expect(page.locator('#sc-guide [data-sc-engage] .sc-engage')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#sc-guide [data-sc-engage]')).toContainText(/find this calculator helpful/i);
  await expect(page.locator('#sc-guide .sc-guide-grid')).toBeVisible();
  await expect(page.locator('#sc-guide .sc-guide-toc')).toBeVisible();
  await expect(page.locator('#sc-guide .sc-guide-main .sc-guide-card').first()).toBeVisible();
  await expect(page.locator('#sc-guide a[href="#taylor"], #sc-guide a[href*="taylor"]').first()).toBeVisible();
  await page.locator('.sc-engage-btn[data-panel="cite"]').click();
  await expect(page.locator('[data-pane="cite"].open')).toBeVisible();
  await expect(page.locator('[data-cite]')).toContainText(/SectorCalc/);
  // No embed control
  await expect(page.locator('.sc-engage')).not.toContainText(/Embed/i);
});

test('tool SEO guide present on SC-008', async ({ page }) => {
  await page.goto('/sc008-pro.html');
  await expect(page.locator('#sc-guide')).toBeVisible();
  await expect(page.locator('#sc-guide')).toContainText(/Tolerance Stack-Up/i);
  await expect(page.locator('#sc-guide [data-sc-engage] .sc-engage')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#sc-guide .sc-guide-grid')).toBeVisible();
  await expect(page.locator('#sc-guide .sc-guide-card').first()).toBeVisible();
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
  await expect(page.locator('#mobileNav a[href="/pricing.html"]')).toBeVisible();
  await page.locator('#mobileNav a[href="/tools.html"]').click();
  await expect(page).toHaveURL(/tools\.html/);
});

test('homepage desktop Tools nav opens catalog', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.locator('#siteHeader')).toBeVisible();
  await page.locator('.main-nav a[href="/tools.html"]').click();
  await expect(page).toHaveURL(/tools\.html/);
  await expect(page.locator('#q')).toBeVisible();
});

test('tools.html uses shared site header', async ({ page }) => {
  await page.goto('/tools.html');
  await expect(page.locator('#siteHeader')).toBeVisible();
  await expect(page.locator('#siteHeader .brand')).toBeVisible();
  await expect(page.locator('#siteHeader a[href="/tools.html"]')).toBeVisible();
  await expect(page.locator('#siteHeader a[href="/pricing.html"]')).toBeVisible();
  await expect(page.locator('#stLive')).not.toHaveText('0');
});

test('tools.html search finds CNC feeds even after category click', async ({ page }) => {
  await page.goto('/tools.html');
  await expect(page.locator('#stLive')).toHaveText('6');
  await page.locator('.tile[data-cat="costing"]').click();
  await page.locator('#q').fill('cnc');
  await expect(page.locator('#suggest')).toBeVisible();
  await expect(page.locator('#suggest')).toContainText(/CNC Feeds & Speeds/i);
  await expect(page.locator('#catalog')).toContainText(/CNC Feeds & Speeds/i);
  await expect(page.locator('a[href="/machining-pro.html"]').first()).toBeVisible();
  await expect(page.locator('#nores')).toBeHidden();
  // Typing narrows: "cnc" should not list unrelated costing tools
  await expect(page.locator('#catalog')).not.toContainText(/True Labor Cost/i);
});

test('tools.html search narrows live as query grows', async ({ page }) => {
  await page.goto('/tools.html');
  await page.locator('#q').fill('b');
  await expect(page.locator('#suggest')).toBeVisible();
  const broad = await page.locator('#suggest .sg-item').count();
  expect(broad).toBeGreaterThan(1);
  await page.locator('#q').fill('bearing');
  await expect(page.locator('#suggest')).toContainText(/Bearing Life L10/i);
  const narrow = await page.locator('#suggest .sg-item').count();
  expect(narrow).toBeLessThanOrEqual(broad);
  await expect(page.locator('#catalog .catsec')).toHaveCount(1);
});

test('discovery files are served as text/xml', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('Sitemap:');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const sm = await sitemap.text();
  expect(sm).toContain('sc008-pro.html');
  expect(sm).toContain('machining-pro.html');
  expect(sm).toContain('bearing-pro.html');
  expect(sm).toContain('tools.html');
  expect(sm).toContain('2026-07-24');
  const llms = await request.get('/llms.txt');
  expect(llms.ok()).toBeTruthy();
  const llmsText = await llms.text();
  expect(llmsText).toContain('SC-008');
  expect(llmsText).toContain('sc-form-fields.css');
  expect(llmsText).toContain('section cards');
  expect(llmsText).toContain('typeahead');
  const llm = await request.get('/llm.txt');
  expect(llm.ok()).toBeTruthy();
  const llmText = await llm.text();
  expect(llmText).toContain('SC-010');
  expect(llmText).toContain('sc-form-fields.css');
});
