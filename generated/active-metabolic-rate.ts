// Auto-generated from active-metabolic-rate-schema.json
import * as z from 'zod';

export interface Active_metabolic_rateInput {
  weight: number;
  height: number;
  age: number;
  sex: number;
  activityFactor: number;
}

export const Active_metabolic_rateInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  sex: z.number().default(1),
  activityFactor: z.number().default(1.55),
});

function evaluateAllFormulas(input: Active_metabolic_rateInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sex === 1 ? 10 * input.weight + 6.25 * input.height - 5 * input.age + 5 : 10 * input.weight + 6.25 * input.height - 5 * input.age - 161; results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityFactor; results["amr"] = Number.isFinite(v) ? v : 0; } catch { results["amr"] = 0; }
  return results;
}


export function calculateActive_metabolic_rate(input: Active_metabolic_rateInput): Active_metabolic_rateOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["amr"] ?? 0;
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


export interface Active_metabolic_rateOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
