// Auto-generated from rocket-equation-calculator-schema.json
import * as z from 'zod';

export interface Rocket_equation_calculatorInput {
  initialMass: number;
  finalMass: number;
  specificImpulse: number;
  gravity: number;
}

export const Rocket_equation_calculatorInputSchema = z.object({
  initialMass: z.number().default(1000),
  finalMass: z.number().default(100),
  specificImpulse: z.number().default(300),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Rocket_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.specificImpulse * input.gravity; results["exhaustVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["exhaustVelocity"] = 0; }
  try { const v = input.initialMass / input.finalMass; results["massRatio"] = Number.isFinite(v) ? v : 0; } catch { results["massRatio"] = 0; }
  try { const v = input.initialMass - input.finalMass; results["propellantMass"] = Number.isFinite(v) ? v : 0; } catch { results["propellantMass"] = 0; }
  try { const v = input.specificImpulse * input.gravity * Math.log(input.initialMass / input.finalMass); results["deltaV"] = Number.isFinite(v) ? v : 0; } catch { results["deltaV"] = 0; }
  return results;
}


export function calculateRocket_equation_calculator(input: Rocket_equation_calculatorInput): Rocket_equation_calculatorOutput {
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


export interface Rocket_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
