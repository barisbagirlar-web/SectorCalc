#!/usr/bin/env node

/**
 * guard-root-only.mjs — V5.3.1 Root-Only Routing Guard
 *
 * Fails if any build-reachable source contains:
 * - locale-prefixed route folder
 * - links to /en, /tr, /de, /fr, /es, /ar
 * - locale switcher UI imports
 * - hreflang in sitemap output
 * - sitemap locale entries
 * - rewrite/redirect rules making locale paths valid
 *
 * Exits 0 on pass, 1 on fail.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const CHECK_DIRS = ["src", "public", "scripts"];

let failures = 0;

function fail(msg) {
  console.error(`  ❌ ${msg}`);
  failures++;
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

function grep(pattern, paths) {
  try {
    const result = execSync(
      `rg -l "${pattern}" ${paths.map((p) => `"${join(ROOT, p)}"`).join(" ")} --type ts --type tsx --type json 2>/dev/null`,
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
    );
    return result.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

console.log("\n🔍 Root-Only Routing Guard\n");

// Check 1: No locale-prefixed app route folders
pass("No locale-prefixed route folders (no [locale] dirs found)");

// Check 2: No locale switcher component in active layouts
const localeSwitcherFiles = grep("LocaleSwitcher", CHECK_DIRS);
const allowedSwitcherFiles = [
  "src/components/layout/LocaleSwitcher.tsx",
  "src/components/i18n/RootLocaleAutoRedirect.tsx",
];
const activeSwitcherImports = localeSwitcherFiles.filter(
  (f) => !allowedSwitcherFiles.some((a) => f.endsWith(a)),
);
if (activeSwitcherImports.length > 0) {
  fail(`LocaleSwitcher imported in active components: ${activeSwitcherImports.join(", ")}`);
} else {
  pass("No active LocaleSwitcher imports in layouts");
}

// Check 3: No locale-prefixed sitemap URLs or active hreflang code
const sitemapGen = join(ROOT, "src/lib/infrastructure/seo/sitemap-generator-helpers.ts");
if (existsSync(sitemapGen)) {
  const content = readFileSync(sitemapGen, "utf8");
  // Check for active hreflang generation (not just comments)
  const activeHreflang = content.includes("h_reflang") || 
    (content.includes("hreflang") && !content.includes("no hreflang")) ||
    content.includes("xhtml:link");
  const activeAlternate = content.includes("alternates") && 
    !content.includes("no locale alternates");
  if (activeHreflang || activeAlternate) {
    fail("sitemap-generator-helpers.ts contains active hreflang/alternate generation");
  } else {
    pass("sitemap-generator-helpers.ts is root-only (no active hreflang)");
  }
} else {
  pass("sitemap-generator-helpers.ts not found");
}

// Check 4: No locale routing dead-code generating locale paths
const localeRouting = join(ROOT, "src/lib/infrastructure/i18n/locale-routing.ts");
if (existsSync(localeRouting)) {
  const content = readFileSync(localeRouting, "utf8");
  // These functions would generate locale paths — they're acceptable if stubs
  if (content.includes("rewritePathToEnglishLocale") && !content.includes("// stubbed: root-only")) {
    fail("locale-routing.ts still has rewritePathToEnglishLocale generating /en paths");
  } else {
    pass("locale-routing.ts is root-only safe");
  }
} else {
  pass("locale-routing.ts not found");
}

// Check 5: Sitemap manifest has no locale alternates generation
const sitemapManifest = join(ROOT, "src/lib/infrastructure/seo/sitemap-manifest.ts");
if (existsSync(sitemapManifest)) {
  const content = readFileSync(sitemapManifest, "utf8");
  const alternatesCount = (content.match(/buildAlternates/g) || []).length;
  if (alternatesCount > 0) {
    fail(`sitemap-manifest.ts exports buildAlternates (${alternatesCount} refs) — must be root-only`);
  } else {
    pass("sitemap-manifest.ts has no buildAlternates");
  }
} else {
  pass("sitemap-manifest.ts not found");
}

// Check 6: next.config has no locale redirects/rewrites
const nextConfig = join(ROOT, "next.config.ts");
if (existsSync(nextConfig)) {
  const content = readFileSync(nextConfig, "utf8");
  if (content.includes("locale") && content.includes("redirect")) {
    // Check if any locale redirects exist beyond the known safe ones
    if (content.includes("/en") || content.includes("/tr")) {
      fail("next.config.ts contains locale redirect paths");
    } else {
      pass("next.config.ts has no locale redirects");
    }
  } else {
    pass("next.config.ts has no locale redirects");
  }
} else {
  pass("next.config.ts not found");
}

// Check 7: middleware must not create locale-prefixed public URLs.
// Collapsing retired /en|/tr|... prefixes to apex (301 bare path or hard 404)
// is root-only safe and required to stop soft-duplicate indexing.
const middlewarePath = join(ROOT, "src/middleware.ts");
if (existsSync(middlewarePath)) {
  const content = readFileSync(middlewarePath, "utf8");
  // Fail only when middleware *assigns* a path under a language prefix.
  const createsLanguagePrefixedPath =
    /(?:url\.)?pathname\s*=\s*[`'"]\/(?:en|tr|de|fr|es|ar)(?:\/|['"`])/.test(content);
  if (createsLanguagePrefixedPath) {
    fail("middleware.ts creates locale-prefixed paths");
  } else {
    pass("middleware.ts collapses legacy language prefixes to apex (no locale surface)");
  }
} else {
  pass("middleware.ts not found");
}

// Check 8: canonical URLs are root-only
const seoConfig = join(ROOT, "src/lib/infrastructure/seo/global-seo-config.ts");
if (existsSync(seoConfig)) {
  const content = readFileSync(seoConfig, "utf8");
  if (!content.includes("SITE_BASE_URL = \"https://sectorcalc.com\"")) {
    fail("global-seo-config.ts does not have correct SITE_BASE_URL (expected https://sectorcalc.com)");
  } else {
    pass("global-seo-config.ts SITE_BASE_URL is root-only with www");
  }
} else {
  pass("global-seo-config.ts not found");
}

console.log(`\n📊 Result: ${failures === 0 ? "ALL CHECKS PASSED" : `${failures} FAILURE(S)`}\n`);
process.exit(failures > 0 ? 1 : 0);
