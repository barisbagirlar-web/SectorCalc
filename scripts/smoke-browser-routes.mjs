#!/usr/bin/env node
/**
 * Browser smoke — catches blank body / RSC stream failures curl cannot see.
 * Requires Playwright (not bundled): npm install -D @playwright/test && npx playwright install chromium
 *
 * Env: SECTORCALC_AUDIT_BASE_URL=https://sectorcalc.com
 * Optional: node scripts/smoke-browser-routes.mjs --browser webkit
 */

import { createRequire } from "node:module";
import {
  CRITICAL_SLOW_MS,
  getBaseUrl,
  SLOW_WARNING_MS,
} from "./smoke-utils.mjs";

const require = createRequire(import.meta.url);

const ROUTES = [
  "/",
  "/tr",
  "/pricing",
  "/tr/pricing",
  "/free-tools",
  "/premium-tools",
  "/industries",
  "/categories",
  "/ar",
  "/de",
  "/fr",
  "/es",
  "/ar/free-tools",
  "/de/free-tools",
  "/fr/free-tools",
  "/es/free-tools",
  "/ar/premium-tools",
  "/de/premium-tools",
  "/fr/premium-tools",
  "/es/premium-tools",
  "/tools/premium/cnc-quote-risk-analyzer",
  "/tools/premium/change-order-impact-analyzer",
  "/tools/premium/office-cleaning-bid-optimizer",
  "/tools/premium/welding-bid-risk-analyzer",
  "/tools/premium/millwork-bid-risk-analyzer",
];

const BODY_WAIT_MS = 10_000;
const NAV_TIMEOUT_MS = 30_000;
const ROUTE_COOLDOWN_MS = 750;
const ROUTE_MAX_ATTEMPTS = 2;

function parseBrowserArg(argv) {
  const idx = argv.indexOf("--browser");
  if (idx !== -1 && argv[idx + 1]) {
    const value = argv[idx + 1].toLowerCase();
    if (value === "chromium" || value === "webkit") {
      return value;
    }
  }
  return "chromium";
}

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

function isFatalConsoleMessage(text) {
  return (
    /Application error/i.test(text) ||
    /__next_error__/i.test(text) ||
    /Connection closed/i.test(text) ||
    /Failed to fetch RSC payload/i.test(text)
  );
}

async function auditRoute(page, baseUrl, path) {
  const url = `${baseUrl}${path}`;
  const consoleErrors = [];
  const pageErrors = [];
  const network5xx = [];
  const asset404 = [];

  const onConsole = (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      consoleErrors.push(text);
    }
  };

  const onPageError = (error) => {
    pageErrors.push(error instanceof Error ? error.message : String(error));
  };

  const onResponse = (response) => {
    const status = response.status();
    const url = response.url();
    if (status === 500 || status === 502 || status === 503) {
      network5xx.push(`${status} ${url}`);
    }
    if (
      status === 404 &&
      /\/_next\/static\/|\.js(?:\?|$)|\.css(?:\?|$)|\.woff2?(?:\?|$)/.test(url)
    ) {
      asset404.push(`${status} ${url}`);
    }
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);

  const started = Date.now();
  let gotoError = null;
  let httpStatus = 0;

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT_MS,
    });
    httpStatus = response?.status() ?? 0;
  } catch (error) {
    gotoError = error instanceof Error ? error.message : String(error);
  }

  await page.waitForTimeout(BODY_WAIT_MS);

  const bodyTextLen = await page.evaluate(() => {
    return (document.body?.innerText ?? "").replace(/\s+/g, " ").trim().length;
  });

  const html = await page.content();
  const durationMs = Date.now() - started;

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("response", onResponse);

  const fatalConsole = consoleErrors.filter(isFatalConsoleMessage);
  const fatalPageErrors = pageErrors.filter(isFatalConsoleMessage);
  const blankBody = bodyTextLen === 0;
  const hasApplicationError =
    html.includes("Application error") || html.includes('id="__next_error__"');

  const failed =
    Boolean(gotoError) ||
    (httpStatus !== 0 && httpStatus !== 200) ||
    blankBody ||
    hasApplicationError ||
    fatalConsole.length > 0 ||
    fatalPageErrors.length > 0 ||
    network5xx.length > 0 ||
    asset404.length > 0;

  return {
    path,
    url,
    durationMs,
    bodyTextLen,
    httpStatus,
    gotoError,
    blankBody,
    hasApplicationError,
    consoleErrors: fatalConsole,
    pageErrors: fatalPageErrors,
    network5xx,
    asset404,
    slow: durationMs > SLOW_WARNING_MS,
    criticalSlow: durationMs > CRITICAL_SLOW_MS,
    failed,
  };
}

