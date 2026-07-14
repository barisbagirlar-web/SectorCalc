import "server-only";

import {
  createDecimalContext,
  err,
  ok,
  type Decimal,
  type DecimalSource,
  type DomainResult,
} from "./pro-decimal-domain";

export const WELD_COST_FORMULA_VERSION = "5.4.0-weld-cost-decimal.1";
export const WELD_COST_SCHEMA_VERSION = "5.4.0-weld-cost-contract.1";
export const WELD_COST_MODEL_ID = "EQUAL_LEG_SINGLE_FILLET_WELD_COST_V1";
export const WELD_COST_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface WeldCostInput {
  weldLengthM: DecimalSource;
  effectiveThroatMm: DecimalSource;
  densityGPerCm3: DecimalSource;
  wireCostPerKg: DecimalSource;
  gasCostPerMinute: DecimalSource;
  arcTimeMinutes: DecimalSource;
  elapsedWeldTimeMinutes: DecimalSource;
  laborRatePerHour: DecimalSource;
  overheadRatePerHour: DecimalSource;
  depositionEfficiencyRatio: DecimalSource;
  sourceConfidenceRatio: DecimalSource;
}

export interface WeldCostOutput {
  crossSectionAreaMm2: Decimal;
  depositedWeldMetalMassKg: Decimal;
  wireMassKg: Decimal;
  wireCost: Decimal;
  shieldingGasCost: Decimal;
  laborCost: Decimal;
  shopOverhead: Decimal;
  baseProductionCost: Decimal;
  totalEstimatedCost: Decimal;
  costPerMeter: Decimal;
  arcTimeRatio: Decimal;
  depositionEfficiencyRatio: Decimal;
  sourceConfidenceRatio: Decimal;
  costUncertainty: Decimal;
  totalCostLowerBound: Decimal;
  totalCostUpperBound: Decimal;
  costPerMeterLowerBound: Decimal;
  costPerMeterUpperBound: Decimal;
  primaryCostDriver: 0 | 1 | 2 | 3;
  decisionState: 0 | 1;
}

function domainViolation(field: string, message: string): DomainResult<never> {
  return err({ code: "DOMAIN_VIOLATION", field, message });
}

