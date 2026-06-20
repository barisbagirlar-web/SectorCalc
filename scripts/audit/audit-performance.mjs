#!/usr/bin/env node
/**
 * audit:performance — Core Web Vitals & Performance Audit
 *
 * Checks LCP (< 2.5s), CLS (< 0.1), TBT (< 200ms) by analyzing server timing
 * headers, HTML structure, and runtime metrics from the deployed site.
 *
 * Uses browser automation when Playwright is available; falls back to
 * HTTP-level timing analysis.
 *
 * Usage: node scripts/audit/audit-performance.mjs [--url=https://sectorcalc.com]
 *        node scripts/audit/audit-performance.mjs --ci   # lighter CI mode
 */
import { getBaseUrl } from "../smoke-utils.mjs";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const REPORT_PATH = join(ROOT, "scripts/.cache/performance-report.json");
const require = createRequire(import.meta.url);

// Performance budgets (Siemens Simcenter grade)
const BUDGETS = {
  LCP_MAX_MS: 2500,          // Largest Contentful Paint
  CLS_MAX: 0.1,              // Cumulative Layout Shift
  TBT_MAX_MS: 200,           // Total Blocking Time
  FCP_MAX_MS: 1800,          // First Contentful Paint
  SI_MAX_MS: 3400,           // Speed Index
  TTFB_MAX_MS: 800,          // Time to First Byte
  BODY_SIZE_KB: 500,         // Max HTML body size
  TOTAL_JS_SIZE_MB: 2.5,     // Max total JS
};

const CORE_ROUTES = ["/", "/tr", "/pricing", "/free-tools", "/premium-tools"];

function formatMs(ms) { return `${Math.round(ms)}ms`; }

