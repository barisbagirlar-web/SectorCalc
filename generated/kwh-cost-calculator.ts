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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kwh_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.energy_consumption_kwh * input.peak_demand_kw * (input.energy_rate_per_kwh / 100) * (input.demand_rate_per_kw / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.energy_consumption_kwh * input.peak_demand_kw * (input.energy_rate_per_kwh / 100) * (input.demand_rate_per_kw / 100) * (input.power_factor * input.pf_penalty_threshold * (input.pf_penalty_rate / 100) * (input.system_efficiency / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.power_factor * input.pf_penalty_threshold * (input.pf_penalty_rate / 100) * (input.system_efficiency / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKwh_cost_calculator(input: Kwh_cost_calculatorInput): Kwh_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
