import type { ResultTone, ToolResult } from "@/data/tool-schema";

export interface FoodCostCalculatorInput {
  ingredientCost: number;
  portions: number;
  sellingPrice: number;
  wasteRate: number;
  extraCostPerPortion: number;
}

export type FoodCostCalculatorField = keyof FoodCostCalculatorInput;

export type FoodCostCalculatorErrors = Partial<
  Record<FoodCostCalculatorField, string>
>;

/** Food cost %: <= 32% success, <= 40% warning, above danger */
function foodCostPctTone(foodCostPercentage: number): ResultTone {
  if (foodCostPercentage <= 32) return "success";
  if (foodCostPercentage <= 40) return "warning";
  return "danger";
}

export function validateFoodCostCalculator(
  input: FoodCostCalculatorInput
): FoodCostCalculatorErrors {
  const errors: FoodCostCalculatorErrors = {};

  const nonNegative: FoodCostCalculatorField[] = [
    "ingredientCost",
    "sellingPrice",
    "extraCostPerPortion",
  ];

  for (const field of nonNegative) {
    const value = input[field];
    if (Number.isNaN(value) || value < 0) {
      errors[field] = "Enter a valid amount of zero or greater.";
    }
  }

  if (Number.isNaN(input.portions) || input.portions < 1) {
    errors.portions = "Portions must be at least 1.";
  }

  if (
    Number.isNaN(input.wasteRate) ||
    input.wasteRate < 0 ||
    input.wasteRate > 100
  ) {
    errors.wasteRate = "Waste rate must be between 0% and 100%.";
  }

  return errors;
}

export function hasFoodCostValidationErrors(
  errors: FoodCostCalculatorErrors
): boolean {
  return Object.keys(errors).length > 0;
}

export interface FoodCostCalculatorOutput {
  adjustedIngredientCost: number;
  plateCost: number;
  foodCostPercentage: number;
  grossProfitPerPlate: number;
}

export function calculateFoodCostCalculator(
  input: FoodCostCalculatorInput
): FoodCostCalculatorOutput | null {
  const errors = validateFoodCostCalculator(input);
  if (hasFoodCostValidationErrors(errors)) return null;

  const adjustedIngredientCost =
    input.ingredientCost * (1 + input.wasteRate / 100);
  const plateCost =
    adjustedIngredientCost / input.portions + input.extraCostPerPortion;
  const foodCostPercentage =
    input.sellingPrice > 0 ? (plateCost / input.sellingPrice) * 100 : 0;
  const grossProfitPerPlate = input.sellingPrice - plateCost;

  return {
    adjustedIngredientCost,
    plateCost,
    foodCostPercentage,
    grossProfitPerPlate,
  };
}

export function mapFoodCostResults(
  output: FoodCostCalculatorOutput
): ToolResult[] {
  const profitTone: ResultTone =
    output.grossProfitPerPlate < 0
      ? "danger"
      : output.grossProfitPerPlate < 2
        ? "warning"
        : "success";

  return [
    {
      id: "plateCost",
      label: "Plate cost",
      value: output.plateCost,
      currency: true,
      tone: "neutral",
    },
    {
      id: "foodCostPercentage",
      label: "Food cost %",
      value: output.foodCostPercentage,
      unit: "%",
      tone: foodCostPctTone(output.foodCostPercentage),
    },
    {
      id: "grossProfitPerPlate",
      label: "Gross profit per plate",
      value: output.grossProfitPerPlate,
      currency: true,
      tone: profitTone,
    },
    {
      id: "adjustedIngredientCost",
      label: "Adjusted ingredient cost",
      value: output.adjustedIngredientCost,
      currency: true,
      tone: "neutral",
    },
  ];
}
