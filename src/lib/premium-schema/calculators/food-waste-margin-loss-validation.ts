export type FoodWasteMarginLossInputs = {
  monthlyIngredientCost: number;
  wasteRate: number;
  targetWasteRate: number;
  monthlyRevenue: number;
  grossMargin: number;
};

export type FoodWasteMarginLossValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const FOOD_WASTE_MARGIN_LOSS_INPUT_KEYS: readonly (keyof FoodWasteMarginLossInputs)[] = [
  "monthlyIngredientCost",
  "wasteRate",
  "targetWasteRate",
  "monthlyRevenue",
  "grossMargin",
];

const INPUT_LABELS: Record<keyof FoodWasteMarginLossInputs, string> = {
  monthlyIngredientCost: "monthlyIngredientCost",
  wasteRate: "wasteRate",
  targetWasteRate: "targetWasteRate",
  monthlyRevenue: "monthlyRevenue",
  grossMargin: "grossMargin",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: FoodWasteMarginLossInputs): string[] {
  const errors: string[] = [];

  for (const key of FOOD_WASTE_MARGIN_LOSS_INPUT_KEYS) {
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

  if (inputs.monthlyIngredientCost < 0) {
    errors.push("monthlyIngredientCost must be greater than or equal to zero.");
  }
  if (inputs.wasteRate < 0 || inputs.wasteRate > 100) {
    errors.push("wasteRate must be between 0 and 100.");
  }
  if (inputs.targetWasteRate < 0 || inputs.targetWasteRate > 100) {
    errors.push("targetWasteRate must be between 0 and 100.");
  }
  if (inputs.monthlyRevenue <= 0) {
    errors.push("monthlyRevenue must be greater than zero.");
  }
  if (inputs.grossMargin < 0 || inputs.grossMargin > 100) {
    errors.push("grossMargin must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: FoodWasteMarginLossInputs): string[] {
  const warnings: string[] = [];
  const excessWasteCost =
    inputs.monthlyIngredientCost *
    (Math.max(inputs.wasteRate - inputs.targetWasteRate, 0) / 100);
  const marginPressure = (excessWasteCost / inputs.monthlyRevenue) * 100;

  if (inputs.wasteRate >= 5) {
    warnings.push(
      "Waste rate is above target — portion drift or spoilage may be eroding margin.",
    );
  }

  if (marginPressure >= 1) {
    warnings.push(
      "Excess waste is pressuring revenue margin — track waste drivers next cycle.",
    );
  }

  if (inputs.grossMargin < 50 && inputs.wasteRate > inputs.targetWasteRate) {
    warnings.push(
      "Gross margin is below fifty percent while waste exceeds target — review menu pricing and prep yield.",
    );
  }

  return warnings;
}

export function validateFoodWasteMarginLossInputs(
  inputs: FoodWasteMarginLossInputs,
): FoodWasteMarginLossValidationResult {
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
