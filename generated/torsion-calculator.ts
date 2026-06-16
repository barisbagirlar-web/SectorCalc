// Auto-generated from torsion-calculator-schema.json
import * as z from 'zod';

export interface Torsion_calculatorInput {
  torque: number;
  length: number;
  shearModulus: number;
  diameter: number;
  innerDiameter: number;
}

export const Torsion_calculatorInputSchema = z.object({
  torque: z.number().default(100),
  length: z.number().default(1),
  shearModulus: z.number().default(80000000000),
  diameter: z.number().default(0.05),
  innerDiameter: z.number().default(0),
});

function evaluateAllFormulas(input: Torsion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.PI / 32) * (Math.pow(input.diameter, 4) - Math.pow(input.innerDiameter, 4)); results["polarMomentInertia"] = Number.isFinite(v) ? v : 0; } catch { results["polarMomentInertia"] = 0; }
  try { const v = (input.torque * (input.diameter / 2)) / (results["polarMomentInertia"] ?? 0); results["maxShearStress"] = Number.isFinite(v) ? v : 0; } catch { results["maxShearStress"] = 0; }
  try { const v = (input.torque * input.length) / (input.shearModulus * (results["polarMomentInertia"] ?? 0)); results["angleOfTwist"] = Number.isFinite(v) ? v : 0; } catch { results["angleOfTwist"] = 0; }
  return results;
}


export function calculateTorsion_calculator(input: Torsion_calculatorInput): Torsion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxShearStress"] ?? 0;
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


export interface Torsion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
