#!/usr/bin/env npx tsx
/**
 * Export the indexable URL manifest to public/url-manifest.json.
 *
 * A stable, machine-readable artifact for:
 *   - IndexNow submission (`npm run seo:indexnow`)
 *   - Google Search Console URL inspection ordering
 *   - external automation (e.g. n8n HTTP node reading the published JSON)
 *
 * Env:
 *   SITE_HOST | NEXT_PUBLIC_SITE_URL — host for absolute URLs (default sectorcalc.com)
 *
 * Single source of truth: sitemap-manifest.ts -> getIndexableUrlManifest().
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildIndexableFullUrl,
  countIndexableUrlsByType,
  getIndexableUrlManifest,
  normalizeSiteHost,
} from "../src/lib/infrastructure/seo/indexable-url-manifest";

function resolveHost(): string {
  const raw = process.env.SITE_HOST ?? process.env.NEXT_PUBLIC_SITE_URL ?? "sectorcalc.com";
  return normalizeSiteHost(raw);
}

function main(): void {
  const host = resolveHost();
  const manifest = getIndexableUrlManifest();

  const payload = {
    generatedAt: new Date().toISOString(),
    host,
    total: manifest.length,
    byType: countIndexableUrlsByType(),
    urls: manifest.map((item) => ({
      url: buildIndexableFullUrl(item.path, host),
      path: item.path,
      type: item.type,
      priority: item.priority,
      inspectionOrder: item.inspectionOrder,
    })),
  };

  const outPath = join(process.cwd(), "public", "url-manifest.json");
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`URL manifest written: ${outPath}`);
  console.log(`Host: ${host}`);
  console.log(`Total indexable URLs: ${payload.total}`);
  for (const [type, count] of Object.entries(payload.byType)) {
    console.log(`  ${type}: ${count}`);
  }
}

main();
