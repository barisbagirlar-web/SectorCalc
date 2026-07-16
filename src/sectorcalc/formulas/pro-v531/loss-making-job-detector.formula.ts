/**
 * Loss-Making Job Detector — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed LossMakingJobInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface LossMakingJobInputs {
  quotedJobPrice: number;       // Real quoted/selling price for the job (canonical currency)
  machineRate: number;          // Machine rate (canonical currency/unit)
  materialCost: number;         // Material cost per batch (canonical currency)
  laborRate: number;            // Labor rate (canonical currency/unit)
  overheadRate: number;         // Overhead rate (canonical currency/unit)
  defectOrLossCost: number;     // Defect or loss cost (canonical currency)
  targetMargin: number;         // Target margin (ratio, e.g. 0.25 = 25%)
  batchQuantity: number;        // Batch quantity (count)
  annualVolume: number;         // Annual production volume (count/year)
  sourceConfidence: number;     // Source confidence ratio (0..1)
}

export interface LossMakingJobOutputs {
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

export function executeFormula(inputs: LossMakingJobInputs): LossMakingJobOutputs {
  const {
    quotedJobPrice, machineRate, materialCost, laborRate, overheadRate,
    defectOrLossCost, targetMargin, batchQuantity, annualVolume,
    sourceConfidence,
  } = inputs;

  // FIX (ported from a759fe2d9 audit): price was previously fabricated as
  // machineRate * batchQuantity -- never using the tool's actual purpose (a real quoted
  // price to compare against cost). Now uses the real quoted price input.
  const totalCost = machineRate + materialCost + laborRate + overheadRate + defectOrLossCost;
  const price = quotedJobPrice;
  const gm = price - totalCost;
  const cm = price > 0 ? gm / price : 0;
  // FIX: minimum acceptable price now uses cost/(1-margin), consistent with the
  // contribution-margin (margin-on-price) definition used for cm above -- previously used
  // cost*(1+margin) (markup), an incompatible margin definition in the same formula.
  const map = targetMargin < 1 ? totalCost / (1 - targetMargin) : totalCost;
  const loss = gm < 0 ? Math.abs(gm) : 0;

  const out_evidence_completeness = sourceConfidence;
  const out_normalized_demand = price;
  const out_demand_metric = gm;
  const out_capacity_metric = map;
  const out_utilization_margin = cm;
  const out_money_at_risk = loss * annualVolume;
  const out_threshold_crossing = cm >= targetMargin ? 0 : 1;
  const out_fmea_trigger = loss > 0 ? 1 : 0;
  const out_final_decision_state = cm >= targetMargin ? 0 : (cm > 0 ? 1 : 2);
  const out_reference_deviation = price > 0
    ? Math.abs(price - map) / price
    : 0;
  const out_derating_factor = 1.0;
  const out_expanded_uncertainty = totalCost * 0.1;
  const out_sensitivity_driver = materialCost > laborRate ? 1 : 0;
  const out_scenario_delta = loss * annualVolume * 0.15;
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
  inputs: LossMakingJobInputs,
  driver: keyof LossMakingJobInputs,
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

  const typed: LossMakingJobInputs = {
    quotedJobPrice: get(inputs, "n_quoted_job_price"),
    machineRate: get(inputs, "n_machine_rate"),
    materialCost: get(inputs, "n_material_cost"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    defectOrLossCost: get(inputs, "n_defect_or_loss_cost"),
    targetMargin: get(inputs, "n_target_margin"),
    batchQuantity: get(inputs, "n_batch_quantity"),
    annualVolume: get(inputs, "n_annual_volume"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_quoted_job_price", "n_machine_rate", "n_batch_quantity"] as const;
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

export const toolKey = "loss-making-job-detector";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_quoted_job_price: 500,
  n_machine_rate: 85,
  n_material_cost: 300,
  n_labor_rate: 55,
  n_overhead_rate: 75,
  n_defect_or_loss_cost: 20,
  n_target_margin: 0.25,
  n_batch_quantity: 100,
  n_annual_volume: 5000,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [
  "n_quoted_job_price", "n_machine_rate", "n_material_cost", "n_labor_rate", "n_overhead_rate",
  "n_defect_or_loss_cost", "n_target_margin", "n_batch_quantity",
  "n_annual_volume", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
