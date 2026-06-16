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

function evaluateAllFormulas(input: Insulin_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.carbGrams / input.carbRatio; results["mealDose"] = Number.isFinite(v) ? v : 0; } catch { results["mealDose"] = 0; }
  try { const v = (input.currentBG - input.targetBG) > 0 ? (input.currentBG - input.targetBG) / input.isf : 0; results["correctionDose"] = Number.isFinite(v) ? v : 0; } catch { results["correctionDose"] = 0; }
  try { const v = (results["mealDose"] ?? 0) + (results["correctionDose"] ?? 0); results["totalDose"] = Number.isFinite(v) ? v : 0; } catch { results["totalDose"] = 0; }
  return results;
}


export function calculateInsulin_dose_calculator(input: Insulin_dose_calculatorInput): Insulin_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDose"] ?? 0;
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


export interface Insulin_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
