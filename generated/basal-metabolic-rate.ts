// Auto-generated from basal-metabolic-rate-schema.json
import * as z from 'zod';

export interface Basal_metabolic_rateInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
}

export const Basal_metabolic_rateInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
});

function evaluateAllFormulas(input: Basal_metabolic_rateInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age; results["base"] = Number.isFinite(v) ? v : 0; } catch { results["base"] = 0; }
  try { const v = input.gender == 1 ? 5 : -161; results["gender_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["gender_adjustment"] = 0; }
  try { const v = (results["base"] ?? 0) + (results["gender_adjustment"] ?? 0); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  return results;
}


export function calculateBasal_metabolic_rate(input: Basal_metabolic_rateInput): Basal_metabolic_rateOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bmr"] ?? 0;
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


export interface Basal_metabolic_rateOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
