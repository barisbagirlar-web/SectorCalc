/**
 * Rent vs Buy decision model - production calculation (Phase 5B).
 * Used by free-traffic calculator only; oracle reimplements independently.
 */

export const RENT_VS_BUY_RESULT_WARNING =
  "This is a simplified financial comparison based on the numbers entered. It does not include every tax, legal, financing or market factor. Review assumptions before making a buying or renting decision.";

export const RENT_VS_BUY_CALENDAR_YEAR_MESSAGE =
  "Enter the number of years to compare, not the calendar year. Example: 10 or 20.";

export type RentVsBuyValidationCode =
  | "INVALID_RENT"
  | "INVALID_HOME_PRICE"
  | "INVALID_YEARS"
  | "CALENDAR_YEAR"
  | "INVALID_MORTGAGE_TERM"
  | "INVALID_PERCENT";

export class RentVsBuyValidationError extends Error {
  readonly code: RentVsBuyValidationCode;

  constructor(code: RentVsBuyValidationCode, message: string) {
    super(message);
    this.name = "RentVsBuyValidationError";
    this.code = code;
  }
}

export type RentVsBuyInput = {
  readonly monthlyRent: number;
  readonly homePrice: number;
  readonly comparisonYears: number;
  readonly annualRentIncrease: number;
  readonly annualHomeAppreciation: number;
  readonly downPaymentPercent: number;
  readonly mortgageInterestRate: number;
  readonly mortgageTermYears: number;
  readonly investmentReturnRate: number;
  readonly ownershipCostPercent: number;
  readonly purchaseCostPercent: number;
  readonly sellingCostPercent: number;
};

export type RentVsBuyStrongerScenario = "buy" | "rent" | "tie";

export type RentVsBuyResult = {
  readonly totalRentPaid: number;
  readonly investmentValueIfRenting: number;
  readonly monthlyMortgagePayment: number;
  readonly totalMortgagePaid: number;
  readonly remainingMortgageBalance: number;
  readonly futureHomeValue: number;
  readonly estimatedOwnershipCosts: number;
  readonly estimatedSellingCosts: number;
  readonly rentNetPosition: number;
  readonly buyNetPosition: number;
  readonly netDifference: number;
  readonly strongerScenario: RentVsBuyStrongerScenario;
  readonly downPaymentAmount: number;
  readonly purchaseCosts: number;
  readonly loanAmount: number;
};

const MIN_YEARS = 1;
const MAX_YEARS = 40;
const MAX_PERCENT = 100;

function assertPositive(value: number, code: RentVsBuyValidationCode, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RentVsBuyValidationError(code, `${label} must be a positive number.`);
  }
}

function assertPercent(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > MAX_PERCENT) {
    throw new RentVsBuyValidationError(
      "INVALID_PERCENT",
      `${label} must be between 0 and ${MAX_PERCENT} percent.`,
    );
  }
}

export function validateRentVsBuyInput(input: RentVsBuyInput): void {
  assertPositive(input.monthlyRent, "INVALID_RENT", "Monthly rent");
  assertPositive(input.homePrice, "INVALID_HOME_PRICE", "Home price");

  if (!Number.isFinite(input.comparisonYears)) {
    throw new RentVsBuyValidationError("INVALID_YEARS", "Comparison years must be a valid number.");
  }
  if (input.comparisonYears > MAX_YEARS && input.comparisonYears >= 100) {
    throw new RentVsBuyValidationError("CALENDAR_YEAR", RENT_VS_BUY_CALENDAR_YEAR_MESSAGE);
  }
  if (input.comparisonYears < MIN_YEARS || input.comparisonYears > MAX_YEARS) {
    throw new RentVsBuyValidationError(
      "INVALID_YEARS",
      `Comparison years must be between ${MIN_YEARS} and ${MAX_YEARS}.`,
    );
  }

  if (
    !Number.isFinite(input.mortgageTermYears) ||
    input.mortgageTermYears < MIN_YEARS ||
    input.mortgageTermYears > MAX_YEARS
  ) {
    throw new RentVsBuyValidationError(
      "INVALID_MORTGAGE_TERM",
      `Mortgage term years must be between ${MIN_YEARS} and ${MAX_YEARS}.`,
    );
  }

  assertPercent(input.annualRentIncrease, "Annual rent increase");
  assertPercent(input.annualHomeAppreciation, "Annual home appreciation");
  assertPercent(input.downPaymentPercent, "Down payment");
  assertPercent(input.mortgageInterestRate, "Mortgage interest rate");
  assertPercent(input.investmentReturnRate, "Investment return rate");
  assertPercent(input.ownershipCostPercent, "Ownership cost");
  assertPercent(input.purchaseCostPercent, "Purchase cost");
  assertPercent(input.sellingCostPercent, "Selling cost");
}

export function amortizingMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) {
    return 0;
  }
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) {
    return principal / termMonths;
  }
  const discountFactor = (1 + monthlyRate) ** -termMonths;
  return (principal * monthlyRate) / (1 - discountFactor);
}

