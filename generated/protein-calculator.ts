// Auto-generated from protein-calculator-schema.json
import * as z from 'zod';

export interface Protein_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  proteinFactor: number;
  useLeanMass: number;
  dataConfidence?: number;
}

export const Protein_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  proteinFactor: z.number().default(1.2),
  useLeanMass: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Protein_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender == 1 ? 0.407 * input.weight + 0.267 * input.height - 19.2 : 0.252 * input.weight + 0.473 * input.height - 48.3; results["leanMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["leanMass"] = 0; }
  try { const v = input.useLeanMass == 1 ? (asFormulaNumber(results["leanMass"])) : input.weight; results["baseWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = (asFormulaNumber(results["baseWeight"])) * input.proteinFactor; results["proteinRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["proteinRequirement"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProtein_calculator(input: Protein_calculatorInput): Protein_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["proteinRequirement"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Protein_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
