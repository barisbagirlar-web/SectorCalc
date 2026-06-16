// Auto-generated from subjective-well-being-calculator-schema.json
import * as z from 'zod';

export interface Subjective_well_being_calculatorInput {
  physical: number;
  mental: number;
  social: number;
  emotional: number;
  spiritual: number;
}

export const Subjective_well_being_calculatorInputSchema = z.object({
  physical: z.number().default(5),
  mental: z.number().default(5),
  social: z.number().default(5),
  emotional: z.number().default(5),
  spiritual: z.number().default(5),
});

function evaluateAllFormulas(input: Subjective_well_being_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.physical + input.mental + input.social + input.emotional + input.spiritual) / 5; results["overallScore"] = Number.isFinite(v) ? v : 0; } catch { results["overallScore"] = 0; }
  return results;
}


export function calculateSubjective_well_being_calculator(input: Subjective_well_being_calculatorInput): Subjective_well_being_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallScore"] ?? 0;
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


export interface Subjective_well_being_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
