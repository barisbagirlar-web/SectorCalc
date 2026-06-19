// Auto-generated from mpa-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Mpa_to_psi_calculatorInput {
  mpa1: number;
  mpa2: number;
  mpa3: number;
  mpa4: number;
  dataConfidence?: number;
}

export const Mpa_to_psi_calculatorInputSchema = z.object({
  mpa1: z.number().default(0),
  mpa2: z.number().default(0),
  mpa3: z.number().default(0),
  mpa4: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mpa_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mpa1 * 145.03773773; results["psi1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["psi1"] = 0; }
  try { const v = input.mpa2 * 145.03773773; results["psi2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["psi2"] = 0; }
  try { const v = input.mpa3 * 145.03773773; results["psi3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["psi3"] = 0; }
  try { const v = input.mpa4 * 145.03773773; results["psi4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["psi4"] = 0; }
  try { const v = ((asFormulaNumber(results["psi1"])) + (asFormulaNumber(results["psi2"])) + (asFormulaNumber(results["psi3"])) + (asFormulaNumber(results["psi4"]))) / 4; results["averagePSI"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averagePSI"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMpa_to_psi_calculator(input: Mpa_to_psi_calculatorInput): Mpa_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["averagePSI"]);
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


export interface Mpa_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
