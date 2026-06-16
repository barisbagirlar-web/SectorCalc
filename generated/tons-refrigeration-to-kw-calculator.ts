// Auto-generated from tons-refrigeration-to-kw-calculator-schema.json
import * as z from 'zod';

export interface Tons_refrigeration_to_kw_calculatorInput {
  tons: number;
  conversionFactor: number;
  safetyFactor: number;
  decimals: number;
}

export const Tons_refrigeration_to_kw_calculatorInputSchema = z.object({
  tons: z.number().default(1),
  conversionFactor: z.number().default(3.51685),
  safetyFactor: z.number().default(1),
  decimals: z.number().default(2),
});

function evaluateAllFormulas(input: Tons_refrigeration_to_kw_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tons * input.conversionFactor; results["baseKW"] = Number.isFinite(v) ? v : 0; } catch { results["baseKW"] = 0; }
  try { const v = (results["baseKW"] ?? 0) * input.safetyFactor; results["withSafety"] = Number.isFinite(v) ? v : 0; } catch { results["withSafety"] = 0; }
  try { const v = Math.round((results["withSafety"] ?? 0) * Math.pow(10, input.decimals)) / Math.pow(10, input.decimals); results["finalKW"] = Number.isFinite(v) ? v : 0; } catch { results["finalKW"] = 0; }
  return results;
}


export function calculateTons_refrigeration_to_kw_calculator(input: Tons_refrigeration_to_kw_calculatorInput): Tons_refrigeration_to_kw_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalKW"] ?? 0;
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


export interface Tons_refrigeration_to_kw_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
