#!/usr/bin/env npx tsx
/**
 * Submit all public sitemap URLs to IndexNow.
 * Requires INDEXNOW_KEY in environment and public/{key}.txt verification file.
 */
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { siteUrl } from "../src/config/site";
import { buildSitemapEntries } from "../src/lib/seo/build-sitemap";

const key = process.env.INDEXNOW_KEY?.trim();

if (!key) {
  console.warn("INDEXNOW_KEY not set — skipping IndexNow submission.");
  process.exit(0);
}

const keyFile = join(process.cwd(), "public", `${key}.txt`);
if (!existsSync(keyFile)) {
  writeFileSync(keyFile, key, "utf8");
  console.log(`Created verification file: public/${key}.txt`);
}

const host = new URL(siteUrl).host;
const urlList = buildSitemapEntries().map((entry) => entry.url);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${siteUrl.replace(/\/$/, "")}/${key}.txt`,
    urlList,
  }),
});

if (response.ok) {
  console.log(`IndexNow OK — submitted ${urlList.length} URLs (HTTP ${response.status})`);
  process.exit(0);
}

console.error(`IndexNow failed — HTTP ${response.status}`);
process.exit(1);
