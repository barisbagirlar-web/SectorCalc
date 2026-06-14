export type OeeCalculatorInputs = {
  totalShiftTime: number;
  plannedDowntime: number;
  unplannedDowntime: number;
  waitingTime: number;
  idealCycleTime: number;
  totalUnitsProduced: number;
};

export type OeeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const OEE_CALCULATOR_INPUT_KEYS: readonly (keyof OeeCalculatorInputs)[] = [
  "totalShiftTime",
  "plannedDowntime",
  "unplannedDowntime",
  "waitingTime",
  "idealCycleTime",
  "totalUnitsProduced",
];

const INPUT_LABELS: Record<keyof OeeCalculatorInputs, string> = {
  totalShiftTime: "totalShiftTime",
  plannedDowntime: "plannedDowntime",
  unplannedDowntime: "unplannedDowntime",
  waitingTime: "waitingTime",
  idealCycleTime: "idealCycleTime",
  totalUnitsProduced: "totalUnitsProduced",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: OeeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of OEE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.totalShiftTime < 0.01 || inputs.totalShiftTime > 24) {
    errors.push("totalShiftTime must be between 0.01 and 24.");
  }

  if (inputs.totalShiftTime <= 0) {
    errors.push("totalShiftTime must be greater than zero.");
  }

  if (inputs.plannedDowntime < 0 || inputs.plannedDowntime > 24) {
    errors.push("plannedDowntime must be between 0 and 24.");
  }

  if (inputs.unplannedDowntime < 0 || inputs.unplannedDowntime > 24) {
    errors.push("unplannedDowntime must be between 0 and 24.");
  }

  if (inputs.waitingTime < 0 || inputs.waitingTime > 24) {
    errors.push("waitingTime must be between 0 and 24.");
  }

  if (inputs.idealCycleTime < 0.0001 || inputs.idealCycleTime > 1) {
    errors.push("idealCycleTime must be between 0.0001 and 1.");
  }

  if (inputs.idealCycleTime <= 0) {
    errors.push("idealCycleTime must be greater than zero.");
  }

  if (inputs.totalUnitsProduced < 1 || inputs.totalUnitsProduced > 1000000) {
    errors.push("totalUnitsProduced must be between 1 and 1000000.");
  }

  if (inputs.totalUnitsProduced <= 0) {
    errors.push("totalUnitsProduced must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: OeeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateOeeCalculatorInputs(inputs: OeeCalculatorInputs): OeeCalculatorValidationResult {
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
