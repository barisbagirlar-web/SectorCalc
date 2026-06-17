// Auto-generated from vo2-max-by-age-calculator-schema.json
import * as z from 'zod';

export interface Vo2_max_by_age_calculatorInput {
  age: number;
  weight: number;
  gender: number;
  walkTime: number;
  heartRate: number;
}

export const Vo2_max_by_age_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  gender: z.number().default(1),
  walkTime: z.number().default(12),
  heartRate: z.number().default(140),
});

function evaluateAllFormulas(input: Vo2_max_by_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 132.853 - 0.0769 * input.weight - 0.3877 * input.age + 6.315 * input.gender - 3.2649 * input.walkTime - 0.1565 * input.heartRate; results["vo2max"] = Number.isFinite(v) ? v : 0; } catch { results["vo2max"] = 0; }
  try { const v = 132.853 - 0.0769 * input.weight - 0.3877 * input.age + 6.315 * input.gender - 3.2649 * input.walkTime - 0.1565 * input.heartRate; results["132_853___0_0769___weight___0_3877___age"] = Number.isFinite(v) ? v : 0; } catch { results["132_853___0_0769___weight___0_3877___age"] = 0; }
  results["Compare_result_with_normative_values_bas"] = 0;
  try { const v = VO2max (ml/kg/min); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateVo2_max_by_age_calculator(input: Vo2_max_by_age_calculatorInput): Vo2_max_by_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Vo2_max_by_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
