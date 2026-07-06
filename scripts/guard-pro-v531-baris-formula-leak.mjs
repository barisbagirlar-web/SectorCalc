#!/usr/bin/env node
/**
 * guard-pro-v531-baris-formula-leak.mjs
 *
 * Check that no public schema file in src/sectorcalc/schemas/pro-v531/
 * contains executable formula expressions, expose_formula, public_formula,
 * or eval_allowed: true.
 *
 * Exit 0 (PASS) if no leaks, exit 1 (FAIL) if any leak found.
 */

import fs from "node:fs";
import path from "node:path";

const SCHEMA_DIR = path.resolve(
  process.cwd(),
  "src/sectorcalc/schemas/pro-v531",
);

// Math operators and function patterns that indicate executable formulas
const MATH_PATTERN =
  /[+\-*/%^]|\b(Math\.|Math\(|sqrt\(|pow\(|sin\(|cos\(|tan\(|log\(|exp\(|abs\(|floor\(|ceil\(|round\(|min\(|max\(|PI\b|E\b)/;

function isExecutableExpression(expr) {
  if (!expr || typeof expr !== "string") return false;
  const trimmed = expr.trim();
  if (trimmed === "") return false;
  if (trimmed === "REDACTED") return false;
  // Check for actual math content
  return MATH_PATTERN.test(trimmed);
}

function isNaturalLanguageDescription(expr) {
  if (!expr || typeof expr !== "string") return false;
  const trimmed = expr.trim();
  if (trimmed === "") return true;
  if (trimmed === "REDACTED") return true;
  // If it doesn't look like executable math, treat as natural language
  return !isExecutableExpression(expr);
}

function main() {
  if (!fs.existsSync(SCHEMA_DIR)) {
    console.error(`Schema directory not found: ${SCHEMA_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith(".schema.json"))
    .sort();

  if (files.length === 0) {
    console.log("No schema files found — nothing to check.");
    process.exit(0);
  }

  console.log("=== PRO V531 BARIS FORMULA LEAK GUARD ===\n");
  console.log(`Scanning ${files.length} schema files in ${SCHEMA_DIR}\n`);

  const findings = [];

  for (const file of files) {
    const filePath = path.join(SCHEMA_DIR, file);
    let schema;
    try {
      const content = fs.readFileSync(filePath, "utf8");
      schema = JSON.parse(content);
    } catch (err) {
      findings.push({ file, issue: `PARSE_ERROR: ${err.message}` });
      continue;
    }

    // Check 1: formulas array → expression field
    if (Array.isArray(schema.formulas)) {
      for (const formula of schema.formulas) {
        const fid = formula.id || "(unnamed)";

        // 1a: Check expression for executable math content
        const expr = formula.expression;
        if (isExecutableExpression(expr)) {
          findings.push({
            file,
            issue: `FORMULA_EXPRESSION_LEAK`,
            detail: `${fid}.expression = "${expr.substring(0, 120)}"`,
          });
        }

        // 1b: Check expose_formula flag
        if (formula.expose_formula === true) {
          findings.push({
            file,
            issue: `EXPOSE_FORMULA_FLAG`,
            detail: `${fid}.expose_formula = true`,
          });
        }

        // 1c: Check public_formula flag
        if (formula.public_formula === true) {
          findings.push({
            file,
            issue: `PUBLIC_FORMULA_FLAG`,
            detail: `${fid}.public_formula = true`,
          });
        }
      }
    }

    // Check 2: reference_code section → eval_allowed field
    if (
      schema.reference_code &&
      typeof schema.reference_code === "object" &&
      schema.reference_code.eval_allowed === true
    ) {
      findings.push({
        file,
        issue: `EVAL_ALLOWED_FLAG`,
        detail: `reference_code.eval_allowed = true`,
      });
    }
  }

  if (findings.length > 0) {
    console.log("FORMULA LEAK FAILURES FOUND:\n");
    for (const f of findings) {
      console.log(`  [${f.file}] ${f.issue}: ${f.detail}`);
    }
    console.log(`\nTotal failures: ${findings.length}`);
    console.log("PRO_V531_FORMULA_LEAK=FAIL");
    process.exit(1);
  }

  console.log("PRO_V531_FORMULA_LEAK=PASS");
  console.log("No formula leaks detected in pro-v531 schemas.");
  process.exit(0);
}

main();
