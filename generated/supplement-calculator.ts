// Auto-generated from supplement-calculator-schema.json
import * as z from 'zod';

export interface Supplement_calculatorInput {
  baseWeight: number;
  baseConc: number;
  desiredConc: number;
  suppConc: number;
  dataConfidence?: number;
}

export const Supplement_calculatorInputSchema = z.object({
  baseWeight: z.number().default(100),
  baseConc: z.number().default(5),
  desiredConc: z.number().default(10),
  suppConc: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Supplement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseWeight * (input.desiredConc - input.baseConc) / (input.suppConc - input.desiredConc); results["supplementWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["supplementWeight"] = Number.NaN; }
  try { const v = input.baseWeight + (toNumericFormulaValue(results["supplementWeight"])); results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  try { const v = (input.baseWeight * input.baseConc + (toNumericFormulaValue(results["supplementWeight"])) * input.suppConc) / (toNumericFormulaValue(results["totalWeight"])); results["finalConc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalConc"] = Number.NaN; }
  return results;
}


export function calculateSupplement_calculator(input: Supplement_calculatorInput): Supplement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["supplementWeight"]);
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


export interface Supplement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
