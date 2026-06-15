// Auto-generated from hvac-capacity-optimizer-schema.json
import * as z from 'zod';

export interface Hvac_capacity_optimizerInput {
  cooling_load: number;
  heating_load: number;
  system_type: string;
  ambient_temperature: number;
  relative_humidity: number;
  efficiency_ratio: number;
  airflow_rate: number;
  duct_leakage_factor: number;
  occupancy_density: number;
  is_preventive_maintenance_active: boolean;
}

export const Hvac_capacity_optimizerInputSchema = z.object({
  cooling_load: z.number().min(0).max(10000).default(100),
  heating_load: z.number().min(0).max(10000).default(80),
  system_type: z.enum(['VAV', 'CAV', 'VRF', 'Chilled Beam', 'Heat Pump']).default('VAV'),
  ambient_temperature: z.number().min(-20).max(55).default(35),
  relative_humidity: z.number().min(0).max(100).default(50),
  efficiency_ratio: z.number().min(1).max(7).default(3.5),
  airflow_rate: z.number().min(0.1).max(50).default(2.5),
  duct_leakage_factor: z.number().min(0).max(30).default(10),
  occupancy_density: z.number().min(0.01).max(0.5).default(0.05),
  is_preventive_maintenance_active: z.boolean().default(true),
});

function evaluateAllFormulas(input: Hvac_capacity_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["total_load"] = Math.max(input.cooling_load, input.heating_load) * (1 + 0.02 * (input.ambient_temperature - 25)) * (1 + 0.1 * (input.occupancy_density / 0.05 - 1)); } catch { results["total_load"] = 0; }
  try { results["effective_airflow"] = input.airflow_rate * (1 - input.duct_leakage_factor / 100); } catch { results["effective_airflow"] = 0; }
  try { results["sensible_capacity"] = (results["effective_airflow"] ?? 0) * 1.2 * 12; } catch { results["sensible_capacity"] = 0; }
  try { results["latent_capacity"] = (results["effective_airflow"] ?? 0) * 1.2 * (0.025 - 0.009) * 2500; } catch { results["latent_capacity"] = 0; }
  try { results["effective_capacity"] = ((results["sensible_capacity"] ?? 0) + (results["latent_capacity"] ?? 0)) * (input.efficiency_ratio / 3.5) * (1 - 0.05 * (1 - input.is_preventive_maintenance_active)) * system_type_factor; } catch { results["effective_capacity"] = 0; }
  try { results["capacity_utilization"] = (results["total_load"] ?? 0) / (results["effective_capacity"] ?? 0); } catch { results["capacity_utilization"] = 0; }
  try { results["energy_performance_index"] = ((results["total_load"] ?? 0) / (results["effective_capacity"] ?? 0)) * (1 / input.efficiency_ratio) * 100; } catch { results["energy_performance_index"] = 0; }
  return results;
}


export function calculateHvac_capacity_optimizer(input: Hvac_capacity_optimizerInput): Hvac_capacity_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["capacity_utilization"] ?? 0;
  const breakdown = {
    total_load: values["total_load"] ?? 0,
    effective_airflow: values["effective_airflow"] ?? 0,
    sensible_capacity: values["sensible_capacity"] ?? 0,
    latent_capacity: values["latent_capacity"] ?? 0,
    effective_capacity: values["effective_capacity"] ?? 0,
    energy_performance_index: values["energy_performance_index"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Duct Leakage Loss","Maintenance Degradation","Humidity Inefficiency"];
  const suggestedActions: string[] = ["Seal ductwork to reduce leakage below 5%, potentially recovering up to 10% capacity.","Implement preventive maintenance schedule to restore 5% capacity and extend equipment life.","Raise cooling setpoint by 1°C or lower heating setpoint by 1°C to reduce load by 5-10%.","Consider upgrading to high-efficiency equipment (EER > 4.0) to reduce energy consumption by 20%.","Adjust humidification/dehumidification settings to maintain 40-60% RH for comfort and efficiency."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-zone comparison","Automated report generation"],
  };
}


export interface Hvac_capacity_optimizerOutput {
  totalWasteCost: number;
  breakdown: { total_load: number; effective_airflow: number; sensible_capacity: number; latent_capacity: number; effective_capacity: number; energy_performance_index: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
