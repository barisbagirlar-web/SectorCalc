export type RestaurantMenuMarginLeakInputs = {
  monthlyRevenue: number;
  ingredientCost: number;
  deliveryAppFeePercent: number;
  wasteRate: number;
  targetFoodCostPercent: number;
};

export type RestaurantMenuMarginLeakValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const RESTAURANT_MENU_MARGIN_LEAK_INPUT_KEYS: readonly (keyof RestaurantMenuMarginLeakInputs)[] =
  [
    "monthlyRevenue",
    "ingredientCost",
    "deliveryAppFeePercent",
    "wasteRate",
    "targetFoodCostPercent",
  ];

const INPUT_LABELS: Record<keyof RestaurantMenuMarginLeakInputs, string> = {
  monthlyRevenue: "monthlyRevenue",
  ingredientCost: "ingredientCost",
  deliveryAppFeePercent: "deliveryAppFeePercent",
  wasteRate: "wasteRate",
  targetFoodCostPercent: "targetFoodCostPercent",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: RestaurantMenuMarginLeakInputs): string[] {
  const errors: string[] = [];

  for (const key of RESTAURANT_MENU_MARGIN_LEAK_INPUT_KEYS) {
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

function collectWarnings(inputs: RestaurantMenuMarginLeakInputs): string[] {
  const warnings: string[] = [];
  const foodCostPercent = (inputs.ingredientCost / inputs.monthlyRevenue) * 100;
  const deliveryFeeCost = inputs.monthlyRevenue * (inputs.deliveryAppFeePercent / 100);
  const wasteExposure = inputs.ingredientCost * (inputs.wasteRate / 100);
  const totalMarginPressure =
    ((inputs.ingredientCost + deliveryFeeCost + wasteExposure) / inputs.monthlyRevenue) * 100;

  if (foodCostPercent >= 35) {
    warnings.push(
      "Food cost percent is above target — review menu mix and portion control.",
    );
  }

  if (inputs.wasteRate >= 5) {
    warnings.push("Waste rate is elevated — track prep and spoilage by shift.");
  }

  if (totalMarginPressure >= 45) {
    warnings.push(
      "Combined cost pressure is building — ingredient, fee and waste stack needs review.",
    );
  }

  return warnings;
}

export function validateRestaurantMenuMarginLeakInputs(
  inputs: RestaurantMenuMarginLeakInputs,
): RestaurantMenuMarginLeakValidationResult {
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
