// Auto-generated from long-tons-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Long_tons_to_kg_calculatorInput {
  longTons: number;
  quantity: number;
  conversionFactor: number;
  safetyMargin: number;
  decimals: number;
}

export const Long_tons_to_kg_calculatorInputSchema = z.object({
  longTons: z.number().default(0),
  quantity: z.number().default(1),
  conversionFactor: z.number().default(1016.0469088),
  safetyMargin: z.number().default(0),
  decimals: z.number().default(2),
});

function evaluateAllFormulas(input: Long_tons_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.longTons * input.conversionFactor * input.quantity; results["exactKg"] = Number.isFinite(v) ? v : 0; } catch { results["exactKg"] = 0; }
  try { const v = (results["exactKg"] ?? 0) * (1 + input.safetyMargin / 100); results["withSafetyKg"] = Number.isFinite(v) ? v : 0; } catch { results["withSafetyKg"] = 0; }
  try { const v = Math.round((results["withSafetyKg"] ?? 0) * Math.pow(10, input.decimals)) / Math.pow(10, input.decimals); results["resultKg"] = Number.isFinite(v) ? v : 0; } catch { results["resultKg"] = 0; }
  return results;
}


export function calculateLong_tons_to_kg_calculator(input: Long_tons_to_kg_calculatorInput): Long_tons_to_kg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["resultKg"] ?? 0;
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


export interface Long_tons_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
