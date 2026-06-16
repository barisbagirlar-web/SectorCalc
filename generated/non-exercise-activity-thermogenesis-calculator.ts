// Auto-generated from non-exercise-activity-thermogenesis-calculator-schema.json
import * as z from 'zod';

export interface Non_exercise_activity_thermogenesis_calculatorInput {
  tdee: number;
  bmr: number;
  tef: number;
  exercise: number;
}

export const Non_exercise_activity_thermogenesis_calculatorInputSchema = z.object({
  tdee: z.number().default(2000),
  bmr: z.number().default(1500),
  tef: z.number().default(200),
  exercise: z.number().default(150),
});

function evaluateAllFormulas(input: Non_exercise_activity_thermogenesis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tdee - input.bmr - input.tef - input.exercise; results["neat"] = Number.isFinite(v) ? v : 0; } catch { results["neat"] = 0; }
  try { const v = ((results["neat"] ?? 0) / input.tdee) * 100; results["neatPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["neatPercentage"] = 0; }
  return results;
}


export function calculateNon_exercise_activity_thermogenesis_calculator(input: Non_exercise_activity_thermogenesis_calculatorInput): Non_exercise_activity_thermogenesis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["neat"] ?? 0;
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


export interface Non_exercise_activity_thermogenesis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
