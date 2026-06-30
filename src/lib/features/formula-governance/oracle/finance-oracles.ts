/**
 * Finance oracle baselines — independent reference implementations (Phase 4).
 * Does NOT import production calculator functions.
 */

import {
  OracleValidationError,
  type CompoundInterestOracleInput,
  type CompoundInterestOracleOutput,
  type LoanPaymentOracleInput,
  type LoanPaymentOracleOutput,
  type MortgagePaymentOracleInput,
  type MortgagePaymentOracleOutput,
  type ProfitMarginOracleInput,
  type ProfitMarginOracleOutput,
  type SimpleInterestOracleInput,
  type SimpleInterestOracleOutput,
} from "@/lib/features/formula-governance/oracle/oracle-types";

const MAX_LOAN_TERM_MONTHS = 600;

function assertPositive(value: number, code: "INVALID_PRINCIPAL" | "INVALID_PRICE", label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new OracleValidationError(code, `${label} must be a positive finite number.`);
  }
}

function assertNonNegativeRate(rate: number): void {
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    throw new OracleValidationError("INVALID_RATE", "Rate must be between 0 and 100 percent.");
  }
}

function assertLoanTermMonths(months: number): void {
  if (!Number.isFinite(months) || months < 1 || months > MAX_LOAN_TERM_MONTHS) {
    throw new OracleValidationError(
      "INVALID_TERM",
      `Term must be between 1 and ${MAX_LOAN_TERM_MONTHS} months.`,
    );
  }
}

function amortizingMonthlyPayment(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return principal / months;
  }
  const discountFactor = (1 + monthlyRate) ** -months;
  return (principal * monthlyRate) / (1 - discountFactor);
}

/** Reference amortizing loan payment (fixed nominal APR, monthly periods). */
export function calculateLoanPaymentOracle(
  input: LoanPaymentOracleInput,
): LoanPaymentOracleOutput {
  assertPositive(input.principal, "INVALID_PRINCIPAL", "Principal");
  assertNonNegativeRate(input.annualRate);
  assertLoanTermMonths(input.months);

  return {
    monthlyPayment: amortizingMonthlyPayment(input.principal, input.annualRate, input.months),
  };
}

/** Reference mortgage payment with total paid and interest breakdown. */
export function calculateMortgagePaymentOracle(
  input: MortgagePaymentOracleInput,
): MortgagePaymentOracleOutput {
  const { monthlyPayment } = calculateLoanPaymentOracle(input);
  const totalPaid = monthlyPayment * input.months;
  return {
    monthlyPayment,
    totalPaid,
    totalInterest: totalPaid - input.principal,
  };
}

/** Reference simple interest: I = P × r × t. */
export function calculateSimpleInterestOracle(
  input: SimpleInterestOracleInput,
): SimpleInterestOracleOutput {
  assertPositive(input.principal, "INVALID_PRINCIPAL", "Principal");
  assertNonNegativeRate(input.ratePercent);
  if (!Number.isFinite(input.years) || input.years <= 0) {
    throw new OracleValidationError("INVALID_TIME", "Years must be a positive finite number.");
  }

  const interestAmount = input.principal * (input.ratePercent / 100) * input.years;
  return {
    interestAmount,
    totalRepayment: input.principal + interestAmount,
  };
}

/** Reference compound interest: FV = P × (1 + r/n)^(n×t). */
export function calculateCompoundInterestOracle(
  input: CompoundInterestOracleInput,
): CompoundInterestOracleOutput {
  assertPositive(input.principal, "INVALID_PRINCIPAL", "Principal");
  assertNonNegativeRate(input.annualRate);
  if (!Number.isFinite(input.years) || input.years <= 0) {
    throw new OracleValidationError("INVALID_TIME", "Years must be a positive finite number.");
  }
  if (!Number.isFinite(input.compoundsPerYear) || input.compoundsPerYear < 1) {
    throw new OracleValidationError("INVALID_COMPOUNDS", "Compounds per year must be at least 1.");
  }

  const ratePerPeriod = input.annualRate / 100 / input.compoundsPerYear;
  const periods = input.compoundsPerYear * input.years;
  const futureValue = input.principal * (1 + ratePerPeriod) ** periods;

  return {
    futureValue,
    interestEarned: futureValue - input.principal,
  };
}

/** Reference profit margin: margin% = (price − cost) / price × 100. */
export function calculateProfitMarginOracle(
  input: ProfitMarginOracleInput,
): ProfitMarginOracleOutput {
  assertPositive(input.sellingPrice, "INVALID_PRICE", "Selling price");
  if (!Number.isFinite(input.cost) || input.cost < 0) {
    throw new OracleValidationError("INVALID_COST", "Cost must be a non-negative finite number.");
  }

  const marginPercent = ((input.sellingPrice - input.cost) / input.sellingPrice) * 100;
  const markupPercent = input.cost === 0 ? 0 : ((input.sellingPrice - input.cost) / input.cost) * 100;

  return {
    marginPercent,
    markupPercent,
  };
}

export const FINANCE_ORACLE_SLUGS = [
  "loan-payment-calculator",
  "mortgage-calculator",
  "interest-calculator",
  "compound-interest-calculator",
  "profit-margin-calculator",
] as const;

export type FinanceOracleSlug = (typeof FINANCE_ORACLE_SLUGS)[number];

export function isFinanceOracleSlug(slug: string): slug is FinanceOracleSlug {
  return (FINANCE_ORACLE_SLUGS as readonly string[]).includes(slug);
}
