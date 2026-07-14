import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import {
  DOWNTIME_LOSS_ARITHMETIC_MODE,
  DOWNTIME_LOSS_FORMULA_VERSION,
  DOWNTIME_LOSS_MODEL_ID,
  evaluateDowntimeLoss,
} from "./downtime-loss-core";
import {
  decimalToPresentationNumber,
  domainErrorMessage,
  isCanonicalDecimalSource,
  type Decimal,
  type DecimalSource,
} from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";

export const toolKey = "downtime-scrap-loss-statement";
export const formulaVersion = DOWNTIME_LOSS_FORMULA_VERSION;
export const arithmeticMode = DOWNTIME_LOSS_ARITHMETIC_MODE;
export const modelId = DOWNTIME_LOSS_MODEL_ID;
export const verificationEvidenceId =
  "tests/pro-calculation-correctness/downtime-loss.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED_INPUTS = [
  "n_productive_hours",
  "n_actual_hours",
  "n_hourly_rate",
  "n_scrap_quantity",
  "n_unit_cost",
  "n_rework_hours",
  "n_rework_rate",
  "n_material_cost",
  "n_defect_rate_pct",
  "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return {
    status: "BLOCKED",
    outputs: {},
    decimalOutputs: {},
    warnings,
    outputKeys: [],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalidInputs = REQUIRED_INPUTS.filter(
    (key) => !isCanonicalDecimalSource(inputs[key]),
  );
  if (invalidInputs.length > 0) {
    return blocked([`Missing or non-finite normalized inputs: ${invalidInputs.join(", ")}.`]);
  }

  const evaluated = evaluateDowntimeLoss({
    productiveSeconds: inputs.n_productive_hours,
    actualSeconds: inputs.n_actual_hours,
    hourlyRate: inputs.n_hourly_rate,
    scrapQuantity: inputs.n_scrap_quantity,
    unitCost: inputs.n_unit_cost,
    reworkSeconds: inputs.n_rework_hours,
    reworkRate: inputs.n_rework_rate,
    materialCost: inputs.n_material_cost,
    defectRateRatio: inputs.n_defect_rate_pct,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const result = evaluated.value;

  const exactOutputs: Array<readonly [string, Decimal]> = [
    ["out_downtime_hours", result.downtimeHours],
    ["out_downtime_cost", result.downtimeCost],
    ["out_scrap_cost", result.scrapCost],
    ["out_rework_cost", result.reworkCost],
    ["out_total_loss", result.totalLoss],
    ["out_loss_to_material_cost_ratio", result.lossToMaterialCostRatio],
    ["out_uptime_ratio", result.uptimeRatio],
    ["out_defect_rate_ratio", result.defectRateRatio],
    ["out_source_confidence_ratio", result.sourceConfidenceRatio],
    ["out_uncertainty_amount", result.uncertaintyAmount],
    ["out_loss_lower_bound", result.lossLowerBound],
    ["out_loss_upper_bound", result.lossUpperBound],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exactOutputs) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_loss_driver = result.primaryLossDriver;
  outputs.out_decision_state = result.decisionState;
  decimalOutputs.out_primary_loss_driver = String(result.primaryLossDriver);
  decimalOutputs.out_decision_state = String(result.decisionState);

  const warnings: string[] = [];
  if (result.decisionState === 2) warnings.push("Loss, defect, or evidence thresholds require a hold and source review.");
  if (result.decisionState === 1) warnings.push("Loss, defect, or evidence thresholds require review before action.");
  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    decimalOutputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
