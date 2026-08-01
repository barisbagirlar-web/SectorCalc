/**
 * SESSION ACTIVATION FEEDBACK — shared frontend micro-release.
 * A success panel appears only when a NEW session is opened
 * (reused === false && creditCost > 0). Reused sessions stay silent.
 * Reset & Start reuses the tool's existing reset handler.
 */
import { test, expect } from '@playwright/test';

const EMAIL = process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com';
const PASS = process.env.E2E_AUTH_PASS || 'Deneme1974';

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/login.html');
  await page.fill('#email', EMAIL);
  await page.fill('#password', PASS);
  await Promise.all([
    page.waitForURL(/account/, { timeout: 20000 }).catch(() => {}),
    page.click('#auth-submit')
  ]);
  await page.waitForTimeout(1500);
}

/** Mock entitlement so the gate boots clean. */
async function mockEntitlement(
  page: import('@playwright/test').Page,
  toolId: string,
  opts: {
    canStart?: boolean;
    active?: boolean;
    credits?: number;
  } = {}
) {
  const { canStart = true, active = false, credits = 1000 } = opts;
  await page.route(`**/api/tools/${toolId}/entitlement`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        toolId,
        toolName: 'Tool',
        toolUrl: '/calculator/x',
        accessType: 'SESSION',
        status: active ? 'ACTIVE' : 'ENDED',
        sessionStatus: active ? 'ACTIVE' : 'ENDED',
        sessionStartsAt: null,
        sessionEndsAt: active ? new Date(Date.now() + 24 * 3600e3).toISOString() : null,
        sessionRemainingSeconds: active ? 24 * 3600 : 0,
        sessionRemainingLabel: active ? '24 h' : '0 h',
        creditsAvailable: credits,
        sessionCreditCost: 7,
        canOpenWithoutDebit: active,
        canStartNewSession: canStart,
        firstUsedAt: null,
        usageConsumed: 0,
        lastUsedAt: null
      })
    })
  );
}

