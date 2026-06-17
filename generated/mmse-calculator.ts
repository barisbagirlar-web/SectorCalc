// @ts-nocheck
// Auto-generated from mmse-calculator-schema.json
import * as z from 'zod';

export interface Mmse_calculatorInput {
  actualValue1: number;
  predictedValue1: number;
  actualValue2: number;
  predictedValue2: number;
}

export const Mmse_calculatorInputSchema = z.object({
  actualValue1: z.number().default(0),
  predictedValue1: z.number().default(0),
  actualValue2: z.number().default(0),
  predictedValue2: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mmse_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.actualValue1 - input.predictedValue1) ** 2; results["squaredError1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["squaredError1"] = 0; }
  try { const v = (input.actualValue2 - input.predictedValue2) ** 2; results["squaredError2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["squaredError2"] = 0; }
  try { const v = (asFormulaNumber(results["squaredError1"])) + (asFormulaNumber(results["squaredError2"])); results["totalSquaredError"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSquaredError"] = 0; }
  try { const v = ((asFormulaNumber(results["squaredError1"])) + (asFormulaNumber(results["squaredError2"]))) / 2; results["meanSquaredError"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meanSquaredError"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMmse_calculator(input: Mmse_calculatorInput): Mmse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanSquaredError"]);
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


export interface Mmse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
