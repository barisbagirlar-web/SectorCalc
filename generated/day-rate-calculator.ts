// Auto-generated from day-rate-calculator-schema.json
import * as z from 'zod';

export interface Day_rate_calculatorInput {
  annualSalary: number;
  workingDaysPerYear: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
  billableHoursPerDay: number;
  dataConfidence?: number;
}

export const Day_rate_calculatorInputSchema = z.object({
  annualSalary: z.number().default(100000),
  workingDaysPerYear: z.number().default(230),
  overheadPercentage: z.number().default(30),
  profitMarginPercentage: z.number().default(20),
  billableHoursPerDay: z.number().default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Day_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualSalary * (1 + input.overheadPercentage / 100) * (1 + input.profitMarginPercentage / 100)) / input.workingDaysPerYear; results["dayRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dayRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dayRate"])) / input.billableHoursPerDay; results["hourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hourlyRate"] = Number.NaN; }
  try { const v = input.annualSalary * (1 + input.overheadPercentage / 100); results["totalAnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAnnualCost"] = Number.NaN; }
  return results;
}


export function calculateDay_rate_calculator(input: Day_rate_calculatorInput): Day_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dayRate"]);
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


export interface Day_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
