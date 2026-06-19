// Auto-generated from t-score-calculator-schema.json
import * as z from 'zod';

export interface T_score_calculatorInput {
  sampleMean: number;
  populationMean: number;
  sampleStdDev: number;
  sampleSize: number;
  dataConfidence?: number;
}

export const T_score_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  populationMean: z.number().default(0),
  sampleStdDev: z.number().default(1),
  sampleSize: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: T_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sampleMean) * (input.populationMean) * (input.sampleStdDev) * (input.sampleSize); results["degreesOfFreedom"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom"] = 0; }
  try { const v = (input.sampleMean) * (input.populationMean) * (input.sampleStdDev); results["degreesOfFreedom_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateT_score_calculator(input: T_score_calculatorInput): T_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["degreesOfFreedom_aux"]));
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


export interface T_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
