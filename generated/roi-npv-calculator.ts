// Auto-generated from roi-npv-calculator-schema.json
import * as z from 'zod';

export interface Roi_npv_calculatorInput {
  initial_investment: number;
  annual_cash_inflow: number;
  annual_cash_outflow: number;
  discount_rate: number;
  project_life_years: number;
  salvage_value: number;
  inflation_rate: number;
  tax_rate: number;
  depreciation_method: string;
  risk_adjustment: number;
  lean_six_sigma_savings: number;
  werc_throughput: number;
  quality_defect_rate: number;
  energy_cost_per_unit: number;
}

export const Roi_npv_calculatorInputSchema = z.object({
  initial_investment: z.number().min(0).max(100000000).default(100000),
  annual_cash_inflow: z.number().min(0).max(100000000).default(30000),
  annual_cash_outflow: z.number().min(0).max(100000000).default(5000),
  discount_rate: z.number().min(0).max(100).default(10),
  project_life_years: z.number().min(1).max(50).default(5),
  salvage_value: z.number().min(0).max(100000000).default(10000),
  inflation_rate: z.number().min(0).max(100).default(2),
  tax_rate: z.number().min(0).max(100).default(25),
  depreciation_method: z.enum(['straight_line', 'double_declining', 'sum_of_years_digits']).default('straight_line'),
  risk_adjustment: z.number().min(0.5).max(2).default(1),
  lean_six_sigma_savings: z.number().min(0).max(100000000).default(0),
  werc_throughput: z.number().min(0).max(100000000).default(10000),
  quality_defect_rate: z.number().min(0).max(100).default(1.5),
  energy_cost_per_unit: z.number().min(0).max(100).default(0.05),
});

function evaluateAllFormulas(input: Roi_npv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annual_cash_inflow - input.annual_cash_outflow + input.lean_six_sigma_savings) * (1 - input.tax_rate / 100) + ((results["depreciation_expense"] ?? 0) * (input.tax_rate / 100)); results["annual_net_cash_flow"] = Number.isFinite(v) ? v : 0; } catch { results["annual_net_cash_flow"] = 0; }
  results["depreciation_expense"] = 0;
  results["npv"] = 0;
  try { const v = ((results["npv"] ?? 0) / input.initial_investment) * 100; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  try { const v = input.initial_investment / (results["annual_net_cash_flow"] ?? 0); results["payback_period"] = Number.isFinite(v) ? v : 0; } catch { results["payback_period"] = 0; }
  try { const v = irr_approximation(input.initial_investment, (results["annual_net_cash_flow"] ?? 0), input.project_life_years, input.salvage_value); results["irr"] = Number.isFinite(v) ? v : 0; } catch { results["irr"] = 0; }
  try { const v = input.quality_defect_rate * 10000; results["six_sigma_dpmo"] = Number.isFinite(v) ? v : 0; } catch { results["six_sigma_dpmo"] = 0; }
  return results;
}


export function calculateRoi_npv_calculator(input: Roi_npv_calculatorInput): Roi_npv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["npv"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Quality Defect Cost","Energy Waste","Lean Waste (Muda)"];
  const suggestedActions: string[] = ["Reduce Defect Rate","Improve Energy Efficiency","Implement Lean Practices","Review Discount Rate"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity analysis","Multi-scenario comparison","Automated report generation"],
  };
}


export interface Roi_npv_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
