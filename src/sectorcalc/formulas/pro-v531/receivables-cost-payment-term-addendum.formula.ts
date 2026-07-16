import "server-only";
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
 *
 * FIX (ported from a759fe2d9 audit, 2026-07-16): this tool's own scope is "convert payment
 * terms into financing cost percentage" but it previously ran unrelated manufacturing
 * job-costing math (machine rate, cycle time, material cost, batch quantity) through a
 * fabricated financing-rate clamp -- zero real receivables inputs. Rebuilt with the 4 real
 * receivables-domain inputs: average receivable balance, annual interest rate, average
 * collection period (DSO), and invoice volume.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface ReceivablesCostInputs {
  averageReceivableBalance: number;  // Average outstanding AR balance (currency)
  annualInterestRate: number;        // Cost of capital / borrowing rate (ratio, e.g. 0.08)
  averageCollectionDays: number;     // Average days sales outstanding (days)
  invoiceVolume: number;             // Annual invoiced revenue (currency/yr)
  sourceConfidence: number;          // Source confidence ratio (0..1)
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
    averageReceivableBalance, annualInterestRate, averageCollectionDays,
    invoiceVolume, sourceConfidence,
  } = inputs;

  // AR carrying cost: balance sitting outstanding, financed at the cost of capital.
  const carryingCost = averageReceivableBalance * annualInterestRate;

  // DSO-driven financing cost: the interest cost of collection taking averageCollectionDays
  // instead of being collected instantly, applied to annual invoiced revenue.
  const dsoFinancingCost = invoiceVolume * annualInterestRate * (averageCollectionDays / 365);

  const totalFinancingCost = carryingCost + dsoFinancingCost;
  const financingCostPct = invoiceVolume > 0 ? totalFinancingCost / invoiceVolume : 0;

  const out_evidence_completeness = sourceConfidence;
  const out_normalized_demand = invoiceVolume;
  const out_demand_metric = carryingCost;
  const out_capacity_metric = averageReceivableBalance + totalFinancingCost;
  const out_utilization_margin = financingCostPct;
  const out_money_at_risk = totalFinancingCost;
  const out_threshold_crossing = financingCostPct > 0.02 ? 1 : 0;
  const out_fmea_trigger = financingCostPct > 0.05 ? 1 : 0;
  const out_final_decision_state = financingCostPct <= 0.02 ? 0 : (financingCostPct <= 0.05 ? 1 : 2);
  const out_reference_deviation = invoiceVolume > 0
    ? Math.abs(averageReceivableBalance - (invoiceVolume * averageCollectionDays / 365)) / invoiceVolume
    : 0;
  const out_derating_factor = sourceConfidence;
  const out_expanded_uncertainty = totalFinancingCost * 0.1;
  const out_sensitivity_driver = carryingCost > dsoFinancingCost ? 0 : 1;
  const out_scenario_delta = totalFinancingCost * 0.15;
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
    averageReceivableBalance: get(inputs, "n_average_receivable_balance"),
    annualInterestRate: get(inputs, "n_annual_interest_rate"),
    averageCollectionDays: get(inputs, "n_average_collection_days"),
    invoiceVolume: get(inputs, "n_invoice_volume"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_average_receivable_balance", "n_annual_interest_rate", "n_invoice_volume"] as const;
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
export const formulaVersion = "5.3.1-pro-baris.2";

export const sampleInputs: Record<string, number> = {
  n_average_receivable_balance: 450000,
  n_annual_interest_rate: 0.08,
  n_average_collection_days: 52,
  n_invoice_volume: 3200000,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_average_receivable_balance", "n_annual_interest_rate",
  "n_average_collection_days", "n_invoice_volume", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
