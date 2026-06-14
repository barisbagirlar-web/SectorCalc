export type RenovationBudgetOptimizerInputs = {
  principal: number;
  annualInterestPercent: number;
  days: number;
  feePercent: number;
  fixedCost: number;
};

export type RenovationBudgetOptimizerValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RENOVATION_BUDGET_OPTIMIZER_INPUT_KEYS: readonly (keyof RenovationBudgetOptimizerInputs)[] = [
  "principal",
  "annualInterestPercent",
  "days",
  "feePercent",
  "fixedCost",
];

const INPUT_LABELS: Record<keyof RenovationBudgetOptimizerInputs, string> = {
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

function collectInputErrors(inputs: RenovationBudgetOptimizerInputs): string[] {
  const errors: string[] = [];

  for (const key of RENOVATION_BUDGET_OPTIMIZER_INPUT_KEYS) {
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

function collectWarnings(inputs: RenovationBudgetOptimizerInputs): string[] {
  const warnings: string[] = [];

  if (inputs.days >= summaryRule.warning) {
    warnings.push("Accrual period is extended — interest exposure is building.");
  }

  return warnings;
}

export function validateRenovationBudgetOptimizerInputs(inputs: RenovationBudgetOptimizerInputs): RenovationBudgetOptimizerValidationResult {
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
