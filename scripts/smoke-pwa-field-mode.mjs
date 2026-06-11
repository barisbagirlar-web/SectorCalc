#!/usr/bin/env node
/**
 * P8 smoke: PWA assets + field mode / install markers across locales.
 * Usage: node scripts/smoke-pwa-field-mode.mjs
 *
 * Note: manifest.webmanifest / offline.html / sw.js are served as static
 * files by Firebase Hosting in production. Under local `next start` the
 * rewrite layer may 404 them; run this smoke against the deployed host.
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
  SUPPORTED_LOCALES,
} from "./smoke-utils.mjs";

const STATIC_ASSETS = ["/manifest.webmanifest", "/offline.html", "/sw.js"];
const SAMPLE_PATH = "/tools/premium/cnc-quote-risk-analyzer";
const ROUTES = SUPPORTED_LOCALES.map((locale) => localePath(locale, SAMPLE_PATH));
const MIN_BODY_LENGTH = 500;

async function auditAsset(path) {
  const result = await fetchRouteWithRetry(path);
  const ok = result.ok && result.status === 200 && (result.body ?? "").length > 0;
  return { ...result, ok };
}

async function auditRoute(path) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const bodyTooShort = body.length > 0 && body.length < MIN_BODY_LENGTH;
  const markers = {
    fieldModePanel: body.includes('data-field-mode-panel="true"'),
    installPrompt: body.includes('data-pwa-install-prompt="true"'),
    viewport: /name="viewport"/.test(body),
  };
  const ok =
    result.ok &&
    result.status === 200 &&
    fatals.length === 0 &&
    !bodyTooShort &&
    markers.fieldModePanel &&
    markers.installPrompt &&
    markers.viewport;
  return { ...result, fatals, bodyTooShort, markers, ok };
}

async function main() {
  const baseUrl = getBaseUrl();
  const failures = [];
  console.log(`=== PWA / Field Mode Smoke (${baseUrl}) ===\n`);

  console.log("PWA assets:");
  for (const path of STATIC_ASSETS) {
    const result = await auditAsset(path);
    console.log(`${result.ok ? "✓" : "✗"} ${path} → ${result.status || result.error || "error"}`);
    if (!result.ok) failures.push({ path, kind: "asset" });
  }

  console.log("\nField mode markers:");
  for (const path of ROUTES) {
    const result = await auditRoute(path);
    const missing = Object.entries(result.markers)
      .filter(([, present]) => !present)
      .map(([key]) => key);
    console.log(
      `${result.ok ? "✓" : "✗"} ${path} → ${result.status || result.error || "error"}${
        missing.length ? ` [missing: ${missing.join(", ")}]` : ""
      }${result.fatals.length ? ` [fatal: ${result.fatals.join(", ")}]` : ""}`,
    );
    if (!result.ok) failures.push({ path, kind: "route" });
  }

  if (failures.length > 0) {
    console.error(`\nPWA field mode smoke FAILED (${failures.length} checks)`);
    process.exit(1);
  }
  console.log("\nPWA field mode smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
