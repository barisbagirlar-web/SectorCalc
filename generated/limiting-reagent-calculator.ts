// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Limiting_reagent_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.reactant1Mass / input.reactant1MolarMass; results["moles1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["moles1"] = 0; }
  try { const v = input.reactant2Mass / input.reactant2MolarMass; results["moles2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["moles2"] = 0; }
  try { const v = (asFormulaNumber(results["moles1"])) / input.reactant1Coefficient; results["ratio1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ratio1"] = 0; }
  try { const v = (asFormulaNumber(results["moles2"])) / input.reactant2Coefficient; results["ratio2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ratio2"] = 0; }
  results["limitingReagent"] = 0;
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLimiting_reagent_calculator(input: Limiting_reagent_calculatorInput): Limiting_reagent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["limitingReagent"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
