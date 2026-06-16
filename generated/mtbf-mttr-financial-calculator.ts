// Auto-generated from mtbf-mttr-financial-calculator-schema.json
import * as z from 'zod';

export interface Mtbf_mttr_financial_calculatorInput {
  operating_hours_per_year: number;
  number_of_units: number;
  mtbf: number;
  mttr: number;
  cost_per_downtime_hour: number;
  cost_per_failure_event: number;
  maintenance_labor_rate: number;
  reliability_improvement_investment: number;
  availability_target: number;
  industry_benchmark_mtbf: number;
}

export const Mtbf_mttr_financial_calculatorInputSchema = z.object({
  operating_hours_per_year: z.number().min(1).max(8760).default(8760),
  number_of_units: z.number().min(1).max(10000).default(10),
  mtbf: z.number().min(1).max(100000).default(500),
  mttr: z.number().min(0.1).max(1000).default(4),
  cost_per_downtime_hour: z.number().min(0).max(1000000).default(1000),
  cost_per_failure_event: z.number().min(0).max(100000).default(500),
  maintenance_labor_rate: z.number().min(0).max(500).default(75),
  reliability_improvement_investment: z.number().min(0).max(10000000).default(0),
  availability_target: z.number().min(0).max(100).default(95),
  industry_benchmark_mtbf: z.number().min(1).max(100000).default(1000),
});

function evaluateAllFormulas(input: Mtbf_mttr_financial_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / MTBF; results["failure_rate"] = Number.isFinite(v) ? v : 0; } catch { results["failure_rate"] = 0; }
  try { const v = input.operating_hours_per_year / MTBF; results["annual_failures_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["annual_failures_per_unit"] = 0; }
  try { const v = F_unit * input.number_of_units; results["total_annual_failures"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_failures"] = 0; }
  try { const v = F_total * MTTR; results["annual_downtime_hours"] = Number.isFinite(v) ? v : 0; } catch { results["annual_downtime_hours"] = 0; }
  try { const v = MTBF / (MTBF + MTTR) * 100; results["availability"] = Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = Downtime_hours * (input.cost_per_downtime_hour + input.maintenance_labor_rate); results["total_downtime_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_downtime_cost"] = 0; }
  try { const v = Downtime_cost + (F_total * input.cost_per_failure_event) + (F_total * MTTR * input.maintenance_labor_rate); results["total_failure_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_failure_cost"] = 0; }
  try { const v = Failure_cost + input.reliability_improvement_investment; results["net_financial_impact"] = Number.isFinite(v) ? v : 0; } catch { results["net_financial_impact"] = 0; }
  return results;
}


export function calculateMtbf_mttr_financial_calculator(input: Mtbf_mttr_financial_calculatorInput): Mtbf_mttr_financial_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_financial_impact"] ?? 0;
  const breakdown = {
    annual_downtime_hours: values["annual_downtime_hours"] ?? 0,
    total_annual_failures: values["total_annual_failures"] ?? 0,
    availability: values["availability"] ?? 0,
    total_downtime_cost: values["total_downtime_cost"] ?? 0,
    total_failure_cost: values["total_failure_cost"] ?? 0,
    cost_per_failure: values["cost_per_failure"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive MTTR","Low MTBF relative to benchmark","High cost per failure event","Underinvestment in Reliability"];
  const suggestedActions: string[] = ["Reduce MTTR","Increase MTBF","Optimize Maintenance Labor","Invest in Reliability Improvement","Benchmark and Set Targets"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Benchmarking against industry standards"],
  };
}


export interface Mtbf_mttr_financial_calculatorOutput {
  totalWasteCost: number;
  breakdown: { annual_downtime_hours: number; total_annual_failures: number; availability: number; total_downtime_cost: number; total_failure_cost: number; cost_per_failure: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
