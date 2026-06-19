// Auto-generated from tonicity-calculator-schema.json
import * as z from 'zod';

export interface Tonicity_calculatorInput {
  volume: number;
  targetConc: number;
  drug1Amt: number;
  drug1E: number;
  drug2Amt: number;
  drug2E: number;
  dataConfidence?: number;
}

export const Tonicity_calculatorInputSchema = z.object({
  volume: z.number().default(100),
  targetConc: z.number().default(0.9),
  drug1Amt: z.number().default(0),
  drug1E: z.number().default(1),
  drug2Amt: z.number().default(0),
  drug2E: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tonicity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.drug1Amt * input.drug1E; results["equivalentNaCl1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["equivalentNaCl1"] = 0; }
  try { const v = input.drug2Amt * input.drug2E; results["equivalentNaCl2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["equivalentNaCl2"] = 0; }
  try { const v = (asFormulaNumber(results["equivalentNaCl1"])) + (asFormulaNumber(results["equivalentNaCl2"])); results["totalEquivalent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEquivalent"] = 0; }
  try { const v = input.volume * input.targetConc / 100; results["requiredTotalNaCl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredTotalNaCl"] = 0; }
  try { const v = (asFormulaNumber(results["requiredTotalNaCl"])) - (asFormulaNumber(results["totalEquivalent"])); results["requiredNaCl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredNaCl"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTonicity_calculator(input: Tonicity_calculatorInput): Tonicity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["requiredNaCl"]));
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


export interface Tonicity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
