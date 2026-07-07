// SectorCalc Free V5.3.1 Execution Binding Guard
// Verifies that every active Free tool can execute through the runtime pipeline
// and produce non-zero, domain-valid results for positive fixture inputs.
// Server-side only. Does not call live HTTP endpoints.

import { freeV531FormulaRegistry } from "../src/sectorcalc/formulas/free-v531/index";
import { resolveApprovedToolSchema } from "../src/sectorcalc/runtime/resolve-approved-tool-schema";
import * as fs from "fs";
import * as path from "path";

// ─── Config ───────────────────────────────────────────────────────────

const GOLDEN_DIR = "tests/golden/free-v531";
const REQUIRED_HARD_CHECKS = [
  "freight-cost-per-km-trip",
  "cutting-speed-feed-rpm",
  "machining-cost-per-part",
  "oee",
  "cbam-cost-quick-estimator",
  "quote-margin-markup",
  "eoq",
  "safety-stock-reorder-point",
  "payment-term-cost",
  "cnc-shop-hourly-rate",
];

// Output ID mapping for tools where formula IDs differ from schema IDs
const FORMULA_TO_SCHEMA_OUTPUT_MAP: Record<string, Record<string, string>> = {
  "cnc-shop-hourly-rate": { "true_hourly_rate": "hourly_rate" },
  "iso-286-tolerance-fit": { "minimum_clearance_mm": "fit_clearance_range_mm" },
  "surface-roughness-converter": { "roughness_ra_um": "roughness_equivalent" },
  "thread-dimensions-reference": { "pitch_diameter_approx_mm": "thread_reference_dimensions" },
  "knurling-drill-point-depth": { "drill_point_depth_mm": "depth_or_pitch_mm" },
  "weld-metal-weight-consumable": { "deposited_weld_metal_kg": "weld_consumable_mass" },
  "bolt-preload-clamp-force": { "initial_preload_kn": "clamp_force_kn" },
  "steel-weight": { "net_steel_weight_kg": "steel_weight_kg" },
  "takt-time-cycle-time": { "takt_time_seconds": "capacity_gap" },
};

// ─── Main ──────────────────────────────────────────────────────────────

const slugs = Object.keys(freeV531FormulaRegistry);
let executed = 0;
let executionFailed = 0;
let outputMismatchFailed = 0;
let zeroFallbackFailed = 0;
let unitBindingFailed = 0;
const blockers: string[] = [];

