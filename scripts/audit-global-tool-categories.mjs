#!/usr/bin/env node
/**
 * P35 CI gate — global tool category taxonomy + 152 seed integrity.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
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

function validateSeedJson(seed) {
  const errors = [];
  if (seed.totalTools !== 152) errors.push(`totalTools must be 152`);
  if (seed.categories.length !== 20) errors.push(`categories.length must be 20`);
  if (seed.tools.length !== 152) errors.push(`tools.length must be 152`);

  const toolIds = seed.tools.map((tool) => tool.id).sort((a, b) => a - b);
  const expectedIds = Array.from({ length: 152 }, (_, index) => index + 1);
  if (JSON.stringify(toolIds) !== JSON.stringify(expectedIds)) {
    errors.push("tool ids incomplete 1–152");
  }

  const categorySlugSet = new Set(seed.categories.map((category) => category.slug));
  let categoryIdSum = 0;
  for (const category of seed.categories) {
    if (category.count !== category.ids.length) {
      errors.push(`category ${category.slug} count mismatch`);
    }
    categoryIdSum += category.ids.length;
    for (const id of category.ids) {
      const tool = seed.tools.find((entry) => entry.id === id);
      if (!tool) errors.push(`category ${category.slug} missing tool id ${id}`);
      else if (tool.categorySlug !== category.slug) {
        errors.push(`tool id ${id} categorySlug mismatch`);
      }
    }
  }
  if (categoryIdSum !== 152) errors.push(`category ids sum must be 152`);

  const slugSet = new Set();
  const idSet = new Set();
  for (const tool of seed.tools) {
    if (!categorySlugSet.has(tool.categorySlug)) errors.push(`unknown categorySlug ${tool.categorySlug}`);
    if (slugSet.has(tool.slug)) errors.push(`duplicate slug ${tool.slug}`);
    if (idSet.has(tool.id)) errors.push(`duplicate id ${tool.id}`);
    slugSet.add(tool.slug);
    idSet.add(tool.id);
  }

  return errors;
}

const requiredFiles = [
  "src/lib/premium/premium-152-seed-reader.ts",
  "src/lib/catalog/global-tool-category-taxonomy.ts",
  "src/lib/catalog/resolve-tool-category.ts",
  "src/lib/catalog/build-categorized-tool-index.ts",
  "src/lib/premium/premium-tool-registry.ts",
  "src/lib/premium/premium-category-resolver.ts",
];

for (const rel of requiredFiles) {
  try {
    read(rel);
    pass(`file exists: ${rel}`);
  } catch {
    fail(`missing file: ${rel}`);
  }
}

const seed = JSON.parse(read("src/data/premium/sectorcalc-premium-152.seed.json"));
const seedErrors = validateSeedJson(seed);
if (seedErrors.length === 0) {
  pass("seed JSON validation complete");
  pass("seed totalTools === 152");
  pass("seed tools.length === 152");
  pass("seed categories.length === 20");
  pass("seed tool ids complete 1–152");
  pass("category ids sum === 152");
  pass("no duplicate seed slugs/ids");
} else {
  for (const error of seedErrors) fail(error);
}

try {
  const output = execSync(
    `npx tsx -e "import { buildCategorizedToolIndex, getUncategorizedToolCount } from './src/lib/catalog/build-categorized-tool-index.ts'; const index = buildCategorizedToolIndex(); const seedCount = index.filter(i => i.source === 'user-premium-152').length; console.log(JSON.stringify({ total: index.length, uncategorized: getUncategorizedToolCount(), seedCount }));"`,
    { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const stats = JSON.parse(output.trim().split("\n").at(-1) ?? "{}");
  pass(`buildCategorizedToolIndex() -> ${stats.total} tools`);
  if (stats.uncategorized === 0) pass("uncategorized count === 0");
  else fail(`uncategorized count ${stats.uncategorized}`);
  if (stats.seedCount === 152) pass("152 seed tools present in categorized index");
  else fail(`seed tools in index expected 152, got ${stats.seedCount}`);
} catch (error) {
  fail(`buildCategorizedToolIndex failed: ${String(error.stderr ?? error.message ?? error)}`);
}

console.log(`\naudit:global-categories — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