async function main() {
  const playwright = resolvePlaywright();
  if (!playwright) {
    console.error(
      "Playwright not installed. Skipping browser smoke.\n" +
        "Install: npm install -D @playwright/test && npx playwright install chromium\n" +
        "See docs/production-reality.md § Browser route smoke."
    );
    process.exit(2);
  }

  const browserName = parseBrowserArg(process.argv.slice(2));
  const launcher = browserName === "webkit" ? playwright.webkit : playwright.chromium;
  const baseUrl = getBaseUrl();

  console.log(`Browser smoke (${browserName}) → ${baseUrl}`);
  console.log(`Routes: ${ROUTES.length}\n`);

  const browser = await launcher.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  for (const path of ROUTES) {
    let result = await auditRoute(page, baseUrl, path);
    let attempts = 1;

    if (result.failed && ROUTE_MAX_ATTEMPTS > 1) {
      await page.waitForTimeout(ROUTE_COOLDOWN_MS);
      result = await auditRoute(page, baseUrl, path);
      attempts = 2;
    }

    results.push({ ...result, attempts });
    const status = result.failed ? "FAIL" : "OK";
    const retryNote = attempts > 1 ? `, attempts=${attempts}` : "";
    console.log(`${status} ${path} (${result.durationMs}ms, body=${result.bodyTextLen}${retryNote})`);

    await page.waitForTimeout(ROUTE_COOLDOWN_MS);
  }

  await browser.close();

  const failed = results.filter((r) => r.failed);
  const ok = results.filter((r) => !r.failed);
  const blankBodies = results.filter((r) => r.blankBody);
  const pageErrorHits = results.filter((r) => r.pageErrors.length > 0);
  const networkHits = results.filter((r) => r.network5xx.length > 0);
  const assetHits = results.filter((r) => r.asset404.length > 0);
  const slowRoutes = results.filter((r) => r.slow);

  console.log("\n--- Summary ---");
  console.log(`OK: ${ok.length}`);
  console.log(`FAIL: ${failed.length}`);

  if (blankBodies.length > 0) {
    console.log("\nBlank body:");
    for (const r of blankBodies) {
      console.log(`  ${r.path}`);
    }
  }

  if (pageErrorHits.length > 0) {
    console.log("\nPage errors:");
    for (const r of pageErrorHits) {
      console.log(`  ${r.path}: ${r.pageErrors.join(" | ")}`);
    }
  }

  if (networkHits.length > 0) {
    console.log("\nNetwork 5xx:");
    for (const r of networkHits) {
      console.log(`  ${r.path}: ${r.network5xx.join(" | ")}`);
    }
  }

  if (assetHits.length > 0) {
    console.log("\nAsset 404 (JS/CSS chunks):");
    for (const r of assetHits) {
      console.log(`  ${r.path}: ${r.asset404.join(" | ")}`);
    }
  }

  if (slowRoutes.length > 0) {
    console.log("\nSlow routes (>${SLOW_WARNING_MS}ms):");
    for (const r of slowRoutes) {
      console.log(`  ${r.path}: ${r.durationMs}ms`);
    }
  }

  if (failed.length > 0) {
    console.log("\nFailed routes:");
    for (const r of failed) {
      const reasons = [];
      if (r.gotoError) reasons.push(`goto: ${r.gotoError}`);
      if (r.blankBody) reasons.push("blank body");
      if (r.hasApplicationError) reasons.push("application error marker");
      if (r.consoleErrors.length) reasons.push(`console: ${r.consoleErrors.join("; ")}`);
      if (r.pageErrors.length) reasons.push(`pageerror: ${r.pageErrors.join("; ")}`);
      if (r.network5xx.length) reasons.push(`5xx: ${r.network5xx.join("; ")}`);
      if (r.asset404.length) reasons.push(`asset404: ${r.asset404.join("; ")}`);
      if (r.httpStatus && r.httpStatus !== 200) reasons.push(`http: ${r.httpStatus}`);
      console.log(`  ${r.path} — ${reasons.join(", ")}`);
    }
    process.exit(1);
  }

  console.log("\nAll browser smoke routes passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
