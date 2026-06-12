#!/usr/bin/env node
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

const css = read("src/styles/premium-category-catalog.css");
const card = read("src/components/catalog/PremiumSectorCard.tsx");
const grid = read("src/components/catalog/PremiumSectorGrid.tsx");
const iconMap = read("src/lib/catalog/category-icon-map.tsx");
const premiumPage = read("src/app/[locale]/premium-tools/page.tsx");

if (css.includes(".sc-premium-category-grid")) {
  pass("premium category grid class present");
} else {
  fail("missing .sc-premium-category-grid");
}

if (/grid-template-columns:\s*repeat\(6,\s*minmax\(0,\s*1fr\)\)/.test(css)) {
  pass("desktop grid uses repeat(6, minmax(0, 1fr))");
} else {
  fail("desktop grid missing repeat(6, minmax(0, 1fr))");
}

if (css.includes("@media (max-width: 1024px)") && css.includes("repeat(3, minmax(0, 1fr))")) {
  pass("tablet breakpoint uses 3 columns");
} else {
  fail("tablet 3-column media query missing");
}

if (css.includes("@media (max-width: 640px)") && css.includes("repeat(2, minmax(0, 1fr))")) {
  pass("mobile breakpoint uses 2 columns");
} else {
  fail("mobile 2-column media query missing");
}

if (!css.includes(".sc-premium-sector-grid")) {
  pass("legacy 3-column sector grid class removed");
} else {
  fail("legacy .sc-premium-sector-grid still present");
}

if (/^[^@]*repeat\(6,\s*minmax\(0,\s*1fr\)\)/m.test(css)) {
  pass("base grid rule is 6 columns before media queries");
} else {
  fail("base grid rule missing 6 columns");
}

const cssWithoutMedia = css.replace(/@media[\s\S]*?\}/g, "");
if (cssWithoutMedia.includes("repeat(3")) {
  fail("desktop base rule still uses repeat(3)");
} else {
  pass("no repeat(3) outside tablet/mobile breakpoints");
}

if (grid.includes("sc-premium-category-grid")) {
  pass("PremiumSectorGrid uses sc-premium-category-grid");
} else {
  fail("PremiumSectorGrid missing sc-premium-category-grid");
}

if (card.includes("sc-premium-category-card") && card.includes("getCategoryIcon")) {
  pass("PremiumSectorCard uses compact category card + slug icon map");
} else {
  fail("PremiumSectorCard compact structure incomplete");
}

if (!card.includes("summary") && !card.includes("__summary")) {
  pass("PremiumSectorCard does not render description/summary");
} else {
  fail("PremiumSectorCard still renders summary/description");
}

if (!card.includes('href="#"') && !premiumPage.includes('href="#"')) {
  pass("no href=\"#\" in premium category card/page");
} else {
  fail('href="#" found in premium category surface');
}

if (!card.includes("text-sky") && !card.includes("#2563eb") && !card.includes("#3b82f6")) {
  pass("no blue icon hardcoding in PremiumSectorCard");
} else {
  fail("blue icon color hardcoded in PremiumSectorCard");
}

if (css.includes("var(--sc-accent, #c44814)")) {
  pass("icon color uses SectorCalc accent token");
} else {
  fail("icon accent token missing in CSS");
}

if (!iconMap.includes("??") && !iconMap.includes("ChartBarIcon")) {
  pass("category icon map has no fallback icon");
} else {
  fail("category icon map uses fallback icon");
}

try {
  const output = execSync("npx tsx scripts/audit-category-card-grid-runner.ts", {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const payload = JSON.parse(output.trim().split("\n").at(-1) ?? "{}");
  for (const check of payload.checks ?? []) {
    if (check.pass) pass(check.name);
    else fail(check.name);
  }
} catch (error) {
  fail(`icon map runner failed: ${String(error.stderr ?? error.message ?? error)}`);
}

const badPatterns = [
  "grid-cols-3",
  "minmax(320px",
  "minmax(280px",
  'href="#"',
];
const premiumTargets = [
  "src/components/catalog/PremiumSectorCard.tsx",
  "src/components/catalog/PremiumSectorGrid.tsx",
  "src/styles/premium-category-catalog.css",
  "src/app/[locale]/premium-tools/page.tsx",
];

let forbiddenFound = false;
for (const rel of premiumTargets) {
  const content = read(rel);
  for (const pattern of badPatterns) {
    if (content.includes(pattern)) {
      fail(`${rel} contains forbidden pattern ${pattern}`);
      forbiddenFound = true;
    }
  }
}
if (!forbiddenFound) {
  pass("premium category surface has no forbidden grid/card patterns");
}

console.log(`\naudit:category-card-grid — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
