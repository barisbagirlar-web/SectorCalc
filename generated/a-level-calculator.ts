// Auto-generated from a-level-calculator-schema.json
import * as z from 'zod';

export interface A_level_calculatorInput {
  measured: number;
  reference: number;
  dbMultiplier: number;
  systemGain: number;
  dataConfidence?: number;
}

export const A_level_calculatorInputSchema = z.object({
  measured: z.number().default(1),
  reference: z.number().default(0.00002),
  dbMultiplier: z.number().default(20),
  systemGain: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: A_level_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.measured / input.reference; results["ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  try { const v = input.measured / input.reference; results["ratio_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ratio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateA_level_calculator(input: A_level_calculatorInput): A_level_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["ratio_aux"]));
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


export interface A_level_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
