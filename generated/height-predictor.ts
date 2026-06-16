// Auto-generated from height-predictor-schema.json
import * as z from 'zod';

export interface Height_predictorInput {
  fatherHeight: number;
  motherHeight: number;
  gender: number;
  correctionFactor: number;
}

export const Height_predictorInputSchema = z.object({
  fatherHeight: z.number().default(175),
  motherHeight: z.number().default(165),
  gender: z.number().default(0),
  correctionFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Height_predictorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fatherHeight + input.motherHeight) / 2; results["midParentalHeight"] = Number.isFinite(v) ? v : 0; } catch { results["midParentalHeight"] = 0; }
  try { const v = 13 * (2 * input.gender - 1) / 2; results["genderAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["genderAdjustment"] = 0; }
  try { const v = (input.fatherHeight + input.motherHeight + 13 * (2 * input.gender - 1)) / 2; results["genderAdjustedHeight"] = Number.isFinite(v) ? v : 0; } catch { results["genderAdjustedHeight"] = 0; }
  try { const v = ((input.fatherHeight + input.motherHeight + 13 * (2 * input.gender - 1)) / 2) * input.correctionFactor; results["predictedHeight"] = Number.isFinite(v) ? v : 0; } catch { results["predictedHeight"] = 0; }
  return results;
}


export function calculateHeight_predictor(input: Height_predictorInput): Height_predictorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["predictedHeight"] ?? 0;
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


export interface Height_predictorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
