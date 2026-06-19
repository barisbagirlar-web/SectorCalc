// Auto-generated from percent-change-calculator-schema.json
import * as z from 'zod';

export interface Percent_change_calculatorInput {
  initialValue: number;
  finalValue: number;
  decimalPlaces: number;
  multiplier: number;
  dataConfidence?: number;
}

export const Percent_change_calculatorInputSchema = z.object({
  initialValue: z.number().default(100),
  finalValue: z.number().default(110),
  decimalPlaces: z.number().default(2),
  multiplier: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Percent_change_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.finalValue - input.initialValue; results["absoluteChange"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["absoluteChange"] = 0; }
  try { const v = (input.finalValue - input.initialValue) / input.initialValue; results["relativeChange"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["relativeChange"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePercent_change_calculator(input: Percent_change_calculatorInput): Percent_change_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["relativeChange"]));
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


export interface Percent_change_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
