// Auto-generated from muscle-up-calculator-schema.json
import * as z from 'zod';

export interface Muscle_up_calculatorInput {
  loadKg: number;
  mechanicalAdvantage: number;
  frictionCoeff: number;
  pullAngle: number;
}

export const Muscle_up_calculatorInputSchema = z.object({
  loadKg: z.number().default(50),
  mechanicalAdvantage: z.number().default(2),
  frictionCoeff: z.number().default(0.05),
  pullAngle: z.number().default(10),
});

function evaluateAllFormulas(input: Muscle_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadKg * 9.81 / (input.mechanicalAdvantage * Math.cos(input.pullAngle * Math.PI / 180)); results["idealForce"] = Number.isFinite(v) ? v : 0; } catch { results["idealForce"] = 0; }
  try { const v = (results["idealForce"] ?? 0) * input.frictionCoeff; results["frictionAddedForce"] = Number.isFinite(v) ? v : 0; } catch { results["frictionAddedForce"] = 0; }
  try { const v = (results["idealForce"] ?? 0) + (results["frictionAddedForce"] ?? 0); results["actualForce"] = Number.isFinite(v) ? v : 0; } catch { results["actualForce"] = 0; }
  return results;
}


export function calculateMuscle_up_calculator(input: Muscle_up_calculatorInput): Muscle_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["actualForce"] ?? 0;
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


export interface Muscle_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
