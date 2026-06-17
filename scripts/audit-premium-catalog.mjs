#!/usr/bin/env node
/**
 * P35 CI gate — premium catalog pages use category grid, not flat 152 dump.
 */
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

const premiumPage = read("src/app/[locale]/premium-tools/page.tsx");
const categoryPagePath = "src/app/[locale]/premium-tools/[categorySlug]/page.tsx";
const categoryPage = read(categoryPagePath);

const forbiddenPublic = [
  "Planlandı",
  "Yayında",
  "Faz 1",
  "Faz 2",
  "Puan",
  "Stratejik yol haritası",
  "href=\"#\"",
  "Biyoloji",
  "Kimya",
  "Spor",
  "Günlük yaşam",
  "Omni Calculator",
];

if (
  premiumPage.includes("IndustriesTaxonomyGrid") &&
  premiumPage.includes("buildTaxonomySectorCards") &&
  premiumPage.includes("getPremiumTools")
) {
  pass("/premium-tools uses taxonomy sector grid + getPremiumTools");
} else if (premiumPage.includes("PremiumCatalogSearch") && premiumPage.includes("listPremiumCatalogCategories")) {
  pass("/premium-tools uses PremiumCatalogSearch + global category resolver");
} else {
  fail("/premium-tools missing taxonomy sector grid wiring");
}

if (
  premiumPage.includes("SchemaToolsCatalogExplorer") &&
  premiumPage.includes('filterBy="sector"') &&
  premiumPage.includes("hideBrowseSection")
) {
  pass("/premium-tools uses sector-filtered SchemaToolsCatalogExplorer without legacy browse cards");
} else if (!premiumPage.includes("SectorCatalogExplorer") && !premiumPage.includes("SchemaToolsCatalogExplorer")) {
  pass("/premium-tools no longer dumps SchemaToolsCatalogExplorer flat listing");
} else {
  fail("/premium-tools missing sector-filtered catalog explorer wiring");
}

if (!premiumPage.includes("getPremiumSchemaCatalogItems")) {
  pass("/premium-tools does not render all schema items directly");
} else {
  fail("/premium-tools still imports flat schema catalog items");
}

if (existsSync(join(ROOT, categoryPagePath))) {
  pass("/premium-tools/[categorySlug] route exists");
} else {
  fail("/premium-tools/[categorySlug] route missing");
}

if (categoryPage.includes("PremiumToolGrid") && categoryPage.includes("ToolsTileGrid")) {
  pass("category detail has premium + related free sections");
} else {
  fail("category detail missing premium/free section components");
}

if (categoryPage.includes("premiumSection") && categoryPage.includes("relatedFreeSection")) {
  pass("category detail uses premiumCategoryCatalog section labels");
} else {
  fail("category detail missing i18n section labels");
}

if (categoryPage.includes('href="#"')) {
  fail('category page contains href="#"');
} else {
  pass('no href="#" in category page source');
}

for (const term of forbiddenPublic) {
  if (premiumPage.includes(term) || categoryPage.includes(term)) {
    fail(`forbidden public term in catalog pages: ${term}`);
  } else {
    pass(`forbidden term absent: ${term}`);
  }
}

if (
  premiumPage.includes("IndustriesTaxonomyGrid") ||
  premiumPage.includes("listPremiumCatalogCategories")
) {
  pass("premium hub reads taxonomy or category resolver");
} else {
  fail("premium hub missing taxonomy/category resolver");
}

if (categoryPage.includes("generateStaticParams")) {
  pass("category route pre-renders static params");
} else {
  fail("category route missing generateStaticParams");
}

const css = read("src/styles/premium-category-catalog.css");
if (css.includes(".sc-premium-category-grid") && css.includes("@media")) {
  pass("premium category catalog responsive CSS present");
} else {
  fail("premium category catalog CSS incomplete");
}

console.log(`\naudit:premium-catalog — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
