// Auto-generated from ari-calculator-schema.json
import * as z from 'zod';

export interface Ari_calculatorInput {
  initialValue: number;
  targetValue: number;
  currentValue: number;
  yearsElapsed: number;
  confidenceFactor: number;
  dataConfidence?: number;
}

export const Ari_calculatorInputSchema = z.object({
  initialValue: z.number().default(100),
  targetValue: z.number().default(80),
  currentValue: z.number().default(90),
  yearsElapsed: z.number().default(1),
  confidenceFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ari_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialValue * input.targetValue * input.currentValue * input.yearsElapsed; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.initialValue * input.targetValue * input.currentValue * input.yearsElapsed * (input.confidenceFactor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.confidenceFactor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateAri_calculator(input: Ari_calculatorInput): Ari_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Ari_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
