// Auto-generated from rice-calculator-schema.json
import * as z from 'zod';

export interface Rice_calculatorInput {
  uncookedRiceWeight: number;
  waterRatio: number;
  yieldFactor: number;
  servingSize: number;
  dataConfidence?: number;
}

export const Rice_calculatorInputSchema = z.object({
  uncookedRiceWeight: z.number().default(200),
  waterRatio: z.number().default(2),
  yieldFactor: z.number().default(2.5),
  servingSize: z.number().default(150),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rice_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.uncookedRiceWeight * input.yieldFactor / input.servingSize; results["servings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["servings"] = 0; }
  try { const v = input.uncookedRiceWeight * input.yieldFactor; results["cookedRice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cookedRice"] = 0; }
  try { const v = input.uncookedRiceWeight * input.waterRatio; results["waterNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waterNeeded"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRice_calculator(input: Rice_calculatorInput): Rice_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["servings"]));
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


export interface Rice_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
