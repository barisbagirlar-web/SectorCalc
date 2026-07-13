#!/usr/bin/env node
/**
 * SectorCalc — Sitemap Integrity Lock
 *
 * Modes:
 *   Local pre-deploy: --local public/sitemap-ci.xml --routes public/routes.json
 *   Live post-deploy: --sitemap https://sectorcalc.com/sitemap.xml --sample 50
 *
 * Local mode validates deterministic sitemap structure and route parity without
 * comparing an undeployed branch against the current production deployment.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const rawArgs = process.argv.slice(2);
const args = {};
for (let index = 0; index < rawArgs.length; index += 1) {
  const token = rawArgs[index];
  if (!token.startsWith("--")) continue;
  const key = token.slice(2);
  const next = rawArgs[index + 1];
  args[key] = next && !next.startsWith("--") ? next : true;
  if (args[key] !== true) index += 1;
}

const LOCAL_SITEMAP_PATH = typeof args.local === "string" ? args.local : null;
const SITEMAP_URL =
  typeof args.sitemap === "string"
    ? args.sitemap
    : "https://sectorcalc.com/sitemap.xml";
const ROUTES_PATH = typeof args.routes === "string" ? args.routes : null;
const SAMPLE_SIZE = Number(typeof args.sample === "string" ? args.sample : 25);
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sectorcalc.com").replace(/\/+$/, "");
const EXPECTED_HOST = LOCAL_SITEMAP_PATH
  ? new URL(SITE_URL).host
  : new URL(SITEMAP_URL).host;
const IS_LOCAL_MODE = LOCAL_SITEMAP_PATH !== null;

if (!Number.isInteger(SAMPLE_SIZE) || SAMPLE_SIZE < 0 || SAMPLE_SIZE > 500) {
  console.error(`FATAL: Invalid --sample value: ${String(args.sample)}`);
  process.exit(1);
}

const failures = [];
const warnings = [];

function fail(gate, message) {
  failures.push(`[${gate}] ${message}`);
}

async function loadSitemapXml() {
  if (LOCAL_SITEMAP_PATH) {
    const absolutePath = resolve(LOCAL_SITEMAP_PATH);
    if (!existsSync(absolutePath)) {
      console.error(`FATAL: Local sitemap file not found: ${LOCAL_SITEMAP_PATH}`);
      process.exit(1);
    }
    return readFileSync(absolutePath, "utf8");
  }

  const response = await fetch(SITEMAP_URL, { redirect: "error" });
  if (!response.ok) {
    console.error(
      `FATAL: Could not fetch sitemap — HTTP ${response.status} ${response.statusText}`,
    );
    process.exit(1);
  }
  return response.text();
}

const xml = await loadSitemapXml();
const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
const locs = urlBlocks
  .map((block) => (block.match(/<loc>(.*?)<\/loc>/) ?? [])[1])
  .filter(Boolean);

console.log(`Mode:       ${IS_LOCAL_MODE ? "LOCAL_PREDEPLOY" : "LIVE_POSTDEPLOY"}`);
console.log(`Sitemap:    ${LOCAL_SITEMAP_PATH ?? SITEMAP_URL}`);
console.log(`Total:      ${locs.length}`);
console.log(`Sample:     ${IS_LOCAL_MODE ? 0 : SAMPLE_SIZE}`);
if (ROUTES_PATH) console.log(`Routes:     ${ROUTES_PATH}`);
console.log("");

if (locs.length === 0) {
  fail("L0", "Sitemap contains no <url>/<loc> entries");
}

// L4 — Duplicate URLs
const seen = new Set();
const duplicates = [];
for (const location of locs) {
  if (seen.has(location)) duplicates.push(location);
  seen.add(location);
}
if (duplicates.length > 0) {
  fail(
    "L4",
    `Duplicate URLs (${duplicates.length}): ${[...new Set(duplicates)].slice(0, 5).join(", ")}`,
  );
}

// L3 — Data files must not be in an XML sitemap.
const dataExtension = /\.(txt|json|jsonl|csv|xml)$/i;
const malformedUrls = [];
const dataFiles = [];
const wrongHost = [];
for (const location of locs) {
  try {
    const parsed = new URL(location);
    if (dataExtension.test(parsed.pathname)) dataFiles.push(location);
    if (parsed.host !== EXPECTED_HOST) wrongHost.push(location);
  } catch {
    malformedUrls.push(location);
  }
}
if (malformedUrls.length > 0) {
  fail("L0", `Malformed absolute URLs (${malformedUrls.length}): ${malformedUrls.slice(0, 5).join(", ")}`);
}
if (dataFiles.length > 0) {
  fail("L3", `Data files in sitemap (${dataFiles.length}): ${dataFiles.slice(0, 5).join(", ")}`);
}

// L2 — every entry requires lastmod.
const missingLastModified = urlBlocks.filter((block) => !block.includes("<lastmod>"));
if (missingLastModified.length > 0) {
  fail("L2", `${missingLastModified.length} entries missing <lastmod>`);
}

// L1 — host consistency.
if (wrongHost.length > 0) {
  fail("L1", `Foreign host inside sitemap (${wrongHost.length}): ${wrongHost.slice(0, 3).join(", ")}`);
}

// L5 — live deploy freshness is meaningful only after deployment.
if (!IS_LOCAL_MODE && EXPECTED_HOST === "sectorcalc.com") {
  const dates = [...xml.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})/g)]
    .map((match) => match[1])
    .sort();
  if (dates.length === 0) {
    warnings.push("L5: No lastmod dates found to verify deploy freshness");
  } else {
    const newest = new Date(`${dates.at(-1)}T00:00:00Z`);
    const ageDays = (Date.now() - newest.getTime()) / 86_400_000;
    if (ageDays > 2) {
      warnings.push(`L5: Newest lastmod is ${ageDays.toFixed(1)} days old`);
    }
  }
}

// L6 — live URL/canonical sampling. Never run this against an undeployed branch.
if (!IS_LOCAL_MODE && SAMPLE_SIZE > 0) {
  const htmlLocations = locs
    .filter((location) => {
      try {
        return !dataExtension.test(new URL(location).pathname);
      } catch {
        return false;
      }
    })
    .sort();
  const sample = htmlLocations.slice(0, SAMPLE_SIZE);
  let redirects = 0;
  let canonicalMismatch = 0;

  for (const location of sample) {
    try {
      const response = await fetch(location, { redirect: "manual" });
      if (response.status >= 300 && response.status < 400) {
        redirects += 1;
        warnings.push(`3xx: ${location} -> ${response.headers.get("location")}`);
        continue;
      }
      if (response.status !== 200) {
        warnings.push(`HTTP ${response.status}: ${location}`);
        continue;
      }
      const html = await response.text();
      const canonical =
        (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ?? [])[1] ??
        (html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i) ?? [])[1];
      if (canonical && new URL(canonical).host !== EXPECTED_HOST) {
        canonicalMismatch += 1;
        warnings.push(`Canonical host mismatch: ${location} -> ${canonical}`);
      }
    } catch (error) {
      warnings.push(`Fetch error: ${location} (${error instanceof Error ? error.message : String(error)})`);
    }
  }

  if (redirects > 0) {
    fail("L6", `${redirects}/${sample.length} sampled URLs return 3xx`);
  }
  if (canonicalMismatch > 0) {
    fail(
      "L1",
      `${canonicalMismatch}/${sample.length} sampled pages declare a different canonical host`,
    );
  }
}

// L7 — route manifest ↔ sitemap parity.
if (ROUTES_PATH) {
  const absoluteRoutesPath = resolve(ROUTES_PATH);
  if (!existsSync(absoluteRoutesPath)) {
    fail("L7", `Routes file not found: ${ROUTES_PATH}`);
  } else {
    let routesData;
    try {
      routesData = JSON.parse(readFileSync(absoluteRoutesPath, "utf8"));
    } catch (error) {
      fail("L7", `Routes file is invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
      routesData = [];
    }

    const routes = Array.isArray(routesData) ? routesData : routesData.routes ?? [];
    if (routes.length === 0) {
      fail("L7", "Routes file contains 0 routes");
    } else {
      const sitemapUrls = new Set(locs);
      const missing = routes.filter((route) => !sitemapUrls.has(route));
      const unexpected = locs.filter((location) => !new Set(routes).has(location));

      if (missing.length > 0) {
        fail(
          "L7",
          `${missing.length}/${routes.length} route(s) missing in sitemap:\n${missing
            .slice(0, 10)
            .map((route) => `    MISSING: ${route}`)
            .join("\n")}`,
        );
      }
      if (IS_LOCAL_MODE && unexpected.length > 0) {
        fail(
          "L7",
          `${unexpected.length}/${locs.length} sitemap URL(s) absent from route manifest:\n${unexpected
            .slice(0, 10)
            .map((route) => `    UNEXPECTED: ${route}`)
            .join("\n")}`,
        );
      }
      if (missing.length === 0 && (!IS_LOCAL_MODE || unexpected.length === 0)) {
        console.log(`L7 PASS: exact parity across ${routes.length} routes`);
      }
    }
  }
}

console.log("\n--- WARNINGS ---");
if (warnings.length === 0) console.log("  none");
for (const warning of warnings) console.log(`  ${warning}`);

console.log("\n--- RESULT ---");
if (failures.length > 0) {
  for (const failure of failures) console.error(`RED ${failure}`);
  console.error(`\nLOCK_BROKEN=${failures.length}`);
  process.exit(1);
}

console.log("SITEMAP_LOCK=PASS");
process.exit(0);
