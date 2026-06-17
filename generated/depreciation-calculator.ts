// @ts-nocheck
// Auto-generated from depreciation-calculator-schema.json
import * as z from 'zod';

export interface Depreciation_calculatorInput {
  initialCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  yearsElapsed: number;
}

export const Depreciation_calculatorInputSchema = z.object({
  initialCost: z.number().default(10000),
  salvageValue: z.number().default(1000),
  usefulLifeYears: z.number().default(5),
  yearsElapsed: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Depreciation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.initialCost - input.salvageValue) / input.usefulLifeYears; results["annualDepreciation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualDepreciation"] = 0; }
  try { const v = (input.initialCost - input.salvageValue) / input.usefulLifeYears * input.yearsElapsed; results["accumulatedDepreciation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["accumulatedDepreciation"] = 0; }
  try { const v = input.initialCost - ((input.initialCost - input.salvageValue) / input.usefulLifeYears * input.yearsElapsed); results["bookValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bookValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDepreciation_calculator(input: Depreciation_calculatorInput): Depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualDepreciation"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
