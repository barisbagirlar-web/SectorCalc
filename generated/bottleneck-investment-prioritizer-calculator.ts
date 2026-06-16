// Auto-generated from bottleneck-investment-prioritizer-calculator-schema.json
import * as z from 'zod';

export interface Bottleneck_investment_prioritizer_calculatorInput {
  bottleneck_utilization: number;
  demand_rate: number;
  bottleneck_capacity: number;
  investment_cost: number;
  expected_capacity_increase: number;
  operating_hours_per_year: number;
  profit_margin_per_unit: number;
  quality_yield: number;
  maintenance_downtime_percent: number;
  risk_factor: string;
}

export const Bottleneck_investment_prioritizer_calculatorInputSchema = z.object({
  bottleneck_utilization: z.number().min(0).max(100).default(85),
  demand_rate: z.number().min(0).max(10000).default(100),
  bottleneck_capacity: z.number().min(0).max(10000).default(120),
  investment_cost: z.number().min(0).max(10000000).default(50000),
  expected_capacity_increase: z.number().min(0).max(200).default(20),
  operating_hours_per_year: z.number().min(0).max(8760).default(4000),
  profit_margin_per_unit: z.number().min(0).max(10000).default(5),
  quality_yield: z.number().min(0).max(100).default(95),
  maintenance_downtime_percent: z.number().min(0).max(50).default(5),
  risk_factor: z.enum(['low', 'medium', 'high']).default('medium'),
});

function evaluateAllFormulas(input: Bottleneck_investment_prioritizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bottleneck_capacity * (input.quality_yield / 100) * (1 - input.maintenance_downtime_percent / 100); results["effective_capacity"] = Number.isFinite(v) ? v : 0; } catch { results["effective_capacity"] = 0; }
  try { const v = (results["effective_capacity"] ?? 0) - input.demand_rate; results["capacity_gap"] = Number.isFinite(v) ? v : 0; } catch { results["capacity_gap"] = 0; }
  try { const v = input.bottleneck_capacity * (1 + input.expected_capacity_increase / 100) * (input.quality_yield / 100) * (1 - input.maintenance_downtime_percent / 100); results["new_capacity"] = Number.isFinite(v) ? v : 0; } catch { results["new_capacity"] = 0; }
  try { const v = Math.max(0, ((results["new_capacity"] ?? 0) - (results["effective_capacity"] ?? 0))) * input.operating_hours_per_year; results["additional_throughput"] = Number.isFinite(v) ? v : 0; } catch { results["additional_throughput"] = 0; }
  try { const v = (results["additional_throughput"] ?? 0) * input.profit_margin_per_unit; results["annual_benefit"] = Number.isFinite(v) ? v : 0; } catch { results["annual_benefit"] = 0; }
  results["roi"] = 0;
  try { const v = input.investment_cost / (results["annual_benefit"] ?? 0); results["payback_period_years"] = Number.isFinite(v) ? v : 0; } catch { results["payback_period_years"] = 0; }
  return results;
}


export function calculateBottleneck_investment_prioritizer_calculator(input: Bottleneck_investment_prioritizer_calculatorInput): Bottleneck_investment_prioritizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["investment_priority_score"] ?? 0;
  const breakdown = {
    effective_capacity: values["effective_capacity"] ?? 0,
    capacity_gap: values["capacity_gap"] ?? 0,
    new_capacity: values["new_capacity"] ?? 0,
    additional_throughput: values["additional_throughput"] ?? 0,
    annual_benefit: values["annual_benefit"] ?? 0,
    roi: values["roi"] ?? 0,
    payback_period_years: values["payback_period_years"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Quality Loss (units/hour)","Maintenance Loss (units/hour)","Demand Loss (units/hour)"];
  const suggestedActions: string[] = ["Increase Quality Yield","Reduce Planned Maintenance Downtime","Consider Alternative Investment","Validate Bottleneck Identification"];
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


export interface Bottleneck_investment_prioritizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { effective_capacity: number; capacity_gap: number; new_capacity: number; additional_throughput: number; annual_benefit: number; roi: number; payback_period_years: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
