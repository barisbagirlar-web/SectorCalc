// @ts-nocheck
// Auto-generated from r-squared-calculator-schema.json
import * as z from 'zod';

export interface R_squared_calculatorInput {
  n: number;
  sumX: number;
  sumY: number;
  sumXSq: number;
  sumYSq: number;
  sumXY: number;
}

export const R_squared_calculatorInputSchema = z.object({
  n: z.number().default(0),
  sumX: z.number().default(0),
  sumY: z.number().default(0),
  sumXSq: z.number().default(0),
  sumYSq: z.number().default(0),
  sumXY: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: R_squared_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.n * input.sumXY - input.sumX * input.sumY; results["SS_xy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["SS_xy"] = 0; }
  try { const v = input.n * input.sumXSq - input.sumX ** 2; results["SS_xx"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["SS_xx"] = 0; }
  try { const v = input.n * input.sumYSq - input.sumY ** 2; results["SS_yy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["SS_yy"] = 0; }
  try { const v = (asFormulaNumber(results["SS_xy"])) ** 2 / ((asFormulaNumber(results["SS_xx"])) * (asFormulaNumber(results["SS_yy"]))); results["R_squared"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["R_squared"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateR_squared_calculator(input: R_squared_calculatorInput): R_squared_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["R_squared"]);
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


export interface R_squared_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
