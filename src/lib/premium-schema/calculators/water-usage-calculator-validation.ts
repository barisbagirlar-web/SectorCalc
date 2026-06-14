export type WaterUsageCalculatorInputs = {
  dailyUsage: number;
  operatingDays: number;
  unitWaterCost: number;
  wasteVolume: number;
  productionOutput: number;
};

export type WaterUsageCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const WATER_USAGE_CALCULATOR_INPUT_KEYS: readonly (keyof WaterUsageCalculatorInputs)[] = [
  "dailyUsage",
  "operatingDays",
  "unitWaterCost",
  "wasteVolume",
  "productionOutput",
];

const INPUT_LABELS: Record<keyof WaterUsageCalculatorInputs, string> = {
  dailyUsage: "dailyUsage",
  operatingDays: "operatingDays",
  unitWaterCost: "unitWaterCost",
  wasteVolume: "wasteVolume",
  productionOutput: "productionOutput",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: WaterUsageCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of WATER_USAGE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.dailyUsage < 0.001 || inputs.dailyUsage > 1000000) {
    errors.push("dailyUsage must be between 0.001 and 1000000.");
  }

  if (inputs.dailyUsage <= 0) {
    errors.push("dailyUsage must be greater than zero.");
  }

  if (inputs.operatingDays < 1 || inputs.operatingDays > 365) {
    errors.push("operatingDays must be between 1 and 365.");
  }

  if (inputs.operatingDays <= 0) {
    errors.push("operatingDays must be greater than zero.");
  }

  if (inputs.unitWaterCost < 0 || inputs.unitWaterCost > 1000) {
    errors.push("unitWaterCost must be between 0 and 1000.");
  }

  if (inputs.wasteVolume < 0 || inputs.wasteVolume > 1000000) {
    errors.push("wasteVolume must be between 0 and 1000000.");
  }

  if (inputs.wasteVolume <= 0) {
    errors.push("wasteVolume must be greater than zero.");
  }

  if (inputs.productionOutput < 1 || inputs.productionOutput > 10000000) {
    errors.push("productionOutput must be between 1 and 10000000.");
  }

  if (inputs.productionOutput <= 0) {
    errors.push("productionOutput must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: WaterUsageCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateWaterUsageCalculatorInputs(inputs: WaterUsageCalculatorInputs): WaterUsageCalculatorValidationResult {
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
