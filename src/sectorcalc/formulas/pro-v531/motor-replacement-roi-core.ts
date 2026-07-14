import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const MOTOR_REPLACEMENT_FORMULA_VERSION = "2.0.0";
export const MOTOR_REPLACEMENT_SCHEMA_VERSION = "5.3.1-pro-motor-replacement-roi.1";
export const MOTOR_REPLACEMENT_MODEL_ID = "PRO_MOTOR_REPLACEMENT_DISCOUNTED_ENERGY_ROI_V2";
export const MOTOR_REPLACEMENT_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface MotorReplacementInputs {
  shaftPowerKw: string | number;
  annualOperatingHours: string | number;
  currentEfficiencyRatio: string | number;
  newEfficiencyRatio: string | number;
  energyRatePerKwh: string | number;
  replacementCost: string | number;
  installationCost: string | number;
  annualMaintenanceSaving: string | number;
  equipmentLifeYears: string | number;
  discountRateRatio: string | number;
  sourceConfidenceRatio: string | number;
}

export interface MotorReplacementResult {
  currentEnergyKwh: Decimal;
  newEnergyKwh: Decimal;
  annualEnergySavingKwh: Decimal;
  currentEnergyCost: Decimal;
  newEnergyCost: Decimal;
  annualEnergyCostSaving: Decimal;
  annualMaintenanceSaving: Decimal;
  annualNetSaving: Decimal;
  totalInvestment: Decimal;
  presentValueFactor: Decimal;
  discountedSavings: Decimal;
  netPresentValue: Decimal;
  annualRoiRatio: Decimal;
  breakEvenAnnualSaving: Decimal;
  sourceConfidenceRatio: Decimal;
  annualSavingUncertainty: Decimal;
  npvUncertaintyAmount: Decimal;
  npvLowerBound: Decimal;
  npvUpperBound: Decimal;
  primarySavingDriver: 0 | 1;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateMotorReplacement(
  inputs: MotorReplacementInputs,
): DomainResult<MotorReplacementResult> {
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
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const power = read(inputs.shaftPowerKw, "shaft_power_kw", "POSITIVE");
  if (!power.ok) return power;
  const hours = read(inputs.annualOperatingHours, "annual_operating_hours", "POSITIVE");
  if (!hours.ok) return hours;
  if (hours.value.gt("8760")) {
    return err({ code: "DOMAIN_VIOLATION", field: "annual_operating_hours", message: "Annual operating hours cannot exceed 8,760." });
  }
  const currentEfficiency = read(inputs.currentEfficiencyRatio, "current_efficiency_ratio", "RATIO");
  if (!currentEfficiency.ok) return currentEfficiency;
  if (currentEfficiency.value.eq("0")) {
    return err({ code: "DOMAIN_VIOLATION", field: "current_efficiency_ratio", message: "Current efficiency must be greater than zero." });
  }
  const newEfficiency = read(inputs.newEfficiencyRatio, "new_efficiency_ratio", "RATIO");
  if (!newEfficiency.ok) return newEfficiency;
  if (newEfficiency.value.eq("0")) {
    return err({ code: "DOMAIN_VIOLATION", field: "new_efficiency_ratio", message: "New efficiency must be greater than zero." });
  }
  const energyRate = read(inputs.energyRatePerKwh, "energy_rate_per_kwh", "NON_NEGATIVE");
  if (!energyRate.ok) return energyRate;
  const replacement = read(inputs.replacementCost, "replacement_cost", "NON_NEGATIVE");
  if (!replacement.ok) return replacement;
  const installation = read(inputs.installationCost, "installation_cost", "NON_NEGATIVE");
  if (!installation.ok) return installation;
  const totalInvestment = replacement.value.plus(installation.value);
  if (totalInvestment.lte("0")) {
    return err({ code: "DOMAIN_VIOLATION", field: "total_investment", message: "Replacement plus installation cost must be greater than zero." });
  }
  const maintenance = read(inputs.annualMaintenanceSaving, "annual_maintenance_saving", "NON_NEGATIVE");
  if (!maintenance.ok) return maintenance;
  const life = read(inputs.equipmentLifeYears, "equipment_life_years", "POSITIVE_INTEGER");
  if (!life.ok) return life;
  if (life.value.gt("100")) {
    return err({ code: "DOMAIN_VIOLATION", field: "equipment_life_years", message: "Equipment life cannot exceed 100 years." });
  }
  const discount = read(inputs.discountRateRatio, "discount_rate_ratio", "RATIO");
  if (!discount.ok) return discount;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const shaftEnergyKwh = power.value.times(hours.value);
  const currentEnergyKwh = shaftEnergyKwh.div(currentEfficiency.value);
  const newEnergyKwh = shaftEnergyKwh.div(newEfficiency.value);
  const annualEnergySavingKwh = currentEnergyKwh.minus(newEnergyKwh);
  const currentEnergyCost = currentEnergyKwh.times(energyRate.value);
  const newEnergyCost = newEnergyKwh.times(energyRate.value);
  const annualEnergyCostSaving = currentEnergyCost.minus(newEnergyCost);
  const annualNetSaving = annualEnergyCostSaving.plus(maintenance.value);

  let presentValueFactor = context.DecimalConstructor("0");
  const onePlusRate = context.DecimalConstructor("1").plus(discount.value);
  const years = Number(life.value.toString());
  for (let year = 1; year <= years; year += 1) {
    presentValueFactor = presentValueFactor.plus(context.DecimalConstructor("1").div(onePlusRate.pow(year)));
  }
  const discountedSavings = annualNetSaving.times(presentValueFactor);
  const netPresentValue = discountedSavings.minus(totalInvestment);
  const annualRoiRatio = annualNetSaving.div(totalInvestment);
  const breakEvenAnnualSaving = totalInvestment.div(presentValueFactor);
  const annualSavingUncertainty = annualNetSaving.abs().times(context.DecimalConstructor("1").minus(confidence.value));
  const npvUncertaintyAmount = annualSavingUncertainty.times(presentValueFactor);
  const npvLowerBound = netPresentValue.minus(npvUncertaintyAmount);
  const npvUpperBound = netPresentValue.plus(npvUncertaintyAmount);
  const decisionState: 0 | 1 | 2 = npvLowerBound.gte("0") ? 0 : npvUpperBound.gte("0") ? 1 : 2;

  return ok({
    currentEnergyKwh,
    newEnergyKwh,
    annualEnergySavingKwh,
    currentEnergyCost,
    newEnergyCost,
    annualEnergyCostSaving,
    annualMaintenanceSaving: maintenance.value,
    annualNetSaving,
    totalInvestment,
    presentValueFactor,
    discountedSavings,
    netPresentValue,
    annualRoiRatio,
    breakEvenAnnualSaving,
    sourceConfidenceRatio: confidence.value,
    annualSavingUncertainty,
    npvUncertaintyAmount,
    npvLowerBound,
    npvUpperBound,
    primarySavingDriver: annualEnergyCostSaving.abs().gte(maintenance.value) ? 0 : 1,
    decisionState,
  });
}
