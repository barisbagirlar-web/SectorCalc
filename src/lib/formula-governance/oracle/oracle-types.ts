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
  | "INVALID_COST"
  | "INVALID_CONTRIBUTION"
  | "INVALID_SALARY"
  | "INVALID_DAYS"
  | "INVALID_QUANTITY"
  | "INVALID_TIME_INPUT"
  | "INVALID_AREA"
  | "INVALID_HOURS"
  | "INVALID_PERCENT"
  | "INVALID_CREW";

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

export type ProjectCostOracleInput = {
  readonly materialCost: number;
  readonly laborHours: number;
  readonly laborHourlyRate: number;
  readonly equipmentCost: number;
  readonly overheadRate: number;
  readonly contingencyRate: number;
};

export type ProjectCostOracleOutput = {
  readonly laborCost: number;
  readonly baseCost: number;
  readonly overheadCost: number;
  readonly contingencyCost: number;
  readonly estimatedProjectCost: number;
};

export type CleaningCostOracleInput = {
  readonly area: number;
  readonly estimatedHours: number;
  readonly crewSize: number;
  readonly laborHourlyCost: number;
  readonly suppliesCost: number;
  readonly travelCost: number;
};

export type CleaningCostOracleOutput = {
  readonly laborCost: number;
  readonly totalCost: number;
  readonly costPerSqFt: number;
};

export type FoodCostOracleInput = {
  readonly ingredientCost: number;
  readonly menuPrice: number;
};

export type FoodCostOracleOutput = {
  readonly foodCostPercent: number;
  readonly grossMarginPercent: number;
};

export type ProductMarginOracleInput = {
  readonly sellingPrice: number;
  readonly productCost: number;
  readonly shippingCost: number;
  readonly platformFeeRate: number;
  readonly paymentFeeRate: number;
  readonly returnRate: number;
};

export type ProductMarginOracleOutput = {
  readonly margin: number;
  readonly grossProfit: number;
  readonly totalCost: number;
  readonly returnImpact: number;
};

export type WeldingCostOracleInput = {
  readonly materialCost: number;
  readonly laborHours: number;
  readonly laborRate: number;
  readonly consumablesCost: number;
};

export type WeldingCostOracleOutput = {
  readonly estimatedCost: number;
  readonly laborCost: number;
};
