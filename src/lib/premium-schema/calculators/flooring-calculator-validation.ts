export type FlooringCalculatorInputs = {
  productionQuantity: number;
  unitMaterialCost: number;
  scrapRatePercent: number;
};

export type FlooringCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FLOORING_CALCULATOR_INPUT_KEYS: readonly (keyof FlooringCalculatorInputs)[] = [
  "productionQuantity",
  "unitMaterialCost",
  "scrapRatePercent",
];

const INPUT_LABELS: Record<keyof FlooringCalculatorInputs, string> = {
  productionQuantity: "productionQuantity",
  unitMaterialCost: "unitMaterialCost",
  scrapRatePercent: "scrapRatePercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FlooringCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of FLOORING_CALCULATOR_INPUT_KEYS) {
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

  return errors;
}

function collectWarnings(inputs: FlooringCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateFlooringCalculatorInputs(inputs: FlooringCalculatorInputs): FlooringCalculatorValidationResult {
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
