export type VehicleDepreciationCalculatorInputs = {
  initialCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  yearsUsed: number;
};

export type VehicleDepreciationCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const VEHICLE_DEPRECIATION_CALCULATOR_INPUT_KEYS: readonly (keyof VehicleDepreciationCalculatorInputs)[] = [
  "initialCost",
  "salvageValue",
  "usefulLifeYears",
  "yearsUsed",
];

const INPUT_LABELS: Record<keyof VehicleDepreciationCalculatorInputs, string> = {
  initialCost: "initialCost",
  salvageValue: "salvageValue",
  usefulLifeYears: "usefulLifeYears",
  yearsUsed: "yearsUsed",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: VehicleDepreciationCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of VEHICLE_DEPRECIATION_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.initialCost < 1 || inputs.initialCost > 10000000) {
    errors.push("initialCost must be between 1 and 10000000.");
  }

  if (inputs.initialCost <= 0) {
    errors.push("initialCost must be greater than zero.");
  }

  if (inputs.salvageValue < 0 || inputs.salvageValue > 10000000) {
    errors.push("salvageValue must be between 0 and 10000000.");
  }

  if (inputs.usefulLifeYears < 1 || inputs.usefulLifeYears > 50) {
    errors.push("usefulLifeYears must be between 1 and 50.");
  }

  if (inputs.usefulLifeYears <= 0) {
    errors.push("usefulLifeYears must be greater than zero.");
  }

  if (inputs.yearsUsed < 0 || inputs.yearsUsed > 50) {
    errors.push("yearsUsed must be between 0 and 50.");
  }

  return errors;
}

function collectWarnings(inputs: VehicleDepreciationCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateVehicleDepreciationCalculatorInputs(inputs: VehicleDepreciationCalculatorInputs): VehicleDepreciationCalculatorValidationResult {
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
