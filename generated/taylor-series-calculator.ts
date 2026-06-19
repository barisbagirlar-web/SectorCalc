// Auto-generated from taylor-series-calculator-schema.json
import * as z from 'zod';

export interface Taylor_series_calculatorInput {
  expansionPoint: number;
  evaluationPoint: number;
  degree: number;
  f0: number;
  f1: number;
  f2: number;
  f3: number;
  dataConfidence?: number;
}

export const Taylor_series_calculatorInputSchema = z.object({
  expansionPoint: z.number().default(0),
  evaluationPoint: z.number().default(1),
  degree: z.number().default(3),
  f0: z.number().default(1),
  f1: z.number().default(1),
  f2: z.number().default(1),
  f3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Taylor_series_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.f0; results["constTerm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["constTerm"] = 0; }
  try { const v = input.degree >= 1 ? input.f1 * (input.evaluationPoint - input.expansionPoint) : 0; results["linearTerm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["linearTerm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTaylor_series_calculator(input: Taylor_series_calculatorInput): Taylor_series_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["linearTerm"]));
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


export interface Taylor_series_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
