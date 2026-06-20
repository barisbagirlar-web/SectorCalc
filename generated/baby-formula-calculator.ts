// Auto-generated from baby-formula-calculator-schema.json
import * as z from 'zod';

export interface Baby_formula_calculatorInput {
  babyWeight: number;
  feedingCount: number;
  dailyMlPerKg: number;
  waterPerScoop: number;
  scoopWeight: number;
  dataConfidence?: number;
}

export const Baby_formula_calculatorInputSchema = z.object({
  babyWeight: z.number().default(4),
  feedingCount: z.number().default(8),
  dailyMlPerKg: z.number().default(150),
  waterPerScoop: z.number().default(60),
  scoopWeight: z.number().default(4.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baby_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.babyWeight * input.dailyMlPerKg; results["dailyTotalMl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyTotalMl"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyTotalMl"])) / input.feedingCount; results["perFeedingMl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perFeedingMl"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["perFeedingMl"])) / input.waterPerScoop; results["scoopsPerFeeding"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scoopsPerFeeding"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["scoopsPerFeeding"])) * input.scoopWeight; results["powderPerFeeding"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powderPerFeeding"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["powderPerFeeding"])) * input.feedingCount; results["dailyPowder"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyPowder"] = Number.NaN; }
  return results;
}


export function calculateBaby_formula_calculator(input: Baby_formula_calculatorInput): Baby_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyPowder"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
