export type CncCycleTimeCalculatorInputs = {
  batchSize: number;
  machineTimeMinutes: number;
  setupTimeMinutes: number;
  laborTimeMinutes: number;
  machineHourlyRate: number;
  laborHourlyRate: number;
};

export type CncCycleTimeCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CNC_CYCLE_TIME_CALCULATOR_INPUT_KEYS: readonly (keyof CncCycleTimeCalculatorInputs)[] = [
  "batchSize",
  "machineTimeMinutes",
  "setupTimeMinutes",
  "laborTimeMinutes",
  "machineHourlyRate",
  "laborHourlyRate",
];

const INPUT_LABELS: Record<keyof CncCycleTimeCalculatorInputs, string> = {
  batchSize: "batchSize",
  machineTimeMinutes: "machineTimeMinutes",
  setupTimeMinutes: "setupTimeMinutes",
  laborTimeMinutes: "laborTimeMinutes",
  machineHourlyRate: "machineHourlyRate",
  laborHourlyRate: "laborHourlyRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CncCycleTimeCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of CNC_CYCLE_TIME_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.batchSize < 1 || inputs.batchSize > 1000000) {
    errors.push("batchSize must be between 1 and 1000000.");
  }

  if (inputs.batchSize <= 0) {
    errors.push("batchSize must be greater than zero.");
  }

  if (inputs.machineTimeMinutes < 0.01 || inputs.machineTimeMinutes > 1440) {
    errors.push("machineTimeMinutes must be between 0.01 and 1440.");
  }

  if (inputs.machineTimeMinutes <= 0) {
    errors.push("machineTimeMinutes must be greater than zero.");
  }

  if (inputs.setupTimeMinutes < 0 || inputs.setupTimeMinutes > 1440) {
    errors.push("setupTimeMinutes must be between 0 and 1440.");
  }

  if (inputs.laborTimeMinutes < 0 || inputs.laborTimeMinutes > 1440) {
    errors.push("laborTimeMinutes must be between 0 and 1440.");
  }

  if (inputs.machineHourlyRate < 0 || inputs.machineHourlyRate > 10000) {
    errors.push("machineHourlyRate must be between 0 and 10000.");
  }

  if (inputs.laborHourlyRate < 0 || inputs.laborHourlyRate > 10000) {
    errors.push("laborHourlyRate must be between 0 and 10000.");
  }

  return errors;
}

function collectWarnings(inputs: CncCycleTimeCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCncCycleTimeCalculatorInputs(inputs: CncCycleTimeCalculatorInputs): CncCycleTimeCalculatorValidationResult {
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
