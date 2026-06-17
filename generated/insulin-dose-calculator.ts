// @ts-nocheck
// Auto-generated from insulin-dose-calculator-schema.json
import * as z from 'zod';

export interface Insulin_dose_calculatorInput {
  carbGrams: number;
  currentBG: number;
  targetBG: number;
  carbRatio: number;
  isf: number;
}

export const Insulin_dose_calculatorInputSchema = z.object({
  carbGrams: z.number().default(0),
  currentBG: z.number().default(100),
  targetBG: z.number().default(100),
  carbRatio: z.number().default(15),
  isf: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Insulin_dose_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.carbGrams / input.carbRatio; results["mealDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mealDose"] = 0; }
  try { const v = (input.currentBG - input.targetBG) > 0 ? (input.currentBG - input.targetBG) / input.isf : 0; results["correctionDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["correctionDose"] = 0; }
  try { const v = (asFormulaNumber(results["mealDose"])) + (asFormulaNumber(results["correctionDose"])); results["totalDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDose"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInsulin_dose_calculator(input: Insulin_dose_calculatorInput): Insulin_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDose"]);
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


export interface Insulin_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
