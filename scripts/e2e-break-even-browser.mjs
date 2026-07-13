#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const toolPath = "/tools/pro/break-even-survival-cash-calculator";
const artifactsDir = "artifacts/break-even-browser-e2e";
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

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

try {
  const pageResponse = await page.goto(`${baseUrl}${toolPath}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  assert(pageResponse?.status() === 200, `Tool route returned HTTP ${pageResponse?.status()}`);

  await page.getByText("Break-Even & Survival Cash Calculator", { exact: true }).first().waitFor();

  const requiredLabels = [
    "Monthly Fixed Cash Cost",
    "Monthly Debt Service",
    "Contribution Margin Ratio",
    "Current Monthly Revenue",
    "Unrestricted Cash Balance",
    "Minimum Cash Buffer",
    "Target Survival Months",
    "Downside Revenue Retention",
    "Source Confidence Ratio",
    "Uncertainty Coverage Multiplier",
  ];
  for (const label of requiredLabels) {
    assert(await page.getByText(label, { exact: true }).count() > 0, `Missing form label: ${label}`);
  }

  const forbiddenLabels = [
    "Initial Investment",
    "Annual Net Cash Flow",
    "Discount Rate",
    "Residual Value",
    "Maximum Absorbed Overhead",
    "FMEA Trigger Flag",
    "Derating rule D001",
    "Derating rule D002",
  ];
  for (const label of forbiddenLabels) {
    assert(await page.getByText(label, { exact: false }).count() === 0, `Cross-tool label leaked into page: ${label}`);
  }

  const apiResult = await page.evaluate(async ({ ownerEmail }) => {
    const response = await fetch("/api/pro-calculator/execute", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-user-email": ownerEmail,
      },
      body: JSON.stringify({
        tool_key: "break-even-survival-cash-calculator",
        tool_id: "PRO_031",
        raw_inputs: {
          monthly_fixed_cash_cost: 120000,
          monthly_debt_service: 25000,
          contribution_margin_ratio: 42,
          current_monthly_revenue: 420000,
          unrestricted_cash_balance: 750000,
          minimum_cash_buffer: 100000,
          target_survival_months: 6,
          downside_revenue_factor: 70,
          source_confidence_ratio: 90,
          uncertainty_multiplier: 1.15,
        },
        selected_units: {
          monthly_fixed_cash_cost: "currency_unit",
          monthly_debt_service: "currency_unit",
          contribution_margin_ratio: "percent",
          current_monthly_revenue: "currency_unit",
          unrestricted_cash_balance: "currency_unit",
          minimum_cash_buffer: "currency_unit",
          target_survival_months: "month",
          downside_revenue_factor: "percent",
          source_confidence_ratio: "percent",
          uncertainty_multiplier: "ratio",
        },
        display_currency: "EUR",
        user_profile_mode: "engineering",
      }),
    });
    return {
      httpStatus: response.status,
      payload: await response.json(),
    };
  }, { ownerEmail: process.env.OWNER_BYPASS_EMAIL ?? "barisbagirlar@gmail.com" });

  assert(apiResult.httpStatus === 200, `Execute API returned HTTP ${apiResult.httpStatus}: ${JSON.stringify(apiResult.payload)}`);
  assert(apiResult.payload.status === "OK", `Expected API status OK, received ${apiResult.payload.status}`);
  assert(apiResult.payload.decision_interpretation?.primary_decision === "OK", "Decision interpretation is not OK");

  assertClose(outputValue(apiResult.payload, "out_break_even_monthly_revenue"), 345238.1, 0.01, "Break-even revenue");
  assertClose(outputValue(apiResult.payload, "out_current_revenue_gap"), 74761.9, 0.01, "Revenue gap");
  assertClose(outputValue(apiResult.payload, "out_stressed_monthly_revenue"), 294000, 0.01, "Stressed revenue");
  assertClose(outputValue(apiResult.payload, "out_monthly_cash_burn"), 21520, 0.01, "Monthly cash burn");
  assertClose(outputValue(apiResult.payload, "out_cash_runway_months"), 30.2, 0.01, "Cash runway");
  assertClose(outputValue(apiResult.payload, "out_uncertainty_cash_buffer"), 19368, 0.01, "Uncertainty cash buffer");
  assertClose(outputValue(apiResult.payload, "out_survival_cash_target"), 248488, 0.01, "Survival cash target");
  assertClose(outputValue(apiResult.payload, "out_funding_gap"), 0, 0.001, "Funding gap");
  assertClose(outputValue(apiResult.payload, "out_decision_code"), 0, 0.001, "Decision code");

  const outputIds = apiResult.payload.outputs.map((item) => item.id).sort();
  const expectedOutputIds = [
    "out_break_even_monthly_revenue",
    "out_cash_runway_months",
    "out_current_revenue_gap",
    "out_decision_code",
    "out_funding_gap",
    "out_margin_of_safety_ratio",
    "out_monthly_cash_burn",
    "out_source_confidence_ratio",
    "out_stressed_monthly_revenue",
    "out_survival_cash_target",
    "out_target_runway_breached",
    "out_uncertainty_cash_buffer",
  ].sort();
  assert(JSON.stringify(outputIds) === JSON.stringify(expectedOutputIds), `Unexpected API output namespace: ${outputIds.join(", ")}`);

  const warningText = JSON.stringify(apiResult.payload.warnings ?? []);
  assert(!warningText.includes("trigger_inputs"), "Derating configuration warning leaked into API response");
  assert(!warningText.includes("D001") && !warningText.includes("D002"), "Legacy derating rule leaked into API response");

  await page.screenshot({
    path: `${artifactsDir}/tool-page.png`,
    fullPage: true,
  });
  writeFileSync(
    `${artifactsDir}/api-result.json`,
    JSON.stringify(apiResult, null, 2),
  );

  console.log("BREAK_EVEN_BROWSER_E2E=PASS");
} catch (error) {
  await page.screenshot({
    path: `${artifactsDir}/failure.png`,
    fullPage: true,
  }).catch(() => undefined);
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
