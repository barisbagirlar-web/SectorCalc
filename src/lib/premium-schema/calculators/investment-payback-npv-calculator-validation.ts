export type InvestmentPaybackNpvCalculatorInputs = {
  initialInvestment: number;
  annualCashFlow: number;
  discountRatePercent: number;
  horizonYears: number;
};

export type InvestmentPaybackNpvCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const INVESTMENT_PAYBACK_NPV_CALCULATOR_INPUT_KEYS: readonly (keyof InvestmentPaybackNpvCalculatorInputs)[] = [
  "initialInvestment",
  "annualCashFlow",
  "discountRatePercent",
  "horizonYears",
];

const INPUT_LABELS: Record<keyof InvestmentPaybackNpvCalculatorInputs, string> = {
  initialInvestment: "initialInvestment",
  annualCashFlow: "annualCashFlow",
  discountRatePercent: "discountRatePercent",
  horizonYears: "horizonYears",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: InvestmentPaybackNpvCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of INVESTMENT_PAYBACK_NPV_CALCULATOR_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  if (inputs.initialInvestment < 0) {
    errors.push("initialInvestment must be greater than or equal to zero.");
  }

  if (inputs.annualCashFlow < 0) {
    errors.push("annualCashFlow must be greater than or equal to zero.");
  }

  if (inputs.discountRatePercent < 0 || inputs.discountRatePercent > 100) {
    errors.push("discountRatePercent must be between 0 and 100.");
  }

  if (inputs.discountRatePercent <= 0) {
    errors.push("discountRatePercent must be greater than zero.");
  }

  if (inputs.horizonYears < 1 || inputs.horizonYears > 30) {
    errors.push("horizonYears must be between 1 and 30.");
  }

  if (inputs.horizonYears <= 0) {
    errors.push("horizonYears must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: InvestmentPaybackNpvCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateInvestmentPaybackNpvCalculatorInputs(inputs: InvestmentPaybackNpvCalculatorInputs): InvestmentPaybackNpvCalculatorValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  return {
    ok: true,
    errors: [],
    warnings: collectWarnings(inputs),
  };
}
