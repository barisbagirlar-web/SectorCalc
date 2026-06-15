// Auto-generated from turnover-cost-calculator-schema.json
import * as z from 'zod';

export interface Turnover_cost_calculatorInput {
  num_employees: number;
  annual_turnover_rate: number;
  avg_salary: number;
  recruitment_cost_per_hire: number;
  onboarding_cost_per_hire: number;
  training_cost_per_hire: number;
  lost_productivity_months: number;
  productivity_factor: number;
  severance_cost_per_leaver: number;
  exit_interview_cost_per_leaver: number;
  overtime_cover_cost_per_leaver: number;
  quality_defect_cost_per_leaver: number;
  customer_impact_cost_per_leaver: number;
  knowledge_loss_cost_per_leaver: number;
  include_indirect_costs: boolean;
}

export const Turnover_cost_calculatorInputSchema = z.object({
  num_employees: z.number().min(1).max(100000).default(100),
  annual_turnover_rate: z.number().min(0).max(100).default(15),
  avg_salary: z.number().min(0).max(500000).default(50000),
  recruitment_cost_per_hire: z.number().min(0).max(100000).default(4000),
  onboarding_cost_per_hire: z.number().min(0).max(50000).default(3000),
  training_cost_per_hire: z.number().min(0).max(100000).default(5000),
  lost_productivity_months: z.number().min(0).max(12).default(3),
  productivity_factor: z.number().min(0).max(100).default(50),
  severance_cost_per_leaver: z.number().min(0).max(100000).default(2000),
  exit_interview_cost_per_leaver: z.number().min(0).max(5000).default(200),
  overtime_cover_cost_per_leaver: z.number().min(0).max(50000).default(1500),
  quality_defect_cost_per_leaver: z.number().min(0).max(50000).default(1000),
  customer_impact_cost_per_leaver: z.number().min(0).max(100000).default(2000),
  knowledge_loss_cost_per_leaver: z.number().min(0).max(100000).default(3000),
  include_indirect_costs: z.boolean().default(true),
});

function evaluateAllFormulas(input: Turnover_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["num_leavers"] = input.num_employees * (input.annual_turnover_rate / 100); } catch { results["num_leavers"] = 0; }
  try { results["direct_costs"] = (results["num_leavers"] ?? 0) * (input.recruitment_cost_per_hire + input.onboarding_cost_per_hire + input.training_cost_per_hire + input.severance_cost_per_leaver + input.exit_interview_cost_per_leaver + input.overtime_cover_cost_per_leaver); } catch { results["direct_costs"] = 0; }
  try { results["lost_productivity_cost"] = (results["num_leavers"] ?? 0) * (input.avg_salary / 12) * input.lost_productivity_months * (1 - (input.productivity_factor / 100)); } catch { results["lost_productivity_cost"] = 0; }
  try { results["indirect_costs"] = input.include_indirect_costs ? (results["num_leavers"] ?? 0) * (input.quality_defect_cost_per_leaver + input.customer_impact_cost_per_leaver + input.knowledge_loss_cost_per_leaver) : 0; } catch { results["indirect_costs"] = 0; }
  try { results["total_turnover_cost"] = (results["direct_costs"] ?? 0) + (results["lost_productivity_cost"] ?? 0) + (results["indirect_costs"] ?? 0); } catch { results["total_turnover_cost"] = 0; }
  try { results["cost_per_leaver"] = (results["num_leavers"] ?? 0) > 0 ? (results["total_turnover_cost"] ?? 0) / (results["num_leavers"] ?? 0) : 0; } catch { results["cost_per_leaver"] = 0; }
  try { results["turnover_cost_percentage_of_payroll"] = ((results["total_turnover_cost"] ?? 0) / (input.num_employees * input.avg_salary)) * 100; } catch { results["turnover_cost_percentage_of_payroll"] = 0; }
  return results;
}


export function calculateTurnover_cost_calculator(input: Turnover_cost_calculatorInput): Turnover_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_turnover_cost"] ?? 0;
  const breakdown = {
    direct_costs: values["direct_costs"] ?? 0,
    lost_productivity_cost: values["lost_productivity_cost"] ?? 0,
    indirect_costs: values["indirect_costs"] ?? 0,
    cost_per_leaver: values["cost_per_leaver"] ?? 0,
    turnover_cost_percentage_of_payroll: values["turnover_cost_percentage_of_payroll"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Recruitment Efficiency Gap","Extended Onboarding Duration","Low Training Effectiveness","Knowledge Retention Risk"];
  const suggestedActions: string[] = ["Implement Retention Program","Improve Onboarding Process","Optimize Recruitment Channels","Deploy Knowledge Management System","Strengthen Quality Training"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry averages","Customizable cost multipliers"],
  };
}


export interface Turnover_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { direct_costs: number; lost_productivity_cost: number; indirect_costs: number; cost_per_leaver: number; turnover_cost_percentage_of_payroll: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
