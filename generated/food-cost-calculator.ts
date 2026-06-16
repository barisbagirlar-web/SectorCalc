// Auto-generated from food-cost-calculator-schema.json
import * as z from 'zod';

export interface Food_cost_calculatorInput {
  ingredientCost: number;
  laborCost: number;
  overheadCost: number;
  numberOfServings: number;
  desiredProfitMargin: number;
  wastePercentage: number;
}

export const Food_cost_calculatorInputSchema = z.object({
  ingredientCost: z.number().default(0),
  laborCost: z.number().default(0),
  overheadCost: z.number().default(0),
  numberOfServings: z.number().default(1),
  desiredProfitMargin: z.number().default(20),
  wastePercentage: z.number().default(0),
});

function evaluateAllFormulas(input: Food_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ingredientCost + input.laborCost + input.overheadCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.numberOfServings; results["costPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["costPerServing"] = 0; }
  try { const v = (results["costPerServing"] ?? 0) * (1 + input.wastePercentage / 100); results["costWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["costWithWaste"] = 0; }
  try { const v = (results["costWithWaste"] ?? 0) / (1 - input.desiredProfitMargin / 100); results["sellingPrice"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  try { const v = (results["sellingPrice"] ?? 0) - (results["costWithWaste"] ?? 0); results["profitPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["profitPerServing"] = 0; }
  try { const v = ((results["profitPerServing"] ?? 0) / (results["sellingPrice"] ?? 0)) * 100; results["profitMarginCheck"] = Number.isFinite(v) ? v : 0; } catch { results["profitMarginCheck"] = 0; }
  return results;
}


export function calculateFood_cost_calculator(input: Food_cost_calculatorInput): Food_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sellingPrice"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
