// Auto-generated from menu-pricing-calculator-schema.json
import * as z from 'zod';

export interface Menu_pricing_calculatorInput {
  totalIngredientCost: number;
  laborCostPerHour: number;
  preparationTimeMinutes: number;
  overheadPercentage: number;
  desiredProfitMargin: number;
  numberOfServings: number;
}

export const Menu_pricing_calculatorInputSchema = z.object({
  totalIngredientCost: z.number().default(0),
  laborCostPerHour: z.number().default(0),
  preparationTimeMinutes: z.number().default(0),
  overheadPercentage: z.number().default(0),
  desiredProfitMargin: z.number().default(0),
  numberOfServings: z.number().default(1),
});

function evaluateAllFormulas(input: Menu_pricing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.laborCostPerHour * input.preparationTimeMinutes / 60; results["laborCostTotal"] = Number.isFinite(v) ? v : 0; } catch { results["laborCostTotal"] = 0; }
  try { const v = (input.totalIngredientCost + input.laborCostPerHour * input.preparationTimeMinutes / 60) / input.numberOfServings; results["totalDirectCostPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["totalDirectCostPerServing"] = 0; }
  try { const v = (results["totalDirectCostPerServing"] ?? 0) * (1 + input.overheadPercentage / 100); results["totalCostWithOverhead"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostWithOverhead"] = 0; }
  try { const v = (results["totalCostWithOverhead"] ?? 0) / (1 - input.desiredProfitMargin / 100); results["recommendedMenuPrice"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedMenuPrice"] = 0; }
  try { const v = (results["totalDirectCostPerServing"] ?? 0) * input.overheadPercentage / 100; results["overheadAmount"] = Number.isFinite(v) ? v : 0; } catch { results["overheadAmount"] = 0; }
  try { const v = (results["recommendedMenuPrice"] ?? 0) - (results["totalCostWithOverhead"] ?? 0); results["profitAmount"] = Number.isFinite(v) ? v : 0; } catch { results["profitAmount"] = 0; }
  return results;
}


export function calculateMenu_pricing_calculator(input: Menu_pricing_calculatorInput): Menu_pricing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedMenuPrice"] ?? 0;
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


export interface Menu_pricing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
