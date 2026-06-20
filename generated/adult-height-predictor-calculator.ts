// Auto-generated from adult-height-predictor-calculator-schema.json
import * as z from 'zod';

export interface Adult_height_predictor_calculatorInput {
  childGender: number;
  fatherHeightCm: number;
  motherHeightCm: number;
  childHeightCm: number;
  childAgeYrs: number;
  dataConfidence?: number;
}

export const Adult_height_predictor_calculatorInputSchema = z.object({
  childGender: z.number().default(0),
  fatherHeightCm: z.number().default(175),
  motherHeightCm: z.number().default(165),
  childHeightCm: z.number().default(120),
  childAgeYrs: z.number().default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Adult_height_predictor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.childGender === 0 ? (input.fatherHeightCm + input.motherHeightCm + 13) / 2 : (input.fatherHeightCm - 13 + input.motherHeightCm) / 2; results["predictedHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["predictedHeight"] = Number.NaN; }
  try { const v = input.childGender === 0 ? (input.fatherHeightCm + input.motherHeightCm + 13) / 2 : (input.fatherHeightCm - 13 + input.motherHeightCm) / 2; results["predictedHeight_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["predictedHeight_aux"] = Number.NaN; }
  return results;
}


export function calculateAdult_height_predictor_calculator(input: Adult_height_predictor_calculatorInput): Adult_height_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["predictedHeight"]);
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


export interface Adult_height_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
