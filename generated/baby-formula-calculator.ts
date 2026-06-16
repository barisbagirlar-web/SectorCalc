// Auto-generated from baby-formula-calculator-schema.json
import * as z from 'zod';

export interface Baby_formula_calculatorInput {
  babyWeight: number;
  feedingCount: number;
  dailyMlPerKg: number;
  waterPerScoop: number;
  scoopWeight: number;
}

export const Baby_formula_calculatorInputSchema = z.object({
  babyWeight: z.number().default(4),
  feedingCount: z.number().default(8),
  dailyMlPerKg: z.number().default(150),
  waterPerScoop: z.number().default(60),
  scoopWeight: z.number().default(4.5),
});

function evaluateAllFormulas(input: Baby_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.babyWeight * input.dailyMlPerKg; results["dailyTotalMl"] = Number.isFinite(v) ? v : 0; } catch { results["dailyTotalMl"] = 0; }
  try { const v = (results["dailyTotalMl"] ?? 0) / input.feedingCount; results["perFeedingMl"] = Number.isFinite(v) ? v : 0; } catch { results["perFeedingMl"] = 0; }
  try { const v = (results["perFeedingMl"] ?? 0) / input.waterPerScoop; results["scoopsPerFeeding"] = Number.isFinite(v) ? v : 0; } catch { results["scoopsPerFeeding"] = 0; }
  try { const v = (results["scoopsPerFeeding"] ?? 0) * input.scoopWeight; results["powderPerFeeding"] = Number.isFinite(v) ? v : 0; } catch { results["powderPerFeeding"] = 0; }
  try { const v = (results["powderPerFeeding"] ?? 0) * input.feedingCount; results["dailyPowder"] = Number.isFinite(v) ? v : 0; } catch { results["dailyPowder"] = 0; }
  return results;
}


export function calculateBaby_formula_calculator(input: Baby_formula_calculatorInput): Baby_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyPowder"] ?? 0;
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


export interface Baby_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
