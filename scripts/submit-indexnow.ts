#!/usr/bin/env npx tsx
/**
 * Submit indexable URLs to IndexNow (tsx entry — prefer npm run seo:indexnow → .mjs).
 * Requires INDEXNOW_KEY and public/{key}.txt verification file.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  getIndexableFullUrls,
  normalizeSiteHost,
} from "../src/lib/seo/indexable-url-manifest";

const key = process.env.INDEXNOW_KEY?.trim();

if (!key) {
  console.warn("INDEXNOW_KEY not set — skipping IndexNow submission. See docs/indexnow-setup.md");
  process.exit(0);
}

const host = normalizeSiteHost(process.env.SITE_HOST ?? "sectorcalc-bf412.web.app");
const keyFile = join(process.cwd(), "public", `${key}.txt`);

if (!existsSync(keyFile)) {
  console.warn(
    `Warning: public/${key}.txt not found. Create it with the key value before IndexNow verification.`,
  );
}

const origin = `https://${host}`;
const urlList = getIndexableFullUrls(host);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${origin}/${key}.txt`,
    urlList,
  }),
});

const responseText = await response.text();

if (response.ok) {
  console.log(`IndexNow OK — submitted ${urlList.length} URLs (HTTP ${response.status})`);
  console.log(`Host: ${host}`);
  console.log(`Key location: ${origin}/${key}.txt`);
  process.exit(0);
}

console.error(`IndexNow failed — HTTP ${response.status}`);
if (responseText) {
  console.error(responseText);
}
process.exit(1);
