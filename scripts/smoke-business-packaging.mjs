#!/usr/bin/env node
/**
 * Smoke: P9 business / enterprise packaging across locales.
 * Usage: node scripts/smoke-business-packaging.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
  SUPPORTED_LOCALES,
} from "./smoke-utils.mjs";

const ENTERPRISE_PATHS = SUPPORTED_LOCALES.map((locale) => ({
  locale,
  path: localePath(locale, "/enterprise"),
}));

const PRICING_PATHS = [
  { locale: "en", path: localePath("en", "/pricing") },
  { locale: "tr", path: localePath("tr", "/pricing") },
];

const MIN_BODY_LENGTH = 500;

const ENTERPRISE_MARKERS = [
  'data-enterprise-page="true"',
  'data-business-plan-card="true"',
  'data-enterprise-plan-card="true"',
  'data-approved-reports-value="true"',
  'data-trust-trace-value="true"',
  'data-enterprise-demo-cta="true"',
];

async function auditEnterprise({ locale, path }) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const checks = {
    status200: result.status === 200,
    brand: body.includes("SectorCalc"),
    noEnPrefix: !body.includes('href="/en/enterprise"'),
    noFatal: fatals.length === 0,
    bodyOk: body.length >= MIN_BODY_LENGTH,
  };
  for (const marker of ENTERPRISE_MARKERS) {
    checks[marker] = body.includes(marker);
  }
  const ok = Object.values(checks).every(Boolean);
  return { locale, path, status: result.status, checks, ok };
}

async function auditPricing({ locale, path }) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const checks = {
    status200: result.status === 200,
    noFatal: fatals.length === 0,
    bodyOk: body.length >= MIN_BODY_LENGTH,
  };
  const ok = Object.values(checks).every(Boolean);
  return { locale, path, status: result.status, checks, ok };
}

/** /en/enterprise must NOT behave as a supported 200 route. */
async function auditEnPrefix() {
  const url = `${getBaseUrl()}/en/enterprise`;
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    const ok = res.status !== 200;
    return { url, status: res.status, ok };
  } catch (error) {
    return { url, status: 0, ok: false, error: String(error) };
  }
}

function failedKeys(checks) {
  return Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k)
    .join(", ");
}

async function main() {
  console.log(`=== Business Packaging Smoke (${getBaseUrl()}) ===\n`);
  const failures = [];

  console.log("Enterprise page:");
  for (const target of ENTERPRISE_PATHS) {
    const r = await auditEnterprise(target);
    console.log(
      `${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` +
        (r.ok ? "" : ` [fail: ${failedKeys(r.checks)}]`),
    );
    if (!r.ok) failures.push(r);
  }

  console.log("\nPricing page:");
  for (const target of PRICING_PATHS) {
    const r = await auditPricing(target);
    console.log(
      `${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` +
        (r.ok ? "" : ` [fail: ${failedKeys(r.checks)}]`),
    );
    if (!r.ok) failures.push(r);
  }

  console.log("\n/en prefix guard:");
  const enCheck = await auditEnPrefix();
  console.log(`${enCheck.ok ? "✓" : "✗"} /en/enterprise → ${enCheck.status} (must not be 200)`);
  if (!enCheck.ok) failures.push(enCheck);

  if (failures.length > 0) {
    console.error(`\nBusiness packaging smoke FAILED (${failures.length} checks)`);
    process.exit(1);
  }
  console.log("\nBusiness packaging smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
