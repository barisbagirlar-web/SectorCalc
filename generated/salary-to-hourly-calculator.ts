// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Salary_to_hourly_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annual_salary + input.work_hours_per_week + input.paid_weeks_per_year; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annual_salary + input.work_hours_per_week + input.paid_weeks_per_year; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSalary_to_hourly_calculator(input: Salary_to_hourly_calculatorInput): Salary_to_hourly_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
