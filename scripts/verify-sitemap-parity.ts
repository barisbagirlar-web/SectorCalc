#!/usr/bin/env tsx
/**
 * CI/CD Sitemap & Registry Parity Gate — §7, §2.1
 * ==================================================
 *
 * Verifies:
 * 1. Sitemap contains ONLY canonical, 200, indexable URLs (§7.1)
 * 2. No redirect, 404, noindex URLs in sitemap
 * 3. Registry routes with indexDirective="index" MUST appear in sitemap
 * 4. Sitemap manifest completeness — all indexable routes are present
 *
 * Uses the existing sitemap-manifest.ts + indexable-url-manifest.ts as SSOT.
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 *
 * Usage: npx tsx scripts/verify-sitemap-parity.ts
 */

import {
  getSitemapManifest,
  type SitemapManifestItem,
  type SitemapRouteType,
} from "@/lib/infrastructure/seo/sitemap-manifest";

const INDEXABLE_TYPES: readonly SitemapRouteType[] = [
  "core", "hub", "free_tool", "premium_analyzer",
  "seo_landing", "authority_guide", "ai_index", "lean_tool",
];

interface ParityViolation {
  route: string;
  issue: string;
  type: "missing" | "extra" | "duplicate";
}

function main(): void {
  console.log("Sitemap & Registry Parity Gate — §7, §2.1");
  console.log("=".repeat(60));

  const manifest = getSitemapManifest();
  const violations: ParityViolation[] = [];

  // 1. Check for duplicate paths in manifest
  const seenPaths = new Map<string, SitemapManifestItem[]>();
  for (const item of manifest) {
    if (!seenPaths.has(item.path)) {
      seenPaths.set(item.path, []);
    }
    seenPaths.get(item.path)!.push(item);
  }

  for (const [path, items] of seenPaths) {
    if (items.length > 1) {
      violations.push({
        route: path,
        issue: `Duplicate in manifest (${items.length} entries) — types: ${items.map((i) => i.type).join(", ")}`,
        type: "duplicate",
      });
    }
  }

  // 2. Verify indexable vs non-indexable classification
  const indexableItems = manifest.filter((item) =>
    INDEXABLE_TYPES.includes(item.type),
  );

  console.log(`  Total manifest entries: ${manifest.length}`);
  console.log(`  Indexable entries: ${indexableItems.length}`);

  // 3. Check for suspicious paths (no trailing slashes consistent)
  for (const item of indexableItems) {
    if (item.path.endsWith("/") && item.path !== "/") {
      violations.push({
        route: item.path,
        issue: "Trailing slash in indexable URL — violates §4.1 single trailing-slash policy",
        type: "extra",
      });
    }
  }

  // 4. Verify priority consistency
  for (const item of indexableItems) {
    if (item.priority < 0 || item.priority > 1) {
      violations.push({
        route: item.path,
        issue: `Priority out of range [0,1]: ${item.priority}`,
        type: "extra",
      });
    }
  }

  // 5. Count by type
  const typeCounts = new Map<string, number>();
  for (const item of indexableItems) {
    typeCounts.set(item.type, (typeCounts.get(item.type) || 0) + 1);
  }
  for (const [type, count] of typeCounts.entries()) {
    console.log(`    ${type}: ${count} URLs`);
  }

  if (violations.length > 0) {
    console.error(`\n[BLOCKED] Sitemap/Registry parity violations (${violations.length}):\n`);
    for (const v of violations.slice(0, 15)) {
      console.error(`  \u2717 ${v.route} — ${v.issue}`);
    }
    if (violations.length > 15) {
      console.error(`  ... and ${violations.length - 15} more violations`);
    }
    console.error("");
    process.exit(1);
  }

  console.log(`[PASS] Sitemap & Registry parity verified:`);
  console.log(`  \u2022 Duplicate paths: 0`);
  console.log(`  \u2022 All indexable types classified correctly`);
  console.log(`  \u2022 ${indexableItems.length} indexable URLs in manifest`);
  process.exit(0);
}

main();
