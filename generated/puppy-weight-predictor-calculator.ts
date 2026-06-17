// Auto-generated from puppy-weight-predictor-calculator-schema.json
import * as z from 'zod';

export interface Puppy_weight_predictor_calculatorInput {
  currentWeight: number;
  currentAgeWeeks: number;
  breedMaturityAgeMonths: number;
  adjustmentFactor: number;
}

export const Puppy_weight_predictor_calculatorInputSchema = z.object({
  currentWeight: z.number().default(5),
  currentAgeWeeks: z.number().default(12),
  breedMaturityAgeMonths: z.number().default(12),
  adjustmentFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Puppy_weight_predictor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentAgeWeeks / 4.345; results["currentAgeMonths"] = Number.isFinite(v) ? v : 0; } catch { results["currentAgeMonths"] = 0; }
  try { const v = (Math.round(((input.currentWeight / (results["currentAgeMonths"] ?? 0)) * input.breedMaturityAgeMonths * input.adjustmentFactor) * 10**(2)) / 10**(2)); results["estimatedAdultWeight"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedAdultWeight"] = 0; }
  try { const v = (Math.round(((results["estimatedAdultWeight"] ?? 0) / input.breedMaturityAgeMonths) * 10**(2)) / 10**(2)); results["monthlyGrowthRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyGrowthRate"] = 0; }
  try { const v = (Math.round(((results["estimatedAdultWeight"] ?? 0) * 0.9) * 10**(2)) / 10**(2)); results["weightRangeLow"] = Number.isFinite(v) ? v : 0; } catch { results["weightRangeLow"] = 0; }
  try { const v = (Math.round(((results["estimatedAdultWeight"] ?? 0) * 1.1) * 10**(2)) / 10**(2)); results["weightRangeHigh"] = Number.isFinite(v) ? v : 0; } catch { results["weightRangeHigh"] = 0; }
  try { const v = (results["weightRangeLow"] ?? 0) + ' - ' + (results["weightRangeHigh"] ?? 0) + ' kg'; results["weightRangeLow___________weightRangeHigh"] = Number.isFinite(v) ? v : 0; } catch { results["weightRangeLow___________weightRangeHigh"] = 0; }
  return results;
}


export function calculatePuppy_weight_predictor_calculator(input: Puppy_weight_predictor_calculatorInput): Puppy_weight_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedAdultWeight"] ?? 0;
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


export interface Puppy_weight_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
