export type QuotePriceProfitMarginCalculatorInputs = {
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

export type QuotePriceProfitMarginCalculatorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const QUOTE_PRICE_PROFIT_MARGIN_CALCULATOR_INPUT_KEYS: readonly (keyof QuotePriceProfitMarginCalculatorInputs)[] = [
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
];

const REQUIRED_NUMERIC_KEYS = QUOTE_PRICE_PROFIT_MARGIN_CALCULATOR_INPUT_KEYS;

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: QuotePriceProfitMarginCalculatorInputs): string[] {
  const errors: string[] = [];

  for (const key of REQUIRED_NUMERIC_KEYS) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(`${String(key)} is required.`);
      continue;
    }
    if (!isValidNumber(value)) {
      errors.push(`${String(key)} must be a finite number.`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  for (const key of REQUIRED_NUMERIC_KEYS) {
    const value = inputs[key];
    if (typeof value === "number" && value < 0) {
      errors.push(`${String(key)} must be greater than or equal to zero.`);
    }
  }

  if (inputs.targetMarginRate <= 0 || inputs.targetMarginRate > 95) {
    errors.push("targetMarginRate must be between 1 and 95.");
  }

  if (inputs.wasteRate < 0 || inputs.wasteRate > 100) {
    errors.push("wasteRate must be between 0 and 100.");
  }

  if (inputs.discountRate !== undefined) {
    if (!isValidNumber(inputs.discountRate) || inputs.discountRate < 0 || inputs.discountRate > 100) {
      errors.push("discountRate must be between 0 and 100.");
    }
  }

  if (inputs.safetyMarginUplift !== undefined) {
    if (
      !isValidNumber(inputs.safetyMarginUplift) ||
      inputs.safetyMarginUplift < 0 ||
      inputs.safetyMarginUplift > 20
    ) {
      errors.push("safetyMarginUplift must be between 0 and 20.");
    }
  }

  return errors;
}

export function validateQuotePriceProfitMarginCalculatorInputs(
  inputs: QuotePriceProfitMarginCalculatorInputs,
): QuotePriceProfitMarginCalculatorValidationResult {
  const errors = collectInputErrors(inputs);
  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  const warnings: string[] = [];
  if ((inputs.discountRate ?? 0) > 5) {
    warnings.push("Discount rate above 5% — verify margin floor before quoting.");
  }

  return { ok: true, errors: [], warnings };
}
