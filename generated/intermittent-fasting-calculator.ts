// @ts-nocheck
// Auto-generated from intermittent-fasting-calculator-schema.json
import * as z from 'zod';

export interface Intermittent_fasting_calculatorInput {
  fastingStartHour: number;
  fastingDurationHours: number;
  eatingWindowDurationHours: number;
  targetDailyCalories: number;
  currentWeight: number;
}

export const Intermittent_fasting_calculatorInputSchema = z.object({
  fastingStartHour: z.number().default(20),
  fastingDurationHours: z.number().default(16),
  eatingWindowDurationHours: z.number().default(8),
  targetDailyCalories: z.number().default(2000),
  currentWeight: z.number().default(70),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Intermittent_fasting_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fastingStartHour * input.fastingDurationHours * input.eatingWindowDurationHours * input.targetDailyCalories; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.fastingStartHour * input.fastingDurationHours * input.eatingWindowDurationHours * input.targetDailyCalories * (input.currentWeight); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.currentWeight; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIntermittent_fasting_calculator(input: Intermittent_fasting_calculatorInput): Intermittent_fasting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Intermittent_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
