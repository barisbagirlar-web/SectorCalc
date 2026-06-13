export type ProductCustomerProfitabilityCalculatorInputs = {
  revenue: number;
  directCost: number;
  serviceCost: number;
  returnsCost: number;
};

export type ProductCustomerProfitabilityCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_INPUT_KEYS: readonly (keyof ProductCustomerProfitabilityCalculatorInputs)[] = [
  "revenue",
  "directCost",
  "serviceCost",
  "returnsCost",
];

const INPUT_LABELS: Record<keyof ProductCustomerProfitabilityCalculatorInputs, string> = {
  revenue: "revenue",
  directCost: "directCost",
  serviceCost: "serviceCost",
  returnsCost: "returnsCost",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ProductCustomerProfitabilityCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.revenue < 0) {
    errors.push("revenue must be greater than or equal to zero.");
  }

  if (inputs.revenue <= 0) {
    errors.push("revenue must be greater than zero.");
  }

  if (inputs.directCost < 0) {
    errors.push("directCost must be greater than or equal to zero.");
  }

  if (inputs.serviceCost < 0) {
    errors.push("serviceCost must be greater than or equal to zero.");
  }

  if (inputs.returnsCost < 0) {
    errors.push("returnsCost must be greater than or equal to zero.");
  }

  return errors;
}

function collectWarnings(inputs: ProductCustomerProfitabilityCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateProductCustomerProfitabilityCalculatorInputs(inputs: ProductCustomerProfitabilityCalculatorInputs): ProductCustomerProfitabilityCalculatorValidationResult {
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
