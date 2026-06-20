// Auto-generated from percent-yield-calculator-schema.json
import * as z from 'zod';

export interface Percent_yield_calculatorInput {
  rawMaterialInput: number;
  productOutput: number;
  expectedYieldPercent: number;
  wasteMaterial: number;
  dataConfidence?: number;
}

export const Percent_yield_calculatorInputSchema = z.object({
  rawMaterialInput: z.number().default(0),
  productOutput: z.number().default(0),
  expectedYieldPercent: z.number().default(95),
  wasteMaterial: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Percent_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productOutput / input.rawMaterialInput * 100; results["yieldPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldPercent"] = Number.NaN; }
  try { const v = (input.productOutput / input.rawMaterialInput * 100) - input.expectedYieldPercent; results["yieldVariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldVariance"] = Number.NaN; }
  try { const v = input.wasteMaterial / input.rawMaterialInput * 100; results["wastePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastePercent"] = Number.NaN; }
  try { const v = 100 - (input.productOutput / input.rawMaterialInput * 100) - (input.wasteMaterial / input.rawMaterialInput * 100); results["materialLossPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialLossPercent"] = Number.NaN; }
  return results;
}


export function calculatePercent_yield_calculator(input: Percent_yield_calculatorInput): Percent_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yieldPercent"]);
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


export interface Percent_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
