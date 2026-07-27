import { test, expect, type Page } from '@playwright/test';

/**
 * SectorCalc Critical Flows — Regression Guard
 * Adapted to real routes: *.html hubs + /calculator/<slug> canonicals.
 * Covers: pricing/commerce gate, auth, credit-locked calculators, SEO discovery.
 */

async function pageErrors(page: Page): Promise<string[]> {
  const logs: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') logs.push(msg.text());
  });
  page.on('pageerror', (err) => logs.push(String(err)));
  return logs;
}

function isBenignError(text: string): boolean {
  return (
    /favicon/i.test(text) ||
    /ResizeObserver/i.test(text) ||
    /net::ERR_/i.test(text) ||
    /Failed to load resource/i.test(text)
  );
}

test.describe('Pricing & Checkout', () => {
  test('pricing page loads credit packs (USD / one-time)', async ({ page }) => {
    await page.goto('/pricing.html');
    await expect(page.locator('#packages .pack')).toHaveCount(4, { timeout: 12_000 });
    await expect(page.locator('#packages')).toContainText(/ONE-TIME|one-time|No subscription/i);
    await expect(page.locator('#packages')).toContainText(/USD|CREDIT|credits/i);
    await expect(page.getByRole('link', { name: /Commission credits|Get credits/i }).first()).toBeVisible();
  });

  test('unsigned buy routes to login before Paddle', async ({ page }) => {
    await page.goto('/pricing.html');
    await expect(page.locator('#packages .pack')).toHaveCount(4, { timeout: 12_000 });
    await Promise.all([
      page.waitForURL(/\/login\.html(?:\?|$)/, { timeout: 10_000 }),
      page.locator('#packages button.load').first().click()
    ]);
    await expect(page).toHaveURL(/login\.html/);
    await expect(page).toHaveURL(/next=/);
  });
});

test.describe('Authentication', () => {
  test('login page renders email/password form', async ({ page }) => {
    await page.goto('/login.html');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#auth-submit')).toBeVisible();
  });

  test('account page shows signed-out gate for guests', async ({ page }) => {
    await page.goto('/account.html');
    await expect(page.locator('#signed-out')).toBeVisible({ timeout: 12_000 });
    await expect(page.locator('#signed-out a[href*="login.html"]').first()).toBeVisible();
  });
});

test.describe('Calculator Tools — Open reference bench', () => {
  test('surface finish calculates without credit gate', async ({ page }) => {
    await page.goto('/calculator/surface-finish');
    const free = page.locator('[data-access="free"], .sc-free-aeo').first();
    const gate = page.locator('#sc-pro-gate-root .sc-pro-gate');
    // Live can lag the commit under test (deploy promote is a separate job).
    try {
      await free.waitFor({ state: 'visible', timeout: 12_000 });
    } catch {
      test.skip(
        Boolean(process.env.BASE_URL),
        'Open-bench markers not yet on live host (awaiting promote)'
      );
      throw new Error('Expected free-tool markers on local Vite surface-finish page');
    }
    await expect(gate).toHaveCount(0);
    await expect(page.locator('body')).toContainText(/Open instrument|Free · no sign-in|no credits/i);
  });
});

test.describe('Calculator Tools — Credit Gate Surface', () => {
  const calculators = [
    {
      path: '/calculator/tolerance-stack-up',
      name: 'SC-008 Tolerance Stack',
      legacy: '/sc008-pro.html'
    },
    { path: '/calculator/quote-pricing', name: 'SC-012 Quote Pricing', legacy: '/quote-pro.html' },
    {
      path: '/calculator/true-labor-cost',
      name: 'SC-010 True Labor Cost',
      legacy: '/labor-pro.html'
    },
    {
      path: '/calculator/cnc-feeds-speeds',
      name: 'SC-020 CNC Feeds',
      legacy: '/machining-pro.html'
    }
  ];

  for (const calc of calculators) {
    test(`${calc.name} canonical loads with guide + gate mount`, async ({ page }) => {
      const errors = await pageErrors(page);
      await page.goto(calc.path);
      await expect(page).toHaveURL(new RegExp(calc.path.replace(/\//g, '\\/')));
      await expect(page.locator('#sc-guide')).toBeVisible({ timeout: 15_000 });
      // Legacy *-pro redirects land on the same surface; gate boots from auth-nav.
      const gate = page.locator('#sc-pro-gate-root .sc-pro-gate, #sc-pro-gate-root');
      await expect(gate.first()).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('body')).not.toContainText(/Something went wrong|Unhandled/i);
      const hard = errors.filter(
        (e) => !isBenignError(e) && !/firebase|auth\/|Firestore|paddle/i.test(e)
      );
      expect(hard).toEqual([]);
    });
  }

  test('legacy sc008-pro.html redirects to canonical slug', async ({ page }) => {
    await page.goto('/sc008-pro.html');
    await expect(page).toHaveURL(/\/calculator\/tolerance-stack-up/);
  });
});

test.describe('SEO & Meta Integrity', () => {
  test('homepage has SectorCalc title and meta description', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SectorCalc/);
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /.+/);
  });

  test('sitemap.xml reachable and lists canonical calculators', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('/calculator/tolerance-stack-up');
    expect(body).toContain('/pricing.html');
    expect(body).not.toMatch(/\/[a-z0-9-]+-pro\.html/i);
  });

  test('llm.txt and llms.txt are byte-identical discovery surfaces', async ({ request }) => {
    const llms = await request.get('/llms.txt');
    const llm = await request.get('/llm.txt');
    expect(llms.ok()).toBeTruthy();
    expect(llm.ok()).toBeTruthy();
    const a = await llms.text();
    const b = await llm.text();
    expect(a).toBe(b);
    expect(a).toContain('SC-008');
    expect(a).toContain('/calculator/tolerance-stack-up');
  });
});

test.describe('Visual Regression — CSS Integrity', () => {
  test.beforeEach(() => {
    test.skip(
      Boolean(process.env.BASE_URL) || Boolean(process.env.CI),
      'Baselines are local-dev only (OS font raster differs in CI)'
    );
  });

  test('homepage hero region screenshot matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
    const hero = page.locator('#siteHeader, header, main').first();
    await expect(hero).toBeVisible();
    await expect(page).toHaveScreenshot('homepage-chrome.png', {
      maxDiffPixelRatio: 0.02,
      fullPage: false,
      animations: 'disabled'
    });
  });

  test('pricing packs region screenshot matches baseline', async ({ page }) => {
    await page.goto('/pricing.html');
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('#packages .pack').first()).toBeVisible({ timeout: 12_000 });
    await expect(page.locator('#packages')).toHaveScreenshot('pricing-packs.png', {
      maxDiffPixelRatio: 0.03,
      animations: 'disabled'
    });
  });
});
