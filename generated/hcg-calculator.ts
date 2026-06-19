// Auto-generated from hcg-calculator-schema.json
import * as z from 'zod';

export interface Hcg_calculatorInput {
  hcg_level: number;
  doubling_time_hours: number;
  time_elapsed_hours: number;
  initial_hcg: number;
  dataConfidence?: number;
}

export const Hcg_calculatorInputSchema = z.object({
  hcg_level: z.number().default(100),
  doubling_time_hours: z.number().default(48),
  time_elapsed_hours: z.number().default(24),
  initial_hcg: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hcg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hcg_level / input.initial_hcg; results["hcg_ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hcg_ratio"] = 0; }
  try { const v = (input.hcg_level - input.initial_hcg) / input.initial_hcg * 100; results["percent_increase"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percent_increase"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHcg_calculator(input: Hcg_calculatorInput): Hcg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["percent_increase"]);
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


export interface Hcg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
