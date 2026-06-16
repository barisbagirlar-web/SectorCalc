// Auto-generated from roa-calculator-schema.json
import * as z from 'zod';

export interface Roa_calculatorInput {
  netIncome: number;
  beginningAssets: number;
  endingAssets: number;
  averageAssetsOverride: number;
}

export const Roa_calculatorInputSchema = z.object({
  netIncome: z.number().default(0),
  beginningAssets: z.number().default(0),
  endingAssets: z.number().default(0),
  averageAssetsOverride: z.number().default(0),
});

function evaluateAllFormulas(input: Roa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageAssetsOverride > 0 ? input.averageAssetsOverride : (input.beginningAssets + input.endingAssets) / 2; results["averageAssets"] = Number.isFinite(v) ? v : 0; } catch { results["averageAssets"] = 0; }
  try { const v = input.netIncome / (results["averageAssets"] ?? 0) * 100; results["roa"] = Number.isFinite(v) ? v : 0; } catch { results["roa"] = 0; }
  return results;
}


export function calculateRoa_calculator(input: Roa_calculatorInput): Roa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roa"] ?? 0;
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


export interface Roa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
