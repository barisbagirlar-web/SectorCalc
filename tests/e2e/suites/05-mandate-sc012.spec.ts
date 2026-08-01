/**
 * SC-012 Quote Pricing — form-visibility / access-gate release mandate.
 * Guards the five production states so the form is never hidden by the gate:
 * ANONYMOUS, AUTH+CREDITS, AUTH+NO-CREDITS, API ERROR, MOBILE 375px.
 * The gate may only control the access bar + paid action, never the form layout.
 */
import { test, expect } from '@playwright/test';

// Premium gate flow exercises real Firebase Auth + session/entitlement APIs,
// which only exist on the live deployment (BASE_URL). Skip locally in CI.
test.skip(!process.env.BASE_URL, 'requires live backend (BASE_URL)');

test.describe('SC-012 form visibility mandate @gate @critical', () => {
  test('anonymous: form visible, sign-in gate visible, no empty page', async ({ page }) => {
    await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    const probe = await page.evaluate(() => {
      const vis = (el: Element | null) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      };
      const input = (id: string) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        return vis(el) ? { visible: true, readonly: el!.readOnly } : { visible: false };
      };
      return {
        layout: vis(document.querySelector('.sc-layout')),
        sidebar: vis(document.querySelector('.sc-sidebar')),
        materialCost: input('materialCost'),
        quantity: input('quantity'),
        genReport: vis(
          Array.from(document.querySelectorAll('button')).find((b) =>
            b.textContent?.includes('Generate Report')
          ) || null
        ),
        gate: vis(document.querySelector('.sc-pro-gate')),
        gateText:
          document.querySelector('.sc-pro-gate')?.textContent?.replace(/\s+/g, ' ').slice(0, 120) ||
          ''
      };
    });

    expect(probe.layout).toBe(true);
    expect(probe.sidebar).toBe(true);
    expect(probe.materialCost).toEqual({ visible: true, readonly: true });
    expect(probe.quantity).toEqual({ visible: true, readonly: true });
    expect(probe.genReport).toBe(true);
    expect(probe.gate).toBe(true);
    expect(probe.gateText).toContain('Sign in to unlock');
  });

  test('auth + credits: form visible, session active, fields unlocked', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#email', process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com');
    await page.fill('#password', process.env.E2E_AUTH_PASS || 'Deneme1974');
    await Promise.all([
      page.waitForURL(/account/, { timeout: 20000 }).catch(() => {}),
      page.click('#auth-submit')
    ]);
    await page.waitForTimeout(1500);

    await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.sc-pro-gate-active').first()).toBeVisible({ timeout: 20000 });

    const state = await page.evaluate(() => {
      const mat = document.getElementById('materialCost') as HTMLInputElement | null;
      const sidebar = document.querySelector('.sc-sidebar');
      const cs = sidebar ? getComputedStyle(sidebar) : null;
      return {
        formVisible: !!mat && cs?.display !== 'none' && mat.getBoundingClientRect().height > 0,
        editable: mat ? !mat.readOnly : false,
        gateActive: (document.querySelector('.sc-pro-gate-active')?.textContent || '').includes(
          'Session active'
        )
      };
    });
    expect(state.formVisible).toBe(true);
    expect(state.editable).toBe(true);
    expect(state.gateActive).toBe(true);
  });

  test('auth + no credits: form visible, Buy Credits shown, no free session', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#email', process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com');
    await page.fill('#password', process.env.E2E_AUTH_PASS || 'Deneme1974');
    await Promise.all([
      page.waitForURL(/account/, { timeout: 20000 }).catch(() => {}),
      page.click('#auth-submit')
    ]);
    await page.waitForTimeout(1500);

    await page.route('**/api/tools/SC-012/entitlement', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          toolId: 'SC-012',
          toolName: 'Quote Pricing',
          toolUrl: '/calculator/quote-pricing',
          accessType: 'SESSION',
          status: 'ENDED',
          sessionStatus: 'ENDED',
          sessionStartsAt: null,
          sessionEndsAt: null,
          sessionRemainingSeconds: 0,
          sessionRemainingLabel: '0 h',
          creditsAvailable: 2,
          sessionCreditCost: 7,
          canOpenWithoutDebit: false,
          canStartNewSession: false,
          firstUsedAt: null,
          usageConsumed: 0,
          lastUsedAt: null
        })
      })
    );

    await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const state = await page.evaluate(() => {
      const mat = document.getElementById('materialCost') as HTMLInputElement | null;
      const buy = Array.from(document.querySelectorAll('a')).some((a) =>
        a.textContent?.includes('Buy credits')
      );
      return {
        formVisible: !!mat && mat.getBoundingClientRect().height > 0,
        buyCredits: buy,
        confirmPresent: !!document.querySelector('[data-confirm-pro]'),
        gateText:
          document.querySelector('.sc-pro-gate')?.textContent?.replace(/\s+/g, ' ').slice(0, 140) ||
          ''
      };
    });
    expect(state.formVisible).toBe(true);
    expect(state.buyCredits).toBe(true);
    expect(state.confirmPresent).toBe(false); // no free session starter
    expect(state.gateText).toMatch(/below the session cost|required/i);
  });

  test('api error: form visible, Retry in access bar, session fail-closed', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#email', process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com');
    await page.fill('#password', process.env.E2E_AUTH_PASS || 'Deneme1974');
    await Promise.all([
      page.waitForURL(/account/, { timeout: 20000 }).catch(() => {}),
      page.click('#auth-submit')
    ]);
    await page.waitForTimeout(1500);

    await page.route('**/api/tools/SC-012/entitlement', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'boom' })
      })
    );

    await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const state = await page.evaluate(() => {
      const mat = document.getElementById('materialCost') as HTMLInputElement | null;
      const retry = document.querySelector('[data-sc-abar-retry]');
      const gate = (window as any).__scProGate;
      return {
        formVisible: !!mat && mat.getBoundingClientRect().height > 0,
        retryVisible: !!retry && retry.getBoundingClientRect().height > 0,
        sessionStarted: gate ? gate.canOpenWithoutDebit : false
      };
    });
    expect(state.formVisible).toBe(true);
    expect(state.retryVisible).toBe(true);
    expect(state.sessionStarted).toBe(false); // fail-closed, no free session
  });

  test('mobile 375px: form visible, no overlay, no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    const state = await page.evaluate(() => {
      const mat = document.getElementById('materialCost') as HTMLInputElement | null;
      const overlays = Array.from(document.querySelectorAll('[class*="overlay"], [class*="modal"]'))
        .filter((o) => getComputedStyle(o).display !== 'none')
        .filter((o) => o.getBoundingClientRect().width > 0 && o.getBoundingClientRect().height > 0);
      return {
        formVisible: !!mat && mat.getBoundingClientRect().height > 0,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        overlays
      };
    });
    expect(state.formVisible).toBe(true);
    expect(state.overflowX).toBe(false);
    expect(state.overlays.length).toBe(0);
  });
});
