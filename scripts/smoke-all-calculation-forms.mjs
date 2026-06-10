#!/usr/bin/env node
/**
 * Smoke all calculation form surfaces: premium, free revenue, free traffic sample, legacy.
 * Usage: node scripts/smoke-all-calculation-forms.mjs [--locale tr]
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  loadAllFreeToolSlugsFromRegistry,
  loadLegacyCalculatorRoutes,
  loadPremiumSlugsFromRegistry,
  localePath,
  parseLocaleArg,
} from "./smoke-utils.mjs";

const FREE_LOG_LIMIT = 12;
const LOCALE_SAMPLES = ["en", "tr", "ar", "de", "fr", "es"];

function hasFormMarker(body, kind) {
  if (kind === "premium") {
    return (
      body.includes('data-smart-form-shell="true"') ||
      body.includes('data-calculation-form-shell="true"') ||
      body.includes('data-calculation-form="true"') ||
      body.includes("sc-industrial-form") ||
      body.includes("sc-smart-form-shell")
    );
  }
  return (
    body.includes('data-calculation-form-shell="true"') ||
    body.includes('data-calculation-form="true"') ||
    body.includes('data-calc-form="true"') ||
    body.includes("sc-industrial-form") ||
    body.includes("sc-ledger-cetele-form") ||
    body.includes("sc-smart-form-shell") ||
    body.includes("<form")
  );
}

function hasHardGate(body) {
  return (
    body.includes("Sign in to run this analyzer") ||
    body.includes("PremiumLoginPrompt") ||
    /data-premium-hard-gate\s*=\s*"true"/.test(body)
  );
}

async function auditRoute(path, kind) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const formMarker = hasFormMarker(body, kind);
  const hardGate = kind === "premium" ? hasHardGate(body) : false;
  const ok =
    result.ok &&
    result.status === 200 &&
    fatals.length === 0 &&
    formMarker &&
    !hardGate;

  return { ...result, fatals, formMarker, hardGate, ok };
}

async function main() {
  const locale = parseLocaleArg(process.argv);
  const baseUrl = getBaseUrl();
  const failures = [];
  let checked = 0;

  console.log(`=== All Calculation Forms Smoke (${baseUrl}) ===`);
  console.log(`Locale arg: ${locale === "en" ? "default" : locale}\n`);

  const premiumSlugs = loadPremiumSlugsFromRegistry();
  for (const slug of premiumSlugs) {
    const path = localePath(locale, `/tools/premium/${slug}`);
    const result = await auditRoute(path, "premium");
    checked += 1;
    const label = result.ok ? "✓" : "✗";
    console.log(
      `${label} premium ${path} → ${result.status || result.error || "error"}${result.formMarker ? "" : " [no form marker]"}`,
    );
    if (!result.ok) {
      failures.push({ path, kind: "premium", ...result });
    }
  }

  const freeSlugs = loadAllFreeToolSlugsFromRegistry();
  let freeLogged = 0;
  for (const slug of freeSlugs) {
    const path = localePath(locale, `/tools/free/${slug}`);
    const result = await auditRoute(path, "free");
    checked += 1;
    const label = result.ok ? "✓" : "✗";
    if (freeLogged < FREE_LOG_LIMIT || !result.ok) {
      console.log(
        `${label} free ${path} → ${result.status || result.error || "error"}${result.formMarker ? "" : " [no form marker]"}`,
      );
      freeLogged += 1;
    }
    if (!result.ok) {
      failures.push({ path, kind: "free", ...result });
    }
  }

  if (freeSlugs.length > FREE_LOG_LIMIT) {
    console.log(`… ${freeSlugs.length - FREE_LOG_LIMIT} additional free routes checked`);
  }

  for (const path of loadLegacyCalculatorRoutes()) {
    const localized = localePath(locale, path);
    const result = await auditRoute(localized, "legacy");
    checked += 1;
    const label = result.ok ? "✓" : "✗";
    console.log(
      `${label} legacy ${localized} → ${result.status || result.error || "error"}${result.formMarker ? "" : " [no form marker]"}`,
    );
    if (!result.ok) {
      failures.push({ path: localized, kind: "legacy", ...result });
    }
  }

  for (const loc of LOCALE_SAMPLES) {
    const path = localePath(loc, "/tools/premium/cnc-quote-risk-analyzer");
    const result = await auditRoute(path, "premium");
    checked += 1;
    const label = result.ok ? "✓" : "✗";
    console.log(`${label} locale ${loc}: ${path}`);
    if (!result.ok) {
      failures.push({ path, kind: "locale-premium", locale: loc, ...result });
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Routes checked: ${checked}`);
  console.log(`Premium: ${premiumSlugs.length}`);
  console.log(`Free: ${freeSlugs.length}`);
  console.log(`Legacy: ${loadLegacyCalculatorRoutes().length}`);
  console.log(`Failed: ${failures.length}`);

  if (failures.length > 0) {
    for (const failure of failures.slice(0, 12)) {
      console.error(
        `FAIL ${failure.path} status=${failure.status} marker=${failure.formMarker} fatals=${(failure.fatals ?? []).join(",")}`,
      );
    }
    process.exit(1);
  }

  console.log("\nAll calculation forms smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
