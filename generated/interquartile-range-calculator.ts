// Auto-generated from interquartile-range-calculator-schema.json
import * as z from 'zod';

export interface Interquartile_range_calculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  value6: number;
}

export const Interquartile_range_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  value3: z.number().default(0),
  value4: z.number().default(0),
  value5: z.number().default(0),
  value6: z.number().default(0),
});

function evaluateAllFormulas(input: Interquartile_range_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = [input.value1,input.value2,input.value3,input.value4,input.value5,input.value6].sort((a,b)=>a-b)[4] - [input.value1,input.value2,input.value3,input.value4,input.value5,input.value6].sort((a,b)=>a-b)[1]; results["iqr"] = Number.isFinite(v) ? v : 0; } catch { results["iqr"] = 0; }
  try { const v = [input.value1,input.value2,input.value3,input.value4,input.value5,input.value6].sort((a,b)=>a-b)[1]; results["q1"] = Number.isFinite(v) ? v : 0; } catch { results["q1"] = 0; }
  try { const v = [input.value1,input.value2,input.value3,input.value4,input.value5,input.value6].sort((a,b)=>a-b)[4]; results["q3"] = Number.isFinite(v) ? v : 0; } catch { results["q3"] = 0; }
  return results;
}


export function calculateInterquartile_range_calculator(input: Interquartile_range_calculatorInput): Interquartile_range_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["iqr"] ?? 0;
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


export interface Interquartile_range_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
