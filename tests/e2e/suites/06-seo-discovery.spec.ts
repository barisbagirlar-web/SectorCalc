import { test, expect } from '@playwright/test';
import { catalog } from '../helpers/regression';

/**
 * @seo @critical — Discovery surfaces: robots, sitemap, llm/llms parity, hub SEO.
 */
test.describe('SEO discovery @seo @critical', () => {
  test('robots.txt allows search + AI bots and declares canonical sitemap', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    const text = await robots.text();
    expect(text).toContain('Sitemap: https://sectorcalc.com/sitemap.xml');
    for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
      expect(text).toMatch(new RegExp(`User-agent:\\s*${bot}`, 'i'));
    }
    expect(text).toMatch(/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i);
    expect(text).toMatch(/User-agent:\s*PerplexityBot[\s\S]*?Allow:\s*\//i);
    expect(text).toMatch(/User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\//i);
    expect(text).not.toMatch(/Sitemap:\s*https:\/\/www\.sectorcalc\.com/i);
  });

  test('sitemap.xml matches registry baseline and excludes legacy + locales', async ({
    request
  }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    const sm = await sitemap.text();
    expect(sm).toMatch(/<sitemapindex|<urlset/);
    const childLocs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    let locs = childLocs;
    const allLastmods: string[] = [];
    if (/<sitemapindex\b/i.test(sm)) {
      locs = [];
      for (const child of childLocs) {
        const path = child.replace('https://sectorcalc.com', '');
        const res = await request.get(path);
        expect(res.ok()).toBeTruthy();
        const xml = await res.text();
        locs.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
        allLastmods.push(...[...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]));
      }
    } else {
      allLastmods.push(...[...sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]));
    }
    expect(locs.length).toBe(catalog.indexableBaseline);
    expect(new Set(locs).size).toBe(locs.length);
    expect(locs.join('\n')).toContain('/calculator/tolerance-stack-up');
    expect(locs.join('\n')).toContain('/calculator/surface-finish');
    expect(locs.join('\n')).toContain('/pricing');
    expect(locs.join('\n')).toContain('/tools');
    expect(locs.join('\n')).not.toMatch(/\/[a-z0-9-]+-pro\.html/i);
    expect(sm).not.toMatch(/<priority>|<changefreq>/i);
    expect(allLastmods.length).toBeGreaterThan(0);
    for (const lm of allLastmods) {
      expect(Number.isFinite(new Date(lm).getTime())).toBe(true);
      expect(new Date(lm).getTime()).toBeLessThanOrEqual(Date.now() + 24 * 60 * 60 * 1000);
    }
    for (const lang of ['de', 'ja', 'zh']) {
      expect(locs.join('\n')).not.toContain(`https://sectorcalc.com/${lang}/`);
    }
    for (const tool of catalog.calculators) {
      expect(locs.join('\n'), `sitemap missing ${tool.canonicalPath}`).toContain(tool.canonicalPath);
    }
  });

  test('llm.txt points at llms.txt; llms.txt maps public calculators', async ({ request }) => {
    const llms = await request.get('/llms.txt');
    const llm = await request.get('/llm.txt');
    expect(llms.ok()).toBeTruthy();
    expect(llm.ok()).toBeTruthy();
    const a = await llms.text();
    const b = await llm.text();
    expect(b).toContain('/llms.txt');
    expect(a).not.toBe(b);
    expect(a).toContain('/calculator/tolerance-stack-up');
    expect(a).toContain('/topics');
    expect(a).toContain('/guides');
    expect(a).not.toMatch(/https:\/\/sectorcalc\.com\/[a-z0-9-]+-pro\.html/i);
    expect(a).not.toMatch(/Cloud Scheduler|billing\/health|SEO bait/i);
  });

  test('hub pages have title, description, single H1', async ({ page }) => {
    for (const hub of catalog.hubs.filter(
      (h) => !['/login.html', '/account.html', '/login', '/account', '/pro.html'].includes(h.path)
    )) {
      await page.goto(hub.path);
      await expect(page).toHaveTitle(/SectorCalc|\w+/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/);
      await expect(
        page.getByRole('heading', { level: 1 }).or(page.locator('h1').first())
      ).toBeAttached();
    }
  });
});
