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

export const toolKey = "receivables-cost-payment-term-addendum";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_machine_rate",
  "n_cycle_time",
  "n_batch_quantity",
  "n_material_cost",
  "n_overhead_rate",
  "n_defect_or_loss_cost",
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

  const invoiceAmount = v.n_machine_rate;
  const paymentTermDays = v.n_cycle_time;
  const annualInvoiceCount = v.n_batch_quantity;
  const annualFinancingRatePct = v.n_material_cost;
  const adminCostPerInvoice = v.n_overhead_rate;
  const expectedCreditLossPerInvoice = v.n_defect_or_loss_cost;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(invoiceAmount, "Invoice amount", state);
  requireInteger(paymentTermDays, 0, 3650, "Payment term days", state);
  requireInteger(annualInvoiceCount, 1, 1000000000, "Annual invoice count", state);
  requireRange(annualFinancingRatePct, 0, 100, "Annual financing rate (%)", state);
  requireNonNegative(adminCostPerInvoice, "Administration cost per invoice", state);
  requireNonNegative(expectedCreditLossPerInvoice, "Expected credit loss per invoice", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const financingRate = annualFinancingRatePct / 100;
  const financingCostPerInvoice =
    invoiceAmount * financingRate * paymentTermDays / 365;
  const totalTermCostPerInvoice =
    financingCostPerInvoice + adminCostPerInvoice + expectedCreditLossPerInvoice;
  const annualReceivablesCost = totalTermCostPerInvoice * annualInvoiceCount;
  const addendumRate = divideOrError(
    totalTermCostPerInvoice,
    invoiceAmount,
    "Payment-term addendum rate",
    state,
  );
  const invoiceAmountWithAddendum = invoiceAmount + totalTermCostPerInvoice;
  const uncertainty = annualReceivablesCost * (1 - confidence);

  const drivers = [
    financingCostPerInvoice,
    adminCostPerInvoice,
    expectedCreditLossPerInvoice,
  ];
  const sensitivityDriver = drivers.indexOf(Math.max(...drivers));

  // The output is a recoverable cost basis, not a unilateral contractual price.
  // Commercial adoption always requires review of the customer agreement.
  state.warnings.push(
    "The calculated addendum is a cost-recovery basis; contract, tax and customer-acceptance review remains required.",
  );
  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; verify financing rate and credit-loss evidence.");
  }

  const outputs: Record<string, number> = {
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_normalized_demand: roundDisplay(invoiceAmount, 2),
    out_reference_deviation: roundDisplay(addendumRate, 6),
    out_derating_factor: roundDisplay(confidence, 4),
    out_demand_metric: roundDisplay(annualReceivablesCost, 2),
    out_capacity_metric: roundDisplay(invoiceAmountWithAddendum, 2),
    out_utilization_margin: roundDisplay(totalTermCostPerInvoice, 2),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: totalTermCostPerInvoice > 0 ? 1 : 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: confidence < 0.7 ? 1 : 0,
    out_money_at_risk: roundDisplay(annualReceivablesCost + uncertainty, 2),
    out_scenario_delta: roundDisplay(totalTermCostPerInvoice, 2),
    out_audit_hash_payload: 0,
    out_final_decision_state: 1,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: "REVIEW",
  });
}
