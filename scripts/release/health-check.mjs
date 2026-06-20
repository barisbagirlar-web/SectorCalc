#!/usr/bin/env node
/**
 * release:health-check — Post-Deploy Health Check
 *
 * After deployment, verifies that the live site is healthy:
 *   - All critical endpoints return 200 (within 60 seconds of deploy)
 *   - No 500/502/503 errors
 *   - Body content is non-empty
 *   - No application error markers
 *
 * Usage: node scripts/release/health-check.mjs [--url=https://sectorcalc.com]
 *        node scripts/release/health-check.mjs --wait=30   # wait 30s before checks
 */
import { getBaseUrl } from "../smoke-utils.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const REPORT_PATH = join(ROOT, "scripts/.cache/health-check-report.json");

const CRITICAL_ROUTES = [
  "/", "/tr", "/pricing", "/free-tools", "/premium-tools",
  "/tools/premium/cnc-quote-risk-analyzer",
];

async function checkEndpoint(url) {
  const start = Date.now();
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(20000) });
    const body = await resp.text();
    const duration = Date.now() - start;
    const fatalErrors = [];

    if (resp.status >= 500) fatalErrors.push(`HTTP ${resp.status}`);
    if (body.includes("Application error")) fatalErrors.push("Application error marker");
    if (body.includes('id="__next_error__"')) fatalErrors.push("Next.js error marker");
    if (body.includes("NEXT_NOT_FOUND")) fatalErrors.push("Not found marker");
    if (body.trim().length === 0) fatalErrors.push("Empty body");

    return {
      url,
      status: resp.status,
      durationMs: duration,
      bodyLength: body.length,
      fatalErrors,
      ok: fatalErrors.length === 0 && resp.status === 200,
    };
  } catch (err) {
    return {
      url,
      status: 0,
      durationMs: Date.now() - start,
      bodyLength: 0,
      fatalErrors: [err.message.slice(0, 100)],
      ok: false,
    };
  }
}

async function main() {
  const urlArg = process.argv.find(a => a.startsWith("--url="));
  const baseUrl = (urlArg ? urlArg.split("=")[1] : getBaseUrl()).replace(/\/$/, "");

  const waitArg = process.argv.find(a => a.startsWith("--wait="));
  const waitSeconds = waitArg ? parseInt(waitArg.split("=")[1], 10) : 0;

  console.log("=".repeat(60));
  console.log("POST-DEPLOY HEALTH CHECK");
  console.log(`Target: ${baseUrl}`);
  console.log(`Wait: ${waitSeconds}s before check`);
  console.log("=".repeat(60));

  if (waitSeconds > 0) {
    console.log(`Waiting ${waitSeconds}s for deployment to settle...`);
    await new Promise(r => setTimeout(r, waitSeconds * 1000));
  }

  // Check all critical routes
  const results = [];
  let pass = true;

  for (const route of CRITICAL_ROUTES) {
    const url = baseUrl + route;
    const result = await checkEndpoint(url);
    results.push({ ...result, route });
    if (!result.ok) pass = false;

    const status = result.ok ? "✓" : "✗";
    console.log(`  ${status} ${route} (${result.durationMs}ms, ${result.status}${result.fatalErrors.length > 0 ? ` — ${result.fatalErrors.join(", ")}` : ""})`);
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  const passedCount = results.filter(r => r.ok).length;
  console.log(`Endpoints: ${passedCount}/${results.length} healthy`);
  if (!pass) {
    console.log("\nFailed endpoints:");
    for (const r of results.filter(r => !r.ok)) {
      console.log(`  ✗ ${r.route}: ${r.fatalErrors.join("; ")}`);
    }
  }
  console.log(pass ? "\n✅ HEALTH CHECK PASS — System is operational" : "\n❌ HEALTH CHECK FAIL — System has issues");

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    passed: pass,
    healthyCount: passedCount,
    totalCount: results.length,
    results,
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(pass ? 0 : 1);
}

main().catch(err => {
  console.error("release:health-check FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
