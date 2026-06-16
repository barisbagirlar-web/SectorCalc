// Auto-generated from percent-difference-calculator-schema.json
import * as z from 'zod';

export interface Percent_difference_calculatorInput {
  value1: number;
  value2: number;
  referenceValue: number;
  tolerance: number;
}

export const Percent_difference_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  referenceValue: z.number().default(0),
  tolerance: z.number().default(5),
});

function evaluateAllFormulas(input: Percent_difference_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.abs(input.value1 - input.value2); results["absDiff"] = Number.isFinite(v) ? v : 0; } catch { results["absDiff"] = 0; }
  try { const v = (input.value1 + input.value2) / 2; results["avg"] = Number.isFinite(v) ? v : 0; } catch { results["avg"] = 0; }
  try { const v = (results["avg"] ?? 0) === 0 ? 0 : ((results["absDiff"] ?? 0) / (results["avg"] ?? 0)) * 100; results["percentDifference"] = Number.isFinite(v) ? v : 0; } catch { results["percentDifference"] = 0; }
  try { const v = input.referenceValue !== 0 ? (Math.abs(input.referenceValue - input.value2) / Math.abs(input.referenceValue)) * 100 : 0; results["percentError"] = Number.isFinite(v) ? v : 0; } catch { results["percentError"] = 0; }
  try { const v = input.referenceValue > 0 ? (results["percentError"] ?? 0) : (results["percentDifference"] ?? 0); results["primaryOutput"] = Number.isFinite(v) ? v : 0; } catch { results["primaryOutput"] = 0; }
  try { const v = Math.abs(input.referenceValue > 0 ? (results["percentError"] ?? 0) : (results["percentDifference"] ?? 0)) <= input.tolerance; results["withinTolerance"] = Number.isFinite(v) ? v : 0; } catch { results["withinTolerance"] = 0; }
  return results;
}


export function calculatePercent_difference_calculator(input: Percent_difference_calculatorInput): Percent_difference_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryOutput"] ?? 0;
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


export interface Percent_difference_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
