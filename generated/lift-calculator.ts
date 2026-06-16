// Auto-generated from lift-calculator-schema.json
import * as z from 'zod';

export interface Lift_calculatorInput {
  loadMass: number;
  carMass: number;
  acceleration: number;
  counterweightRatio: number;
  frictionForce: number;
  safetyFactor: number;
}

export const Lift_calculatorInputSchema = z.object({
  loadMass: z.number().default(1000),
  carMass: z.number().default(500),
  acceleration: z.number().default(1.5),
  counterweightRatio: z.number().default(0.5),
  frictionForce: z.number().default(200),
  safetyFactor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Lift_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.counterweightRatio * (input.carMass + input.loadMass); results["counterweightMass"] = Number.isFinite(v) ? v : 0; } catch { results["counterweightMass"] = 0; }
  try { const v = (input.carMass + input.loadMass - (results["counterweightMass"] ?? 0)) * 9.81; results["gravitationalForce"] = Number.isFinite(v) ? v : 0; } catch { results["gravitationalForce"] = 0; }
  try { const v = (input.carMass + input.loadMass + (results["counterweightMass"] ?? 0)) * input.acceleration; results["inertialForce"] = Number.isFinite(v) ? v : 0; } catch { results["inertialForce"] = 0; }
  try { const v = (results["gravitationalForce"] ?? 0) + (results["inertialForce"] ?? 0) + input.frictionForce; results["totalForce"] = Number.isFinite(v) ? v : 0; } catch { results["totalForce"] = 0; }
  try { const v = (results["totalForce"] ?? 0) * input.safetyFactor; results["requiredForce"] = Number.isFinite(v) ? v : 0; } catch { results["requiredForce"] = 0; }
  return results;
}


export function calculateLift_calculator(input: Lift_calculatorInput): Lift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredForce"] ?? 0;
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


export interface Lift_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
