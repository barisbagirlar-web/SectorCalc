export type FertilizerDosageCalculatorInputs = {
  targetYield: number;
  nutrientUptakePerUnit: number;
  soilAvailableNutrient: number;
  applicationEfficiency: number;
  nutrientContent: number;
  unitCost: number;
};

export type FertilizerDosageCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FERTILIZER_DOSAGE_CALCULATOR_INPUT_KEYS: readonly (keyof FertilizerDosageCalculatorInputs)[] = [
  "targetYield",
  "nutrientUptakePerUnit",
  "soilAvailableNutrient",
  "applicationEfficiency",
  "nutrientContent",
  "unitCost",
];

const INPUT_LABELS: Record<keyof FertilizerDosageCalculatorInputs, string> = {
  targetYield: "targetYield",
  nutrientUptakePerUnit: "nutrientUptakePerUnit",
  soilAvailableNutrient: "soilAvailableNutrient",
  applicationEfficiency: "applicationEfficiency",
  nutrientContent: "nutrientContent",
  unitCost: "unitCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FertilizerDosageCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of FERTILIZER_DOSAGE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.targetYield < 0 || inputs.targetYield > 50000) {
    errors.push("targetYield must be between 0 and 50000.");
  }

  if (inputs.nutrientUptakePerUnit < 0 || inputs.nutrientUptakePerUnit > 1) {
    errors.push("nutrientUptakePerUnit must be between 0 and 1.");
  }

  if (inputs.soilAvailableNutrient < 0 || inputs.soilAvailableNutrient > 1000) {
    errors.push("soilAvailableNutrient must be between 0 and 1000.");
  }

  if (inputs.applicationEfficiency < 0 || inputs.applicationEfficiency > 100) {
    errors.push("applicationEfficiency must be between 0 and 100.");
  }

  if (inputs.nutrientContent < 0 || inputs.nutrientContent > 100) {
    errors.push("nutrientContent must be between 0 and 100.");
  }

  if (inputs.unitCost < 0 || inputs.unitCost > 1000) {
    errors.push("unitCost must be between 0 and 1000.");
  }

  return errors;
}

function collectWarnings(inputs: FertilizerDosageCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFertilizerDosageCalculatorInputs(inputs: FertilizerDosageCalculatorInputs): FertilizerDosageCalculatorValidationResult {
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
