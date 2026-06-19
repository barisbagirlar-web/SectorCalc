// Auto-generated from hourly-rate-calculator-schema.json
import * as z from 'zod';

export interface Hourly_rate_calculatorInput {
  annualSalary: number;
  weeksWorked: number;
  hoursPerWeek: number;
  benefitsRate: number;
  overheadRate: number;
  dataConfidence?: number;
}

export const Hourly_rate_calculatorInputSchema = z.object({
  annualSalary: z.number().default(50000),
  weeksWorked: z.number().default(52),
  hoursPerWeek: z.number().default(40),
  benefitsRate: z.number().default(0.3),
  overheadRate: z.number().default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hourly_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualSalary * (1 + input.benefitsRate); results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  try { const v = (asFormulaNumber(results["annualCost"])) * (1 + input.overheadRate); results["effectiveAnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualCost"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveAnnualCost"])) / (input.weeksWorked * input.hoursPerWeek); results["hourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hourlyRate"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveAnnualCost"])) / input.weeksWorked; results["weeklyRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weeklyRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHourly_rate_calculator(input: Hourly_rate_calculatorInput): Hourly_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["hourlyRate"]));
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


export interface Hourly_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
