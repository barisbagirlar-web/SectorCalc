// Auto-generated from age-in-minutes-calculator-schema.json
import * as z from 'zod';

export interface Age_in_minutes_calculatorInput {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
}

export const Age_in_minutes_calculatorInputSchema = z.object({
  years: z.number().default(0),
  months: z.number().default(0),
  days: z.number().default(0),
  hours: z.number().default(0),
  minutes: z.number().default(0),
});

function evaluateAllFormulas(input: Age_in_minutes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.years * 365.25 * 24 * 60; results["yearsInMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["yearsInMinutes"] = 0; }
  try { const v = input.months * 30.44 * 24 * 60; results["monthsInMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["monthsInMinutes"] = 0; }
  try { const v = input.days * 24 * 60; results["daysInMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["daysInMinutes"] = 0; }
  try { const v = input.hours * 60; results["hoursInMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["hoursInMinutes"] = 0; }
  try { const v = (results["yearsInMinutes"] ?? 0) + (results["monthsInMinutes"] ?? 0) + (results["daysInMinutes"] ?? 0) + (results["hoursInMinutes"] ?? 0) + input.minutes; results["totalMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalMinutes"] = 0; }
  return results;
}


export function calculateAge_in_minutes_calculator(input: Age_in_minutes_calculatorInput): Age_in_minutes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMinutes"] ?? 0;
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


export interface Age_in_minutes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
