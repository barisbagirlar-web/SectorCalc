/**
 * SC-012 Quote Pricing — Demo Report Auto-Generation release mandate.
 * Load Demo Data must route through the SAME report pipeline as Generate
 * Report (no duplicated formula), show a DEMO REPORT banner, and clear it
 * as soon as the user edits an input. Demo vs manual results must be identical.
 */
import { test, expect } from '@playwright/test';
import { ensureActiveSession } from '../helpers/regression';

// Demo auto-report exercises the live premium gate flow (real Firebase Auth +
// session API), available only on the deployed site (BASE_URL). Skip in CI-local.
test.skip(!process.env.BASE_URL, 'requires live backend (BASE_URL)');

test.describe('SC-012 demo auto-report @gate @critical', () => {
  async function signIn(page: import('@playwright/test').Page) {
    await page.goto('/login.html');
    await page.fill('#email', process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com');
    await page.fill('#password', process.env.E2E_AUTH_PASS || 'Deneme1974');
    await Promise.all([
      page.waitForURL(/account/, { timeout: 20000 }).catch(() => {}),
      page.click('#auth-submit')
    ]);
    await page.waitForTimeout(1500);
  }

  async function openTool(page: import('@playwright/test').Page) {
    await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    await ensureActiveSession(page, { timeout: 30000 });
    await page.waitForTimeout(1500);
  }

  async function readReport(page: import('@playwright/test').Page) {
    return page.evaluate(() => {
      const card = (label: string) => {
        const el = Array.from(document.querySelectorAll('.sc-card-res')).find((c) =>
          c.querySelector('.sc-card-res-label')?.textContent?.includes(label)
        );
        return el?.querySelector('.sc-card-res-val')?.textContent?.trim() || null;
      };
      const breakdown = Array.from(document.querySelectorAll('.sc-pareto-row')).map((r) =>
        r.textContent?.replace(/\s+/g, ' ').trim()
      );
      const profitEl = Array.from(document.querySelectorAll('.sc-card-res')).find((c) =>
        c.querySelector('.sc-card-res-label')?.textContent?.includes('Profit')
      );
      return {
        sell: card('Sell Price'),
        unit: card('Unit Price'),
        total: card('Total Cost'),
        margin: card('Margin'),
        profit: profitEl?.querySelector('.sc-card-res-val')?.textContent?.trim() || null,
        breakdown,
        hasReport: !!document.querySelector('.sc-report-hd'),
        placeholder: !!document.querySelector('.sc-empty'),
        demoBanner: !!document.querySelector('.sc-demo-report'),
        demoText: document.querySelector('.sc-demo-report-tag')?.textContent?.trim() || null,
        bannerText: document.querySelector('.sc-demo-report-copy')?.textContent?.trim() || null,
        live: document.getElementById('liveResult')?.textContent?.trim() || null
      };
    });
  }

  test('TEST 1 — demo auto report: placeholder replaced by real report with banner', async ({
    page
  }) => {
    await signIn(page);
    await openTool(page);
    // Start from blank so the report is not open.
    await page.evaluate(() => {
      window.SCStudy?.startBlank?.();
    });
    await page.waitForTimeout(800);
    // Report area must not be showing a report yet.
    expect((await readReport(page)).hasReport).toBe(false);

    await page.click('[data-sc-study="sample"]');
    await page.waitForTimeout(2500);

    const r = await readReport(page);
    console.log('DEMO1|' + JSON.stringify(r));
    expect(r.hasReport).toBe(true);
    expect(r.placeholder).toBe(false);
    expect(r.demoBanner).toBe(true);
    expect(r.demoText).toBe('DEMO REPORT');
    expect(r.bannerText).toContain('Sample values');
    expect(r.sell).not.toBeNull();
    expect(r.total).not.toBeNull();
    expect(r.unit).not.toBeNull();
    expect(r.margin).not.toBeNull();
    expect(r.breakdown!.length).toBeGreaterThan(0);
    expect(r.live).not.toBe('—');
  });

  test('TEST 2 — golden parity: demo report === manual report for same inputs', async ({
    page
  }) => {
    await signIn(page);
    await openTool(page);
    await page.evaluate(() => {
      window.SCStudy?.startBlank?.();
    });
    await page.waitForTimeout(500);

    // Auto demo report
    await page.click('[data-sc-study="sample"]');
    await page.waitForTimeout(2500);
    const demo = await readReport(page);

    // Reset to blank, manually type the same values, Generate Report
    await page.evaluate(() => {
      window.SCStudy?.startBlank?.();
    });
    await page.waitForTimeout(800);
    const demoValues = {
      materialCost: '1000',
      scrapRate: '0.1',
      laborHours: '5',
      laborHourlyCost: '40',
      machineHours: '3',
      machineHourlyCost: '60',
      setupCost: '150',
      overheadRate: '0.25',
      financingRate: '0.02',
      targetMargin: '0.2',
      quantity: '10'
    };
    for (const [id, val] of Object.entries(demoValues)) {
      await page.fill('#' + id, val);
    }
    await page.click('button:has-text("Generate Report")');
    await page.waitForTimeout(2500);
    const manual = await readReport(page);

    console.log('DEMO2_demo|' + JSON.stringify(demo));
    console.log('DEMO2_manual|' + JSON.stringify(manual));

    expect(manual.sell).toBe(demo.sell);
    expect(manual.total).toBe(demo.total);
    expect(manual.unit).toBe(demo.unit);
    expect(manual.margin).toBe(demo.margin);
    expect(manual.breakdown).toEqual(demo.breakdown);
    expect(manual.demoBanner).toBe(false); // manual report carries no demo banner
    expect(manual.hasReport).toBe(true);
  });

  test('TEST 4 — session non-regression: no second session debit on demo reload', async ({
    page
  }) => {
    await signIn(page);
    await openTool(page);
    const debits: string[] = [];
    page.on('response', (r) => {
      const u = r.url();
      if (
        r.status() === 200 &&
        (u.includes('session') || u.includes('debit') || u.includes('unlock')) &&
        (u.includes('start') || u.includes('create') || u.includes('debit'))
      ) {
        debits.push(u);
      }
    });
    await page.click('[data-sc-study="sample"]');
    await page.waitForTimeout(2500);
    await page.click('[data-sc-study="sample"]');
    await page.waitForTimeout(2500);
    console.log('DEMO4_debits|' + JSON.stringify(debits));
    // Load Demo Data twice must not open a second paid session.
    const sessionStarts = debits.filter((u) => /session|debit/.test(u)).length;
    expect(sessionStarts).toBeLessThanOrEqual(1);
    expect((await readReport(page)).hasReport).toBe(true);
  });

  test('TEST 5 — manual flow still works', async ({ page }) => {
    await signIn(page);
    await openTool(page);
    await page.fill('#materialCost', '2000');
    await page.fill('#quantity', '25');
    await page.click('button:has-text("Generate Report")');
    await page.waitForTimeout(2500);
    const r = await readReport(page);
    console.log('DEMO5|' + JSON.stringify(r));
    expect(r.hasReport).toBe(true);
    expect(r.demoBanner).toBe(false);
    expect(r.sell).not.toBeNull();
  });

  test('TEST 6 — reset clears inputs, banner, and stale report', async ({ page }) => {
    await signIn(page);
    await openTool(page);
    await page.click('[data-sc-study="sample"]');
    await page.waitForTimeout(2500);
    expect((await readReport(page)).hasReport).toBe(true);

    await page.evaluate(() => {
      window.SCStudy?.startBlank?.();
    });
    await page.waitForTimeout(800);
    const r = await readReport(page);
    console.log('DEMO6|' + JSON.stringify(r));
    const mat = await page.inputValue('#materialCost');
    expect(mat).toBe('');
    expect(r.demoBanner).toBe(false);
    expect(r.hasReport).toBe(false); // report area back to initial state
  });

  test('TEST 7 — input modification clears demo state and updates report', async ({ page }) => {
    await signIn(page);
    await openTool(page);
    await page.click('[data-sc-study="sample"]');
    await page.waitForTimeout(2500);
    expect((await readReport(page)).demoBanner).toBe(true);

    await page.fill('#materialCost', '2000');
    await page.waitForTimeout(2000);
    const r = await readReport(page);
    console.log('DEMO7|' + JSON.stringify(r));
    // Editing an input clears the demo banner (sc-study.js also flips mode to blank).
    expect(r.demoBanner).toBe(false);
    expect(r.hasReport).toBe(true);
    const badgeHidden = await page
      .locator('[data-sc-study-banner]')
      .evaluate((el) => el.hasAttribute('hidden') || getComputedStyle(el).display === 'none')
      .catch(() => true);
    expect(badgeHidden).toBe(true);
  });

  test('TEST 8 — mobile 375px: demo loads and report is reachable without overflow', async ({
    page
  }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await signIn(page);
    await openTool(page);
    await page.click('[data-sc-study="sample"]');
    await page.waitForTimeout(3000);
    const r = await readReport(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    console.log('DEMO8|' + JSON.stringify({ ...r, overflow }));
    expect(r.hasReport).toBe(true);
    expect(r.demoBanner).toBe(true);
    expect(overflow).toBe(false);
  });
});
