// Auto-generated from weeks-to-months-calculator-schema.json
import * as z from 'zod';

export interface Weeks_to_months_calculatorInput {
  weeks: number;
  daysPerWeek: number;
  daysPerMonth: number;
  workDaysPerWeek: number;
  workDaysPerMonth: number;
  precision: number;
}

export const Weeks_to_months_calculatorInputSchema = z.object({
  weeks: z.number().default(4),
  daysPerWeek: z.number().default(7),
  daysPerMonth: z.number().default(30.44),
  workDaysPerWeek: z.number().default(5),
  workDaysPerMonth: z.number().default(22),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Weeks_to_months_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.weeks * input.daysPerWeek) / input.daysPerMonth; results["monthsCalendar"] = Number.isFinite(v) ? v : 0; } catch { results["monthsCalendar"] = 0; }
  try { const v = (input.weeks * input.workDaysPerWeek) / input.workDaysPerMonth; results["monthsWorking"] = Number.isFinite(v) ? v : 0; } catch { results["monthsWorking"] = 0; }
  try { const v = Math.round((results["monthsCalendar"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["roundedCalendar"] = Number.isFinite(v) ? v : 0; } catch { results["roundedCalendar"] = 0; }
  return results;
}


export function calculateWeeks_to_months_calculator(input: Weeks_to_months_calculatorInput): Weeks_to_months_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedCalendar"] ?? 0;
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


export interface Weeks_to_months_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
