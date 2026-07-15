/**
 * Plant-Wide Shop Rate Cost Structure Audit — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Conforms to ProFormulaModule contract.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface PlantWideShopRateInputs {
  totalAnnualCost: number;
  totalProductiveHours: number;
  machineGroupCost: number;
  machineGroupHours: number;
  overheadPool: number;
  overheadAllocationBase: number;
  currentShopRate: number;
  targetMarginPct: number;
  utilizationPct: number;
  sourceConfidence: number;
}

export interface PlantWideShopRateOutputs {
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

export function executeFormula(inputs: PlantWideShopRateInputs): PlantWideShopRateOutputs {
  const {
    totalAnnualCost, totalProductiveHours, machineGroupCost, machineGroupHours,
    overheadPool, overheadAllocationBase, currentShopRate,
    targetMarginPct, utilizationPct, sourceConfidence,
  } = inputs;

  const ph = Math.max(totalProductiveHours, 1);
  const mgh = Math.max(machineGroupHours, 1);
  const oab = Math.max(overheadAllocationBase, 1);

  const plantWideRate = totalAnnualCost / ph;
  const machineGroupRate = machineGroupCost / mgh;
  const overheadAbsRate = overheadPool / oab;
  const underRecovery = plantWideRate - (plantWideRate * utilizationPct / 100);
  const pricingFloor = plantWideRate * (1 + targetMarginPct / 100);
  const moneyAtRisk = underRecovery * totalProductiveHours;

  let decisionFlag: number;
  if (currentShopRate >= pricingFloor) {
    decisionFlag = 0; // OK
  } else if (currentShopRate > 0 && currentShopRate < pricingFloor) {
    decisionFlag = 1; // REPRICE
  } else {
    decisionFlag = 2; // REVIEW
  }

  return {
    out_evidenceCompleteness: sourceConfidence,
    out_normalizedDemand: totalProductiveHours,
    out_referenceDeviation: utilizationPct / 100,
    out_deratingFactor: plantWideRate > 0 ? underRecovery / plantWideRate : 0,
    out_demandMetric: plantWideRate,
    out_capacityMetric: machineGroupRate,
    out_utilizationMargin: utilizationPct / 100,
    out_expandedUncertainty: overheadAbsRate,
    out_thresholdCrossing: decisionFlag,
    out_sensitivityDriver: Math.max(plantWideRate, machineGroupRate, overheadAbsRate),
    out_fmeaTrigger: decisionFlag === 2 ? 1 : 0,
    out_moneyAtRisk: Math.max(moneyAtRisk, 0),
    out_scenarioDelta: pricingFloor - currentShopRate,
    out_auditHashPayload: totalProductiveHours + sourceConfidence,
    out_finalDecisionState: decisionFlag,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: PlantWideShopRateInputs,
  driver: keyof PlantWideShopRateInputs,
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

  const typed: PlantWideShopRateInputs = {
    totalAnnualCost: get(inputs, "n_total_annual_cost"),
    totalProductiveHours: get(inputs, "n_total_productive_hours"),
    machineGroupCost: get(inputs, "n_machine_group_cost"),
    machineGroupHours: get(inputs, "n_machine_group_hours"),
    overheadPool: get(inputs, "n_overhead_pool"),
    overheadAllocationBase: get(inputs, "n_overhead_allocation_base"),
    currentShopRate: get(inputs, "n_current_shop_rate"),
    targetMarginPct: get(inputs, "n_target_margin_pct"),
    utilizationPct: get(inputs, "n_utilization_pct"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = [
    "n_total_annual_cost", "n_total_productive_hours",
    "n_machine_group_cost", "n_overhead_pool",
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

export const toolKey = "plant-wide-shop-rate-cost-structure-audit";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_total_annual_cost: 1200000,
  n_total_productive_hours: 32000,
  n_machine_group_cost: 450000,
  n_machine_group_hours: 12000,
  n_overhead_pool: 380000,
  n_overhead_allocation_base: 32000,
  n_current_shop_rate: 65,
  n_target_margin_pct: 15,
  n_utilization_pct: 78,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_total_annual_cost", "n_total_productive_hours", "n_machine_group_cost",
  "n_machine_group_hours", "n_overhead_pool", "n_overhead_allocation_base",
  "n_current_shop_rate", "n_target_margin_pct", "n_utilization_pct",
  "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
