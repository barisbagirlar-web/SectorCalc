import { test, expect } from '@playwright/test';
import { catalog, waitForGateState } from '../helpers/regression';

/**
 * @gate @critical — Free result preview (ENABLE_FREE_RESULT_PREVIEW).
 *
 * Mandate Task 5 gate: an anonymous/no-credit user must see the numeric
 * result on a Tier-A calculator; the report/export/save layer stays behind
 * the paywall.
 */
const SC_021 = catalog.paidTools.find((t) => t.id === 'SC-021');
if (!SC_021) throw new Error('SC-021 missing from catalog');

test.describe('Free result preview: numeric result visible, report layer gated @gate @critical', () => {
  test('SC-008 (module page): live result numeric, Generate Report hits the paywall', async ({
    page
  }) => {
    await page.goto('/calculator/tolerance-stack-up');
    const state = await waitForGateState(page);
    test.skip(state !== 'locked', `free preview not enforced here (state=${state})`);

    // Paywall surface present (session-less → sign-in prompt).
    await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toBeVisible();

    // Numeric result visible without a session.
    await expect(page.locator('#liveResult')).toContainText(/[-+−]?\d+(\.\d+)?/, {
      timeout: 20_000
    });
    const initial = (await page.locator('#liveResult').textContent()) || '';
    expect(initial.trim()).not.toBe('Locked');
    expect(initial.trim()).not.toBe('-');
    expect(initial.trim()).not.toBe('—');

    // Fill a dimension tolerance and calculate → result updates, still visible.
    const tol = page.locator('#dimList input[data-f="tolerance"]').first();
    await expect(tol).toBeEditable();
    await tol.fill('0.5');
    await expect(page.locator('#liveResult')).toContainText(/[-+−]?\d+(\.\d+)?/);

    // Generate Report must NOT render a report; the paywall prompt fires.
    await page.locator('#genReport').click();
    await expect(page.locator('#reportArea .sc-report-hd')).toHaveCount(0);
    await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toBeInViewport();
  });

  test('SC-021 (inline page): KPI results visible, audit/export layer locked', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, '__scClipWrites', { value: 0, configurable: true });
      if (navigator.clipboard) {
        navigator.clipboard.writeText = () => {
          (window as unknown as { __scClipWrites: number }).__scClipWrites += 1;
          return Promise.resolve();
        };
      }
    });

    await page.goto(SC_021.canonicalPath);
    const state = await waitForGateState(page);
    test.skip(state !== 'locked', `free preview not enforced here (state=${state})`);

    // Numeric results visible: verdict + KPI values.
    await expect(page.locator('#verdict')).toBeVisible();
    const verdict = (await page.locator('#verdict').textContent()) || '';
    expect(verdict).toMatch(/RELEASED|ACCEPTED|REJECTED|CONDITIONALLY|FAIL/i);
    await expect(page.locator('#kpis .kpi .v').first()).not.toBeEmpty();

    // Inputs editable (no gate lock), calculation re-runs on edit.
    const probe = page
      .locator('.sc-sidebar input[type="number"], .wrap input[type="number"]')
      .first();
    await expect(probe).toBeEditable();
    await probe.fill('200');
    await expect(page.locator('#verdict')).toBeVisible();

    // Report layer locked: audit content hidden, export click → paywall, no clipboard write.
    const audit = page.locator('.audit.panel');
    await expect(audit).toBeAttached();
    await expect(audit.locator('.panel-b').first()).toBeHidden();
    await audit.locator('.panel-h button, .panel-h .btn3').first().click();
    await expect(page.locator('#sc-pro-gate-root .sc-pro-gate')).toBeInViewport();
    const clipWrites = await page.evaluate(
      () => (window as unknown as { __scClipWrites: number }).__scClipWrites
    );
    expect(clipWrites).toBe(0);
  });
});
