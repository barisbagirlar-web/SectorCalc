// @ts-nocheck
// Auto-generated from carb-to-insulin-ratio-calculator-schema.json
import * as z from 'zod';

export interface Carb_to_insulin_ratio_calculatorInput {
  carbs: number;
  icr: number;
  current_bg: number;
  target_bg: number;
  isf: number;
}

export const Carb_to_insulin_ratio_calculatorInputSchema = z.object({
  carbs: z.number().default(50),
  icr: z.number().default(10),
  current_bg: z.number().default(150),
  target_bg: z.number().default(100),
  isf: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Carb_to_insulin_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.carbs / input.icr; results["meal_dose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meal_dose"] = 0; }
  try { const v = (input.current_bg - input.target_bg) / input.isf; results["correction_dose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["correction_dose"] = 0; }
  try { const v = (asFormulaNumber(results["meal_dose"])) + (asFormulaNumber(results["correction_dose"])); results["total_insulin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_insulin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCarb_to_insulin_ratio_calculator(input: Carb_to_insulin_ratio_calculatorInput): Carb_to_insulin_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_insulin"]);
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


export interface Carb_to_insulin_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
