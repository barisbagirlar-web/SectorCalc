#!/usr/bin/env npx tsx

import { mkdirSync, writeFileSync } from "node:fs";
import { chromium, type BrowserContext, type Page } from "playwright";

import { getAllModules } from "../src/sectorcalc/formulas/pro-v531/resolve-formula-module";
import { preservePhysicalQuantity } from "../src/sectorcalc/pro-form/unit-normalizer";
import { getProReportContract } from "../src/sectorcalc/pro-report/pro-report-contract-registry";
import { resolveApprovedToolSchema } from "../src/sectorcalc/runtime/resolve-approved-tool-schema";
import type { SuperV4Input, SuperV4Schema } from "../src/sectorcalc/pro-form/contract-types";

const baseUrl = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const ownerEmail = process.env.OWNER_BYPASS_EMAIL;
const ownerPassword = process.env.E2E_OWNER_PASSWORD;
const artifactsDir = "artifacts/pro-live-browser-e2e";

if (!ownerEmail || !ownerPassword) {
  throw new Error("OWNER_BYPASS_EMAIL and E2E_OWNER_PASSWORD are required; no credentials are embedded in source.");
}

mkdirSync(artifactsDir, { recursive: true });

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function targetDisplayUnit(input: SuperV4Input): string {
  if (input.allowed_display_units.includes(input.base_unit ?? "")) {
    return input.base_unit ?? "";
  }
  return input.allowed_display_units[0] ?? input.base_unit ?? "";
}

function displayValueForInput(
  schema: SuperV4Schema,
  input: SuperV4Input,
  normalizedSampleValue: number,
  displayUnit: string,
): number {
  const baseUnit = input.base_unit ?? displayUnit;
  if (baseUnit === displayUnit) return normalizedSampleValue;

  const converted = preservePhysicalQuantity(
    normalizedSampleValue,
    baseUnit,
    displayUnit,
    input.quantity_kind,
    schema.unit_conversion_contract.conversion_registry,
  );
  if ("newValue" in converted) return converted.newValue;

  // Weld density is intentionally fixed in g/cm³ at the UI and normalized to
  // kg/m³ on the server. Keep this explicit fallback as an independent E2E
  // oracle instead of silently submitting a base-unit value under a display label.
  if (
    input.id === "weld_density" &&
    baseUnit === "kg_per_m3" &&
    displayUnit === "g_per_cm3"
  ) {
    return normalizedSampleValue / 1000;
  }

  throw new Error(`${schema.tool_key}/${input.id}: ${converted.reason}`);
}

