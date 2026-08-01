import { test, expect } from '@playwright/test';

test.setTimeout(180000);

test.describe('CALCULATOR-FIRST DOM ORDER @critical', () => {
  const domChecks = async (page: import('@playwright/test').Page) =>
    page.evaluate(() => {
      const layout = document.querySelector('.sc-layout');
      const guide = document.querySelector('.sc-guide-shell');
      const vh = document.documentElement.clientHeight;
      const vw = document.documentElement.clientWidth;
      const mat = document.getElementById('materialCost');
      const result = {
        layoutPresent: !!layout,
        guidePresent: !!guide,
        following: false,
        layoutTop: -1,
        layoutBottom: -1,
        guideTop: -1,
        matInFirstViewport: false,
        headBlockElements: [] as string[],
        h1InBody: !!document.querySelector('body h1, body .sc-header-title'),
        horizontalOverflow: document.documentElement.scrollWidth > vw + 1
      };
      if (layout && guide) {
        result.following =
          (layout.compareDocumentPosition(guide) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
        const lr = layout.getBoundingClientRect();
        const gr = guide.getBoundingClientRect();
        result.layoutTop = Math.round(lr.top + window.scrollY);
        result.layoutBottom = Math.round(lr.bottom + window.scrollY);
        result.guideTop = Math.round(gr.top + window.scrollY);
      }
      if (mat) {
        const r = mat.getBoundingClientRect();
        result.matInFirstViewport = r.top < vh && r.top > 0;
      }
      // head block element scan
      const head = document.head;
      const bad: string[] = [];
      head.querySelectorAll('div, section, main, article, aside, nav, footer').forEach((el) => {
        bad.push(el.tagName.toLowerCase());
      });
      result.headBlockElements = bad;
      return result;
    });

  test('SC-012: calculator before guide, above the fold', async ({ page }) => {
    const consoleErrors: string[] = [];
    const badResponses: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160));
    });
    page.on('response', (r) => {
      if (r.status() >= 400 && !r.url().includes('google') && !r.url().includes('firebase')) {
        badResponses.push(`${r.status()} ${r.url().slice(0, 80)}`);
      }
    });
    await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    const r = await domChecks(page);
    console.log('LIVE_SC012|' + JSON.stringify(r));
    console.log(
      `LIVE_SC012_ERR|console=${JSON.stringify(consoleErrors)} net=${JSON.stringify(badResponses)}`
    );
    expect(r.layoutPresent).toBe(true);
    expect(r.guidePresent).toBe(true);
    expect(r.following).toBe(true);
    expect(r.layoutTop).toBeLessThan(1200);
    expect(r.guideTop).toBeGreaterThanOrEqual(r.layoutBottom);
    expect(r.matInFirstViewport).toBe(true);
    expect(r.headBlockElements).toEqual([]);
    expect(r.h1InBody).toBe(true);
    expect(consoleErrors).toEqual([]);
    expect(badResponses).toEqual([]);
  });

  test('SC-010: calculator appears before guide', async ({ page }) => {
    await page.goto('/calculator/true-labor-cost', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    const r = await domChecks(page);
    console.log('LIVE_SC010|' + JSON.stringify(r));
    expect(r.layoutPresent).toBe(true);
    expect(r.guidePresent).toBe(true);
    expect(r.following).toBe(true);
    expect(r.layoutTop).toBeLessThan(1200);
    expect(r.headBlockElements).toEqual([]);
  });

  test('SC-008: engineering calculator appears before guide', async ({ page }) => {
    await page.goto('/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    const r = await domChecks(page);
    console.log('LIVE_SC008|' + JSON.stringify(r));
    expect(r.layoutPresent).toBe(true);
    expect(r.guidePresent).toBe(true);
    expect(r.following).toBe(true);
    expect(r.layoutTop).toBeLessThan(1200);
    expect(r.headBlockElements).toEqual([]);
  });

  test('Mobile 375px: calculator first, no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    const r = await domChecks(page);
    console.log('LIVE_MOBILE|' + JSON.stringify(r));
    expect(r.layoutPresent).toBe(true);
    expect(r.following).toBe(true);
    expect(r.layoutTop).toBeLessThan(1200);
    expect(r.horizontalOverflow).toBe(false);
  });

  test('SEO: guide remains server-rendered & indexable', async ({ page }) => {
    const resp = await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    const html = await resp!.text();
    expect(html).toContain('<section class="sc-guide"');
    expect(html).toContain('<h2');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://sectorcalc.com/calculator/quote-pricing');
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(ld).toBeTruthy();
    expect(html).toContain('sc-guide-shell');
  });
});
