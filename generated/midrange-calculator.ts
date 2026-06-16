// Auto-generated from midrange-calculator-schema.json
import * as z from 'zod';

export interface Midrange_calculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
}

export const Midrange_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  value3: z.number().default(0),
  value4: z.number().default(0),
  value5: z.number().default(0),
});

function evaluateAllFormulas(input: Midrange_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(input.value1, input.value2, input.value3, input.value4, input.value5); results["min"] = Number.isFinite(v) ? v : 0; } catch { results["min"] = 0; }
  try { const v = Math.max(input.value1, input.value2, input.value3, input.value4, input.value5); results["max"] = Number.isFinite(v) ? v : 0; } catch { results["max"] = 0; }
  try { const v = ((results["min"] ?? 0) + (results["max"] ?? 0)) / 2; results["midrange"] = Number.isFinite(v) ? v : 0; } catch { results["midrange"] = 0; }
  return results;
}


export function calculateMidrange_calculator(input: Midrange_calculatorInput): Midrange_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["midrange"] ?? 0;
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


export interface Midrange_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
