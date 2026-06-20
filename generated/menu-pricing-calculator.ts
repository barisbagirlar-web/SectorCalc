// Auto-generated from menu-pricing-calculator-schema.json
import * as z from 'zod';

export interface Menu_pricing_calculatorInput {
  totalIngredientCost: number;
  laborCostPerHour: number;
  preparationTimeMinutes: number;
  overheadPercentage: number;
  desiredProfitMargin: number;
  numberOfServings: number;
  dataConfidence?: number;
}

export const Menu_pricing_calculatorInputSchema = z.object({
  totalIngredientCost: z.number().default(0),
  laborCostPerHour: z.number().default(0),
  preparationTimeMinutes: z.number().default(0),
  overheadPercentage: z.number().default(0),
  desiredProfitMargin: z.number().default(0),
  numberOfServings: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Menu_pricing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.laborCostPerHour * input.preparationTimeMinutes / 60; results["laborCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCostTotal"] = Number.NaN; }
  try { const v = (input.totalIngredientCost + input.laborCostPerHour * input.preparationTimeMinutes / 60) / input.numberOfServings; results["totalDirectCostPerServing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDirectCostPerServing"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDirectCostPerServing"])) * (1 + input.overheadPercentage / 100); results["totalCostWithOverhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostWithOverhead"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostWithOverhead"])) / (1 - input.desiredProfitMargin / 100); results["recommendedMenuPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedMenuPrice"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDirectCostPerServing"])) * input.overheadPercentage / 100; results["overheadAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["recommendedMenuPrice"])) - (toNumericFormulaValue(results["totalCostWithOverhead"])); results["profitAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitAmount"] = Number.NaN; }
  return results;
}


export function calculateMenu_pricing_calculator(input: Menu_pricing_calculatorInput): Menu_pricing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recommendedMenuPrice"]);
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


export interface Menu_pricing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
