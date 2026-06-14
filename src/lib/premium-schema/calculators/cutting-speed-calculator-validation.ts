export type CuttingSpeedCalculatorInputs = {
  toolDiameter: number;
  spindleSpeed: number;
  toolMaterialFactor: number;
  workpieceMaterialFactor: number;
  maxSafeSpeed: number;
};

export type CuttingSpeedCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const CUTTING_SPEED_CALCULATOR_INPUT_KEYS: readonly (keyof CuttingSpeedCalculatorInputs)[] = [
  "toolDiameter",
  "spindleSpeed",
  "toolMaterialFactor",
  "workpieceMaterialFactor",
  "maxSafeSpeed",
];

const INPUT_LABELS: Record<keyof CuttingSpeedCalculatorInputs, string> = {
  toolDiameter: "toolDiameter",
  spindleSpeed: "spindleSpeed",
  toolMaterialFactor: "toolMaterialFactor",
  workpieceMaterialFactor: "workpieceMaterialFactor",
  maxSafeSpeed: "maxSafeSpeed",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CuttingSpeedCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of CUTTING_SPEED_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.toolDiameter < 0.1 || inputs.toolDiameter > 500) {
    errors.push("toolDiameter must be between 0.1 and 500.");
  }

  if (inputs.toolDiameter <= 0) {
    errors.push("toolDiameter must be greater than zero.");
  }

  if (inputs.spindleSpeed < 1 || inputs.spindleSpeed > 50000) {
    errors.push("spindleSpeed must be between 1 and 50000.");
  }

  if (inputs.spindleSpeed <= 0) {
    errors.push("spindleSpeed must be greater than zero.");
  }

  if (inputs.toolMaterialFactor < 0.1 || inputs.toolMaterialFactor > 5) {
    errors.push("toolMaterialFactor must be between 0.1 and 5.");
  }

  if (inputs.toolMaterialFactor <= 0) {
    errors.push("toolMaterialFactor must be greater than zero.");
  }

  if (inputs.workpieceMaterialFactor < 0.1 || inputs.workpieceMaterialFactor > 5) {
    errors.push("workpieceMaterialFactor must be between 0.1 and 5.");
  }

  if (inputs.workpieceMaterialFactor <= 0) {
    errors.push("workpieceMaterialFactor must be greater than zero.");
  }

  if (inputs.maxSafeSpeed < 1 || inputs.maxSafeSpeed > 10000) {
    errors.push("maxSafeSpeed must be between 1 and 10000.");
  }

  if (inputs.maxSafeSpeed <= 0) {
    errors.push("maxSafeSpeed must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: CuttingSpeedCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCuttingSpeedCalculatorInputs(inputs: CuttingSpeedCalculatorInputs): CuttingSpeedCalculatorValidationResult {
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
