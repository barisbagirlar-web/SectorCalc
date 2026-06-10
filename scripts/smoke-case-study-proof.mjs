#!/usr/bin/env node
/**
 * P7 smoke: case study proof panel markers across locales + index pages.
 * Usage: node scripts/smoke-case-study-proof.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
  SUPPORTED_LOCALES,
} from "./smoke-utils.mjs";

const DETAIL_SLUGS = [
  "representative-cnc-job-shop",
  "representative-change-order-impact",
  "representative-cbam-compliance",
];
const MIN_BODY_LENGTH = 400;

async function auditIndex(path) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const ok = result.ok && result.status === 200 && fatals.length === 0 && body.length >= MIN_BODY_LENGTH;
  return { ...result, fatals, ok };
}

async function auditDetail(path) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const hasPanel = body.includes('data-case-study-proof-panel="true"');
  const ok = result.ok && result.status === 200 && fatals.length === 0 && hasPanel;
  return { ...result, fatals, hasPanel, ok };
}

async function main() {
  const baseUrl = getBaseUrl();
  const failures = [];
  console.log(`=== Case Study Proof Smoke (${baseUrl}) ===\n`);

  console.log("Index pages:");
  for (const locale of SUPPORTED_LOCALES) {
    const path = localePath(locale, "/case-studies");
    const result = await auditIndex(path);
    console.log(`${result.ok ? "✓" : "✗"} ${path} → ${result.status || result.error || "error"}`);
    if (!result.ok) failures.push({ path, kind: "index" });
  }

  console.log("\nDetail proof panels:");
  for (const slug of DETAIL_SLUGS) {
    for (const locale of SUPPORTED_LOCALES) {
      const path = localePath(locale, `/case-studies/${slug}`);
      const result = await auditDetail(path);
      console.log(
        `${result.ok ? "✓" : "✗"} ${path} → ${result.status || result.error || "error"}${
          result.hasPanel ? "" : " [missing proof panel]"
        }${result.fatals.length ? ` [fatal: ${result.fatals.join(", ")}]` : ""}`,
      );
      if (!result.ok) failures.push({ path, kind: "detail" });
    }
  }

  if (failures.length > 0) {
    console.error(`\nCase study proof smoke FAILED (${failures.length} routes)`);
    process.exit(1);
  }
  console.log("\nCase study proof smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
