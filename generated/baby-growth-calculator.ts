// Auto-generated from baby-growth-calculator-schema.json
import * as z from 'zod';

export interface Baby_growth_calculatorInput {
  birthWeight: number;
  currentWeight: number;
  ageMonths: number;
  length: number;
  headCircumference: number;
  gender: number;
}

export const Baby_growth_calculatorInputSchema = z.object({
  birthWeight: z.number().default(3.5),
  currentWeight: z.number().default(5),
  ageMonths: z.number().default(2),
  length: z.number().default(50),
  headCircumference: z.number().default(35),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Baby_growth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(100 * (1/(1+Math.exp(-((input.currentWeight - (input.birthWeight + 0.6 * input.ageMonths))/0.5))))); results["weightPercentile"] = Number.isFinite(v) ? v : 0; } catch { results["weightPercentile"] = 0; }
  try { const v = Math.round(100 * (1/(1+Math.exp(-((input.length - (45 + 2.5 * input.ageMonths))/2))))); results["lengthPercentile"] = Number.isFinite(v) ? v : 0; } catch { results["lengthPercentile"] = 0; }
  try { const v = Math.round(100 * (1/(1+Math.exp(-((input.currentWeight - (input.length/100 * 10))/1.2))))); results["weightForLengthPercentile"] = Number.isFinite(v) ? v : 0; } catch { results["weightForLengthPercentile"] = 0; }
  return results;
}


export function calculateBaby_growth_calculator(input: Baby_growth_calculatorInput): Baby_growth_calculatorOutput {
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


export interface Baby_growth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
