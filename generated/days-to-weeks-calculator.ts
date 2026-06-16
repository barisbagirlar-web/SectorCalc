// Auto-generated from days-to-weeks-calculator-schema.json
import * as z from 'zod';

export interface Days_to_weeks_calculatorInput {
  totalDays: number;
  daysPerWeek: number;
  precision: number;
  showRemainder: number;
}

export const Days_to_weeks_calculatorInputSchema = z.object({
  totalDays: z.number().default(0),
  daysPerWeek: z.number().default(7),
  precision: z.number().default(2),
  showRemainder: z.number().default(1),
});

function evaluateAllFormulas(input: Days_to_weeks_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const totalDays = input.totalDays; let daysPerWeek = input.daysPerWeek; if (input.daysPerWeek <= 0) input.daysPerWeek = 7; const precision = input.precision; const showRemainder = input.showRemainder; const weeks = input.totalDays / input.daysPerWeek; const roundedWeeks = Math.round(weeks * Math.pow(10, input.precision)) / Math.pow(10, input.precision); const fullWeeks = Math.floor(input.totalDays / input.daysPerWeek); let remainderDays = input.totalDays - fullWeeks * input.daysPerWeek; remainderDays = Math.round(remainderDays * 1e6) / 1e6; return { primary: roundedWeeks, breakdown: input.showRemainder === 1 ? [fullWeeks, remainderDays] : [] }; })(); results["compute"] = Number.isFinite(v) ? v : 0; } catch { results["compute"] = 0; }
  return results;
}


export function calculateDays_to_weeks_calculator(input: Days_to_weeks_calculatorInput): Days_to_weeks_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weeks"] ?? 0;
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


export interface Days_to_weeks_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
