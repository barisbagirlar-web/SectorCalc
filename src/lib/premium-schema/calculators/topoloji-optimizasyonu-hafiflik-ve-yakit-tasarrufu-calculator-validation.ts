export type TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs = {
  originalWeight: number;
  optimizedWeight: number;
  annualDistanceKm: number;
  fuelPricePerLiter: number;
  additionalCost: number;
  lifetimeYears: number;
};

export type TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const TOPOLOJI_OPTIMIZASYONU_HAFIFLIK_VE_YAKIT_TASARRUFU_CALCULATOR_INPUT_KEYS: readonly (keyof TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs)[] = [
  "originalWeight",
  "optimizedWeight",
  "annualDistanceKm",
  "fuelPricePerLiter",
  "additionalCost",
  "lifetimeYears",
];

const INPUT_LABELS: Record<keyof TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs, string> = {
  originalWeight: "originalWeight",
  optimizedWeight: "optimizedWeight",
  annualDistanceKm: "annualDistanceKm",
  fuelPricePerLiter: "fuelPricePerLiter",
  additionalCost: "additionalCost",
  lifetimeYears: "lifetimeYears",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of TOPOLOJI_OPTIMIZASYONU_HAFIFLIK_VE_YAKIT_TASARRUFU_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.originalWeight < 0.1 || inputs.originalWeight > 10000) {
    errors.push("originalWeight must be between 0.1 and 10000.");
  }

  if (inputs.originalWeight <= 0) {
    errors.push("originalWeight must be greater than zero.");
  }

  if (inputs.optimizedWeight < 0 || inputs.optimizedWeight > 10000) {
    errors.push("optimizedWeight must be between 0 and 10000.");
  }

  if (inputs.annualDistanceKm < 1 || inputs.annualDistanceKm > 500000) {
    errors.push("annualDistanceKm must be between 1 and 500000.");
  }

  if (inputs.annualDistanceKm <= 0) {
    errors.push("annualDistanceKm must be greater than zero.");
  }

  if (inputs.fuelPricePerLiter < 0.01 || inputs.fuelPricePerLiter > 10) {
    errors.push("fuelPricePerLiter must be between 0.01 and 10.");
  }

  if (inputs.fuelPricePerLiter <= 0) {
    errors.push("fuelPricePerLiter must be greater than zero.");
  }

  if (inputs.additionalCost < 0 || inputs.additionalCost > 1000000) {
    errors.push("additionalCost must be between 0 and 1000000.");
  }

  if (inputs.lifetimeYears < 1 || inputs.lifetimeYears > 50) {
    errors.push("lifetimeYears must be between 1 and 50.");
  }

  if (inputs.lifetimeYears <= 0) {
    errors.push("lifetimeYears must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs(inputs: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs): TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorValidationResult {
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
