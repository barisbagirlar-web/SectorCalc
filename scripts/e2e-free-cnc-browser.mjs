#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const toolPath = "/tools/free/cnc-shop-hourly-rate";
const artifactsDir = "artifacts/break-even-browser-e2e";
mkdirSync(artifactsDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const inputValues = {
  annual_admin_allocation: "10",
  annual_available_machine_hours: "10",
  annual_depreciation: "10",
  annual_fixed_cost: "10",
  annual_floor_cost: "10",
  annual_maintenance_cost: "10",
  annual_operator_cost: "10",
  average_power_kw: "10",
  consumables_per_hour: "10",
  current_shop_rate: "10",
  electricity_rate: "10",
  utilization_percent: "10",
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const page = await context.newPage();

try {
  const routeResponse = await page.goto(`${baseUrl}${toolPath}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  assert(routeResponse?.status() === 200, `Free tool route returned HTTP ${routeResponse?.status()}`);
  await page.getByText("CNC Shop Hourly Rate Calculator", { exact: true }).first().waitFor({ timeout: 60_000 });
  await page.locator("[data-renderer='UniversalIndustrialDecisionForm']").waitFor({ timeout: 60_000 });

  for (const inputId of Object.keys(inputValues)) {
    const input = page.locator(`#sc-v531-input-${inputId}`);
    await input.waitFor({ timeout: 30_000 });
    assert((await input.inputValue()) === "", `NO_DEFAULT contract violated for ${inputId}`);
  }

  for (const [inputId, value] of Object.entries(inputValues)) {
    await page.locator(`#sc-v531-input-${inputId}`).fill(value);
  }

  const calculateButton = page.locator(".sc-v531-primary-action").filter({ hasText: /^Calculate$/ }).first();
  await calculateButton.waitFor({ timeout: 30_000 });
  assert(await calculateButton.isEnabled(), "Free Calculate button is disabled after all required inputs are supplied");

  const executeResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith("/api/tool-execute") && response.request().method() === "POST",
    { timeout: 60_000 },
  );
  await calculateButton.click();
  const executeResponse = await executeResponsePromise;
  const payload = await executeResponse.json();

  assert(executeResponse.status() === 200, `Free execute API returned HTTP ${executeResponse.status()}: ${JSON.stringify(payload)}`);
  assert(payload.status !== "BLOCKED", `Free execute API was blocked: ${JSON.stringify(payload.warnings ?? [])}`);
  assert(payload.redaction_status === "PUBLIC_SAFE_REDACTED", `Unexpected Free redaction status: ${payload.redaction_status}`);
  assert(Array.isArray(payload.outputs) && payload.outputs.length > 0, "Free execute API returned no outputs");

  const hourlyRate = payload.outputs.find((output) => output.id === "hourly_rate");
  assert(hourlyRate, "Free execute API omitted the hourly_rate output");
  assert(Number.isFinite(Number(hourlyRate.value)), `Free hourly_rate is non-finite: ${hourlyRate.value}`);

  const report = page.locator('section[aria-label="Results"] .sc-v531-result-content');
  await report.waitFor({ state: "visible", timeout: 60_000 });
  const reportText = await report.innerText();
  assert(reportText.includes("Hourly Rate"), "Free rendered report omitted the hourly-rate result");
  assert(!reportText.includes("No result yet"), "Free rendered report remained in the empty state");

  await page.screenshot({
    path: `${artifactsDir}/free-cnc-tool-page.png`,
    fullPage: true,
  });
  writeFileSync(
    `${artifactsDir}/free-cnc-api-result.json`,
    JSON.stringify({ httpStatus: executeResponse.status(), payload }, null, 2),
  );

  console.log(`FREE_CNC_BROWSER_E2E=PASS;hourly_rate=${hourlyRate.value};status=${payload.status}`);
} catch (error) {
  await page.screenshot({
    path: `${artifactsDir}/free-cnc-failure.png`,
    fullPage: true,
  }).catch(() => undefined);
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
