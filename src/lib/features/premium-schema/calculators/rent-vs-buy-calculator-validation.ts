/**
 * Rent vs Buy calculator input validation.
 *
 * Guards:
 * - comparisonYears must be 1–40 (not a calendar year like 2026)
 * - monthlyRent, homePrice must be positive
 * - Rate/percent fields must be 0–100
 */
export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateRentVsBuyCalculatorInputs(inputs: Record<string, number>): ValidationResult {
  const errors: string[] = [];

  if (inputs.comparisonYears !== undefined) {
    if (inputs.comparisonYears < 1 || inputs.comparisonYears > 40) {
      errors.push("comparisonYears must be between 1 and 40");
    }
    // Calendar year guard - if value looks like a year (e.g. 2026), reject
    if (inputs.comparisonYears >= 1900 && inputs.comparisonYears <= 2100) {
      errors.push("comparisonYears must represent a horizon in years, not a calendar year");
    }
  }

  if (inputs.monthlyRent !== undefined && inputs.monthlyRent < 0) {
    errors.push("monthlyRent must not be negative");
  }

  if (inputs.homePrice !== undefined && inputs.homePrice <= 0) {
    errors.push("homePrice must be positive");
  }

  // Percentage range checks
  for (const key of ["annualRentIncrease", "annualHomeAppreciation", "downPaymentPercent", "mortgageInterestRate", "mortgageTermYears", "investmentReturnRate", "ownershipCostPercent", "purchaseCostPercent", "sellingCostPercent"] as const) {
    if (inputs[key] !== undefined && (inputs[key] < 0 || inputs[key] > 100)) {
      errors.push(`${key} must be between 0 and 100`);
    }
  }

  return { ok: errors.length === 0, errors };
}

export const RENT_VS_BUY_CALCULATOR_INPUT_KEYS: (inputs: any) => { outputs: Record<string, unknown>; rules: unknown[]; charts: unknown[] } = (
  _inputs: any,
) => {
  return {
    outputs: {},
    rules: [],
    charts: [],
  };
};
