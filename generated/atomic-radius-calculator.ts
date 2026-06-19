// Auto-generated from atomic-radius-calculator-schema.json
import * as z from 'zod';

export interface Atomic_radius_calculatorInput {
  density: number;
  molarMass: number;
  structureType: number;
  manualPackingFactor: number;
  dataConfidence?: number;
}

export const Atomic_radius_calculatorInputSchema = z.object({
  density: z.number().default(7.87),
  molarMass: z.number().default(55.845),
  structureType: z.number().default(2),
  manualPackingFactor: z.number().default(0.74),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Atomic_radius_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 6.02214076e+23; results["avogadro"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["avogadro"] = 0; }
  try { const v = input.molarMass / (input.density * (asFormulaNumber(results["avogadro"]))); results["volumePerAtom"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumePerAtom"] = 0; }
  try { const v = input.structureType == 0 ? input.manualPackingFactor : (input.structureType == 1 ? 0.52 : input.structureType == 2 ? 0.68 : input.structureType == 3 ? 0.74 : 0.74); results["packingFactorUsed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["packingFactorUsed"] = 0; }
  try { const v = (asFormulaNumber(results["packingFactorUsed"])) * (asFormulaNumber(results["volumePerAtom"])); results["atomicVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["atomicVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAtomic_radius_calculator(input: Atomic_radius_calculatorInput): Atomic_radius_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["atomicVolume"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
