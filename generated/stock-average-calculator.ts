// Auto-generated from stock-average-calculator-schema.json
import * as z from 'zod';

export interface Stock_average_calculatorInput {
  currentQuantity: number;
  currentAvgPrice: number;
  purchaseQuantity: number;
  purchasePrice: number;
  dataConfidence?: number;
}

export const Stock_average_calculatorInputSchema = z.object({
  currentQuantity: z.number().default(0),
  currentAvgPrice: z.number().default(0),
  purchaseQuantity: z.number().default(0),
  purchasePrice: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stock_average_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentQuantity * input.currentAvgPrice + input.purchaseQuantity * input.purchasePrice) / (input.currentQuantity + input.purchaseQuantity); results["newAvgPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newAvgPrice"] = Number.NaN; }
  try { const v = input.currentQuantity * input.currentAvgPrice + input.purchaseQuantity * input.purchasePrice; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.currentQuantity + input.purchaseQuantity; results["totalShares"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalShares"] = Number.NaN; }
  return results;
}


export function calculateStock_average_calculator(input: Stock_average_calculatorInput): Stock_average_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["newAvgPrice"]);
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


export interface Stock_average_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
