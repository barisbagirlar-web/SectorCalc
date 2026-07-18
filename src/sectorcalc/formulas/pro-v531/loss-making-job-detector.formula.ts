// @server-only
/**
 * Loss-Making Job Detector — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function. Isomorphic.
 *
 * Replaces the prior version, which computed correct internal values
 * (gross margin, contribution margin, minimum acceptable price) but then
 * discarded them into the generic 15-output "decision template" (out_
 * normalized_demand, out_capacity_metric, etc.) under names unrelated to
 * what they actually held. It also had a dimensional error: machineRate
 * and laborRate (currency/hour RATES) were added directly to materialCost
 * and defectOrLossCost (absolute currency AMOUNTS) as if all five were the
 * same unit. cycleTime and setupTime were declared in the schema but never
 * read by the formula at all.
 *
 * Fixed: machine/labor/overhead cost are now rate x (cycleTime in hours),
 * dimensionally consistent with their currency/hour units. Setup cost is
 * (machineRate + laborRate) x (setupTime in hours), amortized across the
 * batch. quotedJobPrice, materialCost, and defectOrLossCost are treated as
 * genuinely per-unit currency amounts, matching their schema labels.
 *
 * Verified by standalone execution against 7 checks before shipping: the
 * total-cost-per-unit result matches an independent hand calculation
 * exactly; a below-cost quote is correctly flagged loss-making (verdict=2)
 * with money-at-risk matching hand arithmetic exactly; a margin-exceeding
 * quote correctly verdicts 0; batchQuantity=0 and quotedJobPrice=0 never
 * produce non-finite output (no divide-by-zero); targetMargin=1 (its
 * upper bound) is guarded explicitly; cost is confirmed monotonically
 * increasing in machineRate; cycleTime=0 (a zero-touch-time job) correctly
 * zeroes machine/labor/overhead cost while leaving material/defect/setup
 * intact.
 *
 * annual_volume's schema base_unit is units PER SECOND (unit_per_s), not
 * units/year, despite its "Annual Decision Volume" label — confirmed by
 * reading the schema directly (a prior 2026-07-15 audit had already hit
 * this and fixed the sample-input fixture; this rewrite re-discovered and
 * fixed it in the formula itself, which had not accounted for it). The
 * money-at-risk output annualizes correctly by multiplying by 31,536,000.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface LossMakingJobInputs {
  quotedJobPrice: number;   // Quoted/planned price per unit (canonical currency)
  machineRate: number;      // Machine hourly rate (canonical currency/h)
  cycleTime: number;        // Per-unit cycle time (canonical seconds)
  setupTime: number;        // Batch setup time (canonical seconds)
  batchQuantity: number;    // Units in the batch (count)
  materialCost: number;     // Material cost per unit (canonical currency)
  laborRate: number;        // Labor hourly rate (canonical currency/h)
  overheadRate: number;     // Overhead hourly rate (canonical currency/h)
  defectOrLossCost: number; // Defect/scrap cost per unit (canonical currency)
  targetMargin: number;     // Target contribution margin (ratio, e.g. 0.25)
  annualVolume: number;     // Production rate — canonical units PER SECOND (schema base_unit
                             // is unit_per_s, not units/year; see SECONDS_PER_YEAR below)
  sourceConfidence: number; // Source confidence ratio (0..1)
}

const SECONDS_PER_YEAR = 31536000;

export interface LossMakingJobOutputs {
  out_machine_cost_component: number;
  out_labor_cost_component: number;
  out_overhead_cost_component: number;
  out_material_defect_cost_component: number;
  out_setup_cost_component: number;
  out_total_cost_per_unit: number;
  out_gross_margin_per_unit: number;
  out_contribution_margin_pct: number;
  out_minimum_acceptable_price: number;
  out_price_gap_to_target: number;
  out_money_at_risk: number;
  out_verdict: number;
  out_evidence_completeness: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inp: LossMakingJobInputs): LossMakingJobOutputs {
  const hoursCycle = inp.cycleTime / 3600;
  const hoursSetup = inp.setupTime / 3600;

  const machineCost = inp.machineRate * hoursCycle;
  const laborCost = inp.laborRate * hoursCycle;
  const overheadCost = inp.overheadRate * hoursCycle;
  const setupCostTotal = (inp.machineRate + inp.laborRate) * hoursSetup;
  const setupCostPerUnit = inp.batchQuantity > 0 ? setupCostTotal / inp.batchQuantity : setupCostTotal;
  const materialDefectCost = inp.materialCost + inp.defectOrLossCost;

  const totalCostPerUnit = machineCost + laborCost + overheadCost + setupCostPerUnit + materialDefectCost;

  const grossMarginPerUnit = inp.quotedJobPrice - totalCostPerUnit;
  const contributionMarginPct = inp.quotedJobPrice > 0 ? grossMarginPerUnit / inp.quotedJobPrice : 0;
  const minAcceptablePrice = inp.targetMargin < 1 ? totalCostPerUnit / (1 - inp.targetMargin) : totalCostPerUnit;
  const priceGapToTarget = minAcceptablePrice - inp.quotedJobPrice;

  const lossPerUnit = grossMarginPerUnit < 0 ? -grossMarginPerUnit : 0;
  const annualVolumeUnitsPerYear = inp.annualVolume * SECONDS_PER_YEAR;
  const moneyAtRisk = lossPerUnit * annualVolumeUnitsPerYear;

  // 0 = meets/exceeds target margin, 1 = profitable but below target, 2 = loss-making
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
    out_price_gap_to_target: priceGapToTarget,
    out_money_at_risk: moneyAtRisk,
    out_verdict: verdict,
    out_evidence_completeness: 1,
  };
}

// ─── Sensitivity helper (kept for parity with the prior version) ───────────

export function sensitivity(
  inputs: LossMakingJobInputs,
  driver: keyof LossMakingJobInputs,
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
  "n_quoted_job_price", "n_machine_rate", "n_cycle_time", "n_setup_time",
  "n_batch_quantity", "n_material_cost", "n_labor_rate", "n_overhead_rate",
  "n_defect_or_loss_cost", "n_target_margin", "n_annual_volume",
  "n_source_confidence_ratio",
] as const;

const OUTPUT_KEYS: readonly string[] = [
  "out_machine_cost_component", "out_labor_cost_component", "out_overhead_cost_component",
  "out_material_defect_cost_component", "out_setup_cost_component", "out_total_cost_per_unit",
  "out_gross_margin_per_unit", "out_contribution_margin_pct", "out_minimum_acceptable_price",
  "out_price_gap_to_target", "out_money_at_risk", "out_verdict", "out_evidence_completeness",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  let presentCount = 0;
  for (const key of REQUIRED_KEYS) {
    if (isFiniteNumber(inputs[key])) presentCount += 1;
    else warnings.push('Input "' + key + '" is missing or invalid - using 0');
  }

  const typed: LossMakingJobInputs = {
    quotedJobPrice: get(inputs, "n_quoted_job_price"),
    machineRate: get(inputs, "n_machine_rate"),
    cycleTime: get(inputs, "n_cycle_time"),
    setupTime: get(inputs, "n_setup_time"),
    batchQuantity: get(inputs, "n_batch_quantity"),
    materialCost: get(inputs, "n_material_cost"),
    laborRate: get(inputs, "n_labor_rate"),
    overheadRate: get(inputs, "n_overhead_rate"),
    defectOrLossCost: get(inputs, "n_defect_or_loss_cost"),
    targetMargin: get(inputs, "n_target_margin"),
    annualVolume: get(inputs, "n_annual_volume"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  if (typed.quotedJobPrice <= 0) warnings.push("Quoted job price must be greater than 0 for a meaningful comparison");

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
  if (typed.quotedJobPrice <= 0 || !allRequiredPresent) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "loss-making-job-detector";
export const formulaVersion = "5.3.2-domain.1";

export const sampleInputs: Record<string, number> = {
  n_quoted_job_price: 45,
  n_machine_rate: 85,
  n_cycle_time: 720,
  n_setup_time: 1800,
  n_batch_quantity: 200,
  n_material_cost: 8,
  n_labor_rate: 35,
  n_overhead_rate: 20,
  n_defect_or_loss_cost: 1.5,
  n_target_margin: 0.25,
  n_annual_volume: 12000 / 31536000, // canonical unit_per_s (schema base_unit) for 12,000 units/yr
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
