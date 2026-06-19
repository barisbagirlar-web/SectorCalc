// Auto-generated from alternate-day-fasting-calculator-schema.json
import * as z from 'zod';

export interface Alternate_day_fasting_calculatorInput {
  normalCal: number;
  fastingCal: number;
  totalDays: number;
  startDay: number;
  dataConfidence?: number;
}

export const Alternate_day_fasting_calculatorInputSchema = z.object({
  normalCal: z.number().default(2000),
  fastingCal: z.number().default(500),
  totalDays: z.number().default(30),
  startDay: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Alternate_day_fasting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.normalCal * input.fastingCal * input.totalDays * input.startDay; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.normalCal * input.fastingCal * input.totalDays * input.startDay; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAlternate_day_fasting_calculator(input: Alternate_day_fasting_calculatorInput): Alternate_day_fasting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Alternate_day_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
