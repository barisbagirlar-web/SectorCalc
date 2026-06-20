// Auto-generated from depreciation-calculator-schema.json
import * as z from 'zod';

export interface Depreciation_calculatorInput {
  initialCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  yearsElapsed: number;
  dataConfidence?: number;
}

export const Depreciation_calculatorInputSchema = z.object({
  initialCost: z.number().default(10000),
  salvageValue: z.number().default(1000),
  usefulLifeYears: z.number().default(5),
  yearsElapsed: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.initialCost - input.salvageValue) / input.usefulLifeYears; results["annualDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualDepreciation"] = Number.NaN; }
  try { const v = (input.initialCost - input.salvageValue) / input.usefulLifeYears * input.yearsElapsed; results["accumulatedDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["accumulatedDepreciation"] = Number.NaN; }
  try { const v = input.initialCost - ((input.initialCost - input.salvageValue) / input.usefulLifeYears * input.yearsElapsed); results["bookValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bookValue"] = Number.NaN; }
  return results;
}


export function calculateDepreciation_calculator(input: Depreciation_calculatorInput): Depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualDepreciation"]);
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


export interface Depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
