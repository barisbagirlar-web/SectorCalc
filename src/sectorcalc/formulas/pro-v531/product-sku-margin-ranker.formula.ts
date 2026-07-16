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

export const toolKey = "product-sku-margin-ranker";
export const formulaVersion = "5.3.2-pro-baris.2";

const SECONDS_PER_YEAR = 31536000;

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

// Same unit contract as loss-making-job-detector (shared schema template):
//   n_machine_rate / n_labor_rate / n_overhead_rate   currency_unit_per_h
//   n_cycle_time / n_setup_time                        s
//   n_material_cost / n_defect_or_loss_cost             currency_unit (per unit)
//   n_annual_volume                                     unit_per_s
//   n_unit_selling_price                                currency_unit (per unit — NEW, previously fabricated as mc*1.4)

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
  const sellingPrice = get(inputs, "n_unit_selling_price");

  if (!isFiniteNumber(inputs["n_unit_selling_price"]) || sellingPrice <= 0) {
    warnings.push("Missing or non-positive Unit Selling Price: margin ranking cannot be determined without the actual price charged for this SKU.");
  }
  if (tm >= 1) {
    warnings.push("Target Margin >= 100% is mathematically undefined for a price-based contribution margin; minimum acceptable price was clamped.");
  }

  const setupPerUnitSeconds = bq > 0 ? st / bq : 0;
  const unitTimeHours = (ct + setupPerUnitSeconds) / 3600;

  const machineCostPerUnit = mr * unitTimeHours;
  const laborCostPerUnit = lr * unitTimeHours;
  const overheadCostPerUnit = oh * unitTimeHours;
  const materialAndDefectPerUnit = mc + dc;
  const totalCostPerUnit = machineCostPerUnit + laborCostPerUnit + overheadCostPerUnit + materialAndDefectPerUnit;

  const contributionMarginPerUnit = sellingPrice - totalCostPerUnit;
  const contributionMarginRatio = sellingPrice > 0 ? contributionMarginPerUnit / sellingPrice : 0;

  const safeTm = tm < 1 ? tm : 0.999999;
  const minAcceptablePrice = totalCostPerUnit / (1 - safeTm);

  const annualUnits = volPerSecond * SECONDS_PER_YEAR;
  const volumeWeightedMargin = contributionMarginPerUnit * annualUnits;

  const costBreakdown = [machineCostPerUnit, laborCostPerUnit, overheadCostPerUnit, materialAndDefectPerUnit];
  const dominantDriverIndex = costBreakdown.indexOf(Math.max(...costBreakdown));

  const uncertaintyCoverage = unc > 1 ? unc - 1 : 0.1;
  const expandedUncertainty = totalCostPerUnit * uncertaintyCoverage;

  const deratingFactor = tm > 0 ? Math.min(1, Math.max(0, contributionMarginRatio / tm)) : 1;

  let finalDecisionState: number;
  if (contributionMarginPerUnit < 0) finalDecisionState = 2;
  else if (contributionMarginRatio < tm) finalDecisionState = 1;
  else finalDecisionState = 0;

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(annualUnits, 0);
  outputs["out_demand_metric"] = round(contributionMarginPerUnit, 4);
  outputs["out_capacity_metric"] = round(volumeWeightedMargin, 2);
  outputs["out_utilization_margin"] = round(contributionMarginRatio, 4);
  outputs["out_money_at_risk"] = round(contributionMarginPerUnit < 0 ? Math.abs(volumeWeightedMargin) : 0, 2);
  outputs["out_threshold_crossing"] = contributionMarginRatio >= tm ? 0 : 1;
  outputs["out_fmea_trigger"] = contributionMarginPerUnit < 0 ? 1 : 0;
  outputs["out_final_decision_state"] = finalDecisionState;
  outputs["out_reference_deviation"] = round(Math.abs(sellingPrice - minAcceptablePrice) / (sellingPrice || 1), 4);
  outputs["out_derating_factor"] = round(deratingFactor, 4);
  outputs["out_expanded_uncertainty"] = round(expandedUncertainty, 4);
  outputs["out_sensitivity_driver"] = dominantDriverIndex;
  outputs["out_scenario_delta"] = round(contributionMarginPerUnit * annualUnits * 0.15, 2);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_machine_cost_component"] = round(machineCostPerUnit, 4);
  outputs["out_labor_cost_component"] = round(laborCostPerUnit, 4);
  outputs["out_overhead_cost_component"] = round(overheadCostPerUnit, 4);
  outputs["out_material_defect_cost_component"] = round(materialAndDefectPerUnit, 4);

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
