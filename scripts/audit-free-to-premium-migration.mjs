#!/usr/bin/env node
/**
 * P35-REV2 — free-to-premium migration audit gate.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

let failures = 0;
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

function runMigrationAudit() {
  return execSync("npx tsx scripts/audit-free-to-premium-migration-runner.ts", {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

const requiredFiles = [
  "src/lib/freemium/free-to-premium-migration-list.ts",
  "src/lib/freemium/resolve-free-to-premium-migration.ts",
  "scripts/audit-free-to-premium-migration-runner.ts",
  "scripts/audit-free-to-premium-migration.mjs",
];

for (const rel of requiredFiles) {
  if (existsSync(join(ROOT, rel))) {
    pass(`file exists: ${rel}`);
  } else {
    fail(`missing file: ${rel}`);
  }
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.scripts?.["audit:free-to-premium"]) {
  pass("package.json has audit:free-to-premium script");
} else {
  fail("package.json missing audit:free-to-premium script");
}

let report = null;
let indexStats = null;

try {
  const output = runMigrationAudit();
  report = JSON.parse(output.trim().split("\n").at(-1) ?? "{}");
} catch (error) {
  fail(`migration report failed: ${String(error.stderr ?? error.message ?? error)}`);
}

if (report) {
  pass(`FREE_TO_PREMIUM_TITLE_LIST_TR contains ${report.listTotal} items`);
  if (report.reportListTotal === report.listTotal) {
    pass("report listTotal matches canonical list");
  } else {
    fail(`report listTotal mismatch (${report.reportListTotal} vs ${report.listTotal})`);
  }

  pass(`${report.matchedCount} tools matched in existing free catalogs`);
  if (report.notFoundInFreeTools.length === 0) {
    pass("notFoundInFreeTools is empty or reported");
  } else {
    pass(`notFoundInFreeTools reported (${report.notFoundInFreeTools.length}): ${report.notFoundInFreeTools.join(" | ")}`);
  }

  if (report.stillInFreeCatalog.length === 0) {
    pass("matched tools removed from free categorized index");
  } else {
    fail(`matched tools still in free index: ${report.stillInFreeCatalog.join(", ")}`);
  }

  if (report.missingFromPremiumIndex.length === 0) {
    pass("matched tools present in premium categorized index");
  } else {
    fail(`matched tools missing from premium index: ${report.missingFromPremiumIndex.join(", ")}`);
  }

  if (report.migratedPremiumIndexCount === report.matchedCount) {
    pass("existing-free-migrated source count matches matched count");
  } else {
    fail(
      `existing-free-migrated count ${report.migratedPremiumIndexCount} != matched ${report.matchedCount}`,
    );
  }

  if (report.missingCategoryDetail.length === 0) {
    pass("matched tools visible in premium category detail resolver");
  } else {
    fail(`matched tools missing from category detail: ${report.missingCategoryDetail.join(", ")}`);
  }

  if (report.duplicateSlugWarnings.length === 0) {
    pass("no duplicate slug warnings in migration report");
  } else {
    fail(`duplicate slug warnings: ${report.duplicateSlugWarnings.join(", ")}`);
  }

  if (report.duplicateSlugsInIndex.length === 0) {
    pass("no duplicate slugs in categorized index");
  } else {
    fail(`duplicate slugs in categorized index: ${report.duplicateSlugsInIndex.join(", ")}`);
  }

  if (report.unknownCategories.length === 0) {
    pass("no unknown categorySlug values");
  } else {
    fail(`unknown categorySlug values: ${report.unknownCategories.join(", ")}`);
  }
}

const freeToolsPage = read("src/app/[locale]/free-tools/page.tsx");
const cachedCatalog = read("src/lib/catalog/cached-catalog-groups.ts");
const premiumPage = read("src/app/[locale]/tools/premium/[slug]/page.tsx");
const categoryPage = read("src/app/[locale]/premium-tools/[categorySlug]/page.tsx");

if (cachedCatalog.includes("listPublicFreeTrafficTools")) {
  pass("free catalog cache excludes migrated traffic tools");
} else {
  fail("cached free catalog still uses raw FREE_TRAFFIC_TOOLS");
}

if (premiumPage.includes("MigratedFreePremiumToolSurface")) {
  pass("premium tool route handles migrated free calculators");
} else {
  fail("premium tool route missing migrated surface");
}

if (premiumPage.includes("listAllPremiumToolRouteSlugs")) {
  pass("premium tool route static params include migrated slugs");
} else {
  fail("premium tool route missing migrated static params");
}

const forbiddenHref = ['href="#"'];
for (const [label, source] of [
  ["free-tools page", freeToolsPage],
  ["premium slug page", premiumPage],
  ["premium category page", categoryPage],
]) {
  if (forbiddenHref.some((token) => source.includes(token))) {
    fail(`${label} contains href="#"`);
  } else {
    pass(`no href="#" in ${label}`);
  }
}

console.log(`\naudit:free-to-premium — ${passes} passed, ${failures} failed`);
if (report) {
  console.log("\nMigration summary:");
  console.log(`  list total: ${report.listTotal}`);
  console.log(`  matched in free: ${report.matchedCount}`);
  console.log(`  migrated to premium index: ${report.migratedPremiumIndexCount}`);
  console.log(`  not found: ${report.notFoundInFreeTools.length}`);
  if (report.notFoundInFreeTools.length > 0) {
    for (const title of report.notFoundInFreeTools) {
      console.log(`    - ${title}`);
    }
  }
}
process.exit(failures > 0 ? 1 : 0);
