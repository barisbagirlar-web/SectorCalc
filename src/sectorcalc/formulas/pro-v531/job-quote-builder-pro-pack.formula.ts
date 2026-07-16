// @server-only
/**
 * Job Quote Builder Pro Pack — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed JobQuoteInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface JobQuoteInputs {
  machineRate: number;             // Machine hourly rate (canonical currency/hour)
  cycleTime: number;               // Cycle time per batch (canonical minutes)
  setupTime: number;               // Setup time per batch (canonical minutes)
  materialCost: number;            // Material cost per unit (canonical currency/unit)
  targetMargin: number;            // Target margin ratio (e.g. 0.25 = 25%)
  batchQuantity: number;           // Batch quantity (units)
  annualVolume: number;            // Annual production volume (units/year)
  laborRate: number;               // Labor hourly rate (canonical currency/hour)
  overheadRate: number;            // Annual overhead (canonical currency/year)
  defectOrLossCost: number;        // Estimated defect/scrap cost (canonical currency)
  sourceConfidence: number;        // Source confidence ratio (0..1)
  uncertaintyMultiplier: number;   // Uncertainty multiplier (0..1+)
}

export interface JobQuoteOutputs {
  out_laborCost: number;
  out_machineCost: number;
  out_materialCostTotal: number;
  out_scrapAllowance: number;
  out_overheadAllocation: number;
  out_totalJobCost: number;
  out_markupMultiplier: number;
  out_recommendedPrice: number;
  out_riskAdjustedPrice: number;
  out_marginPct: number;
  out_thresholdCrossing: number;
  out_decisionState: number;
  out_fmeaTrigger: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: JobQuoteInputs): JobQuoteOutputs {
  const {
    machineRate, cycleTime, setupTime, materialCost,
    targetMargin, batchQuantity, annualVolume, laborRate,
    overheadRate,     defectOrLossCost, /* sourceConfidence */
    uncertaintyMultiplier,
  } = inputs;

  const tc = cycleTime + setupTime;
  const lc = laborRate * tc / 60;
  const mac = machineRate * tc / 60;
  const sc = defectOrLossCost * 0.1;
  const matTotal = materialCost * batchQuantity;
  const oa = annualVolume > 0 ? overheadRate / annualVolume * batchQuantity : 0;
  const tjc = lc + mac + matTotal + sc + oa;
  const mu = 1 + targetMargin;
  const rp = tjc * mu;
  const ra = rp * (1 + uncertaintyMultiplier * 0.1);
  const mp = ra > 0 ? (ra - tjc) / ra : 0;

  const out_laborCost = lc;
  const out_machineCost = mac;
  const out_materialCostTotal = matTotal;
  const out_scrapAllowance = sc;
  const out_overheadAllocation = oa;
  const out_totalJobCost = tjc;
  const out_markupMultiplier = mu;
  const out_recommendedPrice = rp;
  const out_riskAdjustedPrice = ra;
  const out_marginPct = mp;
  const out_thresholdCrossing = mp >= targetMargin ? 0 : 1;
  const out_decisionState = mp >= targetMargin ? 0 : (mp >= targetMargin * 0.5 ? 1 : 2);
  const out_fmeaTrigger = mp < targetMargin * 0.5 ? 1 : 0;

  return {
    out_laborCost,
    out_machineCost,
    out_materialCostTotal,
    out_scrapAllowance,
    out_overheadAllocation,
    out_totalJobCost,
    out_markupMultiplier,
    out_recommendedPrice,
    out_riskAdjustedPrice,
    out_marginPct,
    out_thresholdCrossing,
    out_decisionState,
    out_fmeaTrigger,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: JobQuoteInputs,
  driver: keyof JobQuoteInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_totalJobCost;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_totalJobCost;
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
  "out_laborCost", "out_machineCost", "out_materialCostTotal",
  "out_scrapAllowance", "out_overheadAllocation", "out_totalJobCost",
  "out_markupMultiplier", "out_recommendedPrice", "out_riskAdjustedPrice",
  "out_marginPct", "out_thresholdCrossing", "out_decisionState",
  "out_fmeaTrigger",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: JobQuoteInputs = {
    machineRate: get(inputs, "n_machine_rate"),
    cycleTime: get(inputs, "n_cycle_time"),
    setupTime: get(inputs, "n_setup_time"),
    materialCost: get(inputs, "n_material_cost"),
    targetMargin: get(inputs, "n_target_margin"),
    batchQuantity: get(inputs, "n_batch_quantity"),
    annualVolume: get(inputs, "n_annual_volume"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    defectOrLossCost: get(inputs, "n_defect_or_loss_cost"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
    uncertaintyMultiplier: get(inputs, "n_uncertainty_multiplier"),
  };

  const mandatory = ["n_machine_rate", "n_cycle_time", "n_material_cost", "n_batch_quantity"] as const;
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

export const toolKey = "job-quote-builder-pro-pack";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_machine_rate: 85,
  n_cycle_time: 12,
  n_setup_time: 8,
  n_material_cost: 45,
  n_target_margin: 0.25,
  n_batch_quantity: 500,
  n_annual_volume: 12000,
  n_labor_rate: 35,
  n_overhead_rate: 60000,
  n_defect_or_loss_cost: 1500,
  n_source_confidence_ratio: 0.85,
  n_uncertainty_multiplier: 0.15,
};

export const requiredInputKeys: readonly string[] = [
  "n_machine_rate", "n_cycle_time", "n_setup_time", "n_material_cost",
  "n_target_margin", "n_batch_quantity", "n_annual_volume",
  "n_labor_rate", "n_overhead_rate", "n_defect_or_loss_cost",
  "n_source_confidence_ratio", "n_uncertainty_multiplier",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
