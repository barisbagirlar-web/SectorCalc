export type ToleranceStackUpCalculatorInputs = {
  t1: number;
  t2: number;
  t3: number;
  t4: number;
  assemblyLimit: number;
};

export type ToleranceStackUpCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TOLERANCE_STACK_UP_CALCULATOR_INPUT_KEYS: readonly (keyof ToleranceStackUpCalculatorInputs)[] = [
  "t1",
  "t2",
  "t3",
  "t4",
  "assemblyLimit",
];

const INPUT_LABELS: Record<keyof ToleranceStackUpCalculatorInputs, string> = {
  t1: "t1",
  t2: "t2",
  t3: "t3",
  t4: "t4",
  assemblyLimit: "assemblyLimit",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ToleranceStackUpCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TOLERANCE_STACK_UP_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.t1 < 0) {
    errors.push("t1 must be greater than or equal to zero.");
  }

  if (inputs.t2 < 0) {
    errors.push("t2 must be greater than or equal to zero.");
  }

  if (inputs.t3 < 0) {
    errors.push("t3 must be greater than or equal to zero.");
  }

  if (inputs.t4 < 0) {
    errors.push("t4 must be greater than or equal to zero.");
  }

  if (inputs.assemblyLimit < 0) {
    errors.push("assemblyLimit must be greater than or equal to zero.");
  }

  if (inputs.assemblyLimit <= 0) {
    errors.push("assemblyLimit must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: ToleranceStackUpCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateToleranceStackUpCalculatorInputs(inputs: ToleranceStackUpCalculatorInputs): ToleranceStackUpCalculatorValidationResult {
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
