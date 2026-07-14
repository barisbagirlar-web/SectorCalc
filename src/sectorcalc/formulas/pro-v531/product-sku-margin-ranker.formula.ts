import "server-only";

import {
  SKU_MARGIN_ARITHMETIC_MODE,
  SKU_MARGIN_FORMULA_VERSION,
  SKU_MARGIN_MODEL_ID,
  evaluateSkuMargin,
} from "./sku-margin-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "product-sku-margin-ranker";
export const formulaVersion = SKU_MARGIN_FORMULA_VERSION;
export const arithmeticMode = SKU_MARGIN_ARITHMETIC_MODE;
export const modelId = SKU_MARGIN_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/sku-margin.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_machine_rate", "n_cycle_time", "n_material_cost", "n_target_margin",
  "n_annual_volume", "n_labor_rate", "n_overhead_rate", "n_defect_or_loss_cost",
  "n_uncertainty_multiplier", "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateSkuMargin({
    machineRatePerHour: inputs.n_machine_rate,
    cycleSecondsPerUnit: inputs.n_cycle_time,
    materialCostPerUnit: inputs.n_material_cost,
    targetGrossMarginRatio: inputs.n_target_margin,
    annualVolume: inputs.n_annual_volume,
    laborRatePerHour: inputs.n_labor_rate,
    annualOverheadPool: inputs.n_overhead_rate,
    annualQualityServiceCost: inputs.n_defect_or_loss_cost,
    currentSellingPricePerUnit: inputs.n_uncertainty_multiplier,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_machine_cost_per_unit", value.machineCostPerUnit],
    ["out_labor_cost_per_unit", value.laborCostPerUnit],
    ["out_material_cost_per_unit", value.materialCostPerUnit],
    ["out_overhead_cost_per_unit", value.overheadCostPerUnit],
    ["out_quality_service_cost_per_unit", value.qualityServiceCostPerUnit],
    ["out_fully_loaded_cost_per_unit", value.fullyLoadedCostPerUnit],
    ["out_current_selling_price_per_unit", value.currentSellingPricePerUnit],
    ["out_gross_profit_per_unit", value.grossProfitPerUnit],
    ["out_gross_margin_ratio", value.grossMarginRatio],
    ["out_target_gross_margin_ratio", value.targetGrossMarginRatio],
    ["out_target_price_per_unit", value.targetPricePerUnit],
    ["out_price_gap_to_target", value.priceGapToTarget],
    ["out_margin_gap_to_target", value.marginGapToTarget],
    ["out_annual_revenue", value.annualRevenue],
    ["out_annual_fully_loaded_cost", value.annualFullyLoadedCost],
    ["out_annual_gross_profit", value.annualGrossProfit],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_annual_profit_uncertainty", value.annualProfitUncertainty],
    ["out_annual_profit_lower_bound", value.annualProfitLowerBound],
    ["out_annual_profit_upper_bound", value.annualProfitUpperBound],
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
    ? ["Annual gross-profit upper bound is negative; hold or discontinue this SKU at the entered price."]
    : value.decisionState === 1 ? ["SKU margin or profit evidence requires repricing/review before portfolio ranking."] : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
