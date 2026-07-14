import "server-only";

import {
  CUSTOMER_SKU_ARITHMETIC_MODE,
  CUSTOMER_SKU_FORMULA_VERSION,
  CUSTOMER_SKU_MODEL_ID,
  evaluateCustomerSku,
} from "./customer-sku-profitability-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "customer-sku-profitability-forensics";
export const formulaVersion = CUSTOMER_SKU_FORMULA_VERSION;
export const arithmeticMode = CUSTOMER_SKU_ARITHMETIC_MODE;
export const modelId = CUSTOMER_SKU_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/customer-sku.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_unit_price", "n_unit_variable_cost", "n_annual_volume", "n_logistics_cost_pct",
  "n_service_cost_pct", "n_return_rate_pct", "n_target_margin", "n_labor_rate",
  "n_overhead_rate", "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateCustomerSku({
    sellingPricePerUnit: inputs.n_unit_price,
    variableCostPerUnit: inputs.n_unit_variable_cost,
    annualVolume: inputs.n_annual_volume,
    logisticsCostRatioOfRevenue: inputs.n_logistics_cost_pct,
    serviceCostRatioOfRevenue: inputs.n_service_cost_pct,
    returnCreditCostRatioOfRevenue: inputs.n_return_rate_pct,
    targetGrossMarginRatio: inputs.n_target_margin,
    annualCustomerSupportCost: inputs.n_labor_rate,
    annualCollectionCommercialOverhead: inputs.n_overhead_rate,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_variable_cost_per_unit", value.variableCostPerUnit],
    ["out_logistics_cost_per_unit", value.logisticsCostPerUnit],
    ["out_service_cost_per_unit", value.serviceCostPerUnit],
    ["out_return_credit_cost_per_unit", value.returnCreditCostPerUnit],
    ["out_customer_support_cost_per_unit", value.customerSupportCostPerUnit],
    ["out_collection_overhead_per_unit", value.collectionOverheadPerUnit],
    ["out_fully_loaded_customer_sku_cost_per_unit", value.fullyLoadedCustomerSkuCostPerUnit],
    ["out_selling_price_per_unit", value.sellingPricePerUnit],
    ["out_net_contribution_per_unit", value.netContributionPerUnit],
    ["out_net_contribution_margin_ratio", value.netContributionMarginRatio],
    ["out_target_gross_margin_ratio", value.targetGrossMarginRatio],
    ["out_target_price_per_unit", value.targetPricePerUnit],
    ["out_price_gap_to_target", value.priceGapToTarget],
    ["out_annual_revenue", value.annualRevenue],
    ["out_annual_fully_loaded_cost", value.annualFullyLoadedCost],
    ["out_annual_net_contribution", value.annualNetContribution],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_annual_profit_uncertainty", value.annualProfitUncertainty],
    ["out_annual_profit_lower_bound", value.annualProfitLowerBound],
    ["out_annual_profit_upper_bound", value.annualProfitUpperBound],
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
  outputs.out_primary_cost_driver = value.primaryCostDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_cost_driver = String(value.primaryCostDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["The annual net-contribution upper bound is negative; hold or reprice this customer-SKU relationship."]
    : value.decisionState === 1
      ? ["Target margin or evidence-adjusted profit is not secured; review pricing and customer-specific burdens."]
      : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
