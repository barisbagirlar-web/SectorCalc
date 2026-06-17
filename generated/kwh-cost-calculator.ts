// @ts-nocheck
// Auto-generated from kwh-cost-calculator-schema.json
import * as z from 'zod';

export interface Kwh_cost_calculatorInput {
  energy_consumption_kwh: number;
  peak_demand_kw: number;
  energy_rate_per_kwh: number;
  demand_rate_per_kw: number;
  power_factor: number;
  pf_penalty_threshold: number;
  pf_penalty_rate: number;
  system_efficiency: number;
}

export const Kwh_cost_calculatorInputSchema = z.object({
  energy_consumption_kwh: z.number().min(0).max(100000000).default(10000),
  peak_demand_kw: z.number().min(0).max(100000).default(500),
  energy_rate_per_kwh: z.number().min(0.01).max(1).default(0.12),
  demand_rate_per_kw: z.number().min(0).max(100).default(15),
  power_factor: z.number().min(0.5).max(1).default(0.85),
  pf_penalty_threshold: z.number().min(0.8).max(1).default(0.9),
  pf_penalty_rate: z.number().min(0).max(10).default(0.5),
  system_efficiency: z.number().min(50).max(100).default(95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kwh_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.energy_consumption_kwh + input.peak_demand_kw + input.energy_rate_per_kwh; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.energy_consumption_kwh + input.peak_demand_kw + input.energy_rate_per_kwh; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKwh_cost_calculator(input: Kwh_cost_calculatorInput): Kwh_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-site comparison","API integration"],
  };
}


export interface Kwh_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
