export type BreakEvenCalculatorInputs = {
  sellingPricePerUnit: number;
  variableCostPerUnit: number;
  fixedCosts: number;
  actualSales: number;
};

export type BreakEvenCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const BREAK_EVEN_CALCULATOR_INPUT_KEYS: readonly (keyof BreakEvenCalculatorInputs)[] = [
  "sellingPricePerUnit",
  "variableCostPerUnit",
  "fixedCosts",
  "actualSales",
];

const INPUT_LABELS: Record<keyof BreakEvenCalculatorInputs, string> = {
  sellingPricePerUnit: "sellingPricePerUnit",
  variableCostPerUnit: "variableCostPerUnit",
  fixedCosts: "fixedCosts",
  actualSales: "actualSales",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: BreakEvenCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of BREAK_EVEN_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.sellingPricePerUnit < 0.01 || inputs.sellingPricePerUnit > 1000000) {
    errors.push("sellingPricePerUnit must be between 0.01 and 1000000.");
  }

  if (inputs.sellingPricePerUnit <= 0) {
    errors.push("sellingPricePerUnit must be greater than zero.");
  }

  if (inputs.variableCostPerUnit < 0 || inputs.variableCostPerUnit > 1000000) {
    errors.push("variableCostPerUnit must be between 0 and 1000000.");
  }

  if (inputs.fixedCosts < 0 || inputs.fixedCosts > 100000000) {
    errors.push("fixedCosts must be between 0 and 100000000.");
  }

  if (inputs.actualSales < 0 || inputs.actualSales > 100000000) {
    errors.push("actualSales must be between 0 and 100000000.");
  }

  return errors;
}

function collectWarnings(inputs: BreakEvenCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateBreakEvenCalculatorInputs(inputs: BreakEvenCalculatorInputs): BreakEvenCalculatorValidationResult {
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
