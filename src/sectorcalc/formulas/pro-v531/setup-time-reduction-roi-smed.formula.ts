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

export const toolKey = "setup-time-reduction-roi-smed";
export const formulaVersion = "5.3.2-pro-baris.2";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const SECONDS_PER_YEAR = 31536000;
const PAYBACK_SENTINEL_MONTHS = 999; // finite stand-in for "never pays back" (avoids Infinity)

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const mr = get(inputs, "n_machine_rate");
  const st = get(inputs, "n_setup_time");
  const bq = get(inputs, "n_batch_quantity");
  const volPerSecond = get(inputs, "n_annual_volume");
  const lr = get(inputs, "n_labor_rate");
  const conf = get(inputs, "n_source_confidence_ratio");
  const unc = get(inputs, "n_uncertainty_multiplier");
  const investmentCost = get(inputs, "n_smed_investment_cost");
  const reductionPct = get(inputs, "n_setup_time_reduction_target_pct");

  if (!isFiniteNumber(inputs["n_smed_investment_cost"]) || investmentCost <= 0) {
    warnings.push("Missing or non-positive SMED Program Investment Cost: ROI cannot be computed without the real program cost.");
  }
  if (!isFiniteNumber(inputs["n_setup_time_reduction_target_pct"]) || reductionPct <= 0) {
    warnings.push("Missing or non-positive Target Setup Time Reduction: no time saving assumed.");
  }
  if (bq <= 0) {
    warnings.push("Batch Quantity must be greater than 0 to compute annual batch run frequency.");
  }

  const annualUnits = volPerSecond * SECONDS_PER_YEAR;
  const annualBatches = bq > 0 ? annualUnits / bq : 0;

  const setupHoursPerBatch = st / 3600;
  const annualSetupHoursBefore = setupHoursPerBatch * annualBatches;
  const combinedRate = mr + lr; // machine + labor both idle/tied up during setup
  const annualSetupCostBefore = annualSetupHoursBefore * combinedRate;

  const setupHoursSavedPerBatch = setupHoursPerBatch * Math.min(Math.max(reductionPct, 0), 1);
  const annualHoursRecovered = setupHoursSavedPerBatch * annualBatches;
  const annualSavings = annualHoursRecovered * combinedRate;

  const paybackMonths = annualSavings > 0
    ? (investmentCost / annualSavings) * 12
    : (investmentCost > 0 ? PAYBACK_SENTINEL_MONTHS : 0);

  const roiMultiplier = investmentCost > 0 ? annualSavings / investmentCost : 0;

  let finalDecisionState: number;
  if (investmentCost <= 0 || reductionPct <= 0) finalDecisionState = 2;
  else if (paybackMonths <= 12) finalDecisionState = 0;
  else if (paybackMonths <= 24) finalDecisionState = 1;
  else finalDecisionState = 2;

  const uncertaintyCoverage = unc > 1 ? unc - 1 : 0.1;
  const expandedUncertainty = annualSavings * uncertaintyCoverage;

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(annualBatches, 1);
  outputs["out_demand_metric"] = round(annualSetupCostBefore, 2);
  outputs["out_capacity_metric"] = round(annualHoursRecovered, 2);
  outputs["out_utilization_margin"] = round(roiMultiplier, 4);
  outputs["out_money_at_risk"] = round(investmentCost, 2);
  outputs["out_threshold_crossing"] = paybackMonths <= 24 ? 0 : 1;
  outputs["out_fmea_trigger"] = paybackMonths > 24 ? 1 : 0;
  outputs["out_final_decision_state"] = finalDecisionState;
  outputs["out_reference_deviation"] = round(Math.min(Math.abs(paybackMonths - 12) / 12, 99), 4);
  outputs["out_derating_factor"] = round(conf, 4);
  outputs["out_expanded_uncertainty"] = round(expandedUncertainty, 2);
  outputs["out_sensitivity_driver"] = mr >= lr ? 0 : 1;
  outputs["out_machine_share_component"] = round(combinedRate > 0 ? annualSetupCostBefore * (mr / combinedRate) : 0, 2);
  outputs["out_labor_share_component"] = round(combinedRate > 0 ? annualSetupCostBefore * (lr / combinedRate) : 0, 2);
  outputs["out_scenario_delta"] = round(annualSavings * 0.15, 2);
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
