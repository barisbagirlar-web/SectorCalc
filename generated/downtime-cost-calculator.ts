// Auto-generated from downtime-cost-calculator-schema.json
import * as z from 'zod';

export interface Downtime_cost_calculatorInput {
  planned_production_rate: number;
  downtime_duration: number;
  revenue_per_unit: number;
  direct_labor_cost_per_hour: number;
  energy_cost_per_hour: number;
  scrap_rate_during_downtime: number;
  recovery_time_factor: number;
  shift_type: string;
  include_quality_loss: boolean;
}

export const Downtime_cost_calculatorInputSchema = z.object({
  planned_production_rate: z.number().min(0).max(10000).default(100),
  downtime_duration: z.number().min(0).max(168).default(2),
  revenue_per_unit: z.number().min(0).max(100000).default(50),
  direct_labor_cost_per_hour: z.number().min(0).max(500).default(30),
  energy_cost_per_hour: z.number().min(0).max(1000).default(15),
  scrap_rate_during_downtime: z.number().min(0).max(100).default(5),
  recovery_time_factor: z.number().min(0).max(2).default(0.3),
  shift_type: z.enum(['day', 'night', 'weekend']).default('day'),
  include_quality_loss: z.boolean().default(true),
});

function evaluateAllFormulas(input: Downtime_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.planned_production_rate * input.downtime_duration; results["lost_production_units"] = Number.isFinite(v) ? v : 0; } catch { results["lost_production_units"] = 0; }
  try { const v = (results["lost_production_units"] ?? 0) * input.revenue_per_unit; results["lost_revenue"] = Number.isFinite(v) ? v : 0; } catch { results["lost_revenue"] = 0; }
  try { const v = input.direct_labor_cost_per_hour * input.downtime_duration * ((input.shift_type === 'night' ? 1.15 : (input.shift_type === 'weekend' ? 1.5 : 1.0))); results["labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost"] = 0; }
  try { const v = input.energy_cost_per_hour * input.downtime_duration; results["energy_cost"] = Number.isFinite(v) ? v : 0; } catch { results["energy_cost"] = 0; }
  try { const v = ((input.include_quality_loss = true) ? ((lost_production_units * (input.scrap_rate_during_downtime / 100) * input.revenue_per_unit * 0.5)) : (0)); results["quality_loss_cost"] = Number.isFinite(v) ? v : 0; } catch { results["quality_loss_cost"] = 0; }
  try { const v = (results["lost_revenue"] ?? 0) * input.recovery_time_factor; results["recovery_cost"] = Number.isFinite(v) ? v : 0; } catch { results["recovery_cost"] = 0; }
  try { const v = (results["lost_revenue"] ?? 0) + (results["labor_cost"] ?? 0) + (results["energy_cost"] ?? 0) + (results["quality_loss_cost"] ?? 0) + (results["recovery_cost"] ?? 0); results["total_downtime_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_downtime_cost"] = 0; }
  return results;
}


export function calculateDowntime_cost_calculator(input: Downtime_cost_calculatorInput): Downtime_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_downtime_cost"] ?? 0;
  const breakdown = {
    lost_revenue: values["lost_revenue"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    energy_cost: values["energy_cost"] ?? 0,
    quality_loss_cost: values["quality_loss_cost"] ?? 0,
    recovery_cost: values["recovery_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Lost Throughput Ratio","Cost per Downtime Hour","Opportunity Cost (Lost Profit)"];
  const suggestedActions: string[] = ["Implement TPM (Total Productive Maintenance)","Standardize Restart Procedures","Install Real-Time Monitoring","Cross-Train Operators"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Custom threshold alerts"],
  };
}


export interface Downtime_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { lost_revenue: number; labor_cost: number; energy_cost: number; quality_loss_cost: number; recovery_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
