// Auto-generated from restaurant-markup-calculator-schema.json
import * as z from 'zod';

export interface Restaurant_markup_calculatorInput {
  ingredientCost: number;
  laborCost: number;
  overheadCost: number;
  wastePercent: number;
  desiredMarkupPercent: number;
  dataConfidence?: number;
}

export const Restaurant_markup_calculatorInputSchema = z.object({
  ingredientCost: z.number().default(4.5),
  laborCost: z.number().default(2),
  overheadCost: z.number().default(1),
  wastePercent: z.number().default(3),
  desiredMarkupPercent: z.number().default(300),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Restaurant_markup_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ingredientCost / (1 - input.wastePercent / 100); results["effectiveIngredientCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveIngredientCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveIngredientCost"])) + input.laborCost + input.overheadCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) * (1 + input.desiredMarkupPercent / 100); results["sellingPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPrice"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["sellingPrice"])) - (toNumericFormulaValue(results["totalCost"])); results["markupAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["markupAmount"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["effectiveIngredientCost"])) / (toNumericFormulaValue(results["sellingPrice"]))) * 100; results["foodCostPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["foodCostPercent"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["markupAmount"])) / (toNumericFormulaValue(results["sellingPrice"]))) * 100; results["profitMarginPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitMarginPercent"] = Number.NaN; }
  return results;
}


export function calculateRestaurant_markup_calculator(input: Restaurant_markup_calculatorInput): Restaurant_markup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPrice"]);
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


export interface Restaurant_markup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
