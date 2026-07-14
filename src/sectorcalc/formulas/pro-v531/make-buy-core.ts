import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const MAKE_BUY_FORMULA_VERSION = "2.0.0";
export const MAKE_BUY_SCHEMA_VERSION = "5.3.1-pro-make-buy.1";
export const MAKE_BUY_MODEL_ID = "PRO_RISK_ADJUSTED_MAKE_BUY_COST_DELTA_V2";
export const MAKE_BUY_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface MakeBuyInputs {
  inHouseMaterialCostPerUnit: string | number;
  inHouseLaborCostPerUnit: string | number;
  inHouseOverheadCostPerUnit: string | number;
  inHouseAnnualSetupCost: string | number;
  outsourcePricePerUnit: string | number;
  outsourceLogisticsCostPerUnit: string | number;
  annualVolume: string | number;
  outsourceQualityRiskRatio: string | number;
  sourceConfidenceRatio: string | number;
}

export interface MakeBuyResult {
  inHouseVariableCostPerUnit: Decimal;
  setupCostPerUnit: Decimal;
  inHouseTotalCostPerUnit: Decimal;
  outsourceBaseCostPerUnit: Decimal;
  qualityRiskPremiumPerUnit: Decimal;
  outsourceRiskAdjustedCostPerUnit: Decimal;
  inHouseAnnualCost: Decimal;
  outsourceAnnualCost: Decimal;
  annualCostDelta: Decimal;
  costDeltaPerUnit: Decimal;
  absoluteAnnualCostDifference: Decimal;
  sourceConfidenceRatio: Decimal;
  deltaUncertaintyAmount: Decimal;
  deltaLowerBound: Decimal;
  deltaUpperBound: Decimal;
  primaryInHouseCostDriver: 0 | 1 | 2 | 3;
  decisionState: 0 | 1 | 2;
}

type Kind = "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateMakeBuy(inputs: MakeBuyInputs): DomainResult<MakeBuyResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: Kind): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
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

  const material = read(inputs.inHouseMaterialCostPerUnit, "in_house_material_cost_per_unit", "NON_NEGATIVE");
  if (!material.ok) return material;
  const labor = read(inputs.inHouseLaborCostPerUnit, "in_house_labor_cost_per_unit", "NON_NEGATIVE");
  if (!labor.ok) return labor;
  const overhead = read(inputs.inHouseOverheadCostPerUnit, "in_house_overhead_cost_per_unit", "NON_NEGATIVE");
  if (!overhead.ok) return overhead;
  const setup = read(inputs.inHouseAnnualSetupCost, "in_house_annual_setup_cost", "NON_NEGATIVE");
  if (!setup.ok) return setup;
  const outsourcePrice = read(inputs.outsourcePricePerUnit, "outsource_price_per_unit", "NON_NEGATIVE");
  if (!outsourcePrice.ok) return outsourcePrice;
  const logistics = read(inputs.outsourceLogisticsCostPerUnit, "outsource_logistics_cost_per_unit", "NON_NEGATIVE");
  if (!logistics.ok) return logistics;
  const volume = read(inputs.annualVolume, "annual_volume", "POSITIVE_INTEGER");
  if (!volume.ok) return volume;
  const qualityRisk = read(inputs.outsourceQualityRiskRatio, "outsource_quality_risk_ratio", "RATIO");
  if (!qualityRisk.ok) return qualityRisk;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const inHouseVariableCostPerUnit = material.value.plus(labor.value).plus(overhead.value);
  const setupCostPerUnit = setup.value.div(volume.value);
  const inHouseTotalCostPerUnit = inHouseVariableCostPerUnit.plus(setupCostPerUnit);
  const outsourceBaseCostPerUnit = outsourcePrice.value.plus(logistics.value);
  const qualityRiskPremiumPerUnit = outsourceBaseCostPerUnit.times(qualityRisk.value);
  const outsourceRiskAdjustedCostPerUnit = outsourceBaseCostPerUnit.plus(qualityRiskPremiumPerUnit);
  const inHouseAnnualCost = inHouseVariableCostPerUnit.times(volume.value).plus(setup.value);
  const outsourceAnnualCost = outsourceRiskAdjustedCostPerUnit.times(volume.value);
  const annualCostDelta = outsourceAnnualCost.minus(inHouseAnnualCost);
  const costDeltaPerUnit = outsourceRiskAdjustedCostPerUnit.minus(inHouseTotalCostPerUnit);
  const absoluteAnnualCostDifference = annualCostDelta.abs();
  const uncertaintyBasis = inHouseAnnualCost.abs().gte(outsourceAnnualCost.abs())
    ? inHouseAnnualCost.abs()
    : outsourceAnnualCost.abs();
  const deltaUncertaintyAmount = uncertaintyBasis.times(context.DecimalConstructor("1").minus(confidence.value));
  const deltaLowerBound = annualCostDelta.minus(deltaUncertaintyAmount);
  const deltaUpperBound = annualCostDelta.plus(deltaUncertaintyAmount);

  const drivers = [material.value, labor.value, overhead.value, setupCostPerUnit] as const;
  let primaryInHouseCostDriver: 0 | 1 | 2 | 3 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryInHouseCostDriver])) {
      primaryInHouseCostDriver = index as 1 | 2 | 3;
    }
  }
  const decisionState: 0 | 1 | 2 = deltaLowerBound.gt("0")
    ? 0
    : deltaUpperBound.lt("0") ? 1 : 2;

  return ok({
    inHouseVariableCostPerUnit,
    setupCostPerUnit,
    inHouseTotalCostPerUnit,
    outsourceBaseCostPerUnit,
    qualityRiskPremiumPerUnit,
    outsourceRiskAdjustedCostPerUnit,
    inHouseAnnualCost,
    outsourceAnnualCost,
    annualCostDelta,
    costDeltaPerUnit,
    absoluteAnnualCostDifference,
    sourceConfidenceRatio: confidence.value,
    deltaUncertaintyAmount,
    deltaLowerBound,
    deltaUpperBound,
    primaryInHouseCostDriver,
    decisionState,
  });
}
