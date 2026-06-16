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

function evaluateAllFormulas(input: Percent_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productOutput / input.rawMaterialInput * 100; results["yieldPercent"] = Number.isFinite(v) ? v : 0; } catch { results["yieldPercent"] = 0; }
  try { const v = (input.productOutput / input.rawMaterialInput * 100) - input.expectedYieldPercent; results["yieldVariance"] = Number.isFinite(v) ? v : 0; } catch { results["yieldVariance"] = 0; }
  try { const v = input.wasteMaterial / input.rawMaterialInput * 100; results["wastePercent"] = Number.isFinite(v) ? v : 0; } catch { results["wastePercent"] = 0; }
  try { const v = 100 - (input.productOutput / input.rawMaterialInput * 100) - (input.wasteMaterial / input.rawMaterialInput * 100); results["materialLossPercent"] = Number.isFinite(v) ? v : 0; } catch { results["materialLossPercent"] = 0; }
  return results;
}


export function calculatePercent_yield_calculator(input: Percent_yield_calculatorInput): Percent_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yieldPercent"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
