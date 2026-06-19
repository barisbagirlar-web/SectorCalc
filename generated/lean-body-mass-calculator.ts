// Auto-generated from lean-body-mass-calculator-schema.json
import * as z from 'zod';

export interface Lean_body_mass_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  dataConfidence?: number;
}

export const Lean_body_mass_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lean_body_mass_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * 0.732 + input.height * 0.203 - input.age * 0.002 - input.gender * 0.016 + 14.0; results["lbm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lbm"] = 0; }
  try { const v = input.weight - (asFormulaNumber(results["lbm"])); results["bodyFatMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bodyFatMass"] = 0; }
  try { const v = ((asFormulaNumber(results["bodyFatMass"])) / input.weight) * 100; results["bodyFatPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bodyFatPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLean_body_mass_calculator(input: Lean_body_mass_calculatorInput): Lean_body_mass_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["lbm"]);
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


export interface Lean_body_mass_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
