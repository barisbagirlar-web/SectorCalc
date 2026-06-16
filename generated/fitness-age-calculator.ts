// Auto-generated from fitness-age-calculator-schema.json
import * as z from 'zod';

export interface Fitness_age_calculatorInput {
  age: number;
  restingHeartRate: number;
  gender: number;
  maxHeartRate: number;
}

export const Fitness_age_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(70),
  gender: z.number().default(0),
  maxHeartRate: z.number().default(0),
});

function evaluateAllFormulas(input: Fitness_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxHeartRate !== 0 ? input.maxHeartRate : 208 - 0.7 * input.age; results["maxHeartRateEstimated"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeartRateEstimated"] = 0; }
  try { const v = 15.3 * ((results["maxHeartRateEstimated"] ?? 0) / input.restingHeartRate); results["vo2max"] = Number.isFinite(v) ? v : 0; } catch { results["vo2max"] = 0; }
  try { const v = input.gender === 0 ? (50.0 - 0.35 * input.age) : (43.0 - 0.30 * input.age); results["averageVO2max"] = Number.isFinite(v) ? v : 0; } catch { results["averageVO2max"] = 0; }
  try { const v = input.age + ((results["averageVO2max"] ?? 0) - (results["vo2max"] ?? 0)) / 0.35; results["fitnessAge"] = Number.isFinite(v) ? v : 0; } catch { results["fitnessAge"] = 0; }
  return results;
}


export function calculateFitness_age_calculator(input: Fitness_age_calculatorInput): Fitness_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fitnessAge"] ?? 0;
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


export interface Fitness_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
