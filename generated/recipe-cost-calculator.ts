// Auto-generated from recipe-cost-calculator-schema.json
import * as z from 'zod';

export interface Recipe_cost_calculatorInput {
  ingredientCostPerUnit: number;
  ingredientQuantity: number;
  numberOfPortions: number;
  laborCostPerHour: number;
  laborHours: number;
  overheadPercent: number;
  dataConfidence?: number;
}

export const Recipe_cost_calculatorInputSchema = z.object({
  ingredientCostPerUnit: z.number().default(5),
  ingredientQuantity: z.number().default(0.5),
  numberOfPortions: z.number().default(4),
  laborCostPerHour: z.number().default(15),
  laborHours: z.number().default(1),
  overheadPercent: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recipe_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ingredientCostPerUnit * input.ingredientQuantity; results["totalIngredientCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalIngredientCost"] = Number.NaN; }
  try { const v = input.laborCostPerHour * input.laborHours; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalIngredientCost"])) * (input.overheadPercent / 100); results["overheadCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalIngredientCost"])) + (toNumericFormulaValue(results["laborCost"])) + (toNumericFormulaValue(results["overheadCost"])); results["totalRecipeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRecipeCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRecipeCost"])) / input.numberOfPortions; results["costPerPortion"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerPortion"] = Number.NaN; }
  return results;
}


export function calculateRecipe_cost_calculator(input: Recipe_cost_calculatorInput): Recipe_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRecipeCost"]);
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


export interface Recipe_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
