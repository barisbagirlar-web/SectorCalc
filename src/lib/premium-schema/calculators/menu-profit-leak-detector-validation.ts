export type MenuProfitLeakDetectorInputs = {
  monthlyRevenue: number;
  ingredientCost: number;
  deliveryAppFeePercent: number;
  wasteRate: number;
  targetFoodCostPercent: number;
};

export type MenuProfitLeakDetectorValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MENU_PROFIT_LEAK_DETECTOR_INPUT_KEYS: readonly (keyof MenuProfitLeakDetectorInputs)[] = [
  "monthlyRevenue",
  "ingredientCost",
  "deliveryAppFeePercent",
  "wasteRate",
  "targetFoodCostPercent",
];

const INPUT_LABELS: Record<keyof MenuProfitLeakDetectorInputs, string> = {
  monthlyRevenue: "monthlyRevenue",
  ingredientCost: "ingredientCost",
  deliveryAppFeePercent: "deliveryAppFeePercent",
  wasteRate: "wasteRate",
  targetFoodCostPercent: "targetFoodCostPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MenuProfitLeakDetectorInputs): string[] {
  const errors: string[] = [];

  for (const key of MENU_PROFIT_LEAK_DETECTOR_INPUT_KEYS) {
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

  if (inputs.monthlyRevenue < 0) {
    errors.push("monthlyRevenue must be greater than or equal to zero.");
  }

  if (inputs.monthlyRevenue <= 0) {
    errors.push("monthlyRevenue must be greater than zero.");
  }

  if (inputs.ingredientCost < 0) {
    errors.push("ingredientCost must be greater than or equal to zero.");
  }

  if (inputs.deliveryAppFeePercent < 0 || inputs.deliveryAppFeePercent > 100) {
    errors.push("deliveryAppFeePercent must be between 0 and 100.");
  }

  if (inputs.wasteRate < 0 || inputs.wasteRate > 100) {
    errors.push("wasteRate must be between 0 and 100.");
  }

  if (inputs.targetFoodCostPercent < 0 || inputs.targetFoodCostPercent > 100) {
    errors.push("targetFoodCostPercent must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: MenuProfitLeakDetectorInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMenuProfitLeakDetectorInputs(inputs: MenuProfitLeakDetectorInputs): MenuProfitLeakDetectorValidationResult {
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
