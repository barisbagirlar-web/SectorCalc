// Auto-generated from day-rate-calculator-schema.json
import * as z from 'zod';

export interface Day_rate_calculatorInput {
  annualSalary: number;
  workingDaysPerYear: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
  billableHoursPerDay: number;
}

export const Day_rate_calculatorInputSchema = z.object({
  annualSalary: z.number().default(100000),
  workingDaysPerYear: z.number().default(230),
  overheadPercentage: z.number().default(30),
  profitMarginPercentage: z.number().default(20),
  billableHoursPerDay: z.number().default(8),
});

function evaluateAllFormulas(input: Day_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualSalary * (1 + input.overheadPercentage / 100) * (1 + input.profitMarginPercentage / 100)) / input.workingDaysPerYear; results["dayRate"] = Number.isFinite(v) ? v : 0; } catch { results["dayRate"] = 0; }
  try { const v = (results["dayRate"] ?? 0) / input.billableHoursPerDay; results["hourlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["hourlyRate"] = 0; }
  try { const v = input.annualSalary * (1 + input.overheadPercentage / 100); results["totalAnnualCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualCost"] = 0; }
  return results;
}


export function calculateDay_rate_calculator(input: Day_rate_calculatorInput): Day_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dayRate"] ?? 0;
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


export interface Day_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
