// Auto-generated from hcg-doubling-time-calculator-schema.json
import * as z from 'zod';

export interface Hcg_doubling_time_calculatorInput {
  hcg1: number;
  hcg2: number;
  timeInterval: number;
  dataConfidence?: number;
}

export const Hcg_doubling_time_calculatorInputSchema = z.object({
  hcg1: z.number().default(100),
  hcg2: z.number().default(200),
  timeInterval: z.number().default(48),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hcg_doubling_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hcg2 / input.hcg1; results["growthRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["growthRate"] = Number.NaN; }
  try { const v = input.hcg2 / input.hcg1; results["growthRate_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["growthRate_aux"] = Number.NaN; }
  return results;
}


export function calculateHcg_doubling_time_calculator(input: Hcg_doubling_time_calculatorInput): Hcg_doubling_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["growthRate_aux"]);
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


export interface Hcg_doubling_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
