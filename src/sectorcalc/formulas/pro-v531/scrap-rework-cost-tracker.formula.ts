/**
 * Scrap & Rework Cost Tracker — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed ScrapReworkInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface ScrapReworkInputs {
  totalProduced: number;       // Total units produced in period (canonical count)
  scrapQuantity: number;       // Units scrapped (count)
  reworkQuantity: number;      // Units sent to rework (count)
  unitMaterialCost: number;    // Material cost per good unit (canonical currency/unit)
  unitLaborCost: number;       // Direct labor cost per good unit (canonical currency/unit)
  reworkLaborRate: number;     // Rework labor hourly rate (canonical currency/hour)
  reworkTimePerUnit: number;   // Rework hours per unit (canonical hours)
  defectRateTargetPct: number; // Target defect rate (canonical %, e.g. 2 = 2%)
  monthlyVolume: number;       // Monthly production volume (count/month)
  sourceConfidence: number;    // Source confidence ratio (0..1)
}

export interface ScrapReworkOutputs {
  out_scrapCost: number;
  out_reworkCost: number;
  out_totalDefectUnits: number;
  out_defectCostPerUnit: number;
  out_monthlyQualityLoss: number;
  out_defectRate: number;
  out_primaryDriver: number;    // 0 = scrap dominant, 1 = rework dominant
  out_decisionState: number;    // 0 = ok, 1 = exceed rate but cost low, 2 = exceed rate and cost high
  out_thresholdCrossing: number;
  out_fmeaTrigger: number;
  out_moneyAtRisk: number;
  out_referenceDeviation: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: ScrapReworkInputs): ScrapReworkOutputs {
  const {
    totalProduced, scrapQuantity, reworkQuantity,
    unitMaterialCost, unitLaborCost, reworkLaborRate,
    reworkTimePerUnit, defectRateTargetPct, monthlyVolume,
    sourceConfidence,
  } = inputs;

  const out_scrapCost = scrapQuantity * (unitMaterialCost + unitLaborCost);
  const out_reworkCost = reworkQuantity * reworkLaborRate * reworkTimePerUnit;
  const out_totalDefectUnits = scrapQuantity + reworkQuantity;
  const totalCost = out_scrapCost + out_reworkCost;

  const out_defectCostPerUnit = out_totalDefectUnits > 0
    ? totalCost / out_totalDefectUnits
    : NaN;

  const out_monthlyQualityLoss = totalProduced > 0
    ? totalCost * (monthlyVolume / totalProduced)
    : NaN;

  const out_defectRate = totalProduced > 0
    ? out_totalDefectUnits / totalProduced
    : NaN;

  const out_primaryDriver = out_scrapCost > out_reworkCost ? 0 : 1;

  const target = defectRateTargetPct / 100;
  const exceedTarget = isFinite(out_defectRate) && out_defectRate > target;
  const highCostPerUnit = isFinite(out_defectCostPerUnit) &&
    out_defectCostPerUnit > unitMaterialCost * 0.5;

  const out_decisionState = !exceedTarget ? 0 : (highCostPerUnit ? 2 : 1);
  const out_thresholdCrossing = exceedTarget ? 1 : 0;
  const out_fmeaTrigger = isFinite(out_defectRate) && out_defectRate > 0.05 ? 1 : 0;
  const out_moneyAtRisk = totalCost;
  const out_referenceDeviation = isFinite(out_defectRate) ? out_defectRate : NaN;

  return {
    out_scrapCost,
    out_reworkCost,
    out_totalDefectUnits,
    out_defectCostPerUnit,
    out_monthlyQualityLoss,
    out_defectRate,
    out_primaryDriver,
    out_decisionState,
    out_thresholdCrossing,
    out_fmeaTrigger,
    out_moneyAtRisk,
    out_referenceDeviation,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: ScrapReworkInputs,
  driver: keyof ScrapReworkInputs,
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
  "out_scrapCost", "out_reworkCost", "out_totalDefectUnits",
  "out_defectCostPerUnit", "out_monthlyQualityLoss", "out_defectRate",
  "out_primaryDriver", "out_decisionState", "out_thresholdCrossing",
  "out_fmeaTrigger", "out_moneyAtRisk", "out_referenceDeviation",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: ScrapReworkInputs = {
    totalProduced: get(inputs, "n_total_produced"),
    scrapQuantity: get(inputs, "n_scrap_quantity"),
    reworkQuantity: get(inputs, "n_rework_quantity"),
    unitMaterialCost: get(inputs, "n_unit_material_cost"),
    unitLaborCost: get(inputs, "n_unit_labor_cost"),
    reworkLaborRate: get(inputs, "n_rework_labor_rate"),
    reworkTimePerUnit: get(inputs, "n_rework_time_per_unit"),
    defectRateTargetPct: get(inputs, "n_defect_rate_target_pct"),
    monthlyVolume: get(inputs, "n_monthly_volume"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_total_produced", "n_scrap_quantity", "n_rework_quantity"] as const;
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

export const toolKey = "scrap-rework-cost-tracker";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_total_produced: 10000,
  n_scrap_quantity: 150,
  n_rework_quantity: 80,
  n_unit_material_cost: 25,
  n_unit_labor_cost: 15,
  n_rework_labor_rate: 45,
  n_rework_time_per_unit: 0.5,
  n_defect_rate_target_pct: 2.0,
  n_monthly_volume: 10000,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [
  "n_total_produced", "n_scrap_quantity", "n_rework_quantity",
  "n_unit_material_cost", "n_unit_labor_cost", "n_rework_labor_rate",
  "n_rework_time_per_unit", "n_defect_rate_target_pct", "n_monthly_volume",
  "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
