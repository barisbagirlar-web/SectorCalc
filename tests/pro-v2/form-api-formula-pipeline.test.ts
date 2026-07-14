// SectorCalc PRO V2 — Full Form→API→Formula Pipeline Test
// This test verifies the complete execution pipeline for all 20 LIVE tools:
// form state (schema input IDs) → execute request → normalizeInputs → formula module → outputs
// It does NOT call calculate() directly with pre-normalized inputs.
// It exercises the exact same code paths as the API route would.

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { normalizeInputs } from "@/sectorcalc/pro-form/unit-normalizer";
import type { SuperV4Schema, ConversionRegistry } from "@/sectorcalc/pro-form/contract-types";
import { getAllModules } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";
import type { ProFormulaModule } from "@/sectorcalc/formulas/pro-v531/pro-formula-contract";
import { getFormToSchemaMap, buildExecutePayload } from "@/sectorcalc/pro-form/pro-execute-payload-adapter";
import { normalizeProSchema } from "@/sectorcalc/runtime/pro-schema-loader";

const SCHEMA_DIR = join(process.cwd(), "src/sectorcalc/schemas/pro-v531");

// 20 LIVE tools
const LIVE_TOOLS = [
  { slug: "break-even-survival-cash-calculator", formulaFile: "break-even-survival-cash-calculator.formula" },
  { slug: "machine-hourly-rate-proof-report", formulaFile: "machine-hourly-rate-proof-report.formula" },
  { slug: "loss-making-job-detector", formulaFile: "loss-making-job-detector.formula" },
  { slug: "receivables-cost-payment-term-addendum", formulaFile: "receivables-cost-payment-term-addendum.formula" },
  { slug: "setup-time-reduction-roi-smed", formulaFile: "setup-time-reduction-roi-smed.formula" },
  { slug: "product-sku-margin-ranker", formulaFile: "product-sku-margin-ranker.formula" },
  { slug: "true-employee-cost-statement", formulaFile: "true-employee-cost-statement.formula" },
  { slug: "job-quote-builder-pro-pack", formulaFile: "job-quote-builder-pro-pack.formula" },
  { slug: "machine-investment-feasibility-buy-lease-keep", formulaFile: "machine-investment-feasibility-buy-lease-keep.formula" },
  { slug: "capital-equipment-investment-appraisal-npv-irr", formulaFile: "capital-equipment-investment-appraisal-npv-irr.formula" },
  { slug: "customer-sku-profitability-forensics", formulaFile: "customer-sku-profitability-forensics.formula" },
  { slug: "downtime-scrap-loss-statement", formulaFile: "downtime-scrap-loss-statement.formula" },
  { slug: "oee-loss-monetization-improvement-business-case", formulaFile: "oee-loss-monetization-improvement-business-case.formula" },
  { slug: "scrap-rework-cost-tracker", formulaFile: "scrap-rework-cost-tracker.formula" },
  { slug: "outsource-vs-in-house-analyzer", formulaFile: "outsource-vs-in-house-analyzer.formula" },
  { slug: "plant-wide-shop-rate-cost-structure-audit", formulaFile: "plant-wide-shop-rate-cost-structure-audit.formula" },
  { slug: "fx-commodity-pass-through-pricer", formulaFile: "fx-commodity-pass-through-pricer.formula" },
  { slug: "energy-efficiency-grant-incentive-feasibility-pack", formulaFile: "energy-efficiency-grant-incentive-feasibility-pack.formula" },
  { slug: "motor-compressor-replacement-roi", formulaFile: "motor-compressor-replacement-roi.formula" },
  { slug: "weld-procedure-cost-consumable-estimation-suite", formulaFile: "weld-procedure-cost-consumable-estimation-suite.formula" },
];

function loadSchema(slug: string): SuperV4Schema | null {
  const path = join(SCHEMA_DIR, `${slug}.schema.json`);
  if (!existsSync(path)) return null;
  try {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    return normalizeProSchema(raw);
  } catch {
    return null;
  }
}

