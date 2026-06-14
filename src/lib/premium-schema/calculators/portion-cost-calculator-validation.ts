export type PortionCostCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
  directLaborCostPerUnit: number;
  overheadPercent: number;
  targetGrossMarginPercent: number;
};

export type PortionCostCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PORTION_COST_CALCULATOR_INPUT_KEYS: readonly (keyof PortionCostCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
  "directLaborCostPerUnit",
  "overheadPercent",
  "targetGrossMarginPercent",
];

const INPUT_LABELS: Record<keyof PortionCostCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
  directLaborCostPerUnit: "directLaborCostPerUnit",
  overheadPercent: "overheadPercent",
  targetGrossMarginPercent: "targetGrossMarginPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: PortionCostCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of PORTION_COST_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.directLaborCostPerUnit < 0 || inputs.directLaborCostPerUnit > 100000) {
    errors.push("directLaborCostPerUnit must be between 0 and 100000.");
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

function collectWarnings(inputs: PortionCostCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validatePortionCostCalculatorInputs(inputs: PortionCostCalculatorInputs): PortionCostCalculatorValidationResult {
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
