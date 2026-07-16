/**
 * Product SKU Margin Ranker — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed ProductSkuMarginInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface ProductSkuMarginInputs {
  unitSellingPrice: number;     // Real selling price per unit (currency/unit)
  machineRate: number;          // Machine hourly rate (currency/hour)
  cycleTime: number;            // Cycle time per unit (minutes)
  materialCost: number;         // Material cost per unit (currency/unit)
  targetMargin: number;         // Target margin (ratio, e.g. 0.3 = 30%)
  annualVolume: number;         // Annual production volume (count/year)
  laborRate: number;            // Labor rate (currency/unit)
  overheadRate: number;         // Annual overhead allocation (currency)
  defectOrLossCost: number;     // Defect or loss cost (currency)
  sourceConfidence: number;     // Source confidence ratio (0..1)
}

export interface ProductSkuMarginOutputs {
  out_evidence_completeness: number;
  out_normalized_demand: number;
  out_demand_metric: number;
  out_capacity_metric: number;
  out_utilization_margin: number;
  out_money_at_risk: number;
  out_threshold_crossing: number;
  out_fmea_trigger: number;
  out_final_decision_state: number;
  out_reference_deviation: number;
  out_derating_factor: number;
  out_expanded_uncertainty: number;
  out_sensitivity_driver: number;
  out_scenario_delta: number;
  out_audit_hash_payload: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: ProductSkuMarginInputs): ProductSkuMarginOutputs {
  const {
    unitSellingPrice, machineRate, cycleTime, materialCost, targetMargin,
    annualVolume, laborRate, overheadRate, defectOrLossCost,
    sourceConfidence,
  } = inputs;

  const ch = cycleTime / 60;
  const tuc = materialCost + (laborRate * ch) + (machineRate * ch) + (annualVolume > 0 ? overheadRate / annualVolume : 0);
  // FIX (ported from a759fe2d9 audit): price was fabricated as materialCost*1.4
  // (ignoring the target margin input entirely). Now uses the real selling price.
  const up = unitSellingPrice;
  const cm = up - tuc;
  const cmr = up > 0 ? cm / up : 0;
  const lc = materialCost * 0.1;
  const nm = cm - lc - (annualVolume > 0 ? defectOrLossCost / annualVolume : 0);
  const rs = nm * 100;

  const out_evidence_completeness = sourceConfidence;
  const out_normalized_demand = annualVolume;
  const out_demand_metric = cm;
  const out_capacity_metric = up;
  const out_utilization_margin = cmr;
  const out_money_at_risk = Math.abs(cm) * annualVolume;
  const out_threshold_crossing = cm > 0 ? 0 : 1;
  const out_fmea_trigger = cm < 0 ? 1 : 0;
  const out_final_decision_state = cm > 0 && cmr >= targetMargin ? 0 : (cm > 0 ? 1 : 2);
  const out_reference_deviation = tuc > 0 ? Math.abs(up - tuc) / tuc : 0;
  const out_derating_factor = sourceConfidence;
  const out_expanded_uncertainty = cm * 0.1;
  const out_sensitivity_driver = materialCost > laborRate * ch ? 1 : 0;
  const out_scenario_delta = cm * annualVolume * 0.15;
  const out_audit_hash_payload = 0;

  return {
    out_evidence_completeness,
    out_normalized_demand,
    out_demand_metric,
    out_capacity_metric,
    out_utilization_margin,
    out_money_at_risk,
    out_threshold_crossing,
    out_fmea_trigger,
    out_final_decision_state,
    out_reference_deviation,
    out_derating_factor,
    out_expanded_uncertainty,
    out_sensitivity_driver,
    out_scenario_delta,
    out_audit_hash_payload,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: ProductSkuMarginInputs,
  driver: keyof ProductSkuMarginInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_money_at_risk;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_money_at_risk;
  return Math.abs(up - dn);
}

// ─── ProFormulaModule contract ──────────────────────────────────────────────

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string, fallback = 0): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}

const OUTPUT_KEYS: readonly string[] = [
  "out_evidence_completeness", "out_normalized_demand", "out_demand_metric",
  "out_capacity_metric", "out_utilization_margin", "out_money_at_risk",
  "out_threshold_crossing", "out_fmea_trigger", "out_final_decision_state",
  "out_reference_deviation", "out_derating_factor", "out_expanded_uncertainty",
  "out_sensitivity_driver", "out_scenario_delta", "out_audit_hash_payload",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: ProductSkuMarginInputs = {
    unitSellingPrice: get(inputs, "n_unit_selling_price"),
    machineRate: get(inputs, "n_machine_rate"),
    cycleTime: get(inputs, "n_cycle_time"),
    materialCost: get(inputs, "n_material_cost"),
    targetMargin: get(inputs, "n_target_margin"),
    annualVolume: get(inputs, "n_annual_volume"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    defectOrLossCost: get(inputs, "n_defect_or_loss_cost"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_unit_selling_price", "n_machine_rate", "n_cycle_time", "n_material_cost"] as const;
  for (const key of mandatory) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push(`Input "${key}" is missing or invalid — using 0`);
    }
  }

  const raw = executeFormula(typed);
  const allOutputs = raw as unknown as Record<string, number>;
  const outputs: Record<string, number> = {};
  for (const key of OUTPUT_KEYS) {
    outputs[key] = allOutputs[key];
  }

  const ok = OUTPUT_KEYS.every((k) => isFiniteNumber(outputs[k]));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "product-sku-margin-ranker";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_unit_selling_price: 65,
  n_machine_rate: 85,
  n_cycle_time: 12,
  n_material_cost: 25,
  n_target_margin: 0.3,
  n_annual_volume: 100000,
  n_labor_rate: 45,
  n_overhead_rate: 350000,
  n_defect_or_loss_cost: 12000,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [
  "n_unit_selling_price", "n_machine_rate", "n_cycle_time", "n_material_cost", "n_target_margin",
  "n_annual_volume", "n_labor_rate", "n_overhead_rate",
  "n_defect_or_loss_cost", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
