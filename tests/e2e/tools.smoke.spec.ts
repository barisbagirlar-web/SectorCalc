import { test, expect, Page } from '@playwright/test';

const SHARED_TOOLS = [
  ['SC-001','/weld-pro.html'],['SC-010','/labor-pro.html'],['SC-012','/quote-pro.html'],
  ['SC-020','/machining-pro.html'],['SC-021','/bearing-pro.html'],['SC-022','/tap-thread-pro.html'],
  ['SC-023','/cycle-cost-pro.html'],['SC-024','/bearing-freq-pro.html'],['SC-025','/belt-chain-pro.html'],
  ['SC-026','/shaft-pro.html'],['SC-027','/fits-pro.html'],['SC-028','/surface-finish-pro.html'],
  ['SC-029','/heat-input-pro.html'],['SC-030','/bend-pro.html'],['SC-031','/sling-pro.html'],
  ['SC-032','/shackle-eyebolt-pro.html'],['SC-033','/pressure-vessel-pro.html'],['SC-034','/pipe-wall-pro.html'],
  ['SC-035','/bolt-pro.html'],['SC-036','/bolted-joint-pro.html'],['SC-037','/oee-pro.html'],
  ['SC-038','/machine-rate-pro.html'],['SC-039','/punching-pro.html'],['SC-040','/hydraulic-pro.html']
] as const;

async function expectSharedRuntime(page: Page, code: string, url: string) {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  await page.goto(url);
  await expect(page.locator('#toolCode')).toHaveText(code, { timeout: 10000 });
  await expect(page.locator('#verdict')).toContainText(/ACCEPTED|CONDITIONAL/i, { timeout: 10000 });
  await expect(page.locator('#resultTable tbody tr').first()).toBeVisible();
  await expect(page.locator('#auditEngine')).toContainText(code);
  await expect(page.locator('#auditEngine')).toContainText(/Input hash/i);
  await expect(page.locator('#auditInputs')).toBeVisible();
  await expect(page.locator('#auditFormulas')).toBeAttached();
  await expect(page.locator('#auditAssumptions')).toBeAttached();
  await expect(page.locator('#auditWarnings')).toBeVisible();
  expect(pageErrors, `${code} page errors`).toEqual([]);
}

test('24 shared calculators mount the unified Decimal + A1-A5 production contract', async ({ page }) => {
  for (const [code,url] of SHARED_TOOLS) {
    await expectSharedRuntime(page,code,url);
  }
});

test('SC-010 live input updates engine-owned results and audit', async ({ page }) => {
  await page.goto('/labor-pro.html');
  await page.fill('#netSalary','3500');
  await page.locator('#netSalary').dispatchEvent('input');
  await expect(page.locator('#resultTable')).toContainText(/True monthly employer cost/i);
  await expect(page.locator('#auditEngine')).toContainText('SC010-DECIMAL');
  await expect(page.locator('#auditInputs')).toContainText('3500');
});

test('SC-012 quote uses unified report contract and canonical scrap input', async ({ page }) => {
  await page.goto('/quote-pro.html');
  await page.fill('#material','1500');
  await page.locator('#material').dispatchEvent('input');
  await expect(page.locator('#resultTable')).toContainText(/Total sell price/i);
  await expect(page.locator('#resultTable')).toContainText(/Effective material after scrap/i);
  await expect(page.locator('#auditFormulas')).toContainText(/material\/(1−scrap)/i);
  await expect(page.locator('#auditEngine')).toContainText('SC012-DECIMAL');
});

test('SC-001 weld input updates unified engine output', async ({ page }) => {
  await page.goto('/weld-pro.html');
  await page.fill('#length','80');
  await page.locator('#length').dispatchEvent('input');
  await expect(page.locator('#resultTable')).toContainText(/Required final weld leg/i);
  await expect(page.locator('#auditEngine')).toContainText('SC001-DECIMAL');
});

