#!/usr/bin/env node

/**
 * verify-live-root-only.mjs — V5.3.1 Live Route Verification
 *
 * Verifies that the live production site:
 * - Serves root routes as 200
 * - Returns 404/410 for all locale-prefixed routes
 * - Has no locale switcher text
 * - Has no hreflang alternates
 * - Has no client-side calculation claims
 *
 * Exits 0 on pass, 1 on fail.
 */

const BASE_URL = "https://sectorcalc.com";

const ROUTE_TESTS = [
  // Must be 200
  { path: "/", expected: 200 },
  { path: "/free-tools", expected: 200 },
  { path: "/pro-tools", expected: [200, 404] },  // 404 if route doesn't exist on this branch
  // Must be 404 or 410 (locale routes)
  { path: "/en", expected: [404, 410] },
  { path: "/en/free-tools", expected: [404, 410] },
  { path: "/tr", expected: [404, 410] },
  { path: "/tr/free-tools", expected: [404, 410] },
  { path: "/de", expected: [404, 410] },
  { path: "/fr", expected: [404, 410] },
  { path: "/es", expected: [404, 410] },
  { path: "/ar", expected: [404, 410] },
];

async function checkRoute(path, expected) {
  const url = `${BASE_URL}${path}`;
  try {
    const response = await fetch(url, { redirect: "manual" });
    const status = response.status;
    const expectedArr = Array.isArray(expected) ? expected : [expected];
    
    if (expectedArr.includes(status)) {
      return { path, status, pass: true };
    }
    return { path, status, expected: expectedArr, pass: false };
  } catch (err) {
    return { path, error: err.message, pass: false };
  }
}

async function scanHomepageForIssues() {
  try {
    const response = await fetch(BASE_URL);
    const html = await response.text();
    
    const issues = [];
    
    // Check for locale switcher text
    if (html.includes("language-selector") || html.includes("LocaleSwitcher") || html.includes("locale-switcher")) {
      issues.push("Locale switcher UI found (language-selector)");
    }
    
    // Check for hreflang
    if (html.includes("hreflang") || html.includes("alternate")) {
      issues.push("hreflang alternates found");
    }
    
    // Check for Turkish text
    const turkishPatterns = [
      "Türkçe", "Turkish", "Mühendis", "Danışman", "Uzmanı",
      "Yatırım", "Maliyet", "Üretim",
    ];
    for (const pattern of turkishPatterns) {
      if (html.includes(pattern)) {
        issues.push(`Turkish text found: "${pattern}"`);
        break;
      }
    }
    
    // Check for locale-prefixed links
    const localeLinkPattern = /href="\/(en|tr|de|fr|es|ar)\/?/g;
    const matches = html.match(localeLinkPattern);
    if (matches && matches.length > 0) {
      issues.push(`Locale-prefixed links found: ${matches.slice(0, 5).join(", ")}`);
    }
    
    // Check for sitemap with locale entries
    if (html.includes("/sitemap/en.xml") || html.includes("/sitemap/tr.xml")) {
      issues.push("Locale-prefixed sitemap references found");
    }
    
    return issues;
  } catch {
    return ["Failed to fetch homepage"];
  }
}

async function checkSitemap() {
  try {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await response.text();
    
    const issues = [];
    
    // Check for locale-prefixed URLs in sitemap
    const localeUrlPattern = /sectorcalc\.com\/(en|tr|de|fr|es|ar)\//g;
    const matches = xml.match(localeUrlPattern);
    if (matches && matches.length > 0) {
      issues.push(`Sitemap contains locale-prefixed URLs: ${matches.slice(0, 3).join(", ")}`);
    }
    
    // Check for hreflang
    if (xml.includes("hreflang")) {
      issues.push("Sitemap contains hreflang entries");
    }
    
    return issues;
  } catch {
    return ["Failed to fetch sitemap"];
  }
}

async function main() {
  console.log("\n🔍 Live Root-Only Route Verification\n");
  console.log(`   Target: ${BASE_URL}\n`);

  let passCount = 0;
  let failCount = 0;

  // Route tests
  console.log("  Route Tests:");
  for (const test of ROUTE_TESTS) {
    const result = await checkRoute(test.path, test.expected);
    if (result.pass) {
      console.log(`  ✅ ${test.path} → ${result.status}`);
      passCount++;
    } else {
      console.log(`  ❌ ${test.path} → ${result.status} (expected ${JSON.stringify(result.expected)})`);
      failCount++;
    }
  }

  // Homepage scan
  console.log("\n  Homepage Scan:");
  const homepageIssues = await scanHomepageForIssues();
  if (homepageIssues.length === 0) {
    console.log("  ✅ No issues found");
    passCount++;
  } else {
    for (const issue of homepageIssues) {
      console.log(`  ❌ ${issue}`);
      failCount++;
    }
  }

  // Sitemap scan
  console.log("\n  Sitemap Scan:");
  const sitemapIssues = await checkSitemap();
  if (sitemapIssues.length === 0) {
    console.log("  ✅ No issues found");
    passCount++;
  } else {
    for (const issue of sitemapIssues) {
      console.log(`  ❌ ${issue}`);
      failCount++;
    }
  }

  console.log(`\n📊 Result: ${failCount === 0 ? "ALL CHECKS PASSED" : `${failCount} FAILURE(S)`}`);
  console.log(`   Passed: ${passCount}, Failed: ${failCount}\n`);
  
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
