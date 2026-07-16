// @server-only
/**
 * Energy Efficiency Grant & Incentive Feasibility Pack — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Conforms to ProFormulaModule contract.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface EnergyEfficiencyInputs {
  currentKwhPerYear: number;
  targetKwhPerYear: number;
  avgKwhRate: number;
  implementationCost: number;
  grantCoveragePct: number;
  maintenanceCostSaving: number;
  emissionFactorKgCo2PerKwh: number;
  equipmentLifeYears: number;
  discountRate: number;
  sourceConfidence: number;
}

export interface EnergyEfficiencyOutputs {
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

export function executeFormula(inputs: EnergyEfficiencyInputs): EnergyEfficiencyOutputs {
  const {
    currentKwhPerYear, targetKwhPerYear, avgKwhRate,
    implementationCost, grantCoveragePct, maintenanceCostSaving,
    emissionFactorKgCo2PerKwh, equipmentLifeYears, discountRate, sourceConfidence,
  } = inputs;

  const kwhSaving = currentKwhPerYear - targetKwhPerYear;
  const moneySaving = kwhSaving * avgKwhRate + maintenanceCostSaving;
  const grantAmount = implementationCost * grantCoveragePct;
  const netCost = implementationCost - grantAmount;
  const payback = netCost > 0 ? netCost / moneySaving : 0;
  const totalSaving5yr = moneySaving * 5;
  const roi = netCost > 0 ? (totalSaving5yr - netCost) / netCost * 100 : 999;
  const co2Saving = kwhSaving * emissionFactorKgCo2PerKwh / 1000;

  let decision: number;
  if (payback <= 3) {
    decision = 0; // PROCEED
  } else if (payback <= 5) {
    decision = 1; // REVIEW
  } else {
    decision = 2; // HOLD
  }

  const demandMetric = currentKwhPerYear * (avgKwhRate / 10);
  const refDev = currentKwhPerYear > 0 ? (currentKwhPerYear - targetKwhPerYear) / currentKwhPerYear : 0;
  const derating = 1 - (payback / 10) * (1 - sourceConfidence);
  const capacityMetric = implementationCost > 0 ? moneySaving / implementationCost : 0;
  const utilizationMargin = netCost > 0 ? totalSaving5yr / netCost : 0;
  const uncertainty = (payback * (1 - sourceConfidence)) / 2;

  let threshold = 0;
  if (payback <= 3) threshold = 1;
  if (payback > 5) threshold = -1;

  const drivers = [
    Math.abs(kwhSaving), Math.abs(avgKwhRate),
    Math.abs(implementationCost), Math.abs(grantCoveragePct),
  ];
  const maxDriver = Math.max(...drivers);
  const driverIdx = drivers.indexOf(maxDriver);

  let fmeaTrigger = 0;
  if (decision === 1) fmeaTrigger = 1;
  if (payback > 10) fmeaTrigger += 2;
  if (grantCoveragePct > 0.8) fmeaTrigger += 4;

  const moneyAtRisk = Math.max(0, netCost - moneySaving * equipmentLifeYears);
  const scenarioDelta = roi - (netCost / 12);
  const hashSeed = payback * 1000 + roi * 10 + kwhSaving;
  const auditHash = Math.abs(hashSeed) % 1000000;

  return {
    out_evidenceCompleteness: sourceConfidence,
    out_normalizedDemand: demandMetric,
    out_referenceDeviation: Math.min(1, Math.max(0, refDev)),
    out_deratingFactor: Math.max(0, Math.min(1, derating)),
    out_demandMetric: demandMetric * sourceConfidence,
    out_capacityMetric: capacityMetric,
    out_utilizationMargin: utilizationMargin,
    out_expandedUncertainty: uncertainty,
    out_thresholdCrossing: threshold,
    out_sensitivityDriver: driverIdx,
    out_fmeaTrigger: fmeaTrigger,
    out_moneyAtRisk: moneyAtRisk,
    out_scenarioDelta: scenarioDelta,
    out_auditHashPayload: auditHash,
    out_finalDecisionState: decision,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: EnergyEfficiencyInputs,
  driver: keyof EnergyEfficiencyInputs,
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

  const typed: EnergyEfficiencyInputs = {
    currentKwhPerYear: get(inputs, "n_current_kwh_per_year"),
    targetKwhPerYear: get(inputs, "n_target_kwh_per_year"),
    avgKwhRate: get(inputs, "n_avg_kwh_rate"),
    implementationCost: get(inputs, "n_implementation_cost"),
    grantCoveragePct: get(inputs, "n_grant_coverage_pct"),
    maintenanceCostSaving: get(inputs, "n_maintenance_cost_saving"),
    emissionFactorKgCo2PerKwh: get(inputs, "n_emission_factor_kgco2_per_kwh"),
    equipmentLifeYears: get(inputs, "n_equipment_life_years"),
    discountRate: get(inputs, "n_discount_rate"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = [
    "n_current_kwh_per_year", "n_target_kwh_per_year",
    "n_avg_kwh_rate", "n_implementation_cost",
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

export const toolKey = "energy-efficiency-grant-incentive-feasibility-pack";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_current_kwh_per_year: 500000,
  n_target_kwh_per_year: 350000,
  n_avg_kwh_rate: 0.14,
  n_implementation_cost: 120000,
  n_grant_coverage_pct: 0.35,
  n_maintenance_cost_saving: 5000,
  n_emission_factor_kgco2_per_kwh: 0.45,
  n_equipment_life_years: 15,
  n_discount_rate: 0.06,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_current_kwh_per_year", "n_target_kwh_per_year", "n_avg_kwh_rate",
  "n_implementation_cost", "n_grant_coverage_pct", "n_maintenance_cost_saving",
  "n_emission_factor_kgco2_per_kwh", "n_equipment_life_years",
  "n_discount_rate", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
