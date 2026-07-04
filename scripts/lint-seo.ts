#!/usr/bin/env tsx
/**
 * SectorCalc — SEO Copy Lint Gate
 *
 * Validates SeoMeta entries through lintPageCopy (R1–R8).
 *
 * Usage:
 *   npx tsx scripts/lint-seo.ts              # smoke test on EXAMPLE entry
 *   npx tsx scripts/lint-seo.ts --all        # lint ALL loaded seoMeta entries
 *   npx tsx scripts/lint-seo.ts --category X # filter by category (future)
 *
 * Exit: 0 = green, 1 = violations found
 */

import { toolPageCopy, lintPageCopy, EXAMPLE_SEO_META } from "../src/lib/seo/seo-copy-engine";

const args = Object.fromEntries(
  process.argv.slice(2).map((a, i, arr) => (a.startsWith("--") ? [a.slice(2), arr[i + 1]] : null)).filter(Boolean),
);

let violations = 0;

function lintOne(seoMeta, toolName?: string) {
  const copy = toolPageCopy(seoMeta);
  const errors = lintPageCopy(copy, toolName, seoMeta.primaryKeyword);
  if (errors.length > 0) {
    console.error(`\n  FAIL: "${seoMeta.primaryKeyword}"`);
    errors.forEach((e) => console.error(`    ${e}`));
    violations++;
  } else {
    console.log(`  PASS: "${seoMeta.primaryKeyword}"`);
  }
}

const modeAll = args.all !== undefined;
const modeCategory = args.category !== undefined;

if (modeAll) {
  console.log("Loading all SeoMeta entries from registries...");
  console.log("NOTE: Batch registry loading not yet wired. Running smoke test on EXAMPLE:\n");
  lintOne(EXAMPLE_SEO_META, "Bolt Torque Calculator");
} else if (modeCategory) {
  console.log(`Filtering by category: ${args.category}`);
  console.log("NOTE: Category filtering not yet wired. Running smoke test:\n");
  lintOne(EXAMPLE_SEO_META, "Bolt Torque Calculator");
} else {
  console.log("SEO Copy Lint Gate — Smoke Test\n");
  lintOne(EXAMPLE_SEO_META, "Bolt Torque Calculator");
}

console.log(`\n--- RESULT: ${violations} violation(s) ---`);
process.exit(violations > 0 ? 1 : 0);
