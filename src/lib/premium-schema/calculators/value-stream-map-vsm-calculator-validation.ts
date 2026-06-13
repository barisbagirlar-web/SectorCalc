export type ValueStreamMapVsmCalculatorInputs = {
  processMinutes: number;
  waitMinutes: number;
  transportMinutes: number;
};

export type ValueStreamMapVsmCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const VALUE_STREAM_MAP_VSM_CALCULATOR_INPUT_KEYS: readonly (keyof ValueStreamMapVsmCalculatorInputs)[] = [
  "processMinutes",
  "waitMinutes",
  "transportMinutes",
];

const INPUT_LABELS: Record<keyof ValueStreamMapVsmCalculatorInputs, string> = {
  processMinutes: "processMinutes",
  waitMinutes: "waitMinutes",
  transportMinutes: "transportMinutes",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ValueStreamMapVsmCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of VALUE_STREAM_MAP_VSM_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.processMinutes < 0) {
    errors.push("processMinutes must be greater than or equal to zero.");
  }

  if (inputs.waitMinutes < 0) {
    errors.push("waitMinutes must be greater than or equal to zero.");
  }

  if (inputs.transportMinutes < 0) {
    errors.push("transportMinutes must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: ValueStreamMapVsmCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateValueStreamMapVsmCalculatorInputs(inputs: ValueStreamMapVsmCalculatorInputs): ValueStreamMapVsmCalculatorValidationResult {
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
