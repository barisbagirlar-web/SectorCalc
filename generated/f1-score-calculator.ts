// @ts-nocheck
// Auto-generated from f1-score-calculator-schema.json
import * as z from 'zod';

export interface F1_score_calculatorInput {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
}

export const F1_score_calculatorInputSchema = z.object({
  truePositives: z.number().default(50),
  falsePositives: z.number().default(10),
  falseNegatives: z.number().default(5),
  trueNegatives: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: F1_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.truePositives / (input.truePositives + input.falsePositives); results["precision"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["precision"] = 0; }
  try { const v = input.truePositives / (input.truePositives + input.falseNegatives); results["recall"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recall"] = 0; }
  try { const v = 2 * input.truePositives / (2 * input.truePositives + input.falsePositives + input.falseNegatives); results["f1Score"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["f1Score"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateF1_score_calculator(input: F1_score_calculatorInput): F1_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["f1Score"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
