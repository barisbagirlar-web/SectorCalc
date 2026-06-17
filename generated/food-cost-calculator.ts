// @ts-nocheck
// Auto-generated from food-cost-calculator-schema.json
import * as z from 'zod';

export interface Food_cost_calculatorInput {
  ingredientCost: number;
  numberOfServings: number;
  laborCostPerHour: number;
  preparationTimeHours: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
}

export const Food_cost_calculatorInputSchema = z.object({
  ingredientCost: z.number().default(0),
  numberOfServings: z.number().default(1),
  laborCostPerHour: z.number().default(0),
  preparationTimeHours: z.number().default(0),
  overheadPercentage: z.number().default(20),
  profitMarginPercentage: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Food_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.ingredientCost + (input.laborCostPerHour * input.preparationTimeHours) + (input.ingredientCost * input.overheadPercentage / 100); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.numberOfServings; results["costPerServing"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerServing"] = 0; }
  try { const v = (asFormulaNumber(results["costPerServing"])) / (1 - (input.profitMarginPercentage / 100)); results["sellingPricePerServing"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sellingPricePerServing"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFood_cost_calculator(input: Food_cost_calculatorInput): Food_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPricePerServing"]);
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


export interface Food_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
