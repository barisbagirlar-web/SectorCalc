// Auto-generated from treadmill-calorie-calculator-schema.json
import * as z from 'zod';

export interface Treadmill_calorie_calculatorInput {
  weight: number;
  speed: number;
  incline: number;
  duration: number;
  exerciseType: number;
}

export const Treadmill_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  speed: z.number().default(8),
  incline: z.number().default(0),
  duration: z.number().default(30),
  exerciseType: z.number().default(0),
});

function evaluateAllFormulas(input: Treadmill_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed * 1000 / 60; results["speedMperMin"] = Number.isFinite(v) ? v : 0; } catch { results["speedMperMin"] = 0; }
  try { const v = input.incline / 100; results["grade"] = Number.isFinite(v) ? v : 0; } catch { results["grade"] = 0; }
  try { const v = 3.5 + 0.1 * (results["speedMperMin"] ?? 0) + 1.8 * (results["speedMperMin"] ?? 0) * (results["grade"] ?? 0); results["VO2walking"] = Number.isFinite(v) ? v : 0; } catch { results["VO2walking"] = 0; }
  try { const v = 3.5 + 0.2 * (results["speedMperMin"] ?? 0) + 0.9 * (results["speedMperMin"] ?? 0) * (results["grade"] ?? 0); results["VO2running"] = Number.isFinite(v) ? v : 0; } catch { results["VO2running"] = 0; }
  try { const v = (results["VO2walking"] ?? 0) / 3.5; results["MET_walking"] = Number.isFinite(v) ? v : 0; } catch { results["MET_walking"] = 0; }
  try { const v = (results["VO2running"] ?? 0) / 3.5; results["MET_running"] = Number.isFinite(v) ? v : 0; } catch { results["MET_running"] = 0; }
  try { const v = (1 - input.exerciseType) * (results["MET_walking"] ?? 0) + input.exerciseType * (results["MET_running"] ?? 0); results["MET"] = Number.isFinite(v) ? v : 0; } catch { results["MET"] = 0; }
  try { const v = (results["MET"] ?? 0) * input.weight * (input.duration / 60); results["calories"] = Number.isFinite(v) ? v : 0; } catch { results["calories"] = 0; }
  try { const v = input.speed * (input.duration / 60); results["distance"] = Number.isFinite(v) ? v : 0; } catch { results["distance"] = 0; }
  return results;
}


export function calculateTreadmill_calorie_calculator(input: Treadmill_calorie_calculatorInput): Treadmill_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calories"] ?? 0;
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


export interface Treadmill_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
