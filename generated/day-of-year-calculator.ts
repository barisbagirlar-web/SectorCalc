// Auto-generated from day-of-year-calculator-schema.json
import * as z from 'zod';

export interface Day_of_year_calculatorInput {
  month: number;
  day: number;
  year: number;
  fiscalStartMonth: number;
  fiscalStartDay: number;
  dataConfidence?: number;
}

export const Day_of_year_calculatorInputSchema = z.object({
  month: z.number().default(1),
  day: z.number().default(1),
  year: z.number().default(2023),
  fiscalStartMonth: z.number().default(1),
  fiscalStartDay: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Day_of_year_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.month * input.day * input.year * input.fiscalStartMonth; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.month * input.day * input.year * input.fiscalStartMonth * (input.fiscalStartDay); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.fiscalStartDay; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDay_of_year_calculator(input: Day_of_year_calculatorInput): Day_of_year_calculatorOutput {
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


export interface Day_of_year_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
