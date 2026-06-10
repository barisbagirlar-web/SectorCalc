#!/usr/bin/env node
/**
 * P6 smoke: regional benchmark panel marker on premium routes across locales.
 * Usage: node scripts/smoke-regional-benchmarks.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
  SUPPORTED_LOCALES,
} from "./smoke-utils.mjs";

const SAMPLE_PATH = "/tools/premium/cnc-quote-risk-analyzer";
const ROUTES = SUPPORTED_LOCALES.map((locale) => localePath(locale, SAMPLE_PATH));
const MIN_BODY_LENGTH = 500;
// Private/admin-only collection markers that must NOT leak into public benchmark UI.
const PRIVATE_LEAK_MARKERS = ["benchmarkSubmissions", "betaPartners", "reportFeedback"];

async function auditRoute(path) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const bodyTooShort = body.length > 0 && body.length < MIN_BODY_LENGTH;
  const hasPanel = body.includes('data-regional-benchmark-panel="true"');
  const leaked = PRIVATE_LEAK_MARKERS.filter((marker) => body.includes(marker));
  const ok =
    result.ok &&
    result.status === 200 &&
    fatals.length === 0 &&
    !bodyTooShort &&
    hasPanel &&
    leaked.length === 0;
  return { ...result, fatals, bodyTooShort, hasPanel, leaked, ok };
}

async function main() {
  const baseUrl = getBaseUrl();
  const failures = [];
  console.log(`=== Regional Benchmarks Smoke (${baseUrl}) ===\n`);

  for (const path of ROUTES) {
    const result = await auditRoute(path);
    const label = result.ok ? "✓" : "✗";
    console.log(
      `${label} ${path} → ${result.status || result.error || "error"}${
        result.hasPanel ? "" : " [missing panel marker]"
      }${result.leaked?.length ? ` [private leak: ${result.leaked.join(", ")}]` : ""}${
        result.fatals.length ? ` [fatal: ${result.fatals.join(", ")}]` : ""
      }${result.bodyTooShort ? " [body too short]" : ""}`,
    );
    if (!result.ok) {
      failures.push({ path, ...result });
    }
  }

  if (failures.length > 0) {
    console.error(`\nRegional benchmarks smoke FAILED (${failures.length} routes)`);
    process.exit(1);
  }
  console.log("\nRegional benchmarks smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
