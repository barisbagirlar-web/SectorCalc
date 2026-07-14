import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const ENERGY_INCENTIVE_FORMULA_VERSION = "2.0.0";
export const ENERGY_INCENTIVE_SCHEMA_VERSION = "5.3.1-pro-energy-incentive.1";
export const ENERGY_INCENTIVE_MODEL_ID = "PRO_ENERGY_GRANT_DISCOUNTED_SAVINGS_V2";
export const ENERGY_INCENTIVE_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface EnergyIncentiveInputs {
  currentEnergyKwhPerYear: string | number;
  targetEnergyKwhPerYear: string | number;
  energyRatePerKwh: string | number;
  implementationCost: string | number;
  grantCoverageRatio: string | number;
  annualMaintenanceSaving: string | number;
  emissionFactorKgCo2ePerKwh: string | number;
  equipmentLifeYears: string | number;
  discountRate: string | number;
  sourceConfidenceRatio: string | number;
}

export interface EnergyIncentiveResult {
  annualEnergySavingKwh: Decimal;
  energyReductionRatio: Decimal;
  annualEnergyCostSaving: Decimal;
  annualMaintenanceSaving: Decimal;
  annualTotalCashSaving: Decimal;
  grantAmount: Decimal;
  netInvestmentCost: Decimal;
  annuityPresentValueFactor: Decimal;
  discountedLifetimeSavings: Decimal;
  grantAdjustedNetPresentValue: Decimal;
  grossInvestmentBenefitCostRatio: Decimal;
  grossInvestmentDiscountedRoiRatio: Decimal;
  simplePaybackYears: Decimal;
  annualCo2eReductionTonnes: Decimal;
  lifetimeEnergySavingKwh: Decimal;
  lifetimeCo2eReductionTonnes: Decimal;
  sourceConfidenceRatio: Decimal;
  npvUncertainty: Decimal;
  npvLowerBound: Decimal;
  npvUpperBound: Decimal;
  moneyAtRisk: Decimal;
  primaryBenefitDriver: 0 | 1 | 2;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateEnergyIncentive(inputs: EnergyIncentiveInputs): DomainResult<EnergyIncentiveResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: Kind): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (kind === "POSITIVE" && parsed.value.lte("0")) return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    if (kind === "NON_NEGATIVE" && parsed.value.lt("0")) return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    if (kind === "POSITIVE_INTEGER" && (parsed.value.lte("0") || !parsed.value.round(0, 0).eq(parsed.value))) return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer count.` });
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    return parsed;
  };
  const current = read(inputs.currentEnergyKwhPerYear, "current_energy_kwh_per_year", "POSITIVE");
  if (!current.ok) return current;
  const target = read(inputs.targetEnergyKwhPerYear, "target_energy_kwh_per_year", "NON_NEGATIVE");
  if (!target.ok) return target;
  if (target.value.gte(current.value)) return err({ code: "DOMAIN_VIOLATION", field: "target_energy_kwh_per_year", message: "Target annual energy must be lower than current annual energy." });
  const rate = read(inputs.energyRatePerKwh, "energy_rate_per_kwh", "NON_NEGATIVE");
  if (!rate.ok) return rate;
  const implementation = read(inputs.implementationCost, "implementation_cost", "POSITIVE");
  if (!implementation.ok) return implementation;
  const grantRatio = read(inputs.grantCoverageRatio, "grant_coverage_ratio", "RATIO");
  if (!grantRatio.ok) return grantRatio;
  const maintenance = read(inputs.annualMaintenanceSaving, "annual_maintenance_saving", "NON_NEGATIVE");
  if (!maintenance.ok) return maintenance;
  const emissionFactor = read(inputs.emissionFactorKgCo2ePerKwh, "emission_factor_kgco2e_per_kwh", "NON_NEGATIVE");
  if (!emissionFactor.ok) return emissionFactor;
  const life = read(inputs.equipmentLifeYears, "equipment_life_years", "POSITIVE_INTEGER");
  if (!life.ok) return life;
  if (life.value.gt("50")) return err({ code: "DOMAIN_VIOLATION", field: "equipment_life_years", message: "Equipment life cannot exceed 50 years." });
  const discount = read(inputs.discountRate, "discount_rate", "RATIO");
  if (!discount.ok) return discount;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const one = context.DecimalConstructor("1");
  const zero = context.DecimalConstructor("0");
  const annualEnergySavingKwh = current.value.minus(target.value);
  const energyReductionRatio = annualEnergySavingKwh.div(current.value);
  const annualEnergyCostSaving = annualEnergySavingKwh.times(rate.value);
  const annualTotalCashSaving = annualEnergyCostSaving.plus(maintenance.value);
  if (!annualTotalCashSaving.gt("0")) return err({ code: "DOMAIN_VIOLATION", field: "annual_total_cash_saving", message: "At least one positive annual cash-saving source is required." });
  const grantAmount = implementation.value.times(grantRatio.value);
  const netInvestmentCost = implementation.value.minus(grantAmount);
  const discountBase = one.plus(discount.value);
  const years = Number(life.value.toString());
  let annuityPresentValueFactor = zero;
  for (let year = 1; year <= years; year += 1) annuityPresentValueFactor = annuityPresentValueFactor.plus(one.div(discountBase.pow(year)));
  const discountedLifetimeSavings = annualTotalCashSaving.times(annuityPresentValueFactor);
  const grantAdjustedNetPresentValue = discountedLifetimeSavings.minus(netInvestmentCost);
  const grossInvestmentBenefitCostRatio = discountedLifetimeSavings.plus(grantAmount).div(implementation.value);
  const grossInvestmentDiscountedRoiRatio = grantAdjustedNetPresentValue.div(implementation.value);
  const simplePaybackYears = netInvestmentCost.div(annualTotalCashSaving);
  const annualCo2eReductionTonnes = annualEnergySavingKwh.times(emissionFactor.value).div("1000");
  const lifetimeEnergySavingKwh = annualEnergySavingKwh.times(life.value);
  const lifetimeCo2eReductionTonnes = annualCo2eReductionTonnes.times(life.value);
  const npvUncertainty = discountedLifetimeSavings.times(one.minus(confidence.value));
  const npvLowerBound = grantAdjustedNetPresentValue.minus(npvUncertainty);
  const npvUpperBound = grantAdjustedNetPresentValue.plus(npvUncertainty);
  const moneyAtRisk = npvLowerBound.lt("0") ? npvLowerBound.abs() : zero;
  const drivers = [annualEnergyCostSaving.times(annuityPresentValueFactor), maintenance.value.times(annuityPresentValueFactor), grantAmount] as const;
  let primaryBenefitDriver: 0 | 1 | 2 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryBenefitDriver])) primaryBenefitDriver = index as 1 | 2;
  }
  const decisionState: 0 | 1 | 2 = npvLowerBound.gte("0") ? 0 : npvUpperBound.gte("0") ? 1 : 2;
  return ok({ annualEnergySavingKwh, energyReductionRatio, annualEnergyCostSaving, annualMaintenanceSaving: maintenance.value,
    annualTotalCashSaving, grantAmount, netInvestmentCost, annuityPresentValueFactor, discountedLifetimeSavings,
    grantAdjustedNetPresentValue, grossInvestmentBenefitCostRatio, grossInvestmentDiscountedRoiRatio,
    simplePaybackYears, annualCo2eReductionTonnes, lifetimeEnergySavingKwh, lifetimeCo2eReductionTonnes,
    sourceConfidenceRatio: confidence.value, npvUncertainty, npvLowerBound, npvUpperBound, moneyAtRisk,
    primaryBenefitDriver, decisionState });
}
