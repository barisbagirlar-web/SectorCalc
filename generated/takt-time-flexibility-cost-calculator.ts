// Auto-generated from takt-time-flexibility-cost-calculator-schema.json
import * as z from 'zod';

export interface Takt_time_flexibility_cost_calculatorInput {
  available_work_time_seconds: number;
  customer_demand_per_shift: number;
  cycle_time_seconds: number;
  changeover_time_minutes: number;
  batch_size: number;
  labor_cost_per_hour: number;
  overhead_rate_percent: number;
  demand_variability_coefficient: number;
  flexibility_strategy: string;
}

export const Takt_time_flexibility_cost_calculatorInputSchema = z.object({
  available_work_time_seconds: z.number().min(0).max(86400).default(28800),
  customer_demand_per_shift: z.number().min(1).max(100000).default(1000),
  cycle_time_seconds: z.number().min(0.1).max(3600).default(30),
  changeover_time_minutes: z.number().min(0).max(480).default(15),
  batch_size: z.number().min(1).max(100000).default(100),
  labor_cost_per_hour: z.number().min(0).max(200).default(25),
  overhead_rate_percent: z.number().min(0).max(500).default(150),
  demand_variability_coefficient: z.number().min(0).max(2).default(0.3),
  flexibility_strategy: z.enum(['mixed_model', 'dedicated_lines', 'chase_demand', 'level_schedule']).default('mixed_model'),
});

function evaluateAllFormulas(input: Takt_time_flexibility_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.available_work_time_seconds / input.customer_demand_per_shift; results["takt_time"] = Number.isFinite(v) ? v : 0; } catch { results["takt_time"] = 0; }
  try { const v = input.cycle_time_seconds / (input.available_work_time_seconds / input.customer_demand_per_shift); results["takt_utilization"] = Number.isFinite(v) ? v : 0; } catch { results["takt_utilization"] = 0; }
  try { const v = (input.changeover_time_minutes / 60) * input.labor_cost_per_hour * (1 + input.overhead_rate_percent / 100) / input.batch_size; results["changeover_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["changeover_cost_per_unit"] = 0; }
  try { const v = input.demand_variability_coefficient * (input.labor_cost_per_hour / 3600) * (input.available_work_time_seconds / input.customer_demand_per_shift) * 0.5; results["demand_uncertainty_penalty"] = Number.isFinite(v) ? v : 0; } catch { results["demand_uncertainty_penalty"] = 0; }
  try { const v = (results["changeover_cost_per_unit"] ?? 0) + (results["demand_uncertainty_penalty"] ?? 0); results["flexibility_cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["flexibility_cost_per_unit"] = 0; }
  try { const v = (results["flexibility_cost_per_unit"] ?? 0) * input.customer_demand_per_shift; results["total_flexibility_cost_per_shift"] = Number.isFinite(v) ? v : 0; } catch { results["total_flexibility_cost_per_shift"] = 0; }
  try { const v = ((results["flexibility_cost_per_unit"] ?? 0) / ((input.labor_cost_per_hour / 3600) * input.cycle_time_seconds)) * 100; results["flexibility_cost_index"] = Number.isFinite(v) ? v : 0; } catch { results["flexibility_cost_index"] = 0; }
  return results;
}


export function calculateTakt_time_flexibility_cost_calculator(input: Takt_time_flexibility_cost_calculatorInput): Takt_time_flexibility_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["flexibility_cost_index"] ?? 0;
  const breakdown = {
    takt_time: values["takt_time"] ?? 0,
    takt_utilization: values["takt_utilization"] ?? 0,
    changeover_cost_per_unit: values["changeover_cost_per_unit"] ?? 0,
    demand_uncertainty_penalty: values["demand_uncertainty_penalty"] ?? 0,
    flexibility_cost_per_unit: values["flexibility_cost_per_unit"] ?? 0,
    total_flexibility_cost_per_shift: values["total_flexibility_cost_per_shift"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Changeover Time","High Demand Variability","Low Batch Size Efficiency","Takt Time Mismatch"];
  const suggestedActions: string[] = ["Implement SMED to reduce changeover time","Increase batch size where possible","Apply demand smoothing with customer agreements","Optimize mixed-model sequencing","Introduce capacity buffers (overtime or extra shifts)"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario simulation","Benchmarking against industry standards"],
  };
}


export interface Takt_time_flexibility_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { takt_time: number; takt_utilization: number; changeover_cost_per_unit: number; demand_uncertainty_penalty: number; flexibility_cost_per_unit: number; total_flexibility_cost_per_shift: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
