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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Limiting_reagent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.reactant1Mass / input.reactant1MolarMass; results["moles1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["moles1"] = Number.NaN; }
  try { const v = input.reactant2Mass / input.reactant2MolarMass; results["moles2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["moles2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["moles1"])) / input.reactant1Coefficient; results["ratio1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ratio1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["moles2"])) / input.reactant2Coefficient; results["ratio2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ratio2"] = Number.NaN; }
  return results;
}


export function calculateLimiting_reagent_calculator(input: Limiting_reagent_calculatorInput): Limiting_reagent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ratio2"]);
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


export interface Limiting_reagent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
