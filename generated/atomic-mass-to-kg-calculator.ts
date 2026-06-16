// Auto-generated from atomic-mass-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Atomic_mass_to_kg_calculatorInput {
  atomicMassU: number;
  numberOfEntities: number;
  conversionFactor: number;
  batchSize: number;
  outputUnitMultiplier: number;
}

export const Atomic_mass_to_kg_calculatorInputSchema = z.object({
  atomicMassU: z.number().default(1),
  numberOfEntities: z.number().default(6.02214076e+23),
  conversionFactor: z.number().default(1.6605390666e-27),
  batchSize: z.number().default(1),
  outputUnitMultiplier: z.number().default(1),
});

function evaluateAllFormulas(input: Atomic_mass_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.atomicMassU * input.numberOfEntities * input.conversionFactor * input.batchSize; results["mass_Kg"] = Number.isFinite(v) ? v : 0; } catch { results["mass_Kg"] = 0; }
  try { const v = input.atomicMassU * input.numberOfEntities * input.conversionFactor * input.batchSize * 1000; results["mass_Grams"] = Number.isFinite(v) ? v : 0; } catch { results["mass_Grams"] = 0; }
  try { const v = input.numberOfEntities / 602214076000000000000000; results["numberOfMoles"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfMoles"] = 0; }
  try { const v = input.atomicMassU * input.numberOfEntities * input.conversionFactor * input.batchSize * input.outputUnitMultiplier; results["totalMass"] = Number.isFinite(v) ? v : 0; } catch { results["totalMass"] = 0; }
  return results;
}


export function calculateAtomic_mass_to_kg_calculator(input: Atomic_mass_to_kg_calculatorInput): Atomic_mass_to_kg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMass"] ?? 0;
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


export interface Atomic_mass_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
