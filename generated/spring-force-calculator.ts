// Auto-generated from spring-force-calculator-schema.json
import * as z from 'zod';

export interface Spring_force_calculatorInput {
  springConstant: number;
  displacement: number;
  wireDiameter: number;
  coilDiameter: number;
  activeCoils: number;
  shearModulus: number;
}

export const Spring_force_calculatorInputSchema = z.object({
  springConstant: z.number().default(0),
  displacement: z.number().default(10),
  wireDiameter: z.number().default(2),
  coilDiameter: z.number().default(20),
  activeCoils: z.number().default(10),
  shearModulus: z.number().default(80000),
});

function evaluateAllFormulas(input: Spring_force_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.springConstant > 0 ? input.springConstant : (input.shearModulus * Math.pow(input.wireDiameter, 4)) / (8 * Math.pow(input.coilDiameter, 3) * input.activeCoils)) * input.displacement; results["force"] = Number.isFinite(v) ? v : 0; } catch { results["force"] = 0; }
  try { const v = input.springConstant > 0 ? input.springConstant : (input.shearModulus * Math.pow(input.wireDiameter, 4)) / (8 * Math.pow(input.coilDiameter, 3) * input.activeCoils); results["effectiveSpringConstant"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveSpringConstant"] = 0; }
  return results;
}


export function calculateSpring_force_calculator(input: Spring_force_calculatorInput): Spring_force_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["force"] ?? 0;
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


export interface Spring_force_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
