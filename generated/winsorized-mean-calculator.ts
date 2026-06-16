// Auto-generated from winsorized-mean-calculator-schema.json
import * as z from 'zod';

export interface Winsorized_mean_calculatorInput {
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  x5: number;
  x6: number;
  winPercent: number;
}

export const Winsorized_mean_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  x2: z.number().default(0),
  x3: z.number().default(0),
  x4: z.number().default(0),
  x5: z.number().default(0),
  x6: z.number().default(0),
  winPercent: z.number().default(10),
});

function evaluateAllFormulas(input: Winsorized_mean_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = [input.x1, input.x2, input.x3, input.x4, input.x5, input.x6].sort((a,b)=>a-b); results["sorted"] = Number.isFinite(v) ? v : 0; } catch { results["sorted"] = 0; }
  try { const v = (results["sorted"] ?? 0).length; results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = Math.floor((results["n"] ?? 0) * input.winPercent / 100); results["k"] = Number.isFinite(v) ? v : 0; } catch { results["k"] = 0; }
  try { const v = (results["sorted"] ?? 0).reduce((sum, val, i) => i < (results["k"] ?? 0) ? sum + (results["sorted"] ?? 0) : (i >= (results["n"] ?? 0) - (results["k"] ?? 0) ? sum + (results["sorted"] ?? 0) : sum + val), 0) / (results["n"] ?? 0); results["winsorizedMean"] = Number.isFinite(v) ? v : 0; } catch { results["winsorizedMean"] = 0; }
  try { const v = (results["sorted"] ?? 0).reduce((a,b)=>a+b,0)/(results["n"] ?? 0); results["originalMean"] = Number.isFinite(v) ? v : 0; } catch { results["originalMean"] = 0; }
  return results;
}


export function calculateWinsorized_mean_calculator(input: Winsorized_mean_calculatorInput): Winsorized_mean_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["winsorizedMean"] ?? 0;
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


export interface Winsorized_mean_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
