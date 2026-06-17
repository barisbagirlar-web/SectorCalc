// @ts-nocheck
// Auto-generated from percent-yield-calculator-schema.json
import * as z from 'zod';

export interface Percent_yield_calculatorInput {
  rawMaterialInput: number;
  productOutput: number;
  expectedYieldPercent: number;
  wasteMaterial: number;
}

export const Percent_yield_calculatorInputSchema = z.object({
  rawMaterialInput: z.number().default(0),
  productOutput: z.number().default(0),
  expectedYieldPercent: z.number().default(95),
  wasteMaterial: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Percent_yield_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.productOutput / input.rawMaterialInput * 100; results["yieldPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yieldPercent"] = 0; }
  try { const v = (input.productOutput / input.rawMaterialInput * 100) - input.expectedYieldPercent; results["yieldVariance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yieldVariance"] = 0; }
  try { const v = input.wasteMaterial / input.rawMaterialInput * 100; results["wastePercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wastePercent"] = 0; }
  try { const v = 100 - (input.productOutput / input.rawMaterialInput * 100) - (input.wasteMaterial / input.rawMaterialInput * 100); results["materialLossPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["materialLossPercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePercent_yield_calculator(input: Percent_yield_calculatorInput): Percent_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yieldPercent"]);
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


export interface Percent_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
