<<<<<<< Updated upstream
// Implementation removed for rewrite
export const HEAT_LOSS_CALCULATOR_INPUT_KEYS = (inputs: any) => {
  return {
    outputs: {},
    rules: [],
    charts: []
  };
};
=======
export type HeatLossCalculatorInputs = {
  surfaceArea: number;
  uValue: number;
  insideTemp: number;
  outsideTemp: number;
  heatingHours: number;
  energyCostPerKwh: number;
};

export type HeatLossCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const HEAT_LOSS_CALCULATOR_INPUT_KEYS: readonly (keyof HeatLossCalculatorInputs)[] = [
  "surfaceArea",
  "uValue",
  "insideTemp",
  "outsideTemp",
  "heatingHours",
  "energyCostPerKwh",
];

const INPUT_LABELS: Record<keyof HeatLossCalculatorInputs, string> = {
  surfaceArea: "surfaceArea",
  uValue: "uValue",
  insideTemp: "insideTemp",
  outsideTemp: "outsideTemp",
  heatingHours: "heatingHours",
  energyCostPerKwh: "energyCostPerKwh",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: HeatLossCalculatorInputs): string[] {
  const errors: string[] = [];
  for (const key of HEAT_LOSS_CALCULATOR_INPUT_KEYS) {
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

function collectWarnings(inputs: HeatLossCalculatorInputs): string[] {
  const warnings: string[] = [];
  return warnings;
}

export function validateHeatLossCalculatorInputs(inputs: HeatLossCalculatorInputs): HeatLossCalculatorValidationResult {
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
