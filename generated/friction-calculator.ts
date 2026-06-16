// Auto-generated from friction-calculator-schema.json
import * as z from 'zod';

export interface Friction_calculatorInput {
  mass: number;
  angle: number;
  coeffStatic: number;
  coeffKinetic: number;
  gravity: number;
  safetyFactor: number;
}

export const Friction_calculatorInputSchema = z.object({
  mass: z.number().default(10),
  angle: z.number().default(0),
  coeffStatic: z.number().default(0.5),
  coeffKinetic: z.number().default(0.3),
  gravity: z.number().default(9.81),
  safetyFactor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Friction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass * input.gravity * Math.cos(input.angle * Math.PI / 180); results["normalForce"] = Number.isFinite(v) ? v : 0; } catch { results["normalForce"] = 0; }
  try { const v = input.coeffStatic * (input.mass * input.gravity * Math.cos(input.angle * Math.PI / 180)); results["maxStaticFriction"] = Number.isFinite(v) ? v : 0; } catch { results["maxStaticFriction"] = 0; }
  try { const v = input.coeffKinetic * (input.mass * input.gravity * Math.cos(input.angle * Math.PI / 180)); results["kineticFriction"] = Number.isFinite(v) ? v : 0; } catch { results["kineticFriction"] = 0; }
  try { const v = (input.coeffStatic * (input.mass * input.gravity * Math.cos(input.angle * Math.PI / 180))) * input.safetyFactor; results["designStaticFriction"] = Number.isFinite(v) ? v : 0; } catch { results["designStaticFriction"] = 0; }
  return results;
}


export function calculateFriction_calculator(input: Friction_calculatorInput): Friction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["kineticFriction"] ?? 0;
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


export interface Friction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
