export type BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  laborHours: number;
  laborHourlyRate: number;
  equipmentCost: number;
};

export type BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BOYA_VE_APRE_RECETESI_MALIYET_OPTIMIZASYON_CALCULATOR_INPUT_KEYS: readonly (keyof BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "laborHours",
  "laborHourlyRate",
  "equipmentCost",
];

const INPUT_LABELS: Record<keyof BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  laborHours: "laborHours",
  laborHourlyRate: "laborHourlyRate",
  equipmentCost: "equipmentCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BOYA_VE_APRE_RECETESI_MALIYET_OPTIMIZASYON_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.productionQuantity < 1 || inputs.productionQuantity > 1000000) {
    errors.push("productionQuantity must be between 1 and 1000000.");
  }

  if (inputs.productionQuantity <= 0) {
    errors.push("productionQuantity must be greater than zero.");
  }

  if (inputs.unitMaterialCost < 0 || inputs.unitMaterialCost > 100000) {
    errors.push("unitMaterialCost must be between 0 and 100000.");
  }

  if (inputs.scrapRatePercent < 0 || inputs.scrapRatePercent > 100) {
    errors.push("scrapRatePercent must be between 0 and 100.");
  }

  if (inputs.laborHours < 0 || inputs.laborHours > 10000) {
    errors.push("laborHours must be between 0 and 10000.");
  }

  if (inputs.laborHourlyRate < 0 || inputs.laborHourlyRate > 500) {
    errors.push("laborHourlyRate must be between 0 and 500.");
  }

  if (inputs.equipmentCost < 0 || inputs.equipmentCost > 100000) {
    errors.push("equipmentCost must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs(inputs: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputs): BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorValidationResult {
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
