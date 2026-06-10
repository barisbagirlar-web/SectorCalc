#!/usr/bin/env node
/**
 * P4 smoke: approved report / trust trace markers on premium routes.
 * Usage: node scripts/smoke-approved-reports.mjs [--locale tr]
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
  parseLocaleArg,
} from "./smoke-utils.mjs";

const PREMIUM_ROUTES = [
  "/tools/premium/cnc-quote-risk-analyzer",
  "/tools/premium/change-order-impact-analyzer",
  "/tools/premium/cbam-compliance-verdict",
  "/tools/premium/meal-planning-verdict",
  "/tr/tools/premium/cnc-quote-risk-analyzer",
  "/ar/tools/premium/cnc-quote-risk-analyzer",
  "/de/tools/premium/cnc-quote-risk-analyzer",
  "/fr/tools/premium/cnc-quote-risk-analyzer",
  "/es/tools/premium/cnc-quote-risk-analyzer",
];

const MIN_BODY_LENGTH = 500;

function hasVerifyMarker(body) {
  return (
    /href="[^"]*\/verify[^"]*"/.test(body) ||
    body.includes("/verify?reportId=") ||
    body.includes('data-verify-report-form="true"')
  );
}

async function auditRoute(path) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const bodyTooShort = body.length > 0 && body.length < MIN_BODY_LENGTH;
  const markers = {
    trustTrace: body.includes('data-trust-trace-summary="true"'),
    validationStamp: body.includes('data-validation-stamp="true"'),
    approvedActions: body.includes('data-approved-report-actions="true"'),
    verify: hasVerifyMarker(body),
  };
  const ok =
    result.ok &&
    result.status === 200 &&
    fatals.length === 0 &&
    !bodyTooShort &&
    markers.trustTrace &&
    markers.validationStamp &&
    markers.approvedActions &&
    markers.verify;

  return { ...result, fatals, bodyTooShort, markers, ok };
}

async function main() {
  parseLocaleArg(process.argv);
  const baseUrl = getBaseUrl();
  const failures = [];

  console.log(`=== Approved Reports Smoke (${baseUrl}) ===\n`);

  for (const path of PREMIUM_ROUTES) {
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
    console.error(`\nApproved reports smoke FAILED (${failures.length} routes)`);
    process.exit(1);
  }

  console.log("\nApproved reports smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