test('SC-008 retains dedicated deterministic Monte Carlo UX', async ({ page }) => {
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

test('SC-020 guide and engagement mount directly under unified CALCULATE & AUDIT', async ({ page }) => {
  await page.goto('/machining-pro.html');
  await expect(page.locator('#sc-guide')).toBeVisible();
  const formEngage = page.locator('[data-sc-engage-slot="form"] .sc-engage');
  await expect(formEngage).toBeVisible({ timeout: 5000 });
  await expect(formEngage).toContainText(/find this calculator helpful/i);
  const afterBtn = await page.evaluate(() => {
    const btn = document.getElementById('calcBtn');
    const host = document.querySelector('[data-sc-engage-slot="form"]');
    return !!(btn && host && btn.nextElementSibling === host);
  });
  expect(afterBtn).toBeTruthy();
  await expect(page.locator('#sc-guide .sc-guide-grid')).toBeVisible();
  await expect(page.locator('#sc-guide .sc-guide-toc')).toBeVisible();
  await expect(page.locator('#sc-guide .sc-guide-main .sc-guide-card').first()).toBeVisible();
  await page.locator('[data-sc-engage-slot="form"] .sc-engage-btn[data-panel="cite"]').click();
  await expect(page.locator('[data-sc-engage-slot="form"] [data-pane="cite"].open')).toBeVisible();
  await expect(page.locator('[data-sc-engage-slot="form"] [data-cite]')).toContainText(/SectorCalc/);
});

test('SC-008 guide engagement remains in custom sidebar', async ({ page }) => {
  await page.goto('/sc008-pro.html');
  await expect(page.locator('#sc-guide')).toBeVisible();
  await expect(page.locator('[data-sc-engage-slot="form"] .sc-engage')).toBeVisible({ timeout: 5000 });
  const placed = await page.evaluate(() => {
    const host = document.querySelector('[data-sc-engage-slot="form"]');
    const ft = document.querySelector('.sc-sidebar-ft');
    return !!(host && ft && ft.contains(host));
  });
  expect(placed).toBeTruthy();
});

test('legacy calculator redirects still land on canonical pro tools', async ({ page }) => {
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

test('homepage mobile nav hamburger opens tools and pricing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('#mobileMenuBtn');
  await expect(toggle).toBeVisible();
  await expect(page.locator('#mobileNav')).toHaveAttribute('aria-hidden','true');
  await toggle.click();
  await expect(page.locator('#mobileNav')).toHaveClass(/active/);
  await expect(page.locator('#mobileNav')).toHaveAttribute('aria-hidden','false');
  await expect(page.locator('#mobileNav a[href="/tools.html"]')).toBeVisible();
  await expect(page.locator('#mobileNav a[href="/pricing.html"]')).toBeVisible();
});

test('homepage desktop Tools nav opens catalog', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.locator('#siteHeader')).toBeVisible();
  await page.locator('.main-nav a[href="/tools.html"]').click();
  await expect(page).toHaveURL(/tools\.html/);
  await expect(page.locator('#q')).toBeVisible();
});

test('tools catalog is 25 live / 0 planned and search survives category state', async ({ page }) => {
  await page.goto('/tools.html');
  await expect(page.locator('#siteHeader')).toBeVisible();
  await expect(page.locator('#stLive')).toHaveText('25');
  await expect(page.locator('body')).not.toContainText(/In pipeline|Planned tools/i);
  await page.locator('.tile[data-cat="costing"]').click();
  await page.locator('#q').fill('cnc');
  await expect(page.locator('#suggest')).toBeVisible();
  await expect(page.locator('#suggest')).toContainText(/CNC Feeds & Speeds/i);
  await expect(page.locator('#catalog')).toContainText(/CNC Feeds & Speeds/i);
  await expect(page.locator('a[href="/machining-pro.html"]').first()).toBeVisible();
  await expect(page.locator('#catalog')).not.toContainText(/True Labor Cost/i);
});

test('tools search narrows live as query grows', async ({ page }) => {
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

test('discovery files expose unified architecture and all-live catalog', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('Sitemap:');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const sm = await sitemap.text();
  for (const [,url] of SHARED_TOOLS) expect(sm).toContain(url.slice(1));
  expect(sm).toContain('sc008-pro.html');
  expect(sm).toContain('tools.html');
  expect(sm).toContain('2026-07-24');

  const llms = await request.get('/llms.txt');
  expect(llms.ok()).toBeTruthy();
  const llmsText = await llms.text();
  expect(llmsText).toContain('24 calculators use the schema-driven Decimal.js industrial runtime');
  expect(llmsText).toContain('A1-A5 Audit/Review');
  expect(llmsText).toContain('25 live, 0 planned');
  expect(llmsText).toContain('SC-008 Tolerance Stack-Up');

  const llm = await request.get('/llm.txt');
  expect(llm.ok()).toBeTruthy();
  const llmText = await llm.text();
  expect(llmText).toContain('SC-010 True Labor Cost');
  expect(llmText).toContain('SC-040 Hydraulic Cylinder Sizing');
  expect(llmText).toContain('deterministic input hash');
});
