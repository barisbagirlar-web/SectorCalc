#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
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
    assert(await page.getByText(label, { exact: false }).count() === 0, `Forbidden text leaked into page: ${label}`);
  }
}

async function validatePdf(pdfPath, label) {
  const bytes = readFileSync(pdfPath);
  assert(bytes.length >= 10_000, `${label}: suspiciously small PDF (${bytes.length} bytes)`);
  assert(bytes.length <= 25_000_000, `${label}: PDF exceeds 25 MB (${bytes.length} bytes)`);

  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  const pageCount = pdf.getPageCount();
  assert(pageCount >= 1, `${label}: zero-page PDF`);
  assert(pageCount <= 20, `${label}: unexpected page count ${pageCount}`);

  const metadata = `${pdf.getTitle() ?? ""} ${pdf.getSubject() ?? ""} ${pdf.getKeywords() ?? ""}`;
  assert(metadata.includes("SectorCalc"), `${label}: metadata does not identify SectorCalc`);

  const sha256 = createHash("sha256").update(bytes).digest("hex");
  writeFileSync(`${pdfPath}.sha256`, `${sha256}  ${pdfPath.split("/").pop()}\n`, "utf8");
  return { bytes: bytes.length, pageCount, sha256 };
}

assert(ownerEmail.length > 0, "OWNER_BYPASS_EMAIL is required; no credential fallback is permitted");
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

  await assertTextAbsent(page, [
    "Initial Investment",
    "Annual Net Cash Flow",
    "Discount Rate",
    "Residual Value",
    "Maximum Absorbed Overhead",
    "FMEA Trigger Flag",
    "Derating rule D001",
    "Derating rule D002",
  ]);

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

  const expectedInitialValues = {
    monthly_fixed_cash_cost: "120000",
    monthly_debt_service: "25000",
    contribution_margin_ratio: "42",
    current_monthly_revenue: "420000",
    unrestricted_cash_balance: "750000",
    minimum_cash_buffer: "100000",
    target_survival_months: "6",
    downside_revenue_factor: "70",
    source_confidence_ratio: "90",
    uncertainty_multiplier: "1.15",
  };

  for (const [inputId, expectedValue] of Object.entries(expectedInitialValues)) {
    const input = page.locator(`#sc-v531-input-${inputId}`);
    await input.waitFor({ timeout: 30_000 });
    const actualValue = await input.inputValue();
    assert(actualValue === expectedValue, `Incorrect initialized value for ${inputId}: expected ${expectedValue}, received ${actualValue}`);
  }

  assert(
    await page.getByLabel("Contribution Margin Ratio unit").inputValue() === "percent",
    "Contribution Margin Ratio did not initialize in percent display units",
  );
  assert(
    await page.getByLabel("Downside Revenue Retention unit").inputValue() === "percent",
    "Downside Revenue Retention did not initialize in percent display units",
  );
  assert(
    await page.getByLabel("Source Confidence Ratio unit").inputValue() === "percent",
    "Source Confidence Ratio did not initialize in percent display units",
  );

  await page.getByLabel("Display currency").selectOption("EUR");
  assert(await page.getByLabel("Display currency").inputValue() === "EUR", "Display currency did not remain EUR");

  const evidenceCheckboxes = page.locator(".sc-v531-field-evidence input[type='checkbox']");
  const evidenceCheckboxCount = await evidenceCheckboxes.count();
  assert(evidenceCheckboxCount === 20, `Expected 20 evidence checkboxes, found ${evidenceCheckboxCount}`);
  for (let index = 0; index < evidenceCheckboxCount; index += 1) {
    await evidenceCheckboxes.nth(index).check();
  }

  await assertTextAbsent(page, [
    "Initial Investment",
    "Annual Net Cash Flow",
    "Discount Rate",
    "Residual Value",
    "Maximum Absorbed Overhead",
    "FMEA Trigger Flag",
    "Derating rule D001",
    "Derating rule D002",
  ]);

  const calculateButton = page.locator(".sc-v531-primary-action").filter({ hasText: /^Calculate$/ }).first();
  await calculateButton.waitFor({ timeout: 30_000 });
  assert(await calculateButton.isEnabled(), "Calculate button is disabled after authenticated owner bypass initialization");

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

  await page.getByText("Break-Even Position", { exact: true }).waitFor({ timeout: 60_000 });
  await page.getByText("Survival Cash Stress", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByText("Control & Evidence", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByText("Break-Even Monthly Revenue", { exact: true }).waitFor({ timeout: 30_000 });
  await page.getByText("Funding Gap to Target", { exact: true }).waitFor({ timeout: 30_000 });

  const report = page.locator('[aria-label="Break-Even & Survival Cash Calculator report"]');
  await report.waitFor({ timeout: 30_000 });
  const reportText = await report.innerText();
  assert(reportText.includes("345,238.10"), "Rendered report does not show the exact break-even known-answer value");
  assert(reportText.includes("30.20"), "Rendered report does not show the exact runway known-answer value");
  assert(reportText.includes("248,488.00"), "Rendered report does not show the exact survival cash target known-answer value");
  assert(reportText.includes("EUR"), "Rendered report does not preserve the selected EUR display currency");
  assert(!reportText.includes("USD"), "Hardcoded USD leaked into the EUR report");
  assert(!reportText.includes("Maximum Absorbed Overhead"), "Generic capital-appraisal output leaked into rendered report");
  assert(!reportText.includes("FMEA Trigger Flag"), "Generic FMEA output leaked into rendered report");

  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const reportNode = document.querySelector('[aria-label="Break-Even & Survival Cash Calculator report"]');
    return {
      documentHorizontal: root.scrollWidth > root.clientWidth + 2,
      reportHorizontal: reportNode instanceof HTMLElement && reportNode.scrollWidth > reportNode.clientWidth + 2,
    };
  });
  assert(!overflow.documentHorizontal, "Document has horizontal print overflow");
  assert(!overflow.reportHorizontal, "Report has horizontal print overflow");

  await page.screenshot({
    path: `${artifactsDir}/tool-page.png`,
    fullPage: true,
  });
  writeFileSync(
    `${artifactsDir}/api-result.json`,
    JSON.stringify(apiResult, null, 2),
  );

  await page.evaluate(() => {
    document.title = "SectorCalc — Break-Even & Survival Cash Calculator";
  });
  await page.emulateMedia({ media: "print" });

  const firstPdfPath = `${artifactsDir}/break-even-survival-cash-report-a4.pdf`;
  const repeatPdfPath = `${artifactsDir}/break-even-survival-cash-report-a4-repeat.pdf`;
  const pdfOptions = {
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    tagged: true,
    outline: true,
    margin: { top: "12mm", right: "10mm", bottom: "14mm", left: "10mm" },
  };
  await page.pdf({ path: firstPdfPath, ...pdfOptions });
  await page.pdf({ path: repeatPdfPath, ...pdfOptions });

  const firstPdf = await validatePdf(firstPdfPath, "primary PDF");
  const repeatPdf = await validatePdf(repeatPdfPath, "repeat PDF");
  assert(firstPdf.pageCount === repeatPdf.pageCount, "Repeat PDF page count changed");
  const sizeDelta = Math.abs(firstPdf.bytes - repeatPdf.bytes);
  const allowedDelta = Math.max(4096, Math.round(firstPdf.bytes * 0.02));
  assert(sizeDelta <= allowedDelta, `Repeat PDF size drift too high: delta=${sizeDelta};allowed=${allowedDelta}`);

  writeFileSync(
    `${artifactsDir}/pdf-evidence.json`,
    JSON.stringify({
      title: "SectorCalc — Break-Even & Survival Cash Calculator",
      format: "A4",
      primary: firstPdf,
      repeat: repeatPdf,
      sizeDelta,
      allowedDelta,
    }, null, 2),
  );

  console.log("BREAK_EVEN_BROWSER_E2E=PASS");
  console.log("PRO_PDF_EVIDENCE=PASS");
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
