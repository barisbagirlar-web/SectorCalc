import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "outsource-vs-in-house-analyzer";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const requiredInputs = [
    "n_in_house_material_cost_per_unit",
    "n_in_house_labor_cost_per_unit",
    "n_in_house_overhead_per_unit",
    "n_in_house_setup_cost_per_batch",
    "n_outsource_unit_price",
    "n_outsource_logistics_per_unit",
    "n_quality_defect_allowance_pct",
    "n_inventory_lead_time_cost_pct",
    "n_capacity_opportunity_cost_pct",
    "n_annual_volume",
  ];
  for (const key of requiredInputs) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  const material_cost = Math.max(0, get(inputs, "n_in_house_material_cost_per_unit"));
  const labor_cost = Math.max(0, get(inputs, "n_in_house_labor_cost_per_unit"));
  const overhead = Math.max(0, get(inputs, "n_in_house_overhead_per_unit"));
  const setup_batch = Math.max(0, get(inputs, "n_in_house_setup_cost_per_batch"));
  const supplier_price = Math.max(0, get(inputs, "n_outsource_unit_price"));
  const logistics_per_unit = Math.max(0, get(inputs, "n_outsource_logistics_per_unit"));
  const quality_defect_pct = Math.max(0, get(inputs, "n_quality_defect_allowance_pct"));
  const lead_time_cost_pct = Math.max(0, get(inputs, "n_inventory_lead_time_cost_pct"));
  const capacity_opp_cost_pct = Math.max(0, get(inputs, "n_capacity_opportunity_cost_pct"));
  const annual_volume = Math.max(0, get(inputs, "n_annual_volume"));

  // In-house costs
  const setup_per_unit = safeDiv(setup_batch, Math.max(annual_volume, 1));
  const in_house_variable_cost = material_cost + labor_cost + overhead;
  const in_house_allocated_fixed = setup_per_unit * annual_volume;
  const in_house_total_cost = in_house_variable_cost * annual_volume + in_house_allocated_fixed;

  // Outsource landed costs
  const logistics_import_cost = logistics_per_unit * annual_volume;
  const quality_defect_allowance = supplier_price * annual_volume * (quality_defect_pct / 100);
  const inventory_lead_time_cost = (supplier_price + logistics_per_unit) * annual_volume * (lead_time_cost_pct / 100);
  const capacity_opportunity_cost = in_house_total_cost * (capacity_opp_cost_pct / 100);
  const outsource_total_landed_cost = (supplier_price * annual_volume) + logistics_import_cost + quality_defect_allowance + inventory_lead_time_cost;

  // Comparison
  const cost_difference = in_house_total_cost - outsource_total_landed_cost;

  // Break-even volume: where in_house_total_cost = outsource_total_landed_cost
  // in_house_unit_var * V + setup = supplier_landed_per_unit * V
  // V = setup / (supplier_landed_per_unit - in_house_unit_var)
  const in_house_unit_var = in_house_variable_cost;
  const supplier_landed_per_unit = supplier_price + logistics_per_unit + (supplier_price * quality_defect_pct / 100) + ((supplier_price + logistics_per_unit) * lead_time_cost_pct / 100);
  const break_even_volume = supplier_landed_per_unit > in_house_unit_var
    ? safeDiv(setup_batch, (supplier_landed_per_unit - in_house_unit_var))
    : 0;

  // Make-Buy Decision: 0=MAKE, 1=BUY
  // Also consider capacity opportunity cost
  const total_in_house_cost_with_opportunity = in_house_total_cost + capacity_opportunity_cost;
  const effective_difference = total_in_house_cost_with_opportunity - outsource_total_landed_cost;
  const make_buy_decision = effective_difference > 0 ? 1 : 0;

  // Primary decision driver: 0=material, 1=labor, 2=overhead, 3=supplier price, 4=logistics
  const driverValues = [
    material_cost * annual_volume,
    labor_cost * annual_volume,
    overhead * annual_volume + in_house_allocated_fixed,
    supplier_price * annual_volume,
    logistics_import_cost,
  ];
  const maxDriverVal = Math.max(...driverValues);
  const primary_decision_driver = maxDriverVal > 0 ? driverValues.indexOf(maxDriverVal) : 0;

  // Decision state: 0=GOOD (clear make/buy), 1=REVIEW (borderline), 2=BLOCKED (data issues)
  let decision: number;
  const threshold_pct = 10; // 10% threshold
  const cost_diff_pct = safeDiv(Math.abs(cost_difference), Math.max(in_house_total_cost, outsource_total_landed_cost)) * 100;
  if (cost_diff_pct > threshold_pct) {
    decision = 0; // GOOD — clear decision
  } else if (cost_diff_pct > 3) {
    decision = 1; // REVIEW — borderline, needs qualitative factors
  } else {
    decision = 2; // BLOCKED — costs too close or data insufficient
  }

  outputs["out_in_house_variable_cost"] = round(in_house_variable_cost, 2);
  outputs["out_in_house_allocated_fixed"] = round(in_house_allocated_fixed, 2);
  outputs["out_in_house_total_cost"] = round(in_house_total_cost, 2);
  outputs["out_supplier_unit_price"] = round(supplier_price, 2);
  outputs["out_logistics_import_cost"] = round(logistics_import_cost, 2);
  outputs["out_quality_defect_allowance"] = round(quality_defect_allowance, 2);
  outputs["out_inventory_lead_time_cost"] = round(inventory_lead_time_cost, 2);
  outputs["out_capacity_opportunity_cost"] = round(capacity_opportunity_cost, 2);
  outputs["out_outsource_total_landed_cost"] = round(outsource_total_landed_cost, 2);
  outputs["out_cost_difference"] = round(cost_difference, 2);
  outputs["out_break_even_volume"] = round(break_even_volume, 0);
  outputs["out_make_buy_decision"] = make_buy_decision;
  outputs["out_primary_decision_driver"] = primary_decision_driver;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
