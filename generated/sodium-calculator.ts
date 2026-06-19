// Auto-generated from sodium-calculator-schema.json
import * as z from 'zod';

export interface Sodium_calculatorInput {
  compoundMass: number;
  purity: number;
  sodiumAtomsPerMolecule: number;
  molarMassCompound: number;
  sodiumMolarMass: number;
  dataConfidence?: number;
}

export const Sodium_calculatorInputSchema = z.object({
  compoundMass: z.number().default(100),
  purity: z.number().default(100),
  sodiumAtomsPerMolecule: z.number().default(1),
  molarMassCompound: z.number().default(58.44),
  sodiumMolarMass: z.number().default(22.99),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sodium_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.compoundMass * (input.purity / 100) * (input.sodiumAtomsPerMolecule * input.sodiumMolarMass / input.molarMassCompound); results["sodiumMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sodiumMass"] = 0; }
  try { const v = (input.sodiumAtomsPerMolecule * input.sodiumMolarMass / input.molarMassCompound) * 100; results["percentageSodium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percentageSodium"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSodium_calculator(input: Sodium_calculatorInput): Sodium_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sodiumMass"]);
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


export interface Sodium_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
