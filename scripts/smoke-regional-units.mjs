#!/usr/bin/env node
/**
 * P5 smoke: regional unit engine UI markers on premium routes across locales.
 * Usage: node scripts/smoke-regional-units.mjs
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

async function auditRoute(path) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const bodyTooShort = body.length > 0 && body.length < MIN_BODY_LENGTH;
  const markers = {
    unitSelector: body.includes('data-unit-system-selector="true"'),
    conversionTrace: body.includes('data-conversion-trace="true"'),
  };
  const ok =
    result.ok &&
    result.status === 200 &&
    fatals.length === 0 &&
    !bodyTooShort &&
    markers.unitSelector &&
    markers.conversionTrace;
  return { ...result, fatals, bodyTooShort, markers, ok };
}

async function main() {
  const baseUrl = getBaseUrl();
  const failures = [];
  console.log(`=== Regional Units Smoke (${baseUrl}) ===\n`);

  for (const path of ROUTES) {
    const result = await auditRoute(path);
    const label = result.ok ? "✓" : "✗";
    const missing = Object.entries(result.markers)
      .filter(([, present]) => !present)
      .map(([key]) => key);
    console.log(
      `${label} ${path} → ${result.status || result.error || "error"}${
        missing.length ? ` [missing: ${missing.join(", ")}]` : ""
      }${result.fatals.length ? ` [fatal: ${result.fatals.join(", ")}]` : ""}${
        result.bodyTooShort ? " [body too short]" : ""
      }`,
    );
    if (!result.ok) {
      failures.push({ path, ...result });
    }
  }

  if (failures.length > 0) {
    console.error(`\nRegional units smoke FAILED (${failures.length} routes)`);
    process.exit(1);
  }
  console.log("\nRegional units smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
