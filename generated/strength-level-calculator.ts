// Auto-generated from strength-level-calculator-schema.json
import * as z from 'zod';

export interface Strength_level_calculatorInput {
  bodyWeight: number;
  liftWeight: number;
  reps: number;
  age: number;
  gender: number;
}

export const Strength_level_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(75),
  liftWeight: z.number().default(100),
  reps: z.number().default(5),
  age: z.number().default(30),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Strength_level_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.liftWeight*(1+input.reps/30); results["estimated1RM"] = Number.isFinite(v) ? v : 0; } catch { results["estimated1RM"] = 0; }
  try { const v = (input.liftWeight*(1+input.reps/30))/input.bodyWeight; results["relativeStrength"] = Number.isFinite(v) ? v : 0; } catch { results["relativeStrength"] = 0; }
  try { const v = input.gender===0?((input.liftWeight*(1+input.reps/30))/input.bodyWeight>=2?'Elite':(input.liftWeight*(1+input.reps/30))/input.bodyWeight>=1.5?'Advanced':(input.liftWeight*(1+input.reps/30))/input.bodyWeight>=1.25?'Intermediate':(input.liftWeight*(1+input.reps/30))/input.bodyWeight>=1?'Novice':'Beginner'):((input.liftWeight*(1+input.reps/30))/input.bodyWeight>=1.5?'Elite':(input.liftWeight*(1+input.reps/30))/input.bodyWeight>=1?'Advanced':(input.liftWeight*(1+input.reps/30))/input.bodyWeight>=0.75?'Intermediate':(input.liftWeight*(1+input.reps/30))/input.bodyWeight>=0.5?'Novice':'Beginner'); results["strengthLevel"] = Number.isFinite(v) ? v : 0; } catch { results["strengthLevel"] = 0; }
  return results;
}


export function calculateStrength_level_calculator(input: Strength_level_calculatorInput): Strength_level_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["strengthLevel"] ?? 0;
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


export interface Strength_level_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
