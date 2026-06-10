#!/usr/bin/env node
/**
 * Smoke-test all 27 premium routes for Smart Form + public preview markers.
 * Usage: node scripts/smoke-premium-smart-forms.mjs [--locale tr]
 */

import {
  fetchRouteWithRetry,
  getBaseUrl,
  loadPremiumSlugsFromRegistry,
  localePath,
  parseLocaleArg,
} from "./smoke-utils.mjs";

const SMART_FORM_MARKER = 'data-smart-form-shell="true"';
const PUBLIC_PREVIEW_MARKER = 'data-premium-access-mode="public-preview"';
const HARD_GATE_MARKERS = [
  "Sign in to check SectorCalc Pro access",
  "Sign in required to use this analyzer",
];

async function main() {
  const locale = parseLocaleArg(process.argv);
  const baseUrl = getBaseUrl();
  const slugs = loadPremiumSlugsFromRegistry();

  console.log(`=== Premium Smart Form Smoke (${baseUrl}) ===`);
  console.log(`Locale: ${locale === "en" ? "default (no prefix)" : locale}`);
  console.log(`Premium analyzers to test: ${slugs.length}\n`);

  const failures = [];

  for (const slug of slugs) {
    const path = localePath(locale, `/tools/premium/${slug}`);
    const result = await fetchRouteWithRetry(path);

    const label = result.ok && result.status === 200 ? "✓" : "✗";
    const timing = result.durationMs > 0 ? ` ${result.durationMs}ms` : "";
    console.log(`${label} ${path} → ${result.status || result.error || "error"}${timing}`);

    if (!result.ok || result.status !== 200) {
      failures.push({ path, reason: result.error || `HTTP ${result.status}` });
      continue;
    }

    const body = result.body ?? "";
    if (!body.includes(SMART_FORM_MARKER)) {
      failures.push({ path, reason: "missing Smart Form shell marker" });
      continue;
    }

    if (!body.includes(PUBLIC_PREVIEW_MARKER)) {
      failures.push({ path, reason: "missing public preview access mode marker" });
      continue;
    }

    if (body.includes("Application error") || body.includes("__next_error__")) {
      failures.push({ path, reason: "fatal application error marker in body" });
      continue;
    }

    if (body.length < 1500) {
      failures.push({ path, reason: `body too short (${body.length} bytes)` });
      continue;
    }

    const hardGate = HARD_GATE_MARKERS.find((marker) => body.includes(marker));
    if (hardGate) {
      failures.push({ path, reason: `hard gate marker: ${hardGate}` });
    }
  }

  const passed = slugs.length - failures.length;
  console.log(`\n=== Summary ===`);
  console.log(`Premium smart forms: ${passed}/${slugs.length}`);
  console.log(`Failed: ${failures.length}`);

  if (failures.length > 0) {
    console.error("\nFailed paths:");
    for (const failure of failures) {
      console.error(`  ${failure.path} → ${failure.reason}`);
    }
    process.exit(1);
  }

  console.log("\nPremium smart form smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
