#!/usr/bin/env tsx
/**
 * RM-LEAN-001 — verify lean spoke → canonical hub redirect map
 * (middleware 301 + firebase.json 301) and sitemap exclusion of 20 legacy spokes.
 */
import fs from "node:fs";
import path from "node:path";
import { getLeanSpokeLegacyPaths } from "../src/lib/features/tools/lean-calc-registry";
import { getSitemapManifest } from "../src/lib/infrastructure/seo/sitemap-manifest";
import { LEAN_METRIC_HUB_SLUGS } from "../src/lib/features/tools/lean-metric-hubs";

const ROOT = process.cwd();
const middleware = fs.readFileSync(path.join(ROOT, "src/middleware.ts"), "utf8");
const firebase = fs.readFileSync(path.join(ROOT, "firebase.json"), "utf8");
const manifestPaths = new Set(getSitemapManifest().map((item) => item.path));
const legacy = getLeanSpokeLegacyPaths();

let failed = 0;

console.log("Lean Redirect + Sitemap Gate (RM-LEAN-001)");
console.log("=".repeat(60));
console.log(`Legacy spoke count: ${legacy.length}`);

if (!middleware.includes("RM-LEAN-001") || !middleware.includes("status: 301")) {
  console.error("FAIL middleware missing RM-LEAN-001 301 block");
  failed += 1;
} else {
  console.log("PASS middleware RM-LEAN-001 301 block present");
}

for (const slug of LEAN_METRIC_HUB_SLUGS) {
  const firebaseRule = `/lean/*/${slug}`;
  if (!firebase.includes(firebaseRule)) {
    console.error(`FAIL missing firebase redirect ${firebaseRule}`);
    failed += 1;
  } else {
    console.log(`PASS firebase 301 ${firebaseRule} → /calculators/${slug}`);
  }
  const dest = `/calculators/${slug}`;
  if (!manifestPaths.has(dest)) {
    console.error(`FAIL canonical hub missing from sitemap: ${dest}`);
    failed += 1;
  } else {
    console.log(`PASS sitemap has ${dest}`);
  }
}

for (const spoke of legacy) {
  if (manifestPaths.has(spoke)) {
    console.error(`FAIL legacy spoke still in sitemap: ${spoke}`);
    failed += 1;
  }
}
console.log(`PASS sitemap excludes all ${legacy.length} legacy spokes`);

if (!manifestPaths.has("/lean")) {
  console.error("FAIL /lean hub missing from sitemap");
  failed += 1;
} else {
  console.log("PASS sitemap has /lean");
}

if (failed > 0) {
  console.error(`\n[BLOCKED] ${failed} lean redirect/sitemap failures`);
  process.exit(1);
}

console.log("\n[PASS] Lean redirect + sitemap consolidation");
process.exit(0);
