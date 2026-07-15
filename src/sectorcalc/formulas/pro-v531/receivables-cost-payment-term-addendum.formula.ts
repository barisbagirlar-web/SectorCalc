/**
 * Receivables Cost / Payment Term Addendum — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed ReceivablesCostInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface ReceivablesCostInputs {
  machineRate: number;          // Machine hourly rate (currency/hour)
  cycleTime: number;            // Cycle time per unit (minutes)
  materialCost: number;         // Material cost per unit (currency/unit)
  batchQuantity: number;        // Batch quantity (count)
  overheadRate: number;         // Annual overhead rate (currency)
  defectOrLossCost: number;     // Defect or loss cost (currency)
  sourceConfidence: number;     // Source confidence ratio (0..1)
}

export interface ReceivablesCostOutputs {
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

export function executeFormula(inputs: ReceivablesCostInputs): ReceivablesCostOutputs {
  const {
    machineRate, cycleTime, materialCost, batchQuantity,
    overheadRate, defectOrLossCost, sourceConfidence,
  } = inputs;

  const ra = (machineRate * cycleTime / 60) * batchQuantity + materialCost * batchQuantity;
  const fr = machineRate > 0 ? Math.min(Math.max(0.02, overheadRate / machineRate / 100), 0.25) : 0.02;
  const fc = ra * fr * 60 / 365;
  const ap = ra > 0 ? fc / ra : 0;
  const rp = defectOrLossCost * 0.15;
  const tfc = fc + rp;

  const out_evidence_completeness = sourceConfidence;
  const out_normalized_demand = ra;
  const out_demand_metric = fc;
  const out_capacity_metric = ra + tfc;
  const out_utilization_margin = ap;
  const out_money_at_risk = tfc;
  const out_threshold_crossing = ap > 0.05 ? 1 : 0;
  const out_fmea_trigger = ap > 0.10 ? 1 : 0;
  const out_final_decision_state = ap <= 0.05 ? 0 : (ap <= 0.10 ? 1 : 2);
  const out_reference_deviation = ra > 0 ? Math.abs(ra - fc) / ra : 0;
  const out_derating_factor = sourceConfidence;
  const out_expanded_uncertainty = tfc * 0.1;
  const out_sensitivity_driver = fc > rp ? 1 : 0;
  const out_scenario_delta = tfc * 0.15;
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
  inputs: ReceivablesCostInputs,
  driver: keyof ReceivablesCostInputs,
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

  const typed: ReceivablesCostInputs = {
    machineRate: get(inputs, "n_machine_rate"),
    cycleTime: get(inputs, "n_cycle_time"),
    materialCost: get(inputs, "n_material_cost"),
    batchQuantity: get(inputs, "n_batch_quantity"),
    overheadRate: get(inputs, "n_overhead_rate"),
    defectOrLossCost: get(inputs, "n_defect_or_loss_cost"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_machine_rate", "n_batch_quantity"] as const;
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

export const toolKey = "receivables-cost-payment-term-addendum";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_machine_rate: 85,
  n_cycle_time: 12,
  n_batch_quantity: 500,
  n_material_cost: 25,
  n_overhead_rate: 350000,
  n_defect_or_loss_cost: 12000,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [
  "n_machine_rate", "n_cycle_time", "n_material_cost", "n_batch_quantity",
  "n_overhead_rate", "n_defect_or_loss_cost", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
