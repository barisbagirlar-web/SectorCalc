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
  dataConfidence?: number;
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
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Shop_hourly_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_operating_hours_per_employee; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_exposure_hours"] = Number.NaN; }
  try { const v = input.num_direct_labor_employees * (input.direct_labor_hourly_rate / 100) * input.annual_operating_hours_per_employee * input.total_annual_overhead_costs; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["direct_labor_cost"] = Number.NaN; }
  try { const v = input.num_direct_labor_employees * (input.direct_labor_hourly_rate / 100) * input.annual_operating_hours_per_employee * input.total_annual_overhead_costs; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateShop_hourly_rate_calculator(input: Shop_hourly_rate_calculatorInput): Shop_hourly_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Benchmarking against industry standards"],
  };
}


export interface Shop_hourly_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
