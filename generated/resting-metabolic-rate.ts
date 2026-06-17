// Auto-generated from resting-metabolic-rate-schema.json
import * as z from 'zod';

export interface Resting_metabolic_rateInput {
  gender: number;
  weight: number;
  height: number;
  age: number;
}

export const Resting_metabolic_rateInputSchema = z.object({
  gender: z.number().default(0),
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
});

function evaluateAllFormulas(input: Resting_metabolic_rateInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (10 * input.weight) + (6.25 * input.height) - (5 * input.age) - (input.gender === 0 ? 5 : 161); results["rmr"] = Number.isFinite(v) ? v : 0; } catch { results["rmr"] = 0; }
  return results;
}


export function calculateResting_metabolic_rate(input: Resting_metabolic_rateInput): Resting_metabolic_rateOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rmr"] ?? 0;
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


export interface Resting_metabolic_rateOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
