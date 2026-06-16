// Auto-generated from sober-date-calculator-schema.json
import * as z from 'zod';

export interface Sober_date_calculatorInput {
  startDay: number;
  startMonth: number;
  startYear: number;
  endDay: number;
  endMonth: number;
  endYear: number;
}

export const Sober_date_calculatorInputSchema = z.object({
  startDay: z.number().default(1),
  startMonth: z.number().default(1),
  startYear: z.number().default(2025),
  endDay: z.number().default(1),
  endMonth: z.number().default(1),
  endYear: z.number().default(2025),
});

function evaluateAllFormulas(input: Sober_date_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.endYear - input.startYear) * 365 + (input.endMonth - input.startMonth) * 30 + (input.endDay - input.startDay); results["totalDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalDays"] = 0; }
  try { const v = (input.endYear - input.startYear) * 365; results["yearPart"] = Number.isFinite(v) ? v : 0; } catch { results["yearPart"] = 0; }
  try { const v = (input.endMonth - input.startMonth) * 30; results["monthPart"] = Number.isFinite(v) ? v : 0; } catch { results["monthPart"] = 0; }
  try { const v = (input.endDay - input.startDay); results["dayPart"] = Number.isFinite(v) ? v : 0; } catch { results["dayPart"] = 0; }
  return results;
}


export function calculateSober_date_calculator(input: Sober_date_calculatorInput): Sober_date_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDays"] ?? 0;
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


export interface Sober_date_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
