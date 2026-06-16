// Auto-generated from npv-calculator-schema.json
import * as z from 'zod';

export interface Npv_calculatorInput {
  initial_investment: number;
  discount_rate: number;
  project_life_years: number;
  annual_cash_inflow: number;
  annual_cash_outflow: number;
  salvage_value: number;
  inflation_rate: number;
  tax_rate: number;
  depreciation_method: string;
  include_sensitivity: boolean;
}

export const Npv_calculatorInputSchema = z.object({
  initial_investment: z.number().min(0).max(100000000).default(100000),
  discount_rate: z.number().min(0).max(100).default(8),
  project_life_years: z.number().min(1).max(50).default(10),
  annual_cash_inflow: z.number().min(0).max(100000000).default(25000),
  annual_cash_outflow: z.number().min(0).max(100000000).default(5000),
  salvage_value: z.number().min(0).max(100000000).default(10000),
  inflation_rate: z.number().min(0).max(100).default(2),
  tax_rate: z.number().min(0).max(100).default(25),
  depreciation_method: z.enum(['straight_line', 'double_declining', 'sum_of_years_digits']).default('straight_line'),
  include_sensitivity: z.boolean().default(true),
});

function evaluateAllFormulas(input: Npv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annual_cash_inflow - input.annual_cash_outflow) * (1 - input.tax_rate/100) + ((results["depreciation_expense"] ?? 0) * (input.tax_rate/100)); results["annual_net_cash_flow"] = Number.isFinite(v) ? v : 0; } catch { results["annual_net_cash_flow"] = 0; }
  results["depreciation_expense"] = 0;
  try { const v = 1 / (1 + (input.discount_rate/100))^t; results["present_value_factor"] = Number.isFinite(v) ? v : 0; } catch { results["present_value_factor"] = 0; }
  results["npv"] = 0;
  results["irr"] = 0;
  try { const v = input.initial_investment / (results["annual_net_cash_flow"] ?? 0); results["payback_period"] = Number.isFinite(v) ? v : 0; } catch { results["payback_period"] = 0; }
  try { const v = ((results["npv"] ?? 0) + input.initial_investment) / input.initial_investment; results["profitability_index"] = Number.isFinite(v) ? v : 0; } catch { results["profitability_index"] = 0; }
  return results;
}


export function calculateNpv_calculator(input: Npv_calculatorInput): Npv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["npv"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    unit: values["unit"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Discount Rate Erosion","Inflation Mismatch","Low Tax Shield Utilization"];
  const suggestedActions: string[] = ["Reduce Initial Investment","Increase Annual Inflow","Switch to Accelerated Depreciation","Extend Project Life"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-scenario comparison"],
  };
}


export interface Npv_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; unit: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
