export type SquareMeterCalculatorInputs = {
  length: number;
  width: number;
  wastePercent: number;
  unitCost: number;
};

export type SquareMeterCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const SQUARE_METER_CALCULATOR_INPUT_KEYS: readonly (keyof SquareMeterCalculatorInputs)[] = [
  "length",
  "width",
  "wastePercent",
  "unitCost",
];

const INPUT_LABELS: Record<keyof SquareMeterCalculatorInputs, string> = {
  length: "length",
  width: "width",
  wastePercent: "wastePercent",
  unitCost: "unitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: SquareMeterCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of SQUARE_METER_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.length < 0.001 || inputs.length > 10000) {
    errors.push("length must be between 0.001 and 10000.");
  }

  if (inputs.length <= 0) {
    errors.push("length must be greater than zero.");
  }

  if (inputs.width < 0.001 || inputs.width > 10000) {
    errors.push("width must be between 0.001 and 10000.");
  }

  if (inputs.width <= 0) {
    errors.push("width must be greater than zero.");
  }

  if (inputs.wastePercent < 0 || inputs.wastePercent > 100) {
    errors.push("wastePercent must be between 0 and 100.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 100000) {
    errors.push("unitCost must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: SquareMeterCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateSquareMeterCalculatorInputs(inputs: SquareMeterCalculatorInputs): SquareMeterCalculatorValidationResult {
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
