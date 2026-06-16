// Auto-generated from basal-metabolic-rate-schema.json
import * as z from 'zod';

export interface Basal_metabolic_rateInput {
  gender: number;
  weight: number;
  height: number;
  age: number;
}

export const Basal_metabolic_rateInputSchema = z.object({
  gender: z.number().default(0),
  weight: z.number().default(70),
  height: z.number().default(175),
  age: z.number().default(30),
});

function evaluateAllFormulas(input: Basal_metabolic_rateInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5; results["bmrMale"] = Number.isFinite(v) ? v : 0; } catch { results["bmrMale"] = 0; }
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161; results["bmrFemale"] = Number.isFinite(v) ? v : 0; } catch { results["bmrFemale"] = 0; }
  try { const v = input.gender === 0 ? (results["bmrMale"] ?? 0) : (results["bmrFemale"] ?? 0); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
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
