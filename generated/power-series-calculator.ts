// Auto-generated from power-series-calculator-schema.json
import * as z from 'zod';

export interface Power_series_calculatorInput {
  x: number;
  a0: number;
  a1: number;
  a2: number;
  a3: number;
  a4: number;
}

export const Power_series_calculatorInputSchema = z.object({
  x: z.number().default(0),
  a0: z.number().default(1),
  a1: z.number().default(0),
  a2: z.number().default(0),
  a3: z.number().default(0),
  a4: z.number().default(0),
});

function evaluateAllFormulas(input: Power_series_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a0; results["term0"] = Number.isFinite(v) ? v : 0; } catch { results["term0"] = 0; }
  try { const v = input.a1 * input.x; results["term1"] = Number.isFinite(v) ? v : 0; } catch { results["term1"] = 0; }
  try { const v = input.a2 * Math.pow(input.x, 2); results["term2"] = Number.isFinite(v) ? v : 0; } catch { results["term2"] = 0; }
  try { const v = input.a3 * Math.pow(input.x, 3); results["term3"] = Number.isFinite(v) ? v : 0; } catch { results["term3"] = 0; }
  try { const v = input.a4 * Math.pow(input.x, 4); results["term4"] = Number.isFinite(v) ? v : 0; } catch { results["term4"] = 0; }
  try { const v = input.a0 + input.a1 * input.x + input.a2 * Math.pow(input.x, 2) + input.a3 * Math.pow(input.x, 3) + input.a4 * Math.pow(input.x, 4); results["sum"] = Number.isFinite(v) ? v : 0; } catch { results["sum"] = 0; }
  return results;
}


export function calculatePower_series_calculator(input: Power_series_calculatorInput): Power_series_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sum"] ?? 0;
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


export interface Power_series_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