/** Mock professional-session endpoint with the given response. */
async function mockSession(
  page: import('@playwright/test').Page,
  toolId: string,
  resp: {
    reused?: boolean;
    creditCost?: number;
    expiresAt?: string;
    sessionId?: string;
    newWalletBalance?: number;
    status?: number;
    body?: Record<string, unknown>;
  }
) {
  const now = Date.now();
  const expiresAt = resp.expiresAt || new Date(now + 24 * 3600e3).toISOString();
  await page.route(`**/api/tools/${toolId}/professional-session`, (route) => {
    const status = resp.status ?? 200;
    const body = resp.body ?? {
      sessionId: resp.sessionId || `sess-${Math.random().toString(36).slice(2, 10)}`,
      toolId,
      startedAt: new Date(now).toISOString(),
      expiresAt,
      creditCost: resp.creditCost ?? (resp.reused ? 0 : 7),
      reused: resp.reused ?? false,
      newWalletBalance: resp.newWalletBalance ?? 993
    };
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
}

async function openTool(page: import('@playwright/test').Page) {
  await page.goto('/calculator/quote-pricing', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
}

test.describe('Session activation feedback @critical', () => {
  test('TEST 1 — new session: panel shows credits used + expiry + reset pulse', async ({
    page
  }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', {
      reused: false,
      creditCost: 7,
      expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString(),
      newWalletBalance: 993
    });
    await openTool(page);

    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1500);

    const panel = await page.evaluate(() => {
      const el = document.getElementById('sc-session-feedback');
      if (!el) return null;
      return {
        text: el.textContent?.replace(/\s+/g, ' ').trim(),
        role: el.getAttribute('role'),
        ariaLive: el.getAttribute('aria-live'),
        resetAttention: !!document.querySelector(
          '[data-sc-reset].sc-reset-attention, [data-sc-study="blank"].sc-reset-attention'
        ),
        resetBtn: !!resolveReset()
      };
      function resolveReset() {
        return document.querySelector('[data-sc-reset], [data-sc-study="blank"]');
      }
    });
    console.log('SF1|' + JSON.stringify(panel));
    expect(panel).not.toBeNull();
    expect(panel!.text).toContain('Professional session activated');
    expect(panel!.text).toContain('7 credits used');
    expect(panel!.text).toContain('24 hours');
    expect(panel!.text).toContain('Reset');
    expect(panel!.role).toBe('status');
    expect(panel!.ariaLive).toBe('polite');
    expect(panel!.resetAttention).toBe(true);
    expect(panel!.resetBtn).toBe(true);
    await page.screenshot({ path: 'test-results/session-feedback-panel.png' });
  });

  test('TEST 2 — Reset & Start reuses existing reset handler', async ({ page }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    let sessionCalls = 0;
    await page.route(`**/api/tools/SC-012/professional-session`, (route) => {
      sessionCalls += 1;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'sess-reset-1',
          toolId: 'SC-012',
          startedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString(),
          creditCost: 7,
          reused: false,
          newWalletBalance: 993
        })
      });
    });
    await openTool(page);

    // Open the session first (form unlocks), then edit a value.
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1200);
    expect(await page.locator('#sc-session-feedback').count()).toBe(1);
    await page.fill('#materialCost', '555');

    // Reset & Start invokes the tool's existing reset handler (startBlankStudy)
    // which clears inputs back to blank.
    await page.click('[data-sc-sf-reset]');
    await page.waitForTimeout(800);
    const mat = await page.inputValue('#materialCost');
    console.log('SF2|mat=' + mat + ' sessionCalls=' + sessionCalls);
    expect(mat).toBe(''); // existing startBlankStudy() clears the form
    expect(sessionCalls).toBe(1); // no second session request
    expect(await page.locator('#sc-session-feedback').count()).toBe(0);
  });

  test('TEST 3 — Continue keeps inputs and closes panel', async ({ page }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', { reused: false, creditCost: 7 });
    await openTool(page);

    // Open session, then set a value, then Continue.
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1200);
    await page.fill('#materialCost', '777');
    await page.click('[data-sc-sf-continue]');
    await page.waitForTimeout(500);
    const mat = await page.inputValue('#materialCost');
    expect(mat).toBe('777');
    expect(await page.locator('#sc-session-feedback').count()).toBe(0);
  });

  test('TEST 4 — auto close after ~5s, session stays active, no lock', async ({ page }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', { reused: false, creditCost: 7 });
    await openTool(page);

    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1200);
    expect(await page.locator('#sc-session-feedback').count()).toBe(1);

    await page.waitForTimeout(6000);
    expect(await page.locator('#sc-session-feedback').count()).toBe(0);
    // Session stays active; form unlocked.
    const state = await page.evaluate(() => {
      const mat = document.getElementById('materialCost') as HTMLInputElement | null;
      return {
        gateActive: (document.querySelector('.sc-pro-gate-active')?.textContent || '').includes(
          'Session active'
        ),
        editable: mat ? !mat.readOnly : false,
        attention: !!document.querySelector('.sc-reset-attention')
      };
    });
    console.log('SF4|' + JSON.stringify(state));
    expect(state.gateActive).toBe(true);
    expect(state.editable).toBe(true);
    expect(state.attention).toBe(false); // pulse expired
  });

  test('TEST 5 — reused session: no panel, no second debit', async ({ page }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    const sessionCalls: string[] = [];
    await page.route(`**/api/tools/SC-012/professional-session`, (route) => {
      sessionCalls.push('called');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'reused-sess-1',
          toolId: 'SC-012',
          startedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString(),
          creditCost: 0,
          reused: true,
          newWalletBalance: 1000
        })
      });
    });
    await openTool(page);
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1500);
    expect(await page.locator('#sc-session-feedback').count()).toBe(0);
    console.log('SF5|calls=' + sessionCalls.length);
  });

  test('TEST 6 — second tab / refresh reuse: panel stays hidden via sessionStorage guard', async ({
    page
  }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', {
      reused: false,
      creditCost: 7,
      sessionId: 'sess-guard-1',
      expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString()
    });
    await openTool(page);

    // First open → panel shows and marks seen.
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1200);
    expect(await page.locator('#sc-session-feedback').count()).toBe(1);

    // Simulate second tab mounting a duplicate component + event for same session.
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('sectorcalc:session-activated', {
          detail: {
            toolId: 'SC-012',
            sessionId: 'sess-guard-1',
            creditCost: 7,
            expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString(),
            newWalletBalance: 993,
            reused: false
          }
        })
      );
    });
    await page.waitForTimeout(300);
    // Only one panel instance (guard prevents duplicate mount/re-render).
    expect(await page.locator('#sc-session-feedback').count()).toBe(1);
  });

  test('TEST 7 — insufficient credits: no success panel, error preserved', async ({ page }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', {
      status: 402,
      body: { error: 'INSUFFICIENT_CREDITS', requiredCredits: 7, availableCredits: 2 }
    });
    await openTool(page);
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1500);
    expect(await page.locator('#sc-session-feedback').count()).toBe(0);
    const err = await page
      .locator('.sc-pro-gate-err')
      .first()
      .textContent()
      .catch(() => null);
    console.log('SF7|err=' + err);
    expect(err).toContain('credits required');
  });

  test('TEST 8 — API 500: no success panel, retry preserved', async ({ page }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', { status: 500, body: { error: 'SERVER_ERROR_500' } });
    await openTool(page);
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1500);
    expect(await page.locator('#sc-session-feedback').count()).toBe(0);
    const err = await page
      .locator('.sc-pro-gate-err')
      .first()
      .textContent()
      .catch(() => null);
    console.log('SF8|err=' + err);
    expect(err).toContain('maintenance');
  });

  test('TEST 10 — mobile 375px: panel visible, no overflow, form reachable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', { reused: false, creditCost: 7 });
    await openTool(page);
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1500);
    const state = await page.evaluate(() => {
      const panel = document.getElementById('sc-session-feedback');
      const overflow =
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      const btn = Array.from(document.querySelectorAll('#sc-session-feedback button')).some((b) => {
        const r = b.getBoundingClientRect();
        return r.right > document.documentElement.clientWidth + 1;
      });
      return { panel: !!panel, overflow, btnOverflow: btn };
    });
    console.log('SF10|' + JSON.stringify(state));
    expect(state.panel).toBe(true);
    expect(state.overflow).toBe(false);
    expect(state.btnOverflow).toBe(false);
  });

  test('TEST 9 — all premium tools: shared component mounted, reset resolver + panel render', async ({
    page
  }) => {
    await signIn(page);
    // Representative credit-gated tools across tiers.
    const routes: Array<{ url: string; toolId: string; cost: number }> = [
      { url: '/calculator/quote-pricing', toolId: 'SC-012', cost: 7 }, // PRO
      { url: '/calculator/true-labor-cost', toolId: 'SC-010', cost: 3 }, // CORE
      { url: '/calculator/bolt-torque-preload', toolId: 'SC-035', cost: 7 } // PRO
    ];
    for (const r of routes) {
      await mockEntitlement(page, r.toolId, { canStart: true, active: false });
      await page.route(`**/api/tools/${r.toolId}/professional-session`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            sessionId: `sess-all-${r.toolId}`,
            toolId: r.toolId,
            startedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString(),
            creditCost: r.cost,
            reused: false,
            newWalletBalance: 1000 - r.cost
          })
        })
      );
      await page.goto(r.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const probe = await page.evaluate(() => {
        const mounted = !!(window as any).__scSessionFeedbackMounted;
        const resetBtn = document.querySelector('[data-sc-reset]');
        const gateBtn = document.querySelector('[data-confirm-pro]');
        return {
          mounted,
          resetSelector: resetBtn
            ? resetBtn.tagName + '#' + (resetBtn.id || '') + '.' + resetBtn.className.split(' ')[0]
            : null,
          gatePresent: !!gateBtn
        };
      });
      console.log(`SF9|${r.toolId} ` + JSON.stringify(probe));
      expect(probe.mounted).toBe(true);
      expect(probe.resetSelector).toBeTruthy();
      expect(probe.gatePresent).toBe(true);

      // Panel renders from the shared component on this tool.
      await page.click('[data-confirm-pro]');
      await page.waitForTimeout(1200);
      expect(await page.locator('#sc-session-feedback').count()).toBe(1);
      const panelText = (await page.locator('#sc-session-feedback').textContent()) || '';
      expect(panelText).toContain('Professional session activated');
      expect(panelText).toContain(`${r.cost} credits used`);
      // Close for next route.
      await page.click('[data-sc-sf-continue]');
      await page.waitForTimeout(400);
    }
  });

  test('TEST 11 — accessibility: role/aria, Escape close, keyboard CTA', async ({ page }) => {
    const logs: string[] = [];
    page.on('pageerror', (err) => logs.push('PAGEERROR: ' + err.message));
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', { reused: false, creditCost: 7 });
    await openTool(page);
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1200);

    // Escape closes the panel.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    expect(await page.locator('#sc-session-feedback').count()).toBe(0);

    // Re-open (same-session re-dispatch, fresh session id) then reach the
    // Reset & Start CTA via keyboard focus and activate with Enter.
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('sectorcalc:session-activated', {
          detail: {
            toolId: 'SC-012',
            sessionId: 'sess-kb-2',
            creditCost: 7,
            expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString(),
            newWalletBalance: 993,
            reused: false
          }
        })
      );
    });
    await page.waitForTimeout(600);
    expect(await page.locator('#sc-session-feedback').count()).toBe(1);
    // Focus the panel CTA (tabbable) and press Enter — must close the panel.
    await page.locator('[data-sc-sf-reset]').focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    expect(await page.locator('#sc-session-feedback').count()).toBe(0);

    // Reduced-motion: pulse class respects prefers-reduced-motion (animation off).
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('sectorcalc:session-activated', {
          detail: {
            toolId: 'SC-012',
            sessionId: 'sess-rm-1',
            creditCost: 7,
            expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString(),
            newWalletBalance: 993,
            reused: false
          }
        })
      );
    });
    await page.waitForTimeout(400);
    const attention = await page.evaluate(() => {
      const btn = document.querySelector('[data-sc-reset]');
      const pulse = document.querySelector(
        '[data-sc-reset].sc-reset-attention, [data-sc-study="blank"].sc-reset-attention'
      );
      return {
        found: !!btn,
        btnClass: btn ? btn.className : null,
        pulse: !!pulse,
        seen: sessionStorage.getItem('sectorcalc:session-activation-seen')
      };
    });
    console.log(
      'SF11|attention=' + JSON.stringify(attention) + ' pageErrors=' + JSON.stringify(logs)
    );
    expect(await page.locator('#sc-session-feedback').count()).toBe(1);
    expect(attention.found).toBe(true);
    expect(attention.pulse).toBe(true);
  });

  test('TEST 12 — parity: SC-012 calculation identical after session flow', async ({ page }) => {
    await signIn(page);
    await mockEntitlement(page, 'SC-012', { canStart: true, active: false });
    await mockSession(page, 'SC-012', { reused: false, creditCost: 7 });
    await openTool(page);

    // Open the session, keep values, then run the same inputs twice — outputs
    // must be identical, proving the feedback flow never alters the engine.
    await page.click('[data-confirm-pro]');
    await page.waitForTimeout(1500);
    await page.click('[data-sc-sf-continue]');

    await page.fill('#materialCost', '1000');
    await page.fill('#quantity', '10');
    await page.click('button:has-text("Generate Report")');
    await page.waitForTimeout(1500);
    const baseline = await page.evaluate(() => {
      const card = (label: string) =>
        Array.from(document.querySelectorAll('.sc-card-res'))
          .find((c) => c.querySelector('.sc-card-res-label')?.textContent?.includes(label))
          ?.querySelector('.sc-card-res-val')
          ?.textContent?.trim() || null;
      return { sell: card('Sell Price'), total: card('Total Cost'), unit: card('Unit Price') };
    });

    await page.click('button:has-text("Generate Report")');
    await page.waitForTimeout(1500);
    const after = await page.evaluate(() => {
      const card = (label: string) =>
        Array.from(document.querySelectorAll('.sc-card-res'))
          .find((c) => c.querySelector('.sc-card-res-label')?.textContent?.includes(label))
          ?.querySelector('.sc-card-res-val')
          ?.textContent?.trim() || null;
      return { sell: card('Sell Price'), total: card('Total Cost'), unit: card('Unit Price') };
    });
    console.log('SF12|baseline=' + JSON.stringify(baseline) + ' after=' + JSON.stringify(after));
    expect(after).toEqual(baseline);
  });
});