interface FieldAssignment {
  schemaInputId: string;
  displayValue: number;
  displayUnit: string;
  baseUnit: string;
  normalizedId: string;
}

function buildFormLikePayload(schema: SuperV4Schema): {
  raw_inputs: Record<string, number>;
  selected_units: Record<string, string>;
  assignments: FieldAssignment[];
} {
  const raw_inputs: Record<string, number> = {};
  const selected_units: Record<string, string> = {};
  const assignments: FieldAssignment[] = [];

  for (const inp of schema.inputs) {
    const iid = inp.id;
    let val: number;
    const bu = inp.base_unit || "";
    const allowedUnits = inp.allowed_display_units || [bu];
    const unit = inp.unit_selectable && allowedUnits.length > 0 ? allowedUnits[0] : bu;

    // Assign display values for each input
    if (schema.tool_key === "true-employee-cost-statement" && iid === "annual_volume") val = 2080;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "material_cost") val = 10000;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "cycle_time") val = 30;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "setup_time") val = 90;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "target_margin") val = unit.includes("percent") ? 12 : 0.12;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "defect_or_loss_cost") val = unit.includes("percent") ? 0.5 : 0.005;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "machine_rate") val = 25;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "labor_rate") val = 300;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "annual_volume") val = 120;
    else if (schema.tool_key === "receivables-cost-payment-term-addendum" && iid === "uncertainty_multiplier") val = 2;
    else if (schema.tool_key === "energy-efficiency-grant-incentive-feasibility-pack" && iid === "grant_coverage_pct") val = unit.includes("percent") ? 30 : 0.3;
    else if (iid.includes("discount")) val = 10; // 10% display → 0.10 ratio after normalization
    else if (iid.includes("confidence")) val = 0.9;
    else if (iid.includes("stress")) val = 0.3;
    else if (schema.tool_key === "loss-making-job-detector" && iid === "uncertainty_multiplier") val = 50000;
    else if (iid.includes("uncertainty")) val = 0.5;
    else if (iid.includes("efficiency") && unit.includes("pct")) val = 85;
    else if (iid.includes("efficiency")) val = 0.85;
    else if (iid.includes("deposition") && unit.includes("pct")) val = 85;
    else if (iid.includes("deposition")) val = 0.85;
    else if (iid.includes("defect_rate") && unit.includes("pct")) val = 3.5;
    else if (iid.includes("defect_rate")) val = 0.035;
    else if (iid.includes("return_rate") && unit.includes("pct")) val = 2;
    else if (iid.includes("target_margin") && unit.includes("pct")) val = 30;
    else if (iid.includes("margin") && !unit.includes("pct")) val = 0.3;
    else if (iid.includes("material_cost_pct") && unit.includes("pct")) val = 40;
    else if (iid.includes("pct") || iid.includes("percent")) val = 50;
    else if (iid.includes("hedge_pct") || iid.includes("hedge_ratio")) val = 0.7;
    else if (iid.includes("initial_investment")) val = 500000;
    else if (iid.includes("annual_net_cash")) val = 150000;
    else if (iid.includes("residual")) val = 50000;
    else if (iid.includes("analysis_years") || iid.includes("equipment_life") || iid.includes("life_years")) val = 5;
    else if (iid.includes("annual_volume") || iid.includes("monthly_volume") || iid.includes("annual_quantity")) val = 10000;
    else if (iid.includes("labor_rate") || iid.includes("labor_rate_per_h")) val = 55;
    else if (iid.includes("overhead_rate") || iid.includes("shop_overhead")) val = 350000;
    else if (iid.includes("machine_rate")) val = 85;
    else if (iid.includes("ideal_cycle")) val = 0.5;
    else if (iid.includes("cycle_time")) val = 12;
    else if (iid.includes("setup_time")) val = 30;
    else if (iid.includes("batch_quantity")) val = 500;
    else if (iid.includes("material_cost")) val = 25;
    else if (iid.includes("weld_length")) val = 50;
    else if (iid.includes("weld_throat") || iid.includes("weld_leg")) val = 8;
    else if (iid.includes("weld_density")) val = 7.85;
    else if (iid.includes("weld_time") || iid.includes("total_job_time")) val = 120;
    else if (iid.includes("arc_time")) val = 90;
    else if (iid.includes("wire_cost") || iid.includes("filler_price")) val = 15;
    else if (iid.includes("gas_cost") && unit.includes("per_min")) val = 0.15;
    else if (iid.includes("gas_cost") && unit.includes("per_h")) val = 8;
    else if (iid.includes("unit_price") && iid.includes("outsource")) val = 95;
    else if (iid.includes("unit_price")) val = 100;
    else if (iid.includes("unit_variable_cost")) val = 60;
    else if (iid.includes("annual_revenue") || iid.includes("total_annual_cost")) val = 2000000;
    else if (iid.includes("operating_cost")) val = 1600000;
    else if (iid.includes("scrap_quantity")) val = 150;
    else if (iid.includes("rework_hours")) val = 120;
    else if (iid.includes("rework_rate")) val = 55;
    else if (iid.includes("unit_cost")) val = 25;
    else if (iid.includes("motor_power") || iid.includes("old_motor")) val = 75;
    else if (iid.includes("new_motor") && iid.includes("power")) val = 60;
    else if (iid.includes("total_productive_hours")) val = 40000;
    else if (iid.includes("operating_hours") || iid.includes("productive_hours")) val = 6000;
    else if (iid.includes("avg_kwh") || iid.includes("cost_per_kwh") || iid.includes("kwh_rate")) val = 0.12;
    else if (iid.includes("replacement_cost") || iid.includes("motor_price")) val = 12000;
    else if (iid.includes("installation_cost")) val = 4000;
    else if (iid.includes("maintenance_saving")) val = 2000;
    else if (iid.includes("current_kwh") || iid.includes("current_energy")) val = 500000;
    else if (iid.includes("target_kwh") || iid.includes("proposed_energy") || iid.includes("energy_saving")) val = 350000;
    else if (iid.includes("implementation_cost") || iid.includes("investment_cost") || iid.includes("improvement_cost")) val = 80000;
    else if (iid.includes("grant_coverage") || iid.includes("grant_amount")) val = 10000;
    else if (iid.includes("emission_factor")) val = 0.45;
    else if (iid.includes("planned_production")) val = 600;
    else if (iid.includes("operating_time")) val = 550;
    else if (iid.includes("net_operating")) val = 380;
    else if (iid.includes("valuable_operating")) val = 350;
    else if (iid.includes("total_parts")) val = 1000;
    else if (iid.includes("good_parts")) val = 950;
    else if (iid.includes("hourly_contribution")) val = 100;
    else if (iid.includes("total_produced")) val = 10000;
    else if (iid.includes("unit_material_cost")) val = 25;
    else if (iid.includes("unit_labor_cost")) val = 15;
    else if (iid.includes("defect_or_loss")) val = 15000;
    else if (iid.includes("base_price")) val = 100;
    else if (iid.includes("fx_rate_spot") || iid.includes("base_currency")) val = 1.10;
    else if (iid.includes("fx_rate_budget")) val = 1.05;
    else if (iid.includes("commodity_index")) val = 180;
    else if (iid.includes("in_house") && iid.includes("setup_cost")) val = 500;
    else if (iid.includes("in_house") && iid.includes("annual_fixed")) val = 120000;
    else if (iid.includes("outsource") && iid.includes("logistics")) val = 8;
    else if (iid.includes("outsource") && iid.includes("annual_fixed")) val = 30000;
    else if (iid.includes("capacity_utilization")) val = 75;
    else if (iid.includes("quality_risk")) val = 0.05;
    else if (iid.includes("direct_labor")) val = 450000;
    else if (iid.includes("indirect_labor")) val = 180000;
    else if (iid.includes("depreciation")) val = 95000;
    else if (iid.includes("utilities")) val = 85000;
    else if (iid.includes("maintenance") && !iid.includes("saving")) val = 65000;
    else if (iid.includes("floor_area")) val = 5000;
    else if (iid.includes("annual_rent")) val = 240000;
    else if (iid.includes("hedge_ratio") || iid.includes("hedge_pct")) val = 0.7;
    else if (iid.includes("current_shop_rate")) val = 85;
    else if (iid.includes("utilization_pct")) val = 80;
    else if (iid.includes("machine_group_cost")) val = 500000;
    else if (iid.includes("machine_group_hours")) val = 15000;
    else if (iid.includes("overhead_pool")) val = 600000;
    else if (iid.includes("overhead_allocation")) val = 40000;
    else if (iid.includes("logistics_cost") && unit.includes("pct")) val = 5;
    else if (iid.includes("service_cost") && unit.includes("pct")) val = 3;
    else if (iid.includes("planned_quote")) val = 50000;
    else if (iid.includes("contingency")) val = 10;
    else if (iid.includes("source_confidence")) val = 0.9;
    else val = 100;

    raw_inputs[iid] = val;
    selected_units[iid] = unit;
    assignments.push({
      schemaInputId: iid,
      displayValue: val,
      displayUnit: unit,
      baseUnit: bu,
      normalizedId: inp.normalized_id || iid,
    });
  }

  return { raw_inputs, selected_units, assignments };
}

