import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, type Page, type ConsoleMessage } from '@playwright/test';

export type GateState = 'none' | 'free-config' | 'locked' | 'active' | 'free-tool';

export type RegressionCatalog = {
  calculatorCount: number;
  indexableBaseline: number;
  sitemapCount: number;
  freeToolIds: string[];
  freeTools: Array<{
    toolId: string;
    canonicalPath: string;
    name: string;
    sourceSlug: string;
    upsellHref: string;
  }>;
  paidTools: Array<{
    id: string;
    name: string;
    canonicalPath: string;
    sourceFile: string;
    free: boolean;
  }>;
  calculators: Array<{
    id: string;
    name: string;
    canonicalPath: string;
    sourceFile: string;
    legacyPaths: string[];
    free: boolean;
    title: string;
    description: string;
    h1: string;
  }>;
  hubs: Array<{ path: string; name: string }>;
};

export const catalog: RegressionCatalog = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../fixtures/catalog.json'), 'utf8')
);

export function isBenignConsole(text: string): boolean {
  return (
    /favicon/i.test(text) ||
    /ResizeObserver/i.test(text) ||
    /net::ERR_/i.test(text) ||
    /Failed to load resource/i.test(text) ||
    /firebase|auth\/|Firestore|paddle|recaptcha|googleapis/i.test(text)
  );
}

/** Attach early; assert at end of scenario. */
export function attachHardErrorCollector(page: Page): { hard: () => string[] } {
  const hard: string[] = [];
  const onConsole = (msg: ConsoleMessage) => {
    if (msg.type() !== 'error') return;
    const t = msg.text();
    if (!isBenignConsole(t)) hard.push(t);
  };
  const onPageError = (err: Error) => {
    const t = String(err);
    if (!isBenignConsole(t)) hard.push(t);
  };
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  return { hard: () => [...hard] };
}

export async function waitForGateState(page: Page): Promise<GateState> {
  await expect
    .poll(
      async () => {
        const freeBadge = await page.locator('[data-access="free"], .sc-free-aeo').count();
        if (freeBadge) return 'free-tool';
        const hasChrome = await page
          .locator('#sc-guide, #calcBtn, #liveResult, #verdict, main')
          .count();
        const hasGate = await page.locator('#sc-pro-gate-root .sc-pro-gate').count();
        if (!hasChrome && !hasGate) return 'booting';
        if (hasGate) {
          if (await page.locator('.sc-pro-gate-active').count()) return 'active';
          if (await page.locator('[data-confirm-pro]').count()) return 'locked';
          if (
            await page
              .locator('.sc-pro-gate-copy')
              .filter({ hasText: /free in the current configuration/i })
              .count()
          ) {
            return 'free-config';
          }
          return 'pending';
        }
        return 'none';
      },
      { timeout: 20_000 }
    )
    .not.toMatch(/booting|pending/);

  if (await page.locator('[data-access="free"], .sc-free-aeo').count()) return 'free-tool';
  if (await page.locator('.sc-pro-gate-active').count()) return 'active';
  if (await page.locator('[data-confirm-pro]').count()) return 'locked';
  if (
    await page
      .locator('.sc-pro-gate-copy')
      .filter({ hasText: /free in the current configuration/i })
      .count()
  ) {
    return 'free-config';
  }
  return 'none';
}

export async function expectLockedGate(page: Page, toolId: string): Promise<void> {
  await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.sc-pro-gate-kicker')).toContainText(toolId);
  await expect(page.locator('[data-confirm-pro]')).toBeVisible();
  await expect(page.locator('.sc-pro-gate a[href="/pricing.html"]')).toBeVisible();
  await expect(page.locator('.sc-pro-gate-title')).toContainText(/CREDITS/i);
}

export async function expectFreeToolSurface(page: Page, toolId: string): Promise<void> {
  // Free AEO strip may sit inside .sc-header which CSS-hides under body.has-site-header.
  // Contract: marker exists in DOM, no credit gate, free copy present.
  await expect(page.locator(`aside.sc-free-aeo[data-tool-id="${toolId}"]`)).toBeAttached({
    timeout: 15_000
  });
  await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toHaveCount(0);
  await expect(page.locator('body')).toContainText(
    /Open · no sign-in|Open instrument|Free · no sign-in|no credits/i
  );
}

export async function expectToolChrome(page: Page): Promise<void> {
  await expect(
    page.locator('#sc-guide, [data-sc-tool-id], body.theme-calc-sheet').first()
  ).toBeVisible({
    timeout: 15_000
  });
  await expect(page.locator('h1, #sc-guide').first()).toBeVisible();
}

export async function expectPageSeoBasics(page: Page, opts?: { titleRe?: RegExp }): Promise<void> {
  await expect(page).toHaveTitle(opts?.titleRe || /./);
  const desc = page.locator('meta[name="description"]');
  await expect(desc).toHaveAttribute('content', /.{40,}/);
  await expect(page.locator('html')).toHaveAttribute('lang', /en/i);
  // Shared site nav sets body.has-site-header and CSS-hides .sc-header (where tool H1 lives).
  // SEO contract: H1 must exist in DOM; chrome contract: shared header or calc layout visible.
  await expect(page.locator('h1').first()).toBeAttached();
  await expect(
    page.locator('#siteHeader, .sc-layout, .sc-header, main, .acc-page, .auth-shell').first()
  ).toBeVisible();
}

/** Lightweight a11y contracts — no axe dependency. */
export async function expectA11ySmoke(page: Page): Promise<void> {
  await expect(page.locator('html[lang]')).toHaveCount(1);
  await expect(page.locator('h1').first()).toBeAttached();
  await expect(
    page.locator('#siteHeader, main, [role="main"], .sc-layout, body').first()
  ).toBeVisible();
  const bad = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return imgs
      .filter((img) => !img.hasAttribute('alt') && !img.closest('[aria-hidden="true"]'))
      .map((img) => img.getAttribute('src') || '(no-src)')
      .slice(0, 5);
  });
  expect(bad, `images missing alt: ${bad.join(', ')}`).toEqual([]);
}
