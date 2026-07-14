import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import { OEE_LOSS_ARITHMETIC_MODE, OEE_LOSS_FORMULA_VERSION, OEE_LOSS_MODEL_ID, evaluateOeeLoss } from "./oee-loss-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";

export const toolKey = "oee-loss-monetization-improvement-business-case";
export const formulaVersion = OEE_LOSS_FORMULA_VERSION;
export const arithmeticMode = OEE_LOSS_ARITHMETIC_MODE;
export const modelId = OEE_LOSS_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/oee-loss.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = ["n_planned_production_time", "n_operating_time", "n_ideal_cycle_time", "n_total_parts",
  "n_good_parts", "n_hourly_contribution", "n_improvement_cost", "n_source_confidence_ratio"] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateOeeLoss({ plannedSeconds: inputs.n_planned_production_time,
    operatingSeconds: inputs.n_operating_time, idealCycleSeconds: inputs.n_ideal_cycle_time,
    totalParts: inputs.n_total_parts, goodParts: inputs.n_good_parts,
    hourlyContribution: inputs.n_hourly_contribution, improvementCost: inputs.n_improvement_cost,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_availability", value.availability], ["out_performance", value.performance],
    ["out_quality", value.quality], ["out_oee", value.oee],
    ["out_net_operating_seconds", value.netOperatingSeconds], ["out_valuable_operating_seconds", value.valuableOperatingSeconds],
    ["out_availability_loss", value.availabilityLoss], ["out_performance_loss", value.performanceLoss],
    ["out_quality_loss", value.qualityLoss], ["out_total_oee_loss", value.totalOeeLoss],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio], ["out_uncertainty_amount", value.uncertaintyAmount],
    ["out_loss_lower_bound", value.lossLowerBound], ["out_loss_upper_bound", value.lossUpperBound],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_loss_driver = value.primaryLossDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_loss_driver = String(value.primaryLossDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["Verified OEE-loss bounds do not recover the entered improvement cost in the observed production period."]
    : value.decisionState === 1 ? ["The improvement-cost decision crosses the OEE-loss uncertainty bounds."] : [];
  return { status: warnings.length ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
