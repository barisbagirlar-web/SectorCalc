#!/usr/bin/env node
/**
 * Audit: every schema formula must compile to JavaScript and produce
 * a non-zero, non-null result when evaluated with valid test inputs.
 *
 * Industrial-grade: catches formulas that compile but always return 0,
 * null, undefined, or NaN — the "sıfır sonuç" (zero result) problem.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { compileFormulaExpression } from "../src/lib/generated-tools/compile-formula-expression.ts";
import { normalizeRawGeneratedSchema } from "../src/lib/generated-tools/normalize-schema.ts";
import { toSafeVarName } from "../src/lib/generated-tools/export-names.ts";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");

/**
 * Safely evaluate a compiled formula expression with the given input values.
 * The compiled expression has been sanitized by compileFormulaExpression and
 * validated by isSafeCompiledFormulaExpression — it contains only Math.* calls
 * and input/formula references.
 */
function evaluateFormula(compiled, inputValues, formulaResults) {
  const input = { ...inputValues };
  const results = { ...formulaResults };
  const toNumericFormulaValue = (v) =>
    typeof v === "number" && Number.isFinite(v) ? v : 0;
  const Math_local = Math;
  // eslint-disable-next-line no-new-func
  const fn = new Function("input", "results", "toNumericFormulaValue", "Math", `return (${compiled});`);
  const result = fn(input, results, toNumericFormulaValue, Math_local);
  return typeof result === "number" ? result : Number.NaN;
}

function main() {
  const offenders = [];
  const runtimeZeroFailures = [];
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

    // Build test input values: use default or positive value
    const testInput = {};
    for (const input of schema.inputs) {
      if (input.default !== undefined && typeof input.default === "number" && input.default > 0) {
        testInput[input.id] = input.default;
      } else if (input.type === "number" || input.type === "percent" || input.type === "currency") {
        testInput[input.id] = 100; // positive default test value
      } else {
        testInput[input.id] = 1;
      }
    }

    // Compile and evaluate each formula in order (formulas can reference
    // previously compiled formulas via results[...])
    const compiledMap = {};
    const computedResults = {};

    for (const [key, expression] of Object.entries(schema.formulas)) {
      const compiled = compileFormulaExpression(expression, {
        inputIds,
        inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
        formulaKeys,
        selfKey: key,
      });

      compiledMap[key] = compiled;

      if (!compiled || compiled.includes("Math.Math")) {
        offenders.push({ slug, key, reason: "compile-failed" });
        continue;
      }

      // Runtime evaluation: execute with test inputs
      try {
        const result = evaluateFormula(compiled, testInput, computedResults);
        if (!Number.isFinite(result)) {
          runtimeZeroFailures.push({ slug, key, reason: `returned ${String(result)}` });
        } else if (result === 0) {
          // Only flag as zero-failure if the formula has inputs and result is
          // identically zero (not a legitimate zero like "total cost = 0 with zero inputs")
          const hasNumericInput = inputIds.length > 0;
          if (hasNumericInput) {
            runtimeZeroFailures.push({ slug, key, reason: "returned 0 for valid positive input" });
          }
        }
        computedResults[key] = result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        runtimeZeroFailures.push({ slug, key, reason: `runtime-error: ${msg.slice(0, 100)}` });
      }
    }
  }

  const totalFailures = offenders.length + runtimeZeroFailures.length;

  if (offenders.length > 0) {
    console.error(`audit:formula-compile FAIL — ${offenders.length} formula(s) failed to compile`);
    for (const item of offenders.slice(0, 20)) {
      console.error(`  ${item.slug} :: ${item.key} [${item.reason}]`);
    }
  }

  if (runtimeZeroFailures.length > 0) {
    console.error(`audit:formula-compile RUNTIME FAIL — ${runtimeZeroFailures.length} formula(s) returned 0/null/NaN`);
    for (const item of runtimeZeroFailures.slice(0, 20)) {
      console.error(`  ${item.slug} :: ${item.key} — ${item.reason}`);
    }
  }

  if (totalFailures > 0) {
    console.error(`\naudit:formula-compile TOTAL FAILURES: ${totalFailures}`);
    process.exit(1);
  }

  console.log(`audit:formula-compile PASS (${files.length} schemas, ${Object.keys(compiledMap).length} formulas evaluated at runtime)`);
}

main();
