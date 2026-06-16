// Auto-generated from hourly-rate-calculator-schema.json
import * as z from 'zod';

export interface Hourly_rate_calculatorInput {
  annualSalary: number;
  weeksWorked: number;
  hoursPerWeek: number;
  benefitsRate: number;
  overheadRate: number;
}

export const Hourly_rate_calculatorInputSchema = z.object({
  annualSalary: z.number().default(50000),
  weeksWorked: z.number().default(52),
  hoursPerWeek: z.number().default(40),
  benefitsRate: z.number().default(0.3),
  overheadRate: z.number().default(0.5),
});

function evaluateAllFormulas(input: Hourly_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualSalary * (1 + input.benefitsRate); results["annualCost"] = Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  try { const v = (results["annualCost"] ?? 0) * (1 + input.overheadRate); results["effectiveAnnualCost"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualCost"] = 0; }
  try { const v = (results["effectiveAnnualCost"] ?? 0) / (input.weeksWorked * input.hoursPerWeek); results["hourlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["hourlyRate"] = 0; }
  try { const v = (results["effectiveAnnualCost"] ?? 0) / input.weeksWorked; results["weeklyRate"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyRate"] = 0; }
  return results;
}


export function calculateHourly_rate_calculator(input: Hourly_rate_calculatorInput): Hourly_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hourlyRate"] ?? 0;
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


export interface Hourly_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
