#!/usr/bin/env node
/**
 * Locale route smoke with fatal-marker detection and cold-start timing.
 * Env: SECTORCALC_AUDIT_BASE_URL=https://sectorcalc.com
 */

import {
  checkFatalMarkers,
  CRITICAL_SLOW_MS,
  fetchRouteWithRetry,
  formatSlowLabel,
  getBaseUrl,
  localePath,
  SLOW_WARNING_MS,
} from "./smoke-utils.mjs";

const ROUTE_MATRIX = {
  en: [
    "/",
    "/free-tools",
    "/premium-tools",
    "/industries",
    "/categories",
    "/pricing",
    "/login",
    "/account",
    "/account/reports",
  ],
  tr: [
    "/",
    "/free-tools",
    "/premium-tools",
    "/industries",
    "/categories",
    "/pricing",
    "/login",
    "/account",
    "/account/reports",
  ],
  ar: [
    "/",
    "/free-tools",
    "/premium-tools",
    "/industries",
    "/categories",
    "/pricing",
  ],
  de: [
    "/",
    "/free-tools",
    "/premium-tools",
    "/industries",
    "/categories",
    "/pricing",
  ],
  fr: [
    "/",
    "/free-tools",
    "/premium-tools",
    "/industries",
    "/categories",
    "/pricing",
  ],
  es: [
    "/",
    "/free-tools",
    "/premium-tools",
    "/industries",
    "/categories",
    "/pricing",
  ],
};

async function main() {
  const baseUrl = getBaseUrl();
  const allPaths = [];

  for (const [locale, routes] of Object.entries(ROUTE_MATRIX)) {
    for (const route of routes) {
      allPaths.push({ locale, path: localePath(locale, route) });
    }
  }

  console.log(`=== Locale Route Smoke (${baseUrl}) ===`);
  console.log(`Total routes: ${allPaths.length}\n`);

  const failures = [];
  const slowRoutes = [];
  let passed200 = 0;

  for (const { locale, path } of allPaths) {
    const result = await fetchRouteWithRetry(path);
    const fatalHits = checkFatalMarkers(result.body, result.status);
    const slowLabel = formatSlowLabel(result.durationMs);

    const httpOk = result.ok && result.status === 200;
    const noFatal = fatalHits.length === 0;
    const pass = httpOk && noFatal;

    if (pass) passed200 += 1;

    const label = pass ? "✓" : "✗";
    const timing = ` ${result.durationMs}ms`;
    const slowTag = slowLabel !== "OK" ? ` [${slowLabel}]` : "";
    const fatalTag = fatalHits.length > 0 ? ` fatal:${fatalHits.join(",")}` : "";
    const attempts = result.attempts > 1 ? ` (${result.attempts} attempts)` : "";

    console.log(
      `${label} [${locale}] ${path} → ${result.status || result.error || "error"}${timing}${slowTag}${fatalTag}${attempts}`
    );

    if (slowLabel === "SLOW" || slowLabel === "CRITICAL_SLOW") {
      slowRoutes.push({
        locale,
        path,
        durationMs: result.durationMs,
        level: slowLabel,
      });
    }

    if (!pass) {
      failures.push({
        locale,
        path,
        status: result.status,
        error: result.error,
        fatalHits,
        durationMs: result.durationMs,
        attempts: result.attempts,
      });
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total routes: ${allPaths.length}`);
  console.log(`HTTP 200 + no fatal markers: ${passed200}/${allPaths.length}`);
  console.log(`Failed: ${failures.length}`);

  if (slowRoutes.length > 0) {
    console.log(`\nSlow routes (>${SLOW_WARNING_MS}ms warning, >${CRITICAL_SLOW_MS}ms critical):`);
    for (const s of slowRoutes.sort((a, b) => b.durationMs - a.durationMs)) {
      console.log(`  [${s.level}] [${s.locale}] ${s.path} → ${s.durationMs}ms`);
    }
  } else {
    console.log("\nNo slow routes detected above threshold.");
  }

  if (failures.length > 0) {
    console.error("\nFailed routes:");
    for (const f of failures) {
      const parts = [f.path, `status=${f.status || f.error}`];
      if (f.fatalHits?.length) parts.push(`fatal=${f.fatalHits.join(",")}`);
      console.error(`  [${f.locale}] ${parts.join(" ")}`);
    }
    process.exit(1);
  }

  console.log("\nLocale route smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
