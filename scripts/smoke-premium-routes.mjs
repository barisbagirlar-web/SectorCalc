#!/usr/bin/env node
/**
 * Smoke-test all 27 premium revenue routes against production.
 * Usage: node scripts/smoke-premium-routes.mjs [--locale tr]
 * Env:   SECTORCALC_AUDIT_BASE_URL=https://sectorcalc.com
 */

import {
  fetchRouteWithRetry,
  getBaseUrl,
  loadPremiumSlugsFromRegistry,
  localePath,
  parseLocaleArg,
} from "./smoke-utils.mjs";

async function main() {
  const locale = parseLocaleArg(process.argv);
  const baseUrl = getBaseUrl();
  const slugs = loadPremiumSlugsFromRegistry();

  console.log(`=== Premium Route Smoke (${baseUrl}) ===`);
  console.log(`Locale: ${locale === "en" ? "default (no prefix)" : locale}`);
  console.log(`Premium analyzers to test: ${slugs.length}\n`);

  const failures = [];

  for (const slug of slugs) {
    const path = localePath(locale, `/tools/premium/${slug}`);
    const result = await fetchRouteWithRetry(path);

    const label = result.ok && result.status === 200 ? "✓" : "✗";
    const timing =
      result.durationMs > 0 ? ` ${result.durationMs}ms` : "";
    const attempts = result.attempts > 1 ? ` (${result.attempts} attempts)` : "";

    console.log(
      `${label} ${path} → ${result.status || result.error || "error"}${timing}${attempts}`
    );

    if (!result.ok || result.status !== 200) {
      failures.push({
        path,
        status: result.status,
        error: result.error,
        attempts: result.attempts,
      });
    }
  }

  const passed = slugs.length - failures.length;
  console.log(`\n=== Summary ===`);
  console.log(`Premium analyzers: ${passed}/${slugs.length}`);
  console.log(`Failed: ${failures.length} of ${slugs.length}`);

  if (failures.length > 0) {
    console.error("\nFailed paths:");
    for (const f of failures) {
      console.error(`  ${f.path} → ${f.status || f.error}`);
    }
    process.exit(1);
  }

  console.log("\nPremium route smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
