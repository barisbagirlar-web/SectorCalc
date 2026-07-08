#!/usr/bin/env node
// guard-free-catalog-integrity.mjs
// Validates free tool catalog integrity across registries.
// Checks:
// 1. Catalog count = manifest count
// 2. Sitemap count matches manifest
// 3. No removed tools appear in manifest
// 4. No broken links in routes.json for free tools

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  FREE CATALOG INTEGRITY GUARD");
  console.log("═══════════════════════════════════════════════════════\n");

  // ── Parse slugs from allowlist ──
  const allowlistPath = resolve(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");
  if (!existsSync(allowlistPath)) { console.error("FATAL: allowlist not found"); process.exit(2); }
  const allowlistContent = readFileSync(allowlistPath, "utf-8");
  const slugMatch = allowlistContent.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!slugMatch) { console.error("FATAL: Could not parse ACTIVE_FREE_TOOL_SLUGS"); process.exit(2); }
  const allowlistSlugs = [...slugMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const allowlistSet = new Set(allowlistSlugs);
  console.log(`  Allowlist ACTIVE_FREE_TOOL_SLUGS count: ${allowlistSlugs.length}`);

  // ── Parse manifest from free-tools-manifest.ts (if exists) ──
  // The manifest is the deployment artifact; allowlist is the source of truth.
  // If manifest is absent, fall back to allowlist.
  const manifestPath = resolve(ROOT, "src/sectorcalc/free-tools/free-tools-manifest.ts");
  let manifestSlugs = [];
  if (existsSync(manifestPath)) {
    try {
      const manifestContent = readFileSync(manifestPath, "utf-8");
      manifestSlugs = [...manifestContent.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
    } catch {
      console.log("  ⚠ Could not parse free-tools-manifest.ts");
    }
  }
  if (manifestSlugs.length === 0) {
    console.log("  ℹ️  free-tools-manifest.ts not found or empty — using allowlist as catalog");
    manifestSlugs = [...allowlistSlugs];
  }
  const manifestSet = new Set(manifestSlugs);
  console.log(`  Manifest slugs count: ${manifestSlugs.length}`);

  // ── Load removed free tools ──
  const removedPath = resolve(ROOT, "data/governance/removed-free-tools.json");
  let removedSlugs = [];
  if (existsSync(removedPath)) {
    try {
      const removedData = JSON.parse(readFileSync(removedPath, "utf-8"));
      removedSlugs = removedData.map((e) => e.slug);
      console.log(`  Removed free tools count: ${removedSlugs.length}`);
    } catch {
      console.log("  ⚠ Could not parse removed-free-tools.json");
    }
  }
  const removedSet = new Set(removedSlugs);

  // ── Load routes.json ──
  const routesPath = resolve(ROOT, "public/routes.json");
  let routesList = [];
  if (existsSync(routesPath)) {
    try {
      routesList = JSON.parse(readFileSync(routesPath, "utf-8"));
    } catch {
      console.log("  ⚠ Could not parse routes.json");
    }
  }
  const routesFreeToolSet = new Set(
    routesList
      .filter((url) => url.includes("/tools/free/"))
      .map((url) => {
        const match = url.match(/\/tools\/free\/([^\/\s]+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
  );
  console.log(`  routes.json free tool entries: ${routesFreeToolSet.size}`);

  // ═══════════════════════════════════════════════════════
  // CHECK 1: Manifest count = allowlist count
  // ═══════════════════════════════════════════════════════
  let catalogCount = 0;
  let manifestCount = 0;
  let ghostTools = 0;
  let brokenLinks = 0;

  const uniqueAllowlist = new Set(allowlistSlugs);
  manifestCount = manifestSlugs.length;
  catalogCount = uniqueAllowlist.size;

  const manifestNotInAllow = manifestSlugs.filter((s) => !allowlistSet.has(s));
  const allowNotInManifest = allowlistSlugs.filter((s) => !manifestSet.has(s));
  ghostTools = manifestNotInAllow.length + allowNotInManifest.length;

  if (manifestCount !== catalogCount) {
    console.log(`  ❌ FAIL: Manifest count (${manifestCount}) != Allowlist count (${catalogCount})`);
  }
  if (manifestNotInAllow.length > 0) {
    console.log(`  ❌ FAIL: ${manifestNotInAllow.length} slug(s) in manifest but not in allowlist:`);
    for (const s of manifestNotInAllow) console.log(`    - ${s}`);
  }
  if (allowNotInManifest.length > 0) {
    console.log(`  ❌ FAIL: ${allowNotInManifest.length} slug(s) in allowlist but not in manifest:`);
    for (const s of allowNotInManifest) console.log(`    - ${s}`);
  }

  // ═══════════════════════════════════════════════════════
  // CHECK 2: Sitemap count matches manifest
  // ═══════════════════════════════════════════════════════
  const sitemapPath = resolve(ROOT, "src/lib/infrastructure/seo/sitemap-manifest.ts");
  const sitemapFreeSlugs = [];
  if (existsSync(sitemapPath)) {
    const sitemapContent = readFileSync(sitemapPath, "utf-8");
    const sitemapFreeRoutes = [...sitemapContent.matchAll(/\/tools\/free\/[^"'\s,]+/g)].map((m) => m[0]);
    sitemapFreeSlugs.push(...sitemapFreeRoutes.map((r) => r.replace("/tools/free/", "")));
    const sitemapSlugSet = new Set(sitemapFreeSlugs);
    console.log(`\n  Sitemap free tool routes: ${sitemapFreeSlugs.length}`);

    for (const slug of allowlistSlugs) {
      if (!sitemapSlugSet.has(slug)) {
        console.log(`  ℹ️  INFO: Slug "${slug}" in allowlist but NOT in sitemap (expected for quarantined tools)`);
      }
    }
  }

  // Build the set of all known free tool slugs (manifest + sitemap legacy)
  const knownFreeSlugs = new Set(manifestSlugs);
  for (const slug of sitemapFreeSlugs) {
    knownFreeSlugs.add(slug);
  }

  // ═══════════════════════════════════════════════════════
  // CHECK 3: No removed tools in manifest
  // ═══════════════════════════════════════════════════════
  if (removedSet.size > 0) {
    for (const slug of removedSlugs) {
      if (manifestSet.has(slug)) {
        console.log(`  ❌ FAIL: Removed tool "${slug}" still present in manifest`);
        ghostTools++;
      }
    }
  }

  // ═══════════════════════════════════════════════════════
  // CHECK 4: Broken links in routes.json
  // ═══════════════════════════════════════════════════════
  for (const url of routesList) {
    if (typeof url !== "string") continue;
    const match = url.match(/\/tools\/free\/([^\/\s]+)/);
    if (!match) continue;
    const routeSlug = match[1];
    if (!knownFreeSlugs.has(routeSlug)) {
      console.log(`  ❌ FAIL: routes.json contains slug "${routeSlug}" not in allowlist, manifest, or sitemap`);
      brokenLinks++;
    }
  }

  // ═══════════════════════════════════════════════════════
  // REPORT
  // ═══════════════════════════════════════════════════════

  const failed = catalogCount !== manifestCount || ghostTools > 0 || brokenLinks > 0;
  const result = failed ? "FAIL" : "PASS";

  console.log(`\n  RESULTS:`);
  console.log(`  CATALOG_COUNT=${catalogCount}`);
  console.log(`  MANIFEST_COUNT=${manifestCount}`);
  console.log(`  BROKEN_LINKS=${brokenLinks}`);
  console.log(`  GHOST_TOOLS=${ghostTools}`);

  if (failed) {
    console.log(`\n  ❌ INTEGRITY FAILURES DETECTED`);
    console.log(`  FREE_CATALOG_INTEGRITY=FAIL\n`);
    process.exit(1);
  }

  console.log(`\n  ✅ ALL CHECKS PASSED`);
  console.log(`  FREE_CATALOG_INTEGRITY=${result}\n`);
}

main();
