// Auto-generated from pizza-cost-calculator-schema.json
import * as z from 'zod';

export interface Pizza_cost_calculatorInput {
  doughCost: number;
  sauceCost: number;
  cheeseCost: number;
  toppingsCost: number;
  laborCost: number;
  overheadCost: number;
  marginPercent: number;
}

export const Pizza_cost_calculatorInputSchema = z.object({
  doughCost: z.number().default(0.5),
  sauceCost: z.number().default(0.3),
  cheeseCost: z.number().default(0.6),
  toppingsCost: z.number().default(0.4),
  laborCost: z.number().default(0.75),
  overheadCost: z.number().default(0.25),
  marginPercent: z.number().default(40),
});

function evaluateAllFormulas(input: Pizza_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.doughCost + input.sauceCost + input.cheeseCost + input.toppingsCost; results["totalIngredientCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalIngredientCost"] = 0; }
  try { const v = (results["totalIngredientCost"] ?? 0) + input.laborCost + input.overheadCost; results["totalCostPerPizza"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostPerPizza"] = 0; }
  try { const v = (results["totalCostPerPizza"] ?? 0) / (1 - input.marginPercent/100); results["sellingPricePerPizza"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPricePerPizza"] = 0; }
  try { const v = (results["sellingPricePerPizza"] ?? 0) - (results["totalCostPerPizza"] ?? 0); results["profitPerPizza"] = Number.isFinite(v) ? v : 0; } catch { results["profitPerPizza"] = 0; }
  return results;
}


export function calculatePizza_cost_calculator(input: Pizza_cost_calculatorInput): Pizza_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sellingPricePerPizza"] ?? 0;
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


export interface Pizza_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
