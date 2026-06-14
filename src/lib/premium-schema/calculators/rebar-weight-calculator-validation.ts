export type RebarWeightCalculatorInputs = {
  nominalDiameter: number;
  totalLength: number;
  unitPricePerKg: number;
};

export type RebarWeightCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const REBAR_WEIGHT_CALCULATOR_INPUT_KEYS: readonly (keyof RebarWeightCalculatorInputs)[] = [
  "nominalDiameter",
  "totalLength",
  "unitPricePerKg",
];

const INPUT_LABELS: Record<keyof RebarWeightCalculatorInputs, string> = {
  nominalDiameter: "nominalDiameter",
  totalLength: "totalLength",
  unitPricePerKg: "unitPricePerKg",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RebarWeightCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of REBAR_WEIGHT_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.nominalDiameter < 6 || inputs.nominalDiameter > 50) {
    errors.push("nominalDiameter must be between 6 and 50.");
  }

  if (inputs.nominalDiameter <= 0) {
    errors.push("nominalDiameter must be greater than zero.");
  }

  if (inputs.totalLength < 0.1 || inputs.totalLength > 100000) {
    errors.push("totalLength must be between 0.1 and 100000.");
  }

  if (inputs.totalLength <= 0) {
    errors.push("totalLength must be greater than zero.");
  }

  if (inputs.unitPricePerKg < 0 || inputs.unitPricePerKg > 100) {
    errors.push("unitPricePerKg must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: RebarWeightCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRebarWeightCalculatorInputs(inputs: RebarWeightCalculatorInputs): RebarWeightCalculatorValidationResult {
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
