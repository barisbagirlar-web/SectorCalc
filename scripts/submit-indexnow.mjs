#!/usr/bin/env node
/**
 * Submit public indexable URLs to IndexNow.
 * Reads manifest from scripts/.cache/indexable-urls.json (generated at prebuild).
 *
 * Env:
 *   INDEXNOW_KEY — required for submission; exits 0 with warning if missing
 *   SITE_HOST    — default sectorcalc-bf412.web.app
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const cacheFile = join(root, "scripts", ".cache", "indexable-urls.json");

const key = process.env.INDEXNOW_KEY?.trim();

if (!key) {
  console.warn(
    "INDEXNOW_KEY not set — skipping IndexNow submission. See docs/indexnow-setup.md",
  );
  process.exit(0);
}

function ensureManifestCache() {
  if (existsSync(cacheFile)) {
    return;
  }
  console.log("Manifest cache missing — exporting via tsx...");
  const result = spawnSync("npx", ["tsx", "scripts/export-indexable-manifest.ts"], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0 || !existsSync(cacheFile)) {
    console.error("Failed to export indexable URL manifest.");
    process.exit(1);
  }
}

ensureManifestCache();

const manifest = JSON.parse(readFileSync(cacheFile, "utf8"));
const host = normalizeHost(process.env.SITE_HOST ?? manifest.host ?? "sectorcalc-bf412.web.app");
const urlList = manifest.urls.map((url) => rewriteHost(url, host));

const keyFile = join(root, "public", `${key}.txt`);
if (!existsSync(keyFile)) {
  console.warn(
    `Warning: public/${key}.txt not found. Create it with the key value before IndexNow verification.`,
  );
}

const origin = `https://${host}`;
const body = {
  host,
  key,
  keyLocation: `${origin}/${key}.txt`,
  urlList,
};

async function submit() {
  let response;
  try {
    response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`IndexNow network error: ${message}`);
    process.exit(1);
  }

  const responseText = await response.text();

  if (response.ok) {
    console.log(`IndexNow OK — submitted ${urlList.length} URLs (HTTP ${response.status})`);
    console.log(`Host: ${host}`);
    console.log(`Key location: ${body.keyLocation}`);
    process.exit(0);
  }

  console.error(`IndexNow failed — HTTP ${response.status}`);
  if (responseText) {
    console.error(responseText);
  }
  process.exit(1);
}

function normalizeHost(value) {
  const trimmed = String(value).trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return new URL(trimmed).host;
  }
  return trimmed;
}

function rewriteHost(url, host) {
  try {
    const parsed = new URL(url);
    parsed.host = host;
    return parsed.href;
  } catch {
    return url;
  }
}

void submit();
