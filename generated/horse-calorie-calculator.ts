// Auto-generated from horse-calorie-calculator-schema.json
import * as z from 'zod';

export interface Horse_calorie_calculatorInput {
  bodyWeight: number;
  activityLevel: number;
  pregnancyStage: number;
  lactationStage: number;
  ageFactor: number;
}

export const Horse_calorie_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(500),
  activityLevel: z.number().default(1.2),
  pregnancyStage: z.number().default(1),
  lactationStage: z.number().default(1),
  ageFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Horse_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.4 + 0.03 * (input.bodyWeight * 2.20462); results["maintenanceDE"] = Number.isFinite(v) ? v : 0; } catch { results["maintenanceDE"] = 0; }
  try { const v = (results["maintenanceDE"] ?? 0) * input.activityLevel * input.pregnancyStage * input.lactationStage * input.ageFactor; results["totalDailyDE"] = Number.isFinite(v) ? v : 0; } catch { results["totalDailyDE"] = 0; }
  return results;
}


export function calculateHorse_calorie_calculator(input: Horse_calorie_calculatorInput): Horse_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDailyDE"] ?? 0;
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


export interface Horse_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
