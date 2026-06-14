export type RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs = {
  ingredientCostPerPortion: number;
  yieldLossRate: number;
  laborCostPerHour: number;
  portionsPerHour: number;
  overheadRate: number;
  sellingPrice: number;
};

export type RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RESTORAN_TABAK_MALIYETI_VE_PORSIYON_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs)[] = [
  "ingredientCostPerPortion",
  "yieldLossRate",
  "laborCostPerHour",
  "portionsPerHour",
  "overheadRate",
  "sellingPrice",
];

const INPUT_LABELS: Record<keyof RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs, string> = {
  ingredientCostPerPortion: "ingredientCostPerPortion",
  yieldLossRate: "yieldLossRate",
  laborCostPerHour: "laborCostPerHour",
  portionsPerHour: "portionsPerHour",
  overheadRate: "overheadRate",
  sellingPrice: "sellingPrice",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of RESTORAN_TABAK_MALIYETI_VE_PORSIYON_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.ingredientCostPerPortion < 0 || inputs.ingredientCostPerPortion > 1000) {
    errors.push("ingredientCostPerPortion must be between 0 and 1000.");
  }

  if (inputs.yieldLossRate < 0 || inputs.yieldLossRate > 100) {
    errors.push("yieldLossRate must be between 0 and 100.");
  }

  if (inputs.laborCostPerHour < 0 || inputs.laborCostPerHour > 500) {
    errors.push("laborCostPerHour must be between 0 and 500.");
  }

  if (inputs.portionsPerHour < 1 || inputs.portionsPerHour > 1000) {
    errors.push("portionsPerHour must be between 1 and 1000.");
  }

  if (inputs.portionsPerHour <= 0) {
    errors.push("portionsPerHour must be greater than zero.");
  }

  if (inputs.overheadRate < 0 || inputs.overheadRate > 100) {
    errors.push("overheadRate must be between 0 and 100.");
  }

  if (inputs.sellingPrice < 0.01 || inputs.sellingPrice > 10000) {
    errors.push("sellingPrice must be between 0.01 and 10000.");
  }

  if (inputs.sellingPrice <= 0) {
    errors.push("sellingPrice must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs(inputs: RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorInputs): RestoranTabakMaliyetiVePorsiyonOptimizasyonCalculatorValidationResult {
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
