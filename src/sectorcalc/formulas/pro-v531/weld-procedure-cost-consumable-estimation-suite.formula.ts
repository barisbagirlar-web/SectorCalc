/**
 * Weld Procedure Cost & Consumable Estimation Suite — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface WeldProcedureInputs {
  weldLengthM: number;
  weldThroatMm: number;
  weldDensityGCm3: number;
  wireCostPerKg: number;
  gasCostPerMin: number;
  arcTimeMin: number;
  weldTimeMin: number;
  laborRate: number;
  overheadRate: number;
  depositionEfficiencyPct: number;
  sourceConfidence: number;
}

export interface WeldProcedureOutputs {
  out_totalCostFloor: number;
  out_baseProductionCost: number;
  out_costPerMeter: number;
  out_wireMassKg: number;
  out_wireCost: number;
  out_shieldingGasCost: number;
  out_laborCost: number;
  out_shopOverhead: number;
  out_consumableEfficiency: number;
  out_decisionState: number;
  out_evidenceCompleteness: number;
  out_expandedUncertainty: number;
  out_thresholdCrossing: number;
  out_sensitivityDriver: number;
  out_fmeaTrigger: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: WeldProcedureInputs): WeldProcedureOutputs {
  const {
    weldLengthM, weldThroatMm, weldDensityGCm3, wireCostPerKg,
    gasCostPerMin, arcTimeMin, weldTimeMin, laborRate, overheadRate,
    depositionEfficiencyPct, sourceConfidence,
  } = inputs;

  const depEff = depositionEfficiencyPct / 100;
  const throatM = weldThroatMm / 1000;
  const weldVolumeG = weldLengthM * (throatM * throatM) / 2 * weldDensityGCm3 * 1000;
  const wireNeeded = depEff > 0 ? weldVolumeG / depEff : 0;
  const consumableCost = wireNeeded / 1000 * wireCostPerKg;
  const gasCost = gasCostPerMin * arcTimeMin;
  const laborCost = laborRate * weldTimeMin / 60;
  const overheadCost = overheadRate * weldTimeMin / 60;
  const totalCost = consumableCost + gasCost + laborCost + overheadCost;
  const costPerMeter = weldLengthM > 0 ? totalCost / weldLengthM : 0;
  const decision = costPerMeter > 50 ? 1 : (costPerMeter > 20 ? 2 : 0);

  return {
    out_totalCostFloor: totalCost,
    out_baseProductionCost: totalCost - overheadCost,
    out_costPerMeter: costPerMeter,
    out_wireMassKg: wireNeeded / 1000,
    out_wireCost: consumableCost,
    out_shieldingGasCost: gasCost,
    out_laborCost: laborCost,
    out_shopOverhead: overheadCost,
    out_consumableEfficiency: depEff,
    out_decisionState: decision,
    out_evidenceCompleteness: sourceConfidence,
    out_expandedUncertainty: overheadCost * 0.1,
    out_thresholdCrossing: costPerMeter > 50 ? 1 : 0,
    out_sensitivityDriver: laborCost > consumableCost ? 1 : 0,
    out_fmeaTrigger: costPerMeter > 30 ? 1 : 0,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: WeldProcedureInputs,
  driver: keyof WeldProcedureInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_totalCostFloor;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_totalCostFloor;
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
  "out_totalCostFloor", "out_baseProductionCost", "out_costPerMeter",
  "out_wireMassKg", "out_wireCost", "out_shieldingGasCost",
  "out_laborCost", "out_shopOverhead", "out_consumableEfficiency",
  "out_decisionState", "out_evidenceCompleteness", "out_expandedUncertainty",
  "out_thresholdCrossing", "out_sensitivityDriver", "out_fmeaTrigger",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: WeldProcedureInputs = {
    weldLengthM: get(inputs, "n_weld_length_m"),
    weldThroatMm: get(inputs, "n_weld_throat_mm"),
    weldDensityGCm3: get(inputs, "n_weld_density_g_per_cm3"),
    wireCostPerKg: get(inputs, "n_wire_cost_per_kg"),
    gasCostPerMin: get(inputs, "n_gas_cost_per_min"),
    arcTimeMin: get(inputs, "n_arc_time_min"),
    weldTimeMin: get(inputs, "n_weld_time_min"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    depositionEfficiencyPct: get(inputs, "n_deposition_efficiency_pct"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_weld_length_m", "n_weld_throat_mm", "n_wire_cost_per_kg"] as const;
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

export const toolKey = "weld-procedure-cost-consumable-estimation-suite";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_weld_length_m: 10,
  n_weld_throat_mm: 6,
  n_weld_density_g_per_cm3: 7.85,
  n_wire_cost_per_kg: 8.5,
  n_gas_cost_per_min: 0.35,
  n_arc_time_min: 15,
  n_weld_time_min: 30,
  n_labor_rate: 65,
  n_overhead_rate: 25,
  n_deposition_efficiency_pct: 85,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [
  "n_weld_length_m", "n_weld_throat_mm", "n_weld_density_g_per_cm3",
  "n_wire_cost_per_kg", "n_gas_cost_per_min", "n_arc_time_min",
  "n_weld_time_min", "n_labor_rate", "n_overhead_rate",
  "n_deposition_efficiency_pct", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
