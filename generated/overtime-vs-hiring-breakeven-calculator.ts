// Auto-generated from overtime-vs-hiring-breakeven-calculator-schema.json
import * as z from 'zod';

export interface Overtime_vs_hiring_breakeven_calculatorInput {
  current_headcount: number;
  avg_hourly_wage: number;
  overtime_premium: number;
  overtime_hours_per_week: number;
  hiring_cost_per_fte: number;
  annual_benefits_cost_per_fte: number;
  productivity_factor_overtime: number;
  productivity_factor_new_hire: number;
  quality_defect_rate_overtime: number;
  quality_defect_rate_normal: number;
  cost_per_defect: number;
  weekly_productive_hours_needed: number;
  weeks_per_year: number;
  include_risk_adjustment: boolean;
  risk_multiplier: number;
}

export const Overtime_vs_hiring_breakeven_calculatorInputSchema = z.object({
  current_headcount: z.number().min(1).max(10000).default(50),
  avg_hourly_wage: z.number().min(7.25).max(200).default(25),
  overtime_premium: z.number().min(1).max(3).default(1.5),
  overtime_hours_per_week: z.number().min(0).max(60).default(10),
  hiring_cost_per_fte: z.number().min(0).max(100000).default(5000),
  annual_benefits_cost_per_fte: z.number().min(0).max(100000).default(12000),
  productivity_factor_overtime: z.number().min(50).max(100).default(85),
  productivity_factor_new_hire: z.number().min(10).max(100).default(70),
  quality_defect_rate_overtime: z.number().min(0).max(20).default(2),
  quality_defect_rate_normal: z.number().min(0).max(20).default(1),
  cost_per_defect: z.number().min(0).max(10000).default(100),
  weekly_productive_hours_needed: z.number().min(1).max(100000).default(2000),
  weeks_per_year: z.number().min(1).max(52).default(52),
  include_risk_adjustment: z.boolean().default(true),
  risk_multiplier: z.number().min(1).max(3).default(1.2),
});

function evaluateAllFormulas(input: Overtime_vs_hiring_breakeven_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 40 * (1 - input.quality_defect_rate_normal / 100); results["effective_hours_per_fte_regular"] = Number.isFinite(v) ? v : 0; } catch { results["effective_hours_per_fte_regular"] = 0; }
  try { const v = input.overtime_hours_per_week * (input.productivity_factor_overtime / 100) * (1 - (input.quality_defect_rate_normal + input.quality_defect_rate_overtime) / 100); results["effective_overtime_hours_per_fte"] = Number.isFinite(v) ? v : 0; } catch { results["effective_overtime_hours_per_fte"] = 0; }
  try { const v = input.current_headcount * ((results["effective_hours_per_fte_regular"] ?? 0) + (results["effective_overtime_hours_per_fte"] ?? 0)); results["total_effective_hours_overtime_scenario"] = Number.isFinite(v) ? v : 0; } catch { results["total_effective_hours_overtime_scenario"] = 0; }
  try { const v = Math.max(0, (input.weekly_productive_hours_needed - input.current_headcount * (results["effective_hours_per_fte_regular"] ?? 0)) / (40 * (input.productivity_factor_new_hire / 100) * (1 - input.quality_defect_rate_normal / 100))); results["fte_shortfall"] = Number.isFinite(v) ? v : 0; } catch { results["fte_shortfall"] = 0; }
  try { const v = input.current_headcount * (40 * input.avg_hourly_wage * input.weeks_per_year) + input.current_headcount * (input.overtime_hours_per_week * input.avg_hourly_wage * input.overtime_premium * input.weeks_per_year) + (input.current_headcount * input.overtime_hours_per_week * (input.quality_defect_rate_normal + input.quality_defect_rate_overtime) / 100 * input.cost_per_defect * input.weeks_per_year) * (input.include_risk_adjustment ? input.risk_multiplier : 1); results["annual_cost_overtime"] = Number.isFinite(v) ? v : 0; } catch { results["annual_cost_overtime"] = 0; }
  try { const v = (input.current_headcount + (results["fte_shortfall"] ?? 0)) * (40 * input.avg_hourly_wage * input.weeks_per_year + input.annual_benefits_cost_per_fte) + (results["fte_shortfall"] ?? 0) * input.hiring_cost_per_fte + (input.current_headcount + (results["fte_shortfall"] ?? 0)) * 40 * (input.quality_defect_rate_normal / 100) * input.cost_per_defect * input.weeks_per_year; results["annual_cost_hiring"] = Number.isFinite(v) ? v : 0; } catch { results["annual_cost_hiring"] = 0; }
  try { const v = ((results["annual_cost_hiring"] ?? 0) - input.current_headcount * 40 * input.avg_hourly_wage * input.weeks_per_year) / (input.current_headcount * (input.avg_hourly_wage * input.overtime_premium * input.weeks_per_year + (input.quality_defect_rate_normal + input.quality_defect_rate_overtime) / 100 * input.cost_per_defect * input.weeks_per_year * (input.include_risk_adjustment ? input.risk_multiplier : 1))); results["breakeven_hours"] = Number.isFinite(v) ? v : 0; } catch { results["breakeven_hours"] = 0; }
  return results;
}


export function calculateOvertime_vs_hiring_breakeven_calculator(input: Overtime_vs_hiring_breakeven_calculatorInput): Overtime_vs_hiring_breakeven_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["breakeven_hours"] ?? 0;
  const breakdown = {
    annual_cost_overtime: values["annual_cost_overtime"] ?? 0,
    annual_cost_hiring: values["annual_cost_hiring"] ?? 0,
    cost_difference: values["cost_difference"] ?? 0,
    fte_shortfall: values["fte_shortfall"] ?? 0,
    total_effective_hours_overtime_scenario: values["total_effective_hours_overtime_scenario"] ?? 0,
    annual_defect_cost_overtime: values["annual_defect_cost_overtime"] ?? 0,
    annual_defect_cost_hiring: values["annual_defect_cost_hiring"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Fatigue-Induced Quality Loss","New Hire Ramp-Up Productivity Loss","Overtime Burnout & Turnover Risk"];
  const suggestedActions: string[] = ["If breakeven_hours < actual overtime hours, initiate hiring process for fte_shortfall FTEs.","Implement fatigue management protocols (job rotation, micro-breaks) to reduce overtime defect rate.","Review overtime risk multiplier annually using incident and turnover data.","Consider cross-training to increase effective regular hours per FTE and reduce overtime dependency."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario simulation","Multi-site comparison"],
  };
}


export interface Overtime_vs_hiring_breakeven_calculatorOutput {
  totalWasteCost: number;
  breakdown: { annual_cost_overtime: number; annual_cost_hiring: number; cost_difference: number; fte_shortfall: number; total_effective_hours_overtime_scenario: number; annual_defect_cost_overtime: number; annual_defect_cost_hiring: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
