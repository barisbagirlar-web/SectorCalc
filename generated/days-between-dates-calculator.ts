// Auto-generated from days-between-dates-calculator-schema.json
import * as z from 'zod';

export interface Days_between_dates_calculatorInput {
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
}

export const Days_between_dates_calculatorInputSchema = z.object({
  startYear: z.number().default(2024),
  startMonth: z.number().default(1),
  startDay: z.number().default(1),
  endYear: z.number().default(2024),
  endMonth: z.number().default(12),
  endDay: z.number().default(31),
});

function evaluateAllFormulas(input: Days_between_dates_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = `${input.startYear}-${String(input.startMonth).padStart(2, '0')}-${String(input.startDay).padStart(2, '0')}`; results["startDateISO"] = Number.isFinite(v) ? v : 0; } catch { results["startDateISO"] = 0; }
  try { const v = `${input.endYear}-${String(input.endMonth).padStart(2, '0')}-${String(input.endDay).padStart(2, '0')}`; results["endDateISO"] = Number.isFinite(v) ? v : 0; } catch { results["endDateISO"] = 0; }
  try { const v = (new Date(input.endYear, input.endMonth - 1, input.endDay) - new Date(input.startYear, input.startMonth - 1, input.startDay)) / (1000 * 60 * 60 * 24); results["daysBetween"] = Number.isFinite(v) ? v : 0; } catch { results["daysBetween"] = 0; }
  return results;
}


export function calculateDays_between_dates_calculator(input: Days_between_dates_calculatorInput): Days_between_dates_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["daysBetween"] ?? 0;
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


export interface Days_between_dates_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
