// Auto-generated from atomic-radius-calculator-schema.json
import * as z from 'zod';

export interface Atomic_radius_calculatorInput {
  density: number;
  molarMass: number;
  structureType: number;
  manualPackingFactor: number;
}

export const Atomic_radius_calculatorInputSchema = z.object({
  density: z.number().default(7.87),
  molarMass: z.number().default(55.845),
  structureType: z.number().default(2),
  manualPackingFactor: z.number().default(0.74),
});

function evaluateAllFormulas(input: Atomic_radius_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.molarMass / (input.density * avogadro); results["volumePerAtom"] = Number.isFinite(v) ? v : 0; } catch { results["volumePerAtom"] = 0; }
  try { const v = input.structureType == 0 ? input.manualPackingFactor : (input.structureType == 1 ? 0.52 : input.structureType == 2 ? 0.68 : input.structureType == 3 ? 0.74 : 0.74); results["packingFactorUsed"] = Number.isFinite(v) ? v : 0; } catch { results["packingFactorUsed"] = 0; }
  try { const v = (results["packingFactorUsed"] ?? 0) * (results["volumePerAtom"] ?? 0); results["atomicVolume"] = Number.isFinite(v) ? v : 0; } catch { results["atomicVolume"] = 0; }
  try { const v = Math.pow(3 * (results["atomicVolume"] ?? 0) / (4 * Math.PI), 1/3); results["atomicRadiusCm"] = Number.isFinite(v) ? v : 0; } catch { results["atomicRadiusCm"] = 0; }
  try { const v = (results["atomicRadiusCm"] ?? 0) * 1e10; results["atomicRadius"] = Number.isFinite(v) ? v : 0; } catch { results["atomicRadius"] = 0; }
  return results;
}


export function calculateAtomic_radius_calculator(input: Atomic_radius_calculatorInput): Atomic_radius_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["atomicRadius"] ?? 0;
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


export interface Atomic_radius_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
