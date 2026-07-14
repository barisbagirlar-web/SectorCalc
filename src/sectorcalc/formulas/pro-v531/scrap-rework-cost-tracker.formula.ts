import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import {
  QUALITY_LOSS_ARITHMETIC_MODE,
  QUALITY_LOSS_FORMULA_VERSION,
  QUALITY_LOSS_MODEL_ID,
  evaluateQualityLoss,
} from "./quality-loss-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";

export const toolKey = "scrap-rework-cost-tracker";
export const formulaVersion = QUALITY_LOSS_FORMULA_VERSION;
export const arithmeticMode = QUALITY_LOSS_ARITHMETIC_MODE;
export const modelId = QUALITY_LOSS_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/quality-loss.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_total_produced", "n_scrap_quantity", "n_rework_quantity", "n_unit_material_cost",
  "n_unit_labor_cost", "n_rework_labor_rate", "n_rework_time_per_unit",
  "n_defect_rate_target_pct", "n_monthly_volume", "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateQualityLoss({
    totalProduced: inputs.n_total_produced,
    scrapQuantity: inputs.n_scrap_quantity,
    reworkQuantity: inputs.n_rework_quantity,
    unitMaterialCost: inputs.n_unit_material_cost,
    unitLaborCost: inputs.n_unit_labor_cost,
    reworkLaborRate: inputs.n_rework_labor_rate,
    reworkSecondsPerUnit: inputs.n_rework_time_per_unit,
    defectRateTargetRatio: inputs.n_defect_rate_target_pct,
    monthlyVolume: inputs.n_monthly_volume,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_scrap_cost", value.scrapCost], ["out_rework_cost", value.reworkCost],
    ["out_total_quality_loss", value.totalQualityLoss], ["out_total_defect_units", value.totalDefectUnits],
    ["out_defect_rate_ratio", value.defectRateRatio], ["out_defect_rate_target_ratio", value.defectRateTargetRatio],
    ["out_loss_per_produced_unit", value.lossPerProducedUnit],
    ["out_projected_monthly_quality_loss", value.projectedMonthlyQualityLoss],
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
    ? ["Defect-rate or evidence thresholds require a hold and source review."]
    : value.decisionState === 1 ? ["Defect-rate or evidence thresholds require review."] : [];
  return { status: warnings.length ? "REVIEW" : "OK", outputs, decimalOutputs, warnings, outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
