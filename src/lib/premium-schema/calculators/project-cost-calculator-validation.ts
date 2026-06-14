export type ProjectCostCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  directLaborCost: number;
  overheadPercent: number;
  targetGrossMarginPercent: number;
};

export type ProjectCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PROJECT_COST_CALCULATOR_INPUT_KEYS: readonly (keyof ProjectCostCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "directLaborCost",
  "overheadPercent",
  "targetGrossMarginPercent",
];

const INPUT_LABELS: Record<keyof ProjectCostCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  directLaborCost: "directLaborCost",
  overheadPercent: "overheadPercent",
  targetGrossMarginPercent: "targetGrossMarginPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ProjectCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of PROJECT_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.directLaborCost < 0 || inputs.directLaborCost > 100000) {
    errors.push("directLaborCost must be between 0 and 100000.");
  }

  if (inputs.overheadPercent < 0 || inputs.overheadPercent > 100) {
    errors.push("overheadPercent must be between 0 and 100.");
  }

  if (inputs.targetGrossMarginPercent < 0 || inputs.targetGrossMarginPercent > 100) {
    errors.push("targetGrossMarginPercent must be between 0 and 100.");
  }

  if (inputs.targetGrossMarginPercent <= 0) {
    errors.push("targetGrossMarginPercent must be greater than zero.");
  }

  return errors;
}

function collectWarnings(inputs: ProjectCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateProjectCostCalculatorInputs(inputs: ProjectCostCalculatorInputs): ProjectCostCalculatorValidationResult {
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
