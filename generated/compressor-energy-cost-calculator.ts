// Auto-generated from compressor-energy-cost-calculator-schema.json
import * as z from 'zod';

export interface Compressor_energy_cost_calculatorInput {
  compressor_power_rating: number;
  motor_efficiency: number;
  compressor_type: string;
  operating_hours_per_year: number;
  load_factor: number;
  electricity_cost_per_kwh: number;
  leakage_percentage: number;
  pressure_setpoint: number;
  ambient_temperature: number;
  has_vsd: boolean;
  maintenance_quality: string;
}

export const Compressor_energy_cost_calculatorInputSchema = z.object({
  compressor_power_rating: z.number().min(1).max(5000).default(75),
  motor_efficiency: z.number().min(70).max(99).default(92),
  compressor_type: z.enum(['reciprocating', 'rotary_screw', 'centrifugal', 'scroll']).default('rotary_screw'),
  operating_hours_per_year: z.number().min(100).max(8760).default(8000),
  load_factor: z.number().min(10).max(100).default(70),
  electricity_cost_per_kwh: z.number().min(0.01).max(0.5).default(0.12),
  leakage_percentage: z.number().min(0).max(50).default(20),
  pressure_setpoint: z.number().min(2).max(15).default(7),
  ambient_temperature: z.number().min(-10).max(50).default(25),
  has_vsd: z.boolean().default(false),
  maintenance_quality: z.enum(['poor', 'standard', 'excellent']).default('standard'),
});

function evaluateAllFormulas(input: Compressor_energy_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.compressor_power_rating / (input.motor_efficiency / 100); results["actual_power_input"] = Number.isFinite(v) ? v : 0; } catch { results["actual_power_input"] = 0; }
  try { const v = (results["actual_power_input"] ?? 0) * input.operating_hours_per_year * (input.load_factor / 100); results["annual_energy_consumption"] = Number.isFinite(v) ? v : 0; } catch { results["annual_energy_consumption"] = 0; }
  try { const v = (results["annual_energy_consumption"] ?? 0) * (input.leakage_percentage / 100); results["leakage_energy_loss"] = Number.isFinite(v) ? v : 0; } catch { results["leakage_energy_loss"] = 0; }
  try { const v = 1 + ((input.pressure_setpoint - 6) * 0.01 / 0.1); results["pressure_penalty_factor"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_penalty_factor"] = 0; }
  try { const v = 1 + ((input.ambient_temperature - 20) * 0.005); results["temperature_correction_factor"] = Number.isFinite(v) ? v : 0; } catch { results["temperature_correction_factor"] = 0; }
  try { const v = input.has_vsd ? 0.85 : 1.0; results["vsd_efficiency_factor"] = Number.isFinite(v) ? v : 0; } catch { results["vsd_efficiency_factor"] = 0; }
  try { const v = (input.maintenance_quality === 'poor' ? 1.15 : (input.maintenance_quality === 'standard' ? 1.05 : (input.maintenance_quality === 'excellent' ? 1.0 : 0))); results["maintenance_penalty_factor"] = Number.isFinite(v) ? v : 0; } catch { results["maintenance_penalty_factor"] = 0; }
  try { const v = (results["annual_energy_consumption"] ?? 0) * (results["pressure_penalty_factor"] ?? 0) * (results["temperature_correction_factor"] ?? 0) * (results["vsd_efficiency_factor"] ?? 0) * (results["maintenance_penalty_factor"] ?? 0); results["adjusted_annual_energy"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_annual_energy"] = 0; }
  try { const v = (results["adjusted_annual_energy"] ?? 0) * input.electricity_cost_per_kwh; results["total_annual_energy_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_energy_cost"] = 0; }
  return results;
}


export function calculateCompressor_energy_cost_calculator(input: Compressor_energy_cost_calculatorInput): Compressor_energy_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_energy_cost"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Leakage","Pressure Drop Across Filters/Dryers","Inadequate Maintenance","System Oversizing","Heat of Compression Not Recovered"];
  const suggestedActions: string[] = ["Implement a leak detection and repair program. Target: reduce leakage to <10%.","Reduce system pressure setpoint by 1 bar if possible. Each 1 bar reduction saves ~7% energy.","Install VSD on compressor if load varies >30%. Expected savings 15-35%.","Upgrade maintenance to predictive (IoT-based). Replace filters, check belts, lubricate.","Install heat recovery system to capture waste heat for building heating or preheat."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-compressor optimization","Real-time monitoring integration","Custom reporting dashboard","API access for CMMS integration"],
  };
}


export interface Compressor_energy_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
