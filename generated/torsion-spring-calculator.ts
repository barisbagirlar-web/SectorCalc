// Auto-generated from torsion-spring-calculator-schema.json
import * as z from 'zod';

export interface Torsion_spring_calculatorInput {
  wireDiameter: number;
  meanDiameter: number;
  activeCoils: number;
  deflectionAngle: number;
  shearModulus: number;
}

export const Torsion_spring_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(1),
  meanDiameter: z.number().default(10),
  activeCoils: z.number().default(5),
  deflectionAngle: z.number().default(30),
  shearModulus: z.number().default(79300),
});

function evaluateAllFormulas(input: Torsion_spring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.meanDiameter / input.wireDiameter; results["springIndex"] = Number.isFinite(v) ? v : 0; } catch { results["springIndex"] = 0; }
  try { const v = (input.shearModulus * input.wireDiameter**4) / (3667 * input.meanDiameter * input.activeCoils); results["springRate"] = Number.isFinite(v) ? v : 0; } catch { results["springRate"] = 0; }
  try { const v = (results["springRate"] ?? 0) * input.deflectionAngle; results["torque"] = Number.isFinite(v) ? v : 0; } catch { results["torque"] = 0; }
  try { const v = (32 * (results["torque"] ?? 0)) / (Math.PI * input.wireDiameter**3); results["uncorrectedStress"] = Number.isFinite(v) ? v : 0; } catch { results["uncorrectedStress"] = 0; }
  try { const v = (4 * (results["springIndex"] ?? 0)**2 - (results["springIndex"] ?? 0) - 1) / (4 * (results["springIndex"] ?? 0) * ((results["springIndex"] ?? 0) - 1)); results["wahlFactor"] = Number.isFinite(v) ? v : 0; } catch { results["wahlFactor"] = 0; }
  try { const v = (results["uncorrectedStress"] ?? 0) * (results["wahlFactor"] ?? 0); results["correctedStress"] = Number.isFinite(v) ? v : 0; } catch { results["correctedStress"] = 0; }
  return results;
}


export function calculateTorsion_spring_calculator(input: Torsion_spring_calculatorInput): Torsion_spring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["torque"] ?? 0;
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


export interface Torsion_spring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