async function signIn(context: BrowserContext, firstToolPath: string): Promise<Page> {
  const page = await context.newPage();
  const loginUrl = `${baseUrl}/login?next=${encodeURIComponent(firstToolPath)}`;
  await page.goto(loginUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.getByPlaceholder("Email address").fill(ownerEmail);
  await page.getByPlaceholder("Password").fill(ownerPassword);
  await Promise.all([
    page.waitForURL((url) => url.pathname === firstToolPath, { timeout: 60_000 }),
    page.getByRole("button", { name: "Sign in with Email", exact: true }).click(),
  ]);
  return page;
}

async function fillSchemaInputs(
  page: Page,
  schema: SuperV4Schema,
  sampleInputs: Record<string, number>,
): Promise<void> {
  const renderedInputs = page.locator("input[id^='sc-v531-input-']");
  await renderedInputs.first().waitFor({ timeout: 60_000 });
  assert(
    (await renderedInputs.count()) === schema.inputs.length,
    `${schema.tool_key}: expected ${schema.inputs.length} rendered inputs, found ${await renderedInputs.count()}`,
  );

  for (const input of schema.inputs) {
    assert(input.normalized_id, `${schema.tool_key}/${input.id}: missing normalized_id`);
    const normalizedValue = sampleInputs[input.normalized_id];
    assert(
      isFiniteNumber(normalizedValue),
      `${schema.tool_key}/${input.id}: sample missing ${input.normalized_id}`,
    );

    const unit = targetDisplayUnit(input);
    assert(unit.length > 0, `${schema.tool_key}/${input.id}: no display unit`);
    const displayValue = displayValueForInput(schema, input, normalizedValue, unit);
    assert(
      Number.isFinite(displayValue),
      `${schema.tool_key}/${input.id}: display value is non-finite`,
    );

    if (input.unit_selectable) {
      const unitSelect = page.getByLabel(`${input.name} unit`);
      await unitSelect.waitFor({ timeout: 30_000 });
      await unitSelect.selectOption(unit);
      assert(
        (await unitSelect.inputValue()) === unit,
        `${schema.tool_key}/${input.id}: unit selector did not retain ${unit}`,
      );
    }

    const field = page.locator(`#sc-v531-input-${input.id}`);
    await field.waitFor({ timeout: 30_000 });
    await field.fill(String(displayValue));
    const parsed = Number((await field.inputValue()).replace(",", "."));
    assert(
      Number.isFinite(parsed),
      `${schema.tool_key}/${input.id}: filled value did not remain numeric`,
    );
  }

  const evidenceCheckboxes = page.locator(".sc-v531-field-evidence input[type='checkbox']");
  for (let index = 0; index < await evidenceCheckboxes.count(); index += 1) {
    await evidenceCheckboxes.nth(index).check();
  }
}

async function executeAndVerify(
  page: Page,
  schema: SuperV4Schema,
): Promise<Record<string, unknown>> {
  const button = page.locator(".sc-v531-primary-action").first();
  await button.waitFor({ timeout: 30_000 });
  assert(await button.isEnabled(), `${schema.tool_key}: primary action is disabled`);
  const buttonText = (await button.innerText()).trim();
  assert(buttonText.length > 0, `${schema.tool_key}: primary action is blank`);

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/pro-calculator/execute") &&
      response.request().method() === "POST",
    { timeout: 60_000 },
  );
  await button.click();
  const response = await responsePromise;
  const payload = (await response.json()) as Record<string, unknown>;

  assert(response.status() === 200, `${schema.tool_key}: execute HTTP ${response.status()} ${JSON.stringify(payload)}`);
  assert(
    payload.status === "OK" || payload.status === "REVIEW",
    `${schema.tool_key}: unexpected API status ${String(payload.status)}`,
  );
  const outputs = payload.outputs;
  assert(Array.isArray(outputs), `${schema.tool_key}: outputs missing`);
  assert(outputs.length === schema.outputs.length, `${schema.tool_key}: output count mismatch`);
  for (const output of outputs as Array<Record<string, unknown>>) {
    assert(typeof output.id === "string", `${schema.tool_key}: output id missing`);
    assert(isFiniteNumber(output.value), `${schema.tool_key}/${String(output.id)}: non-finite output`);
  }

  const auditSeal = payload.audit_seal as Record<string, unknown> | undefined;
  assert(auditSeal?.seal_status === "SEALED", `${schema.tool_key}: audit seal is not SEALED`);
  assert(auditSeal?.hash_algorithm === "SHA-256", `${schema.tool_key}: audit hash is not SHA-256`);
  assert(auditSeal?.signature_status === "UNSIGNED", `${schema.tool_key}: signature status is not honest`);

  const report = page.locator(`[aria-label="${schema.title} report"]`);
  await report.waitFor({ timeout: 60_000 });
  const reportText = await report.innerText();
  assert(reportText.trim().length > 100, `${schema.tool_key}: report body is empty`);
  assert(reportText.includes("Input Trace"), `${schema.tool_key}: report input trace missing`);
  assert(!/\bcompetitive\b/i.test(reportText), `${schema.tool_key}: unsupported competitive claim leaked`);
  assert(!/cost-efficient/i.test(reportText), `${schema.tool_key}: unsupported cost-efficiency claim leaked`);
  assert(!/ISO certified/i.test(reportText), `${schema.tool_key}: unsupported certification claim leaked`);

  const reportContract = getProReportContract(schema.tool_key);
  assert(reportContract, `${schema.tool_key}: report contract missing`);
  for (const reportSection of reportContract.sections) {
    assert(
      reportText.includes(reportSection.sectionTitle),
      `${schema.tool_key}: report section missing: ${reportSection.sectionTitle}`,
    );
  }

  return payload;
}

