// @server-only
/**
 * Motor Compressor Replacement ROI — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface MotorCompressorInputs {
  motorPowerKw: number;
  annualOperatingHours: number;
  currentEfficiencyPct: number;
  newEfficiencyPct: number;
  avgKwhRate: number;
  replacementCost: number;
  installationCost: number;
  maintenanceSavingPerYear: number;
  equipmentLifeYears: number;
  discountRate: number;
  sourceConfidence: number;
}

export interface MotorCompressorOutputs {
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
  out_finalDecisionState: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: MotorCompressorInputs): MotorCompressorOutputs {
  const {
    motorPowerKw, annualOperatingHours, currentEfficiencyPct, newEfficiencyPct,
    avgKwhRate, replacementCost, installationCost, maintenanceSavingPerYear,
    equipmentLifeYears, discountRate, sourceConfidence,
  } = inputs;

  const currentEff = currentEfficiencyPct / 100;
  const newEff = newEfficiencyPct / 100;
  const life = Math.max(1, Math.round(equipmentLifeYears));

  const currentKwh = currentEff > 0 ? motorPowerKw * annualOperatingHours / currentEff : 0;
  const newKwh = newEff > 0 ? motorPowerKw * annualOperatingHours / newEff : 0;
  const currentEnergyCost = currentKwh * avgKwhRate;
  const newEnergyCost = newKwh * avgKwhRate;
  const annualSaving = currentEnergyCost - newEnergyCost + maintenanceSavingPerYear;
  const totalInvestment = replacementCost + installationCost;
  const paybackMonths = annualSaving > 0 ? totalInvestment / annualSaving * 12 : 999;

  let npv = 0;
  for (let y = 1; y <= life; y++) {
    npv += annualSaving / Math.pow(1 + discountRate, y);
  }
  npv -= totalInvestment;

  const roiPct = totalInvestment > 0 ? (npv / totalInvestment) * 100 : 0;
  const decision = paybackMonths <= 24 || npv > 0 ? 0 : (paybackMonths <= 48 ? 1 : 2);

  return {
    out_evidenceCompleteness: sourceConfidence,
    out_normalizedDemand: annualOperatingHours,
    out_referenceDeviation: currentEff - newEff,
    out_deratingFactor: sourceConfidence,
    out_demandMetric: currentEnergyCost,
    out_capacityMetric: newEnergyCost,
    out_utilizationMargin: annualSaving,
    out_expandedUncertainty: maintenanceSavingPerYear * 0.1,
    out_thresholdCrossing: paybackMonths <= 48 ? 1 : 0,
    out_sensitivityDriver: currentEnergyCost > replacementCost ? 1 : 0,
    out_fmeaTrigger: paybackMonths > 24 ? 1 : 0,
    out_moneyAtRisk: totalInvestment,
    out_scenarioDelta: paybackMonths,
    out_finalDecisionState: decision,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: MotorCompressorInputs,
  driver: keyof MotorCompressorInputs,
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
  "out_scenarioDelta", "out_finalDecisionState",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: MotorCompressorInputs = {
    motorPowerKw: get(inputs, "n_motor_power_kw"),
    annualOperatingHours: get(inputs, "n_annual_operating_hours"),
    currentEfficiencyPct: get(inputs, "n_current_efficiency_pct"),
    newEfficiencyPct: get(inputs, "n_new_efficiency_pct"),
    avgKwhRate: get(inputs, "n_avg_kwh_rate"),
    replacementCost: get(inputs, "n_replacement_cost"),
    installationCost: get(inputs, "n_installation_cost"),
    maintenanceSavingPerYear: get(inputs, "n_maintenance_saving_per_year"),
    equipmentLifeYears: get(inputs, "n_equipment_life_years"),
    discountRate: get(inputs, "n_discount_rate"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_motor_power_kw", "n_current_efficiency_pct", "n_new_efficiency_pct"] as const;
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

export const toolKey = "motor-compressor-replacement-roi";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_motor_power_kw: 150,
  n_annual_operating_hours: 8000,
  n_current_efficiency_pct: 88,
  n_new_efficiency_pct: 95,
  n_avg_kwh_rate: 0.12,
  n_replacement_cost: 45000,
  n_installation_cost: 8500,
  n_maintenance_saving_per_year: 3000,
  n_equipment_life_years: 10,
  n_discount_rate: 0.08,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [
  "n_motor_power_kw", "n_annual_operating_hours", "n_current_efficiency_pct",
  "n_new_efficiency_pct", "n_avg_kwh_rate", "n_replacement_cost",
  "n_installation_cost", "n_maintenance_saving_per_year",
  "n_equipment_life_years", "n_discount_rate", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
