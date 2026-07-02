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
import { CNC_MACHINING_COST_SCHEMA } from "../src/lib/features/premium-schema/schemas/cnc-machining-cost-analyzer";
import { DOWNTIME_COST_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/downtime-cost-analyzer";
import { BOLT_TORQUE_SCHEMA } from "../src/lib/features/premium-schema/schemas/bolt-torque-preload-analyzer";
import { CNC_CYCLE_TIME_SCHEMA } from "../src/lib/features/premium-schema/schemas/cnc-cycle-time-analyzer";
import { ROOF_AREA_SCHEMA } from "../src/lib/features/premium-schema/schemas/roof-area-load-analyzer";
import { MACHINE_ECONOMIC_LIFE_SCHEMA } from "../src/lib/features/premium-schema/schemas/machine-economic-life-analyzer";
import { ROBOT_VS_MANUAL_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/robot-vs-manual-analyzer";
import { KWH_COST_SCHEMA } from "../src/lib/features/premium-schema/schemas/kwh-cost-analyzer";
import { PROJECT_COST_ESTIMATE_ANALYZER_SCHEMA } from "../src/lib/features/premium-schema/schemas/project-cost-estimate-analyzer";
import { RESTAURANT_MENU_MARGIN_LEAK_SCHEMA } from "../src/lib/features/premium-schema/schemas/restaurant-menu-margin-leak-analyzer";
import { SCAFFOLD_RENTAL_SCHEMA } from "../src/lib/features/premium-schema/schemas/scaffold-rental-cost-analyzer";
import { MTBF_MTTR_FINANCIAL_SCHEMA } from "../src/lib/features/premium-schema/schemas/mtbf-mttr-financial-analyzer";
import { SHOP_HOURLY_RATE_SCHEMA } from "../src/lib/features/premium-schema/schemas/shop-hourly-rate-analyzer";
import { MATERIAL_REPLACEMENT_COST_SCHEMA } from "../src/lib/features/premium-schema/schemas/material-replacement-cost-analyzer";
import { HEAT_EXCHANGER_FOULING_SCHEMA } from "../src/lib/features/premium-schema/schemas/heat-exchanger-fouling-analyzer";
import { STEAM_TRAP_ENERGY_LOSS_ANALYZER as STEAM_TRAP_ENERGY_LOSS_SCHEMA } from "../src/lib/features/premium-schema/schemas/steam-trap-energy-loss-analyzer";

const PRO_SCHEMAS: Record<string, any> = {
  "oee-equipment-effectiveness-calculator": OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA,
  "cnc-machining-cost-analyzer": CNC_MACHINING_COST_SCHEMA,
  "downtime-cost-analyzer": DOWNTIME_COST_ANALYZER_SCHEMA,
  "bolt-torque-preload-analyzer": BOLT_TORQUE_SCHEMA,
  "cnc-cycle-time-analyzer": CNC_CYCLE_TIME_SCHEMA,
  "roof-area-load-analyzer": ROOF_AREA_SCHEMA,
  "machine-economic-life-analyzer": MACHINE_ECONOMIC_LIFE_SCHEMA,
  "robot-vs-manual-analyzer": ROBOT_VS_MANUAL_ANALYZER_SCHEMA,
  "kwh-cost-analyzer": KWH_COST_SCHEMA,
  "project-cost-estimate-analyzer": PROJECT_COST_ESTIMATE_ANALYZER_SCHEMA,
  "restaurant-menu-margin-leak-analyzer": RESTAURANT_MENU_MARGIN_LEAK_SCHEMA,
  "scaffold-rental-cost-analyzer": SCAFFOLD_RENTAL_SCHEMA,
  "mtbf-mttr-financial-analyzer": MTBF_MTTR_FINANCIAL_SCHEMA,
  "shop-hourly-rate-analyzer": SHOP_HOURLY_RATE_SCHEMA,
  "material-replacement-cost-analyzer": MATERIAL_REPLACEMENT_COST_SCHEMA,
  "heat-exchanger-fouling-analyzer": HEAT_EXCHANGER_FOULING_SCHEMA,
  "steam-trap-energy-loss-analyzer": STEAM_TRAP_ENERGY_LOSS_SCHEMA
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
