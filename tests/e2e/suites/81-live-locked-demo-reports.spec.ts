/**
 * One-shot production verification for every monetized calculator.
 * This branch is intentionally not merged; it proves that anonymous demo
 * inputs produce a report or meaningful calculated/audit output on live.
 */
import { test, expect } from '@playwright/test';

const tools = [
  { id: 'SC-008', path: '/calculator/tolerance-stack-up' },
  { id: 'SC-010', path: '/calculator/true-labor-cost' },
  { id: 'SC-012', path: '/calculator/quote-pricing' },
  { id: 'SC-020', path: '/calculator/cnc-feeds-speeds' },
  { id: 'SC-021', path: '/calculator/bearing-life-l10' },
  { id: 'SC-022', path: '/calculator/tap-thread-milling' },
  { id: 'SC-023', path: '/calculator/cycle-time-cost' },
  { id: 'SC-024', path: '/calculator/bearing-frequencies' },
  { id: 'SC-025', path: '/calculator/belt-chain-drive' },
  { id: 'SC-026', path: '/calculator/shaft-design' },
  { id: 'SC-029', path: '/calculator/weld-heat-input' },
  { id: 'SC-031', path: '/calculator/sling-capacity' },
  { id: 'SC-032', path: '/calculator/shackle-eyebolt' },
  { id: 'SC-033', path: '/calculator/pressure-vessel-shell' },
  { id: 'SC-034', path: '/calculator/pipe-wall-thickness' },
  { id: 'SC-035', path: '/calculator/bolt-torque-preload' },
  { id: 'SC-036', path: '/calculator/bolted-joint' },
  { id: 'SC-037', path: '/calculator/oee-teep' },
  { id: 'SC-038', path: '/calculator/machine-hour-rate' },
  { id: 'SC-040', path: '/calculator/hydraulic-cylinder' }
];

test.describe.configure({ mode: 'parallel' });

for (const tool of tools) {
  test(`LIVE ${tool.id} anonymous demo produces usable output @deep`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(`https://sectorcalc.com${tool.path}?live-demo-matrix=${Date.now()}`, {
      waitUntil: 'domcontentloaded'
    });

    const sample = page.locator('[data-sc-study="sample"]');
    await expect(sample).toBeVisible({ timeout: 30_000 });
    await page.waitForFunction(
      () =>
        Boolean(
          (window as unknown as { __scProGate?: { isEntitled: () => boolean } }).__scProGate
        ),
      undefined,
      { timeout: 30_000 }
    );

    const entitled = await page.evaluate(
      () =>
        (window as unknown as { __scProGate?: { isEntitled: () => boolean } }).__scProGate?.isEntitled() ??
        null
    );
    expect(entitled).toBe(false);

    const expectsReport = (await page.locator('#reportArea .sc-empty').count()) > 0;

    // Schedule a real DOM click. SC-008 performs synchronous Monte Carlo work
    // inside this event, so validation observes the customer-visible outcome
    // rather than waiting for the handler stack itself to return.
    await page.evaluate(() => {
      window.setTimeout(() => {
        (document.querySelector('[data-sc-study="sample"]') as HTMLButtonElement | null)?.click();
      }, 0);
    });

    if (expectsReport) {
      await expect(page.locator('#reportArea .sc-empty')).toHaveCount(0, { timeout: 60_000 });
      await expect
        .poll(
          async () =>
            page.locator('#reportArea').evaluate((el) => (el.textContent || '').trim().length),
          { timeout: 60_000 }
        )
        .toBeGreaterThan(40);
    } else {
      await page.waitForFunction(
        () => {
          const live = document.getElementById('liveResult')?.textContent?.trim() || '';
          const verdict = [
            document.getElementById('verdict'),
            document.getElementById('verdictBanner'),
            document.getElementById('auditBox')
          ]
            .map((el) => el?.textContent?.trim() || '')
            .join(' ');
          const hasKpi = Boolean(document.querySelector('#kpis .kpi, .kpis .kpi'));
          const liveReady = Boolean(live && live !== '—' && !/locked|unlock/i.test(live));
          return liveReady || verdict.length > 10 || hasKpi;
        },
        undefined,
        { timeout: 60_000 }
      );
    }

    const state = await page.evaluate(() => ({
      live: document.getElementById('liveResult')?.textContent?.trim() || null,
      reportPlaceholder: Boolean(document.querySelector('#reportArea .sc-empty')),
      reportTextLength: (document.getElementById('reportArea')?.textContent || '').trim().length,
      verdict: document.getElementById('verdict')?.textContent?.trim() || null
    }));
    console.log(`LIVE_DEMO_MATRIX|${tool.id}|${JSON.stringify(state)}`);
    expect(state.live).not.toMatch(/locked|unlock/i);
    if (expectsReport) expect(state.reportPlaceholder).toBe(false);
  });
}