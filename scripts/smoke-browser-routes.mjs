#!/usr/bin/env node
/**
 * Browser smoke — catches blank body / RSC stream failures curl cannot see.
 * Requires Playwright (not bundled): npm install -D @playwright/test && npx playwright install chromium
 *
 * Env: SECTORCALC_AUDIT_BASE_URL=https://sectorcalc.com
 * Optional:
 *   node scripts/smoke-browser-routes.mjs --browser webkit
 *   node scripts/smoke-browser-routes.mjs --probe   (isolated fresh-browser probe of known flaky routes)
 */

import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
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

const PROBE_ROUTES = [
  "/es",
  "/de/free-tools",
  "/fr/free-tools",
  "/es/free-tools",
];

const BODY_WAIT_MS = 4_000;
const BODY_REMEASURE_WAIT_MS = 1_500;
const MIN_BODY_LEN = 200;
const NAV_TIMEOUT_MS = 30_000;
const ROUTE_COOLDOWN_MS = 1_500;
const RETRY_COOLDOWN_MS = 2_000;
const ROUTE_MAX_ATTEMPTS = 3;
const CONTEXT_REFRESH_EVERY = 3;
const FAIL_SCREENSHOT_DIR = join("/tmp", "sectorcalc-smoke-failures");

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

function hasFlag(argv, flag) {
  return argv.includes(flag);
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isFatalConsoleMessage(text) {
  return (
    /Application error/i.test(text) ||
    /__next_error__/i.test(text) ||
    /Connection closed/i.test(text) ||
    /Failed to fetch RSC payload/i.test(text)
  );
}

function isRscPressureSignal(result) {
  return (
    result.consoleErrors.some((msg) => /Connection closed|Failed to fetch RSC payload/i.test(msg)) ||
    result.pageErrors.some((msg) => /Connection closed/i.test(msg)) ||
    result.suspectBody ||
    result.hasApplicationError
  );
}

async function measureBodyTextLen(page) {
  return page.evaluate(() => {
    return (document.body?.innerText ?? "").replace(/\s+/g, " ").trim().length;
  });
}

async function auditRoute(page, baseUrl, path, options = {}) {
  const url = `${baseUrl}${path}`;
  const consoleErrors = [];
  const pageErrors = [];
  const network5xx = [];
  const asset404 = [];

  const onConsole = (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  };

  const onPageError = (error) => {
    pageErrors.push(error instanceof Error ? error.message : String(error));
  };

  const onResponse = (response) => {
    const status = response.status();
    const responseUrl = response.url();
    if (status === 500 || status === 502 || status === 503) {
      network5xx.push(`${status} ${responseUrl}`);
    }
    if (
      status === 404 &&
      /\/_next\/static\/|\.js(?:\?|$)|\.css(?:\?|$)|\.woff2?(?:\?|$)/.test(responseUrl)
    ) {
      asset404.push(`${status} ${responseUrl}`);
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

  let bodyTextLen = await measureBodyTextLen(page);
  if (bodyTextLen <= MIN_BODY_LEN) {
    await page.waitForTimeout(BODY_REMEASURE_WAIT_MS);
    bodyTextLen = await measureBodyTextLen(page);
  }

  const html = await page.content();
  const durationMs = Date.now() - started;

  if (options.captureScreenshot) {
    try {
      mkdirSync(FAIL_SCREENSHOT_DIR, { recursive: true });
      const fileName = `${path.replace(/^\//, "").replace(/\//g, "_") || "root"}.png`;
      await page.screenshot({
        path: join(FAIL_SCREENSHOT_DIR, fileName),
        fullPage: true,
      });
    } catch {
      // Screenshot is diagnostic only.
    }
  }

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("response", onResponse);

  const fatalConsole = consoleErrors.filter(isFatalConsoleMessage);
  const fatalPageErrors = pageErrors.filter(isFatalConsoleMessage);
  const blankBody = bodyTextLen === 0;
  const suspectBody = bodyTextLen > 0 && bodyTextLen <= MIN_BODY_LEN;
  const hasApplicationError =
    html.includes("Application error") || html.includes('id="__next_error__"');

  const failed =
    Boolean(gotoError) ||
    (httpStatus !== 0 && httpStatus !== 200) ||
    blankBody ||
    suspectBody ||
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
    suspectBody,
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

async function withFreshPage(context, baseUrl, path, options = {}) {
  const page = await context.newPage();
  try {
    const result = await auditRoute(page, baseUrl, path, options);
    if (result.failed && !options.captureScreenshot) {
      try {
        mkdirSync(FAIL_SCREENSHOT_DIR, { recursive: true });
        const fileName = `${path.replace(/^\//, "").replace(/\//g, "_") || "root"}.png`;
        await page.screenshot({
          path: join(FAIL_SCREENSHOT_DIR, fileName),
          fullPage: true,
        });
      } catch {
        // Screenshot is diagnostic only.
      }
    }
    return result;
  } finally {
    await page.close();
  }
}

async function createContext(browser) {
  return browser.newContext();
}

async function auditRouteIsolated(browser, baseUrl, path) {
  const context = await createContext(browser);
  try {
    const result = await withFreshPage(context, baseUrl, path, { captureScreenshot: true });
    return { ...result, attempts: 1, isolated: true };
  } finally {
    await context.close();
  }
}

async function auditRouteWithRetry(browser, contextRef, baseUrl, path, routeIndex) {
  let result = await withFreshPage(contextRef.current, baseUrl, path);
  let attempts = 1;

  while (result.failed && attempts < ROUTE_MAX_ATTEMPTS) {
    await sleep(RETRY_COOLDOWN_MS);
    await contextRef.current.close();
    contextRef.current = await createContext(browser);
    result = await withFreshPage(contextRef.current, baseUrl, path);
    attempts += 1;
  }

  return { ...result, attempts, routeIndex };
}

function printResultLine(result) {
  const status = result.failed ? "FAIL" : "OK";
  const retryNote = result.attempts > 1 ? `, attempts=${result.attempts}` : "";
  const isolatedNote = result.isolated ? ", isolated" : "";
  console.log(
    `${status} ${result.path} (${result.durationMs}ms, body=${result.bodyTextLen}${retryNote}${isolatedNote})`,
  );
}

function printSummary(results) {
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
    console.log(`\nSlow routes (>${SLOW_WARNING_MS}ms):`);
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
      if (r.suspectBody) reasons.push(`suspect body (len=${r.bodyTextLen})`);
      if (r.hasApplicationError) reasons.push("application error marker");
      if (r.consoleErrors.length) reasons.push(`console: ${r.consoleErrors.join("; ")}`);
      if (r.pageErrors.length) reasons.push(`pageerror: ${r.pageErrors.join("; ")}`);
      if (r.network5xx.length) reasons.push(`5xx: ${r.network5xx.join("; ")}`);
      if (r.asset404.length) reasons.push(`asset404: ${r.asset404.join("; ")}`);
      if (r.httpStatus && r.httpStatus !== 200) reasons.push(`http: ${r.httpStatus}`);
      console.log(`  ${r.path} — ${reasons.join(", ")}`);
    }
    console.log(`\nFail screenshots (if any): ${FAIL_SCREENSHOT_DIR}`);
    return 1;
  }

  console.log("\nAll browser smoke routes passed.");
  return 0;
}

async function runProbe(browserName, baseUrl) {
  const playwright = resolvePlaywright();
  const launcher = browserName === "webkit" ? playwright.webkit : playwright.chromium;
  const browser = await launcher.launch({ headless: true });

  console.log(`Browser probe (${browserName}) → ${baseUrl}`);
  console.log(`Routes: ${PROBE_ROUTES.length} (fresh context each)\n`);

  const results = [];
  for (const path of PROBE_ROUTES) {
    const result = await auditRouteIsolated(browser, baseUrl, path);
    results.push(result);
    printResultLine(result);
    if (result.consoleErrors.length > 0) {
      console.log(`  console: ${result.consoleErrors.join(" | ")}`);
    }
    if (result.pageErrors.length > 0) {
      console.log(`  pageerror: ${result.pageErrors.join(" | ")}`);
    }
    if (result.network5xx.length > 0) {
      console.log(`  5xx: ${result.network5xx.join(" | ")}`);
    }
    await sleep(ROUTE_COOLDOWN_MS);
  }

  await browser.close();
  return printSummary(results);
}

async function runSmoke(browserName, baseUrl) {
  const playwright = resolvePlaywright();
  const launcher = browserName === "webkit" ? playwright.webkit : playwright.chromium;
  const browser = await launcher.launch({ headless: true });

  console.log(`Browser smoke (${browserName}) → ${baseUrl}`);
  console.log(
    `Routes: ${ROUTES.length} | fresh page/route | context refresh every ${CONTEXT_REFRESH_EVERY} | cooldown ${ROUTE_COOLDOWN_MS}ms\n`,
  );

  const contextRef = { current: await createContext(browser) };
  const results = [];

  for (let index = 0; index < ROUTES.length; index += 1) {
    const path = ROUTES[index];

    if (index > 0 && index % CONTEXT_REFRESH_EVERY === 0) {
      await contextRef.current.close();
      contextRef.current = await createContext(browser);
    }

    const result = await auditRouteWithRetry(browser, contextRef, baseUrl, path, index);
    results.push(result);
    printResultLine(result);

    await sleep(ROUTE_COOLDOWN_MS);
  }

  await contextRef.current.close();
  await browser.close();

  return printSummary(results);
}

async function main() {
  const argv = process.argv.slice(2);
  const playwright = resolvePlaywright();
  if (!playwright) {
    console.error(
      "Playwright not installed. Skipping browser smoke.\n" +
        "Install: npm install -D @playwright/test && npx playwright install chromium\n" +
        "See docs/production-reality.md § Browser route smoke.",
    );
    process.exit(2);
  }

  const browserName = parseBrowserArg(argv);
  const baseUrl = getBaseUrl();
  const exitCode = hasFlag(argv, "--probe")
    ? await runProbe(browserName, baseUrl)
    : await runSmoke(browserName, baseUrl);

  process.exit(exitCode);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
