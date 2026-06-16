// Auto-generated from tension-calculator-schema.json
import * as z from 'zod';

export interface Tension_calculatorInput {
  mass: number;
  gravity: number;
  angle: number;
  numberOfRopes: number;
  safetyFactor: number;
}

export const Tension_calculatorInputSchema = z.object({
  mass: z.number().default(100),
  gravity: z.number().default(9.81),
  angle: z.number().default(45),
  numberOfRopes: z.number().default(2),
  safetyFactor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mass * input.gravity) / (input.numberOfRopes * Math.sin(input.angle * Math.PI / 180)); results["tensionPerRope"] = Number.isFinite(v) ? v : 0; } catch { results["tensionPerRope"] = 0; }
  try { const v = (results["tensionPerRope"] ?? 0) * input.safetyFactor; results["tensionWithSafety"] = Number.isFinite(v) ? v : 0; } catch { results["tensionWithSafety"] = 0; }
  return results;
}


export function calculateTension_calculator(input: Tension_calculatorInput): Tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tensionWithSafety"] ?? 0;
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


export interface Tension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
