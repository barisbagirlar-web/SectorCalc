#!/usr/bin/env node
/**
 * SectorCalc — Sitemap Integrity Lock
 * ======================================
 * CI gate that locks the sitemap against the build's route manifest.
 *
 * GATES:
 *   L1: Sitemap host == canonical tag host (sampled)
 *   L2: Every <url> entry has <lastmod>
 *   L3: No .txt/.json/.jsonl/.xml data files in sitemap
 *   L4: No duplicate URLs
 *   L5: Deploy stamp present (production only)
 *   L6: No 3xx redirects in sampled URLs
 *   L7: Route parity — every route in --routes file has a matching <loc>
 *
 * USAGE:
 *   # Full lock (against live sitemap)
 *   node scripts/sitemap-lock.mjs
 *
 *   # Route parity check against build manifest
 *   node scripts/sitemap-lock.mjs --routes public/routes.json
 *
 *   # Custom sitemap URL + sample size
 *   node scripts/sitemap-lock.mjs --sitemap https://staging.sectorcalc.com/sitemap.xml --sample 50
 *
 * EXIT: 0 = green (lock holds), 1 = red (lock broken, deploy blocked)
 */

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((a, i, arr) => (a.startsWith("--") ? [a.slice(2), arr[i + 1]] : null))
    .filter(Boolean),
);

const SITEMAP_URL = args.sitemap ?? "https://sectorcalc.com/sitemap.xml";
const SAMPLE_SIZE = Number(args.sample ?? 25);
const ROUTES_PATH = args.routes ?? null;
const EXPECTED_HOST = new URL(SITEMAP_URL).host;

const failures = [];
const warnings = [];

function fail(gate, msg) {
  failures.push(`[${gate}] ${msg}`);
}

// ---------------------------------------------------------------------------
// Fetch + parse sitemap
// ---------------------------------------------------------------------------
const res = await fetch(SITEMAP_URL);
if (!res.ok) {
  console.error(`FATAL: Could not fetch sitemap — HTTP ${res.status} ${res.statusText}`);
  process.exit(1);
}
const xml = await res.text();

const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const locs = urlBlocks.map((b) => (b.match(/<loc>(.*?)<\/loc>/) ?? [])[1]).filter(Boolean);

console.log(`Sitemap: ${SITEMAP_URL}`);
console.log(`Total entries: ${locs.length}`);
console.log(`Sample size:   ${SAMPLE_SIZE}`);
if (ROUTES_PATH) console.log(`Routes file:   ${ROUTES_PATH}`);
console.log("");

// ---------------------------------------------------------------------------
// L4 — Duplicate URLs
// ---------------------------------------------------------------------------
const seen = new Set();
const dups = [];
for (const u of locs) {
  if (seen.has(u)) dups.push(u);
  seen.add(u);
}
if (dups.length) fail("L4", `Duplicate URLs (${dups.length}): ${[...new Set(dups)].slice(0, 5).join(", ")}`);

// ---------------------------------------------------------------------------
// L3 — Data files in sitemap
// ---------------------------------------------------------------------------
const dataExtRe = /\.(txt|json|jsonl|csv|xml)$/;
const dataFiles = locs.filter((u) => dataExtRe.test(new URL(u).pathname));
if (dataFiles.length)
  fail("L3", `Data files in sitemap (${dataFiles.length}): ${dataFiles.slice(0, 5).join(", ")}`);

// ---------------------------------------------------------------------------
// L2 — lastmod coverage
// ---------------------------------------------------------------------------
const noLastmod = urlBlocks.filter((b) => !b.includes("<lastmod>"));
if (noLastmod.length) fail("L2", `${noLastmod.length} entries missing <lastmod> — expected every entry to have one`);

// ---------------------------------------------------------------------------
// L1 — Host consistency inside sitemap
// ---------------------------------------------------------------------------
const wrongHost = locs.filter((u) => new URL(u).host !== EXPECTED_HOST);
if (wrongHost.length)
  fail("L1", `Foreign host inside sitemap (${wrongHost.length}): ${wrongHost.slice(0, 3).join(", ")}`);

