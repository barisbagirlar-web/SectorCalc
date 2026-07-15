import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import type { ProFormulaResult } from "./pro-formula-contract";
import {
  createValidationState,
  divideOrError,
  finalizeResult,
  requireFiniteInputs,
  requireInteger,
  requireNonNegative,
  requirePositive,
  requireRange,
  roundDisplay,
} from "./pro-formula-safety";

export const toolKey = "customer-sku-profitability-forensics";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_unit_price",
  "n_unit_variable_cost",
  "n_annual_volume",
  "n_logistics_cost_pct",
  "n_service_cost_pct",
  "n_return_rate_pct",
  "n_target_margin",
  "n_source_confidence_ratio",
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

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const state = createValidationState();
  const v = requireFiniteInputs(inputs, requiredInputKeys, state);
  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const unitPrice = v.n_unit_price;
  const unitVariableCost = v.n_unit_variable_cost;
  const annualVolume = v.n_annual_volume;
  const logisticsPct = v.n_logistics_cost_pct;
  const servicePct = v.n_service_cost_pct;
  const returnPct = v.n_return_rate_pct;
  const targetMarginPct = v.n_target_margin;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(unitPrice, "Unit selling price", state);
  requireNonNegative(unitVariableCost, "Unit variable cost", state);
  requireInteger(annualVolume, 1, 1000000000000, "Annual volume", state);
  requireRange(logisticsPct, 0, 100, "Logistics cost (%)", state);
  requireRange(servicePct, 0, 100, "Service cost (%)", state);
  requireRange(returnPct, 0, 100, "Return rate (%)", state);
  requireRange(targetMarginPct, -100, 100, "Target net margin (%)", state, {
    maxInclusive: false,
  });
  requireRange(confidence, 0, 1, "Source confidence", state);

  const totalBurdenPct = logisticsPct + servicePct + returnPct;
  if (totalBurdenPct > 100) {
    state.errors.push("Combined logistics, service and return burden must not exceed 100% of unit price.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const logisticsBurden = unitPrice * logisticsPct / 100;
  const serviceBurden = unitPrice * servicePct / 100;
  const returnBurden = unitPrice * returnPct / 100;
  const netMarginPerUnit =
    unitPrice - unitVariableCost - logisticsBurden - serviceBurden - returnBurden;
  const netMarginRatio = divideOrError(netMarginPerUnit, unitPrice, "Net margin ratio", state);
  const annualNetMargin = netMarginPerUnit * annualVolume;
  const targetMarginRatio = targetMarginPct / 100;
  const marginGap = netMarginRatio - targetMarginRatio;
  const uncertainty = Math.abs(annualNetMargin) * (1 - confidence);
  const burdenDrivers = [unitVariableCost, logisticsBurden, serviceBurden, returnBurden];
  const sensitivityDriver = burdenDrivers.indexOf(Math.max(...burdenDrivers));

  let decision = 0;
  if (netMarginPerUnit < 0) decision = 2;
  else if (netMarginRatio < targetMarginRatio || confidence < 0.7) decision = 1;

  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify price, cost-to-serve and return records.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(annualVolume, 0),
    out_reference_deviation: roundDisplay(marginGap, 6),
    out_derating_factor: roundDisplay(
      unitPrice > unitVariableCost
        ? Math.max(0, netMarginPerUnit / (unitPrice - unitVariableCost))
        : 0,
      6,
    ),
    out_demand_metric: roundDisplay(netMarginPerUnit, 4),
    out_capacity_metric: roundDisplay(annualNetMargin, 2),
    out_utilization_margin: roundDisplay(netMarginRatio, 6),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: netMarginRatio < targetMarginRatio ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: netMarginPerUnit < 0 ? 1 : 0,
    out_money_at_risk: roundDisplay(netMarginPerUnit < 0 ? Math.abs(annualNetMargin) : uncertainty, 2),
    out_scenario_delta: roundDisplay(Math.max(logisticsBurden, serviceBurden, returnBurden) * annualVolume, 2),
    out_audit_hash_payload: 0,
    out_final_decision_state: decision,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: decision === 0 ? "OK" : "REVIEW",
  });
}
