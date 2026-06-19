// Auto-generated from puppy-weight-predictor-calculator-schema.json
import * as z from 'zod';

export interface Puppy_weight_predictor_calculatorInput {
  currentWeight: number;
  currentAgeWeeks: number;
  breedMaturityAgeMonths: number;
  adjustmentFactor: number;
  dataConfidence?: number;
}

export const Puppy_weight_predictor_calculatorInputSchema = z.object({
  currentWeight: z.number().default(5),
  currentAgeWeeks: z.number().default(12),
  breedMaturityAgeMonths: z.number().default(12),
  adjustmentFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Puppy_weight_predictor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentAgeWeeks / 4.345; results["currentAgeMonths"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["currentAgeMonths"] = 0; }
  try { const v = input.currentWeight / (asFormulaNumber(results["currentAgeMonths"])); results["monthlyGrowthRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyGrowthRate"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyGrowthRate"])) * input.breedMaturityAgeMonths * input.adjustmentFactor; results["weightAtMaturity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightAtMaturity"] = 0; }
  try { const v = (asFormulaNumber(results["weightAtMaturity"])) * 0.9; results["weightRangeLow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightRangeLow"] = 0; }
  try { const v = (asFormulaNumber(results["weightAtMaturity"])) * 1.1; results["weightRangeHigh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightRangeHigh"] = 0; }
  try { const v = (asFormulaNumber(results["weightRangeLow"])) + ' - ' + (asFormulaNumber(results["weightRangeHigh"])) + ' kg'; results["weightRangeLow___________weightRangeHigh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightRangeLow___________weightRangeHigh"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePuppy_weight_predictor_calculator(input: Puppy_weight_predictor_calculatorInput): Puppy_weight_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["weightAtMaturity"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
