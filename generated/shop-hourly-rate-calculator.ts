// Auto-generated from shop-hourly-rate-calculator-schema.json
import * as z from 'zod';

export interface Shop_hourly_rate_calculatorInput {
  direct_labor_hourly_rate: number;
  num_direct_labor_employees: number;
  annual_operating_hours_per_employee: number;
  total_annual_overhead_costs: number;
  total_annual_machine_costs: number;
  average_shop_efficiency_percent: number;
  quality_yield_percent: number;
  shift_premium_factor: number;
  include_benefits: boolean;
  overhead_allocation_method: string;
}

export const Shop_hourly_rate_calculatorInputSchema = z.object({
  direct_labor_hourly_rate: z.number().min(7.25).max(150).default(25),
  num_direct_labor_employees: z.number().min(1).max(500).default(10),
  annual_operating_hours_per_employee: z.number().min(1000).max(3000).default(2080),
  total_annual_overhead_costs: z.number().min(0).max(10000000).default(500000),
  total_annual_machine_costs: z.number().min(0).max(5000000).default(200000),
  average_shop_efficiency_percent: z.number().min(10).max(100).default(85),
  quality_yield_percent: z.number().min(50).max(100).default(95),
  shift_premium_factor: z.number().min(1).max(2).default(1),
  include_benefits: z.boolean().default(true),
  overhead_allocation_method: z.enum(['direct_labor_hours', 'machine_hours', 'total_labor_cost']).default('direct_labor_hours'),
});

function evaluateAllFormulas(input: Shop_hourly_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.direct_labor_hourly_rate * (1 + (input.include_benefits ? 0.30 : 0)) * input.shift_premium_factor; results["effective_labor_rate"] = Number.isFinite(v) ? v : 0; } catch { results["effective_labor_rate"] = 0; }
  try { const v = input.num_direct_labor_employees * input.annual_operating_hours_per_employee; results["total_direct_labor_hours"] = Number.isFinite(v) ? v : 0; } catch { results["total_direct_labor_hours"] = 0; }
  try { const v = input.total_annual_overhead_costs / (results["total_direct_labor_hours"] ?? 0); results["overhead_rate_per_hour"] = Number.isFinite(v) ? v : 0; } catch { results["overhead_rate_per_hour"] = 0; }
  try { const v = input.total_annual_machine_costs / (results["total_direct_labor_hours"] ?? 0); results["machine_rate_per_hour"] = Number.isFinite(v) ? v : 0; } catch { results["machine_rate_per_hour"] = 0; }
  try { const v = (results["effective_labor_rate"] ?? 0) + (results["overhead_rate_per_hour"] ?? 0) + (results["machine_rate_per_hour"] ?? 0); results["gross_hourly_rate"] = Number.isFinite(v) ? v : 0; } catch { results["gross_hourly_rate"] = 0; }
  try { const v = (input.average_shop_efficiency_percent / 100) * (input.quality_yield_percent / 100); results["efficiency_adjustment_factor"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency_adjustment_factor"] = 0; }
  try { const v = (results["gross_hourly_rate"] ?? 0) / (results["efficiency_adjustment_factor"] ?? 0); results["true_shop_hourly_rate"] = Number.isFinite(v) ? v : 0; } catch { results["true_shop_hourly_rate"] = 0; }
  return results;
}


export function calculateShop_hourly_rate_calculator(input: Shop_hourly_rate_calculatorInput): Shop_hourly_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["true_shop_hourly_rate"] ?? 0;
  const breakdown = {
    effective_labor_rate: values["effective_labor_rate"] ?? 0,
    overhead_rate_per_hour: values["overhead_rate_per_hour"] ?? 0,
    machine_rate_per_hour: values["machine_rate_per_hour"] ?? 0,
    gross_hourly_rate: values["gross_hourly_rate"] ?? 0,
    efficiency_adjustment_factor: values["efficiency_adjustment_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Downtime Loss","Speed Loss","Quality Loss (Rework & Scrap)","Indirect Labor Burden"];
  const suggestedActions: string[] = ["Implement TPM (Total Productive Maintenance)","Deploy Six Sigma DMAIC for top defect causes","Review overhead allocation and reduce non-value-added costs","Standardize work procedures to reduce speed loss"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Benchmarking against industry standards"],
  };
}


export interface Shop_hourly_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: { effective_labor_rate: number; overhead_rate_per_hour: number; machine_rate_per_hour: number; gross_hourly_rate: number; efficiency_adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
