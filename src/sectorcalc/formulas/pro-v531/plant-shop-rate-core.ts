import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const PLANT_SHOP_RATE_FORMULA_VERSION = "2.0.0";
export const PLANT_SHOP_RATE_SCHEMA_VERSION = "5.3.1-pro-plant-shop-rate.1";
export const PLANT_SHOP_RATE_MODEL_ID = "PRO_PLANT_SHOP_RATE_COST_RECOVERY_V2";
export const PLANT_SHOP_RATE_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface PlantShopRateInputs {
  totalAnnualCost: string | number;
  availableAnnualHours: string | number;
  machineGroupAnnualCost: string | number;
  machineGroupAnnualHours: string | number;
  annualOverheadPool: string | number;
  overheadAllocationHours: string | number;
  currentShopRate: string | number;
  targetGrossMarginRatio: string | number;
  utilizationRatio: string | number;
  sourceConfidenceRatio: string | number;
}

export interface PlantShopRateResult {
  expectedBillableHours: Decimal;
  plantCostRecoveryRate: Decimal;
  targetShopRate: Decimal;
  currentShopRate: Decimal;
  targetRateGap: Decimal;
  machineGroupCostRate: Decimal;
  overheadAbsorptionRate: Decimal;
  currentAnnualRevenue: Decimal;
  targetAnnualRevenue: Decimal;
  annualPricingDelta: Decimal;
  annualCostRecoveryDelta: Decimal;
  sourceConfidenceRatio: Decimal;
  targetRateUncertainty: Decimal;
  targetRateLowerBound: Decimal;
  targetRateUpperBound: Decimal;
  annualMoneyAtRisk: Decimal;
  primaryRateDriver: 0 | 1 | 2;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "RATIO";

export function evaluatePlantShopRate(
  inputs: PlantShopRateInputs,
): DomainResult<PlantShopRateResult> {
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
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const totalCost = read(inputs.totalAnnualCost, "total_annual_cost", "POSITIVE");
  if (!totalCost.ok) return totalCost;
  const availableHours = read(inputs.availableAnnualHours, "available_annual_hours", "POSITIVE");
  if (!availableHours.ok) return availableHours;
  const groupCost = read(inputs.machineGroupAnnualCost, "machine_group_annual_cost", "NON_NEGATIVE");
  if (!groupCost.ok) return groupCost;
  if (groupCost.value.gt(totalCost.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "machine_group_annual_cost", message: "Machine-group cost cannot exceed total annual plant cost." });
  }
  const groupHours = read(inputs.machineGroupAnnualHours, "machine_group_annual_hours", "POSITIVE");
  if (!groupHours.ok) return groupHours;
  if (groupHours.value.gt(availableHours.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "machine_group_annual_hours", message: "Machine-group hours cannot exceed total available plant hours." });
  }
  const overhead = read(inputs.annualOverheadPool, "annual_overhead_pool", "NON_NEGATIVE");
  if (!overhead.ok) return overhead;
  if (overhead.value.gt(totalCost.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "annual_overhead_pool", message: "Overhead pool cannot exceed total annual plant cost." });
  }
  const allocationHours = read(inputs.overheadAllocationHours, "overhead_allocation_hours", "POSITIVE");
  if (!allocationHours.ok) return allocationHours;
  const currentRate = read(inputs.currentShopRate, "current_shop_rate", "NON_NEGATIVE");
  if (!currentRate.ok) return currentRate;
  const margin = read(inputs.targetGrossMarginRatio, "target_gross_margin_ratio", "RATIO");
  if (!margin.ok) return margin;
  if (margin.value.eq("1")) {
    return err({ code: "DOMAIN_VIOLATION", field: "target_gross_margin_ratio", message: "Target gross margin must be less than 1." });
  }
  const utilization = read(inputs.utilizationRatio, "utilization_ratio", "RATIO");
  if (!utilization.ok) return utilization;
  if (utilization.value.eq("0")) {
    return err({ code: "DOMAIN_VIOLATION", field: "utilization_ratio", message: "Utilization must be greater than zero." });
  }
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const expectedBillableHours = availableHours.value.times(utilization.value);
  const plantCostRecoveryRate = totalCost.value.div(expectedBillableHours);
  const targetShopRate = plantCostRecoveryRate.div(context.DecimalConstructor("1").minus(margin.value));
  const targetRateGap = targetShopRate.minus(currentRate.value);
  const machineGroupCostRate = groupCost.value.div(groupHours.value);
  const overheadAbsorptionRate = overhead.value.div(allocationHours.value);
  const currentAnnualRevenue = currentRate.value.times(expectedBillableHours);
  const targetAnnualRevenue = targetShopRate.times(expectedBillableHours);
  const annualPricingDelta = targetAnnualRevenue.minus(currentAnnualRevenue);
  const annualCostRecoveryDelta = totalCost.value.minus(currentAnnualRevenue);
  const targetRateUncertainty = targetShopRate.times(context.DecimalConstructor("1").minus(confidence.value));
  const targetRateLowerBound = targetShopRate.minus(targetRateUncertainty);
  const targetRateUpperBound = targetShopRate.plus(targetRateUncertainty);
  const exposedRateGap = targetRateUpperBound.minus(currentRate.value);
  const annualMoneyAtRisk = exposedRateGap.gt("0")
    ? exposedRateGap.times(expectedBillableHours)
    : context.DecimalConstructor("0");
  const rates = [plantCostRecoveryRate, machineGroupCostRate, overheadAbsorptionRate] as const;
  let primaryRateDriver: 0 | 1 | 2 = 0;
  for (let index = 1; index < rates.length; index += 1) {
    if (rates[index].gt(rates[primaryRateDriver])) primaryRateDriver = index as 1 | 2;
  }
  const decisionState: 0 | 1 | 2 = currentRate.value.gte(targetRateUpperBound)
    ? 0
    : currentRate.value.gte(targetRateLowerBound) ? 1 : 2;

  return ok({
    expectedBillableHours,
    plantCostRecoveryRate,
    targetShopRate,
    currentShopRate: currentRate.value,
    targetRateGap,
    machineGroupCostRate,
    overheadAbsorptionRate,
    currentAnnualRevenue,
    targetAnnualRevenue,
    annualPricingDelta,
    annualCostRecoveryDelta,
    sourceConfidenceRatio: confidence.value,
    targetRateUncertainty,
    targetRateLowerBound,
    targetRateUpperBound,
    annualMoneyAtRisk,
    primaryRateDriver,
    decisionState,
  });
}
