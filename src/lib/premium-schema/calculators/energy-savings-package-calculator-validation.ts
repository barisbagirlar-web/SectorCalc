export type EnergySavingsPackageCalculatorInputs = {
  baselineKwhMonthly: number;
  proposedKwhMonthly: number;
  energyRate: number;
  projectCost: number;
};

export type EnergySavingsPackageCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ENERGY_SAVINGS_PACKAGE_CALCULATOR_INPUT_KEYS: readonly (keyof EnergySavingsPackageCalculatorInputs)[] = [
  "baselineKwhMonthly",
  "proposedKwhMonthly",
  "energyRate",
  "projectCost",
];

const INPUT_LABELS: Record<keyof EnergySavingsPackageCalculatorInputs, string> = {
  baselineKwhMonthly: "baselineKwhMonthly",
  proposedKwhMonthly: "proposedKwhMonthly",
  energyRate: "energyRate",
  projectCost: "projectCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: EnergySavingsPackageCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of ENERGY_SAVINGS_PACKAGE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.baselineKwhMonthly < 0) {
    errors.push("baselineKwhMonthly must be greater than or equal to zero.");
  }

  if (inputs.baselineKwhMonthly <= 0) {
    errors.push("baselineKwhMonthly must be greater than zero.");
  }

  if (inputs.proposedKwhMonthly < 0) {
    errors.push("proposedKwhMonthly must be greater than or equal to zero.");
  }

  if (inputs.energyRate < 0 || inputs.energyRate > 100) {
    errors.push("energyRate must be between 0 and 100.");
  }

  if (inputs.projectCost < 0) {
    errors.push("projectCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: EnergySavingsPackageCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateEnergySavingsPackageCalculatorInputs(inputs: EnergySavingsPackageCalculatorInputs): EnergySavingsPackageCalculatorValidationResult {
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
