// Auto-generated from intermittent-fasting-calculator-schema.json
import * as z from 'zod';

export interface Intermittent_fasting_calculatorInput {
  fastingStartHour: number;
  fastingDurationHours: number;
  eatingWindowDurationHours: number;
  targetDailyCalories: number;
  currentWeight: number;
  dataConfidence?: number;
}

export const Intermittent_fasting_calculatorInputSchema = z.object({
  fastingStartHour: z.number().default(20),
  fastingDurationHours: z.number().default(16),
  eatingWindowDurationHours: z.number().default(8),
  targetDailyCalories: z.number().default(2000),
  currentWeight: z.number().default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Intermittent_fasting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fastingStartHour * input.fastingDurationHours * input.eatingWindowDurationHours * input.targetDailyCalories; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.fastingStartHour * input.fastingDurationHours * input.eatingWindowDurationHours * input.targetDailyCalories * (input.currentWeight); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.currentWeight; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateIntermittent_fasting_calculator(input: Intermittent_fasting_calculatorInput): Intermittent_fasting_calculatorOutput {
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


export interface Intermittent_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
