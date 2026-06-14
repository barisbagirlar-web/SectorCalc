export type RecipeCostCheckInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  laborCostPerUnit: number;
  overheadCostPerUnit: number;
  sellingPricePerUnit: number;
};

export type RecipeCostCheckValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RECIPE_COST_CHECK_INPUT_KEYS: readonly (keyof RecipeCostCheckInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "laborCostPerUnit",
  "overheadCostPerUnit",
  "sellingPricePerUnit",
];

const INPUT_LABELS: Record<keyof RecipeCostCheckInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  laborCostPerUnit: "laborCostPerUnit",
  overheadCostPerUnit: "overheadCostPerUnit",
  sellingPricePerUnit: "sellingPricePerUnit",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RecipeCostCheckInputs): string[] {
  const errors: string[] = [];

  for (const key of RECIPE_COST_CHECK_INPUT_KEYS) {
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

  if (inputs.laborCostPerUnit < 0 || inputs.laborCostPerUnit > 1000) {
    errors.push("laborCostPerUnit must be between 0 and 1000.");
  }

  if (inputs.overheadCostPerUnit < 0 || inputs.overheadCostPerUnit > 1000) {
    errors.push("overheadCostPerUnit must be between 0 and 1000.");
  }

  if (inputs.sellingPricePerUnit < 0 || inputs.sellingPricePerUnit > 100000) {
    errors.push("sellingPricePerUnit must be between 0 and 100000.");
  }

  return errors;
}

function collectWarnings(inputs: RecipeCostCheckInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateRecipeCostCheckInputs(inputs: RecipeCostCheckInputs): RecipeCostCheckValidationResult {
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
