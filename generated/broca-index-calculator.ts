// Auto-generated from broca-index-calculator-schema.json
import * as z from 'zod';

export interface Broca_index_calculatorInput {
  heightCm: number;
  sex: number;
  frameSize: number;
  currentWeight: number;
  dataConfidence?: number;
}

export const Broca_index_calculatorInputSchema = z.object({
  heightCm: z.number().default(170),
  sex: z.number().default(0),
  frameSize: z.number().default(1),
  currentWeight: z.number().default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Broca_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.heightCm - 100) * (input.sex == 0 ? 0.9 : 0.85) * (input.frameSize == 0 ? 0.9 : (input.frameSize == 2 ? 1.1 : 1)); results["idealWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idealWeight"] = Number.NaN; }
  try { const v = input.currentWeight - (toNumericFormulaValue(results["idealWeight"])); results["difference"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["difference"] = Number.NaN; }
  return results;
}


export function calculateBroca_index_calculator(input: Broca_index_calculatorInput): Broca_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["idealWeight"]);
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


export interface Broca_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
