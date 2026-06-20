// Auto-generated from clearance-fit-calculator-schema.json
import * as z from 'zod';

export interface Clearance_fit_calculatorInput {
  holeMax: number;
  holeMin: number;
  shaftMax: number;
  shaftMin: number;
  dataConfidence?: number;
}

export const Clearance_fit_calculatorInputSchema = z.object({
  holeMax: z.number().default(20.02),
  holeMin: z.number().default(20),
  shaftMax: z.number().default(19.98),
  shaftMin: z.number().default(19.95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Clearance_fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.holeMin - input.shaftMax; results["minClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["minClearance"] = Number.NaN; }
  try { const v = input.holeMax - input.shaftMin; results["maxClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxClearance"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["minClearance"])) + (toNumericFormulaValue(results["maxClearance"]))) / 2; results["avgClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["avgClearance"] = Number.NaN; }
  return results;
}


export function calculateClearance_fit_calculator(input: Clearance_fit_calculatorInput): Clearance_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["avgClearance"]);
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


export interface Clearance_fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
