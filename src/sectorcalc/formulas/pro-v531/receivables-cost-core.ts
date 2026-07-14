import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const RECEIVABLES_COST_FORMULA_VERSION = "2.0.0";
export const RECEIVABLES_COST_SCHEMA_VERSION = "5.3.1-pro-receivables-cost.1";
export const RECEIVABLES_COST_MODEL_ID = "PRO_ACT_365_PAYMENT_TERM_COST_RECOVERY_V2";
export const RECEIVABLES_COST_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface ReceivablesCostInputs {
  invoicePrincipal: string | number;
  standardPaymentDays: string | number;
  proposedPaymentDays: string | number;
  annualFinancingRate: string | number;
  incrementalCreditLossRatio: string | number;
  administrationCostPerInvoice: string | number;
  quotedTermUpliftPerInvoice: string | number;
  annualInvoiceCount: string | number;
  sourceConfidenceRatio: string | number;
  uncertaintyCoverageMultiplier: string | number;
}

export interface ReceivablesCostResult {
  invoicePrincipal: Decimal;
  standardPaymentDays: Decimal;
  proposedPaymentDays: Decimal;
  incrementalPaymentDays: Decimal;
  annualFinancingRate: Decimal;
  financingCostPerInvoice: Decimal;
  creditLossAllowancePerInvoice: Decimal;
  administrationCostPerInvoice: Decimal;
  requiredAddendumPerInvoice: Decimal;
  requiredAddendumRatio: Decimal;
  adjustedInvoiceAmount: Decimal;
  quotedTermUpliftPerInvoice: Decimal;
  quotedUpliftGapToRequired: Decimal;
  annualInvoiceCount: Decimal;
  annualRequiredAddendum: Decimal;
  annualQuotedTermUplift: Decimal;
  sourceConfidenceRatio: Decimal;
  addendumUncertaintyPerInvoice: Decimal;
  addendumLowerBoundPerInvoice: Decimal;
  addendumUpperBoundPerInvoice: Decimal;
  annualMoneyAtRisk: Decimal;
  primaryAddendumDriver: 0 | 1 | 2;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "NON_NEGATIVE_INTEGER" | "POSITIVE_INTEGER" | "RATIO" | "COVERAGE";

export function evaluateReceivablesCost(inputs: ReceivablesCostInputs): DomainResult<ReceivablesCostResult> {
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
    if (kind === "NON_NEGATIVE_INTEGER" && (parsed.value.lt("0") || !parsed.value.round(0, 0).eq(parsed.value))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a non-negative integer count.` });
    }
    if (kind === "POSITIVE_INTEGER" && (parsed.value.lte("0") || !parsed.value.round(0, 0).eq(parsed.value))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer count.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    if (kind === "COVERAGE" && (parsed.value.lt("0") || parsed.value.gt("10"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 10].` });
    }
    return parsed;
  };

  const principal = read(inputs.invoicePrincipal, "invoice_principal", "POSITIVE");
  if (!principal.ok) return principal;
  const standardDays = read(inputs.standardPaymentDays, "standard_payment_days", "NON_NEGATIVE_INTEGER");
  if (!standardDays.ok) return standardDays;
  const proposedDays = read(inputs.proposedPaymentDays, "proposed_payment_days", "NON_NEGATIVE_INTEGER");
  if (!proposedDays.ok) return proposedDays;
  if (standardDays.value.gt("3650") || proposedDays.value.gt("3650")) {
    return err({ code: "DOMAIN_VIOLATION", field: "payment_days", message: "Payment terms cannot exceed 3650 days." });
  }
  if (proposedDays.value.lt(standardDays.value)) {
    return err({ code: "DOMAIN_VIOLATION", field: "proposed_payment_days", message: "Proposed payment days must be at least the standard payment days for an extension addendum." });
  }
  const financingRate = read(inputs.annualFinancingRate, "annual_financing_rate", "RATIO");
  if (!financingRate.ok) return financingRate;
  const creditLossRatio = read(inputs.incrementalCreditLossRatio, "incremental_credit_loss_ratio", "RATIO");
  if (!creditLossRatio.ok) return creditLossRatio;
  const administrationCost = read(inputs.administrationCostPerInvoice, "administration_cost_per_invoice", "NON_NEGATIVE");
  if (!administrationCost.ok) return administrationCost;
  const quotedUplift = read(inputs.quotedTermUpliftPerInvoice, "quoted_term_uplift_per_invoice", "NON_NEGATIVE");
  if (!quotedUplift.ok) return quotedUplift;
  const invoiceCount = read(inputs.annualInvoiceCount, "annual_invoice_count", "POSITIVE_INTEGER");
  if (!invoiceCount.ok) return invoiceCount;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;
  const coverage = read(inputs.uncertaintyCoverageMultiplier, "uncertainty_coverage_multiplier", "COVERAGE");
  if (!coverage.ok) return coverage;

  const zero = context.DecimalConstructor("0");
  const one = context.DecimalConstructor("1");
  const incrementalPaymentDays = proposedDays.value.minus(standardDays.value);
  const financingCostPerInvoice = principal.value
    .times(financingRate.value)
    .times(incrementalPaymentDays)
    .div("365");
  const creditLossAllowancePerInvoice = principal.value.times(creditLossRatio.value);
  const requiredAddendumPerInvoice = financingCostPerInvoice
    .plus(creditLossAllowancePerInvoice)
    .plus(administrationCost.value);
  const requiredAddendumRatio = requiredAddendumPerInvoice.div(principal.value);
  const adjustedInvoiceAmount = principal.value.plus(requiredAddendumPerInvoice);
  const quotedUpliftGapToRequired = quotedUplift.value.minus(requiredAddendumPerInvoice);
  const annualRequiredAddendum = requiredAddendumPerInvoice.times(invoiceCount.value);
  const annualQuotedTermUplift = quotedUplift.value.times(invoiceCount.value);
  const addendumUncertaintyPerInvoice = requiredAddendumPerInvoice
    .times(one.minus(confidence.value))
    .times(coverage.value);
  const unboundedLower = requiredAddendumPerInvoice.minus(addendumUncertaintyPerInvoice);
  const addendumLowerBoundPerInvoice = unboundedLower.lt("0") ? zero : unboundedLower;
  const addendumUpperBoundPerInvoice = requiredAddendumPerInvoice.plus(addendumUncertaintyPerInvoice);
  const uncoveredUpperCost = addendumUpperBoundPerInvoice.minus(quotedUplift.value);
  const annualMoneyAtRisk = uncoveredUpperCost.gt("0")
    ? uncoveredUpperCost.times(invoiceCount.value)
    : zero;
  const drivers = [financingCostPerInvoice, creditLossAllowancePerInvoice, administrationCost.value] as const;
  let primaryAddendumDriver: 0 | 1 | 2 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryAddendumDriver])) primaryAddendumDriver = index as 1 | 2;
  }
  const decisionState: 0 | 1 | 2 = quotedUplift.value.gte(addendumUpperBoundPerInvoice)
    ? 0
    : quotedUplift.value.gte(addendumLowerBoundPerInvoice) ? 1 : 2;

  return ok({
    invoicePrincipal: principal.value,
    standardPaymentDays: standardDays.value,
    proposedPaymentDays: proposedDays.value,
    incrementalPaymentDays,
    annualFinancingRate: financingRate.value,
    financingCostPerInvoice,
    creditLossAllowancePerInvoice,
    administrationCostPerInvoice: administrationCost.value,
    requiredAddendumPerInvoice,
    requiredAddendumRatio,
    adjustedInvoiceAmount,
    quotedTermUpliftPerInvoice: quotedUplift.value,
    quotedUpliftGapToRequired,
    annualInvoiceCount: invoiceCount.value,
    annualRequiredAddendum,
    annualQuotedTermUplift,
    sourceConfidenceRatio: confidence.value,
    addendumUncertaintyPerInvoice,
    addendumLowerBoundPerInvoice,
    addendumUpperBoundPerInvoice,
    annualMoneyAtRisk,
    primaryAddendumDriver,
    decisionState,
  });
}
