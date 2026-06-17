// @ts-nocheck
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
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Downtime_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.planned_production_rate + input.downtime_duration + input.revenue_per_unit; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.planned_production_rate + input.downtime_duration + input.revenue_per_unit; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDowntime_cost_calculator(input: Downtime_cost_calculatorInput): Downtime_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Custom threshold alerts"],
  };
}


export interface Downtime_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
