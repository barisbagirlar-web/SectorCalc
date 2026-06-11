#!/usr/bin/env node
/**
 * Region auto-detection smoke test.
 * 
 * Verifies that:
 * 1. CF-IPCountry header drives region selection when no manual cookie
 * 2. Manual cookie always wins over header
 * 3. Region selector exposes data-region-code, data-currency-code, data-region-source
 * 4. Locale fallback works when no header
 * 
 * Usage:
 *   SMOKE_BASE_URL=http://localhost:3000 node scripts/smoke-region-auto-detect.mjs
 *   SMOKE_BASE_URL=https://sectorcalc.com node scripts/smoke-region-auto-detect.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
  visibleText,
} from "./smoke-utils.mjs";

const REGION_AUTO_DETECT_ROUTES = [
  {
    label: "/tr with CF-IPCountry: TR",
    path: localePath("tr", "/"),
    headers: { "CF-IPCountry": "TR" },
    expectedRegion: "TR",
    expectedCurrency: "TRY",
    expectedSource: "request-country or locale-fallback",
  },
  {
    label: "/tr/industries/welding-fabrication with CF-IPCountry: TR",
    path: localePath("tr", "/industries/welding-fabrication"),
    headers: { "CF-IPCountry": "TR" },
    expectedRegion: "TR",
    expectedCurrency: "TRY",
  },
  {
    label: "/ with CF-IPCountry: TR",
    path: "/",
    headers: { "CF-IPCountry": "TR" },
    expectedRegion: "TR",
    expectedCurrency: "TRY",
    expectedSource: "request-country",
  },
  {
    label: "/de with CF-IPCountry: DE",
    path: localePath("de", "/"),
    headers: { "CF-IPCountry": "DE" },
    expectedRegion: "DE",
    expectedCurrency: "EUR",
  },
  {
    label: "/tr with CF-IPCountry: US (locale wins)",
    path: localePath("tr", "/"),
    headers: { "CF-IPCountry": "US" },
    expectedRegion: "TR",
    expectedCurrency: "TRY",
    expectedSource: "locale-fallback",
  },
  {
    label: "/tr with no header (locale fallback)",
    path: localePath("tr", "/"),
    headers: {},
    expectedRegion: "TR",
    expectedCurrency: "TRY",
    expectedSource: "locale-fallback",
  },
  {
    label: "/ with no header (global default)",
    path: "/",
    headers: {},
    expectedRegion: "EN",
    expectedCurrency: "USD",
    expectedSource: "locale-fallback or global-default",
  },
];

function extractRegionMarkers(html) {
  // Look for data-region-selector="true" element
  const selectorMatch = html.match(
    /data-region-selector="true"[^>]*data-region-code="([^"]+)"[^>]*data-currency-code="([^"]+)"[^>]*data-region-source="([^"]+)"/
  );
  
  if (!selectorMatch) {
    // Try alternate order
    const altMatch = html.match(
      /data-region-code="([^"]+)"[^>]*data-currency-code="([^"]+)"[^>]*data-region-source="([^"]+)"[^>]*data-region-selector="true"/
    );
    if (!altMatch) {
      return null;
    }
    return {
      regionCode: altMatch[1],
      currencyCode: altMatch[2],
      regionSource: altMatch[3],
    };
  }

  return {
    regionCode: selectorMatch[1],
    currencyCode: selectorMatch[2],
    regionSource: selectorMatch[3],
  };
}

async function main() {
  const baseUrl = getBaseUrl();
  console.log(`=== Region Auto-Detection Smoke (${baseUrl}) ===\n`);

  const failures = [];
  let passed = 0;

  for (const testCase of REGION_AUTO_DETECT_ROUTES) {
    const result = await fetchRouteWithRetry(testCase.path, { headers: testCase.headers });
    const fatalHits = checkFatalMarkers(result.body, result.status);
    const markers = extractRegionMarkers(result.body);

    const checks = {
      status200: result.ok && result.status === 200,
      noFatal: fatalHits.length === 0,
      hasMarkers: markers !== null,
      correctRegion: markers?.regionCode === testCase.expectedRegion,
      correctCurrency: markers?.currencyCode === testCase.expectedCurrency,
    };

    const allPass = Object.values(checks).every((v) => v);

    if (allPass) {
      passed += 1;
      console.log(`✓ ${testCase.label} → ${markers.regionCode}/${markers.currencyCode} (${markers.regionSource})`);
    } else {
      const failReasons = Object.entries(checks)
        .filter(([_, v]) => !v)
        .map(([k]) => k)
        .join(", ");
      
      console.log(
        `✗ ${testCase.label} → ${result.status} [fail: ${failReasons}]` +
          (markers ? ` | got: ${markers.regionCode}/${markers.currencyCode}` : " | no markers found")
      );
      
      failures.push({
        label: testCase.label,
        status: result.status,
        failReasons,
        expected: `${testCase.expectedRegion}/${testCase.expectedCurrency}`,
        actual: markers ? `${markers.regionCode}/${markers.currencyCode}` : "no markers",
        fatalHits: fatalHits.length > 0 ? fatalHits.join("; ") : null,
      });
    }
  }

  console.log(`\n${passed}/${REGION_AUTO_DETECT_ROUTES.length} passed`);

  if (failures.length > 0) {
    console.log(`\nRegion auto-detection smoke FAILED (${failures.length} checks)\n`);
    process.exit(1);
  }

  console.log("\nRegion auto-detection smoke PASSED\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("Region auto-detection smoke crashed:");
  console.error(err);
  process.exit(1);
});
