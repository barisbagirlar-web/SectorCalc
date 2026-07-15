import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "loss-making-job-detector";
export const formulaVersion = "5.3.2-pro-baris.2";

const SECONDS_PER_YEAR = 31536000; // 365 days, matches unit_per_year registry factor

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

// Unit contract (post-normalization, base units per schema):
//   n_machine_rate            currency_unit_per_h   ($/hour, fully loaded machine rate)
//   n_cycle_time               s                     (production time per unit)
//   n_setup_time                s                     (one-time setup time for the whole batch)
//   n_batch_quantity            ratio (count)
//   n_material_cost              currency_unit         ($/unit)
//   n_target_margin              ratio                 (target CONTRIBUTION MARGIN ratio, i.e. (price-cost)/price)
//   n_annual_volume              unit_per_s            (rate; multiply by SECONDS_PER_YEAR to get units/year)
//   n_labor_rate                 currency_unit_per_h   ($/hour)
//   n_overhead_rate              currency_unit_per_h   ($/hour)
//   n_defect_or_loss_cost        currency_unit         ($/unit)
//   n_source_confidence_ratio    ratio
//   n_uncertainty_multiplier     ratio (coverage k-factor, e.g. 1.5-2.5; >1 means "cost band could run this much wider")
//   n_quoted_job_price           currency_unit         ($, TOTAL price quoted/planned for this job/batch)

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const mr = get(inputs, "n_machine_rate");
  const ct = get(inputs, "n_cycle_time");
  const st = get(inputs, "n_setup_time");
  const bq = get(inputs, "n_batch_quantity");
  const mc = get(inputs, "n_material_cost");
  const tm = get(inputs, "n_target_margin");
  const volPerSecond = get(inputs, "n_annual_volume");
  const lr = get(inputs, "n_labor_rate");
  const oh = get(inputs, "n_overhead_rate");
  const dc = get(inputs, "n_defect_or_loss_cost");
  const conf = get(inputs, "n_source_confidence_ratio");
  const unc = get(inputs, "n_uncertainty_multiplier");
  const quotedPrice = get(inputs, "n_quoted_job_price");

  if (!isFiniteNumber(inputs["n_quoted_job_price"]) || quotedPrice <= 0) {
    warnings.push("Missing or non-positive Quoted / Planned Job Price: loss status cannot be determined without the actual charge to the customer.");
  }
  if (bq <= 0) {
    warnings.push("Batch Quantity must be greater than 0; per-unit cost breakdown is undefined at zero quantity.");
  }
  if (tm >= 1) {
    warnings.push("Target Margin >= 100% is mathematically undefined for a price-based contribution margin; minimum acceptable price was clamped.");
  }

  // Rate ($/hour) -> per-unit cost requires converting cycle+setup time to hours.
  // Setup time is a one-time cost for the whole batch, amortized across units in the batch.
  const setupPerUnitSeconds = bq > 0 ? st / bq : 0;
  const unitTimeHours = (ct + setupPerUnitSeconds) / 3600;

  const machineCostPerUnit = mr * unitTimeHours;
  const laborCostPerUnit = lr * unitTimeHours;
  const overheadCostPerUnit = oh * unitTimeHours;
  const materialAndDefectPerUnit = mc + dc;

  const totalCostPerUnit = machineCostPerUnit + laborCostPerUnit + overheadCostPerUnit + materialAndDefectPerUnit;
  const totalCostBatch = totalCostPerUnit * bq;

  const revenue = quotedPrice;
  const grossMargin = revenue - totalCostBatch;
  const contributionMarginRatio = revenue > 0 ? grossMargin / revenue : 0;

  // Minimum acceptable price derived from a MARGIN (not markup) definition, consistent with
  // contributionMarginRatio = (price - cost) / price. Solving for price at cm = tm:
  //   price = cost / (1 - tm), valid only for tm < 1.
  const safeTm = tm < 1 ? tm : 0.999999;
  const minAcceptablePrice = totalCostBatch / (1 - safeTm);

  const loss = grossMargin < 0 ? Math.abs(grossMargin) : 0;
  const lossPerUnit = bq > 0 ? loss / bq : 0;
  const annualUnits = volPerSecond * SECONDS_PER_YEAR;
  const annualMoneyAtRisk = lossPerUnit * annualUnits;

  const costBreakdown = [machineCostPerUnit, laborCostPerUnit, overheadCostPerUnit, materialAndDefectPerUnit];
  const dominantDriverIndex = costBreakdown.indexOf(Math.max(...costBreakdown)); // 0=machine 1=labor 2=overhead 3=material+defect

  const uncertaintyCoverage = unc > 1 ? unc - 1 : 0.1;
  const expandedUncertainty = totalCostBatch * uncertaintyCoverage;

  const deratingFactor = tm > 0 ? Math.min(1, Math.max(0, contributionMarginRatio / tm)) : 1;

  let finalDecisionState: number;
  if (grossMargin < 0) finalDecisionState = 2;
  else if (contributionMarginRatio < tm) finalDecisionState = 1;
  else finalDecisionState = 0;

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(revenue, 2);
  outputs["out_demand_metric"] = round(totalCostBatch, 2);
  outputs["out_capacity_metric"] = round(loss, 2);
  outputs["out_utilization_margin"] = round(contributionMarginRatio, 4);
  outputs["out_money_at_risk"] = round(annualMoneyAtRisk, 2);
  outputs["out_threshold_crossing"] = contributionMarginRatio >= tm ? 0 : 1;
  outputs["out_fmea_trigger"] = loss > 0 ? 1 : 0;
  outputs["out_final_decision_state"] = finalDecisionState;
  outputs["out_reference_deviation"] = round(Math.abs(revenue - minAcceptablePrice) / (revenue || 1), 4);
  outputs["out_derating_factor"] = round(deratingFactor, 4);
  outputs["out_expanded_uncertainty"] = round(expandedUncertainty, 2);
  outputs["out_sensitivity_driver"] = dominantDriverIndex;
  outputs["out_scenario_delta"] = round(totalCostBatch * 0.15, 2);
  outputs["out_audit_hash_payload"] = 0;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
