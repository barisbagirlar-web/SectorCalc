// Auto-generated from bogo-calculator-schema.json
import * as z from 'zod';

export interface Bogo_calculatorInput {
  originalPrice: number;
  buyQuantity: number;
  getQuantity: number;
  numberOfSets: number;
  taxRate: number;
  additionalDiscount: number;
  dataConfidence?: number;
}

export const Bogo_calculatorInputSchema = z.object({
  originalPrice: z.number().default(10),
  buyQuantity: z.number().default(1),
  getQuantity: z.number().default(1),
  numberOfSets: z.number().default(1),
  taxRate: z.number().default(0),
  additionalDiscount: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bogo_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.buyQuantity + input.getQuantity) * input.numberOfSets; results["totalItems"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalItems"] = Number.NaN; }
  try { const v = input.originalPrice * input.buyQuantity * input.numberOfSets * (1 - input.additionalDiscount / 100) * (1 + input.taxRate / 100); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (input.originalPrice * input.buyQuantity * input.numberOfSets * (1 - input.additionalDiscount / 100) * (1 + input.taxRate / 100)) / ((input.buyQuantity + input.getQuantity) * input.numberOfSets); results["costPerItem"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerItem"] = Number.NaN; }
  try { const v = input.originalPrice * (input.buyQuantity + input.getQuantity) * input.numberOfSets - input.originalPrice * input.buyQuantity * input.numberOfSets * (1 - input.additionalDiscount / 100) * (1 + input.taxRate / 100); results["totalSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSavings"] = Number.NaN; }
  try { const v = (1 - (input.buyQuantity * (1 - input.additionalDiscount / 100) * (1 + input.taxRate / 100)) / (input.buyQuantity + input.getQuantity)) * 100; results["effectiveDiscountPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveDiscountPercent"] = Number.NaN; }
  return results;
}


export function calculateBogo_calculator(input: Bogo_calculatorInput): Bogo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveDiscountPercent"]);
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


export interface Bogo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
