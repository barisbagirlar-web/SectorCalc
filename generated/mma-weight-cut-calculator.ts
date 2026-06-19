// Auto-generated from mma-weight-cut-calculator-schema.json
import * as z from 'zod';

export interface Mma_weight_cut_calculatorInput {
  current_weight: number;
  body_fat_pct: number;
  target_weight: number;
  dehydration_pct: number;
  time_to_fight: number;
  dataConfidence?: number;
}

export const Mma_weight_cut_calculatorInputSchema = z.object({
  current_weight: z.number().default(80),
  body_fat_pct: z.number().default(15),
  target_weight: z.number().default(70),
  dehydration_pct: z.number().default(5),
  time_to_fight: z.number().default(7),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mma_weight_cut_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.current_weight - input.target_weight) / (input.current_weight * input.dehydration_pct / 100); results["deficit_ratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deficit_ratio"] = 0; }
  try { const v = input.current_weight * input.dehydration_pct / 100; results["max_water_cut_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["max_water_cut_kg"] = 0; }
  try { const v = input.current_weight - input.target_weight; results["weight_to_lose_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weight_to_lose_kg"] = 0; }
  try { const v = input.current_weight * (1 - input.body_fat_pct / 100); results["lean_mass_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lean_mass_kg"] = 0; }
  try { const v = input.current_weight * input.body_fat_pct / 100; results["fat_mass_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fat_mass_kg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMma_weight_cut_calculator(input: Mma_weight_cut_calculatorInput): Mma_weight_cut_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deficit_ratio"]);
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


export interface Mma_weight_cut_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
