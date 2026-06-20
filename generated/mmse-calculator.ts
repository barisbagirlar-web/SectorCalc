// Auto-generated from mmse-calculator-schema.json
import * as z from 'zod';

export interface Mmse_calculatorInput {
  actualValue1: number;
  predictedValue1: number;
  actualValue2: number;
  predictedValue2: number;
  dataConfidence?: number;
}

export const Mmse_calculatorInputSchema = z.object({
  actualValue1: z.number().default(0),
  predictedValue1: z.number().default(0),
  actualValue2: z.number().default(0),
  predictedValue2: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mmse_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.actualValue1 - input.predictedValue1) ** 2; results["squaredError1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squaredError1"] = Number.NaN; }
  try { const v = (input.actualValue2 - input.predictedValue2) ** 2; results["squaredError2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squaredError2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["squaredError1"])) + (toNumericFormulaValue(results["squaredError2"])); results["totalSquaredError"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSquaredError"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["squaredError1"])) + (toNumericFormulaValue(results["squaredError2"]))) / 2; results["meanSquaredError"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meanSquaredError"] = Number.NaN; }
  return results;
}


export function calculateMmse_calculator(input: Mmse_calculatorInput): Mmse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanSquaredError"]);
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


export interface Mmse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
