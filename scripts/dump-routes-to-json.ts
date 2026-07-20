#!/usr/bin/env tsx
/**
 * SectorCalc — Build-time Route Manifest Dumper
 *
 * Reads the sitemap manifest (single source of truth for all indexable routes)
 * and dumps every absolute URL to public/routes.json.
 *
 * This JSON is consumed by scripts/sitemap-lock.mjs (L7 route parity gate)
 * to verify that every build route has a matching <loc> in the live sitemap.
 *
 * Usage:
 *   npx tsx scripts/dump-routes-to-json.ts
 *
 * Env:
 *   NEXT_PUBLIC_SITE_URL  (default: https://sectorcalc.com)
 *
 * Output: public/routes.json  (array of absolute URL strings)
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { getSitemapManifest } from "../src/lib/infrastructure/seo/sitemap-manifest";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://sectorcalc.com").replace(/\/+$/, "");

const OUT_PATH = resolve(process.cwd(), "public/routes.json");

function main() {
  console.log("[dump-routes] Reading sitemap manifest...");

  const manifest = getSitemapManifest();
  console.log(`[dump-routes] Manifest entries: ${manifest.length}`);

  // Build absolute URLs from manifest paths
  const routes: string[] = manifest.map((item) => {
    const path = item.path.startsWith("/") ? item.path : `/${item.path}`;
    return `${SITE_URL}${path}`;
  });

  // Deduplicate by URL
  const unique = [...new Set(routes)].sort();
  console.log(`[dump-routes] Unique URLs: ${unique.length}`);

  // FAIL-SAFE: Never write an empty route manifest.
  // An empty manifest would cause sitemap-lock.mjs L7 to block deployment,
  // but the guard here prevents CDN cache poisoning at the source.
  if (unique.length === 0) {
    console.error("");
    console.error("═══════════════════════════════════════════════════════");
    console.error("  [dump-routes] FATAL: Route manifest is EMPTY (0 URLs).");
    console.error("  This means the sitemap manifest returned zero entries.");
    console.error("  Existing sitemap on CDN will NOT be overwritten.");
    console.error("  Deployment MUST be blocked until this is resolved.");
    console.error("═══════════════════════════════════════════════════════");
    console.error("");
    process.exit(1);
  }

  // Ensure public/ directory exists
  const outDir = dirname(OUT_PATH);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Write JSON
  writeFileSync(OUT_PATH, JSON.stringify(unique, null, 2), "utf-8");
  console.log(`[dump-routes] Written to ${OUT_PATH}`);
}

main();
