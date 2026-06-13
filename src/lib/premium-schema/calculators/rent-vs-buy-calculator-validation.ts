import type { RentVsBuyInput } from "@/lib/tools/rent-vs-buy-model";
import {
  RentVsBuyValidationError,
  validateRentVsBuyInput,
} from "@/lib/tools/rent-vs-buy-model";

export type RentVsBuyCalculatorInputs = RentVsBuyInput;

export type RentVsBuyCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RENT_VS_BUY_CALCULATOR_INPUT_KEYS: readonly (keyof RentVsBuyCalculatorInputs)[] = [
  "monthlyRent",
  "homePrice",
  "comparisonYears",
  "annualRentIncrease",
  "annualHomeAppreciation",
  "downPaymentPercent",
  "mortgageInterestRate",
  "mortgageTermYears",
  "investmentReturnRate",
  "ownershipCostPercent",
  "purchaseCostPercent",
  "sellingCostPercent",
];

export function validateRentVsBuyCalculatorInputs(
  inputs: RentVsBuyCalculatorInputs,
): RentVsBuyCalculatorValidationResult {
  try {
    validateRentVsBuyInput(inputs);
    return { ok: true, errors: [], warnings: [] };
  } catch (error) {
    if (error instanceof RentVsBuyValidationError) {
      return { ok: false, errors: [error.message], warnings: [] };
    }
    throw error;
  }
}
