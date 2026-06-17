// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Restaurant_markup_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.ingredientCost / (1 - input.wastePercent / 100); results["effectiveIngredientCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveIngredientCost"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveIngredientCost"])) + input.laborCost + input.overheadCost; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) * (1 + input.desiredMarkupPercent / 100); results["sellingPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sellingPrice"] = 0; }
  try { const v = (asFormulaNumber(results["sellingPrice"])) - (asFormulaNumber(results["totalCost"])); results["markupAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["markupAmount"] = 0; }
  try { const v = ((asFormulaNumber(results["effectiveIngredientCost"])) / (asFormulaNumber(results["sellingPrice"]))) * 100; results["foodCostPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["foodCostPercent"] = 0; }
  try { const v = ((asFormulaNumber(results["markupAmount"])) / (asFormulaNumber(results["sellingPrice"]))) * 100; results["profitMarginPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitMarginPercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRestaurant_markup_calculator(input: Restaurant_markup_calculatorInput): Restaurant_markup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPrice"]);
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


export interface Restaurant_markup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
