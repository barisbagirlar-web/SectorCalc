#!/usr/bin/env node
/**
 * IndexNow ping for all IndustrialRegistry audit URLs.
 * Requires INDEXNOW_KEY in environment.
 * Run: npm run seo:indexnow
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../src/lib/os/registry/sector-registry.config.json"),
    "utf8",
  ),
);

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sectorcalc.com").replace(/\/$/, "");
const locales = ["en", "tr", "es", "de", "ar"];
const hubs = ["/os", "/audit", "/benchmarks", "/sustainability"];
const sectorKeys = Object.keys(config.sectors);

const urlList = [];
for (const locale of locales) {
  for (const hub of hubs) {
    urlList.push(`${siteUrl}/${locale}${hub}`);
  }
  for (const key of sectorKeys) {
    urlList.push(`${siteUrl}/${locale}/audit/${key}`);
  }
}

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.warn("INDEXNOW_KEY not set — skipping IndexNow ping.");
  process.exit(0);
}

const host = new URL(siteUrl).host;
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList,
  }),
});

console.log(
  response.ok
    ? `IndexNow OK — ${urlList.length} URLs (HTTP ${response.status})`
    : `IndexNow failed — HTTP ${response.status}`,
);

process.exit(response.ok ? 0 : 1);
