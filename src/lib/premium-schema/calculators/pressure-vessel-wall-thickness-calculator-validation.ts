<<<<<<< Updated upstream
// Implementation removed for rewrite
export const PRESSURE_VESSEL_WALL_THICKNESS_CALCULATOR_INPUT_KEYS = (inputs: any) => {
  return {
    outputs: {},
    rules: [],
    charts: []
  };
};
=======
export type PressureVesselWallThicknessCalculatorInputs = {
  designPressureBar: number;
  diameterMm: number;
  allowableStressMpa: number;
  weldEfficiency: number;
};

export type PressureVesselWallThicknessCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PRESSURE_VESSEL_WALL_THICKNESS_CALCULATOR_INPUT_KEYS: readonly (keyof PressureVesselWallThicknessCalculatorInputs)[] = [
  "designPressureBar",
  "diameterMm",
  "allowableStressMpa",
  "weldEfficiency",
];

const INPUT_LABELS: Record<keyof PressureVesselWallThicknessCalculatorInputs, string> = {
  designPressureBar: "designPressureBar",
  diameterMm: "diameterMm",
  allowableStressMpa: "allowableStressMpa",
  weldEfficiency: "weldEfficiency",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PressureVesselWallThicknessCalculatorInputs): string[] {
  const errors: string[] = [];
  for (const key of PRESSURE_VESSEL_WALL_THICKNESS_CALCULATOR_INPUT_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
  }
  return errors;
}

function collectWarnings(inputs: PressureVesselWallThicknessCalculatorInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validatePressureVesselWallThicknessCalculatorInputs(inputs: PressureVesselWallThicknessCalculatorInputs): PressureVesselWallThicknessCalculatorValidationResult {
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
>>>>>>> Stashed changes
