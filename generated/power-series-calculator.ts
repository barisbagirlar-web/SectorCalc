// Auto-generated from power-series-calculator-schema.json
import * as z from 'zod';

export interface Power_series_calculatorInput {
  x: number;
  a0: number;
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  dataConfidence?: number;
}

export const Power_series_calculatorInputSchema = z.object({
  x: z.number().default(0),
  a0: z.number().default(1),
  a1: z.number().default(0),
  a2: z.number().default(0),
  a3: z.number().default(0),
  a4: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Power_series_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a0; results["term0"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term0"] = Number.NaN; }
  try { const v = input.a1 * input.x; results["term1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["term1"] = Number.NaN; }
  return results;
}


export function calculatePower_series_calculator(input: Power_series_calculatorInput): Power_series_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["term1"]);
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


export interface Power_series_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
