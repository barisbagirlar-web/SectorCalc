// Auto-generated from absenteeism-cost-calculator-schema.json
import * as z from 'zod';

export interface Absenteeism_cost_calculatorInput {
  total_employees: number;
  absenteeism_rate: number;
  avg_hourly_wage: number;
  avg_hours_per_day: number;
  working_days_per_year: number;
  replacement_cost_per_hour: number;
  overhead_multiplier: number;
  industry_type: string;
  include_overtime_penalty: boolean;
}

export const Absenteeism_cost_calculatorInputSchema = z.object({
  total_employees: z.number().min(1).max(100000).default(500),
  absenteeism_rate: z.number().min(0).max(100).default(3.5),
  avg_hourly_wage: z.number().min(7.25).max(200).default(25),
  avg_hours_per_day: z.number().min(1).max(16).default(8),
  working_days_per_year: z.number().min(1).max(365).default(250),
  replacement_cost_per_hour: z.number().min(0).max(500).default(35),
  overhead_multiplier: z.number().min(1).max(5).default(1.3),
  industry_type: z.enum(['Manufacturing', 'Healthcare', 'Retail', 'Logistics', 'Professional Services', 'Construction']).default('Manufacturing'),
  include_overtime_penalty: z.boolean().default(true),
});

function evaluateAllFormulas(input: Absenteeism_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["total_scheduled_hours"] = input.total_employees * input.avg_hours_per_day * input.working_days_per_year; } catch { results["total_scheduled_hours"] = 0; }
  try { results["absent_hours"] = (results["total_scheduled_hours"] ?? 0) * (input.absenteeism_rate / 100); } catch { results["absent_hours"] = 0; }
  try { results["direct_labor_cost"] = (results["absent_hours"] ?? 0) * input.avg_hourly_wage; } catch { results["direct_labor_cost"] = 0; }
  try { results["replacement_cost"] = (results["absent_hours"] ?? 0) * input.replacement_cost_per_hour * (input.include_overtime_penalty ? 1.5 : 1.0); } catch { results["replacement_cost"] = 0; }
  try { results["overhead_cost"] = (results["direct_labor_cost"] ?? 0) * (input.overhead_multiplier - 1); } catch { results["overhead_cost"] = 0; }
  try { results["total_annual_cost"] = (results["direct_labor_cost"] ?? 0) + (results["replacement_cost"] ?? 0) + (results["overhead_cost"] ?? 0); } catch { results["total_annual_cost"] = 0; }
  try { results["cost_per_absent_hour"] = (results["total_annual_cost"] ?? 0) / (results["absent_hours"] ?? 0); } catch { results["cost_per_absent_hour"] = 0; }
  return results;
}


export function calculateAbsenteeism_cost_calculator(input: Absenteeism_cost_calculatorInput): Absenteeism_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_cost"] ?? 0;
  const breakdown = {
    direct_labor_cost: values["direct_labor_cost"] ?? 0,
    replacement_cost: values["replacement_cost"] ?? 0,
    overhead_cost: values["overhead_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Lost Productivity (Quality & Rework)","Morale & Turnover Impact","Customer Service Impact"];
  const suggestedActions: string[] = ["Implement predictive attendance analytics to identify high-risk employees.","Introduce cross-training program to reduce replacement cost.","Conduct root cause analysis using Six Sigma (DMAIC) for departments with >5% absenteeism.","Review and adjust overtime policies to minimize penalty costs.","Enhance employee wellness programs to improve overall attendance."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Automated alerts via email"],
  };
}


export interface Absenteeism_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { direct_labor_cost: number; replacement_cost: number; overhead_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
