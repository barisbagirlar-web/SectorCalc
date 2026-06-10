#!/usr/bin/env node
/**
 * P4 smoke: public /verify pages + verify-report API guards.
 * Usage: node scripts/smoke-verify-report.mjs
 */

import {
  checkFatalMarkers,
  fetchRoute,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
} from "./smoke-utils.mjs";

const VERIFY_ROUTES = ["en", "tr", "ar", "de", "fr", "es"].map((locale) =>
  localePath(locale, "/verify"),
);

const MIN_BODY_LENGTH = 300;

async function auditVerifyPage(path) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const bodyTooShort = body.length > 0 && body.length < MIN_BODY_LENGTH;
  const hasFormMarker = body.includes('data-verify-report-form="true"');
  const ok =
    result.ok &&
    result.status === 200 &&
    fatals.length === 0 &&
    !bodyTooShort &&
    hasFormMarker;

  return { ...result, fatals, bodyTooShort, hasFormMarker, ok };
}

async function auditJson(path) {
  const result = await fetchRoute(path);
  let data = null;
  try {
    data = JSON.parse(result.body ?? "{}");
  } catch {
    data = null;
  }
  return { ...result, data };
}

async function main() {
  const baseUrl = getBaseUrl();
  const failures = [];

  console.log(`=== Verify Report Smoke (${baseUrl}) ===\n`);

  for (const path of VERIFY_ROUTES) {
    const result = await auditVerifyPage(path);
    const label = result.ok ? "✓" : "✗";
    console.log(
      `${label} ${path} → ${result.status || result.error || "error"}${
        result.hasFormMarker ? "" : " [missing form marker]"
      }${result.fatals.length ? ` [fatal: ${result.fatals.join(", ")}]` : ""}${
        result.bodyTooShort ? " [body too short]" : ""
      }`,
    );
    if (!result.ok) {
      failures.push({ path, kind: "page", ...result });
    }
  }

  console.log("\nAPI checks:");

  const missingParams = await auditJson("/api/verify-report");
  if (missingParams.status === 400 && missingParams.data?.error === "missing_params") {
    console.log("✓ GET /api/verify-report → 400 missing_params");
  } else {
    console.log(
      `✗ GET /api/verify-report → expected 400 missing_params, got ${missingParams.status}`,
    );
    failures.push({ path: "/api/verify-report", kind: "api-missing" });
  }

  const badLookup = await auditJson("/api/verify-report?reportId=BAD&hash=BAD");
  const badError = badLookup.data?.error;
  const badOk =
    badLookup.status === 400 &&
    (badError === "invalid_params" || badError === "missing_params");
  if (badOk) {
    console.log(`✓ GET /api/verify-report?reportId=BAD&hash=BAD → 400 ${badError}`);
  } else if (badLookup.status === 200 && badLookup.data?.status === "not_found") {
    console.log("✓ GET /api/verify-report?reportId=BAD&hash=BAD → 200 not_found");
  } else {
    console.log(
      `✗ GET /api/verify-report?reportId=BAD&hash=BAD → unexpected ${badLookup.status}`,
    );
    failures.push({ path: "/api/verify-report?reportId=BAD&hash=BAD", kind: "api-bad" });
  }

  const enVerifyUrl = `${baseUrl}/en/verify`;
  let enVerifyStatus = 0;
  let enVerifyBody = "";
  try {
    const enRes = await fetch(enVerifyUrl, { redirect: "manual" });
    enVerifyStatus = enRes.status;
    enVerifyBody = await enRes.text();
  } catch (error) {
    console.log(`✗ /en/verify → fetch failed: ${error instanceof Error ? error.message : error}`);
    failures.push({ path: "/en/verify", kind: "en-prefix" });
  }

  if (enVerifyStatus !== 0) {
    if (enVerifyStatus === 308 || enVerifyStatus === 301 || enVerifyStatus === 302) {
      console.log(`✓ /en/verify → ${enVerifyStatus} redirect (no /en prefix)`);
    } else if (enVerifyStatus === 404) {
      console.log("✓ /en/verify → 404 (unsupported /en prefix)");
    } else if (
      enVerifyStatus === 200 &&
      !enVerifyBody.includes('data-verify-report-form="true"')
    ) {
      console.log("✓ /en/verify → 200 without supported verify form marker");
    } else {
      console.log(`✗ /en/verify → ${enVerifyStatus} behaves like supported route`);
      failures.push({ path: "/en/verify", kind: "en-prefix", status: enVerifyStatus });
    }
  }

  if (failures.length > 0) {
    console.error(`\nVerify report smoke FAILED (${failures.length} issues)`);
    process.exit(1);
  }

  console.log("\nVerify report smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
