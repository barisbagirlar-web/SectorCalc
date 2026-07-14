import "server-only";

import {
  RECEIVABLES_COST_ARITHMETIC_MODE,
  RECEIVABLES_COST_FORMULA_VERSION,
  RECEIVABLES_COST_MODEL_ID,
  evaluateReceivablesCost,
} from "./receivables-cost-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "receivables-cost-payment-term-addendum";
export const formulaVersion = RECEIVABLES_COST_FORMULA_VERSION;
export const arithmeticMode = RECEIVABLES_COST_ARITHMETIC_MODE;
export const modelId = RECEIVABLES_COST_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/receivables-cost.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_material_cost", "n_cycle_time", "n_setup_time", "n_target_margin",
  "n_defect_or_loss_cost", "n_machine_rate", "n_labor_rate", "n_annual_volume",
  "n_source_confidence_ratio", "n_uncertainty_multiplier",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return { status: "BLOCKED", outputs: {}, decimalOutputs: {}, warnings, outputKeys: [], redaction_status: "PUBLIC_SAFE_REDACTED" };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);
  const evaluated = evaluateReceivablesCost({
    invoicePrincipal: inputs.n_material_cost,
    standardPaymentDays: inputs.n_cycle_time,
    proposedPaymentDays: inputs.n_setup_time,
    annualFinancingRate: inputs.n_target_margin,
    incrementalCreditLossRatio: inputs.n_defect_or_loss_cost,
    administrationCostPerInvoice: inputs.n_machine_rate,
    quotedTermUpliftPerInvoice: inputs.n_labor_rate,
    annualInvoiceCount: inputs.n_annual_volume,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
    uncertaintyCoverageMultiplier: inputs.n_uncertainty_multiplier,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);
  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_invoice_principal", value.invoicePrincipal],
    ["out_standard_payment_days", value.standardPaymentDays],
    ["out_proposed_payment_days", value.proposedPaymentDays],
    ["out_incremental_payment_days", value.incrementalPaymentDays],
    ["out_annual_financing_rate", value.annualFinancingRate],
    ["out_financing_cost_per_invoice", value.financingCostPerInvoice],
    ["out_credit_loss_allowance_per_invoice", value.creditLossAllowancePerInvoice],
    ["out_administration_cost_per_invoice", value.administrationCostPerInvoice],
    ["out_required_addendum_per_invoice", value.requiredAddendumPerInvoice],
    ["out_required_addendum_ratio", value.requiredAddendumRatio],
    ["out_adjusted_invoice_amount", value.adjustedInvoiceAmount],
    ["out_quoted_term_uplift_per_invoice", value.quotedTermUpliftPerInvoice],
    ["out_quoted_uplift_gap_to_required", value.quotedUpliftGapToRequired],
    ["out_annual_invoice_count", value.annualInvoiceCount],
    ["out_annual_required_addendum", value.annualRequiredAddendum],
    ["out_annual_quoted_term_uplift", value.annualQuotedTermUplift],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_addendum_uncertainty_per_invoice", value.addendumUncertaintyPerInvoice],
    ["out_addendum_lower_bound_per_invoice", value.addendumLowerBoundPerInvoice],
    ["out_addendum_upper_bound_per_invoice", value.addendumUpperBoundPerInvoice],
    ["out_annual_money_at_risk", value.annualMoneyAtRisk],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_addendum_driver = value.primaryAddendumDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_addendum_driver = String(value.primaryAddendumDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);
  const warnings = value.decisionState === 2
    ? ["The quoted payment-term uplift is below the evidence-adjusted lower cost bound; block the extension or reprice it."]
    : value.decisionState === 1
      ? ["The quoted payment-term uplift does not cover the upper cost bound; review the addendum and evidence."]
      : [];
  return { status: warnings.length > 0 ? "REVIEW" : "OK", outputs, decimalOutputs, warnings,
    outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
