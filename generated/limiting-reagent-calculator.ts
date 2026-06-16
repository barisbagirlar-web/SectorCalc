// Auto-generated from limiting-reagent-calculator-schema.json
import * as z from 'zod';

export interface Limiting_reagent_calculatorInput {
  reactant1Mass: number;
  reactant1MolarMass: number;
  reactant1Coefficient: number;
  reactant2Mass: number;
  reactant2MolarMass: number;
  reactant2Coefficient: number;
  productCoefficient: number;
  productMolarMass: number;
}

export const Limiting_reagent_calculatorInputSchema = z.object({
  reactant1Mass: z.number().default(0),
  reactant1MolarMass: z.number().default(0),
  reactant1Coefficient: z.number().default(1),
  reactant2Mass: z.number().default(0),
  reactant2MolarMass: z.number().default(0),
  reactant2Coefficient: z.number().default(1),
  productCoefficient: z.number().default(1),
  productMolarMass: z.number().default(0),
});

function evaluateAllFormulas(input: Limiting_reagent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.reactant1Mass / input.reactant1MolarMass; results["moles1"] = Number.isFinite(v) ? v : 0; } catch { results["moles1"] = 0; }
  try { const v = input.reactant2Mass / input.reactant2MolarMass; results["moles2"] = Number.isFinite(v) ? v : 0; } catch { results["moles2"] = 0; }
  try { const v = (results["moles1"] ?? 0) / input.reactant1Coefficient; results["ratio1"] = Number.isFinite(v) ? v : 0; } catch { results["ratio1"] = 0; }
  try { const v = (results["moles2"] ?? 0) / input.reactant2Coefficient; results["ratio2"] = Number.isFinite(v) ? v : 0; } catch { results["ratio2"] = 0; }
  try { const v = (results["ratio1"] ?? 0) <= (results["ratio2"] ?? 0) ? 'Reactant 1' : 'Reactant 2'; results["limitingReagent"] = Number.isFinite(v) ? v : 0; } catch { results["limitingReagent"] = 0; }
  try { const v = Math.min((results["ratio1"] ?? 0), (results["ratio2"] ?? 0)) * input.productCoefficient * input.productMolarMass; results["theoreticalYield"] = Number.isFinite(v) ? v : 0; } catch { results["theoreticalYield"] = 0; }
  return results;
}


export function calculateLimiting_reagent_calculator(input: Limiting_reagent_calculatorInput): Limiting_reagent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["limitingReagent"] ?? 0;
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


export interface Limiting_reagent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