export function remainingMortgageBalance(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
  paymentsMade: number,
): number {
  if (principal <= 0 || termMonths <= 0 || paymentsMade <= 0) {
    return principal;
  }
  if (paymentsMade >= termMonths) {
    return 0;
  }
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) {
    return Math.max(0, principal - (principal / termMonths) * paymentsMade);
  }
  const factorN = (1 + monthlyRate) ** termMonths;
  const factorK = (1 + monthlyRate) ** paymentsMade;
  return (principal * (factorN - factorK)) / (factorN - 1);
}

function totalRentPaid(input: RentVsBuyInput): number {
  const rentGrowth = input.annualRentIncrease / 100;
  let total = 0;
  for (let year = 0; year < input.comparisonYears; year += 1) {
    total += input.monthlyRent * 12 * (1 + rentGrowth) ** year;
  }
  return total;
}

function investmentFutureValue(amount: number, annualRatePercent: number, years: number): number {
  return amount * (1 + annualRatePercent / 100) ** years;
}

function totalOwnershipCosts(input: RentVsBuyInput): number {
  const appreciation = input.annualHomeAppreciation / 100;
  const annualRate = input.ownershipCostPercent / 100;
  let total = 0;
  for (let year = 0; year < input.comparisonYears; year += 1) {
    const homeValueThisYear = input.homePrice * (1 + appreciation) ** year;
    total += homeValueThisYear * annualRate;
  }
  return total;
}

export function calculateRentVsBuyModel(input: RentVsBuyInput): RentVsBuyResult {
  validateRentVsBuyInput(input);

  const downPaymentAmount = input.homePrice * (input.downPaymentPercent / 100);
  const purchaseCosts = input.homePrice * (input.purchaseCostPercent / 100);
  const upfrontCashNotUsedForBuying = downPaymentAmount + purchaseCosts;

  const rentPaid = totalRentPaid(input);
  const investmentValueIfRenting = investmentFutureValue(
    upfrontCashNotUsedForBuying,
    input.investmentReturnRate,
    input.comparisonYears,
  );
  const rentNetPosition = investmentValueIfRenting - rentPaid;

  const loanAmount = input.homePrice - downPaymentAmount;
  const mortgageTermMonths = input.mortgageTermYears * 12;
  const monthlyMortgagePayment = amortizingMonthlyPayment(
    loanAmount,
    input.mortgageInterestRate,
    mortgageTermMonths,
  );

  const paymentsDuringComparison = Math.min(input.comparisonYears, input.mortgageTermYears) * 12;
  const totalMortgagePaid = monthlyMortgagePayment * paymentsDuringComparison;
  const remainingBalance = remainingMortgageBalance(
    loanAmount,
    input.mortgageInterestRate,
    mortgageTermMonths,
    paymentsDuringComparison,
  );

  const futureHomeValue =
    input.homePrice * (1 + input.annualHomeAppreciation / 100) ** input.comparisonYears;
  const estimatedOwnershipCosts = totalOwnershipCosts(input);
  const estimatedSellingCosts = futureHomeValue * (input.sellingCostPercent / 100);
  const buyNetPosition =
    futureHomeValue -
    remainingBalance -
    estimatedOwnershipCosts -
    estimatedSellingCosts -
    purchaseCosts;

  const netDifference = buyNetPosition - rentNetPosition;
  let strongerScenario: RentVsBuyStrongerScenario = "tie";
  if (Math.abs(netDifference) > 0.01) {
    strongerScenario = netDifference > 0 ? "buy" : "rent";
  }

  return {
    totalRentPaid: rentPaid,
    investmentValueIfRenting,
    monthlyMortgagePayment,
    totalMortgagePaid,
    remainingMortgageBalance: remainingBalance,
    futureHomeValue,
    estimatedOwnershipCosts,
    estimatedSellingCosts,
    rentNetPosition,
    buyNetPosition,
    netDifference,
    strongerScenario,
    downPaymentAmount,
    purchaseCosts,
    loanAmount,
  };
}

export function strongerScenarioLabel(scenario: RentVsBuyStrongerScenario): string {
  if (scenario === "buy") {
    return "Under these assumptions, buying looks stronger.";
  }
  if (scenario === "rent") {
    return "Under these assumptions, renting and investing the difference looks stronger.";
  }
  return "Under these assumptions, renting and buying look roughly similar.";
}

export function parseRentVsBuyValues(values: Record<string, number | string>): RentVsBuyInput {
  const num = (key: string): number => {
    const raw = values[key];
    const parsed = typeof raw === "number" ? raw : Number(String(raw ?? "").trim());
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  return {
    monthlyRent: num("monthlyRent"),
    homePrice: num("homePrice"),
    comparisonYears: num("comparisonYears"),
    annualRentIncrease: num("annualRentIncrease"),
    annualHomeAppreciation: num("annualHomeAppreciation"),
    downPaymentPercent: num("downPaymentPercent"),
    mortgageInterestRate: num("mortgageInterestRate"),
    mortgageTermYears: num("mortgageTermYears"),
    investmentReturnRate: num("investmentReturnRate"),
    ownershipCostPercent: num("ownershipCostPercent"),
    purchaseCostPercent: num("purchaseCostPercent"),
    sellingCostPercent: num("sellingCostPercent"),
  };
}
