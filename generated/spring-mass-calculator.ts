// Auto-generated from spring-mass-calculator-schema.json
import * as z from 'zod';

export interface Spring_mass_calculatorInput {
  springConstant: number;
  mass: number;
  initialDisplacement: number;
  initialVelocity: number;
}

export const Spring_mass_calculatorInputSchema = z.object({
  springConstant: z.number().default(100),
  mass: z.number().default(1),
  initialDisplacement: z.number().default(0.1),
  initialVelocity: z.number().default(0),
});

function evaluateAllFormulas(input: Spring_mass_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.springConstant/input.mass); results["angularFrequency"] = Number.isFinite(v) ? v : 0; } catch { results["angularFrequency"] = 0; }
  try { const v = Math.sqrt(input.springConstant/input.mass) / (2*Math.PI); results["naturalFrequency"] = Number.isFinite(v) ? v : 0; } catch { results["naturalFrequency"] = 0; }
  try { const v = 2*Math.PI * Math.sqrt(input.mass/input.springConstant); results["period"] = Number.isFinite(v) ? v : 0; } catch { results["period"] = 0; }
  try { const v = 0.5*input.springConstant*Math.pow(input.initialDisplacement,2) + 0.5*input.mass*Math.pow(input.initialVelocity,2); results["totalEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["totalEnergy"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.initialDisplacement,2) + Math.pow(input.initialVelocity/Math.sqrt(input.springConstant/input.mass),2)); results["maxDisplacement"] = Number.isFinite(v) ? v : 0; } catch { results["maxDisplacement"] = 0; }
  try { const v = Math.sqrt((input.springConstant/input.mass)*Math.pow(input.initialDisplacement,2) + Math.pow(input.initialVelocity,2)); results["maxVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["maxVelocity"] = 0; }
  try { const v = input.springConstant/input.mass * Math.sqrt(Math.pow(input.initialDisplacement,2) + Math.pow(input.initialVelocity/Math.sqrt(input.springConstant/input.mass),2)); results["maxAcceleration"] = Number.isFinite(v) ? v : 0; } catch { results["maxAcceleration"] = 0; }
  return results;
}


export function calculateSpring_mass_calculator(input: Spring_mass_calculatorInput): Spring_mass_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["naturalFrequency"] ?? 0;
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


export interface Spring_mass_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
