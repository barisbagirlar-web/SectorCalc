// @server-only
/**
 * Product SKU Margin Ranker — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function. Isomorphic.
 *
 * Replaces a version with three real dimensional bugs, found by reading the
 * schema's actual base_unit fields directly (never trust code comments —
 * this file's own comments claimed cycle_time was in minutes, labor_rate
 * was currency/unit, and overhead_rate was an annual lump sum; the schema
 * says cycle_time is seconds, labor_rate and overhead_rate are both
 * currency/HOUR):
 *
 *  1. cycleTime / 60 treated the canonical seconds value as minutes — a 60x
 *     scale error on every hour-rate cost component.
 *  2. overheadRate / annualVolume treated an hourly RATE as an annual lump
 *     sum to be divided by volume — completely the wrong operation (should
 *     be rate x cycle-hours, like labor and machine cost).
 *  3. defectOrLossCost / annualVolume treated an already-per-unit cost
 *     (schema label: "Unit Loss Cost") as an annual total needing division.
 *
 * Combined, these bugs produced a >100x cost error: the base-case example
 * below used to compute a total unit cost of ~$7,892; the corrected
 * dimensionally-sound formula computes $57.33 for the identical inputs
 * (verified by execution, not asserted).
 *
 * setupTime was declared in the schema but never read at all (same missing-
 * input defect found in loss-making-job-detector this session) — now used,
 * amortized across batchQuantity.
 *
 * annual_volume's schema base_unit is units PER SECOND, not units/year
 * (same convention trap caught in loss-making-job-detector) — every
 * annualized output multiplies by 31,536,000.
 *
 * Verified by standalone execution against 7 checks before shipping: total
 * cost per unit matches independent hand arithmetic exactly; annual profit
 * contribution matches hand arithmetic exactly; a below-cost price is
 * correctly flagged loss-making (verdict=2) with money-at-risk matching
 * hand arithmetic exactly; a margin-exceeding price verdicts 0;
 * batchQuantity=0 and unitSellingPrice=0 never produce non-finite output;
 * targetMargin=1 is guarded explicitly; cost confirmed monotonically
 * increasing in machineRate; cycleTime=0 correctly zeroes machine/labor/
 * overhead cost while leaving material/defect/setup intact.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

const SECONDS_PER_YEAR = 31536000;

// ─── Type exports ───────────────────────────────────────────────────────────

export interface ProductSkuMarginInputs {
  unitSellingPrice: number; // Selling price per unit (canonical currency)
  machineRate: number;      // Machine hourly rate (canonical currency/h)
  cycleTime: number;        // Per-unit cycle time (canonical seconds)
  setupTime: number;        // Batch setup time (canonical seconds)
  batchQuantity: number;    // Units in the batch (count)
  materialCost: number;     // Material cost per unit (canonical currency)
  targetMargin: number;     // Target contribution margin (ratio, e.g. 0.30)
  annualVolume: number;     // Production rate — canonical units PER SECOND
  laborRate: number;        // Labor hourly rate (canonical currency/h)
  overheadRate: number;     // Overhead hourly rate (canonical currency/h)
  defectOrLossCost: number; // Defect/scrap cost per unit (canonical currency)
  sourceConfidence: number; // Source confidence ratio (0..1)
}

export interface ProductSkuMarginOutputs {
  out_machine_cost_component: number;
  out_labor_cost_component: number;
  out_overhead_cost_component: number;
  out_material_defect_cost_component: number;
  out_setup_cost_component: number;
  out_total_cost_per_unit: number;
  out_gross_margin_per_unit: number;
  out_contribution_margin_pct: number;
  out_minimum_acceptable_price: number;
  out_annual_profit_contribution: number;
  out_money_at_risk: number;
  out_verdict: number;
  out_evidence_completeness: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inp: ProductSkuMarginInputs): ProductSkuMarginOutputs {
  const hoursCycle = inp.cycleTime / 3600;
  const hoursSetup = inp.setupTime / 3600;

  const machineCost = inp.machineRate * hoursCycle;
  const laborCost = inp.laborRate * hoursCycle;
  const overheadCost = inp.overheadRate * hoursCycle;
  const setupCostTotal = (inp.machineRate + inp.laborRate) * hoursSetup;
  const setupCostPerUnit = inp.batchQuantity > 0 ? setupCostTotal / inp.batchQuantity : setupCostTotal;
  const materialDefectCost = inp.materialCost + inp.defectOrLossCost;

  const totalCostPerUnit = machineCost + laborCost + overheadCost + setupCostPerUnit + materialDefectCost;

  const grossMarginPerUnit = inp.unitSellingPrice - totalCostPerUnit;
  const contributionMarginPct = inp.unitSellingPrice > 0 ? grossMarginPerUnit / inp.unitSellingPrice : 0;
  const minAcceptablePrice = inp.targetMargin < 1 ? totalCostPerUnit / (1 - inp.targetMargin) : totalCostPerUnit;

  const annualVolumeUnitsPerYear = inp.annualVolume * SECONDS_PER_YEAR;
  const annualProfitContribution = grossMarginPerUnit * annualVolumeUnitsPerYear;

  const lossPerUnit = grossMarginPerUnit < 0 ? -grossMarginPerUnit : 0;
  const moneyAtRisk = lossPerUnit * annualVolumeUnitsPerYear;

  const verdict = contributionMarginPct >= inp.targetMargin ? 0 : grossMarginPerUnit > 0 ? 1 : 2;

  return {
    out_machine_cost_component: machineCost,
    out_labor_cost_component: laborCost,
    out_overhead_cost_component: overheadCost,
    out_material_defect_cost_component: materialDefectCost,
    out_setup_cost_component: setupCostPerUnit,
    out_total_cost_per_unit: totalCostPerUnit,
    out_gross_margin_per_unit: grossMarginPerUnit,
    out_contribution_margin_pct: contributionMarginPct,
    out_minimum_acceptable_price: minAcceptablePrice,
    out_annual_profit_contribution: annualProfitContribution,
    out_money_at_risk: moneyAtRisk,
    out_verdict: verdict,
    out_evidence_completeness: 1,
  };
}

// ─── Sensitivity helper (kept for parity with the prior version) ───────────

export function sensitivity(
  inputs: ProductSkuMarginInputs,
  driver: keyof ProductSkuMarginInputs,
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

const REQUIRED_KEYS = [
  "n_unit_selling_price", "n_machine_rate", "n_cycle_time", "n_setup_time",
  "n_batch_quantity", "n_material_cost", "n_target_margin", "n_annual_volume",
  "n_labor_rate", "n_overhead_rate", "n_defect_or_loss_cost",
  "n_source_confidence_ratio",
] as const;

const OUTPUT_KEYS: readonly string[] = [
  "out_machine_cost_component", "out_labor_cost_component", "out_overhead_cost_component",
  "out_material_defect_cost_component", "out_setup_cost_component", "out_total_cost_per_unit",
  "out_gross_margin_per_unit", "out_contribution_margin_pct", "out_minimum_acceptable_price",
  "out_annual_profit_contribution", "out_money_at_risk", "out_verdict", "out_evidence_completeness",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  let presentCount = 0;
  for (const key of REQUIRED_KEYS) {
    if (isFiniteNumber(inputs[key])) presentCount += 1;
    else warnings.push('Input "' + key + '" is missing or invalid - using 0');
  }

  const typed: ProductSkuMarginInputs = {
    unitSellingPrice: get(inputs, "n_unit_selling_price"),
    machineRate: get(inputs, "n_machine_rate"),
    cycleTime: get(inputs, "n_cycle_time"),
    setupTime: get(inputs, "n_setup_time"),
    batchQuantity: get(inputs, "n_batch_quantity"),
    materialCost: get(inputs, "n_material_cost"),
    targetMargin: get(inputs, "n_target_margin"),
    annualVolume: get(inputs, "n_annual_volume"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    defectOrLossCost: get(inputs, "n_defect_or_loss_cost"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  if (typed.unitSellingPrice <= 0) warnings.push("Unit selling price must be greater than 0 for a meaningful comparison");

  const raw = executeFormula(typed) as unknown as Record<string, number>;
  const outputs: Record<string, number> = {};
  for (const key of OUTPUT_KEYS) {
    outputs[key] = key === "out_evidence_completeness"
      ? presentCount / REQUIRED_KEYS.length
      : raw[key];
  }

  const finite = OUTPUT_KEYS.every((k) => isFiniteNumber(outputs[k]));
  const allRequiredPresent = presentCount === REQUIRED_KEYS.length;
  let status: "OK" | "REVIEW" | "BLOCKED" = finite ? "OK" : "REVIEW";
  if (warnings.length > 0) status = "REVIEW";
  if (typed.unitSellingPrice <= 0 || !allRequiredPresent) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "product-sku-margin-ranker";
export const formulaVersion = "5.3.2-domain.1";

export const sampleInputs: Record<string, number> = {
  n_unit_selling_price: 65,
  n_machine_rate: 85,
  n_cycle_time: 720,
  n_setup_time: 1800,
  n_batch_quantity: 200,
  n_material_cost: 25,
  n_target_margin: 0.30,
  n_annual_volume: 100000 / 31536000,
  n_labor_rate: 45,
  n_overhead_rate: 20,
  n_defect_or_loss_cost: 2,
  n_source_confidence_ratio: 0.9,
};

export const requiredInputKeys: readonly string[] = [...REQUIRED_KEYS];
export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];

const proModule: ProFormulaModule = {
  toolKey,
  formulaVersion,
  calculate,
  sampleInputs,
  requiredInputKeys,
  declaredOutputKeys,
};

export default proModule;
