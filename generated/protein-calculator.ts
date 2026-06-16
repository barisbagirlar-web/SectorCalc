// Auto-generated from protein-calculator-schema.json
import * as z from 'zod';

export interface Protein_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  proteinFactor: number;
  useLeanMass: number;
}

export const Protein_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  proteinFactor: z.number().default(1.2),
  useLeanMass: z.number().default(0),
});

function evaluateAllFormulas(input: Protein_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender == 1 ? 0.407 * input.weight + 0.267 * input.height - 19.2 : 0.252 * input.weight + 0.473 * input.height - 48.3; results["leanMass"] = Number.isFinite(v) ? v : 0; } catch { results["leanMass"] = 0; }
  try { const v = input.useLeanMass == 1 ? (results["leanMass"] ?? 0) : input.weight; results["baseWeight"] = Number.isFinite(v) ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = (results["baseWeight"] ?? 0) * input.proteinFactor; results["proteinRequirement"] = Number.isFinite(v) ? v : 0; } catch { results["proteinRequirement"] = 0; }
  return results;
}


export function calculateProtein_calculator(input: Protein_calculatorInput): Protein_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["proteinRequirement"] ?? 0;
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


export interface Protein_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
