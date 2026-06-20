// Auto-generated from working-days-calculator-schema.json
import * as z from 'zod';

export interface Working_days_calculatorInput {
  startDate: number;
  endDate: number;
  includeStart: number;
  includeEnd: number;
  weekendDaysPerWeek: number;
  holidays: number;
  dataConfidence?: number;
}

export const Working_days_calculatorInputSchema = z.object({
  startDate: z.number().default(44927),
  endDate: z.number().default(44957),
  includeStart: z.number().default(1),
  includeEnd: z.number().default(1),
  weekendDaysPerWeek: z.number().default(2),
  holidays: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Working_days_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endDate - input.startDate + input.includeStart + input.includeEnd - 1; results["totalCalendarDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCalendarDays"] = Number.NaN; }
  try { const v = (input.weekendDaysPerWeek / 7) * (toNumericFormulaValue(results["totalCalendarDays"])); results["estimatedWeekendDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimatedWeekendDays"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCalendarDays"])) - (toNumericFormulaValue(results["estimatedWeekendDays"])) - input.holidays; results["workingDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["workingDays"] = Number.NaN; }
  try { const v = input.holidays; results["holidays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["holidays"] = Number.NaN; }
  return results;
}


export function calculateWorking_days_calculator(input: Working_days_calculatorInput): Working_days_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["workingDays"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Working_days_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
