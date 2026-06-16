// Auto-generated from energy-consumption-cost-report-schema.json
import * as z from 'zod';

export interface Energy_consumption_cost_reportInput {
  total_energy_kwh: number;
  peak_demand_kw: number;
  tariff_rate_per_kwh: number;
  demand_charge_per_kw: number;
  production_units: number;
  facility_type: string;
  include_renewable_offset: boolean;
  renewable_kwh: number;
  co2_emission_factor: number;
}

export const Energy_consumption_cost_reportInputSchema = z.object({
  total_energy_kwh: z.number().min(0).max(100000000).default(100000),
  peak_demand_kw: z.number().min(0).max(100000).default(500),
  tariff_rate_per_kwh: z.number().min(0).max(10).default(0.12),
  demand_charge_per_kw: z.number().min(0).max(100).default(10),
  production_units: z.number().min(0).max(100000000).default(50000),
  facility_type: z.enum(['manufacturing', 'warehouse', 'office', 'data_center', 'retail']).default('manufacturing'),
  include_renewable_offset: z.boolean().default(false),
  renewable_kwh: z.number().min(0).max(100000000).default(0),
  co2_emission_factor: z.number().min(0).max(2).default(0.5),
});

function evaluateAllFormulas(input: Energy_consumption_cost_reportInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_energy_kwh - (input.include_renewable_offset ? input.renewable_kwh : 0); results["net_energy_kwh"] = Number.isFinite(v) ? v : 0; } catch { results["net_energy_kwh"] = 0; }
  try { const v = (results["net_energy_kwh"] ?? 0) * input.tariff_rate_per_kwh; results["energy_cost"] = Number.isFinite(v) ? v : 0; } catch { results["energy_cost"] = 0; }
  try { const v = input.peak_demand_kw * input.demand_charge_per_kw; results["demand_cost"] = Number.isFinite(v) ? v : 0; } catch { results["demand_cost"] = 0; }
  try { const v = (results["energy_cost"] ?? 0) + (results["demand_cost"] ?? 0); results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = input.total_energy_kwh / input.production_units; results["energy_intensity_kwh_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["energy_intensity_kwh_per_unit"] = 0; }
  try { const v = (results["total_cost"] ?? 0) / input.production_units; results["cost_per_unit"] = Number.isFinite(v) ? v : 0; } catch { results["cost_per_unit"] = 0; }
  try { const v = (results["net_energy_kwh"] ?? 0) * input.co2_emission_factor; results["co2_emissions"] = Number.isFinite(v) ? v : 0; } catch { results["co2_emissions"] = 0; }
  return results;
}


export function calculateEnergy_consumption_cost_report(input: Energy_consumption_cost_reportInput): Energy_consumption_cost_reportOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_cost"] ?? 0;
  const breakdown = {
    energy_cost: values["energy_cost"] ?? 0,
    demand_cost: values["demand_cost"] ?? 0,
    energy_intensity: values["energy_intensity"] ?? 0,
    cost_per_unit: values["cost_per_unit"] ?? 0,
    co2_emissions: values["co2_emissions"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Peak Demand","Low Production Efficiency","Renewable Underutilization"];
  const suggestedActions: string[] = ["Implement Peak Shaving","Conduct Energy Audit","Expand Renewable Generation","Apply Lean Energy Management"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Anomaly detection alerts"],
  };
}


export interface Energy_consumption_cost_reportOutput {
  totalWasteCost: number;
  breakdown: { energy_cost: number; demand_cost: number; energy_intensity: number; cost_per_unit: number; co2_emissions: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
