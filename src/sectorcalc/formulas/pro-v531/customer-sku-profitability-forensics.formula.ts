// @server-only
/**
 * Customer SKU Profitability Forensics — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed SKUProfitInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface SKUProfitInputs {
  unitPrice: number;           // Selling price per unit (canonical currency)
  unitVariableCost: number;    // Variable cost per unit (canonical currency)
  annualVolume: number;        // Annual sales volume (units)
  logisticsCostPct: number;    // Logistics cost as % of unit price
  serviceCostPct: number;      // Service/warranty cost as % of unit price
  returnRatePct: number;       // Return rate as % of unit price
  targetMargin: number;        // Target contribution margin ratio (%)
  laborRate: number;           // Direct labor rate (canonical currency/hour)
  overheadRate: number;        // Overhead allocation rate (%)
  sourceConfidence: number;    // Source confidence ratio (0..1)
}

export interface SKUProfitOutputs {
  out_unitContribution: number;
  out_contributionMarginRatio: number;
  out_logisticsBurden: number;
  out_serviceBurden: number;
  out_returnBurden: number;
  out_netMargin: number;
  out_toxicFlag: number;
  out_totalAnnualMargin: number;
  out_biggestBurdenIndex: number;
  out_decisionState: number;
  out_thresholdCrossing: number;
  out_fmeaTrigger: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: SKUProfitInputs): SKUProfitOutputs {
  const {
    unitPrice, unitVariableCost, annualVolume,
    logisticsCostPct, serviceCostPct, returnRatePct,
    targetMargin,
    sourceConfidence,
  } = inputs;

  const unitContribution = unitPrice - unitVariableCost;
  const contributionMarginRatio = unitPrice > 0
    ? unitContribution / unitPrice
    : 0;
  const logisticsBurden = unitPrice * (logisticsCostPct / 100);
  const serviceBurden = unitPrice * (serviceCostPct / 100);
  const returnBurden = unitPrice * (returnRatePct / 100);
  const netMargin = unitContribution - logisticsBurden - serviceBurden - returnBurden;
  const toxicFlag = netMargin < 0 ? 1 : 0;
  const totalAnnualMargin = netMargin * annualVolume;

  const burdenValues = [logisticsBurden, serviceBurden, returnBurden];
  const biggestBurdenIndex = burdenValues.indexOf(Math.max(...burdenValues));

  const targetMarginRatio = targetMargin / 100;
  const decisionState =
    contributionMarginRatio > targetMarginRatio ? 0 :
    contributionMarginRatio > 0 ? 1 :
    2;

  const thresholdCrossing = toxicFlag;
  const fmeaTrigger = toxicFlag;

  return {
    out_unitContribution: unitContribution,
    out_contributionMarginRatio: contributionMarginRatio,
    out_logisticsBurden: logisticsBurden,
    out_serviceBurden: serviceBurden,
    out_returnBurden: returnBurden,
    out_netMargin: netMargin,
    out_toxicFlag: toxicFlag,
    out_totalAnnualMargin: totalAnnualMargin,
    out_biggestBurdenIndex: biggestBurdenIndex,
    out_decisionState: decisionState,
    out_thresholdCrossing: thresholdCrossing,
    out_fmeaTrigger: fmeaTrigger,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: SKUProfitInputs,
  driver: keyof SKUProfitInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_netMargin;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_netMargin;
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
  "out_unitContribution", "out_contributionMarginRatio",
  "out_logisticsBurden", "out_serviceBurden", "out_returnBurden",
  "out_netMargin", "out_toxicFlag", "out_totalAnnualMargin",
  "out_biggestBurdenIndex", "out_decisionState",
  "out_thresholdCrossing", "out_fmeaTrigger",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: SKUProfitInputs = {
    unitPrice: get(inputs, "n_unit_price"),
    unitVariableCost: get(inputs, "n_unit_variable_cost"),
    annualVolume: get(inputs, "n_annual_volume"),
    logisticsCostPct: get(inputs, "n_logistics_cost_pct"),
    serviceCostPct: get(inputs, "n_service_cost_pct"),
    returnRatePct: get(inputs, "n_return_rate_pct"),
    targetMargin: get(inputs, "n_target_margin"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_unit_price", "n_unit_variable_cost", "n_annual_volume"] as const;
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

export const toolKey = "customer-sku-profitability-forensics";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_unit_price: 250,
  n_unit_variable_cost: 140,
  n_annual_volume: 5000,
  n_logistics_cost_pct: 8,
  n_service_cost_pct: 5,
  n_return_rate_pct: 3,
  n_target_margin: 25,
  n_labor_rate: 35,
  n_overhead_rate: 15,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_unit_price", "n_unit_variable_cost", "n_annual_volume",
  "n_logistics_cost_pct", "n_service_cost_pct", "n_return_rate_pct",
  "n_target_margin", "n_labor_rate", "n_overhead_rate",
  "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
