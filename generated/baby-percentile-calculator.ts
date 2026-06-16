// Auto-generated from baby-percentile-calculator-schema.json
import * as z from 'zod';

export interface Baby_percentile_calculatorInput {
  age: number;
  weight: number;
  length: number;
  head: number;
  gender: number;
}

export const Baby_percentile_calculatorInputSchema = z.object({
  age: z.number().default(12),
  weight: z.number().default(9.5),
  length: z.number().default(74),
  head: z.number().default(44),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Baby_percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100/(1+Math.exp(-1.702 * ((input.weight - ((1-input.gender)*(3.5+0.5*input.age) + input.gender*(3.0+0.45*input.age))) / (1+0.05*input.age)))); results["weightPercentile"] = Number.isFinite(v) ? v : 0; } catch { results["weightPercentile"] = 0; }
  try { const v = 100/(1+Math.exp(-1.702 * ((input.length - ((1-input.gender)*(50+2.5*input.age) + input.gender*(49+2.4*input.age))) / (2+0.1*input.age)))); results["lengthPercentile"] = Number.isFinite(v) ? v : 0; } catch { results["lengthPercentile"] = 0; }
  try { const v = 100/(1+Math.exp(-1.702 * ((input.head - ((1-input.gender)*(35+0.7*input.age) + input.gender*(34+0.65*input.age))) / (1.5+0.05*input.age)))); results["headPercentile"] = Number.isFinite(v) ? v : 0; } catch { results["headPercentile"] = 0; }
  return results;
}


export function calculateBaby_percentile_calculator(input: Baby_percentile_calculatorInput): Baby_percentile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weightPercentile"] ?? 0;
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


export interface Baby_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
