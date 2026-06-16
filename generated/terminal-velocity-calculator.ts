// Auto-generated from terminal-velocity-calculator-schema.json
import * as z from 'zod';

export interface Terminal_velocity_calculatorInput {
  mass: number;
  crossSectionalArea: number;
  dragCoefficient: number;
  fluidDensity: number;
  gravity: number;
}

export const Terminal_velocity_calculatorInputSchema = z.object({
  mass: z.number().default(70),
  crossSectionalArea: z.number().default(0.7),
  dragCoefficient: z.number().default(1),
  fluidDensity: z.number().default(1.225),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Terminal_velocity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((2 * input.mass * input.gravity) / (input.fluidDensity * input.crossSectionalArea * input.dragCoefficient)); results["terminalVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["terminalVelocity"] = 0; }
  try { const v = (results["terminalVelocity"] ?? 0) * 3.6; results["terminalVelocityKmh"] = Number.isFinite(v) ? v : 0; } catch { results["terminalVelocityKmh"] = 0; }
  try { const v = (results["terminalVelocity"] ?? 0) * 2.23694; results["terminalVelocityMph"] = Number.isFinite(v) ? v : 0; } catch { results["terminalVelocityMph"] = 0; }
  return results;
}


export function calculateTerminal_velocity_calculator(input: Terminal_velocity_calculatorInput): Terminal_velocity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["terminalVelocity"] ?? 0;
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


export interface Terminal_velocity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
