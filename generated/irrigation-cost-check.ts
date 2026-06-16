// Auto-generated from irrigation-cost-check-schema.json
import * as z from 'zod';

export interface Irrigation_cost_checkInput {
  water_volume: number;
  water_cost_per_m3: number;
  energy_cost_per_kwh: number;
  pump_efficiency: number;
  distribution_losses: number;
  labor_hours_per_year: number;
  labor_rate: number;
  maintenance_cost: number;
  irrigated_area: number;
  crop_value_per_ha: number;
  system_type: string;
  water_source: string;
  has_automation: boolean;
}

export const Irrigation_cost_checkInputSchema = z.object({
  water_volume: z.number().min(0).max(1000000).default(10000),
  water_cost_per_m3: z.number().min(0).max(10).default(0.5),
  energy_cost_per_kwh: z.number().min(0).max(1).default(0.12),
  pump_efficiency: z.number().min(10).max(100).default(70),
  distribution_losses: z.number().min(0).max(50).default(15),
  labor_hours_per_year: z.number().min(0).max(10000).default(500),
  labor_rate: z.number().min(0).max(100).default(25),
  maintenance_cost: z.number().min(0).max(100000).default(2000),
  irrigated_area: z.number().min(0.1).max(10000).default(50),
  crop_value_per_ha: z.number().min(0).max(50000).default(3000),
  system_type: z.enum(['Drip', 'Sprinkler', 'Flood', 'Center pivot', 'Subsurface drip']).default('Sprinkler'),
  water_source: z.enum(['Groundwater', 'Surface water', 'Municipal', 'Recycled water']).default('Groundwater'),
  has_automation: z.boolean().default(false),
});

function evaluateAllFormulas(input: Irrigation_cost_checkInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.water_volume * (1 - input.distribution_losses / 100); results["effective_water_volume"] = Number.isFinite(v) ? v : 0; } catch { results["effective_water_volume"] = 0; }
  try { const v = input.water_volume * input.water_cost_per_m3; results["water_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["water_cost_total"] = 0; }
  try { const v = input.water_volume * input.energy_cost_per_kwh * (100 / input.pump_efficiency); results["energy_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["energy_cost_total"] = 0; }
  try { const v = input.labor_hours_per_year * input.labor_rate; results["labor_cost_total"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost_total"] = 0; }
  try { const v = (results["water_cost_total"] ?? 0) + (results["energy_cost_total"] ?? 0) + (results["labor_cost_total"] ?? 0) + input.maintenance_cost; results["total_operating_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_operating_cost"] = 0; }
  try { const v = (results["total_operating_cost"] ?? 0) / (results["effective_water_volume"] ?? 0); results["cost_per_effective_m3"] = Number.isFinite(v) ? v : 0; } catch { results["cost_per_effective_m3"] = 0; }
  try { const v = (results["total_operating_cost"] ?? 0) / input.irrigated_area; results["irrigation_cost_per_ha"] = Number.isFinite(v) ? v : 0; } catch { results["irrigation_cost_per_ha"] = 0; }
  try { const v = (results["total_operating_cost"] ?? 0) / (input.irrigated_area * input.crop_value_per_ha); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateIrrigation_cost_check(input: Irrigation_cost_checkInput): Irrigation_cost_checkOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["irrigation_cost_ratio"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    water_cost_total: values["water_cost_total"] ?? 0,
    energy_cost_total: values["energy_cost_total"] ?? 0,
    labor_cost_total: values["labor_cost_total"] ?? 0,
    maintenance_cost: values["maintenance_cost"] ?? 0,
    total_operating_cost: values["total_operating_cost"] ?? 0,
    cost_per_effective_m3: values["cost_per_effective_m3"] ?? 0,
    irrigation_cost_per_ha: values["irrigation_cost_per_ha"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Distribution losses impact","Pump inefficiency impact","Labor inefficiency impact"];
  const suggestedActions: string[] = ["Implement leak detection and repair program to reduce distribution losses by 5%.","Replace pump with high-efficiency model (target 85% efficiency).","Install soil moisture sensors and automated scheduling to reduce water use by 15% and labor by 40%.","Convert from sprinkler to drip irrigation to improve application efficiency by 20%."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-site comparison"],
  };
}


export interface Irrigation_cost_checkOutput {
  totalWasteCost: number;
  breakdown: { water_cost_total: number; energy_cost_total: number; labor_cost_total: number; maintenance_cost: number; total_operating_cost: number; cost_per_effective_m3: number; irrigation_cost_per_ha: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
