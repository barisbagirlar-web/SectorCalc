// @ts-nocheck
// Auto-generated from us-fl-oz-to-imperial-fl-oz-calculator-schema.json
import * as z from 'zod';

export interface Us_fl_oz_to_imperial_fl_oz_calculatorInput {
  usFlOz: number;
  batchSize: number;
  packageCount: number;
  tolerance: number;
}

export const Us_fl_oz_to_imperial_fl_oz_calculatorInputSchema = z.object({
  usFlOz: z.number().default(1),
  batchSize: z.number().default(100),
  packageCount: z.number().default(1),
  tolerance: z.number().default(0.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Us_fl_oz_to_imperial_fl_oz_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.usFlOz + input.batchSize + input.packageCount; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.usFlOz + input.batchSize + input.packageCount; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateUs_fl_oz_to_imperial_fl_oz_calculator(input: Us_fl_oz_to_imperial_fl_oz_calculatorInput): Us_fl_oz_to_imperial_fl_oz_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Us_fl_oz_to_imperial_fl_oz_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
