import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const CUSTOMER_SKU_FORMULA_VERSION = "2.0.0";
export const CUSTOMER_SKU_SCHEMA_VERSION = "5.3.1-pro-customer-sku.1";
export const CUSTOMER_SKU_MODEL_ID = "PRO_SINGLE_CUSTOMER_SKU_FULL_COST_V2";
export const CUSTOMER_SKU_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface CustomerSkuInputs {
  sellingPricePerUnit: string | number;
  variableCostPerUnit: string | number;
  annualVolume: string | number;
  logisticsCostRatioOfRevenue: string | number;
  serviceCostRatioOfRevenue: string | number;
  returnCreditCostRatioOfRevenue: string | number;
  targetGrossMarginRatio: string | number;
  annualCustomerSupportCost: string | number;
  annualCollectionCommercialOverhead: string | number;
  sourceConfidenceRatio: string | number;
}

export interface CustomerSkuResult {
  variableCostPerUnit: Decimal;
  logisticsCostPerUnit: Decimal;
  serviceCostPerUnit: Decimal;
  returnCreditCostPerUnit: Decimal;
  customerSupportCostPerUnit: Decimal;
  collectionOverheadPerUnit: Decimal;
  fullyLoadedCustomerSkuCostPerUnit: Decimal;
  sellingPricePerUnit: Decimal;
  netContributionPerUnit: Decimal;
  netContributionMarginRatio: Decimal;
  targetGrossMarginRatio: Decimal;
  targetPricePerUnit: Decimal;
  priceGapToTarget: Decimal;
  annualRevenue: Decimal;
  annualFullyLoadedCost: Decimal;
  annualNetContribution: Decimal;
  sourceConfidenceRatio: Decimal;
  annualProfitUncertainty: Decimal;
  annualProfitLowerBound: Decimal;
  annualProfitUpperBound: Decimal;
  moneyAtRisk: Decimal;
  primaryCostDriver: 0 | 1 | 2 | 3 | 4 | 5;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateCustomerSku(inputs: CustomerSkuInputs): DomainResult<CustomerSkuResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: Kind): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (kind === "POSITIVE" && parsed.value.lte("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    }
    if (kind === "NON_NEGATIVE" && parsed.value.lt("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if (kind === "POSITIVE_INTEGER" && (parsed.value.lte("0") || !parsed.value.round(0, 0).eq(parsed.value))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer count.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const price = read(inputs.sellingPricePerUnit, "selling_price_per_unit", "POSITIVE");
  if (!price.ok) return price;
  const variable = read(inputs.variableCostPerUnit, "variable_cost_per_unit", "NON_NEGATIVE");
  if (!variable.ok) return variable;
  const volume = read(inputs.annualVolume, "annual_volume", "POSITIVE_INTEGER");
  if (!volume.ok) return volume;
  const logisticsRatio = read(inputs.logisticsCostRatioOfRevenue, "logistics_cost_ratio_of_revenue", "RATIO");
  if (!logisticsRatio.ok) return logisticsRatio;
  const serviceRatio = read(inputs.serviceCostRatioOfRevenue, "service_cost_ratio_of_revenue", "RATIO");
  if (!serviceRatio.ok) return serviceRatio;
  const returnRatio = read(inputs.returnCreditCostRatioOfRevenue, "return_credit_cost_ratio_of_revenue", "RATIO");
  if (!returnRatio.ok) return returnRatio;
  const targetMargin = read(inputs.targetGrossMarginRatio, "target_gross_margin_ratio", "RATIO");
  if (!targetMargin.ok) return targetMargin;
  if (targetMargin.value.eq("1")) {
    return err({ code: "DOMAIN_VIOLATION", field: "target_gross_margin_ratio", message: "Target gross margin must be less than 1." });
  }
  const support = read(inputs.annualCustomerSupportCost, "annual_customer_support_cost", "NON_NEGATIVE");
  if (!support.ok) return support;
  const collection = read(inputs.annualCollectionCommercialOverhead, "annual_collection_commercial_overhead", "NON_NEGATIVE");
  if (!collection.ok) return collection;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const one = context.DecimalConstructor("1");
  const zero = context.DecimalConstructor("0");
  const logisticsCostPerUnit = price.value.times(logisticsRatio.value);
  const serviceCostPerUnit = price.value.times(serviceRatio.value);
  const returnCreditCostPerUnit = price.value.times(returnRatio.value);
  const customerSupportCostPerUnit = support.value.div(volume.value);
  const collectionOverheadPerUnit = collection.value.div(volume.value);
  const fullyLoadedCustomerSkuCostPerUnit = variable.value
    .plus(logisticsCostPerUnit)
    .plus(serviceCostPerUnit)
    .plus(returnCreditCostPerUnit)
    .plus(customerSupportCostPerUnit)
    .plus(collectionOverheadPerUnit);
  const netContributionPerUnit = price.value.minus(fullyLoadedCustomerSkuCostPerUnit);
  const netContributionMarginRatio = netContributionPerUnit.div(price.value);
  const targetPricePerUnit = fullyLoadedCustomerSkuCostPerUnit.div(one.minus(targetMargin.value));
  const priceGapToTarget = price.value.minus(targetPricePerUnit);
  const annualRevenue = price.value.times(volume.value);
  const annualFullyLoadedCost = fullyLoadedCustomerSkuCostPerUnit.times(volume.value);
  const annualNetContribution = annualRevenue.minus(annualFullyLoadedCost);
  const annualProfitUncertainty = annualFullyLoadedCost.times(one.minus(confidence.value));
  const annualProfitLowerBound = annualNetContribution.minus(annualProfitUncertainty);
  const annualProfitUpperBound = annualNetContribution.plus(annualProfitUncertainty);
  const moneyAtRisk = annualProfitLowerBound.lt("0") ? annualProfitLowerBound.abs() : zero;
  const drivers = [variable.value, logisticsCostPerUnit, serviceCostPerUnit, returnCreditCostPerUnit, customerSupportCostPerUnit, collectionOverheadPerUnit] as const;
  let primaryCostDriver: 0 | 1 | 2 | 3 | 4 | 5 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryCostDriver])) primaryCostDriver = index as 1 | 2 | 3 | 4 | 5;
  }
  const decisionState: 0 | 1 | 2 = annualProfitLowerBound.gte("0") && netContributionMarginRatio.gte(targetMargin.value)
    ? 0
    : annualProfitUpperBound.gte("0") ? 1 : 2;

  return ok({
    variableCostPerUnit: variable.value,
    logisticsCostPerUnit,
    serviceCostPerUnit,
    returnCreditCostPerUnit,
    customerSupportCostPerUnit,
    collectionOverheadPerUnit,
    fullyLoadedCustomerSkuCostPerUnit,
    sellingPricePerUnit: price.value,
    netContributionPerUnit,
    netContributionMarginRatio,
    targetGrossMarginRatio: targetMargin.value,
    targetPricePerUnit,
    priceGapToTarget,
    annualRevenue,
    annualFullyLoadedCost,
    annualNetContribution,
    sourceConfidenceRatio: confidence.value,
    annualProfitUncertainty,
    annualProfitLowerBound,
    annualProfitUpperBound,
    moneyAtRisk,
    primaryCostDriver,
    decisionState,
  });
}
