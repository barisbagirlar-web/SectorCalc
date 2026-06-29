/**
 * Deduplicate compareNumericFields + tolerance constants from 9 oracle comparison files.
 * Imports from compare-production-oracle.ts and removes local copies.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ORACLE_DIR = new URL("../src/lib/formula-governance/oracle", import.meta.url).pathname;

const FILES = [
  "compare-batch-free-oracle.ts",
  "compare-batch-free-batch2-oracle.ts",
  "compare-batch-premium-oracle.ts",
  "compare-batch-premium-batch3-oracle.ts",
  "compare-batch-premium-schema-oracle.ts",
  "compare-batch-traffic-catalog-oracle.ts",
  "compare-business-operations-oracle.ts",
  "compare-premium-schema-extended-oracle.ts",
  "compare-roadmap-free-batch-oracle.ts",
];

for (const file of FILES) {
  const path = join(ORACLE_DIR, file);
  let content = readFileSync(path, "utf-8");
  const original = content;

  // 1. Check if there's already an import from compare-production-oracle
  const hasImport = content.includes('from "@/lib/formula-governance/oracle/compare-production-oracle"');

  if (hasImport) {
    // The import is `import type { ... } from "..."`
    // We need to add a regular import for compareNumericFields, CURRENCY_TOLERANCE, PERCENT_TOLERANCE
    // Insert after the type import line
    content = content.replace(
      /(import type \{[\s\S]*?\} from "@\/lib\/formula-governance\/oracle\/compare-production-oracle";)/,
      `$1\nimport { compareNumericFields, CURRENCY_TOLERANCE, PERCENT_TOLERANCE } from "@/lib/formula-governance/oracle/compare-production-oracle";`,
    );
  }

  // 2. Remove local `function compareNumericFields` definition
  // Match from "function compareNumericFields" to the next "function" or "export" or "//" comment
  content = content.replace(
    /function compareNumericFields\([\s\S]*?\n\}[ \t]*\n/g,
    "",
  );

  // Also try matching with comment before it
  content = content.replace(
    /\/\*\*[\s\S]*?\*\/\nfunction compareNumericFields\([\s\S]*?\n\}[ \t]*\n/g,
    "",
  );

  // 3. Remove CURRENCY_TOLERANCE = 0.01 if matches canonical
  content = content.replace(/const CURRENCY_TOLERANCE = 0\.01;?\n/g, "");

  // 4. Remove PERCENT_TOLERANCE = 0.01 if matches canonical
  content = content.replace(/const PERCENT_TOLERANCE = 0\.01;?\n/g, "");

  // Check for double empty lines and clean up
  content = content.replace(/\n{3,}/g, "\n\n");

  if (content !== original) {
    writeFileSync(path, content);
    console.log(`✓ ${file} — updated`);
  } else {
    console.log(`  ${file} — no changes`);
  }
}

console.log("\n✓ All files processed");
