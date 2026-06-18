// @ts-nocheck
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
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Takt_time_flexibility_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.available_work_time_seconds * input.customer_demand_per_shift * input.cycle_time_seconds * input.changeover_time_minutes; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.available_work_time_seconds * input.customer_demand_per_shift * input.cycle_time_seconds * input.changeover_time_minutes * (input.batch_size * input.labor_cost_per_hour * (input.overhead_rate_percent / 100) * input.demand_variability_coefficient); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.batch_size * input.labor_cost_per_hour * (input.overhead_rate_percent / 100) * input.demand_variability_coefficient; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTakt_time_flexibility_cost_calculator(input: Takt_time_flexibility_cost_calculatorInput): Takt_time_flexibility_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
