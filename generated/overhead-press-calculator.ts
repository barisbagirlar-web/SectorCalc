// Auto-generated from overhead-press-calculator-schema.json
import * as z from 'zod';

export interface Overhead_press_calculatorInput {
  boreDiameter: number;
  pressure: number;
  efficiency: number;
  safetyFactor: number;
}

export const Overhead_press_calculatorInputSchema = z.object({
  boreDiameter: z.number().default(100),
  pressure: z.number().default(200),
  efficiency: z.number().default(95),
  safetyFactor: z.number().default(1.5),
});

function evaluateAllFormulas(input: Overhead_press_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.boreDiameter/1000, 2) / 4; results["cylinderArea_m2"] = Number.isFinite(v) ? v : 0; } catch { results["cylinderArea_m2"] = 0; }
  try { const v = input.pressure * 100 * (results["cylinderArea_m2"] ?? 0); results["theoreticalForce_kN"] = Number.isFinite(v) ? v : 0; } catch { results["theoreticalForce_kN"] = 0; }
  try { const v = (results["theoreticalForce_kN"] ?? 0) * (input.efficiency / 100); results["actualForce_kN"] = Number.isFinite(v) ? v : 0; } catch { results["actualForce_kN"] = 0; }
  try { const v = (results["actualForce_kN"] ?? 0) / input.safetyFactor; results["safeWorkingForce_kN"] = Number.isFinite(v) ? v : 0; } catch { results["safeWorkingForce_kN"] = 0; }
  return results;
}


export function calculateOverhead_press_calculator(input: Overhead_press_calculatorInput): Overhead_press_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safeWorkingForce_kN"] ?? 0;
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


export interface Overhead_press_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
