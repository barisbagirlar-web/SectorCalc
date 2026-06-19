// Auto-generated from oat-score-calculator-schema.json
import * as z from 'zod';

export interface Oat_score_calculatorInput {
  torqueReading: number;
  angleReading: number;
  vibrationLevel: number;
  defectCount: number;
  calibrationFactor: number;
  dataConfidence?: number;
}

export const Oat_score_calculatorInputSchema = z.object({
  torqueReading: z.number().default(50),
  angleReading: z.number().default(5),
  vibrationLevel: z.number().default(0.5),
  defectCount: z.number().default(2),
  calibrationFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Oat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.defectCount * 5; results["defectPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["defectPenalty"] = 0; }
  try { const v = input.defectCount * 5; results["defectPenalty_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["defectPenalty_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOat_score_calculator(input: Oat_score_calculatorInput): Oat_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["defectPenalty_aux"]);
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


export interface Oat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
