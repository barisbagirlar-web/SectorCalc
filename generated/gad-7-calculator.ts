// Auto-generated from gad-7-calculator-schema.json
import * as z from 'zod';

export interface Gad_7_calculatorInput {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
}

export const Gad_7_calculatorInputSchema = z.object({
  q1: z.number().default(0),
  q2: z.number().default(0),
  q3: z.number().default(0),
  q4: z.number().default(0),
  q5: z.number().default(0),
  q6: z.number().default(0),
  q7: z.number().default(0),
});

function evaluateAllFormulas(input: Gad_7_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.q1 + input.q2 + input.q3 + input.q4 + input.q5 + input.q6 + input.q7; results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  results["0_4_minimal_anxiety__5_9_mild_anxiety__1"] = 0;
  return results;
}


export function calculateGad_7_calculator(input: Gad_7_calculatorInput): Gad_7_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
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


export interface Gad_7_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
