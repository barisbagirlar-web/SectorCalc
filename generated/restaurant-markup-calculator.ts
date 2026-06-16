// Auto-generated from restaurant-markup-calculator-schema.json
import * as z from 'zod';

export interface Restaurant_markup_calculatorInput {
  ingredientCost: number;
  laborCost: number;
  overheadCost: number;
  wastePercent: number;
  desiredMarkupPercent: number;
}

export const Restaurant_markup_calculatorInputSchema = z.object({
  ingredientCost: z.number().default(4.5),
  laborCost: z.number().default(2),
  overheadCost: z.number().default(1),
  wastePercent: z.number().default(3),
  desiredMarkupPercent: z.number().default(300),
});

function evaluateAllFormulas(input: Restaurant_markup_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ingredientCost / (1 - input.wastePercent / 100); results["effectiveIngredientCost"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveIngredientCost"] = 0; }
  try { const v = (results["effectiveIngredientCost"] ?? 0) + input.laborCost + input.overheadCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) * (1 + input.desiredMarkupPercent / 100); results["sellingPrice"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  try { const v = (results["sellingPrice"] ?? 0) - (results["totalCost"] ?? 0); results["markupAmount"] = Number.isFinite(v) ? v : 0; } catch { results["markupAmount"] = 0; }
  try { const v = ((results["effectiveIngredientCost"] ?? 0) / (results["sellingPrice"] ?? 0)) * 100; results["foodCostPercent"] = Number.isFinite(v) ? v : 0; } catch { results["foodCostPercent"] = 0; }
  try { const v = ((results["markupAmount"] ?? 0) / (results["sellingPrice"] ?? 0)) * 100; results["profitMarginPercent"] = Number.isFinite(v) ? v : 0; } catch { results["profitMarginPercent"] = 0; }
  return results;
}


export function calculateRestaurant_markup_calculator(input: Restaurant_markup_calculatorInput): Restaurant_markup_calculatorOutput {
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


export interface Restaurant_markup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