describe("PRO V2 Full Pipeline: Form→API→Formula", () => {
  const modules = getAllModules();
  const moduleMap = new Map(modules.map((m: ProFormulaModule) => [m.toolKey, m]));

  it(`should have all 20 modules registered`, () => {
    expect(modules.length).toBe(20);
  });

  for (const tool of LIVE_TOOLS) {
    const { slug } = tool;

    it(`${slug}: adapter schema → raw_inputs → normalization → formula → outputs`, () => {
      const schema = loadSchema(slug);
      expect(schema).not.toBeNull();
      if (!schema) return;

      // STEP 0: Verify adapter mapping exists for this tool
      const adapterMap = getFormToSchemaMap(slug);
      expect(adapterMap).not.toBeNull();
      const schemaIds = schema.inputs.map((input) => input.id).sort();
      expect(Object.keys(adapterMap!).sort()).toEqual(schemaIds);
      expect(Object.values(adapterMap!).sort()).toEqual(schemaIds);

      // Build the same form state and unit state submitted by the live form.
      const formPayload = buildFormLikePayload(schema);
      const adapterPayload = buildExecutePayload({
        formState: formPayload.raw_inputs,
        selectedUnits: formPayload.selected_units,
        toolKey: slug,
        toolId: schema.tool_id,
        schemaVersion: schema.metadata.schema_version,
        usageSessionId: "test-adapter",
        formToSchemaMap: adapterMap!,
      });
      expect(adapterPayload.tool_key).toBe(slug);
      expect(adapterPayload.schema_version).toBe(schema.metadata.schema_version);
      expect(adapterPayload.raw_inputs).toEqual(formPayload.raw_inputs);
      expect(adapterPayload.selected_units).toEqual(formPayload.selected_units);

      // STEP 1: Build execute payload (same as form state machine would)
      const { raw_inputs, selected_units } = adapterPayload;

      // STEP 2: Verify raw_inputs keys match schema input IDs
      const schemaInputIds = new Set(schema.inputs.map(i => i.id));
      const rawKeys = Object.keys(raw_inputs);
      const unknownRawKeys = rawKeys.filter(k => !schemaInputIds.has(k));
      expect(unknownRawKeys).toEqual([]);

      // STEP 3: Verify selected_units keys match schema input IDs
      const unitKeys = Object.keys(selected_units);
      const unknownUnitKeys = unitKeys.filter(k => !schemaInputIds.has(k));
      expect(unknownUnitKeys).toEqual([]);

      // STEP 4: Verify all required schema inputs are present in raw_inputs
      const requiredMissing = schema.inputs
        .filter(i => i.required && !rawKeys.includes(i.id))
        .map(i => i.id);
      expect(requiredMissing).toEqual([]);

      // STEP 5: Run normalizeInputs (same as API route step S5)
      const conversionRegistry = (schema.unit_conversion_contract?.conversion_registry || {}) as ConversionRegistry;
      const { normalized, errors: normErrors } = normalizeInputs(
        raw_inputs,
        selected_units,
        schema,
        conversionRegistry,
      );

      expect(normErrors.length).toBe(0);
      if (normErrors.length > 0) {
        console.error(`Normalization errors for ${slug}:`, normErrors.map(e => e.reason));
      }

      // STEP 6: Build flat normalized inputs for formula module
      const flatNormInputs: Record<string, number> = {};
      for (const inp of schema.inputs) {
        const normId = inp.normalized_id || inp.id;
        const n = normalized[inp.id];
        if (n && typeof n.baseValue === "number") {
          flatNormInputs[normId] = n.baseValue;
        }
      }

      // STEP 7: Call formula module with normalized inputs (same as Path A in route.ts)
      const formulaModule = moduleMap.get(slug);
      expect(formulaModule).toBeDefined();
      if (!formulaModule) return;

      const result = formulaModule.calculate(flatNormInputs);
      
      // STEP 8: Verify outputs
      const outputs = result.outputs || {};
      const outputKeys = result.outputKeys || Object.keys(outputs);

      // All outputs must be finite numbers
      for (const key of outputKeys) {
        expect(typeof outputs[key]).toBe("number");
        expect(Number.isFinite(outputs[key])).toBe(true);
      }

      // Status must not be BLOCKED for valid inputs
      if (result.status === "BLOCKED") {
        throw new Error(`${slug} blocked: ${(result.warnings ?? []).join(" | ")}`);
      }
      expect(result.status).not.toBe("BLOCKED");

      // Decision state must be 0, 1, or 2 if present
      const decision = outputs["out_final_decision_state"];
      if (decision !== undefined) {
        expect([0, 1, 2]).toContain(decision);
      }
    });

    it(`${slug}: raw_inputs use schema input IDs, not form field IDs or normalized IDs`, () => {
      const schema = loadSchema(slug);
      if (!schema) return;

      const { raw_inputs } = buildFormLikePayload(schema);
      const rawKeys = Object.keys(raw_inputs);
      const schemaInputIds = new Set(schema.inputs.map(i => i.id));
      const normalizedIds = new Set(schema.inputs.filter(i => i.normalized_id).map(i => i.normalized_id as string));

      // No raw key should be a normalized ID (n_ prefix) unless the schema input ID itself starts with n_
      const normalizedKeyLeak = rawKeys.filter(k => normalizedIds.has(k) && !schemaInputIds.has(k));
      expect(normalizedKeyLeak).toEqual([]);

      // No unknown raw keys
      const unknownRawKeys = rawKeys.filter(k => !schemaInputIds.has(k));
      expect(unknownRawKeys).toEqual([]);
    });
  }

  it("blocks unknown form and unit keys instead of passing them through", () => {
    expect(() => buildExecutePayload({
      formState: { known: 1, stale_field: 2 },
      selectedUnits: { known: "1", stale_unit_field: "1" },
      toolKey: "contract-test-tool",
      toolId: "contract-test-tool",
      schemaVersion: "test",
      formToSchemaMap: { known: "known" },
    })).toThrow(/FORM_SCHEMA_CONTRACT_VIOLATION/);
  });
});
