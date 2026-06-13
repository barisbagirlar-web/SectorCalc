export type HydraulicPneumaticCylinderForceCalculatorInputs = {
  pressureBar: number;
  boreMm: number;
  rodMm: number;
};

export type HydraulicPneumaticCylinderForceCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_INPUT_KEYS: readonly (keyof HydraulicPneumaticCylinderForceCalculatorInputs)[] = [
  "pressureBar",
  "boreMm",
  "rodMm",
];

const INPUT_LABELS: Record<keyof HydraulicPneumaticCylinderForceCalculatorInputs, string> = {
  pressureBar: "pressureBar",
  boreMm: "boreMm",
  rodMm: "rodMm",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: HydraulicPneumaticCylinderForceCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.pressureBar < 0) {
    errors.push("pressureBar must be greater than or equal to zero.");
  }

  if (inputs.pressureBar <= 0) {
    errors.push("pressureBar must be greater than zero.");
  }

  if (inputs.boreMm < 0) {
    errors.push("boreMm must be greater than or equal to zero.");
  }

  if (inputs.boreMm <= 0) {
    errors.push("boreMm must be greater than zero.");
  }

  if (inputs.rodMm < 0) {
    errors.push("rodMm must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: HydraulicPneumaticCylinderForceCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateHydraulicPneumaticCylinderForceCalculatorInputs(inputs: HydraulicPneumaticCylinderForceCalculatorInputs): HydraulicPneumaticCylinderForceCalculatorValidationResult {
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
