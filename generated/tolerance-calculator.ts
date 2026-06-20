// Auto-generated from tolerance-calculator-schema.json
import * as z from 'zod';

export interface Tolerance_calculatorInput {
  basicSize: number;
  holeUpperDev: number;
  holeLowerDev: number;
  shaftUpperDev: number;
  shaftLowerDev: number;
  dataConfidence?: number;
}

export const Tolerance_calculatorInputSchema = z.object({
  basicSize: z.number().default(50),
  holeUpperDev: z.number().default(0.025),
  holeLowerDev: z.number().default(0),
  shaftUpperDev: z.number().default(-0.009),
  shaftLowerDev: z.number().default(-0.025),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tolerance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.basicSize + input.holeUpperDev) - (input.basicSize + input.shaftLowerDev); results["maxClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxClearance"] = Number.NaN; }
  try { const v = (input.basicSize + input.holeLowerDev) - (input.basicSize + input.shaftUpperDev); results["minClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["minClearance"] = Number.NaN; }
  try { const v = input.holeUpperDev - input.holeLowerDev; results["holeTolerance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["holeTolerance"] = Number.NaN; }
  try { const v = input.shaftUpperDev - input.shaftLowerDev; results["shaftTolerance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shaftTolerance"] = Number.NaN; }
  return results;
}


export function calculateTolerance_calculator(input: Tolerance_calculatorInput): Tolerance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxClearance"]);
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


export interface Tolerance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
