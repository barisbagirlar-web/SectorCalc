import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const SKU_MARGIN_FORMULA_VERSION = "2.0.0";
export const SKU_MARGIN_SCHEMA_VERSION = "5.3.1-pro-sku-margin.1";
export const SKU_MARGIN_MODEL_ID = "PRO_SINGLE_SKU_MARGIN_SCORECARD_V2";
export const SKU_MARGIN_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface SkuMarginInputs {
  machineRatePerHour: string | number;
  cycleSecondsPerUnit: string | number;
  materialCostPerUnit: string | number;
  targetGrossMarginRatio: string | number;
  annualVolume: string | number;
  laborRatePerHour: string | number;
  annualOverheadPool: string | number;
  annualQualityServiceCost: string | number;
  currentSellingPricePerUnit: string | number;
  sourceConfidenceRatio: string | number;
}

export interface SkuMarginResult {
  machineCostPerUnit: Decimal;
  laborCostPerUnit: Decimal;
  materialCostPerUnit: Decimal;
  overheadCostPerUnit: Decimal;
  qualityServiceCostPerUnit: Decimal;
  fullyLoadedCostPerUnit: Decimal;
  currentSellingPricePerUnit: Decimal;
  grossProfitPerUnit: Decimal;
  grossMarginRatio: Decimal;
  targetGrossMarginRatio: Decimal;
  targetPricePerUnit: Decimal;
  priceGapToTarget: Decimal;
  marginGapToTarget: Decimal;
  annualRevenue: Decimal;
  annualFullyLoadedCost: Decimal;
  annualGrossProfit: Decimal;
  sourceConfidenceRatio: Decimal;
  annualProfitUncertainty: Decimal;
  annualProfitLowerBound: Decimal;
  annualProfitUpperBound: Decimal;
  primaryUnitCostDriver: 0 | 1 | 2 | 3 | 4;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateSkuMargin(inputs: SkuMarginInputs): DomainResult<SkuMarginResult> {
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

  const machine = read(inputs.machineRatePerHour, "machine_rate_per_hour", "NON_NEGATIVE");
  if (!machine.ok) return machine;
  const cycle = read(inputs.cycleSecondsPerUnit, "cycle_seconds_per_unit", "POSITIVE");
  if (!cycle.ok) return cycle;
  const material = read(inputs.materialCostPerUnit, "material_cost_per_unit", "NON_NEGATIVE");
  if (!material.ok) return material;
  const targetMargin = read(inputs.targetGrossMarginRatio, "target_gross_margin_ratio", "RATIO");
  if (!targetMargin.ok) return targetMargin;
  if (targetMargin.value.eq("1")) {
    return err({ code: "DOMAIN_VIOLATION", field: "target_gross_margin_ratio", message: "Target gross margin must be less than 1." });
  }
  const volume = read(inputs.annualVolume, "annual_volume", "POSITIVE_INTEGER");
  if (!volume.ok) return volume;
  const labor = read(inputs.laborRatePerHour, "labor_rate_per_hour", "NON_NEGATIVE");
  if (!labor.ok) return labor;
  const overhead = read(inputs.annualOverheadPool, "annual_overhead_pool", "NON_NEGATIVE");
  if (!overhead.ok) return overhead;
  const qualityService = read(inputs.annualQualityServiceCost, "annual_quality_service_cost", "NON_NEGATIVE");
  if (!qualityService.ok) return qualityService;
  const price = read(inputs.currentSellingPricePerUnit, "current_selling_price_per_unit", "POSITIVE");
  if (!price.ok) return price;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const machineCostPerUnit = machine.value.times(cycle.value).div("3600");
  const laborCostPerUnit = labor.value.times(cycle.value).div("3600");
  const overheadCostPerUnit = overhead.value.div(volume.value);
  const qualityServiceCostPerUnit = qualityService.value.div(volume.value);
  const fullyLoadedCostPerUnit = material.value
    .plus(machineCostPerUnit)
    .plus(laborCostPerUnit)
    .plus(overheadCostPerUnit)
    .plus(qualityServiceCostPerUnit);
  const grossProfitPerUnit = price.value.minus(fullyLoadedCostPerUnit);
  const grossMarginRatio = grossProfitPerUnit.div(price.value);
  const targetPricePerUnit = fullyLoadedCostPerUnit.div(context.DecimalConstructor("1").minus(targetMargin.value));
  const priceGapToTarget = price.value.minus(targetPricePerUnit);
  const marginGapToTarget = grossMarginRatio.minus(targetMargin.value);
  const annualRevenue = price.value.times(volume.value);
  const annualFullyLoadedCost = fullyLoadedCostPerUnit.times(volume.value);
  const annualGrossProfit = annualRevenue.minus(annualFullyLoadedCost);
  const annualProfitUncertainty = annualFullyLoadedCost.times(context.DecimalConstructor("1").minus(confidence.value));
  const annualProfitLowerBound = annualGrossProfit.minus(annualProfitUncertainty);
  const annualProfitUpperBound = annualGrossProfit.plus(annualProfitUncertainty);
  const drivers = [material.value, machineCostPerUnit, laborCostPerUnit, overheadCostPerUnit, qualityServiceCostPerUnit] as const;
  let primaryUnitCostDriver: 0 | 1 | 2 | 3 | 4 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryUnitCostDriver])) primaryUnitCostDriver = index as 1 | 2 | 3 | 4;
  }
  const decisionState: 0 | 1 | 2 = annualProfitLowerBound.gte("0") && marginGapToTarget.gte("0")
    ? 0
    : annualProfitUpperBound.gte("0") ? 1 : 2;

  return ok({
    machineCostPerUnit,
    laborCostPerUnit,
    materialCostPerUnit: material.value,
    overheadCostPerUnit,
    qualityServiceCostPerUnit,
    fullyLoadedCostPerUnit,
    currentSellingPricePerUnit: price.value,
    grossProfitPerUnit,
    grossMarginRatio,
    targetGrossMarginRatio: targetMargin.value,
    targetPricePerUnit,
    priceGapToTarget,
    marginGapToTarget,
    annualRevenue,
    annualFullyLoadedCost,
    annualGrossProfit,
    sourceConfidenceRatio: confidence.value,
    annualProfitUncertainty,
    annualProfitLowerBound,
    annualProfitUpperBound,
    primaryUnitCostDriver,
    decisionState,
  });
}
