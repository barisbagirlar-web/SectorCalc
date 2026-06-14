export type WeldingCostEstimatorInputs = {
  batchSize: number;
  machineTimeHours: number;
  setupTimeMinutes: number;
  laborTimeHours: number;
  machineHourlyRate: number;
  laborHourlyRate: number;
};

export type WeldingCostEstimatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const WELDING_COST_ESTIMATOR_INPUT_KEYS: readonly (keyof WeldingCostEstimatorInputs)[] = [
  "batchSize",
  "machineTimeHours",
  "setupTimeMinutes",
  "laborTimeHours",
  "machineHourlyRate",
  "laborHourlyRate",
];

const INPUT_LABELS: Record<keyof WeldingCostEstimatorInputs, string> = {
  batchSize: "batchSize",
  machineTimeHours: "machineTimeHours",
  setupTimeMinutes: "setupTimeMinutes",
  laborTimeHours: "laborTimeHours",
  machineHourlyRate: "machineHourlyRate",
  laborHourlyRate: "laborHourlyRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: WeldingCostEstimatorInputs): string[] {
  const errors: string[] = [];

  for (const key of WELDING_COST_ESTIMATOR_INPUT_KEYS) {
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

  if (inputs.machineTimeHours < 0 || inputs.machineTimeHours > 1000) {
    errors.push("machineTimeHours must be between 0 and 1000.");
  }

  if (inputs.setupTimeMinutes < 0 || inputs.setupTimeMinutes > 10000) {
    errors.push("setupTimeMinutes must be between 0 and 10000.");
  }

  if (inputs.laborTimeHours < 0 || inputs.laborTimeHours > 1000) {
    errors.push("laborTimeHours must be between 0 and 1000.");
  }

  if (inputs.machineHourlyRate < 0 || inputs.machineHourlyRate > 10000) {
    errors.push("machineHourlyRate must be between 0 and 10000.");
  }

  if (inputs.laborHourlyRate < 0 || inputs.laborHourlyRate > 10000) {
    errors.push("laborHourlyRate must be between 0 and 10000.");
  }

  return errors;
}

function collectWarnings(inputs: WeldingCostEstimatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateWeldingCostEstimatorInputs(inputs: WeldingCostEstimatorInputs): WeldingCostEstimatorValidationResult {
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
