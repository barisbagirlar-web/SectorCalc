// Auto-generated from total-employee-cost-calculator-schema.json
import * as z from 'zod';

export interface Total_employee_cost_calculatorInput {
  base_salary: number;
  bonus_percent: number;
  benefits_percent: number;
  payroll_tax_percent: number;
  overhead_percent: number;
  training_cost: number;
  productivity_factor: number;
  turnover_rate: number;
  replacement_cost_percent: number;
  overtime_hours_per_week: number;
  overtime_premium: number;
  currency: string;
  include_hidden_costs: boolean;
}

export const Total_employee_cost_calculatorInputSchema = z.object({
  base_salary: z.number().min(0).max(10000000).default(60000),
  bonus_percent: z.number().min(0).max(100).default(10),
  benefits_percent: z.number().min(0).max(100).default(30),
  payroll_tax_percent: z.number().min(0).max(20).default(7.65),
  overhead_percent: z.number().min(0).max(100).default(20),
  training_cost: z.number().min(0).max(100000).default(1500),
  productivity_factor: z.number().min(0).max(1).default(0.85),
  turnover_rate: z.number().min(0).max(100).default(15),
  replacement_cost_percent: z.number().min(0).max(200).default(20),
  overtime_hours_per_week: z.number().min(0).max(40).default(2),
  overtime_premium: z.number().min(1).max(3).default(1.5),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CHF']).default('USD'),
  include_hidden_costs: z.boolean().default(true),
});

function evaluateAllFormulas(input: Total_employee_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["direct_compensation"] = input.base_salary * (1 + input.bonus_percent / 100); } catch { results["direct_compensation"] = 0; }
  try { results["benefits_and_taxes"] = input.base_salary * ((input.benefits_percent + input.payroll_tax_percent) / 100); } catch { results["benefits_and_taxes"] = 0; }
  try { results["overhead_cost"] = ((results["direct_compensation"] ?? 0) + (results["benefits_and_taxes"] ?? 0)) * (input.overhead_percent / 100); } catch { results["overhead_cost"] = 0; }
  try { results["overtime_cost"] = (input.base_salary / 2080) * input.overtime_hours_per_week * 52 * input.overtime_premium; } catch { results["overtime_cost"] = 0; }
  try { results["turnover_cost"] = input.base_salary * (input.turnover_rate / 100) * (input.replacement_cost_percent / 100); } catch { results["turnover_cost"] = 0; }
  try { results["hidden_loss_drivers"] = ((input.include_hidden_costs) ? (((results["direct_compensation"] ?? 0) + (results["benefits_and_taxes"] ?? 0)) * 0.05) : (0)); } catch { results["hidden_loss_drivers"] = 0; }
  try { results["total_employee_cost"] = (results["direct_compensation"] ?? 0) + (results["benefits_and_taxes"] ?? 0) + (results["overhead_cost"] ?? 0) + input.training_cost + (results["overtime_cost"] ?? 0) + (results["turnover_cost"] ?? 0) + (results["hidden_loss_drivers"] ?? 0); } catch { results["total_employee_cost"] = 0; }
  return results;
}


export function calculateTotal_employee_cost_calculator(input: Total_employee_cost_calculatorInput): Total_employee_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_employee_cost"] ?? 0;
  const breakdown = {
    direct_compensation: values["direct_compensation"] ?? 0,
    benefits_and_taxes: values["benefits_and_taxes"] ?? 0,
    overhead_cost: values["overhead_cost"] ?? 0,
    training_cost: values["training_cost"] ?? 0,
    overtime_cost: values["overtime_cost"] ?? 0,
    turnover_cost: values["turnover_cost"] ?? 0,
    hidden_loss_drivers: values["hidden_loss_drivers"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Absenteeism Cost","Disengagement Cost","Quality Defect Cost"];
  const suggestedActions: string[] = ["Reduce Overtime","Improve Retention","Optimize Benefits","Lean Productivity Improvement"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Scenario simulation","API access"],
  };
}


export interface Total_employee_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { direct_compensation: number; benefits_and_taxes: number; overhead_cost: number; training_cost: number; overtime_cost: number; turnover_cost: number; hidden_loss_drivers: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
