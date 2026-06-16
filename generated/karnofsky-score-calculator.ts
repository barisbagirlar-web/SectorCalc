// Auto-generated from karnofsky-score-calculator-schema.json
import * as z from 'zod';

export interface Karnofsky_score_calculatorInput {
  functionalCapacity: number;
  selfCare: number;
  diseaseSymptoms: number;
  nutritionalStatus: number;
  mentalStatus: number;
}

export const Karnofsky_score_calculatorInputSchema = z.object({
  functionalCapacity: z.number().default(5),
  selfCare: z.number().default(5),
  diseaseSymptoms: z.number().default(5),
  nutritionalStatus: z.number().default(5),
  mentalStatus: z.number().default(5),
});

function evaluateAllFormulas(input: Karnofsky_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.functionalCapacity + input.selfCare + input.diseaseSymptoms + input.nutritionalStatus + input.mentalStatus; results["rawScore"] = Number.isFinite(v) ? v : 0; } catch { results["rawScore"] = 0; }
  try { const v = (input.functionalCapacity + input.selfCare + input.diseaseSymptoms + input.nutritionalStatus + input.mentalStatus) * 2; results["adjustedScore"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedScore"] = 0; }
  try { const v = Math.min(100, Math.max(0, Math.round((input.functionalCapacity + input.selfCare + input.diseaseSymptoms + input.nutritionalStatus + input.mentalStatus) * 2))); results["karnofskyScore"] = Number.isFinite(v) ? v : 0; } catch { results["karnofskyScore"] = 0; }
  return results;
}


export function calculateKarnofsky_score_calculator(input: Karnofsky_score_calculatorInput): Karnofsky_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["karnofskyScore"] ?? 0;
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


export interface Karnofsky_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
