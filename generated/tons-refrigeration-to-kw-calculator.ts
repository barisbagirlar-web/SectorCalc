// Auto-generated from tons-refrigeration-to-kw-calculator-schema.json
import * as z from 'zod';

export interface Tons_refrigeration_to_kw_calculatorInput {
  tons: number;
  conversionFactor: number;
  safetyFactor: number;
  decimals: number;
  dataConfidence?: number;
}

export const Tons_refrigeration_to_kw_calculatorInputSchema = z.object({
  tons: z.number().default(1),
  conversionFactor: z.number().default(3.51685),
  safetyFactor: z.number().default(1),
  decimals: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tons_refrigeration_to_kw_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tons * input.conversionFactor; results["baseKW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseKW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseKW"])) * input.safetyFactor; results["withSafety"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["withSafety"] = Number.NaN; }
  return results;
}


export function calculateTons_refrigeration_to_kw_calculator(input: Tons_refrigeration_to_kw_calculatorInput): Tons_refrigeration_to_kw_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["withSafety"]);
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


export interface Tons_refrigeration_to_kw_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
