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
    expect(text).not.toMatch(/Sitemap:\s*https:\/\/www\.sectorcalc\.com/i);
  });

  test('sitemap.xml matches registry baseline and excludes legacy + locales', async ({
    request
  }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    const sm = await sitemap.text();
    expect(sm).toContain('<urlset');
    const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBe(catalog.indexableBaseline);
    expect(new Set(locs).size).toBe(locs.length);
    expect(sm).toContain('/calculator/tolerance-stack-up');
    expect(sm).toContain('/calculator/surface-finish');
    expect(sm).toContain('/pricing.html');
    expect(sm).toContain('tools.html');
    expect(sm).not.toMatch(/\/[a-z0-9-]+-pro\.html/i);
    expect(sm).not.toMatch(/<priority>|<changefreq>|<lastmod>/i);
    for (const lang of ['de', 'ja', 'zh']) {
      expect(sm).not.toContain(`https://sectorcalc.com/${lang}/`);
    }
    for (const tool of catalog.calculators) {
      expect(sm, `sitemap missing ${tool.canonicalPath}`).toContain(tool.canonicalPath);
    }
  });

  test('llm.txt === llms.txt and tracks sitemap + free tools', async ({ request }) => {
    const llms = await request.get('/llms.txt');
    const llm = await request.get('/llm.txt');
    expect(llms.ok()).toBeTruthy();
    expect(llm.ok()).toBeTruthy();
    const a = await llms.text();
    const b = await llm.text();
    expect(a).toBe(b);
    expect(a).toContain('## Live tools — 25');
    expect(a).toContain(`**${catalog.indexableBaseline}**`);
    expect(a).toContain('SC-008');
    expect(a).toContain('/calculator/tolerance-stack-up');
    expect(a).toContain('OAI-SearchBot');
    expect(a).toContain('PerplexityBot');
    expect(a).toMatch(/Five open reference instruments|Five free reference calculators/i);
    expect(a).toContain('/topics');
    for (const id of catalog.freeToolIds) {
      expect(a).toContain(id);
    }
    expect(a).not.toMatch(/https:\/\/sectorcalc\.com\/[a-z0-9-]+-pro\.html/i);
    expect(a).not.toContain('**78**');
    expect(a).not.toContain('**32**');
  });

  test('hub pages have title, description, single H1', async ({ page }) => {
    for (const hub of catalog.hubs.filter(
      (h) => !['/login.html', '/account.html'].includes(h.path)
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
