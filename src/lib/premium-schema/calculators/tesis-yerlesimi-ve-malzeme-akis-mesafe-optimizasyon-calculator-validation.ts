export type TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs = {
  departmentCount: number;
  flowMatrix: number;
  distanceMatrix: number;
  unitHandlingCost: number;
  optimalDistanceMatrix: number;
};

export type TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TESIS_YERLESIMI_VE_MALZEME_AKIS_MESAFE_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs)[] = [
  "departmentCount",
  "flowMatrix",
  "distanceMatrix",
  "unitHandlingCost",
  "optimalDistanceMatrix",
];

const INPUT_LABELS: Record<keyof TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs, string> = {
  departmentCount: "departmentCount",
  flowMatrix: "flowMatrix",
  distanceMatrix: "distanceMatrix",
  unitHandlingCost: "unitHandlingCost",
  optimalDistanceMatrix: "optimalDistanceMatrix",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TESIS_YERLESIMI_VE_MALZEME_AKIS_MESAFE_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.departmentCount < 2 || inputs.departmentCount > 100) {
    errors.push("departmentCount must be between 2 and 100.");
  }

  if (inputs.departmentCount <= 0) {
    errors.push("departmentCount must be greater than zero.");
  }

  if (inputs.flowMatrix < 0 || inputs.flowMatrix > 1000000) {
    errors.push("flowMatrix must be between 0 and 1000000.");
  }

  if (inputs.distanceMatrix < 0 || inputs.distanceMatrix > 10000) {
    errors.push("distanceMatrix must be between 0 and 10000.");
  }

  if (inputs.unitHandlingCost < 0.0001 || inputs.unitHandlingCost > 1000) {
    errors.push("unitHandlingCost must be between 0.0001 and 1000.");
  }

  if (inputs.unitHandlingCost <= 0) {
    errors.push("unitHandlingCost must be greater than zero.");
  }

  if (inputs.optimalDistanceMatrix < 0 || inputs.optimalDistanceMatrix > 10000) {
    errors.push("optimalDistanceMatrix must be between 0 and 10000.");
  }

  return errors;
}

function collectWarnings(inputs: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs(inputs: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputs): TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorValidationResult {
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
