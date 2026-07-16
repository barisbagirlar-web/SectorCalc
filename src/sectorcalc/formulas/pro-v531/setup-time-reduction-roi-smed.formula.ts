import "server-only";
/**
 * Setup Time Reduction ROI (SMED) — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed SetupTimeReductionInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 *
 * FIX (ported from a759fe2d9 audit, 2026-07-16): investment cost was fabricated as
 * overheadRate*0.3 (or a hardcoded $50,000 fallback), and setup-time savings assumed a
 * fixed 50% reduction with no input backing it. Added real smedInvestmentCost and
 * setupTimeReductionTargetPct inputs.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface SetupTimeReductionInputs {
  machineRate: number;               // Machine hourly rate (currency/hour)
  setupTime: number;                 // Current setup time per changeover (minutes)
  setupTimeReductionTargetPct: number; // Target setup time reduction (ratio, e.g. 0.5 = 50%)
  smedInvestmentCost: number;        // Real one-time SMED implementation investment (currency)
  batchQuantity: number;             // Batch quantity (count)
  annualVolume: number;              // Annual production volume (count/year)
  laborRate: number;                 // Labor rate (currency/unit)
  overheadRate: number;              // Annual overhead allocation (currency)
  sourceConfidence: number;          // Source confidence ratio (0..1)
}

export interface SetupTimeReductionOutputs {
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

export function executeFormula(inputs: SetupTimeReductionInputs): SetupTimeReductionOutputs {
  const {
    machineRate, setupTime, setupTimeReductionTargetPct, smedInvestmentCost,
    batchQuantity, annualVolume, laborRate, overheadRate, sourceConfidence,
  } = inputs;

  const reductionRatio = Math.max(0, Math.min(1, setupTimeReductionTargetPct));
  const saved = setupTime * reductionRatio;
  const ac = batchQuantity > 0 ? annualVolume / batchQuantity : 0;
  const ahr = saved * ac / 60;
  const acv = ahr * (machineRate - laborRate);
  const ass = saved * ac / 60 * machineRate;
  const ic = smedInvestmentCost;
  const pbm = ass > 0 ? (ic / ass) * 12 : 999;
  const roi = ic > 0 ? (ass / ic) * 100 : 0;

  const out_evidence_completeness = sourceConfidence;
  const out_normalized_demand = ahr;
  const out_demand_metric = ass;
  const out_capacity_metric = acv;
  const out_utilization_margin = roi / 100;
  const out_money_at_risk = ic;
  const out_threshold_crossing = roi > 50 ? 0 : 1;
  const out_fmea_trigger = pbm > 24 ? 1 : 0;
  const out_final_decision_state = pbm < 12 ? 0 : (pbm <= 24 ? 1 : 2);
  const out_reference_deviation = setupTime > 0 ? Math.abs(setupTime - saved) / setupTime : 0;
  const out_derating_factor = sourceConfidence;
  const out_expanded_uncertainty = ass * 0.1;
  const out_sensitivity_driver = ass > ic ? 1 : 0;
  const out_scenario_delta = ass * 0.15;
  const out_audit_hash_payload = 0;
  void overheadRate;

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
  inputs: SetupTimeReductionInputs,
  driver: keyof SetupTimeReductionInputs,
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

  const typed: SetupTimeReductionInputs = {
    machineRate: get(inputs, "n_machine_rate"),
    setupTime: get(inputs, "n_setup_time"),
    setupTimeReductionTargetPct: get(inputs, "n_setup_time_reduction_target_pct", 0.5),
    smedInvestmentCost: get(inputs, "n_smed_investment_cost"),
    batchQuantity: get(inputs, "n_batch_quantity"),
    annualVolume: get(inputs, "n_annual_volume"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_machine_rate", "n_setup_time", "n_smed_investment_cost"] as const;
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

export const toolKey = "setup-time-reduction-roi-smed";
export const formulaVersion = "5.3.1-pro-baris.2";

export const sampleInputs: Record<string, number> = {
  n_machine_rate: 85,
  n_setup_time: 30,
  n_setup_time_reduction_target_pct: 0.5,
  n_smed_investment_cost: 45000,
  n_batch_quantity: 500,
  n_labor_rate: 45,
  n_overhead_rate: 350000,
  n_annual_volume: 100000,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [
  "n_machine_rate", "n_setup_time", "n_setup_time_reduction_target_pct",
  "n_smed_investment_cost", "n_batch_quantity", "n_labor_rate",
  "n_overhead_rate", "n_annual_volume", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
