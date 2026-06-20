// Auto-generated from insulin-dose-calculator-schema.json
import * as z from 'zod';

export interface Insulin_dose_calculatorInput {
  carbGrams: number;
  currentBG: number;
  targetBG: number;
  carbRatio: number;
  isf: number;
  dataConfidence?: number;
}

export const Insulin_dose_calculatorInputSchema = z.object({
  carbGrams: z.number().default(0),
  currentBG: z.number().default(100),
  targetBG: z.number().default(100),
  carbRatio: z.number().default(15),
  isf: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Insulin_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carbGrams / input.carbRatio; results["mealDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mealDose"] = Number.NaN; }
  try { const v = (input.currentBG - input.targetBG) > 0 ? (input.currentBG - input.targetBG) / input.isf : 0; results["correctionDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["correctionDose"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["mealDose"])) + (toNumericFormulaValue(results["correctionDose"])); results["totalDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDose"] = Number.NaN; }
  return results;
}


export function calculateInsulin_dose_calculator(input: Insulin_dose_calculatorInput): Insulin_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDose"]);
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


export interface Insulin_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
