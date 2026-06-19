// Auto-generated from mswd-calculator-schema.json
import * as z from 'zod';

export interface Mswd_calculatorInput {
  sumWeightedSquaredResiduals: number;
  numberOfDataPoints: number;
  numberOfParameters: number;
  significanceLevel: number;
  dataConfidence?: number;
}

export const Mswd_calculatorInputSchema = z.object({
  sumWeightedSquaredResiduals: z.number().default(8),
  numberOfDataPoints: z.number().default(10),
  numberOfParameters: z.number().default(2),
  significanceLevel: z.number().default(0.05),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mswd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sumWeightedSquaredResiduals / (input.numberOfDataPoints - input.numberOfParameters); results["mswd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mswd"] = 0; }
  try { const v = input.sumWeightedSquaredResiduals; results["sumWeightedSquaredResiduals"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumWeightedSquaredResiduals"] = 0; }
  try { const v = input.numberOfDataPoints - input.numberOfParameters; results["numberOfDataPoints___numberOfParameters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfDataPoints___numberOfParameters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMswd_calculator(input: Mswd_calculatorInput): Mswd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["mswd"]));
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


export interface Mswd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
