export type DepreciationCalculatorInputs = {
  assetCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  yearsElapsed: number;
};

export type DepreciationCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const DEPRECIATION_CALCULATOR_INPUT_KEYS: readonly (keyof DepreciationCalculatorInputs)[] = [
  "assetCost",
  "salvageValue",
  "usefulLifeYears",
  "yearsElapsed",
];

const INPUT_LABELS: Record<keyof DepreciationCalculatorInputs, string> = {
  assetCost: "assetCost",
  salvageValue: "salvageValue",
  usefulLifeYears: "usefulLifeYears",
  yearsElapsed: "yearsElapsed",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: DepreciationCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of DEPRECIATION_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.assetCost < 0 || inputs.assetCost > 1000000000) {
    errors.push("assetCost must be between 0 and 1000000000.");
  }

  if (inputs.salvageValue < 0 || inputs.salvageValue > 1000000000) {
    errors.push("salvageValue must be between 0 and 1000000000.");
  }

  if (inputs.usefulLifeYears < 1 || inputs.usefulLifeYears > 100) {
    errors.push("usefulLifeYears must be between 1 and 100.");
  }

  if (inputs.usefulLifeYears <= 0) {
    errors.push("usefulLifeYears must be greater than zero.");
  }

  if (inputs.yearsElapsed < 0 || inputs.yearsElapsed > 100) {
    errors.push("yearsElapsed must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: DepreciationCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateDepreciationCalculatorInputs(inputs: DepreciationCalculatorInputs): DepreciationCalculatorValidationResult {
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