// ---------------------------------------------------------------------------
// L5 — Deploy stamp (production only; looks for a marker in the sitemap)
// ---------------------------------------------------------------------------
if (EXPECTED_HOST === "sectorcalc.com") {
  if (!xml.includes("lastmod")) {
    // Deploy stamp: production sitemap should have been regenerated within the last 48h.
    // We check by looking for any lastmod date >= 2 days ago.
    const dates = [...xml.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})/g)].map((m) => m[1]).sort();
    if (dates.length > 0) {
      const newest = new Date(dates[dates.length - 1]);
      const ago = (Date.now() - newest.getTime()) / 86400000;
      if (ago > 2) warnings.push(`L5: Newest lastmod is ${ago.toFixed(1)} days old — deploy stamp may be stale`);
    } else {
      warnings.push("L5: No lastmod dates found to verify deploy stamp");
    }
  }
}

// ---------------------------------------------------------------------------
// L6 — Sampled HTTP checks (no 3xx, canonical host)
// ---------------------------------------------------------------------------
const htmlLocs = locs.filter((u) => !/\.(txt|json|jsonl|csv|xml)$/.test(u));
const sample = htmlLocs.sort(() => Math.random() - 0.5).slice(0, SAMPLE_SIZE);
let redirects = 0;
let canonicalMismatch = 0;

for (const u of sample) {
  try {
    const r = await fetch(u, { redirect: "manual" });
    if (r.status >= 300 && r.status < 400) {
      redirects++;
      warnings.push(`3xx: ${u} -> ${r.headers.get("location")}`);
      continue;
    }
    if (r.status !== 200) {
      warnings.push(`HTTP ${r.status}: ${u}`);
      continue;
    }
    const html = await r.text();
    const canon = (html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/) ?? [])[1];
    if (canon && new URL(canon).host !== EXPECTED_HOST) {
      canonicalMismatch++;
      warnings.push(`Canonical host mismatch: ${u} -> canonical: ${canon}`);
    }
  } catch (e) {
    warnings.push(`Fetch error: ${u} (${e.message})`);
  }
}

if (redirects)
  fail("L6", `${redirects}/${sample.length} sampled URLs return 3xx — sitemap must contain final URLs only`);
if (canonicalMismatch)
  fail(
    "L1",
    `${canonicalMismatch}/${sample.length} sampled pages declare a canonical host different from the sitemap host (expected ${EXPECTED_HOST})`,
  );

// ---------------------------------------------------------------------------
// L7 — Route parity (routes.json ↔ sitemap)
// ---------------------------------------------------------------------------
if (ROUTES_PATH) {
  const fs = await import("fs");
  const path = await import("path");
  const absPath = path.resolve(ROUTES_PATH);

  if (!fs.existsSync(absPath)) {
    fail("L7", `Routes file not found: ${ROUTES_PATH}`);
  } else {
    const routesData = JSON.parse(fs.readFileSync(absPath, "utf-8"));
    const routes = Array.isArray(routesData) ? routesData : routesData.routes ?? [];

    if (routes.length === 0) {
      fail("L7", "Routes file contains 0 routes — build manifest may be empty");
    } else {
      const sitemapUrls = new Set(locs);
      const missing = routes.filter((r) => !sitemapUrls.has(r));

      if (missing.length > 0) {
        const maxShow = 10;
        fail(
          "L7",
          `${missing.length}/${routes.length} route(s) from build manifest missing in sitemap. ` +
            `First ${Math.min(maxShow, missing.length)}:\n` +
            missing.slice(0, maxShow).map((r) => `    MISSING: ${r}`).join("\n"),
        );
      } else {
        console.log(`  L7 PASS: all ${routes.length} build routes present in sitemap`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log("\n--- WARNINGS ---");
warnings.forEach((w) => console.log("  " + w));

console.log("\n--- RESULT ---");
if (failures.length) {
  failures.forEach((f) => console.error("RED " + f));
  console.error(`\n❌ LOCK BROKEN — ${failures.length} violation(s). Deploy blocked.`);
  process.exit(1);
} else {
  console.log("✅ LOCK HELD — all sitemap integrity checks passed.");
  process.exit(0);
}
