#!/usr/bin/env npx tsx
/**
 * Export indexable URL manifest for IndexNow mjs script.
 * Writes scripts/.cache/indexable-urls.json (gitignored).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  countIndexableUrlsByType,
  getIndexableFullUrls,
  getIndexableUrlManifest,
  normalizeSiteHost,
} from "../src/lib/seo/indexable-url-manifest";

const host = normalizeSiteHost(process.env.SITE_HOST ?? "sectorcalc-bf412.web.app");
const outDir = join(process.cwd(), "scripts", ".cache");
mkdirSync(outDir, { recursive: true });

const payload = {
  host,
  generatedAt: new Date().toISOString(),
  urlCount: getIndexableUrlManifest().length,
  countsByType: countIndexableUrlsByType(),
  urls: getIndexableFullUrls(host),
};

writeFileSync(join(outDir, "indexable-urls.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Exported ${payload.urlCount} indexable URLs to scripts/.cache/indexable-urls.json`);