async function verifyMobileForm(context: BrowserContext, schema: SuperV4Schema): Promise<void> {
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/tools/pro/${schema.tool_key}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  await page.locator("[data-renderer='UniversalIndustrialDecisionForm']").waitFor({ timeout: 60_000 });
  assert(
    (await page.locator("input[id^='sc-v531-input-']").count()) === schema.inputs.length,
    `${schema.tool_key}: mobile input count mismatch`,
  );
  const width = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  assert(width.document <= width.viewport + 1, `${schema.tool_key}: mobile horizontal overflow`);
  await page.close();
}

const modules = getAllModules();
assert(modules.length === 20, `Expected 20 LIVE PRO modules, found ${modules.length}`);

const resolvedTools = modules.map((module) => {
  const resolved = resolveApprovedToolSchema(module.toolKey);
  assert(resolved.ok, `${module.toolKey}: ${resolved.errors.join(" | ")}`);
  return { module, schema: resolved.schema };
});

const browser = await chromium.launch({ headless: true });
const desktopContext = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  reducedMotion: "reduce",
});
const results: Array<Record<string, unknown>> = [];

try {
  const firstPath = `/tools/pro/${resolvedTools[0].schema.tool_key}`;
  const page = await signIn(desktopContext, firstPath);

  for (const { module, schema } of resolvedTools) {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const onConsole = (message: { type(): string; text(): string }) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    };
    const onPageError = (error: Error) => pageErrors.push(error.message);
    page.on("console", onConsole);
    page.on("pageerror", onPageError);

    try {
      const response = await page.goto(`${baseUrl}/tools/pro/${schema.tool_key}`, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      assert(response?.status() === 200, `${schema.tool_key}: route HTTP ${response?.status()}`);
      await page.locator("[data-renderer='UniversalIndustrialDecisionForm']").waitFor({ timeout: 60_000 });
      await fillSchemaInputs(page, schema, module.sampleInputs);
      const payload = await executeAndVerify(page, schema);
      assert(consoleErrors.length === 0, `${schema.tool_key}: console errors ${consoleErrors.join(" | ")}`);
      assert(pageErrors.length === 0, `${schema.tool_key}: page errors ${pageErrors.join(" | ")}`);

      await page.screenshot({
        path: `${artifactsDir}/${schema.tool_key}.png`,
        fullPage: true,
      });
      results.push({
        toolKey: schema.tool_key,
        status: "PASS",
        inputCount: schema.inputs.length,
        outputCount: schema.outputs.length,
        apiStatus: payload.status,
      });
    } finally {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
    }
  }

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  try {
    // Reuse authenticated state from the desktop context via storage state.
    const state = await desktopContext.storageState();
    await mobileContext.close();
    const authenticatedMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
      storageState: state,
    });
    try {
      for (const { schema } of resolvedTools) {
        await verifyMobileForm(authenticatedMobile, schema);
      }
    } finally {
      await authenticatedMobile.close();
    }
  } catch (error) {
    await mobileContext.close().catch(() => undefined);
    throw error;
  }

  writeFileSync(
    `${artifactsDir}/result.json`,
    JSON.stringify({ status: "PASS", results }, null, 2),
  );
  console.log("PRO_LIVE_BROWSER_E2E=PASS");
} catch (error) {
  writeFileSync(
    `${artifactsDir}/result.json`,
    JSON.stringify(
      {
        status: "FAIL",
        results,
        error: error instanceof Error ? error.stack : String(error),
      },
      null,
      2,
    ),
  );
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
} finally {
  await desktopContext.close();
  await browser.close();
}
