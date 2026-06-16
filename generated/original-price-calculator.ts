// Auto-generated from original-price-calculator-schema.json
import * as z from 'zod';

export interface Original_price_calculatorInput {
  finalPrice: number;
  rawMaterialSurcharge: number;
  laborSurcharge: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
  vatPercentage: number;
}

export const Original_price_calculatorInputSchema = z.object({
  finalPrice: z.number().default(100),
  rawMaterialSurcharge: z.number().default(5),
  laborSurcharge: z.number().default(3),
  overheadPercentage: z.number().default(15),
  profitMarginPercentage: z.number().default(20),
  vatPercentage: z.number().default(18),
});

function evaluateAllFormulas(input: Original_price_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.finalPrice / ((1 + input.vatPercentage / 100) * (1 + input.profitMarginPercentage / 100)); results["basePriceBeforeOverhead"] = Number.isFinite(v) ? v : 0; } catch { results["basePriceBeforeOverhead"] = 0; }
  try { const v = (results["basePriceBeforeOverhead"] ?? 0) / (1 + input.overheadPercentage / 100) - input.rawMaterialSurcharge - input.laborSurcharge; results["originalBaseCost"] = Number.isFinite(v) ? v : 0; } catch { results["originalBaseCost"] = 0; }
  return results;
}


export function calculateOriginal_price_calculator(input: Original_price_calculatorInput): Original_price_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["originalBaseCost"] ?? 0;
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


export interface Original_price_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
