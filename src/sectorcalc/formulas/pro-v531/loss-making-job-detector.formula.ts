import "server-only";

import {
  LOSS_MAKING_JOB_ARITHMETIC_MODE,
  LOSS_MAKING_JOB_FORMULA_VERSION,
  LOSS_MAKING_JOB_MODEL_ID,
  evaluateLossMakingJob,
} from "./loss-making-job-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "loss-making-job-detector";
export const formulaVersion = LOSS_MAKING_JOB_FORMULA_VERSION;
export const arithmeticMode = LOSS_MAKING_JOB_ARITHMETIC_MODE;
export const modelId = LOSS_MAKING_JOB_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/loss-making-job.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_machine_rate", "n_cycle_time", "n_setup_time", "n_batch_quantity",
  "n_material_cost", "n_target_margin", "n_annual_volume", "n_labor_rate",
  "n_overhead_rate", "n_defect_or_loss_cost", "n_uncertainty_multiplier",
  "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateLossMakingJob({
    machineRatePerHour: inputs.n_machine_rate,
    cycleSecondsPerUnit: inputs.n_cycle_time,
    setupSecondsPerJob: inputs.n_setup_time,
    jobQuantity: inputs.n_batch_quantity,
    materialCostPerUnit: inputs.n_material_cost,
    targetGrossMarginRatio: inputs.n_target_margin,
    annualVolume: inputs.n_annual_volume,
    laborRatePerHour: inputs.n_labor_rate,
    annualOverheadPool: inputs.n_overhead_rate,
    otherDirectJobCost: inputs.n_defect_or_loss_cost,
    quotedJobRevenue: inputs.n_uncertainty_multiplier,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_setup_seconds_per_unit", value.setupSecondsPerUnit],
    ["out_effective_seconds_per_unit", value.effectiveSecondsPerUnit],
    ["out_machine_cost_per_unit", value.machineCostPerUnit],
    ["out_labor_cost_per_unit", value.laborCostPerUnit],
    ["out_material_cost_per_unit", value.materialCostPerUnit],
    ["out_overhead_cost_per_unit", value.overheadCostPerUnit],
    ["out_other_direct_cost_per_unit", value.otherDirectCostPerUnit],
    ["out_fully_loaded_cost_per_unit", value.fullyLoadedCostPerUnit],
    ["out_fully_loaded_job_cost", value.fullyLoadedJobCost],
    ["out_quoted_job_revenue", value.quotedJobRevenue],
    ["out_gross_profit", value.grossProfit],
    ["out_gross_margin_ratio", value.grossMarginRatio],
    ["out_target_gross_margin_ratio", value.targetGrossMarginRatio],
    ["out_minimum_quote_total", value.minimumQuoteTotal],
    ["out_quote_gap_to_target", value.quoteGapToTarget],
    ["out_annual_equivalent_jobs", value.annualEquivalentJobs],
    ["out_annual_equivalent_gross_profit", value.annualEquivalentGrossProfit],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_profit_uncertainty", value.profitUncertainty],
    ["out_profit_lower_bound", value.profitLowerBound],
    ["out_profit_upper_bound", value.profitUpperBound],
    ["out_money_at_risk", value.moneyAtRisk],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_unit_cost_driver = value.primaryUnitCostDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_unit_cost_driver = String(value.primaryUnitCostDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["Even the evidence-adjusted profit upper bound is negative; block this job at the entered quote."]
    : value.decisionState === 1
      ? ["The quote does not clear both the target margin and evidence-adjusted profit lower bound; review before acceptance."]
      : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
