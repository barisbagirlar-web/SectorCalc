import "server-only";

import {
  PLANT_SHOP_RATE_ARITHMETIC_MODE,
  PLANT_SHOP_RATE_FORMULA_VERSION,
  PLANT_SHOP_RATE_MODEL_ID,
  evaluatePlantShopRate,
} from "./plant-shop-rate-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "plant-wide-shop-rate-cost-structure-audit";
export const formulaVersion = PLANT_SHOP_RATE_FORMULA_VERSION;
export const arithmeticMode = PLANT_SHOP_RATE_ARITHMETIC_MODE;
export const modelId = PLANT_SHOP_RATE_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/plant-shop-rate.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_total_annual_cost", "n_total_productive_hours", "n_machine_group_cost",
  "n_machine_group_hours", "n_overhead_pool", "n_overhead_allocation_base",
  "n_current_shop_rate", "n_target_margin_pct", "n_utilization_pct",
  "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluatePlantShopRate({
    totalAnnualCost: inputs.n_total_annual_cost,
    availableAnnualHours: inputs.n_total_productive_hours,
    machineGroupAnnualCost: inputs.n_machine_group_cost,
    machineGroupAnnualHours: inputs.n_machine_group_hours,
    annualOverheadPool: inputs.n_overhead_pool,
    overheadAllocationHours: inputs.n_overhead_allocation_base,
    currentShopRate: inputs.n_current_shop_rate,
    targetGrossMarginRatio: inputs.n_target_margin_pct,
    utilizationRatio: inputs.n_utilization_pct,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_expected_billable_hours", value.expectedBillableHours],
    ["out_plant_cost_recovery_rate", value.plantCostRecoveryRate],
    ["out_target_shop_rate", value.targetShopRate],
    ["out_current_shop_rate", value.currentShopRate],
    ["out_target_rate_gap", value.targetRateGap],
    ["out_machine_group_cost_rate", value.machineGroupCostRate],
    ["out_overhead_absorption_rate", value.overheadAbsorptionRate],
    ["out_current_annual_revenue", value.currentAnnualRevenue],
    ["out_target_annual_revenue", value.targetAnnualRevenue],
    ["out_annual_pricing_delta", value.annualPricingDelta],
    ["out_annual_cost_recovery_delta", value.annualCostRecoveryDelta],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_target_rate_uncertainty", value.targetRateUncertainty],
    ["out_target_rate_lower_bound", value.targetRateLowerBound],
    ["out_target_rate_upper_bound", value.targetRateUpperBound],
    ["out_annual_money_at_risk", value.annualMoneyAtRisk],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_rate_driver = value.primaryRateDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_rate_driver = String(value.primaryRateDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["Current shop rate is below the verified target-rate lower bound; repricing is required."]
    : value.decisionState === 1 ? ["Current shop rate lies inside the target-rate evidence interval; review cost evidence."] : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
