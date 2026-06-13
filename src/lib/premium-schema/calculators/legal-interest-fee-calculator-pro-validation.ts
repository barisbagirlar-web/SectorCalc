export type LegalInterestFeeCalculatorProInputs = {
  principal: number;
  annualInterestPercent: number;
  days: number;
  feePercent: number;
  fixedCost: number;
};

export type LegalInterestFeeCalculatorProValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const LEGAL_INTEREST_FEE_CALCULATOR_PRO_INPUT_KEYS: readonly (keyof LegalInterestFeeCalculatorProInputs)[] = [
  "principal",
  "annualInterestPercent",
  "days",
  "feePercent",
  "fixedCost",
];

const INPUT_LABELS: Record<keyof LegalInterestFeeCalculatorProInputs, string> = {
  principal: "principal",
  annualInterestPercent: "annualInterestPercent",
  days: "days",
  feePercent: "feePercent",
  fixedCost: "fixedCost",
};

const summaryRule = {
  fieldId: "days",
  warning: 90,
  critical: 365,
  direction: "higher_is_bad",
} as const;

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: LegalInterestFeeCalculatorProInputs): string[] {
  const errors: string[] = [];

  for (const key of LEGAL_INTEREST_FEE_CALCULATOR_PRO_INPUT_KEYS) {
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

  if (inputs.principal < 0) {
    errors.push("principal must be greater than or equal to zero.");
  }

  if (inputs.annualInterestPercent < 0 || inputs.annualInterestPercent > 100) {
    errors.push("annualInterestPercent must be between 0 and 100.");
  }

  if (inputs.days < 0) {
    errors.push("days must be greater than or equal to zero.");
  }

  if (inputs.days <= 0) {
    errors.push("days must be greater than zero.");
  }

  if (inputs.feePercent < 0 || inputs.feePercent > 100) {
    errors.push("feePercent must be between 0 and 100.");
  }

  if (inputs.fixedCost < 0) {
    errors.push("fixedCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: LegalInterestFeeCalculatorProInputs): string[] {
  const warnings: string[] = [];

  if (inputs.days >= summaryRule.warning) {
    warnings.push("Accrual period is extended — interest exposure is building.");
  }

  return warnings;
}

export function validateLegalInterestFeeCalculatorProInputs(inputs: LegalInterestFeeCalculatorProInputs): LegalInterestFeeCalculatorProValidationResult {
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
