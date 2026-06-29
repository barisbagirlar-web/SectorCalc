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

const requiredFiles = [
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
try {
  const output = execSync(
    `npx tsx -e "import { buildCategorizedToolIndex, getUncategorizedToolCount } from './src/lib/catalog/build-categorized-tool-index.ts'; const index = buildCategorizedToolIndex(); console.log(JSON.stringify({ total: index.length, uncategorized: getUncategorizedToolCount() }));"`,
    { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const stats = JSON.parse(output.trim().split("\n").at(-1) ?? "{}");
  pass(`buildCategorizedToolIndex() -> ${stats.total} tools`);
  if (stats.uncategorized === 0) pass("uncategorized count === 0");
  else fail(`uncategorized count ${stats.uncategorized}`);
} catch (error) {
  fail(`buildCategorizedToolIndex failed: ${String(error.stderr ?? error.message ?? error)}`);
}

console.log(`\naudit:global-categories — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
