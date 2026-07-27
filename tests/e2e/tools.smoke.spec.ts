import { test, expect, type Page } from '@playwright/test';

/**
 * Visual smoke against shipped calculator pages.
 * Credit monetization may lock compute for guests — assert gate OR live engine.
 */

async function creditGateLocked(page: Page): Promise<boolean> {
  const gate = page.locator('#sc-pro-gate-root .sc-pro-gate, #sc-pro-gate-root');
  await gate.first().waitFor({ state: 'attached', timeout: 12_000 }).catch(() => null);
  if (!(await page.locator('#sc-pro-gate-root .sc-pro-gate').isVisible().catch(() => false))) {
    return false;
  }
  if (
    await page
      .locator('.sc-pro-gate-active')
      .isVisible()
      .catch(() => false)
  )
    return false;
  return true;
}

async function expectGateSurface(page: Page, toolId: string): Promise<void> {
  const gate = page.locator('#sc-pro-gate-root .sc-pro-gate');
  await expect(gate).toBeVisible({ timeout: 15_000 });
  await expect(gate).toContainText(new RegExp(toolId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

test('SC-010 labor-pro: live + report (or credit gate)', async ({ page }) => {
  await page.goto('/labor-pro.html');
  if (await creditGateLocked(page)) {
    await expectGateSurface(page, 'SC-010');
    return;
  }
  await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
  await page.fill('#netSalary', '3500');
  await page.locator('#netSalary').dispatchEvent('input');
  await expect(page.locator('#liveResult')).toContainText(/\d/);
  await page.locator('button.sc-btn-primary').click();
  await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-010');
  await expect(
    page.locator('#reportArea .sc-chart, #reportArea .sc-pareto-row').first()
  ).toBeVisible();
});

test('SC-012 quote-pro: live + report (or credit gate)', async ({ page }) => {
  await page.goto('/quote-pro.html');
  if (await creditGateLocked(page)) {
    await expectGateSurface(page, 'SC-012');
    return;
  }
  await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
  await page.fill('#materialCost', '1500');
  await page.locator('#materialCost').dispatchEvent('input');
  await expect(page.locator('#liveResult')).toContainText(/\d/);
  await page.locator('button.sc-btn-primary').click();
  await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-012');
  await expect(
    page.locator('#reportArea .sc-chart, #reportArea .sc-pareto-row').first()
  ).toBeVisible();
});

test('SC-001 weld-pro: live + report (or credit gate)', async ({ page }) => {
  await page.goto('/weld-pro.html');
  if (await creditGateLocked(page)) {
    await expectGateSurface(page, 'SC-001');
    return;
  }
  await expect(page.locator('#liveResult')).not.toHaveText('—', { timeout: 8000 });
  await page.fill('#weldLengthMm', '80');
  await page.locator('#weldLengthMm').dispatchEvent('input');
  await expect(page.locator('#liveResult')).toContainText(/\d/);
  await page.locator('button.sc-btn-primary').click();
  await expect(page.locator('#reportArea .sc-report-title')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#reportArea .sc-report-title')).toContainText('SC-001');
  await expect(page.locator('#reportArea .sc-chart, #reportArea svg').first()).toBeVisible();
});

test('SC-008 sc008-pro: live + report (or credit gate)', async ({ page }) => {
  await page.goto('/sc008-pro.html');
  if (await creditGateLocked(page)) {
    await expectGateSurface(page, 'SC-008');
    return;
  }
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

test('SC-020 machining-pro: live + audit (or credit gate)', async ({ page }) => {
  await page.goto('/machining-pro.html');
  if (await creditGateLocked(page)) {
    await expectGateSurface(page, 'SC-020');
    return;
  }
  await page.locator('#calcBtn').click();
  await expect(page.locator('#verdict')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#verdict')).toContainText(
    /RELEASED|CAUTION|DO NOT RUN|FAIL|ACCEPTED/i
  );
  await expect(page.locator('#kpis .kpi').first()).toBeVisible();
  await expect(page.locator('#aEngine')).toContainText('FS-ENGINE');
  await expect(page.locator('#aEngine')).toContainText(/integrity|hash/i);
});

test('SC-021 bearing-pro: live + audit (or credit gate)', async ({ page }) => {
  await page.goto('/bearing-pro.html');
  if (await creditGateLocked(page)) {
    await expectGateSurface(page, 'SC-021');
    return;
  }
  await page.locator('#calcBtn').click();
  await expect(page.locator('#verdict')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('#verdict')).toContainText(/ACCEPTED|CONDITIONALLY|REJECTED|FAIL/i);
  await expect(page.locator('#aEngine')).toContainText('BL-ENGINE');
});

test('tool SEO guide + engagement mounts on SC-020', async ({ page }) => {
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
  await expect(
    page.locator('#sc-guide a[href="#taylor"], #sc-guide a[href*="taylor"]').first()
  ).toBeVisible();
  await page.locator('[data-sc-engage-slot="form"] .sc-engage-btn[data-panel="cite"]').click();
  await expect(page.locator('[data-sc-engage-slot="form"] [data-pane="cite"].open')).toBeVisible();
  await expect(page.locator('[data-sc-engage-slot="form"] [data-cite]')).toContainText(
    /SectorCalc/
  );
  await expect(formEngage).not.toContainText(/Embed/i);
});

test('tool SEO guide present on SC-008', async ({ page }) => {
  await page.goto('/sc008-pro.html');
  await expect(page.locator('#sc-guide')).toBeVisible();
  await expect(page.locator('#sc-guide')).toContainText(/Tolerance Stack-Up/i);
  await expect(page.locator('[data-sc-engage-slot="form"] .sc-engage')).toBeVisible({
    timeout: 5000
  });
  await expect(page.locator('#sc-guide .sc-guide-grid')).toBeVisible();
  await expect(page.locator('#sc-guide .sc-guide-card').first()).toBeVisible();
});

test('legacy calculator redirects still land on live tools', async ({ page }) => {
  // Local meta-refresh → *-pro.html; Firebase/Vite parity → /calculator/<slug>
  await page.goto('/calculator.html');
  await expect(page).toHaveURL(/true-labor-cost|labor-pro/);
  await page.goto('/calculator2.html');
  await expect(page).toHaveURL(/quote-pricing|quote-pro/);
  await page.goto('/calculator3.html');
  await expect(page).toHaveURL(/weld-thickness|weld-pro/);
  await page.goto('/calculator4.html');
  await expect(page).toHaveURL(/cnc-feeds-speeds|machining-pro/);
});

test('pricing page renders packages from source of truth', async ({ page }) => {
  await page.goto('/pricing.html');
  await expect(page.locator('#packages .pack')).toHaveCount(4, { timeout: 8000 });
  await expect(page.locator('#packages .pack.pop, #packages .pack.featured').first()).toBeVisible();
  await expect(page.locator('#packages')).toContainText(/ONE-TIME|one-time|No subscription/i);
  // Signed-out users must authenticate before server-prepared checkout.
  await Promise.all([
    page.waitForURL(/\/login\.html(?:\?|$)/, { timeout: 8000 }),
    page.locator('#packages button.load').first().click()
  ]);
  await expect(page).toHaveURL(/login\.html/);
  await expect(page).toHaveURL(/next=/);
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
  await expect(page.locator('#stLive')).toHaveText('25');
  await page.locator('.tile[data-cat="costing"]').click();
  await page.locator('#q').fill('cnc');
  await expect(page.locator('#suggest')).toBeVisible();
  await expect(page.locator('#suggest')).toContainText(/CNC Feeds & Speeds/i);
  await expect(page.locator('#catalog')).toContainText(/CNC Feeds & Speeds/i);
  await expect(page.locator('a[href="/calculator/cnc-feeds-speeds"]').first()).toBeVisible();
  await expect(page.locator('#nores')).toBeHidden();
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

test('engagement mounts under form action on every live tool', async ({ page }) => {
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
    await expect(formEngage).toBeVisible({ timeout: 5000 });
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

test('discovery surface matches canonical SEO release policy', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  const robotsText = await robots.text();
  expect(robotsText).toContain('Sitemap: https://sectorcalc.com/sitemap.xml');
  expect(robotsText).toMatch(/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i);
  expect(robotsText).toMatch(/User-agent:\s*PerplexityBot[\s\S]*?Allow:\s*\//i);

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const sm = await sitemap.text();
  expect(sm).toContain('/calculator/tolerance-stack-up');
  expect(sm).toContain('/calculator/cnc-feeds-speeds');
  expect(sm).toContain('/calculator/bearing-life-l10');
  expect(sm).toContain('tools.html');
  expect(sm).not.toMatch(/\/[a-z0-9-]+-pro\.html/i);
  expect(sm).not.toMatch(/<priority>|<changefreq>|<lastmod>/i);
  expect(sm).not.toContain('https://sectorcalc.com/de/');
  expect(sm).not.toContain('https://sectorcalc.com/ja/');
  expect(sm).not.toContain('https://sectorcalc.com/zh/');

  const llms = await request.get('/llms.txt');
  const llm = await request.get('/llm.txt');
  expect(llms.ok()).toBeTruthy();
  expect(llm.ok()).toBeTruthy();
  const llmsText = await llms.text();
  const llmText = await llm.text();
  expect(llmText).toBe(llmsText);
  expect(llmsText).toContain('SC-008');
  expect(llmsText).toContain('/calculator/tolerance-stack-up');
  expect(llmsText).toContain('## Live tools — 25');
  expect(llmsText).toContain('**82**');
  expect(llmsText).toContain('OAI-SearchBot');
  expect(llmsText).toContain('PerplexityBot');
  expect(llmsText).not.toMatch(/https:\/\/sectorcalc\.com\/[a-z0-9-]+-pro\.html/i);
  expect(llmsText).not.toContain('https://sectorcalc.com/de/');
  expect(llmsText).not.toContain('https://sectorcalc.com/ja/');
  expect(llmsText).not.toContain('https://sectorcalc.com/zh/');
});
