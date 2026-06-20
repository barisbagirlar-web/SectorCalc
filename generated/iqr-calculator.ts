// Auto-generated from iqr-calculator-schema.json
import * as z from 'zod';

export interface Iqr_calculatorInput {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  dataConfidence?: number;
}

export const Iqr_calculatorInputSchema = z.object({
  min: z.number().default(0),
  q1: z.number().default(0),
  median: z.number().default(0),
  q3: z.number().default(0),
  max: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Iqr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.min) * (input.q1) * (input.median) * (input.q3) * (input.max); results["iqr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["iqr"] = Number.NaN; }
  try { const v = (input.min) * (input.q1) * (input.median); results["lowerFence"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lowerFence"] = Number.NaN; }
  try { const v = (input.min) * (input.q1) * (input.median); results["upperFence"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["upperFence"] = Number.NaN; }
  return results;
}


export function calculateIqr_calculator(input: Iqr_calculatorInput): Iqr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["iqr"]);
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


export interface Iqr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
