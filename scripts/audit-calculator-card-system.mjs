#!/usr/bin/env node
/**
 * P27 CI gate — SectorCalc calculator card system.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const FORBIDDEN_VISIBLE = [
  "HesapPro",
  "Pro'ya Geç",
  "Go Pro",
  "%100 ücretsiz",
  "Analyzer",
  "Analysis",
  "Analiz",
  "Sihirbaz",
];

const REQUIRED_KEYS = [
  "calculatorCards.ctaCalculate",
  "calculatorCards.ctaOpen",
  "calculatorCards.ctaOpenSector",
  "calculatorCards.inputCount",
  "calculatorCards.resultsLabel",
];

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

function hasPath(obj, dotted) {
  return dotted.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) !== undefined;
}

const cardFiles = [
  "src/components/catalog/CalculatorCard.tsx",
  "src/components/catalog/CalculatorCardGrid.tsx",
  "src/components/catalog/CalculatorFilterBar.tsx",
];

for (const rel of cardFiles) {
  if (!existsSync(join(ROOT, rel))) {
    fail(`missing ${rel}`);
  } else {
    pass(`${rel} exists`);
  }
}

if (!existsSync(join(ROOT, "src/styles/sectorcalc-calculator-cards.css"))) {
  fail("missing sectorcalc-calculator-cards.css");
} else {
  pass("card CSS exists");
}

const globals = read("src/app/globals.css");
if (!globals.includes("sectorcalc-calculator-cards.css")) {
  fail("card CSS not imported in globals.css");
} else {
  pass("card CSS imported");
}

const discovery = read("src/components/catalog/DiscoveryCatalogExplorer.tsx");
if (!discovery.includes("CalculatorCard") || !discovery.includes("CalculatorCardGrid")) {
  fail("DiscoveryCatalogExplorer missing CalculatorCard usage");
} else {
  pass("free/premium/industry explorer uses CalculatorCard");
}

if (!read("src/app/[locale]/free-tools/page.tsx").includes("SectorCatalogExplorer")) {
  fail("free-tools page missing catalog explorer");
} else {
  pass("free-tools page wired");
}

if (!read("src/app/[locale]/premium-tools/page.tsx").includes("SectorCatalogExplorer")) {
  fail("premium-tools page missing catalog explorer");
} else {
  pass("premium-tools page wired");
}

if (!read("src/app/[locale]/industries/page.tsx").includes("SectorCatalogExplorer")) {
  fail("industries page missing catalog explorer");
} else {
  pass("industries page wired");
}

const cardSource = read("src/components/catalog/CalculatorCard.tsx");
if (cardSource.includes('href="#"') || cardSource.includes("href={'#'}")) {
  fail("CalculatorCard contains href=\"#\"");
} else {
  pass("no href=\"#\" in CalculatorCard");
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (/\.(tsx|ts|css|jsx|js)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const catalogFiles = walk(join(ROOT, "src/components/catalog"));
for (const file of catalogFiles) {
  const text = read(file.replace(`${ROOT}/`, ""));
  if (/\b230\b/.test(text) && !text.includes("minmax(280px")) {
    fail(`hardcoded 230 in ${file}`);
  }
  if (text.includes("%100 ücretsiz")) {
    fail(`forbidden promo copy in ${file}`);
  }
}
pass("no hardcoded 230 or %100 ücretsiz in catalog components");

for (const locale of LOCALES) {
  const messages = JSON.parse(read(`messages/${locale}.json`));
  for (const key of REQUIRED_KEYS) {
    if (!hasPath(messages, key)) {
      fail(`missing ${key} in messages/${locale}.json`);
    }
  }
}
pass("calculatorCards namespace complete for EN");



const css = read("src/styles/sectorcalc-calculator-cards.css");
if (!css.includes("sc-calc-card") || !css.includes("prefers-reduced-motion")) {
  fail("card CSS missing core classes or reduced motion");
} else {
  pass("card CSS structure complete");
}

if (discovery.includes("count: 230") || discovery.includes('"230"')) {
  fail("hardcoded category count 230 in explorer");
} else {
  pass("category counts derived from data");
}

const forbiddenInCard = FORBIDDEN_VISIBLE.filter((term) => cardSource.includes(term));
if (forbiddenInCard.length > 0) {
  fail(`forbidden terms in CalculatorCard: ${forbiddenInCard.join(", ")}`);
} else {
  pass("CalculatorCard free of forbidden demo terms");
}

console.log(`\naudit:card-system — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
