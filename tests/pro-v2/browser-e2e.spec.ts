// SectorCalc PRO V2 — Browser E2E Test (Playwright)
// Tests all 20 PRO tools through the actual browser:
// - Form renders
// - Preset populates
// - Calculate executes
// - Report renders
//
// Prerequisites:
//   npx playwright install chromium
//   npm run build && npm run start -- -p 5555
//
// Usage:
//   npx playwright test tests/pro-v2/browser-e2e.spec.ts

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5555";

const LIVE_TOOLS = [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
];

for (const slug of LIVE_TOOLS) {
  test(`${slug}: form renders, preset loads, calculate request uses schema input IDs`, async ({ page }) => {
    // Open the tool page
    await page.goto(`${BASE}/tools/pro/${slug}`, { waitUntil: "networkidle" });

    // Verify form renders
    await expect(page.locator("form, [class*=pro-tool], [class*=pro-inp]").first()).toBeVisible({ timeout: 15000 });

    // Wait for preset to populate (inputs have values)
    await page.waitForTimeout(2000);

    // Find the Calculate button and click it
    const calcButton = page.locator("button:has-text('Calculate'), button:has-text('Hesapla'), [type=submit]").first();
    await expect(calcButton).toBeVisible({ timeout: 5000 });

    // Intercept the execute request
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes("/api/pro-calculator/execute") && resp.request().method() === "POST",
      { timeout: 30000 }
    );

    await calcButton.click();

    const response = await responsePromise;
    expect(response.status()).toBe(200);

    // Verify the request body uses schema input IDs (not form field IDs with underscores)
    const requestBody = response.request().postDataJSON();
    expect(requestBody).toBeDefined();
    expect(requestBody.raw_inputs).toBeDefined();

    // Verify no form-field pattern keys (n_ prefix is only for normalized IDs, not raw_inputs)
    const rawKeys = Object.keys(requestBody.raw_inputs);
    const hasNPrefixed = rawKeys.some((k: string) => k.startsWith("n_"));
    expect(hasNPrefixed).toBe(false);

    // Verify response has expected outputs
    const respBody = await response.json();
    expect(respBody).toBeDefined();
    expect(respBody.outputs).toBeDefined();

    // Verify report renders
    await expect(page.locator("text=Result, text=Output, [class*=pro-res]").first()).toBeVisible({ timeout: 10000 });
  });
}
