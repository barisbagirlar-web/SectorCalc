import "server-only";
import { ENERGY_INCENTIVE_ARITHMETIC_MODE, ENERGY_INCENTIVE_FORMULA_VERSION, ENERGY_INCENTIVE_MODEL_ID, evaluateEnergyIncentive } from "./energy-incentive-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "energy-efficiency-grant-incentive-feasibility-pack";
export const formulaVersion = ENERGY_INCENTIVE_FORMULA_VERSION;
export const arithmeticMode = ENERGY_INCENTIVE_ARITHMETIC_MODE;
export const modelId = ENERGY_INCENTIVE_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/energy-incentive.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];
const REQUIRED = ["n_current_kwh_per_year", "n_target_kwh_per_year", "n_avg_kwh_rate", "n_implementation_cost", "n_grant_coverage_pct", "n_maintenance_cost_saving", "n_emission_factor_kgco2_per_kwh", "n_equipment_life_years", "n_discount_rate", "n_source_confidence_ratio"] as const;
function blocked(warnings: string[]): ProFormulaResult { return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" }; }
export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateEnergyIncentive({ currentEnergyKwhPerYear: inputs.n_current_kwh_per_year, targetEnergyKwhPerYear: inputs.n_target_kwh_per_year,
    energyRatePerKwh: inputs.n_avg_kwh_rate, implementationCost: inputs.n_implementation_cost, grantCoverageRatio: inputs.n_grant_coverage_pct,
    annualMaintenanceSaving: inputs.n_maintenance_cost_saving, emissionFactorKgCo2ePerKwh: inputs.n_emission_factor_kgco2_per_kwh,
    equipmentLifeYears: inputs.n_equipment_life_years, discountRate: inputs.n_discount_rate, sourceConfidenceRatio: inputs.n_source_confidence_ratio });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_annual_energy_saving_kwh", value.annualEnergySavingKwh], ["out_energy_reduction_ratio", value.energyReductionRatio],
    ["out_annual_energy_cost_saving", value.annualEnergyCostSaving], ["out_annual_maintenance_saving", value.annualMaintenanceSaving],
    ["out_annual_total_cash_saving", value.annualTotalCashSaving], ["out_grant_amount", value.grantAmount],
    ["out_net_investment_cost", value.netInvestmentCost], ["out_annuity_present_value_factor", value.annuityPresentValueFactor],
    ["out_discounted_lifetime_savings", value.discountedLifetimeSavings], ["out_grant_adjusted_net_present_value", value.grantAdjustedNetPresentValue],
    ["out_gross_investment_benefit_cost_ratio", value.grossInvestmentBenefitCostRatio], ["out_gross_investment_discounted_roi_ratio", value.grossInvestmentDiscountedRoiRatio],
    ["out_simple_payback_years", value.simplePaybackYears], ["out_annual_co2e_reduction_tonnes", value.annualCo2eReductionTonnes],
    ["out_lifetime_energy_saving_kwh", value.lifetimeEnergySavingKwh], ["out_lifetime_co2e_reduction_tonnes", value.lifetimeCo2eReductionTonnes],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio], ["out_npv_uncertainty", value.npvUncertainty],
    ["out_npv_lower_bound", value.npvLowerBound], ["out_npv_upper_bound", value.npvUpperBound], ["out_money_at_risk", value.moneyAtRisk],
  ];
  const outputs: Record<string, number> = {}; const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) { const presented = decimalToPresentationNumber(exactValue, id); if (!presented.ok) return blocked([domainErrorMessage(presented.error)]); outputs[id] = presented.value; decimalOutputs[id] = exactValue.toString(); }
  outputs.out_primary_benefit_driver = value.primaryBenefitDriver; outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_benefit_driver = String(value.primaryBenefitDriver); decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2 ? ["The grant-adjusted NPV upper bound is negative; hold the project or improve verified savings and funding."] : value.decisionState === 1 ? ["The grant-adjusted NPV evidence interval crosses zero; review measurements, grant eligibility, and cost evidence."] : [];
  return { status: warnings.length ? "REVIEW" : "OK", outputs, decimalOutputs, warnings, outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
