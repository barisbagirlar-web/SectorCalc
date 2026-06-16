// Auto-generated from relative-standard-deviation-calculator-schema.json
import * as z from 'zod';

export interface Relative_standard_deviation_calculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
}

export const Relative_standard_deviation_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  value3: z.number().default(0),
  value4: z.number().default(0),
  value5: z.number().default(0),
});

function evaluateAllFormulas(input: Relative_standard_deviation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.value1 + input.value2 + input.value3 + input.value4 + input.value5) / 5; results["mean"] = Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = Math.sqrt( ( (input.value1 - (results["mean"] ?? 0)) ** 2 + (input.value2 - (results["mean"] ?? 0)) ** 2 + (input.value3 - (results["mean"] ?? 0)) ** 2 + (input.value4 - (results["mean"] ?? 0)) ** 2 + (input.value5 - (results["mean"] ?? 0)) ** 2 ) / 4 ); results["stdDev"] = Number.isFinite(v) ? v : 0; } catch { results["stdDev"] = 0; }
  try { const v = ((results["stdDev"] ?? 0) / (results["mean"] ?? 0)) * 100; results["rsd"] = Number.isFinite(v) ? v : 0; } catch { results["rsd"] = 0; }
  return results;
}


export function calculateRelative_standard_deviation_calculator(input: Relative_standard_deviation_calculatorInput): Relative_standard_deviation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rsd"] ?? 0;
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


export interface Relative_standard_deviation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
