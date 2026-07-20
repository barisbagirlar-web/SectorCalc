#!/usr/bin/env node

/**
 * Break-Even browser E2E against the dedicated bespoke page:
 *   src/app/tools/pro/break-even-survival-cash-calculator/page.tsx
 *   → BreakEvenSurvivalCashToolPage (be-shell), NOT UniversalIndustrialDecisionForm.
 *
 * Root cause of prior "flake": test asserted ProToolPaywallGate copy that this
 * route no longer renders. Failure was deterministic product/UI drift, not timing.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const toolPath = "/tools/pro/break-even-survival-cash-calculator";
const artifactsDir = "artifacts/break-even-browser-e2e";
const ownerEmail = process.env.OWNER_BYPASS_EMAIL ?? "barisbagirlar@gmail.com";
const ownerPassword = process.env.E2E_OWNER_PASSWORD ?? "SectorCalc-E2E-Only-2026!";
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
    assert(
      (await page.getByText(label, { exact: false }).count()) === 0,
      `Forbidden text leaked into page: ${label}`,
    );
  }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const page = await context.newPage();

try {
  const unauthenticatedResponse = await page.goto(`${baseUrl}${toolPath}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  assert(
    unauthenticatedResponse?.status() === 200,
    `Tool route returned HTTP ${unauthenticatedResponse?.status()}`,
  );

  await page.locator(".be-shell").waitFor({ state: "visible", timeout: 60_000 });
  await page.getByRole("heading", { name: "Break-Even & Survival Cash Calculator", exact: true }).waitFor({
    state: "visible",
    timeout: 30_000,
  });
  await page.getByRole("button", { name: "Unlock sealed report · 1 credit" }).waitFor({
    state: "visible",
    timeout: 30_000,
  });

  await assertTextAbsent(page, [
    "Initial Investment",
    "Annual Net Cash Flow",
    "Discount Rate",
    "Residual Value",
    "Maximum Absorbed Overhead",
    "FMEA Trigger Flag",
    "Derating rule D001",
    "Derating rule D002",
    "Sign in to access this PRO calculator",
  ]);

  const loginUrl = `${baseUrl}/login?next=${encodeURIComponent(toolPath)}`;
  await page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.getByPlaceholder("Email address").fill(ownerEmail);
  await page.getByPlaceholder("Password").fill(ownerPassword);

  // Client-side Firebase Auth + router.replace — do not rely on full document
  // navigation "load". Fail fast on visible auth errors (CSP/emulator/network).
  await page.getByRole("button", { name: "Sign in with Email", exact: true }).click();

  const leftLogin = page.waitForURL(
    (url) => url.pathname !== "/login",
    { timeout: 60_000, waitUntil: "domcontentloaded" },
  );
  const authError = (async () => {
    const err = page
      .locator("[data-auth-state='ready']")
      .getByText(/signInErrors\.|Authentication failed|network|invalid/i)
      .first();
    await err.waitFor({ state: "visible", timeout: 60_000 });
    const text = (await err.textContent())?.trim() || "unknown auth error";
    throw new Error(`Login failed on /login (auth UI error): ${text}`);
  })();

  await Promise.race([leftLogin, authError]);

  // Explicit next= tool path wins; if admin claim redirected elsewhere, recover.
  if (!page.url().includes(toolPath)) {
    await page.goto(`${baseUrl}${toolPath}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  }

  await page.locator(".be-shell").waitFor({ state: "visible", timeout: 60_000 });
  await page.getByRole("heading", { name: "Break-Even & Survival Cash Calculator", exact: true }).waitFor({
    state: "visible",
    timeout: 60_000,
  });

  // Owner bypass auto-unlocks session → CTA becomes Generate sealed report.
  const generateButton = page.getByRole("button", { name: "Generate sealed report" });
  await generateButton.waitFor({ state: "visible", timeout: 60_000 });

  const fieldValues = {
    in_n_monthly_fixed_cash_cost: "120000",
    in_n_monthly_debt_service: "25000",
    in_n_contribution_margin_ratio: "42",
    in_n_current_monthly_revenue: "420000",
    in_n_unrestricted_cash_balance: "750000",
    in_n_target_survival_months: "6",
    in_n_downside_revenue_factor: "70",
    in_n_minimum_cash_buffer: "100000",
    in_n_source_confidence_ratio: "90",
    in_n_uncertainty_multiplier: "1.15",
  };

  for (const [id, value] of Object.entries(fieldValues)) {
    const input = page.locator(`#${id}`);
    await input.waitFor({ timeout: 30_000 });
    await input.fill(value);
  }

  await page.locator("#be-curSel").selectOption("€");

  const requiredLabels = [
    "Monthly fixed cash cost",
    "Monthly debt service",
    "Contribution margin ratio",
    "Current monthly revenue",
    "Unrestricted cash balance",
    "Minimum cash buffer",
    "Target cash runway (months)",
    "Downside revenue factor",
    "Source confidence",
    "Uncertainty multiplier",
  ];
  for (const label of requiredLabels) {
    assert((await page.getByText(label, { exact: true }).count()) > 0, `Missing form label: ${label}`);
  }

  await assertTextAbsent(page, [
    "Initial Investment",
    "Annual Net Cash Flow",
    "Discount Rate",
    "Residual Value",
    "Maximum Absorbed Overhead",
    "FMEA Trigger Flag",
  ]);

  assert(await generateButton.isEnabled(), "Generate sealed report disabled after owner bypass + valid inputs");

  let authHeader = null;
  const onRequest = (request) => {
    if (request.url().includes("/api/pro-calculator/execute") && request.method() === "POST") {
      authHeader = request.headers().authorization ?? null;
    }
  };
  page.on("request", onRequest);

  await generateButton.click();

  await page.getByRole("heading", { name: "Break-Even & Survival Cash — proof report" }).waitFor({
    timeout: 60_000,
  });
  const report = page.locator(".be-report");
  await report.waitFor({ timeout: 30_000 });
  const reportText = await report.innerText();
  assert(reportText.includes("SEAL"), "Rendered report missing SEAL marker");
  assert(!reportText.includes("Maximum Absorbed Overhead"), "Generic capital-appraisal output leaked into rendered report");
  assert(!reportText.includes("FMEA Trigger Flag"), "Generic FMEA output leaked into rendered report");

  page.off("request", onRequest);
  assert(authHeader, "UI execute request did not send Authorization header");

  // Deterministic API assert via Playwright request (independent of page fetch races).
  const apiInputs = {
    monthly_fixed_cash_cost: 120000,
    monthly_debt_service: 25000,
    contribution_margin_ratio: 0.42,
    current_monthly_revenue: 420000,
    unrestricted_cash_balance: 750000,
    target_survival_months: 6,
    downside_revenue_factor: 0.7,
    minimum_cash_buffer: 100000,
    source_confidence_ratio: 0.9,
    uncertainty_multiplier: 1.15,
  };

  const executeResponse = await page.request.post(`${baseUrl}/api/pro-calculator/execute`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    data: {
      tool_key: "break-even-survival-cash-calculator",
      raw_inputs: apiInputs,
      selected_units: {},
      usageSessionId: "bypass-unlimited",
    },
  });
  const apiResult = {
    httpStatus: executeResponse.status(),
    payload: await executeResponse.json(),
  };

  assert(
    apiResult.httpStatus === 200,
    `Execute API returned HTTP ${apiResult.httpStatus}: ${JSON.stringify(apiResult.payload)}`,
  );
  assert(
    apiResult.payload.status === "OK",
    `Expected API status OK, received ${apiResult.payload.status}: ${JSON.stringify({
      pipeline_state: apiResult.payload.pipeline_state,
      diagnostic: apiResult.payload.diagnostic,
    })}`,
  );
  assert(
    apiResult.payload.decision_interpretation?.primary_decision === "OK",
    "Decision interpretation is not OK",
  );

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
  assert(
    JSON.stringify(outputIds) === JSON.stringify(expectedOutputIds),
    `Unexpected API output namespace: ${outputIds.join(", ")}`,
  );

  const warningText = JSON.stringify(apiResult.payload.warnings ?? []);
  assert(!warningText.includes("trigger_inputs"), "Derating configuration warning leaked into API response");
  assert(!warningText.includes("D001") && !warningText.includes("D002"), "Legacy derating rule leaked into API response");

  await page.screenshot({ path: `${artifactsDir}/tool-page.png`, fullPage: true });
  writeFileSync(`${artifactsDir}/api-result.json`, JSON.stringify(apiResult, null, 2));

  console.log("BREAK_EVEN_BROWSER_E2E=PASS");
} catch (error) {
  await page.screenshot({ path: `${artifactsDir}/failure.png`, fullPage: true }).catch(() => undefined);
  writeFileSync(`${artifactsDir}/failure.html`, await page.content().catch(() => ""));
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
