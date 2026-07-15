import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import type { ProFormulaResult } from "./pro-formula-contract";
import {
  createValidationState,
  finalizeResult,
  requireFiniteInputs,
  requireInteger,
  requireNonNegative,
  requirePositive,
  requireRange,
  roundDisplay,
} from "./pro-formula-safety";

export const toolKey = "machine-investment-feasibility-buy-lease-keep";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_initial_investment",
  "n_annual_net_cash_flow",
  "n_discount_rate",
  "n_analysis_years",
  "n_residual_value",
  "n_stress_downside_factor",
  "n_annual_volume",
  "n_labor_rate",
  "n_overhead_rate",
  "n_defect_or_loss_cost",
  "n_source_confidence_ratio",
  "n_uncertainty_multiplier",
] as const;

export const declaredOutputKeys = [
  "out_evidence_completeness",
  "out_normalized_demand",
  "out_reference_deviation",
  "out_derating_factor",
  "out_demand_metric",
  "out_capacity_metric",
  "out_utilization_margin",
  "out_expanded_uncertainty",
  "out_threshold_crossing",
  "out_sensitivity_driver",
  "out_fmea_trigger",
  "out_money_at_risk",
  "out_scenario_delta",
  "out_audit_hash_payload",
  "out_final_decision_state",
] as const;

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

function annuityNpv(
  initialCost: number,
  annualCashFlow: number,
  discountRate: number,
  years: number,
  residualValue = 0,
): number {
  let npv = -initialCost;
  for (let year = 1; year <= years; year += 1) {
    npv += annualCashFlow / (1 + discountRate) ** year;
  }
  npv += residualValue / (1 + discountRate) ** years;
  return npv;
}

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const state = createValidationState();
  const v = requireFiniteInputs(inputs, requiredInputKeys, state);
  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const buyCost = v.n_initial_investment;
  const commonAnnualBenefit = v.n_annual_net_cash_flow;
  const discountRate = v.n_discount_rate;
  const years = v.n_analysis_years;
  const buyResidual = v.n_residual_value;
  const downsideRetention = v.n_stress_downside_factor;
  const keepRefurbishmentCost = v.n_annual_volume;
  const annualLeasePayment = v.n_labor_rate;
  const leaseInitialFees = v.n_overhead_rate;
  const keepAnnualBenefit = v.n_defect_or_loss_cost;
  const confidence = v.n_source_confidence_ratio;
  const uncertaintyMultiplier = v.n_uncertainty_multiplier;

  requirePositive(buyCost, "Buy purchase and installation cost", state);
  requireNonNegative(commonAnnualBenefit, "Annual operating benefit", state);
  requireRange(discountRate, 0, 1, "Discount rate", state, { maxInclusive: false });
  requireInteger(years, 1, 100, "Analysis years", state);
  requireNonNegative(buyResidual, "Buy residual value", state);
  requireRange(downsideRetention, 0, 1, "Downside benefit retention", state);
  requireNonNegative(keepRefurbishmentCost, "Keep refurbishment cost", state);
  requireNonNegative(annualLeasePayment, "Annual lease payment", state);
  requireNonNegative(leaseInitialFees, "Lease initial fees", state);
  requireNonNegative(keepAnnualBenefit, "Keep annual net benefit", state);
  requireRange(confidence, 0, 1, "Source confidence", state);
  requireRange(uncertaintyMultiplier, 0, 5, "Uncertainty multiplier", state, {
    minInclusive: false,
  });

  if (buyResidual > buyCost) {
    state.warnings.push("Buy residual value exceeds purchase cost; verify the terminal-value basis.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const buyNpv = annuityNpv(
    buyCost,
    commonAnnualBenefit,
    discountRate,
    years,
    buyResidual,
  );
  const leaseAnnualNet = commonAnnualBenefit - annualLeasePayment;
  const leaseNpv = annuityNpv(
    leaseInitialFees,
    leaseAnnualNet,
    discountRate,
    years,
  );
  const keepNpv = annuityNpv(
    keepRefurbishmentCost,
    keepAnnualBenefit,
    discountRate,
    years,
  );

  const stressedBuyNpv = annuityNpv(
    buyCost,
    commonAnnualBenefit * downsideRetention,
    discountRate,
    years,
    buyResidual,
  );
  const stressedLeaseNpv = annuityNpv(
    leaseInitialFees,
    commonAnnualBenefit * downsideRetention - annualLeasePayment,
    discountRate,
    years,
  );
  const stressedKeepNpv = annuityNpv(
    keepRefurbishmentCost,
    keepAnnualBenefit * downsideRetention,
    discountRate,
    years,
  );

  const baseNpvs = [buyNpv, leaseNpv, keepNpv];
  const stressedNpvs = [stressedBuyNpv, stressedLeaseNpv, stressedKeepNpv];
  const bestBaseNpv = Math.max(...baseNpvs);
  const bestStressedNpv = Math.max(...stressedNpvs);
  const baseDecision = baseNpvs.indexOf(bestBaseNpv); // 0 BUY, 1 LEASE, 2 KEEP
  const stressedDecision = stressedNpvs.indexOf(bestStressedNpv);
  const sortedBase = [...baseNpvs].sort((a, b) => b - a);
  const decisionMargin = sortedBase[0] - sortedBase[1];
  const downsideDelta = bestBaseNpv - bestStressedNpv;
  const uncertainty =
    Math.abs(downsideDelta) * uncertaintyMultiplier +
    Math.abs(bestBaseNpv) * (1 - confidence);

  let finalDecision = baseDecision;
  let status: "OK" | "REVIEW" = "OK";
  if (
    bestBaseNpv <= 0 ||
    bestStressedNpv < 0 ||
    stressedDecision !== baseDecision ||
    confidence < 0.7 ||
    decisionMargin <= uncertainty
  ) {
    finalDecision = 3; // REVIEW
    status = "REVIEW";
  }

  if (stressedDecision !== baseDecision) {
    state.warnings.push("The preferred option changes under the downside scenario.");
  }
  if (decisionMargin <= uncertainty) {
    state.warnings.push("The NPV margin between the leading options is within the uncertainty band.");
  }
  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify buy, lease and keep cash-flow evidence.");
  }

  const capitalDrivers = [buyCost, annualLeasePayment * years, keepRefurbishmentCost];
  const sensitivityDriver = capitalDrivers.indexOf(Math.max(...capitalDrivers));
  const moneyAtRisk = Math.max(0, -bestStressedNpv) + uncertainty;

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(commonAnnualBenefit, 2),
    out_reference_deviation: roundDisplay(decisionMargin, 2),
    out_derating_factor: roundDisplay(downsideRetention * confidence, 4),
    out_demand_metric: roundDisplay(buyNpv, 2),
    out_capacity_metric: roundDisplay(leaseNpv, 2),
    out_utilization_margin: roundDisplay(keepNpv, 2),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: bestBaseNpv > 0 ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: finalDecision === 3 ? 1 : 0,
    out_money_at_risk: roundDisplay(moneyAtRisk, 2),
    out_scenario_delta: roundDisplay(downsideDelta, 2),
    out_audit_hash_payload: 0,
    out_final_decision_state: finalDecision,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status,
  });
}
