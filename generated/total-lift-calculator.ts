// Auto-generated from total-lift-calculator-schema.json
import * as z from 'zod';

export interface Total_lift_calculatorInput {
  loadMass: number;
  gravity: number;
  safetyFactor: number;
  additionalLoad: number;
  liftAcceleration: number;
  frictionCoefficient: number;
}

export const Total_lift_calculatorInputSchema = z.object({
  loadMass: z.number().default(1000),
  gravity: z.number().default(9.81),
  safetyFactor: z.number().default(1.5),
  additionalLoad: z.number().default(100),
  liftAcceleration: z.number().default(0.5),
  frictionCoefficient: z.number().default(0.05),
});

function evaluateAllFormulas(input: Total_lift_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loadMass + input.additionalLoad) * input.gravity; results["netWeight"] = Number.isFinite(v) ? v : 0; } catch { results["netWeight"] = 0; }
  try { const v = (input.loadMass + input.additionalLoad) * (input.gravity + input.liftAcceleration); results["dynamicForce"] = Number.isFinite(v) ? v : 0; } catch { results["dynamicForce"] = 0; }
  try { const v = (results["dynamicForce"] ?? 0) * (1 + input.frictionCoefficient) * input.safetyFactor; results["totalLiftForce"] = Number.isFinite(v) ? v : 0; } catch { results["totalLiftForce"] = 0; }
  return results;
}


export function calculateTotal_lift_calculator(input: Total_lift_calculatorInput): Total_lift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalLiftForce"] ?? 0;
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


export interface Total_lift_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
