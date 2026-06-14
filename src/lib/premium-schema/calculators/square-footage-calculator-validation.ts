export type SquareFootageCalculatorInputs = {
  lengthFeet: number;
  widthFeet: number;
  wasteFactorPercent: number;
  unitCostPerSquareFoot: number;
};

export type SquareFootageCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SQUARE_FOOTAGE_CALCULATOR_INPUT_KEYS: readonly (keyof SquareFootageCalculatorInputs)[] = [
  "lengthFeet",
  "widthFeet",
  "wasteFactorPercent",
  "unitCostPerSquareFoot",
];

const INPUT_LABELS: Record<keyof SquareFootageCalculatorInputs, string> = {
  lengthFeet: "lengthFeet",
  widthFeet: "widthFeet",
  wasteFactorPercent: "wasteFactorPercent",
  unitCostPerSquareFoot: "unitCostPerSquareFoot",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SquareFootageCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SQUARE_FOOTAGE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.lengthFeet < 0.01 || inputs.lengthFeet > 100000) {
    errors.push("lengthFeet must be between 0.01 and 100000.");
  }

  if (inputs.lengthFeet <= 0) {
    errors.push("lengthFeet must be greater than zero.");
  }

  if (inputs.widthFeet < 0.01 || inputs.widthFeet > 100000) {
    errors.push("widthFeet must be between 0.01 and 100000.");
  }

  if (inputs.widthFeet <= 0) {
    errors.push("widthFeet must be greater than zero.");
  }

  if (inputs.wasteFactorPercent < 0 || inputs.wasteFactorPercent > 100) {
    errors.push("wasteFactorPercent must be between 0 and 100.");
  }

  if (inputs.unitCostPerSquareFoot < 0 || inputs.unitCostPerSquareFoot > 10000) {
    errors.push("unitCostPerSquareFoot must be between 0 and 10000.");
  }

  return errors;
}

function collectWarnings(inputs: SquareFootageCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSquareFootageCalculatorInputs(inputs: SquareFootageCalculatorInputs): SquareFootageCalculatorValidationResult {
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
