#!/usr/bin/env tsx
/**
 * SectorCalc — Golden Test Runner
 * Catches math errors that the name-matching gate CANNOT catch
 * (e.g. accidentally using 'netKar - faiz' instead of 'netKar + faiz').
 *
 * CRITICAL PRINCIPLE #1: This runner DOES NOT RECALCULATE the formula. It calls the REAL engine.
 *   Writing a parallel evaluator = "gate diverges from runtime" error. runTool() connects to
 *   the real calculation functions.
 *
 * CRITICAL PRINCIPLE #2: 'expect' values are NOT DERIVED from the formula; they are calculated manually/from spec.
 *   Otherwise, it falls into the tautology of "accepting the wrong formula as correct".
 */
import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";

// Import the REAL engine evaluateExpr function
import { evaluateExpr } from "../src/lib/features/tool-schemas/runtime";

import { runPremiumSchemaEngine } from "../src/lib/features/premium-schema/premium-schema-engine";
import { OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA } from "../src/lib/features/premium-schema/schemas/oee-equipment-effectiveness-calculator";
// ... other pro schema imports could go here ...
const PRO_SCHEMAS = {
  "oee-equipment-effectiveness-calculator": OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA
};

// ============================================================
// ADAPTER — Connect to your real engine (SINGLE wire point)
// ============================================================
async function runTool(toolId: string, inputs: Record<string, number>): Promise<Record<string, number>> {
  // PRO Tool fallback
  if (PRO_SCHEMAS[toolId]) {
    const res = runPremiumSchemaEngine(PRO_SCHEMAS[toolId], inputs, "en");
    const outMap = {};
    for (const o of res.outputs) outMap[o.id] = o.raw;
    return outMap;
  }

  // Load the schema to execute its formulas
  const schemaPath = globSync(path.join(process.cwd(), `generated/schemas/**/${toolId}-schema.json`))[0] ||
                     globSync(path.join(process.cwd(), `generated/schemas/**/${toolId}.json`))[0];
  if (!schemaPath) throw new Error(`Schema not found for tool: ${toolId}`);
  
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const outputs: Record<string, number> = { ...inputs };
  
  // Evaluate formulas in order using the exact same engine the app uses at runtime
  if (schema.formulas) {
    for (const [outKey, expr] of Object.entries(schema.formulas)) {
      try {
        outputs[outKey] = evaluateExpr(expr as string, outputs);
      } catch (e) {
        throw new Error(`Formula evaluation failed for ${outKey}: ${e}`);
      }
    }
  }
  return outputs;
}
// ============================================================

function withinTolerance(actual: number, expected: number, absTol = 1e-6, relTol = 1e-6) {
  if (typeof actual !== "number" || Number.isNaN(actual)) return false;
  return Math.abs(actual - expected) <= Math.max(absTol, relTol * Math.abs(expected));
}

async function main() {
  const GOLDEN_DIR = path.join(process.cwd(), "tests/golden");
  const fixtures = globSync(`${GOLDEN_DIR}/**/*.golden.json`);

  let pass = 0, fail = 0;
  const failures: string[] = [];
  const coveredTools = new Set();

  for (const file of fixtures) {
    const fx = JSON.parse(fs.readFileSync(file, "utf8"));
    coveredTools.add(fx.toolId);

    for (const c of fx.cases) {
      let out;
      try {
        out = await runTool(fx.toolId, c.inputs);
      } catch (e: any) {
        fail++;
        failures.push(`✗ ${fx.toolId} :: ${c.name} — ENGINE ERROR: ${e.message}`);
        continue;
      }
      const tol = c.tolerance ?? {};
      for (const [key, exp] of Object.entries(c.expect)) {
        const got = out?.[key];
        if (withinTolerance(got, exp as number, tol.abs, tol.rel)) {
          pass++;
        } else {
          fail++;
          failures.push(`✗ ${fx.toolId} :: ${c.name} — '${key}' expected ${exp}, got ${got}`);
        }
      }
    }
  }

  console.log(`\n=== SectorCalc Golden Test ===`);
  console.log(`Fixtures: ${fixtures.length} files | Covered tools: ${coveredTools.size}`);
  console.log(`PASS: ${pass} | FAIL: ${fail}\n`);

  if (failures.length) {
    for (const f of failures) console.log(f);
    console.error(`\n❌ ${fail} golden cases failed. Build stopped.`);
    process.exit(1);
  }
  console.log("✅ All golden cases passed.");
}

main().catch(console.error);
