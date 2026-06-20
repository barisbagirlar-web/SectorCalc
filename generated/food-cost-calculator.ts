// Auto-generated from food-cost-calculator-schema.json
import * as z from 'zod';

export interface Food_cost_calculatorInput {
  ingredientCost: number;
  numberOfServings: number;
  laborCostPerHour: number;
  preparationTimeHours: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
  dataConfidence?: number;
}

export const Food_cost_calculatorInputSchema = z.object({
  ingredientCost: z.number().default(0),
  numberOfServings: z.number().default(1),
  laborCostPerHour: z.number().default(0),
  preparationTimeHours: z.number().default(0),
  overheadPercentage: z.number().default(20),
  profitMarginPercentage: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Food_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ingredientCost + (input.laborCostPerHour * input.preparationTimeHours) + (input.ingredientCost * input.overheadPercentage / 100); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.numberOfServings; results["costPerServing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerServing"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costPerServing"])) / (1 - (input.profitMarginPercentage / 100)); results["sellingPricePerServing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPricePerServing"] = Number.NaN; }
  return results;
}


export function calculateFood_cost_calculator(input: Food_cost_calculatorInput): Food_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPricePerServing"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