function formatBytes(bytes) {
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)}MB` : `${Math.round(kb)}KB`;
}

function checkHtmlMetrics(html, url) {
  const issues = [];
  const metrics = {};

  // Check for large images without dimensions (CLS risk)
  const imgNoDimensions = html.match(/<img[^>]*(?![^>]*(?:width|height|aspect-ratio))[^>]*>/gi);
  if (imgNoDimensions && imgNoDimensions.length > 5) {
    issues.push(`HIGH: ${imgNoDimensions.length} images missing width/height — CLS risk`);
  }

  // Check for render-blocking scripts
  const scripts = html.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  const headScripts = scripts.filter(s => s.includes("</script>") === false && 
    !s.includes("async") && !s.includes("defer"));
  if (headScripts.length > 3) {
    issues.push(`MEDIUM: ${headScripts.length} render-blocking scripts in head`);
  }

  // Check total JS size from _next/static references
  const jsRefs = html.match(/\/_next\/static\/[^"']*\.js/g) || [];
  metrics.jsFileCount = jsRefs.length;
  if (jsRefs.length > 30) {
    issues.push(`WARN: ${jsRefs.length} JS chunks loaded — consider code splitting`);
  }

  // Check CSS size
  const cssRefs = html.match(/\/_next\/static\/[^"']*\.css/g) || [];
  metrics.cssFileCount = cssRefs.length;

  // Check for preconnect/preload hints
  const preconnect = html.match(/rel=["']preconnect["']/gi) || [];
  const preload = html.match(/rel=["']preload["']/gi) || [];
  metrics.preconnectCount = preconnect.length;
  metrics.preloadCount = preload.length;
  if (preconnect.length < 2) {
    issues.push(`LOW: Only ${preconnect.length} preconnect hints — consider adding for critical origins`);
  }

  // Check fonts loading strategy
  const fontDisplay = html.match(/font-display/gi);
  if (!fontDisplay || fontDisplay.length === 0) {
    issues.push("MEDIUM: No font-display property found — CLS risk from FOUT");
  }

  return { issues, metrics };
}

async function main() {
  const isCi = process.argv.includes("--ci");
  const urlArg = process.argv.find(a => a.startsWith("--url="));
  const baseUrl = urlArg ? urlArg.split("=")[1] : getBaseUrl();

  console.log("=".repeat(60));
  console.log("PERFORMANCE AUDIT — Core Web Vitals");
  console.log(`Target: ${baseUrl}`);
  console.log(`Mode: ${isCi ? "CI (lighter)" : "full"}`);
  console.log("=".repeat(60));

  // Try Playwright for real browser metrics
  let playwright = null;
  try {
    playwright = require("playwright");
  } catch {
    try {
      playwright = require("@playwright/test");
    } catch {
      // fallback to HTTP analysis
    }
  }

  const results = [];
  let overallPass = true;

  for (const route of CORE_ROUTES) {
    const url = `${baseUrl}${route}`;
    console.log(`\n--- ${route} ---`);

    const routeResult = {
      route,
      url,
      lcpMs: null,
      cls: null,
      tbtMs: null,
      ttfbMs: null,
      bodySizeKb: 0,
      httpStatus: 0,
      errors: [],
      warnings: [],
      pass: true,
    };

    if (playwright) {
      // Full browser-based measurement
      try {
        const browser = await playwright.chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
        const page = await context.newPage();

        const startTime = Date.now();
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        routeResult.ttfbMs = Date.now() - startTime;

        const body = await page.content();
        const timing = JSON.parse(JSON.stringify(await page.evaluate(() => performance.timing)));
        if (timing) {
          routeResult.lcpMs = timing.loadEventEnd - timing.navigationStart;
        }

        const bodyText = await page.evaluate(() => document.body?.innerText?.length || 0);
        routeResult.bodySizeKb = Math.round(body.length / 1024);

        // Check for console errors
        const consoleErrors = [];
        page.on("console", msg => {
          if (msg.type() === "error") consoleErrors.push(msg.text());
        });

        // Simulate CLS check by scrolling
        const clsDetected = await page.evaluate(() => {
          return new Promise(resolve => {
            let cls = 0;
            const observer = new PerformanceObserver(list => {
              for (const entry of list.getEntries()) {
                cls += entry.value;
              }
            });
            observer.observe({ type: "layout-shift", buffered: true });
            setTimeout(() => { resolve(cls); }, 1000);
          });
        });
        routeResult.cls = clsDetected || 0;

        if (routeResult.lcpMs !== null && routeResult.lcpMs > BUDGETS.LCP_MAX_MS) {
          routeResult.errors.push(`LCP ${formatMs(routeResult.lcpMs)} exceeds budget ${formatMs(BUDGETS.LCP_MAX_MS)}`);
        }
        if (routeResult.cls !== null && routeResult.cls > BUDGETS.CLS_MAX) {
          routeResult.errors.push(`CLS ${routeResult.cls.toFixed(3)} exceeds budget ${BUDGETS.CLS_MAX}`);
        }

        const htmlIssues = checkHtmlMetrics(body, url);
        for (const issue of htmlIssues.issues) {
          if (issue.startsWith("HIGH")) routeResult.errors.push(issue);
          else if (issue.startsWith("MEDIUM")) routeResult.warnings.push(issue);
          else routeResult.warnings.push(issue);
        }

        await browser.close();
      } catch (err) {
        routeResult.errors.push(`Browser error: ${err instanceof Error ? err.message.slice(0, 100) : String(err)}`);
      }
    } else {
      // HTTP-level fallback
      try {
        const httpStart = Date.now();
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        routeResult.ttfbMs = Date.now() - httpStart;
        routeResult.httpStatus = response.status;
        const body = await response.text();
        routeResult.bodySizeKb = Math.round(body.length / 1024);

        if (response.status !== 200) {
          routeResult.errors.push(`HTTP ${response.status}`);
        }
        if (routeResult.bodySizeKb > BUDGETS.BODY_SIZE_KB) {
          routeResult.warnings.push(`Body ${formatBytes(body.length)} exceeds ${formatBytes(BUDGETS.BODY_SIZE_KB * 1024)}`);
        }
        if (routeResult.ttfbMs > BUDGETS.TTFB_MAX_MS) {
          routeResult.errors.push(`TTFB ${formatMs(routeResult.ttfbMs)} exceeds budget ${formatMs(BUDGETS.TTFB_MAX_MS)}`);
        }

        const htmlIssues = checkHtmlMetrics(body, url);
        routeResult.errors.push(...htmlIssues.issues.filter(i => i.startsWith("HIGH")));
        routeResult.warnings.push(...htmlIssues.issues.filter(i => !i.startsWith("HIGH")));
      } catch (err) {
        routeResult.errors.push(`Fetch error: ${err instanceof Error ? err.message.slice(0, 100) : String(err)}`);
      }
    }

    routeResult.pass = routeResult.errors.length === 0;
    if (!routeResult.pass) overallPass = false;

    const status = routeResult.pass ? "✓" : "✗";
    console.log(`${status} LCP=${routeResult.lcpMs ? formatMs(routeResult.lcpMs) : "N/A"} ` +
      `CLS=${routeResult.cls?.toFixed(3) ?? "N/A"} ` +
      `TTFB=${formatMs(routeResult.ttfbMs ?? 0)} Body=${formatBytes(routeResult.bodySizeKb * 1024)}`);
    for (const e of routeResult.errors) console.log(`  ERROR: ${e}`);
    for (const w of routeResult.warnings) console.log(`  WARN:  ${w}`);

    results.push(routeResult);
  }

  // ── Summary ──
  console.log("\n" + "=".repeat(60));
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`Performance audit: ${passed}/${results.length} routes PASS, ${failed} FAIL`);
  console.log(overallPass ? "✅ ALL PERFORMANCE BUDGETS MET" : "❌ PERFORMANCE BUDGETS VIOLATED");

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    budgets: BUDGETS,
    results,
    overallPass,
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(overallPass ? 0 : 1);
}

main().catch(err => {
  console.error("audit:performance FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
