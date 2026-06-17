// @ts-nocheck
// Auto-generated from steel-column-calculator-schema.json
import * as z from 'zod';

export interface Steel_column_calculatorInput {
  effectiveLengthFactor: number;
  unbracedLength: number;
  width: number;
  thickness: number;
  elasticModulus: number;
  yieldStrength: number;
  safetyFactor: number;
}

export const Steel_column_calculatorInputSchema = z.object({
  effectiveLengthFactor: z.number().default(1),
  unbracedLength: z.number().default(3000),
  width: z.number().default(100),
  thickness: z.number().default(10),
  elasticModulus: z.number().default(200),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(1.67),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Steel_column_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.width * input.thickness; results["A"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["A"] = 0; }
  try { const v = input.yieldStrength * (asFormulaNumber(results["A"])); results["P_yield"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["P_yield"] = 0; }
  try { const v = input.yieldStrength; results["yieldStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yieldStress"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSteel_column_calculator(input: Steel_column_calculatorInput): Steel_column_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yieldStress"]);
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


export interface Steel_column_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
