// Auto-generated from compressor-leak-cost-calculator-schema.json
import * as z from 'zod';

export interface Compressor_leak_cost_calculatorInput {
  system_pressure: number;
  leak_diameter: number;
  number_of_leaks: number;
  operating_hours: number;
  electricity_cost: number;
  compressor_efficiency: number;
  leak_type: string;
  include_maintenance_cost: boolean;
}

export const Compressor_leak_cost_calculatorInputSchema = z.object({
  system_pressure: z.number().min(60).max(200).default(100),
  leak_diameter: z.number().min(0.01).max(1).default(0.125),
  number_of_leaks: z.number().min(1).max(1000).default(10),
  operating_hours: z.number().min(1000).max(8760).default(8760),
  electricity_cost: z.number().min(0.02).max(0.5).default(0.1),
  compressor_efficiency: z.number().min(50).max(95).default(75),
  leak_type: z.enum(['Round orifice', 'Crack', 'Threaded fitting']).default('Round orifice'),
  include_maintenance_cost: z.boolean().default(true),
});

function evaluateAllFormulas(input: Compressor_leak_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = C_d * A * Math.sqrt( (2 * (P_sys + 14.7) * 144) / (R * T) ); results["leak_flow_rate"] = Number.isFinite(v) ? v : 0; } catch { results["leak_flow_rate"] = 0; }
  try { const v = (results["leak_flow_rate"] ?? 0) * input.number_of_leaks; results["total_leak_flow"] = Number.isFinite(v) ? v : 0; } catch { results["total_leak_flow"] = 0; }
  try { const v = ((results["total_leak_flow"] ?? 0) * 0.746) / (input.compressor_efficiency / 100); results["power_consumption"] = Number.isFinite(v) ? v : 0; } catch { results["power_consumption"] = 0; }
  try { const v = (results["power_consumption"] ?? 0) * input.operating_hours; results["annual_energy"] = Number.isFinite(v) ? v : 0; } catch { results["annual_energy"] = 0; }
  try { const v = (results["annual_energy"] ?? 0) * input.electricity_cost; results["annual_cost"] = Number.isFinite(v) ? v : 0; } catch { results["annual_cost"] = 0; }
  try { const v = input.number_of_leaks * 50; results["maintenance_cost"] = Number.isFinite(v) ? v : 0; } catch { results["maintenance_cost"] = 0; }
  try { const v = (results["annual_cost"] ?? 0) + (input.include_maintenance_cost ? (results["maintenance_cost"] ?? 0) : 0); results["total_annual_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_cost"] = 0; }
  return results;
}


export function calculateCompressor_leak_cost_calculator(input: Compressor_leak_cost_calculatorInput): Compressor_leak_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_cost"] ?? 0;
  const breakdown = {
    energy_cost: values["energy_cost"] ?? 0,
    maintenance_cost: values["maintenance_cost"] ?? 0,
    total_leak_flow: values["total_leak_flow"] ?? 0,
    power_consumption: values["power_consumption"] ?? 0,
    annual_energy: values["annual_energy"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Pressure Drop Effect","Unplanned Maintenance","Production Downtime","Carbon Emissions"];
  const suggestedActions: string[] = ["Conduct Ultrasonic Leak Survey","Prioritize Repairs by Leak Size","Reduce System Pressure","Implement Leak Tagging Program","Optimize Compressor Controls"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom reporting"],
  };
}


export interface Compressor_leak_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { energy_cost: number; maintenance_cost: number; total_leak_flow: number; power_consumption: number; annual_energy: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
