// Auto-generated from stat-calculator-schema.json
import * as z from 'zod';

export interface Stat_calculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
}

export const Stat_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  value3: z.number().default(0),
  value4: z.number().default(0),
  value5: z.number().default(0),
});

function evaluateAllFormulas(input: Stat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.value1 + input.value2 + input.value3 + input.value4 + input.value5; results["sum"] = Number.isFinite(v) ? v : 0; } catch { results["sum"] = 0; }
  try { const v = 5; results["count"] = Number.isFinite(v) ? v : 0; } catch { results["count"] = 0; }
  try { const v = (input.value1 + input.value2 + input.value3 + input.value4 + input.value5) / 5; results["mean"] = Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = ((input.value1 - (results["mean"] ?? 0)) ** 2 + (input.value2 - (results["mean"] ?? 0)) ** 2 + (input.value3 - (results["mean"] ?? 0)) ** 2 + (input.value4 - (results["mean"] ?? 0)) ** 2 + (input.value5 - (results["mean"] ?? 0)) ** 2) / 4; results["variance"] = Number.isFinite(v) ? v : 0; } catch { results["variance"] = 0; }
  try { const v = Math.sqrt((results["variance"] ?? 0)); results["standardDeviation"] = Number.isFinite(v) ? v : 0; } catch { results["standardDeviation"] = 0; }
  try { const v = Math.min(input.value1, input.value2, input.value3, input.value4, input.value5); results["min"] = Number.isFinite(v) ? v : 0; } catch { results["min"] = 0; }
  try { const v = Math.max(input.value1, input.value2, input.value3, input.value4, input.value5); results["max"] = Number.isFinite(v) ? v : 0; } catch { results["max"] = 0; }
  try { const v = (results["max"] ?? 0) - (results["min"] ?? 0); results["range"] = Number.isFinite(v) ? v : 0; } catch { results["range"] = 0; }
  try { const v = (results["standardDeviation"] ?? 0) / (results["mean"] ?? 0); results["coefficientOfVariation"] = Number.isFinite(v) ? v : 0; } catch { results["coefficientOfVariation"] = 0; }
  return results;
}


export function calculateStat_calculator(input: Stat_calculatorInput): Stat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mean"] ?? 0;
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


export interface Stat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