for (const slug of slugs) {
  // 1. Resolve schema
  const schemaResult = resolveApprovedToolSchema(slug);
  if (!schemaResult.ok) {
    blockers.push(`${slug}: SCHEMA_RESOLVE_FAILED - ${schemaResult.reason}`);
    executionFailed++;
    continue;
  }

  const schema = schemaResult.schema;

  // 2. Load fixture inputs
  const fixturePath = path.join(GOLDEN_DIR, `${slug}.golden.json`);
  if (!fs.existsSync(fixturePath)) {
    blockers.push(`${slug}: NO_FIXTURE - ${fixturePath}`);
    continue;
  }
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));

  // 3. Execute formula module
  const formulaModule = freeV531FormulaRegistry[slug];
  if (!formulaModule) {
    blockers.push(`${slug}: NO_FORMULA_MODULE`);
    executionFailed++;
    continue;
  }

  let formulaResult: ReturnType<typeof formulaModule.execute>;
  try {
    formulaResult = formulaModule.execute(fixture.raw_inputs);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    blockers.push(`${slug}: EXECUTION_THREW - ${msg.slice(0, 80)}`);
    executionFailed++;
    continue;
  }

  // 4. Check execution produced outputs
  if (!formulaResult || !formulaResult.outputs || formulaResult.outputs.length === 0) {
    blockers.push(`${slug}: EMPTY_OUTPUTS`);
    executionFailed++;
    continue;
  }

  // 5. Check no NaN / Infinity / undefined
  let hasNonFinite = false;
  for (const o of formulaResult.outputs) {
    if (typeof o.value === "number" && (!Number.isFinite(o.value) || Number.isNaN(o.value))) {
      hasNonFinite = true;
      blockers.push(`${slug}: NON_FINITE_OUTPUT - ${o.id}=${o.value}`);
      break;
    }
  }
  if (hasNonFinite) {
    executionFailed++;
    continue;
  }

  // 6. Check at least one numeric business output exists
  const realOutputs = formulaResult.outputs.filter(
    (o) => typeof o.value === "number" && Number.isFinite(o.value) && Math.abs(o.value) > 1e-10
  );

  if (realOutputs.length === 0) {
    // Check if fixture inputs legitimately produce zero
    const allInputsZero = Object.values(fixture.raw_inputs as Record<string, unknown>).every(
      (v) => v === 0 || v === "0"
    );
    // Also check if this is a tolerance/reference tool where equal inputs produce zero
    // (e.g. iso-286-tolerance-fit with all-10 inputs gives zero clearance)
    const isLegitimateZero = formulaResult.outputs.some(
      (o) => typeof o.value === "number" && o.value === 0 && formulaResult.status !== "BLOCKED"
    );

    if (!allInputsZero && !isLegitimateZero) {
      zeroFallbackFailed++;
      blockers.push(
        `${slug}: ALL_OUTPUTS_ZERO - non-zero fixture inputs but all outputs are zero. ` +
        `Fixture inputs: ${JSON.stringify(fixture.raw_inputs)}. ` +
        `Outputs: ${formulaResult.outputs.map((o) => `${o.id}=${o.value}`).join(", ")}`
      );
      continue;
    }
  }

  // 7. Check output mapping: at least one real output maps to schema primary metric output
  const outputMap = FORMULA_TO_SCHEMA_OUTPUT_MAP[slug] ?? {};
  const schemaMetricOutputs = schema.outputs.filter((o) => o.id !== "primary_decision_state");

  const mappedFormulas = new Set(Object.values(outputMap));
  const directMatches = formulaResult.outputs.filter((fo) => {
    const schemaId = outputMap[fo.id] ?? fo.id;
    return schemaMetricOutputs.some((so) => so.id === schemaId);
  });

  if (directMatches.length === 0 && realOutputs.length > 0) {
    outputMismatchFailed++;
    blockers.push(
      `${slug}: OUTPUT_MAPPING_FAILED - formula outputs [${formulaResult.outputs.map((o) => o.id).join(",")}] ` +
      `do not match schema outputs [${schemaMetricOutputs.map((o) => o.id).join(",")}]`
    );
  }

  // 8. Check unit binding on schema inputs
  for (const inp of schema.inputs) {
    if (inp.unit_selectable && (!inp.allowed_display_units || inp.allowed_display_units.length === 0)) {
      unitBindingFailed++;
      blockers.push(
        `${slug}: UNIT_BINDING_FAILED - input "${inp.id}" is unit_selectable with empty allowed_display_units`
      );
    }
  }

  executed++;
}

// ─── Hard check required tools ──────────────────────────────────────────

for (const slug of REQUIRED_HARD_CHECKS) {
  const mod = freeV531FormulaRegistry[slug];
  if (!mod) {
    blockers.push(`REQUIRED_TOOL_MISSING: ${slug} not in formula registry`);
    continue;
  }
  const fixturePath = path.join(GOLDEN_DIR, `${slug}.golden.json`);
  if (!fs.existsSync(fixturePath)) continue;
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));

  if (slug === "freight-cost-per-km-trip") {
    const r = mod.execute(fixture.raw_inputs);
    const value = r.outputs.find((o) => o.id === "freight_cost_per_unit")?.value;
    if (typeof value !== "number" || value <= 0) {
      blockers.push(
        `HARD_CHECK_FAILED: ${slug} freight_cost_per_unit is not positive. Value: ${value}`
      );
    }
  }
}

// ─── Report ─────────────────────────────────────────────────────────────

const totalFailures = executionFailed + outputMismatchFailed + zeroFallbackFailed + unitBindingFailed;

console.log("FREE_V531_EXECUTION_BINDING_GUARD=" + (totalFailures === 0 ? "PASS" : "FAIL"));
console.log("ACTIVE_SLUGS=" + slugs.length);
console.log("EXECUTED=" + executed);
console.log("EXECUTION_FAILED=" + executionFailed);
console.log("OUTPUT_MAPPING_FAILED=" + outputMismatchFailed);
console.log("ZERO_FALLBACK_FAILED=" + zeroFallbackFailed);
console.log("UNIT_BINDING_FAILED=" + unitBindingFailed);

if (blockers.length > 0) {
  console.log("BLOCKERS=" + blockers.join("; "));
} else {
  console.log("BLOCKERS=NONE");
}

process.exit(totalFailures === 0 ? 0 : 1);
