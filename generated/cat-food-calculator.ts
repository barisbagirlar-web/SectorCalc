// @ts-nocheck
// Auto-generated from cat-food-calculator-schema.json
import * as z from 'zod';

export interface Cat_food_calculatorInput {
  catWeight: number;
  dailyFoodPerKg: number;
  foodPackageWeight: number;
  foodPackagePrice: number;
  numCats: number;
}

export const Cat_food_calculatorInputSchema = z.object({
  catWeight: z.number().default(4),
  dailyFoodPerKg: z.number().default(15),
  foodPackageWeight: z.number().default(2),
  foodPackagePrice: z.number().default(150),
  numCats: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cat_food_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.catWeight * input.dailyFoodPerKg * input.numCats; results["dailyFoodAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyFoodAmount"] = 0; }
  try { const v = (input.catWeight * input.dailyFoodPerKg * input.numCats / 1000) / input.foodPackageWeight * input.foodPackagePrice; results["dailyCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (input.catWeight * input.dailyFoodPerKg * input.numCats / 1000) / input.foodPackageWeight * input.foodPackagePrice * 30; results["monthlyCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCat_food_calculator(input: Cat_food_calculatorInput): Cat_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cat_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
