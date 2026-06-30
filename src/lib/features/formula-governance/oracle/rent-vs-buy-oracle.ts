/**
 * Rent vs Buy oracle baseline — independent reference model (Phase 5B).
 * Does NOT import production calculator or rent-vs-buy-model.
 */

import {
  OracleValidationError,
  type OracleValidationErrorCode,
} from "@/lib/features/formula-governance/oracle/oracle-types";

export const RENT_VS_BUY_ORACLE_CALENDAR_YEAR_MESSAGE =
  "Enter the number of years to compare, not the calendar year. Example: 10 or 20.";

export type RentVsBuyOracleInput = {
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

export type RentVsBuyOracleOutput = {
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
  readonly strongerScenario: "buy" | "rent" | "tie";
};

const MIN_YEARS = 1;
const MAX_YEARS = 40;

function assertPositive(value: number, code: OracleValidationErrorCode, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new OracleValidationError(code, `${label} must be a positive number.`);
  }
}

function assertPercent(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new OracleValidationError("INVALID_RATE", `${label} must be between 0 and 100 percent.`);
  }
}

function validateRentVsBuyOracleInput(input: RentVsBuyOracleInput): void {
  assertPositive(input.monthlyRent, "INVALID_PRINCIPAL", "Monthly rent");
  assertPositive(input.homePrice, "INVALID_PRICE", "Home price");

  if (!Number.isFinite(input.comparisonYears)) {
    throw new OracleValidationError("INVALID_TERM", "Comparison years must be a valid number.");
  }
  if (input.comparisonYears > MAX_YEARS && input.comparisonYears >= 100) {
    throw new OracleValidationError("INVALID_TERM", RENT_VS_BUY_ORACLE_CALENDAR_YEAR_MESSAGE);
  }
  if (input.comparisonYears < MIN_YEARS || input.comparisonYears > MAX_YEARS) {
    throw new OracleValidationError(
      "INVALID_TERM",
      `Comparison years must be between ${MIN_YEARS} and ${MAX_YEARS}.`,
    );
  }

  if (
    !Number.isFinite(input.mortgageTermYears) ||
    input.mortgageTermYears < MIN_YEARS ||
    input.mortgageTermYears > MAX_YEARS
  ) {
    throw new OracleValidationError(
      "INVALID_TERM",
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

function oracleAmortizingPayment(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) {
    return 0;
  }
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return principal / months;
  }
  const discount = (1 + monthlyRate) ** -months;
  return (principal * monthlyRate) / (1 - discount);
}

function oracleRemainingBalance(
  principal: number,
  annualRate: number,
  termMonths: number,
  paymentsMade: number,
): number {
  if (principal <= 0 || termMonths <= 0 || paymentsMade <= 0) {
    return principal;
  }
  if (paymentsMade >= termMonths) {
    return 0;
  }
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return Math.max(0, principal - (principal / termMonths) * paymentsMade);
  }
  const factorN = (1 + monthlyRate) ** termMonths;
  const factorK = (1 + monthlyRate) ** paymentsMade;
  return (principal * (factorN - factorK)) / (factorN - 1);
}

export function calculateRentVsBuyOracle(input: RentVsBuyOracleInput): RentVsBuyOracleOutput {
  validateRentVsBuyOracleInput(input);

  const downPaymentAmount = input.homePrice * (input.downPaymentPercent / 100);
  const purchaseCosts = input.homePrice * (input.purchaseCostPercent / 100);
  const upfrontCash = downPaymentAmount + purchaseCosts;

  const rentGrowth = input.annualRentIncrease / 100;
  let totalRentPaid = 0;
  for (let year = 0; year < input.comparisonYears; year += 1) {
    totalRentPaid += input.monthlyRent * 12 * (1 + rentGrowth) ** year;
  }

  const investmentValueIfRenting =
    upfrontCash * (1 + input.investmentReturnRate / 100) ** input.comparisonYears;
  const rentNetPosition = investmentValueIfRenting - totalRentPaid;

  const loanAmount = input.homePrice - downPaymentAmount;
  const mortgageMonths = input.mortgageTermYears * 12;
  const monthlyMortgagePayment = oracleAmortizingPayment(
    loanAmount,
    input.mortgageInterestRate,
    mortgageMonths,
  );
  const paymentsDuringComparison = Math.min(input.comparisonYears, input.mortgageTermYears) * 12;
  const totalMortgagePaid = monthlyMortgagePayment * paymentsDuringComparison;
  const remainingMortgageBalance = oracleRemainingBalance(
    loanAmount,
    input.mortgageInterestRate,
    mortgageMonths,
    paymentsDuringComparison,
  );

  const futureHomeValue =
    input.homePrice * (1 + input.annualHomeAppreciation / 100) ** input.comparisonYears;

  const appreciation = input.annualHomeAppreciation / 100;
  const ownershipRate = input.ownershipCostPercent / 100;
  let estimatedOwnershipCosts = 0;
  for (let year = 0; year < input.comparisonYears; year += 1) {
    estimatedOwnershipCosts += input.homePrice * (1 + appreciation) ** year * ownershipRate;
  }

  const estimatedSellingCosts = futureHomeValue * (input.sellingCostPercent / 100);
  const buyNetPosition =
    futureHomeValue -
    remainingMortgageBalance -
    estimatedOwnershipCosts -
    estimatedSellingCosts -
    purchaseCosts;

  const netDifference = buyNetPosition - rentNetPosition;
  let strongerScenario: "buy" | "rent" | "tie" = "tie";
  if (Math.abs(netDifference) > 0.01) {
    strongerScenario = netDifference > 0 ? "buy" : "rent";
  }

  return {
    totalRentPaid,
    investmentValueIfRenting,
    monthlyMortgagePayment,
    totalMortgagePaid,
    remainingMortgageBalance,
    futureHomeValue,
    estimatedOwnershipCosts,
    estimatedSellingCosts,
    rentNetPosition,
    buyNetPosition,
    netDifference,
    strongerScenario,
  };
}

export const RENT_VS_BUY_ORACLE_SLUG = "rent-vs-buy-calculator" as const;

export function isRentVsBuyOracleSlug(slug: string): slug is typeof RENT_VS_BUY_ORACLE_SLUG {
  return slug === RENT_VS_BUY_ORACLE_SLUG;
}
