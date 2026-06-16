#!/usr/bin/env node
/**
 * Audit: every generated schema slug must end with `-calculator`.
 */
import fs from "node:fs";
import path from "node:path";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");

function isCalculatorSlug(slug) {
  return slug.endsWith("-calculator");
}

function main() {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error("audit:calculator-slugs FAIL — generated/schemas missing");
    process.exit(1);
  }

  const offenders = fs
    .readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => name.replace(/-schema\.json$/, ""))
    .filter((slug) => !isCalculatorSlug(slug))
    .sort();

  if (offenders.length > 0) {
    console.error(
      `audit:calculator-slugs FAIL — ${offenders.length} slug(s) missing -calculator suffix`,
    );
    console.error(offenders.slice(0, 40).join("\n"));
    process.exit(1);
  }

  console.log("audit:calculator-slugs PASS");
}

main();
