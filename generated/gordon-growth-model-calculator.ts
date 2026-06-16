// Auto-generated from gordon-growth-model-calculator-schema.json
import * as z from 'zod';

export interface Gordon_growth_model_calculatorInput {
  currentDividend: number;
  growthRate: number;
  requiredReturn: number;
  marketPrice: number;
}

export const Gordon_growth_model_calculatorInputSchema = z.object({
  currentDividend: z.number().default(2.5),
  growthRate: z.number().default(3),
  requiredReturn: z.number().default(10),
  marketPrice: z.number().default(50),
});

function evaluateAllFormulas(input: Gordon_growth_model_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentDividend * (1 + input.growthRate/100) / (input.requiredReturn/100 - input.growthRate/100); results["intrinsicValue"] = Number.isFinite(v) ? v : 0; } catch { results["intrinsicValue"] = 0; }
  try { const v = (input.currentDividend / input.marketPrice) * 100; results["dividendYield"] = Number.isFinite(v) ? v : 0; } catch { results["dividendYield"] = 0; }
  try { const v = (((results["intrinsicValue"] ?? 0) - input.marketPrice) / (results["intrinsicValue"] ?? 0)) * 100; results["marginOfSafety"] = Number.isFinite(v) ? v : 0; } catch { results["marginOfSafety"] = 0; }
  return results;
}


export function calculateGordon_growth_model_calculator(input: Gordon_growth_model_calculatorInput): Gordon_growth_model_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["intrinsicValue"] ?? 0;
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


export interface Gordon_growth_model_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
