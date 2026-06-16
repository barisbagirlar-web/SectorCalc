#!/usr/bin/env node
/**
 * Audit: every schema formula must compile to JavaScript (no 0 fallback).
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { compileFormulaExpression } from "../src/lib/generated-tools/compile-formula-expression.ts";
import { normalizeRawGeneratedSchema } from "../src/lib/generated-tools/normalize-schema.ts";
import { toSafeVarName } from "../src/lib/generated-tools/export-names.ts";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");

function main() {
  const offenders = [];
  const files = readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));

  for (const file of files) {
    const slug = file.replace(/-schema\.json$/, "");
    const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, file), "utf8"));
    const schema = normalizeRawGeneratedSchema(raw, slug);
    if (!schema) {
      offenders.push({ slug, key: "(schema-normalize-failed)" });
      continue;
    }

    const formulaKeys = Object.keys(schema.formulas);
    const inputIds = schema.inputs.map((input) => input.id);
    for (const [key, expression] of Object.entries(schema.formulas)) {
      const compiled = compileFormulaExpression(expression, {
        inputIds,
        inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
        formulaKeys,
        selfKey: key,
      });
      if (!compiled || compiled.includes("Math.Math")) {
        offenders.push({ slug, key });
      }
    }
  }

  if (offenders.length > 0) {
    console.error(`audit:formula-compile FAIL — ${offenders.length} formula(s)`);
    for (const item of offenders.slice(0, 40)) {
      console.error(`  ${item.slug} :: ${item.key}`);
    }
    process.exit(1);
  }

  console.log(`audit:formula-compile PASS (${files.length} schemas)`);
}

main();
