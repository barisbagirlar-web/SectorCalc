#!/usr/bin/env node
/**
 * Browser smoke for calculation form surfaces — 375px + 1440px overflow/input checks.
 * Usage: node scripts/smoke-browser-calculation-forms.mjs
 */

import { createRequire } from "node:module";
import { getBaseUrl } from "./smoke-utils.mjs";

const require = createRequire(import.meta.url);

const ROUTES = [
  "/tools/premium/cnc-quote-risk-analyzer",
  "/tools/premium/change-order-impact-analyzer",
  "/tools/premium/cbam-compliance-verdict",
  "/tools/premium/meal-planning-verdict",
  "/tools/free/machine-time-calculator",
  "/tools/free/concrete-volume-calculator",
  "/tools/free/machine-hour-estimator",
  "/tr/tools/premium/cnc-quote-risk-analyzer",
  "/ar/tools/premium/cnc-quote-risk-analyzer",
  "/de/tools/free/concrete-volume-calculator",
];

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
];

function resolvePlaywright() {
  try {
    return require("playwright");
  } catch {
    try {
      return require("@playwright/test");
    } catch {
      return null;
    }
  }
}

async function auditRoute(page, baseUrl, path, viewport) {
  const url = `${baseUrl}${path}`;
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1500);

  const status = response?.status() ?? 0;
  const metrics = await page.evaluate(() => {
    const inputs = document.querySelectorAll(
      'input:not([type="hidden"]), select, textarea, button[type="submit"]',
    );
    const labels = document.querySelectorAll("label");
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
    return {
      inputCount: inputs.length,
      labelCount: labels.length,
      overflow,
    };
  });

  const ok =
    status === 200 &&
    metrics.inputCount > 0 &&
    metrics.labelCount > 0 &&
    !metrics.overflow &&
    consoleErrors.length === 0;

  return { ok, status, metrics, consoleErrors: consoleErrors.slice(0, 3) };
}

async function main() {
  const playwright = resolvePlaywright();
  if (!playwright) {
    console.log("SKIP: Playwright not installed — smoke:browser-calculation-forms skipped");
    process.exit(0);
  }

  const baseUrl = getBaseUrl();
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const failures = [];

  console.log(`=== Browser Calculation Forms Smoke (${baseUrl}) ===\n`);

  for (const viewport of VIEWPORTS) {
    for (const path of ROUTES) {
      const result = await auditRoute(page, baseUrl, path, viewport);
      const label = result.ok ? "✓" : "✗";
      console.log(
        `${label} ${viewport.name} ${path} → ${result.status} inputs=${result.metrics.inputCount} overflow=${result.metrics.overflow}`,
      );
      if (!result.ok) {
        failures.push({ path, viewport: viewport.name, ...result });
      }
    }
  }

  await browser.close();

  if (failures.length > 0) {
    console.error(`\nFailed: ${failures.length}`);
    process.exit(1);
  }

  console.log("\nBrowser calculation forms smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
