// Auto-generated from rocket-propulsion-calculator-schema.json
import * as z from 'zod';

export interface Rocket_propulsion_calculatorInput {
  initialMass: number;
  finalMass: number;
  specificImpulse: number;
  gravitationalAcceleration: number;
  massFlowRate: number;
}

export const Rocket_propulsion_calculatorInputSchema = z.object({
  initialMass: z.number().default(50000),
  finalMass: z.number().default(10000),
  specificImpulse: z.number().default(300),
  gravitationalAcceleration: z.number().default(9.81),
  massFlowRate: z.number().default(500),
});

function evaluateAllFormulas(input: Rocket_propulsion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialMass - input.finalMass; results["propellantMass"] = Number.isFinite(v) ? v : 0; } catch { results["propellantMass"] = 0; }
  try { const v = input.initialMass / input.finalMass; results["massRatio"] = Number.isFinite(v) ? v : 0; } catch { results["massRatio"] = 0; }
  try { const v = input.specificImpulse * input.gravitationalAcceleration; results["exhaustVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["exhaustVelocity"] = 0; }
  try { const v = (results["exhaustVelocity"] ?? 0) * Math.log((results["massRatio"] ?? 0)); results["deltaV"] = Number.isFinite(v) ? v : 0; } catch { results["deltaV"] = 0; }
  try { const v = input.massFlowRate * (results["exhaustVelocity"] ?? 0); results["thrust"] = Number.isFinite(v) ? v : 0; } catch { results["thrust"] = 0; }
  try { const v = (results["propellantMass"] ?? 0) / input.massFlowRate; results["burnTime"] = Number.isFinite(v) ? v : 0; } catch { results["burnTime"] = 0; }
  return results;
}


export function calculateRocket_propulsion_calculator(input: Rocket_propulsion_calculatorInput): Rocket_propulsion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["deltaV"] ?? 0;
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


export interface Rocket_propulsion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
