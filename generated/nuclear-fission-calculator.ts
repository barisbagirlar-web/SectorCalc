// Auto-generated from nuclear-fission-calculator-schema.json
import * as z from 'zod';

export interface Nuclear_fission_calculatorInput {
  mass: number;
  energyPerFission: number;
  molarMass: number;
  avogadroNumber: number;
  mevToJoules: number;
  dataConfidence?: number;
}

export const Nuclear_fission_calculatorInputSchema = z.object({
  mass: z.number().default(1000),
  energyPerFission: z.number().default(200),
  molarMass: z.number().default(235.0439299),
  avogadroNumber: z.number().default(6.02214076e+23),
  mevToJoules: z.number().default(1.602176634e-13),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nuclear_fission_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass / input.molarMass * input.avogadroNumber; results["atomsCount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["atomsCount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["atomsCount"])) * input.energyPerFission; results["energyMeV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyMeV"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyMeV"])) * input.mevToJoules; results["energyJoules"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyJoules"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyJoules"])) / 3.6e6; results["energyKWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyKWh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyJoules"])) / 4.184e9; results["energyTNT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyTNT"] = Number.NaN; }
  return results;
}


export function calculateNuclear_fission_calculator(input: Nuclear_fission_calculatorInput): Nuclear_fission_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["energyJoules"]);
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


export interface Nuclear_fission_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
