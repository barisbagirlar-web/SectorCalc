// Auto-generated from cylinder-force-calculator-schema.json
import * as z from 'zod';

export interface Cylinder_force_calculatorInput {
  boreDiameter: number;
  rodDiameter: number;
  pressure: number;
  efficiency: number;
}

export const Cylinder_force_calculatorInputSchema = z.object({
  boreDiameter: z.number().default(50),
  rodDiameter: z.number().default(20),
  pressure: z.number().default(100),
  efficiency: z.number().default(95),
});

function evaluateAllFormulas(input: Cylinder_force_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.boreDiameter / 2) ** 2; results["areaBore"] = Number.isFinite(v) ? v : 0; } catch { results["areaBore"] = 0; }
  try { const v = Math.PI * (input.rodDiameter / 2) ** 2; results["areaRod"] = Number.isFinite(v) ? v : 0; } catch { results["areaRod"] = 0; }
  try { const v = (results["areaBore"] ?? 0) - (results["areaRod"] ?? 0); results["areaAnnulus"] = Number.isFinite(v) ? v : 0; } catch { results["areaAnnulus"] = 0; }
  try { const v = input.pressure * 0.1; results["pressureNmm2"] = Number.isFinite(v) ? v : 0; } catch { results["pressureNmm2"] = 0; }
  try { const v = input.efficiency / 100; results["efficiencyFraction"] = Number.isFinite(v) ? v : 0; } catch { results["efficiencyFraction"] = 0; }
  try { const v = (results["pressureNmm2"] ?? 0) * (results["areaBore"] ?? 0) * (results["efficiencyFraction"] ?? 0); results["forceExtension_N"] = Number.isFinite(v) ? v : 0; } catch { results["forceExtension_N"] = 0; }
  try { const v = (results["pressureNmm2"] ?? 0) * (results["areaAnnulus"] ?? 0) * (results["efficiencyFraction"] ?? 0); results["forceRetraction_N"] = Number.isFinite(v) ? v : 0; } catch { results["forceRetraction_N"] = 0; }
  try { const v = (results["forceExtension_N"] ?? 0) / 1000; results["forceExtension_kN"] = Number.isFinite(v) ? v : 0; } catch { results["forceExtension_kN"] = 0; }
  try { const v = (results["forceRetraction_N"] ?? 0) / 1000; results["forceRetraction_kN"] = Number.isFinite(v) ? v : 0; } catch { results["forceRetraction_kN"] = 0; }
  return results;
}


export function calculateCylinder_force_calculator(input: Cylinder_force_calculatorInput): Cylinder_force_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["forceExtension_kN"] ?? 0;
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


export interface Cylinder_force_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
