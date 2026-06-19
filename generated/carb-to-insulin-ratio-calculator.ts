// Auto-generated from carb-to-insulin-ratio-calculator-schema.json
import * as z from 'zod';

export interface Carb_to_insulin_ratio_calculatorInput {
  carbs: number;
  icr: number;
  current_bg: number;
  target_bg: number;
  isf: number;
  dataConfidence?: number;
}

export const Carb_to_insulin_ratio_calculatorInputSchema = z.object({
  carbs: z.number().default(50),
  icr: z.number().default(10),
  current_bg: z.number().default(150),
  target_bg: z.number().default(100),
  isf: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Carb_to_insulin_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carbs / input.icr; results["meal_dose"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meal_dose"] = 0; }
  try { const v = (input.current_bg - input.target_bg) / input.isf; results["correction_dose"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correction_dose"] = 0; }
  try { const v = (asFormulaNumber(results["meal_dose"])) + (asFormulaNumber(results["correction_dose"])); results["total_insulin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_insulin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCarb_to_insulin_ratio_calculator(input: Carb_to_insulin_ratio_calculatorInput): Carb_to_insulin_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_insulin"]));
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


export interface Carb_to_insulin_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
