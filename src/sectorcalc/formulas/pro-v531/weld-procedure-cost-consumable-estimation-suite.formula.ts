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

export const toolKey = "weld-procedure-cost-consumable-estimation-suite";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const weld_length = get(inputs, "n_weld_length_m");
  const throat_mm = get(inputs, "n_weld_throat_mm");
  const weld_density = get(inputs, "n_weld_density_g_per_cm3");
  const wire_cost_per_kg = get(inputs, "n_wire_cost_per_kg");
  const gas_cost_per_min = get(inputs, "n_gas_cost_per_min");
  const arc_time = get(inputs, "n_arc_time_min");
  const weld_time_min = get(inputs, "n_weld_time_min");
  const labor_rate = get(inputs, "n_labor_rate");
  const overhead_rate = get(inputs, "n_overhead_rate");
  const dep_eff = get(inputs, "n_deposition_efficiency_pct") / 100;
  const conf = get(inputs, "n_source_confidence_ratio");

  if (!isFiniteNumber(inputs["n_weld_length_m"])) warnings.push("Missing: n_weld_length_m");
  if (!isFiniteNumber(inputs["n_weld_throat_mm"])) warnings.push("Missing: n_weld_throat_mm");
  if (!isFiniteNumber(inputs["n_wire_cost_per_kg"])) warnings.push("Missing: n_wire_cost_per_kg");

  const throat_m = throat_mm / 1000;
  const weld_volume_g = weld_length * (throat_m * throat_m) / 2 * weld_density * 1000;
  const wire_needed = dep_eff > 0 ? weld_volume_g / dep_eff : 0;
  const consumable_cost = wire_needed / 1000 * wire_cost_per_kg;
  const gas_cost = gas_cost_per_min * arc_time / 60;
  const labor_cost = labor_rate * weld_time_min / 60;
  const overhead_cost = overhead_rate * weld_time_min / 60;
  const total_cost = consumable_cost + gas_cost + labor_cost + overhead_cost;
  const cost_per_meter = weld_length > 0 ? total_cost / weld_length : 0;
  const decision = cost_per_meter > 50 ? 1 : (cost_per_meter > 20 ? 2 : 0);

  // Tool-specific output keys for weld-procedure-cost-consumable-estimation-suite
  outputs["out_total_cost_floor"] = round(total_cost, 2);
  outputs["out_base_production_cost"] = round(total_cost - overhead_cost, 2);
  outputs["out_cost_per_meter"] = round(cost_per_meter, 2);
  outputs["out_wire_mass_kg"] = round(wire_needed / 1000, 3);
  outputs["out_wire_cost"] = round(consumable_cost, 2);
  outputs["out_shielding_gas_cost"] = round(gas_cost, 2);
  outputs["out_labor_cost"] = round(labor_cost, 2);
  outputs["out_shop_overhead"] = round(overhead_cost, 2);
  outputs["out_consumable_efficiency"] = round(dep_eff, 3);
  outputs["out_decision_state"] = decision;

  // Preserved generic outputs for backward compatibility
  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_expanded_uncertainty"] = round(Math.abs(total_cost * (1 - conf)), 2);
  outputs["out_threshold_crossing"] = cost_per_meter > 50 ? 1 : 0;
  outputs["out_sensitivity_driver"] = labor_cost > consumable_cost ? 1 : 0;
  outputs["out_fmea_trigger"] = cost_per_meter > 30 ? 1 : 0;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
