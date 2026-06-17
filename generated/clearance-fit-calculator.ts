// @ts-nocheck
// Auto-generated from clearance-fit-calculator-schema.json
import * as z from 'zod';

export interface Clearance_fit_calculatorInput {
  holeMax: number;
  holeMin: number;
  shaftMax: number;
  shaftMin: number;
}

export const Clearance_fit_calculatorInputSchema = z.object({
  holeMax: z.number().default(20.02),
  holeMin: z.number().default(20),
  shaftMax: z.number().default(19.98),
  shaftMin: z.number().default(19.95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Clearance_fit_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.holeMin - input.shaftMax; results["minClearance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["minClearance"] = 0; }
  try { const v = input.holeMax - input.shaftMin; results["maxClearance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxClearance"] = 0; }
  try { const v = ((asFormulaNumber(results["minClearance"])) + (asFormulaNumber(results["maxClearance"]))) / 2; results["avgClearance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["avgClearance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateClearance_fit_calculator(input: Clearance_fit_calculatorInput): Clearance_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["avgClearance"]);
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


export interface Clearance_fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
