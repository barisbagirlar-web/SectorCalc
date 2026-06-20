// Auto-generated from double-integral-calculator-schema.json
import * as z from 'zod';

export interface Double_integral_calculatorInput {
  xLower: number;
  xUpper: number;
  yLower: number;
  yUpper: number;
  coefA: number;
  coefB: number;
  constantC: number;
  dataConfidence?: number;
}

export const Double_integral_calculatorInputSchema = z.object({
  xLower: z.number().default(0),
  xUpper: z.number().default(1),
  yLower: z.number().default(0),
  yUpper: z.number().default(1),
  coefA: z.number().default(0),
  coefB: z.number().default(0),
  constantC: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Double_integral_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.constantC*(input.xUpper-input.xLower)*(input.yUpper-input.yLower); results["constTerm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["constTerm"] = Number.NaN; }
  try { const v = input.constantC*(input.xUpper-input.xLower)*(input.yUpper-input.yLower); results["constTerm_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["constTerm_aux"] = Number.NaN; }
  return results;
}


export function calculateDouble_integral_calculator(input: Double_integral_calculatorInput): Double_integral_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["constTerm_aux"]);
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


export interface Double_integral_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
