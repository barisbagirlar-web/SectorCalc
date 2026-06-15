// Auto-generated from thermal-conductivity-calculator-schema.json
import * as z from 'zod';

export interface Thermal_conductivity_calculatorInput {
  material_type: string;
  temperature_k: number;
  thickness_m: number;
  cross_section_area_m2: number;
  heat_flow_w: number;
  temperature_delta_k: number;
  moisture_content_pct: number;
  aging_factor: number;
  measurement_confidence: string;
}

export const Thermal_conductivity_calculatorInputSchema = z.object({
  material_type: z.enum(['generic_solid', 'insulation_foam', 'metal_alloy', 'ceramic', 'composite', 'fluid_gas', 'fluid_liquid']).default('generic_solid'),
  temperature_k: z.number().min(100).max(2000).default(300),
  thickness_m: z.number().min(0.001).max(1).default(0.05),
  cross_section_area_m2: z.number().min(0.0001).max(100).default(1),
  heat_flow_w: z.number().min(0.1).max(100000).default(100),
  temperature_delta_k: z.number().min(0.1).max(500).default(50),
  moisture_content_pct: z.number().min(0).max(100).default(0),
  aging_factor: z.number().min(0.5).max(2).default(1),
  measurement_confidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

function evaluateAllFormulas(input: Thermal_conductivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["base_conductivity"] = f(input.material_type, input.temperature_k); } catch { results["base_conductivity"] = 0; }
  try { results["moisture_correction"] = 1 + 0.02 * input.moisture_content_pct + 0.0005 * input.moisture_content_pct**2; } catch { results["moisture_correction"] = 0; }
  try { results["aging_correction"] = input.aging_factor; } catch { results["aging_correction"] = 0; }
  try { results["effective_conductivity"] = k_base * f_moisture * f_aging; } catch { results["effective_conductivity"] = 0; }
  try { results["thermal_resistance"] = input.thickness_m / k_effective; } catch { results["thermal_resistance"] = 0; }
  try { results["heat_flux"] = k_effective * input.temperature_delta_k / input.thickness_m; } catch { results["heat_flux"] = 0; }
  try { results["thermal_efficiency"] = (input.heat_flow_w / (input.cross_section_area_m2 * q)) * 100; } catch { results["thermal_efficiency"] = 0; }
  return results;
}


export function calculateThermal_conductivity_calculator(input: Thermal_conductivity_calculatorInput): Thermal_conductivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["k_effective"] ?? 0;
  const breakdown = {
    k_base: values["k_base"] ?? 0,
    f_moisture: values["f_moisture"] ?? 0,
    f_aging: values["f_aging"] ?? 0,
    r_value: values["r_value"] ?? 0,
    q: values["q"] ?? 0,
    eta_thermal: values["eta_thermal"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Moisture Impact on Conductivity","Aging Impact on Conductivity","Temperature Nonlinearity Loss"];
  const suggestedActions: string[] = ["Implement moisture barrier or drying process to reduce moisture content below 5%.","Consider material replacement or rejuvenation treatment to restore thermal performance.","Increase material thickness by 20% to meet minimum R-value standards (ISO 6946).","Recalibrate heat flux sensors and thermocouples. Perform Gage R&R study per Six Sigma."];
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-layer simulation","Custom material database"],
  };
}


export interface Thermal_conductivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: { k_base: number; f_moisture: number; f_aging: number; r_value: number; q: number; eta_thermal: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
