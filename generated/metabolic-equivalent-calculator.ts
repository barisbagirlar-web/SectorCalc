// Auto-generated from metabolic-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Metabolic_equivalent_calculatorInput {
  heartRate: number;
  restingHeartRate: number;
  age: number;
  vo2max: number;
  bodyWeight: number;
  gender: number;
}

export const Metabolic_equivalent_calculatorInputSchema = z.object({
  heartRate: z.number().default(120),
  restingHeartRate: z.number().default(70),
  age: z.number().default(30),
  vo2max: z.number().default(40),
  bodyWeight: z.number().default(70),
  gender: z.number().default(1),
});

function evaluateAllFormulas(input: Metabolic_equivalent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.vo2max * ((input.heartRate - input.restingHeartRate) / (( (input.gender == 1 ? 220 - input.age : 226 - input.age) ) - input.restingHeartRate))) / 3.5; results["metabolicEquivalent"] = Number.isFinite(v) ? v : 0; } catch { results["metabolicEquivalent"] = 0; }
  try { const v = input.vo2max * ((input.heartRate - input.restingHeartRate) / (( (input.gender == 1 ? 220 - input.age : 226 - input.age) ) - input.restingHeartRate)); results["relativeVO2"] = Number.isFinite(v) ? v : 0; } catch { results["relativeVO2"] = 0; }
  try { const v = ((input.vo2max * ((input.heartRate - input.restingHeartRate) / (( (input.gender == 1 ? 220 - input.age : 226 - input.age) ) - input.restingHeartRate))) / 3.5) * input.bodyWeight; results["energyExpenditure"] = Number.isFinite(v) ? v : 0; } catch { results["energyExpenditure"] = 0; }
  return results;
}


export function calculateMetabolic_equivalent_calculator(input: Metabolic_equivalent_calculatorInput): Metabolic_equivalent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["metabolicEquivalent"] ?? 0;
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


export interface Metabolic_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
