import { chromium } from "playwright";

const SLUG = "break-even-survival-cash-calculator";
const URL = `https://sectorcalc.com/tools/pro/${SLUG}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  storageState: ".sentinel/auth/owner.json",
});
const page = await context.newPage();

// Collect console errors
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

// Collect network errors
const networkErrors = [];
page.on("response", (response) => {
  if (response.status() >= 400) {
    networkErrors.push(`${response.url()} → ${response.status()}`);
  }
});

try {
  console.log(`\n=== Loading ${URL} ===`);
  const res = await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  console.log(`HTTP Status: ${res?.status()}`);

  // Wait for form
  await page.waitForSelector("section[class*=sc-v531-shell]", { timeout: 30000 });
  console.log("Form section found");

  // Check attributes
  const runtimeReady = await page.getAttribute("section[class*=sc-v531-shell]", "data-pro-runtime-ready");
  console.log("data-pro-runtime-ready:", runtimeReady);

  const proForm = await page.getAttribute("section[class*=sc-v531-shell]", "data-pro-v2-form");
  console.log("data-pro-v2-form:", proForm);

  // Check execution state
  const execState = await page.getAttribute("section[class*=sc-v531-shell]", "data-execution-state");
  console.log("Execution state attr:", execState);

  // Wait for initial render
  await page.waitForTimeout(2000);

  // Check Calculate button
  const calcBtn = page.locator("button", { hasText: /Calculate|Recalculate/ });
  const calcExists = (await calcBtn.count()) > 0;
  console.log("Calculate button exists:", calcExists);
  if (calcExists) {
    const calcDisabled = await calcBtn.first().isDisabled();
    const calcText = await calcBtn.first().textContent();
    console.log("Calculate disabled:", calcDisabled, "text:", calcText);
  }

  // Check for aria-invalid on inputs
  const invalidInputs = await page.locator('[aria-invalid="true"]').count();
  console.log("aria-invalid inputs:", invalidInputs);

  // Count visible number inputs
  const numberInputs = await page.locator('input[type="number"]').count();
  console.log("Number inputs visible:", numberInputs);

  // Check for paywall gate
  const paywall = page.locator('[class*=paywall], [class*=ProToolPaywall]');
  const paywallCount = await paywall.count();
  console.log("Paywall elements:", paywallCount);

  // Console errors
  if (consoleErrors.length > 0) {
    console.log("\n=== Console Errors ===");
    for (const err of consoleErrors) console.log("  ", err);
  }

  // Network errors  
  if (networkErrors.length > 0) {
    console.log("\n=== Network Errors ===");
    for (const err of networkErrors) console.log("  ", err);
  }

  console.log("\n=== Session/Execute API calls ===");
  page.on("request", (req) => {
    if (req.url().includes("/api/")) console.log(req.method(), req.url());
  });

  // Try clicking Calculate
  if (calcExists && !(await calcBtn.first().isDisabled())) {
    console.log("\n*** Clicking Calculate ***");
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/pro-calculator/execute"),
        { timeout: 30000 }
      ).catch(() => console.log("No execute API response")),
      calcBtn.first().click(),
    ]);
    await page.waitForTimeout(3000);

    // Check result
    const resultPanel = page.locator('[class*=sc-report-panel], [class*=sc-v531-result]');
    const resultCount = await resultPanel.count();
    console.log("Result panels:", resultCount);

    const resultText = resultPanel.first().textContent();
    console.log("Result text:", (await resultText).substring(0, 200));
  }

  await page.screenshot({ path: "/tmp/sectorcalc-prod-test.png", fullPage: true });
  console.log("\nScreenshot saved to /tmp/sectorcalc-prod-test.png");

} catch (err) {
  console.error("TEST FAILED:", err.message);
}

await browser.close();
