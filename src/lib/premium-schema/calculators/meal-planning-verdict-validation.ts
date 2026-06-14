export type MealPlanningVerdictInputs = {
  monthlyIngredientCost: number;
  wasteRate: number;
  targetWasteRate: number;
  monthlyRevenue: number;
  grossMargin: number;
};

export type MealPlanningVerdictValidationResult =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const MEAL_PLANNING_VERDICT_INPUT_KEYS: readonly (keyof MealPlanningVerdictInputs)[] = [
  "monthlyIngredientCost",
  "wasteRate",
  "targetWasteRate",
  "monthlyRevenue",
  "grossMargin",
];

const INPUT_LABELS: Record<keyof MealPlanningVerdictInputs, string> = {
  monthlyIngredientCost: "monthlyIngredientCost",
  wasteRate: "wasteRate",
  targetWasteRate: "targetWasteRate",
  monthlyRevenue: "monthlyRevenue",
  grossMargin: "grossMargin",
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function collectInputErrors(inputs: MealPlanningVerdictInputs): string[] {
  const errors: string[] = [];

  for (const key of MEAL_PLANNING_VERDICT_INPUT_KEYS) {
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

  if (inputs.monthlyRevenue < 0) {
    errors.push("monthlyRevenue must be greater than or equal to zero.");
  }

  if (inputs.monthlyRevenue <= 0) {
    errors.push("monthlyRevenue must be greater than zero.");
  }

  if (inputs.grossMargin < 0 || inputs.grossMargin > 100) {
    errors.push("grossMargin must be between 0 and 100.");
  }

  return errors;
}

function collectWarnings(inputs: MealPlanningVerdictInputs): string[] {
  const warnings: string[] = [];



  return warnings;
}

export function validateMealPlanningVerdictInputs(inputs: MealPlanningVerdictInputs): MealPlanningVerdictValidationResult {
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
