export type FireSystemFlowHydrantCalculatorInputs = {
  protectedAreaM2: number;
  designDensityLpmM2: number;
  hydrantCapacityLpm: number;
};

export type FireSystemFlowHydrantCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_INPUT_KEYS: readonly (keyof FireSystemFlowHydrantCalculatorInputs)[] = [
  "protectedAreaM2",
  "designDensityLpmM2",
  "hydrantCapacityLpm",
];

const INPUT_LABELS: Record<keyof FireSystemFlowHydrantCalculatorInputs, string> = {
  protectedAreaM2: "protectedAreaM2",
  designDensityLpmM2: "designDensityLpmM2",
  hydrantCapacityLpm: "hydrantCapacityLpm",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FireSystemFlowHydrantCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.protectedAreaM2 < 0) {
    errors.push("protectedAreaM2 must be greater than or equal to zero.");
  }

  if (inputs.protectedAreaM2 <= 0) {
    errors.push("protectedAreaM2 must be greater than zero.");
  }

  if (inputs.designDensityLpmM2 < 0) {
    errors.push("designDensityLpmM2 must be greater than or equal to zero.");
  }

  if (inputs.designDensityLpmM2 <= 0) {
    errors.push("designDensityLpmM2 must be greater than zero.");
  }

  if (inputs.hydrantCapacityLpm < 0) {
    errors.push("hydrantCapacityLpm must be greater than or equal to zero.");
  }

  if (inputs.hydrantCapacityLpm <= 0) {
    errors.push("hydrantCapacityLpm must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: FireSystemFlowHydrantCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFireSystemFlowHydrantCalculatorInputs(inputs: FireSystemFlowHydrantCalculatorInputs): FireSystemFlowHydrantCalculatorValidationResult {
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
