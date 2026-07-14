import "server-only";

import {
  JOB_QUOTE_ARITHMETIC_MODE,
  JOB_QUOTE_FORMULA_VERSION,
  JOB_QUOTE_MODEL_ID,
  evaluateJobQuote,
} from "./job-quote-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "job-quote-builder-pro-pack";
export const formulaVersion = JOB_QUOTE_FORMULA_VERSION;
export const arithmeticMode = JOB_QUOTE_ARITHMETIC_MODE;
export const modelId = JOB_QUOTE_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/job-quote.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_machine_rate", "n_cycle_time", "n_setup_time", "n_batch_quantity",
  "n_material_cost", "n_target_margin", "n_annual_volume", "n_labor_rate",
  "n_overhead_rate", "n_defect_or_loss_cost", "n_source_confidence_ratio",
  "n_uncertainty_multiplier",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateJobQuote({
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
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
    uncertaintyCoverageMultiplier: inputs.n_uncertainty_multiplier,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_setup_seconds_per_unit", value.setupSecondsPerUnit],
    ["out_effective_seconds_per_unit", value.effectiveSecondsPerUnit],
    ["out_machine_cost_per_unit", value.machineCostPerUnit],
    ["out_labor_cost_per_unit", value.laborCostPerUnit],
    ["out_overhead_cost_per_unit", value.overheadCostPerUnit],
    ["out_material_cost_per_unit", value.materialCostPerUnit],
    ["out_other_direct_cost_per_unit", value.otherDirectCostPerUnit],
    ["out_fully_loaded_cost_per_unit", value.fullyLoadedCostPerUnit],
    ["out_fully_loaded_job_cost", value.fullyLoadedJobCost],
    ["out_target_quote_per_unit", value.targetQuotePerUnit],
    ["out_target_quote_total", value.targetQuoteTotal],
    ["out_gross_profit_per_unit", value.grossProfitPerUnit],
    ["out_gross_profit_total", value.grossProfitTotal],
    ["out_achieved_gross_margin_ratio", value.achievedGrossMarginRatio],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_cost_uncertainty_per_unit", value.costUncertaintyPerUnit],
    ["out_cost_lower_bound_per_unit", value.costLowerBoundPerUnit],
    ["out_cost_upper_bound_per_unit", value.costUpperBoundPerUnit],
    ["out_quote_lower_bound_per_unit", value.quoteLowerBoundPerUnit],
    ["out_quote_upper_bound_per_unit", value.quoteUpperBoundPerUnit],
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
    ? ["Combined quote-cost uncertainty exceeds 25%; hold commercial release and strengthen evidence."]
    : value.decisionState === 1 ? ["Combined quote-cost uncertainty exceeds 10%; review the quote before release."] : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
