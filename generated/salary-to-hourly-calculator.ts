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

function evaluateAllFormulas(input: Salary_to_hourly_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_salary / (input.work_hours_per_week * input.paid_weeks_per_year); results["base_hourly_rate"] = Number.isFinite(v) ? v : 0; } catch { results["base_hourly_rate"] = 0; }
  try { const v = (results["base_hourly_rate"] ?? 0) * input.overtime_multiplier * (1 + input.benefits_percentage / 100); results["overtime_cost_per_hour"] = Number.isFinite(v) ? v : 0; } catch { results["overtime_cost_per_hour"] = 0; }
  try { const v = (results["base_hourly_rate"] ?? 0) * (input.benefits_percentage / 100); results["benefits_cost_per_hour"] = Number.isFinite(v) ? v : 0; } catch { results["benefits_cost_per_hour"] = 0; }
  try { const v = (input.shift_type === 'day' ? 0 : (input.shift_type === 'night' ? 0.15 : (input.shift_type === 'rotating' ? 0.10 : 0))); results["shift_differential"] = Number.isFinite(v) ? v : 0; } catch { results["shift_differential"] = 0; }
  results["productivity_factor"] = 0;
  try { const v = ((results["base_hourly_rate"] ?? 0) + (results["benefits_cost_per_hour"] ?? 0)) * (1 + (results["shift_differential"] ?? 0)) / (results["productivity_factor"] ?? 0); results["effective_hourly_rate"] = Number.isFinite(v) ? v : 0; } catch { results["effective_hourly_rate"] = 0; }
  try { const v = (results["effective_hourly_rate"] ?? 0) * input.work_hours_per_week * input.paid_weeks_per_year; results["total_annual_labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_labor_cost"] = 0; }
  return results;
}


export function calculateSalary_to_hourly_calculator(input: Salary_to_hourly_calculatorInput): Salary_to_hourly_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hourly_rate"] ?? 0;
  const breakdown = {
    base_hourly_rate: values["base_hourly_rate"] ?? 0,
    benefits_cost_per_hour: values["benefits_cost_per_hour"] ?? 0,
    overtime_cost_per_hour: values["overtime_cost_per_hour"] ?? 0,
    shift_differential_applied: values["shift_differential_applied"] ?? 0,
    productivity_factor_applied: values["productivity_factor_applied"] ?? 0,
    total_annual_labor_cost: values["total_annual_labor_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unpaid breaks reduce effective hourly rate; consider including in work hours.","Costs for new hire training and ramp-up time not captured in base salary.","Replacement and coverage costs due to absenteeism or turnover.","Labor law compliance, record-keeping, and HR administration costs."];
  const suggestedActions: string[] = ["If overtime cost per hour exceeds $100, consider hiring part-time staff or redistributing workload.","If benefits percentage > 50%, benchmark against industry (WERC/ISO) to identify cost reduction opportunities.","For night/rotating shifts, evaluate if shift differential can be offset by productivity gains.","If productivity factor is below 0.85, implement Lean/Six Sigma initiatives to reduce waste."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-currency conversion","Benchmarking against industry standards"],
  };
}


export interface Salary_to_hourly_calculatorOutput {
  totalWasteCost: number;
  breakdown: { base_hourly_rate: number; benefits_cost_per_hour: number; overtime_cost_per_hour: number; shift_differential_applied: number; productivity_factor_applied: number; total_annual_labor_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
