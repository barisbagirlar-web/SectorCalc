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
  discountRate?: number;
  taxIncluded?: boolean;
  safetyMarginUplift?: number;
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
  const requiredKeys: readonly (keyof ProfitMarginCalculatorInputs)[] = [
    "materialCost", "laborCost", "machineCost", "energyCost", "overheadCost",
    "wasteRate", "setupTimeCost", "shippingCost", "paymentTermCost", "targetMarginRate"
  ];
  
  for (const key of requiredKeys) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${INPUT_LABELS[key]} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${INPUT_LABELS[key]} must be a finite number.`);
    }
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
