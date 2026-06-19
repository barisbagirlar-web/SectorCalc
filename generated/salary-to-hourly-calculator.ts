// Auto-generated from salary-to-hourly-calculator-schema.json
import * as z from 'zod';

export interface Salary_to_hourly_calculatorInput {
  annual_salary: number;
  work_hours_per_week: number;
  paid_weeks_per_year: number;
  overtime_multiplier: number;
  benefits_percentage: number;
  shift_type: string;
  include_productivity_factor: boolean;
  dataConfidence?: number;
}

export const Salary_to_hourly_calculatorInputSchema = z.object({
  annual_salary: z.number().min(0).max(10000000).default(50000),
  work_hours_per_week: z.number().min(1).max(168).default(40),
  paid_weeks_per_year: z.number().min(1).max(52).default(52),
  overtime_multiplier: z.number().min(1).max(3).default(1.5),
  benefits_percentage: z.number().min(0).max(100).default(30),
  shift_type: z.enum(['day', 'night', 'rotating']).default('day'),
  include_productivity_factor: z.boolean().default(true),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Salary_to_hourly_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 * input.paid_weeks_per_year * input.work_hours_per_week * (input.benefits_percentage / 100); results["annual_kwh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_kwh"] = 0; }
  try { const v = 1 * input.paid_weeks_per_year * input.work_hours_per_week * (input.benefits_percentage / 100) * input.annual_salary; results["annual_energy_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_energy_cost"] = 0; }
  try { const v = 1 * input.paid_weeks_per_year * input.work_hours_per_week * (input.benefits_percentage / 100) * input.annual_salary; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSalary_to_hourly_calculator(input: Salary_to_hourly_calculatorInput): Salary_to_hourly_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Off-shift idle load","Leak or standby losses"];
  const suggestedActions: string[] = ["Meter validate kWh per shift","Prioritize top leak sources"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-currency conversion","Benchmarking against industry standards"],
  };
}


export interface Salary_to_hourly_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
