// Auto-generated from powerlifting-total-calculator-schema.json
import * as z from 'zod';

export interface Powerlifting_total_calculatorInput {
  squat: number;
  benchPress: number;
  deadlift: number;
  bodyWeight: number;
}

export const Powerlifting_total_calculatorInputSchema = z.object({
  squat: z.number().default(0),
  benchPress: z.number().default(0),
  deadlift: z.number().default(0),
  bodyWeight: z.number().default(0),
});

function evaluateAllFormulas(input: Powerlifting_total_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.squat + input.benchPress + input.deadlift; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.squat; results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  try { const v = input.squat; results["squat"] = Number.isFinite(v) ? v : 0; } catch { results["squat"] = 0; }
  try { const v = input.benchPress; results["benchPress"] = Number.isFinite(v) ? v : 0; } catch { results["benchPress"] = 0; }
  try { const v = input.deadlift; results["deadlift"] = Number.isFinite(v) ? v : 0; } catch { results["deadlift"] = 0; }
  try { const v = relativeTotal; results["relativeTotal"] = Number.isFinite(v) ? v : 0; } catch { results["relativeTotal"] = 0; }
  return results;
}


export function calculatePowerlifting_total_calculator(input: Powerlifting_total_calculatorInput): Powerlifting_total_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Powerlifting_total_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