export function evaluateWeldCost(input: WeldCostInput): DomainResult<WeldCostOutput> {
  const { decimal, divide } = createDecimalContext();
  const parsed = {
    weldLengthM: decimal(input.weldLengthM, "weldLengthM"),
    effectiveThroatMm: decimal(input.effectiveThroatMm, "effectiveThroatMm"),
    densityGPerCm3: decimal(input.densityGPerCm3, "densityGPerCm3"),
    wireCostPerKg: decimal(input.wireCostPerKg, "wireCostPerKg"),
    gasCostPerMinute: decimal(input.gasCostPerMinute, "gasCostPerMinute"),
    arcTimeMinutes: decimal(input.arcTimeMinutes, "arcTimeMinutes"),
    elapsedWeldTimeMinutes: decimal(input.elapsedWeldTimeMinutes, "elapsedWeldTimeMinutes"),
    laborRatePerHour: decimal(input.laborRatePerHour, "laborRatePerHour"),
    overheadRatePerHour: decimal(input.overheadRatePerHour, "overheadRatePerHour"),
    depositionEfficiencyRatio: decimal(input.depositionEfficiencyRatio, "depositionEfficiencyRatio"),
    sourceConfidenceRatio: decimal(input.sourceConfidenceRatio, "sourceConfidenceRatio"),
  };

  if (!parsed.weldLengthM.ok) return parsed.weldLengthM;
  if (!parsed.effectiveThroatMm.ok) return parsed.effectiveThroatMm;
  if (!parsed.densityGPerCm3.ok) return parsed.densityGPerCm3;
  if (!parsed.wireCostPerKg.ok) return parsed.wireCostPerKg;
  if (!parsed.gasCostPerMinute.ok) return parsed.gasCostPerMinute;
  if (!parsed.arcTimeMinutes.ok) return parsed.arcTimeMinutes;
  if (!parsed.elapsedWeldTimeMinutes.ok) return parsed.elapsedWeldTimeMinutes;
  if (!parsed.laborRatePerHour.ok) return parsed.laborRatePerHour;
  if (!parsed.overheadRatePerHour.ok) return parsed.overheadRatePerHour;
  if (!parsed.depositionEfficiencyRatio.ok) return parsed.depositionEfficiencyRatio;
  if (!parsed.sourceConfidenceRatio.ok) return parsed.sourceConfidenceRatio;

  const weldLengthM = parsed.weldLengthM.value;
  const effectiveThroatMm = parsed.effectiveThroatMm.value;
  const densityGPerCm3 = parsed.densityGPerCm3.value;
  const wireCostPerKg = parsed.wireCostPerKg.value;
  const gasCostPerMinute = parsed.gasCostPerMinute.value;
  const arcTimeMinutes = parsed.arcTimeMinutes.value;
  const elapsedWeldTimeMinutes = parsed.elapsedWeldTimeMinutes.value;
  const laborRatePerHour = parsed.laborRatePerHour.value;
  const overheadRatePerHour = parsed.overheadRatePerHour.value;
  const depositionEfficiencyRatio = parsed.depositionEfficiencyRatio.value;
  const sourceConfidenceRatio = parsed.sourceConfidenceRatio.value;

  const positive: Array<readonly [string, Decimal]> = [
    ["weldLengthM", weldLengthM],
    ["effectiveThroatMm", effectiveThroatMm],
    ["densityGPerCm3", densityGPerCm3],
    ["arcTimeMinutes", arcTimeMinutes],
    ["elapsedWeldTimeMinutes", elapsedWeldTimeMinutes],
  ];
  for (const [field, value] of positive) {
    if (value.lte("0")) return domainViolation(field, field + " must be greater than zero.");
  }

  const nonNegative: Array<readonly [string, Decimal]> = [
    ["wireCostPerKg", wireCostPerKg],
    ["gasCostPerMinute", gasCostPerMinute],
    ["laborRatePerHour", laborRatePerHour],
    ["overheadRatePerHour", overheadRatePerHour],
  ];
  for (const [field, value] of nonNegative) {
    if (value.lt("0")) return domainViolation(field, field + " cannot be negative.");
  }

  if (depositionEfficiencyRatio.lte("0") || depositionEfficiencyRatio.gt("1")) {
    return domainViolation("depositionEfficiencyRatio", "depositionEfficiencyRatio must be in the interval (0, 1].");
  }
  if (sourceConfidenceRatio.lt("0") || sourceConfidenceRatio.gt("1")) {
    return domainViolation("sourceConfidenceRatio", "sourceConfidenceRatio must be in the interval [0, 1].");
  }
  if (arcTimeMinutes.gt(elapsedWeldTimeMinutes)) {
    return domainViolation("arcTimeMinutes", "Arc-on time cannot exceed elapsed weld operation time.");
  }

  // For one equivalent equal-leg fillet, effective throat a gives area a^2.
  const crossSectionAreaMm2 = effectiveThroatMm.times(effectiveThroatMm);
  // L[m] * A[mm2] * rho[g/cm3] / 1000 = deposited mass [kg].
  const depositedWeldMetalMassKg = weldLengthM
    .times(crossSectionAreaMm2)
    .times(densityGPerCm3)
    .div("1000");
  const wireMass = divide(depositedWeldMetalMassKg, depositionEfficiencyRatio, "depositionEfficiencyRatio");
  if (!wireMass.ok) return wireMass;
  const wireMassKg = wireMass.value;

  const wireCost = wireMassKg.times(wireCostPerKg);
  const shieldingGasCost = gasCostPerMinute.times(arcTimeMinutes);
  const elapsedHours = elapsedWeldTimeMinutes.div("60");
  const laborCost = laborRatePerHour.times(elapsedHours);
  const shopOverhead = overheadRatePerHour.times(elapsedHours);
  const baseProductionCost = wireCost.plus(shieldingGasCost).plus(laborCost);
  const totalEstimatedCost = baseProductionCost.plus(shopOverhead);
  const costPerMeterResult = divide(totalEstimatedCost, weldLengthM, "weldLengthM");
  if (!costPerMeterResult.ok) return costPerMeterResult;
  const arcTimeRatioResult = divide(arcTimeMinutes, elapsedWeldTimeMinutes, "elapsedWeldTimeMinutes");
  if (!arcTimeRatioResult.ok) return arcTimeRatioResult;

  const costUncertainty = totalEstimatedCost.times(sourceConfidenceRatio.minus("1").abs());
  const totalCostLowerBound = totalEstimatedCost.minus(costUncertainty);
  const totalCostUpperBound = totalEstimatedCost.plus(costUncertainty);
  const lowerPerMeter = divide(totalCostLowerBound, weldLengthM, "weldLengthM");
  if (!lowerPerMeter.ok) return lowerPerMeter;
  const upperPerMeter = divide(totalCostUpperBound, weldLengthM, "weldLengthM");
  if (!upperPerMeter.ok) return upperPerMeter;

  const components = [wireCost, shieldingGasCost, laborCost, shopOverhead] as const;
  let primaryCostDriver: 0 | 1 | 2 | 3 = 0;
  for (let index = 1; index < components.length; index += 1) {
    if (components[index].gt(components[primaryCostDriver])) {
      primaryCostDriver = index as 0 | 1 | 2 | 3;
    }
  }

  const decisionState: 0 | 1 = totalCostLowerBound.eq("0") ? 1 : 0;
  return ok({
    crossSectionAreaMm2,
    depositedWeldMetalMassKg,
    wireMassKg,
    wireCost,
    shieldingGasCost,
    laborCost,
    shopOverhead,
    baseProductionCost,
    totalEstimatedCost,
    costPerMeter: costPerMeterResult.value,
    arcTimeRatio: arcTimeRatioResult.value,
    depositionEfficiencyRatio,
    sourceConfidenceRatio,
    costUncertainty,
    totalCostLowerBound,
    totalCostUpperBound,
    costPerMeterLowerBound: lowerPerMeter.value,
    costPerMeterUpperBound: upperPerMeter.value,
    primaryCostDriver,
    decisionState,
  });
}
