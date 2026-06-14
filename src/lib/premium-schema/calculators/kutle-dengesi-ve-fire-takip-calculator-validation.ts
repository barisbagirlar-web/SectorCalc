export type KutleDengesiVeFireTakipCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  reworkLaborCost: number;
  inventoryHoldingCost: number;
  periodRevenue: number;
};

export type KutleDengesiVeFireTakipCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const KUTLE_DENGESI_VE_FIRE_TAKIP_CALCULATOR_INPUT_KEYS: readonly (keyof KutleDengesiVeFireTakipCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "reworkLaborCost",
  "inventoryHoldingCost",
  "periodRevenue",
];

const INPUT_LABELS: Record<keyof KutleDengesiVeFireTakipCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  reworkLaborCost: "reworkLaborCost",
  inventoryHoldingCost: "inventoryHoldingCost",
  periodRevenue: "periodRevenue",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: KutleDengesiVeFireTakipCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of KUTLE_DENGESI_VE_FIRE_TAKIP_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.reworkLaborCost < 0 || inputs.reworkLaborCost > 100000) {
    errors.push("reworkLaborCost must be between 0 and 100000.");
  }

  if (inputs.inventoryHoldingCost < 0 || inputs.inventoryHoldingCost > 100000) {
    errors.push("inventoryHoldingCost must be between 0 and 100000.");
  }

  if (inputs.periodRevenue < 0 || inputs.periodRevenue > 100000000) {
    errors.push("periodRevenue must be between 0 and 100000000.");
  }

  if (inputs.periodRevenue <= 0) {
    errors.push("periodRevenue must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: KutleDengesiVeFireTakipCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateKutleDengesiVeFireTakipCalculatorInputs(inputs: KutleDengesiVeFireTakipCalculatorInputs): KutleDengesiVeFireTakipCalculatorValidationResult {
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
