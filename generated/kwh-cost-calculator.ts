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
  operating_hours: number;
  tariff_type: string;
  include_demand_charge: boolean;
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
  operating_hours: z.number().min(0).max(744).default(720),
  tariff_type: z.enum(['Time-of-Use', 'Flat Rate', 'Tiered', 'Real-Time Pricing']).default('Flat Rate'),
  include_demand_charge: z.boolean().default(true),
});

function evaluateAllFormulas(input: Kwh_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["adjusted_energy_kwh"] = input.energy_consumption_kwh / (input.system_efficiency / 100); } catch { results["adjusted_energy_kwh"] = 0; }
  try { results["energy_cost"] = (results["adjusted_energy_kwh"] ?? 0) * input.energy_rate_per_kwh; } catch { results["energy_cost"] = 0; }
  try { results["demand_cost"] = ((input.include_demand_charge) ? (input.peak_demand_kw * input.demand_rate_per_kw) : (0)); } catch { results["demand_cost"] = 0; }
  try { results["pf_penalty_cost"] = ((input.power_factor < input.pf_penalty_threshold) ? ((input.pf_penalty_threshold - input.power_factor) * input.peak_demand_kw * input.pf_penalty_rate) : (0)); } catch { results["pf_penalty_cost"] = 0; }
  try { results["load_factor"] = input.energy_consumption_kwh / (input.peak_demand_kw * input.operating_hours); } catch { results["load_factor"] = 0; }
  try { results["total_cost_before_tax"] = (results["energy_cost"] ?? 0) + (results["demand_cost"] ?? 0) + (results["pf_penalty_cost"] ?? 0); } catch { results["total_cost_before_tax"] = 0; }
  try { results["total_cost_with_tax"] = (results["total_cost_before_tax"] ?? 0) * 1.08; } catch { results["total_cost_with_tax"] = 0; }
  return results;
}


export function calculateKwh_cost_calculator(input: Kwh_cost_calculatorInput): Kwh_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost"] ?? 0;
  const breakdown = {
    energy_cost: values["energy_cost"] ?? 0,
    demand_cost: values["demand_cost"] ?? 0,
    pf_penalty_cost: values["pf_penalty_cost"] ?? 0,
    load_factor: values["load_factor"] ?? 0,
    adjusted_energy_kwh: values["adjusted_energy_kwh"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Transformer Losses","Cabling Losses","Motor Inefficiency"];
  const suggestedActions: string[] = ["Install Power Factor Correction Capacitors","Implement Demand-Side Management","Upgrade to High-Efficiency Equipment","Conduct ISO 50001 Energy Audit"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-site comparison","API integration"],
  };
}


export interface Kwh_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { energy_cost: number; demand_cost: number; pf_penalty_cost: number; load_factor: number; adjusted_energy_kwh: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
