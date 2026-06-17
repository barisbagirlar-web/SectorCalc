// @ts-nocheck
// Auto-generated from height-predictor-calculator-schema.json
import * as z from 'zod';

export interface Height_predictor_calculatorInput {
  motherHeight: number;
  fatherHeight: number;
  gender: number;
  currentHeight: number;
}

export const Height_predictor_calculatorInputSchema = z.object({
  motherHeight: z.number().default(165),
  fatherHeight: z.number().default(175),
  gender: z.number().default(0),
  currentHeight: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Height_predictor_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.gender * (input.motherHeight + 13 + input.fatherHeight) / 2 + (1 - input.gender) * (input.fatherHeight - 13 + input.motherHeight) / 2; results["midParentalHeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["midParentalHeight"] = 0; }
  try { const v = ((asFormulaNumber(results["midParentalHeight"])) + input.currentHeight) / 2; results["predictedHeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["predictedHeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHeight_predictor_calculator(input: Height_predictor_calculatorInput): Height_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["predictedHeight"]);
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


export interface Height_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
