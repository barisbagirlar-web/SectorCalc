// Auto-generated from sofa-score-calculator-schema.json
import * as z from 'zod';

export interface Sofa_score_calculatorInput {
  respScore: number;
  coagScore: number;
  liverScore: number;
  cvScore: number;
  cnsScore: number;
  renalScore: number;
}

export const Sofa_score_calculatorInputSchema = z.object({
  respScore: z.number().default(0),
  coagScore: z.number().default(0),
  liverScore: z.number().default(0),
  cvScore: z.number().default(0),
  cnsScore: z.number().default(0),
  renalScore: z.number().default(0),
});

function evaluateAllFormulas(input: Sofa_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.respScore + input.coagScore + input.liverScore + input.cvScore + input.cnsScore + input.renalScore; results["totalSOFA"] = Number.isFinite(v) ? v : 0; } catch { results["totalSOFA"] = 0; }
  return results;
}


export function calculateSofa_score_calculator(input: Sofa_score_calculatorInput): Sofa_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSOFA"] ?? 0;
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


export interface Sofa_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
