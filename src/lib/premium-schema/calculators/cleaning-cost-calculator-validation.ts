export type CleaningCostCalculatorInputs = {
  jobArea: number;
  materialCost: number;
  laborHours: number;
  laborHourlyRate: number;
  equipmentCost: number;
  travelCost: number;
};

export type CleaningCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CLEANING_COST_CALCULATOR_INPUT_KEYS: readonly (keyof CleaningCostCalculatorInputs)[] = [
  "jobArea",
  "materialCost",
  "laborHours",
  "laborHourlyRate",
  "equipmentCost",
  "travelCost",
];

const INPUT_LABELS: Record<keyof CleaningCostCalculatorInputs, string> = {
  jobArea: "jobArea",
  materialCost: "materialCost",
  laborHours: "laborHours",
  laborHourlyRate: "laborHourlyRate",
  equipmentCost: "equipmentCost",
  travelCost: "travelCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CleaningCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of CLEANING_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.jobArea < 0 || inputs.jobArea > 1000000) {
    errors.push("jobArea must be between 0 and 1000000.");
  }

  if (inputs.materialCost < 0 || inputs.materialCost > 1000000) {
    errors.push("materialCost must be between 0 and 1000000.");
  }

  if (inputs.laborHours < 0 || inputs.laborHours > 10000) {
    errors.push("laborHours must be between 0 and 10000.");
  }

  if (inputs.laborHourlyRate < 0 || inputs.laborHourlyRate > 500) {
    errors.push("laborHourlyRate must be between 0 and 500.");
  }

  if (inputs.equipmentCost < 0 || inputs.equipmentCost > 100000) {
    errors.push("equipmentCost must be between 0 and 100000.");
  }

  if (inputs.travelCost < 0 || inputs.travelCost > 10000) {
    errors.push("travelCost must be between 0 and 10000.");
  }

  return errors;
}

function collectWarnings(inputs: CleaningCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCleaningCostCalculatorInputs(inputs: CleaningCostCalculatorInputs): CleaningCostCalculatorValidationResult {
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
