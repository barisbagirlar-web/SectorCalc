// @ts-nocheck
// Auto-generated from recipe-cost-calculator-schema.json
import * as z from 'zod';

export interface Recipe_cost_calculatorInput {
  ingredientCostPerUnit: number;
  ingredientQuantity: number;
  numberOfPortions: number;
  laborCostPerHour: number;
  laborHours: number;
  overheadPercent: number;
}

export const Recipe_cost_calculatorInputSchema = z.object({
  ingredientCostPerUnit: z.number().default(5),
  ingredientQuantity: z.number().default(0.5),
  numberOfPortions: z.number().default(4),
  laborCostPerHour: z.number().default(15),
  laborHours: z.number().default(1),
  overheadPercent: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Recipe_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.ingredientCostPerUnit * input.ingredientQuantity; results["totalIngredientCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalIngredientCost"] = 0; }
  try { const v = input.laborCostPerHour * input.laborHours; results["laborCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalIngredientCost"])) * (input.overheadPercent / 100); results["overheadCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalIngredientCost"])) + (asFormulaNumber(results["laborCost"])) + (asFormulaNumber(results["overheadCost"])); results["totalRecipeCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRecipeCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalRecipeCost"])) / input.numberOfPortions; results["costPerPortion"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerPortion"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRecipe_cost_calculator(input: Recipe_cost_calculatorInput): Recipe_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRecipeCost"]);
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


export interface Recipe_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
