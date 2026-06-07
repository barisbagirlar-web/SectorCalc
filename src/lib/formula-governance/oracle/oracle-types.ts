/**
 * Oracle baseline types — independent reference models (Phase 4).
 */

export type OracleValidationErrorCode =
  | "INVALID_PRINCIPAL"
  | "INVALID_RATE"
  | "INVALID_TERM"
  | "INVALID_TIME"
  | "INVALID_COMPOUNDS"
  | "INVALID_PRICE"
  | "INVALID_COST";

export class OracleValidationError extends Error {
  readonly code: OracleValidationErrorCode;

  constructor(code: OracleValidationErrorCode, message: string) {
    super(message);
    this.name = "OracleValidationError";
    this.code = code;
  }
}

export type LoanPaymentOracleInput = {
  readonly principal: number;
  readonly annualRate: number;
  readonly months: number;
};

export type LoanPaymentOracleOutput = {
  readonly monthlyPayment: number;
};

export type MortgagePaymentOracleInput = LoanPaymentOracleInput;

export type MortgagePaymentOracleOutput = {
  readonly monthlyPayment: number;
  readonly totalPaid: number;
  readonly totalInterest: number;
};

export type SimpleInterestOracleInput = {
  readonly principal: number;
  readonly ratePercent: number;
  readonly years: number;
};

export type SimpleInterestOracleOutput = {
  readonly interestAmount: number;
  readonly totalRepayment: number;
};

export type CompoundInterestOracleInput = {
  readonly principal: number;
  readonly annualRate: number;
  readonly years: number;
  readonly compoundsPerYear: number;
};

export type CompoundInterestOracleOutput = {
  readonly futureValue: number;
  readonly interestEarned: number;
};

export type ProfitMarginOracleInput = {
  readonly sellingPrice: number;
  readonly cost: number;
};

export type ProfitMarginOracleOutput = {
  readonly marginPercent: number;
  readonly markupPercent: number;
};
