import "server-only";
/**
 * Outsource vs In-House Analyzer — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Conforms to ProFormulaModule contract.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface OutsourceVsInHouseInputs {
  inHouseMaterialCost: number;
  inHouseLaborCost: number;
  inHouseOverhead: number;
  inHouseSetupCost: number;
  outsourceUnitPrice: number;
  outsourceLogisticsCost: number;
  annualVolume: number;
  qualityRiskPremiumPct: number;
  capacityUtilizationPct: number;
  sourceConfidence: number;
}

export interface OutsourceVsInHouseOutputs {
  out_evidenceCompleteness: number;
  out_normalizedDemand: number;
  out_referenceDeviation: number;
  out_deratingFactor: number;
  out_demandMetric: number;
  out_capacityMetric: number;
  out_utilizationMargin: number;
  out_expandedUncertainty: number;
  out_thresholdCrossing: number;
  out_sensitivityDriver: number;
  out_fmeaTrigger: number;
  out_moneyAtRisk: number;
  out_scenarioDelta: number;
  out_auditHashPayload: number;
  out_finalDecisionState: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: OutsourceVsInHouseInputs): OutsourceVsInHouseOutputs {
  const {
    inHouseMaterialCost, inHouseLaborCost, inHouseOverhead,
    inHouseSetupCost, outsourceUnitPrice, outsourceLogisticsCost,
    annualVolume, qualityRiskPremiumPct, capacityUtilizationPct,
    sourceConfidence,
  } = inputs;

  const vol = Math.max(annualVolume, 1);
  const setupCostPerUnit = inHouseSetupCost / vol;
  const inHouseUnitCost = inHouseMaterialCost + inHouseLaborCost + inHouseOverhead + setupCostPerUnit;
  const inHouseTotalCost = inHouseUnitCost * annualVolume;
  const outsourceUnitCost = outsourceUnitPrice + outsourceLogisticsCost;
  const outsourceTotalCost = outsourceUnitCost * annualVolume;
  const capacityOppCost = (1 - capacityUtilizationPct / 100) * inHouseTotalCost * 0.3;
  const riskPremium = outsourceTotalCost * qualityRiskPremiumPct / 100;
  const riskAdjDelta = (inHouseTotalCost + capacityOppCost) - (outsourceTotalCost + riskPremium);
  const savingsPerUnit = riskAdjDelta / vol;

  const threshold = inHouseTotalCost * 0.1;
  let decisionFlag: number;
  if (riskAdjDelta <= -threshold) {
    decisionFlag = 0; // MAKE
  } else if (riskAdjDelta >= threshold) {
    decisionFlag = 1; // BUY
  } else {
    decisionFlag = 2; // REVIEW
  }

  return {
    out_evidenceCompleteness: sourceConfidence,
    out_normalizedDemand: annualVolume,
    out_referenceDeviation: qualityRiskPremiumPct / 100,
    out_deratingFactor: capacityUtilizationPct / 100,
    out_demandMetric: inHouseUnitCost,
    out_capacityMetric: outsourceUnitCost,
    out_utilizationMargin: capacityUtilizationPct / 100,
    out_expandedUncertainty: 1 - sourceConfidence,
    out_thresholdCrossing: decisionFlag,
    out_sensitivityDriver: Math.max(inHouseMaterialCost, inHouseLaborCost, inHouseOverhead, outsourceUnitPrice),
    out_fmeaTrigger: decisionFlag === 2 ? 1 : 0,
    out_moneyAtRisk: Math.abs(riskAdjDelta),
    out_scenarioDelta: savingsPerUnit,
    out_auditHashPayload: annualVolume + sourceConfidence,
    out_finalDecisionState: decisionFlag,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: OutsourceVsInHouseInputs,
  driver: keyof OutsourceVsInHouseInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_moneyAtRisk;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_moneyAtRisk;
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
  "out_evidenceCompleteness", "out_normalizedDemand", "out_referenceDeviation",
  "out_deratingFactor", "out_demandMetric", "out_capacityMetric",
  "out_utilizationMargin", "out_expandedUncertainty", "out_thresholdCrossing",
  "out_sensitivityDriver", "out_fmeaTrigger", "out_moneyAtRisk",
  "out_scenarioDelta", "out_auditHashPayload", "out_finalDecisionState",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: OutsourceVsInHouseInputs = {
    inHouseMaterialCost: get(inputs, "n_in_house_material_cost"),
    inHouseLaborCost: get(inputs, "n_in_house_labor_cost"),
    inHouseOverhead: get(inputs, "n_in_house_overhead"),
    inHouseSetupCost: get(inputs, "n_in_house_setup_cost"),
    outsourceUnitPrice: get(inputs, "n_outsource_unit_price"),
    outsourceLogisticsCost: get(inputs, "n_outsource_logistics_cost"),
    annualVolume: get(inputs, "n_annual_volume"),
    qualityRiskPremiumPct: get(inputs, "n_quality_risk_premium_pct"),
    capacityUtilizationPct: get(inputs, "n_capacity_utilization_pct"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = [
    "n_in_house_material_cost", "n_in_house_labor_cost", "n_in_house_overhead",
    "n_outsource_unit_price", "n_annual_volume",
  ] as const;
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

export const toolKey = "outsource-vs-in-house-analyzer";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_in_house_material_cost: 12.5,
  n_in_house_labor_cost: 8.0,
  n_in_house_overhead: 4.5,
  n_in_house_setup_cost: 5000,
  n_outsource_unit_price: 18.0,
  n_outsource_logistics_cost: 2.5,
  n_annual_volume: 10000,
  n_quality_risk_premium_pct: 5,
  n_capacity_utilization_pct: 75,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_in_house_material_cost", "n_in_house_labor_cost", "n_in_house_overhead",
  "n_in_house_setup_cost", "n_outsource_unit_price", "n_outsource_logistics_cost",
  "n_annual_volume", "n_quality_risk_premium_pct", "n_capacity_utilization_pct",
  "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
