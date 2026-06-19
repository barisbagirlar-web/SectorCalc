// Auto-generated from fit-calculator-schema.json
import * as z from 'zod';

export interface Fit_calculatorInput {
  nominalDiameter: number;
  holeUpperDev: number;
  holeLowerDev: number;
  shaftUpperDev: number;
  shaftLowerDev: number;
  dataConfidence?: number;
}

export const Fit_calculatorInputSchema = z.object({
  nominalDiameter: z.number().default(50),
  holeUpperDev: z.number().default(0.025),
  holeLowerDev: z.number().default(0),
  shaftUpperDev: z.number().default(0),
  shaftLowerDev: z.number().default(-0.016),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nominalDiameter + input.holeUpperDev; results["holeMax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["holeMax"] = 0; }
  try { const v = input.nominalDiameter + input.holeLowerDev; results["holeMin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["holeMin"] = 0; }
  try { const v = input.nominalDiameter + input.shaftUpperDev; results["shaftMax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shaftMax"] = 0; }
  try { const v = input.nominalDiameter + input.shaftLowerDev; results["shaftMin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shaftMin"] = 0; }
  try { const v = (asFormulaNumber(results["holeMax"])) - (asFormulaNumber(results["shaftMin"])); results["maxClearance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxClearance"] = 0; }
  try { const v = (asFormulaNumber(results["holeMin"])) - (asFormulaNumber(results["shaftMax"])); results["minClearance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["minClearance"] = 0; }
  try { const v = (asFormulaNumber(results["minClearance"])) > 0 ? 1 : ((asFormulaNumber(results["maxClearance"])) < 0 ? 3 : 2); results["fitTypeCode"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fitTypeCode"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFit_calculator(input: Fit_calculatorInput): Fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["maxClearance"]));
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


export interface Fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
