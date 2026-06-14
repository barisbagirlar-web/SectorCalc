export type MotorGucuKwHpCeviriciInputs = {
  powerValue: number;
  inputUnit: number;
  motorEfficiencyPercent: number;
};

export type MotorGucuKwHpCeviriciValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MOTOR_GUCU_KW_HP_CEVIRICI_INPUT_KEYS: readonly (keyof MotorGucuKwHpCeviriciInputs)[] = [
  "powerValue",
  "inputUnit",
  "motorEfficiencyPercent",
];

const INPUT_LABELS: Record<keyof MotorGucuKwHpCeviriciInputs, string> = {
  powerValue: "powerValue",
  inputUnit: "inputUnit",
  motorEfficiencyPercent: "motorEfficiencyPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MotorGucuKwHpCeviriciInputs): string[] {
  const errors: string[] = [];

  for (const key of MOTOR_GUCU_KW_HP_CEVIRICI_INPUT_KEYS) {
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

  if (inputs.powerValue < 0 || inputs.powerValue > 100000) {
    errors.push("powerValue must be between 0 and 100000.");
  }

  if (inputs.inputUnit < 0) {
    errors.push("inputUnit must be greater than or equal to zero.");
  }

  if (inputs.motorEfficiencyPercent < 0 || inputs.motorEfficiencyPercent > 100) {
    errors.push("motorEfficiencyPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: MotorGucuKwHpCeviriciInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMotorGucuKwHpCeviriciInputs(inputs: MotorGucuKwHpCeviriciInputs): MotorGucuKwHpCeviriciValidationResult {
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
