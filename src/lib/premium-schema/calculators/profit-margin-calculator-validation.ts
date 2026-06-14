export type ProfitMarginCalculatorInputs = {
  materialCost: number;
  laborCost: number;
  machineCost: number;
  energyCost: number;
  overheadCost: number;
  wasteRate: number;
  setupTimeCost: number;
  shippingCost: number;
  paymentTermCost: number;
  targetMarginRate: number;
  discountRate: number;
  taxIncluded: number;
  safetyMarginUplift: number;
};

export type ProfitMarginCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const PROFIT_MARGIN_CALCULATOR_INPUT_KEYS: readonly (keyof ProfitMarginCalculatorInputs)[] = [
  "materialCost",
  "laborCost",
  "machineCost",
  "energyCost",
  "overheadCost",
  "wasteRate",
  "setupTimeCost",
  "shippingCost",
  "paymentTermCost",
  "targetMarginRate",
  "discountRate",
  "taxIncluded",
  "safetyMarginUplift",
];

const INPUT_LABELS: Record<keyof ProfitMarginCalculatorInputs, string> = {
  materialCost: "materialCost",
  laborCost: "laborCost",
  machineCost: "machineCost",
  energyCost: "energyCost",
  overheadCost: "overheadCost",
  wasteRate: "wasteRate",
  setupTimeCost: "setupTimeCost",
  shippingCost: "shippingCost",
  paymentTermCost: "paymentTermCost",
  targetMarginRate: "targetMarginRate",
  discountRate: "discountRate",
  taxIncluded: "taxIncluded",
  safetyMarginUplift: "safetyMarginUplift",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: ProfitMarginCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of PROFIT_MARGIN_CALCULATOR_INPUT_KEYS) {
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

  if (inputs.materialCost < 0) {
    errors.push("materialCost must be greater than or equal to zero.");
  }

  if (inputs.laborCost < 0) {
    errors.push("laborCost must be greater than or equal to zero.");
  }

  if (inputs.machineCost < 0) {
    errors.push("machineCost must be greater than or equal to zero.");
  }

  if (inputs.energyCost < 0) {
    errors.push("energyCost must be greater than or equal to zero.");
  }

  if (inputs.overheadCost < 0) {
    errors.push("overheadCost must be greater than or equal to zero.");
  }

  if (inputs.wasteRate < 0 || inputs.wasteRate > 100) {
    errors.push("wasteRate must be between 0 and 100.");
  }

  if (inputs.setupTimeCost < 0) {
    errors.push("setupTimeCost must be greater than or equal to zero.");
  }

  if (inputs.shippingCost < 0) {
    errors.push("shippingCost must be greater than or equal to zero.");
  }

  if (inputs.paymentTermCost < 0) {
    errors.push("paymentTermCost must be greater than or equal to zero.");
  }

  if (inputs.targetMarginRate < 0 || inputs.targetMarginRate > 100) {
    errors.push("targetMarginRate must be between 0 and 100.");
  }

  if (inputs.targetMarginRate <= 0) {
    errors.push("targetMarginRate must be greater than zero.");
  }

  if (inputs.discountRate < 0 || inputs.discountRate > 100) {
    errors.push("discountRate must be between 0 and 100.");
  }

  if (inputs.safetyMarginUplift < 0 || inputs.safetyMarginUplift > 100) {
    errors.push("safetyMarginUplift must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: ProfitMarginCalculatorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateProfitMarginCalculatorInputs(inputs: ProfitMarginCalculatorInputs): ProfitMarginCalculatorValidationResult {
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
