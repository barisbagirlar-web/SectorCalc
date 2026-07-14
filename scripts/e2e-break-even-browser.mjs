#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const toolPath = "/tools/pro/break-even-survival-cash-calculator";
const artifactsDir = "artifacts/break-even-browser-e2e";
const ownerEmail = (process.env.OWNER_BYPASS_EMAIL ?? "").trim();
const ownerPassword = (process.env.E2E_OWNER_PASSWORD ?? "").trim();
mkdirSync(artifactsDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function outputValue(payload, id) {
  const output = payload.outputs?.find((item) => item.id === id);
  if (!output) throw new Error(`Missing API output: ${id}`);
  return Number(output.value);
}

function assertClose(actual, expected, tolerance, label) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} ± ${tolerance}, received ${actual}`);
  }
}

async function assertTextAbsent(page, labels) {
  for (const label of labels) {
    assert(await page.getByText(label, { exact: false }).count() === 0, `Forbidden cross-tool text leaked into page: ${label}`);
  }
}

async function selectUnitIfPresent(page, label, value) {
  const select = page.getByLabel(label);
  if (await select.count()) await select.selectOption(value);
}

assert(ownerEmail.length > 0, "OWNER_BYPASS_EMAIL is required");
assert(ownerPassword.length >= 12, "E2E_OWNER_PASSWORD is required and must be at least 12 characters");

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const page = await context.newPage();

try {
  const unauthenticatedResponse = await page.goto(`${baseUrl}${toolPath}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  assert(unauthenticatedResponse?.status() === 200, `Unauthenticated tool route returned HTTP ${unauthenticatedResponse?.status()}`);
  await page.getByText("Sign in to access this PRO calculator", { exact: true }).waitFor({ timeout: 30_000 });

  const loginUrl = `${baseUrl}/login?next=${encodeURIComponent(toolPath)}`;
  await page.goto(loginUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.getByPlaceholder("Email address").fill(ownerEmail);
  await page.getByPlaceholder("Password").fill(ownerPassword);

  await Promise.all([
    page.waitForURL((url) => url.pathname === toolPath, { timeout: 60_000 }),
    page.getByRole("button", { name: "Sign in with Email", exact: true }).click(),
  ]);

  await page.getByText("Break-Even & Survival Cash Calculator", { exact: true }).first().waitFor({ timeout: 60_000 });
  await page.locator("[data-renderer='UniversalIndustrialDecisionForm']").waitFor({ timeout: 60_000 });

  const requiredLabels = [
    "Opening Unrestricted Cash Balance",
    "Current Monthly Revenue",
    "Variable Cash Cost Ratio",
    "Forecast Horizon Months",
    "Minimum Cash Reserve",
    "Stressed Revenue Retention Ratio",
    "Monthly Payroll Cash Cost",
    "Monthly Other Fixed Operating Cost",
    "Monthly Debt and Fixed Obligations",
    "Source Confidence Ratio",
    "Uncertainty Coverage Multiplier",
  ];
  for (const label of requiredLabels) {
    assert(await page.getByText(label, { exact: true }).count() > 0, `Missing form label: ${label}`);
  }

  const inputValues = {
    initial_investment: "500000",
    annual_net_cash_flow: "250000",
    discount_rate: "40",
    analysis_years: "12",
    residual_value: "50000",
    stress_downside_factor: "0.8",
    labor_rate: "80000",
    overhead_rate: "30000",
    defect_or_loss_cost: "15000",
    source_confidence_ratio: "0.95",
    uncertainty_multiplier: "2",
  };

  for (const inputId of Object.keys(inputValues)) {
    const input = page.locator(`#sc-v531-input-${inputId}`);
    await input.waitFor({ timeout: 30_000 });
    assert((await input.inputValue()) === "", `NO_DEFAULT contract violated for ${inputId}`);
  }

  await selectUnitIfPresent(page, "Variable Cash Cost Ratio unit", "percent");
  await selectUnitIfPresent(page, "Stressed Revenue Retention Ratio unit", "ratio");
  await selectUnitIfPresent(page, "Source Confidence Ratio unit", "ratio");

  for (const [inputId, value] of Object.entries(inputValues)) {
    await page.locator(`#sc-v531-input-${inputId}`).fill(value);
  }

  await assertTextAbsent(page, [
    "Initial Investment",
    "Annual Net Cash Flow",
    "Discount Rate",
    "Analysis Period",
    "Residual Value",
    "Fully Loaded Labor Rate",
    "Allocated Overhead Rate",
    "Unit Loss Cost",
    "Maximum Absorbed Overhead",
    "FMEA Trigger Flag",
  ]);

  const calculateButton = page.locator(".sc-v531-primary-action").filter({ hasText: /^Calculate$/ }).first();
  await calculateButton.waitFor({ timeout: 30_000 });
  assert(await calculateButton.isEnabled(), "Calculate button is disabled after all required no-default inputs are supplied");

  const executeResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith("/api/pro-calculator/execute") && response.request().method() === "POST",
    { timeout: 60_000 },
  );
  await calculateButton.click();
  const executeResponse = await executeResponsePromise;
  const apiResult = {
    httpStatus: executeResponse.status(),
    payload: await executeResponse.json(),
  };

  assert(apiResult.httpStatus === 200, `Execute API returned HTTP ${apiResult.httpStatus}: ${JSON.stringify(apiResult.payload)}`);
  assert(apiResult.payload.status === "OK", `Expected API status OK, received ${apiResult.payload.status}`);

  assertClose(outputValue(apiResult.payload, "out_contribution_margin_ratio"), 0.6, 1e-12, "Contribution margin ratio");
  assertClose(outputValue(apiResult.payload, "out_monthly_fixed_cash_cost"), 125000, 0.001, "Monthly fixed cash cost");
  assertClose(outputValue(apiResult.payload, "out_break_even_monthly_revenue"), 208333.33333333334, 0.01, "Break-even revenue");
  assertClose(outputValue(apiResult.payload, "out_monthly_revenue_gap_to_break_even"), 41666.666666666664, 0.01, "Revenue gap");
  assertClose(outputValue(apiResult.payload, "out_stressed_monthly_revenue"), 200000, 0.001, "Stressed revenue");
  assertClose(outputValue(apiResult.payload, "out_stressed_monthly_net_cash_flow"), -5000, 0.001, "Stressed monthly cash flow");
  assertClose(outputValue(apiResult.payload, "out_stressed_runway_within_horizon_months"), 12, 1e-12, "Horizon-capped stressed runway");
  assertClose(outputValue(apiResult.payload, "out_stressed_cash_lower_bound"), 194000, 0.001, "Stressed cash lower bound");
  assertClose(outputValue(apiResult.payload, "out_additional_funding_required"), 0, 0.001, "Additional funding required");
  assertClose(outputValue(apiResult.payload, "out_money_at_risk"), 0, 0.001, "Money at risk");
  assertClose(outputValue(apiResult.payload, "out_decision_state"), 0, 0.001, "Decision state");

  const expectedOutputIds = [
    "out_contribution_margin_ratio",
    "out_monthly_variable_cash_cost",
    "out_monthly_contribution",
    "out_monthly_fixed_cash_cost",
    "out_monthly_net_cash_flow",
    "out_break_even_monthly_revenue",
    "out_monthly_revenue_gap_to_break_even",
    "out_stressed_monthly_revenue",
    "out_stressed_monthly_net_cash_flow",
    "out_base_ending_cash",
    "out_stressed_ending_cash",
    "out_minimum_cash_reserve",
    "out_cash_available_above_reserve",
    "out_stressed_monthly_burn",
    "out_stressed_runway_within_horizon_months",
    "out_required_opening_cash_for_stress_horizon",
    "out_additional_funding_required",
    "out_source_confidence_ratio",
    "out_cash_uncertainty",
    "out_stressed_cash_lower_bound",
    "out_stressed_cash_upper_bound",
    "out_money_at_risk",
    "out_primary_cash_cost_driver",
    "out_decision_state",
  ].sort();
  const outputIds = apiResult.payload.outputs.map((item) => item.id).sort();
  assert(JSON.stringify(outputIds) === JSON.stringify(expectedOutputIds), `Unexpected API output namespace: ${outputIds.join(", ")}`);

  await page.getByText("Break-Even Position", { exact: true }).waitFor({ timeout: 60_000 });
  await page.getByText("Cash Forecast", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByText("Survival & Funding", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByText("Control & Evidence", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByText("Stressed Cash Lower Bound", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByText("Cash at Risk Below Reserve", { exact: true }).waitFor({ timeout: 30_000 });

  const report = page.locator('[aria-label="Break-Even & Survival Cash Calculator report"]');
  await report.waitFor({ timeout: 30_000 });
  const reportText = await report.innerText();
  assert(reportText.includes("208,333.33"), "Rendered report does not show the Exact Decimal break-even value");
  assert(reportText.includes("194,000.00"), "Rendered report does not show the stressed lower bound");
  assert(!reportText.includes("Maximum Absorbed Overhead"), "Cross-tool output leaked into rendered report");
  assert(!reportText.includes("FMEA Trigger Flag"), "Generic FMEA output leaked into rendered report");

  await page.screenshot({ path: `${artifactsDir}/tool-page.png`, fullPage: true });
  writeFileSync(`${artifactsDir}/api-result.json`, JSON.stringify(apiResult, null, 2));

  console.log("BREAK_EVEN_BROWSER_E2E=PASS");
} catch (error) {
  await page.screenshot({ path: `${artifactsDir}/failure.png`, fullPage: true }).catch(() => undefined);
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
