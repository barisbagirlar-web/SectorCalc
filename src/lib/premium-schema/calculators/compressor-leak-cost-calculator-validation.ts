export type CompressorLeakCostCalculatorInputs = {
  compressorKw: number;
  leakPercent: number;
  operatingHours: number;
  energyRate: number;
};

export type CompressorLeakCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const COMPRESSOR_LEAK_COST_CALCULATOR_INPUT_KEYS: readonly (keyof CompressorLeakCostCalculatorInputs)[] = [
  "compressorKw",
  "leakPercent",
  "operatingHours",
  "energyRate",
];

const INPUT_LABELS: Record<keyof CompressorLeakCostCalculatorInputs, string> = {
  compressorKw: "compressorKw",
  leakPercent: "leakPercent",
  operatingHours: "operatingHours",
  energyRate: "energyRate",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: CompressorLeakCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of COMPRESSOR_LEAK_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.compressorKw < 0) {
    errors.push("compressorKw must be greater than or equal to zero.");
  }

  if (inputs.leakPercent < 0 || inputs.leakPercent > 100) {
    errors.push("leakPercent must be between 0 and 100.");
  }

  if (inputs.operatingHours < 0) {
    errors.push("operatingHours must be greater than or equal to zero.");
  }

  if (inputs.energyRate < 0 || inputs.energyRate > 100) {
    errors.push("energyRate must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: CompressorLeakCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateCompressorLeakCostCalculatorInputs(inputs: CompressorLeakCostCalculatorInputs): CompressorLeakCostCalculatorValidationResult {
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
