// @ts-nocheck
// Auto-generated from sum-of-years-digits-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Sum_of_years_digits_depreciation_calculatorInput {
  cost: number;
  salvageValue: number;
  usefulLife: number;
  year: number;
}

export const Sum_of_years_digits_depreciation_calculatorInputSchema = z.object({
  cost: z.number().default(10000),
  salvageValue: z.number().default(1000),
  usefulLife: z.number().default(5),
  year: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sum_of_years_digits_depreciation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.cost - input.salvageValue) * (input.usefulLife - input.year + 1) / (input.usefulLife * (input.usefulLife + 1) / 2); results["depreciation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["depreciation"] = 0; }
  try { const v = input.cost - (input.cost - input.salvageValue) * (input.year * (2 * input.usefulLife - input.year + 1) / 2) / (input.usefulLife * (input.usefulLife + 1) / 2); results["bookValueEnd"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bookValueEnd"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSum_of_years_digits_depreciation_calculator(input: Sum_of_years_digits_depreciation_calculatorInput): Sum_of_years_digits_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["depreciation"]);
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


export interface Sum_of_years_digits_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
