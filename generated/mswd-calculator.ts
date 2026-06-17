// @ts-nocheck
// Auto-generated from mswd-calculator-schema.json
import * as z from 'zod';

export interface Mswd_calculatorInput {
  sumWeightedSquaredResiduals: number;
  numberOfDataPoints: number;
  numberOfParameters: number;
  significanceLevel: number;
}

export const Mswd_calculatorInputSchema = z.object({
  sumWeightedSquaredResiduals: z.number().default(8),
  numberOfDataPoints: z.number().default(10),
  numberOfParameters: z.number().default(2),
  significanceLevel: z.number().default(0.05),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mswd_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.sumWeightedSquaredResiduals / (input.numberOfDataPoints - input.numberOfParameters); results["mswd"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mswd"] = 0; }
  try { const v = input.sumWeightedSquaredResiduals; results["sumWeightedSquaredResiduals"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sumWeightedSquaredResiduals"] = 0; }
  try { const v = input.numberOfDataPoints - input.numberOfParameters; results["numberOfDataPoints___numberOfParameters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["numberOfDataPoints___numberOfParameters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMswd_calculator(input: Mswd_calculatorInput): Mswd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mswd"]);
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


export interface Mswd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
