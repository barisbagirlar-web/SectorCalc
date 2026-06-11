#!/usr/bin/env node
/**
 * P39 Discovery UX smoke test.
 * 
 * Verifies sector-first discovery system with global search:
 * 1. All 4 main routes (/premium-tools, /free-tools, /industries, /categories) return 200
 * 2. Search component present with data-tool-search="true"
 * 3. SSR crawlable links exist (not client-only search trap)
 * 4. All 6 locales work without crash
 * 5. /en routes are not generated
 * 
 * Usage:
 *   SMOKE_BASE_URL=http://localhost:3000 node scripts/smoke-discovery-ux.mjs
 *   SMOKE_BASE_URL=https://sectorcalc.com node scripts/smoke-discovery-ux.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
} from "./smoke-utils.mjs";

const DISCOVERY_ROUTES = [
  // EN root routes
  {
    locale: "en",
    path: "/premium-tools",
    label: "/premium-tools",
    requiresSearch: true,
    requiresSsrLinks: true,
    linkPattern: /tools\/premium\//,
  },
  {
    locale: "en",
    path: "/free-tools",
    label: "/free-tools",
    requiresSearch: true,
    requiresSsrLinks: true,
    linkPattern: /tools\/free\//,
  },
  {
    locale: "en",
    path: "/industries",
    label: "/industries",
    requiresSearch: true,
    requiresSsrLinks: true,
    linkPattern: /industries\//,
  },
  {
    locale: "en",
    path: "/categories",
    label: "/categories",
    requiresSearch: true,
    requiresSsrLinks: true,
  },
  
  // TR locale
  {
    locale: "tr",
    path: "/tr/premium-tools",
    label: "/tr/premium-tools",
    requiresSearch: true,
  },
  {
    locale: "tr",
    path: "/tr/free-tools",
    label: "/tr/free-tools",
    requiresSearch: true,
  },
  {
    locale: "tr",
    path: "/tr/industries",
    label: "/tr/industries",
    requiresSearch: true,
  },
  {
    locale: "tr",
    path: "/tr/categories",
    label: "/tr/categories",
    requiresSearch: true,
  },
  
  // AR locale
  {
    locale: "ar",
    path: "/ar/premium-tools",
    label: "/ar/premium-tools (RTL)",
    requiresSearch: true,
  },
  
  // DE locale
  {
    locale: "de",
    path: "/de/premium-tools",
    label: "/de/premium-tools",
    requiresSearch: true,
  },
  
  // FR locale
  {
    locale: "fr",
    path: "/fr/premium-tools",
    label: "/fr/premium-tools",
    requiresSearch: true,
  },
  
  // ES locale
  {
    locale: "es",
    path: "/es/premium-tools",
    label: "/es/premium-tools",
    requiresSearch: true,
  },
  
  // /en prefix guard
  {
    locale: "en",
    path: "/en/premium-tools",
    label: "/en/premium-tools (must not be 200)",
    expectNot200: true,
    skipEnPrefixCheck: true,
  },
  {
    locale: "en",
    path: "/en",
    label: "/en (must redirect)",
    expectNot200: true,
    skipEnPrefixCheck: true,
  },
];

function extractSearchMarkers(html) {
  const searchMatch = html.match(/data-tool-search="true"/);
  const scopeMatch = html.match(/data-search-scope="([^"]+)"/);
  const countMatch = html.match(/data-search-result-count="(\d+)"/);
  
  if (!searchMatch) {
    return null;
  }
  
  return {
    hasSearch: true,
    scope: scopeMatch ? scopeMatch[1] : "unknown",
    resultCount: countMatch ? parseInt(countMatch[1], 10) : 0,
  };
}

function checkSsrLinks(html, pattern) {
  if (!pattern) {
    return { hasSsrLinks: true, linkCount: 0 };
  }
  
  const matches = html.match(pattern);
  return {
    hasSsrLinks: matches !== null,
    linkCount: matches ? matches.length : 0,
  };
}

async function main() {
  const baseUrl = getBaseUrl();
  console.log(`=== P39 Discovery UX Smoke (${baseUrl}) ===\n`);

  const failures = [];
  let passed = 0;

  for (const testCase of DISCOVERY_ROUTES) {
    const result = await fetchRouteWithRetry(testCase.path, {
      skipEnPrefixCheck: testCase.skipEnPrefixCheck,
    });
    const fatalHits = checkFatalMarkers(result.body, result.status);
    const searchMarkers = extractSearchMarkers(result.body);
    const ssrLinks = checkSsrLinks(result.body, testCase.linkPattern);

    const checks = {
      status200: testCase.expectNot200 ? result.status !== 200 : result.ok && result.status === 200,
      noFatal: fatalHits.length === 0 || testCase.expectNot200,
      hasSearch: !testCase.requiresSearch || searchMarkers !== null,
      hasSsrLinks: !testCase.requiresSsrLinks || ssrLinks.hasSsrLinks,
    };

    const allPass = Object.values(checks).every((v) => v);

    if (allPass) {
      passed += 1;
      const extra = testCase.requiresSearch && searchMarkers
        ? ` → search:${searchMarkers.scope}`
        : "";
      console.log(`✓ ${testCase.label}${extra}`);
    } else {
      const failReasons = Object.entries(checks)
        .filter(([_, v]) => !v)
        .map(([k]) => k)
        .join(", ");
      
      console.log(`✗ ${testCase.label} → ${result.status} [fail: ${failReasons}]`);
      
      failures.push({
        label: testCase.label,
        status: result.status,
        failReasons,
        fatalHits: fatalHits.length > 0 ? fatalHits.join("; ") : null,
      });
    }
  }

  console.log(`\n${passed}/${DISCOVERY_ROUTES.length} passed`);

  if (failures.length > 0) {
    console.log(`\nP39 Discovery UX smoke FAILED (${failures.length} checks)\n`);
    process.exit(1);
  }

  console.log("\nP39 Discovery UX smoke PASSED\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("P39 Discovery UX smoke crashed:");
  console.error(err);
  process.exit(1);
});
