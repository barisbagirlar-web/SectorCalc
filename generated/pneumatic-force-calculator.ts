// Auto-generated from pneumatic-force-calculator-schema.json
import * as z from 'zod';

export interface Pneumatic_force_calculatorInput {
  systemPressure: number;
  boreDiameter: number;
  rodDiameter: number;
  cylinderCount: number;
  safetyFactor: number;
  efficiency: number;
}

export const Pneumatic_force_calculatorInputSchema = z.object({
  systemPressure: z.number().default(6),
  boreDiameter: z.number().default(50),
  rodDiameter: z.number().default(25),
  cylinderCount: z.number().default(1),
  safetyFactor: z.number().default(1.5),
  efficiency: z.number().default(0.9),
});

function evaluateAllFormulas(input: Pneumatic_force_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.systemPressure * Math.PI * Math.pow(input.boreDiameter, 2) / 40 * input.efficiency * input.cylinderCount; results["pushForce"] = Number.isFinite(v) ? v : 0; } catch { results["pushForce"] = 0; }
  try { const v = input.systemPressure * Math.PI * (Math.pow(input.boreDiameter, 2) - Math.pow(input.rodDiameter, 2)) / 40 * input.efficiency * input.cylinderCount; results["pullForce"] = Number.isFinite(v) ? v : 0; } catch { results["pullForce"] = 0; }
  try { const v = (results["pushForce"] ?? 0) / input.safetyFactor; results["effectivePushForce"] = Number.isFinite(v) ? v : 0; } catch { results["effectivePushForce"] = 0; }
  return results;
}


export function calculatePneumatic_force_calculator(input: Pneumatic_force_calculatorInput): Pneumatic_force_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectivePushForce"] ?? 0;
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


export interface Pneumatic_force_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
