#!/usr/bin/env node

/**
 * guard-sitemap-root-contract.mjs
 *
 * Verifies that the project has a root /sitemap.xml provider,
 * robots.txt references the correct sitemap URL, and no locale
 * tokens leak into sitemap output.
 *
 * Usage: node scripts/guard-sitemap-root-contract.mjs
 */

import { readFileSync, existsSync } from "node:fs";

const ROOT_SITEMAP_CANDIDATES = [
  "src/app/sitemap.ts",
  "app/sitemap.ts",
  "src/app/sitemap.xml/route.ts",
  "app/sitemap.xml/route.ts",
  "public/sitemap.xml",
];

const ROBOTS_CANDIDATES = [
  "src/app/robots.ts",
  "app/robots.ts",
  "src/app/robots.txt/route.ts",
  "app/robots.txt/route.ts",
  "public/robots.txt",
];

const ADDITIONAL_SITEMAP_SCAN = [
  "src/lib/infrastructure/seo/seo-indexing-control.ts",
  "src/lib/infrastructure/seo/sitemap-manifest.ts",
  "src/lib/infrastructure/seo/sitemap-generator-helpers.ts",
  "public/sitemap-tools.xml",
  "scripts/generate-sitemap.mjs",
  "scripts/generate-sitemaps.mjs",
  "scripts/generate-sitemap-static.mjs",
  "scripts/generate-sitemap-static.ts",
  "scripts/smoke-sitemap-tools-release.mjs",
];

const SITEMAP_SCAN_FILES = [
  ...ROOT_SITEMAP_CANDIDATES,
  ...ADDITIONAL_SITEMAP_SCAN,
].filter((file) => existsSync(file));

const failures = [];

console.log("\n\uD83D\uDD0D Sitemap Root Contract Guard\n");

// Check 1: Root sitemap provider exists
const hasRootSitemap = ROOT_SITEMAP_CANDIDATES.some((file) => existsSync(file));

if (!hasRootSitemap) {
  failures.push("Missing root sitemap provider for /sitemap.xml.");
} else {
  const found = ROOT_SITEMAP_CANDIDATES.find((file) => existsSync(file));
  console.log(`  \u2705 Root sitemap provider: ${found}`);
}

// Check 2: robots.txt references the correct sitemap URL
// Check both the route handler and the source function
const robotsFiles = ROBOTS_CANDIDATES.filter((file) => existsSync(file));
const robotsText = robotsFiles.map((file) => readFileSync(file, "utf8")).join("\n");

const indexingSource = existsSync("src/lib/infrastructure/seo/seo-indexing-control.ts")
  ? readFileSync("src/lib/infrastructure/seo/seo-indexing-control.ts", "utf8")
  : "";

  const hasRobotsUrl =
  robotsText.includes("https://sectorcalc.com/sitemap.xml") ||
  indexingSource.includes("SITE_URL") && indexingSource.includes("/sitemap.xml");

if (!hasRobotsUrl) {
  failures.push("robots does not reference sectorcalc.com/sitemap.xml.");
} else {
  console.log(`  \u2705 robots.txt references correct sitemap URL`);
}

// Check 3: No locale tokens in sitemap-related files
const forbidden = [
  "https://sectorcalc.com/en",
  "https://sectorcalc.com/tr",
  "/en/",
  "/tr/",
  // Active hreflang generation (not comments mentioning "hreflang")
  'hreflang="',
  "xhtml:link",
];

for (const file of SITEMAP_SCAN_FILES) {
  const text = readFileSync(file, "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) {
      failures.push(`${file}: forbidden sitemap/root-only token: ${token}`);
    }
  }
}

// Check 4: If sitemap-tools.xml exists, root sitemap must exist too
if (existsSync("public/sitemap-tools.xml") && !hasRootSitemap) {
  failures.push("public/sitemap-tools.xml exists but root /sitemap.xml provider is missing.");
}

if (failures.length > 0) {
  console.error("\nSITEMAP_ROOT_CONTRACT_GUARD=FAIL");
  for (const failure of failures) console.error(`  \u274C ${failure}`);
  process.exit(1);
}

console.log("\n  \u2705 SITEMAP_ROOT_CONTRACT_GUARD=PASS");
console.log(`  robots_files=${robotsFiles.length}`);
console.log(`  scan_files=${SITEMAP_SCAN_FILES.length}`);
console.log("");
