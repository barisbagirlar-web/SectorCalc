// Auto-generated from weeks-to-months-calculator-schema.json
import * as z from 'zod';

export interface Weeks_to_months_calculatorInput {
  weeks: number;
  daysPerWeek: number;
  daysPerMonth: number;
  workDaysPerWeek: number;
  workDaysPerMonth: number;
  precision: number;
  dataConfidence?: number;
}

export const Weeks_to_months_calculatorInputSchema = z.object({
  weeks: z.number().default(4),
  daysPerWeek: z.number().default(7),
  daysPerMonth: z.number().default(30.44),
  workDaysPerWeek: z.number().default(5),
  workDaysPerMonth: z.number().default(22),
  precision: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weeks_to_months_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.weeks * input.daysPerWeek) / input.daysPerMonth; results["monthsCalendar"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthsCalendar"] = 0; }
  try { const v = (input.weeks * input.workDaysPerWeek) / input.workDaysPerMonth; results["monthsWorking"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthsWorking"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWeeks_to_months_calculator(input: Weeks_to_months_calculatorInput): Weeks_to_months_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["monthsWorking"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Weeks_to_months_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
