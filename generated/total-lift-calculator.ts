// Auto-generated from total-lift-calculator-schema.json
import * as z from 'zod';

export interface Total_lift_calculatorInput {
  loadMass: number;
  safetyFactor: number;
  liftPoints: number;
  angleFromVertical: number;
  dynamicFactor: number;
  gravity: number;
}

export const Total_lift_calculatorInputSchema = z.object({
  loadMass: z.number().default(1000),
  safetyFactor: z.number().default(1.5),
  liftPoints: z.number().default(1),
  angleFromVertical: z.number().default(0),
  dynamicFactor: z.number().default(1.1),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Total_lift_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadMass * input.gravity * input.safetyFactor; results["staticLoadForce"] = Number.isFinite(v) ? v : 0; } catch { results["staticLoadForce"] = 0; }
  try { const v = (results["staticLoadForce"] ?? 0) * input.dynamicFactor; results["dynamicTotalForce"] = Number.isFinite(v) ? v : 0; } catch { results["dynamicTotalForce"] = 0; }
  try { const v = 1 / Math.cos(input.angleFromVertical * Math.PI / 180); results["angleFactor"] = Number.isFinite(v) ? v : 0; } catch { results["angleFactor"] = 0; }
  try { const v = 1 / input.liftPoints; results["pointsFactor"] = Number.isFinite(v) ? v : 0; } catch { results["pointsFactor"] = 0; }
  try { const v = (results["dynamicTotalForce"] ?? 0) * (results["angleFactor"] ?? 0) * (results["pointsFactor"] ?? 0); results["requiredLiftForce"] = Number.isFinite(v) ? v : 0; } catch { results["requiredLiftForce"] = 0; }
  return results;
}


export function calculateTotal_lift_calculator(input: Total_lift_calculatorInput): Total_lift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredLiftForce"] ?? 0;
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
