// Auto-generated from f1-score-calculator-schema.json
import * as z from 'zod';

export interface F1_score_calculatorInput {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  dataConfidence?: number;
}

export const F1_score_calculatorInputSchema = z.object({
  truePositives: z.number().default(50),
  falsePositives: z.number().default(10),
  falseNegatives: z.number().default(5),
  trueNegatives: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: F1_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.truePositives / (input.truePositives + input.falsePositives); results["precision"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["precision"] = 0; }
  try { const v = input.truePositives / (input.truePositives + input.falseNegatives); results["recall"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recall"] = 0; }
  try { const v = 2 * input.truePositives / (2 * input.truePositives + input.falsePositives + input.falseNegatives); results["f1Score"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["f1Score"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateF1_score_calculator(input: F1_score_calculatorInput): F1_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["f1Score"]));
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


export interface F1_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
